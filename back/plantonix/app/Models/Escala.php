<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class Escala extends Model
{
    public function scopeAtiva($query)
    {
        return $query->where('status', 'ativa');
    }

    public function getEscala($escalaId, $blocoId = null)
    {
        $query = DB::table('escala_itens as ei')
            ->leftJoin('funcionarios as f', 'f.id', '=', 'ei.funcionario_id')
            ->select(
                'ei.id',
                'ei.escala_id',
                'ei.funcionario_id',
                'f.nome',
                'ei.bloco_id',
                'ei.data',
                'ei.turno',
                'ei.tipo'
            )
            ->where('ei.escala_id', $escalaId);

        // 🔹 filtro opcional por bloco
        if ($blocoId) {
            $query->where('ei.bloco_id', $blocoId);
        }

        $registros = $query->whereNotNull('ei.funcionario_id')->orderBy('ei.data')->get();

        $resultado = [];

        foreach ($registros as $r) {

            $id = $r->funcionario_id;

            if (!isset($resultado[$id])) {
                $resultado[$id] = [
                    'id' => $r->funcionario_id,
                    'nome' => $r->nome,
                    'bloco' => $r->bloco_id,
                    'escala' => $r->escala_id,
                    'dias' => []
                ];
            }

            $resultado[$id]['dias'][] = [
                'id_item_escala' => $r->id,
                'data' => $r->data,
                'turno' => $r->turno,
                'tipo' => $r->tipo,
            ];
        }

        return array_values($resultado);
    }

    /**
     * Para cada dia do período da escala, compara a quantidade de profissionais
     * realmente alocados (turno ≠ F, tipo = normal) com o mínimo exigido pela
     * regra do bloco (dia útil ou inútil). Retorna apenas os slots que estão
     * abaixo do mínimo — essas deficiências são exibidas como alertas no front.
     *
     * @return array<int, array{data:string, bloco_id:int, bloco_nome:string, turno:string, min_required:int, alocados:int}>
     */
    public function getDeficiencias(int $escalaId, ?int $blocoId): array
    {
        $escala = Escala::find($escalaId);
        if (!$escala) return [];

        $inicio = Carbon::parse($escala->inicio);
        $fim    = Carbon::parse($escala->fim);

        $regraUtil   = Regra::with('blocos')->where('tipo_dia', 'U')->latest()->first();
        $regraInutil = Regra::with('blocos')->where('tipo_dia', 'I')->latest()->first();

        // Conta profissionais realmente alocados por data+bloco+turno
        $query = DB::table('escala_itens')
            ->where('escala_id', $escalaId)
            ->where('tipo', 'normal')
            ->whereNotNull('funcionario_id')
            ->whereNotIn('turno', ['F', 'MT'])
            ->selectRaw('data, bloco_id, turno, COUNT(DISTINCT funcionario_id) as total')
            ->groupBy('data', 'bloco_id', 'turno');

        if ($blocoId) {
            $query->where('bloco_id', $blocoId);
        }

        $contagens = [];
        foreach ($query->get() as $r) {
            $contagens[$r->data . '_' . $r->bloco_id . '_' . $r->turno] = (int) $r->total;
        }

        $deficiencias = [];

        for ($data = $inicio->copy(); $data->lte($fim); $data->addDay()) {
            $isWeekend = $data->isWeekend();
            $regra = $isWeekend ? $regraInutil : $regraUtil;
            if (!$regra) continue;

            foreach ($regra->blocos as $bloco) {
                if ($blocoId && $bloco->id != $blocoId) continue;

                $dataStr = $data->format('Y-m-d');
                $checks  = [
                    'M' => (int) ($bloco->pivot->qtd_manha ?? 0),
                    'T' => (int) ($bloco->pivot->qtd_tarde  ?? 0),
                    'N' => (int) ($bloco->pivot->qtd_noite  ?? 0),
                ];

                foreach ($checks as $turno => $min) {
                    if ($min <= 0) continue;
                    $alocados = $contagens[$dataStr . '_' . $bloco->id . '_' . $turno] ?? 0;
                    if ($alocados < $min) {
                        $deficiencias[] = [
                            'data'         => $dataStr,
                            'bloco_id'     => $bloco->id,
                            'bloco_nome'   => $bloco->nome,
                            'turno'        => $turno,
                            'min_required' => $min,
                            'alocados'     => $alocados,
                        ];
                    }
                }
            }
        }

        return $deficiencias;
    }

    public function gerarEscalaMes($raio = ['inicio' => '2026-04-16', 'fim' => '2026-05-15'])
    {
        Escala::where('status', 'ativa')
            ->where('inicio', '<=', $raio['fim'])
            ->where('fim', '>=', $raio['inicio'])
            ->update(['status' => 'inativa']);

        $escala = new Escala();
        $escala->inicio = $raio['inicio'];
        $escala->fim = $raio['fim'];
        $escala->gerado_por = \Illuminate\Support\Facades\Auth::id();
        $escala->save();

        $inicio = Carbon::parse($raio['inicio']);
        $fim = Carbon::parse($raio['fim']);

        $regraDiaUtil = Regra::with('blocos')
            ->where('tipo_dia', 'U')
            ->latest()
            ->first();

        $regraDiaInutil = Regra::with('blocos')
            ->where('tipo_dia', 'I')
            ->latest()
            ->first();

        // Pré-carrega todos os funcionários para garantir que os dias de folga
        // sejam gerados mesmo para quem nunca for alocado no período
        $todosFunc = Funcionario::with('blocos')->where('faz_plantao', true)->get();

        $resultado = [];
        foreach ($todosFunc as $f) {
            $blocoPreferido = $f->blocos->firstWhere('pivot.ordem', 1);
            if (!$blocoPreferido)
                continue;
            $resultado[$f->id] = [
                'id' => $f->id,
                'nome' => $f->nome,
                'bloco' => $blocoPreferido->id,
                'escala' => $escala->id,
                'dias' => [],
            ];
        }

        // RN002: busca quem trabalhou à noite no último dia da escala anterior
        $noiteAnterior = $this->getNoiteUltimaEscala($raio['inicio']);

        // RN-CONS: carrega quantos dias consecutivos cada funcionário 6x1 terminou
        //          trabalhando no final do período anterior, para não gerar sequências
        //          que cruzem a fronteira entre escalas.
        $diasConsecutivos = $this->getConsecutivosEscalaAnterior($raio['inicio']);

        // RN-DOM: carrega quantos domingos consecutivos cada funcionário 6x1 trabalhou
        //         no final do período anterior, para respeitar o limite de 3 domingos
        //         consecutivos entre escalas.
        $domingoConsecutivos = $this->getDomingoConsecutivosEscalaAnterior($raio['inicio']);

        // Controle de horas semanais por funcionário (reseta a cada semana ISO)
        $horasSemana = [];
        $semanaAtual = null;

        for ($data = $inicio->copy(); $data->lte($fim); $data->addDay()) {

            // Reseta o contador semanal no início de cada semana ISO (segunda-feira)
            $semana = $data->format('o-W');
            if ($semana !== $semanaAtual) {
                $horasSemana = [];
                $semanaAtual = $semana;
            }

            $isWeekend = $data->isWeekend();
            $regra = $isWeekend ? $regraDiaInutil : $regraDiaUtil;

            // RN-FDS / RN-DOM: no fim de semana, redistribui folgas para evitar
            // dias sem cobertura e respeitar o limite de 3 domingos consecutivos.
            $folgasForcadasHoje = [];
            if ($isWeekend && $regraDiaInutil) {
                if ($data->isSaturday()) {
                    // RN-FDS: detecta profissionais 6x1 que esgotariam seus dias
                    // consecutivos todos no mesmo domingo, deixando slots sem cobertura.
                    $folgasForcadasHoje = $this->calcularFolgasSabado(
                        $data->copy(),
                        $diasConsecutivos,
                        $regraDiaInutil,
                        $todosFunc,
                        6 // LIMITE_CONSECUTIVO diário
                    );
                } elseif ($data->isSunday()) {
                    // RN-DOM: aplica regra legal (max 3 domingos consecutivos) e
                    // stagger preventivo para o próximo domingo.
                    $folgasForcadasHoje = $this->calcularFolgasDomingo(
                        $data->copy(),
                        $domingoConsecutivos,
                        $regraDiaInutil,
                        $todosFunc,
                        3 // LIMITE_DOMINGO
                    );
                }
            }

            $escalaDia = $this->gerarEscalaDia($regra, $data->format('Y-m-d'), $noiteAnterior, $horasSemana, $isWeekend, $diasConsecutivos, $folgasForcadasHoje);

            // Atualiza horas semanais com o que foi alocado hoje
            foreach ($escalaDia['escalados'] as $funcId => $horas) {
                $horasSemana[$funcId] = ($horasSemana[$funcId] ?? 0) + $horas;
            }

            // RN-CONS: atualiza dias consecutivos para funcionários 6x1.
            // Quem trabalhou hoje: incrementa. Quem não trabalhou: zera (folga/ausência).
            $trabalharamHoje = array_keys($escalaDia['escalados']);
            foreach ($todosFunc as $f) {
                if ($f->tipo_escala !== '6x1')
                    continue;
                if (in_array($f->id, $trabalharamHoje)) {
                    $diasConsecutivos[$f->id] = ($diasConsecutivos[$f->id] ?? 0) + 1;
                } else {
                    $diasConsecutivos[$f->id] = 0;
                }
            }

            // RN-DOM: atualiza domingos consecutivos para funcionários 6x1.
            // Só atualiza nos domingos; nos demais dias o contador não muda.
            if ($data->isSunday()) {
                foreach ($todosFunc as $f) {
                    if ($f->tipo_escala !== '6x1') continue;
                    if (in_array($f->id, $trabalharamHoje)) {
                        $domingoConsecutivos[$f->id] = ($domingoConsecutivos[$f->id] ?? 0) + 1;
                    } else {
                        $domingoConsecutivos[$f->id] = 0;
                    }
                }
            }

            $noiteHoje = [];

            foreach ($escalaDia['escala'] as $blocoId => $bloco) {

                foreach (['manha' => 'M', 'tarde' => 'T', 'noite' => 'N'] as $periodo => $turno) {

                    foreach ($bloco[$periodo] as $pessoa) {

                        // 🔹 Ignora ausência sem substituto
                        if (is_array($pessoa) && isset($pessoa['ausente'])) {
                            continue;
                        }

                        // 🔹 Trata os dois casos: objeto ou sorteado
                        if (is_array($pessoa)) {
                            $nome = $pessoa['nome'];
                            $id = null;
                        } else {
                            $nome = $pessoa->nome;
                            $id = $pessoa->id;
                        }

                        // RN002: registra quem trabalhou à noite para bloquear no dia seguinte
                        if ($turno === 'N' && $id !== null) {
                            $noiteHoje[] = $id;
                        }

                        if (!isset($resultado[$id])) {
                            $resultado[$id] = [
                                'id' => $id,
                                'nome' => $nome,
                                'bloco' => $blocoId,
                                'escala' => $escala->id,
                                'dias' => []
                            ];
                        }

                        $resultado[$id]['dias'][] = [
                            'data' => $data->format('Y-m-d'),
                            'turno' => $turno
                        ];
                    }
                }
            }

            $noiteAnterior = $noiteHoje;
        }

        // Coleta todas as datas do período para gerar folgas nos dias não trabalhados
        $todasDatas = [];
        for ($d = $inicio->copy(); $d->lte($fim); $d->addDay()) {
            $todasDatas[] = $d->format('Y-m-d');
        }

        foreach ($resultado as &$pessoa) {
            if ($pessoa['id'] === null)
                continue;
            $datasComTurno = array_flip(array_column($pessoa['dias'], 'data'));
            foreach ($todasDatas as $data) {
                if (!isset($datasComTurno[$data])) {
                    $pessoa['dias'][] = ['data' => $data, 'turno' => 'F'];
                }
            }
        }
        unset($pessoa);

        $linhas = [];
        $now = now();

        foreach ($resultado as $pessoa) {
            if ($pessoa['id'] === null)
                continue;

            foreach ($pessoa['dias'] as $dia) {

                $linhas[] = [
                    'escala_id' => $escala->id,
                    'funcionario_id' => $pessoa['id'],
                    'data' => $dia['data'],
                    'turno' => $dia['turno'],
                    'bloco_id' => $pessoa['bloco'],
                    'tipo' => $dia['turno'] === 'F' ? 'folga' : 'normal',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        // 🔥 bulk insert
        DB::table('escala_itens')->insert($linhas);

        return array_values($resultado);
    }

    public function gerarEscalaDia($regra, $data = null, array $noiteAnterior = [], array $horasSemana = [], bool $isWeekend = false, array $diasConsecutivos = [], array $folgasForcadas = [])
    {
        $LIMITE_SEMANAL_6X1 = 36;
        $LIMITE_CONSECUTIVO = 6;

        $funcionarios = Funcionario::with('blocos')
            ->where('faz_plantao', true)
            ->when($data, function ($q) use ($data) {
                $q->whereDoesntHave('afastamentos', function ($af) use ($data) {
                    $af->where('inicio', '<=', $data)->where('fim', '>=', $data);
                });
            })
            ->get();

        // Índice global de dias a partir de uma data de referência fixa.
        // Usar diaDoMes causaria bug na virada de mês: ex. maio tem 31 dias (ímpar)
        // e junho começa no dia 1 (ímpar) — dois dias consecutivos com mesma paridade.
        // O índice global sempre alterna corretamente entre dias consecutivos.
        $dayIndex = (new \DateTime($data ?? 'today'))->diff(new \DateTime('2020-01-01'))->days;
        $diaPar = $dayIndex % 2 === 0;

        $pool = ['M' => [], 'T' => [], 'N' => []];

        foreach ($funcionarios as $f) {
            $blocoPreferido = $f->blocos->firstWhere('pivot.ordem', 1);
            if (!$blocoPreferido)
                continue;

            // 5x2: trabalha apenas de segunda a sexta
            if ($f->tipo_escala === '5x2' && $isWeekend)
                continue;

            // 12x36: divide em dois grupos por paridade do ID do funcionário.
            // Grupo de ID par → trabalha nos dias de índice global par; ímpar → índice ímpar.
            if ($f->tipo_escala === '12x36') {
                $grupoPar = $f->id % 2 === 0;
                if ($grupoPar !== $diaPar)
                    continue;
            }

            // RN-CONS: bloqueia funcionário 6x1 que atingiu o limite de dias consecutivos.
            if ($f->tipo_escala === '6x1' && ($diasConsecutivos[$f->id] ?? 0) >= $LIMITE_CONSECUTIVO) {
                continue;
            }

            // RN-FDS: bloqueia funcionários forçados a descansar hoje (stagger de fim de semana).
            if (in_array($f->id, $folgasForcadas)) {
                continue;
            }

            $entrada = ['funcionario' => $f, 'bloco_id' => $blocoPreferido->id];

            if ($f->turno === 'MT') {
                $pool['M'][] = $entrada;
                $pool['T'][] = $entrada;
            } else {
                $pool[$f->turno][] = $entrada;
            }
        }

        // RN002: remove do turno noturno quem trabalhou na noite anterior
        if (!empty($noiteAnterior)) {
            $pool['N'] = array_values(array_filter($pool['N'], function ($entrada) use ($noiteAnterior) {
                return !in_array($entrada['funcionario']->id, $noiteAnterior);
            }));
        }

        $escala = [];
        $escaladosHoje = []; // IDs já alocados hoje (evita dupla alocação)
        $escalados = [];     // [funcId => horas] acumuladas no dia

        foreach ($regra->blocos as $bloco) {

            $escala[$bloco->id] = [
                'nome' => $bloco->nome,
                'manha' => [],
                'tarde' => [],
                'noite' => [],
            ];

            /**
             * Regras de alocação por tipo de escala:
             *
             * 12x36 — dia sim/dia não (já filtrado na construção do pool).
             *          Sempre alocado quando disponível; sem limite semanal.
             *
             * 5x2   — apenas dias úteis (já filtrado na construção do pool).
             *          Sempre alocado quando disponível; sem limite semanal.
             *
             * 6x1   — trabalha todos os dias úteis; no fim de semana faz
             *          rodízio: seleciona apenas o necessário para atingir
             *          o mínimo, priorizando quem tem menos horas na semana.
             *          Limite de 36 h/semana aplicado.
             */
            $alocar = function (string $turnoKey, int $qtdMinima, int $blocoId) use (&$pool, &$escaladosHoje, &$escalados, $isWeekend, $horasSemana, $LIMITE_SEMANAL_6X1, $dayIndex, $diasConsecutivos): array {

                $candidatos12x36 = [];
                $candidatos6x1 = [];
                $candidatosOther = []; // 5x2 e outros

                foreach ($pool[$turnoKey] as $key => $pessoa) {
                    $funcId = $pessoa['funcionario']->id;
                    $tipoEscala = $pessoa['funcionario']->tipo_escala;

                    if (in_array($funcId, $escaladosHoje))
                        continue;
                    if ($pessoa['bloco_id'] != $blocoId)
                        continue;

                    $horasShift = match ($tipoEscala) {
                        '12x36' => 12,
                        '5x2' => 8,
                        default => 6,
                    };

                    // Limite semanal se aplica apenas a 6x1
                    if ($tipoEscala === '6x1' && ($horasSemana[$funcId] ?? 0) + $horasShift > $LIMITE_SEMANAL_6X1) {
                        continue;
                    }

                    $candidato = [
                        'pessoa' => $pessoa,
                        'horas' => $horasShift,
                        'horasAtuais' => $horasSemana[$funcId] ?? 0,
                        'consecutivos' => $diasConsecutivos[$funcId] ?? 0,
                    ];

                    if ($tipoEscala === '12x36') {
                        $candidatos12x36[$key] = $candidato;
                    } elseif ($tipoEscala === '6x1') {
                        $candidatos6x1[$key] = $candidato;
                    } else {
                        $candidatosOther[$key] = $candidato;
                    }
                }

                if ($isWeekend) {
                    // 12x36 e 5x2: alocação direta (já filtrados por paridade/dia útil)
                    $selecionados = $candidatos12x36 + $candidatosOther;

                    // 6x1: rodízio — preenche apenas o que falta para atingir o mínimo.
                    // Ordenação: quem tem MENOS dias consecutivos trabalha no fim de semana;
                    // quem está chegando no limite fica de folga no sáb/dom (reset natural).
                    $faltam6x1 = max(0, $qtdMinima - count($selecionados));
                    if ($faltam6x1 > 0 && !empty($candidatos6x1)) {
                        uasort($candidatos6x1, function ($a, $b) use ($dayIndex) {
                            // Menos consecutivos → prioridade para trabalhar no fim de semana
                            if ($a['consecutivos'] !== $b['consecutivos']) {
                                return $a['consecutivos'] <=> $b['consecutivos'];
                            }
                            // Desempate: menos horas na semana
                            if ($a['horasAtuais'] !== $b['horasAtuais']) {
                                return $a['horasAtuais'] <=> $b['horasAtuais'];
                            }
                            // Desempate final: hash determinístico
                            $hashA = crc32($a['pessoa']['funcionario']->id . '-' . $dayIndex);
                            $hashB = crc32($b['pessoa']['funcionario']->id . '-' . $dayIndex);
                            return $hashA <=> $hashB;
                        });
                        $selecionados += array_slice($candidatos6x1, 0, $faltam6x1, true);
                    }
                } else {
                    // Dia útil: todos os elegíveis (qtd_* é apenas o mínimo)
                    $selecionados = $candidatos12x36 + $candidatos6x1 + $candidatosOther;
                }

                $alocados = [];
                foreach ($selecionados as $key => $c) {
                    $funcId = $c['pessoa']['funcionario']->id;
                    $alocados[] = $c['pessoa']['funcionario'];
                    $escaladosHoje[] = $funcId;
                    $escalados[$funcId] = ($escalados[$funcId] ?? 0) + $c['horas'];
                    unset($pool[$turnoKey][$key]);
                }

                // Mínimo não atingido: marca as vagas restantes como ausente
                $faltam = $qtdMinima - count($alocados);
                while ($faltam-- > 0) {
                    $alocados[] = ['ausente' => true];
                }

                return $alocados;
            };

            $escala[$bloco->id]['manha'] = $alocar('M', $bloco->pivot->qtd_manha, $bloco->id);
            $escala[$bloco->id]['tarde'] = $alocar('T', $bloco->pivot->qtd_tarde, $bloco->id);
            $escala[$bloco->id]['noite'] = $alocar('N', $bloco->pivot->qtd_noite, $bloco->id);
        }

        // Em dias úteis: funcionários restantes no pool cobrem vagas com ausência
        if (!$isWeekend) {
            $sobrando = [];
            foreach ($pool as $pessoas) {
                foreach ($pessoas as $p) {
                    $funcId = $p['funcionario']->id;
                    if (!in_array($funcId, $escaladosHoje)) {
                        $sobrando[$funcId] = $p['funcionario'];
                    }
                }
            }

            foreach ($escala as &$blocoData) {
                foreach (['manha', 'tarde', 'noite'] as $periodo) {
                    foreach ($blocoData[$periodo] as &$pessoa) {
                        if (is_array($pessoa) && isset($pessoa['ausente']) && !empty($sobrando)) {
                            $funcId = array_key_first($sobrando);
                            $pessoa = $sobrando[$funcId];
                            $escaladosHoje[] = $funcId;
                            unset($sobrando[$funcId]);
                        }
                    }
                    unset($pessoa);
                }
            }
            unset($blocoData);
        }

        return [
            'escala' => $escala,
            'escalados' => $escalados,
            'sobrando' => [],
        ];
    }

    /**
     * RN-CONS: retorna quantos dias consecutivos cada funcionário 6x1 terminou
     * trabalhando no final do período anterior.
     *
     * Percorre as datas do final da escala anterior de trás para frente e conta
     * a sequência ininterrupta de dias trabalhados (turno ≠ 'F').
     * O resultado é usado como ponto de partida do contador de consecutivos na
     * nova escala, evitando que a fronteira entre períodos seja ignorada.
     *
     * @return array<int, int>  [funcionario_id => dias_consecutivos]
     */
    private function getConsecutivosEscalaAnterior(string $inicio): array
    {
        $escalaAnterior = Escala::where('fim', '<', $inicio)
            ->orderBy('fim', 'desc')
            ->where('status', 'ativa')
            ->first();

        if (!$escalaAnterior)
            return [];

        // Busca apenas itens normais (exclui plantões de fim de semana),
        // um registro por funcionário por data, ordenados do mais recente ao mais antigo.
        $itens = DB::table('escala_itens')
            ->where('escala_id', $escalaAnterior->id)
            ->whereNotNull('funcionario_id')
            ->where('tipo', 'normal')
            ->orderBy('data', 'desc')
            ->select('funcionario_id', 'data', 'turno')
            ->get()
            ->groupBy('funcionario_id');

        $consecutivos = [];

        foreach ($itens as $funcId => $registros) {
            // Garante uma entrada por data (a mais recente em caso de duplicata)
            $diasPorData = [];
            foreach ($registros as $r) {
                if (!isset($diasPorData[$r->data])) {
                    $diasPorData[$r->data] = $r->turno;
                }
            }
            krsort($diasPorData); // mais recente primeiro

            $count = 0;
            $dataEsperada = Carbon::parse($escalaAnterior->fim);

            foreach ($diasPorData as $data => $turno) {
                if ($data !== $dataEsperada->format('Y-m-d')) {
                    break; // lacuna de data — sequência interrompida
                }
                if ($turno === 'F') {
                    break; // dia de folga — sequência interrompida
                }
                $count++;
                $dataEsperada->subDay();
            }

            $consecutivos[$funcId] = $count;
        }

        return $consecutivos;
    }

    /**
     * RN-FDS: Antes de processar o sábado, identifica grupos de profissionais 6x1
     * que iriam esgotar seus dias consecutivos TODOS no mesmo domingo, deixando
     * algum bloco/turno sem cobertura.
     *
     * Para cada combinação bloco+turno da regra de fim de semana:
     *  - "quase exaustos"  = funcionários com consecutivos === LIMITE-1
     *    (se trabalharem sábado chegam ao limite e ficam bloqueados no domingo)
     *  - "livres"          = funcionários com consecutivos < LIMITE-1
     *    (disponíveis nos dois dias do fim de semana)
     *
     * Antes de forçar qualquer folga no sábado, o método calcula também a
     * cobertura do próprio sábado e usa essa informação para limitar quantas
     * pessoas podem ser deslocadas, garantindo que NENHUM dia fique com zero
     * cobertura como resultado do stagger.
     *
     * Regra:
     *   numParaDescansar = min(targetX, coberturaSabado - 1, count(quaseExaustos))
     *
     *   onde targetX é:
     *     - ceil(N/2)                se coberturaDomingo === 0  (split igualitário)
     *     - minRequired - cobDomingo  caso contrário              (complementa déficit)
     *
     *   O teto (coberturaSabado - 1) impede que o sábado fique vazio.
     *   Se coberturaSabado ≤ 1, nenhum stagger é possível e a função retorna vazio.
     *
     * Retorna array com os IDs dos funcionários que devem descansar no sábado.
     * No domingo eles estarão com contador zerado e serão incluídos no pool normalmente.
     *
     * @return int[]  funcionario_id[]
     */
    private function calcularFolgasSabado(
        Carbon $sabado,
        array $diasConsecutivos,
        Regra $regraDomingo,
        \Illuminate\Support\Collection $todosFunc,
        int $LIMITE_CONSECUTIVO
    ): array {
        $folgasSabado = []; // IDs sem duplicatas

        $sabadoIndex  = (new \DateTime($sabado->format('Y-m-d')))->diff(new \DateTime('2020-01-01'))->days;
        $domingoIndex = $sabadoIndex + 1;
        $sabadoPar    = $sabadoIndex % 2 === 0;
        $domingoPar   = $domingoIndex % 2 === 0;

        foreach ($regraDomingo->blocos as $bloco) {

            $slotsParaChecar = [
                'M' => (int) ($bloco->pivot->qtd_manha ?? 0),
                'T' => (int) ($bloco->pivot->qtd_tarde  ?? 0),
                'N' => (int) ($bloco->pivot->qtd_noite  ?? 0),
            ];

            foreach ($slotsParaChecar as $turnoKey => $minRequired) {
                if ($minRequired <= 0) continue;

                // Trabalhadores que cobrem este bloco+turno
                // (MT entra nos pools M e T, assim como no gerarEscalaDia)
                $workersNesteSlot = $todosFunc->filter(function ($f) use ($bloco, $turnoKey) {
                    $blocoPreferido = $f->blocos->firstWhere('pivot.ordem', 1);
                    if (!$blocoPreferido || $blocoPreferido->id != $bloco->id) return false;
                    return $f->turno === $turnoKey
                        || ($f->turno === 'MT' && in_array($turnoKey, ['M', 'T']));
                });

                // Separa 6x1 pelo nível de dias consecutivos
                $quaseExaustos = []; // consecutivos === LIMITE-1 → esgotam depois do sábado
                $livres        = []; // consecutivos < LIMITE-1  → disponíveis nos dois dias

                foreach ($workersNesteSlot as $f) {
                    if ($f->tipo_escala !== '6x1') continue;
                    $cons = $diasConsecutivos[$f->id] ?? 0;
                    if ($cons >= $LIMITE_CONSECUTIVO) {
                        // Já bloqueado para os dois dias — não interfere no cálculo
                    } elseif ($cons === $LIMITE_CONSECUTIVO - 1) {
                        $quaseExaustos[] = $f;
                    } else {
                        $livres[] = $f;
                    }
                }

                if (empty($quaseExaustos)) continue; // Nenhum em risco neste slot

                // Conta não-6x1 disponíveis em cada dia (12x36 conforme paridade; 5x2 jamais trabalha no fim de semana)
                $outrosNoSabado = (int) $workersNesteSlot->filter(function ($f) use ($sabadoPar) {
                    if ($f->tipo_escala === '12x36') {
                        return ($f->id % 2 === 0) === $sabadoPar;
                    }
                    return false;
                })->count();

                $outrosNaDomingo = (int) $workersNesteSlot->filter(function ($f) use ($domingoPar) {
                    if ($f->tipo_escala === '12x36') {
                        return ($f->id % 2 === 0) === $domingoPar;
                    }
                    return false;
                })->count();

                // Cobertura estimada SEM stagger
                // Sábado: todos quaseExaustos + livres + 12x36 no turno certo
                // Domingo: quaseExaustos todos exaustos → só livres + 12x36
                $coberturaSabado  = count($quaseExaustos) + count($livres) + $outrosNoSabado;
                $coberturaDomingo = count($livres) + $outrosNaDomingo;

                if ($coberturaDomingo >= $minRequired) continue; // Sem problema

                // Quantidade alvo de quaseExaustos a realocar para descansar no sábado
                if ($coberturaDomingo === 0) {
                    // Risco de ZERO no domingo: split igualitário
                    $targetX = (int) ceil(count($quaseExaustos) / 2);
                } else {
                    // Abaixo do mínimo: complementa apenas o déficit
                    $targetX = $minRequired - $coberturaDomingo;
                }

                // Restrição crítica: nunca reduzir o sábado a zero.
                // O teto é (coberturaSabado - 1): mantém ao menos 1 pessoa trabalhando sábado.
                // Se o sábado já tem ≤ 1 disponível, não há margem para stagger — pulamos.
                $maxX = max(0, $coberturaSabado - 1);

                $numParaDescansar = min($targetX, $maxX, count($quaseExaustos));

                if ($numParaDescansar <= 0) continue; // Sem margem — stagger pioraria o sábado

                // Adiciona ao array evitando duplicatas (MT aparece em M e T)
                $selecionados = array_slice($quaseExaustos, 0, $numParaDescansar);
                foreach ($selecionados as $f) {
                    if (!in_array($f->id, $folgasSabado)) {
                        $folgasSabado[] = $f->id;
                    }
                }
            }
        }

        return $folgasSabado;
    }

    /**
     * RN-DOM: Antes de processar o domingo, garante duas coisas:
     *
     * 1. REGRA LEGAL (hard rule): funcionários 6x1 com ≥ LIMITE_DOMINGO domingos
     *    consecutivos trabalhados OBRIGATORIAMENTE descansam neste domingo.
     *    A legislação brasileira exige folga coincidente com o domingo ao menos
     *    uma vez a cada três semanas (CLT art. 67 parágrafo único).
     *
     * 2. STAGGER PREVENTIVO (soft rule): funcionários com LIMITE_DOMINGO-1 domingos
     *    consecutivos ("quase esgotados") serão bloqueados no PRÓXIMO domingo caso
     *    trabalhem hoje. Se isso deixaria o próximo domingo com cobertura abaixo do
     *    mínimo, redistribui preemptivamente o descanso para ESTE domingo.
     *    Lógica análoga à calcularFolgasSabado, mas no eixo semana-a-semana.
     *
     * Restrição: nunca reduzir o próprio domingo a zero cobertura.
     *   numParaDescansar = min(targetX, coberturaHoje - 1, count(quaseEsgotados))
     *
     *   targetX:
     *     - ceil(N/2)                  se coberturaProximo === 0  (split igualitário)
     *     - minRequired - cobProximo    caso contrário             (complementa déficit)
     *
     * @return int[]  funcionario_id[] que devem descansar neste domingo
     */
    private function calcularFolgasDomingo(
        Carbon $domingo,
        array $domingoConsecutivos,
        Regra $regra,
        \Illuminate\Support\Collection $todosFunc,
        int $LIMITE_DOMINGO
    ): array {
        $folgasDomingo = [];

        $domingoIndex    = (new \DateTime($domingo->format('Y-m-d')))->diff(new \DateTime('2020-01-01'))->days;
        $proximoDomIndex = $domingoIndex + 7;
        $domingoPar      = $domingoIndex % 2 === 0;
        $proximoDomPar   = $proximoDomIndex % 2 === 0;

        foreach ($regra->blocos as $bloco) {

            $slotsParaChecar = [
                'M' => (int) ($bloco->pivot->qtd_manha ?? 0),
                'T' => (int) ($bloco->pivot->qtd_tarde  ?? 0),
                'N' => (int) ($bloco->pivot->qtd_noite  ?? 0),
            ];

            foreach ($slotsParaChecar as $turnoKey => $minRequired) {
                if ($minRequired <= 0) continue;

                $workersNesteSlot = $todosFunc->filter(function ($f) use ($bloco, $turnoKey) {
                    $blocoPreferido = $f->blocos->firstWhere('pivot.ordem', 1);
                    if (!$blocoPreferido || $blocoPreferido->id != $bloco->id) return false;
                    return $f->turno === $turnoKey
                        || ($f->turno === 'MT' && in_array($turnoKey, ['M', 'T']));
                });

                $mustRest       = []; // cons >= LIMITE → descanso obrigatório hoje
                $quaseEsgotados = []; // cons === LIMITE-1 → bloqueados no próximo domingo
                $livres         = []; // cons < LIMITE-1  → disponíveis hoje e no próximo

                foreach ($workersNesteSlot as $f) {
                    if ($f->tipo_escala !== '6x1') continue;
                    $cons = $domingoConsecutivos[$f->id] ?? 0;
                    if ($cons >= $LIMITE_DOMINGO) {
                        $mustRest[] = $f;
                    } elseif ($cons === $LIMITE_DOMINGO - 1) {
                        $quaseEsgotados[] = $f;
                    } else {
                        $livres[] = $f;
                    }
                }

                // 1. Força descanso obrigatório (regra legal — hard rule)
                foreach ($mustRest as $f) {
                    if (!in_array($f->id, $folgasDomingo)) {
                        $folgasDomingo[] = $f->id;
                    }
                }

                if (empty($quaseEsgotados)) continue; // sem risco de stagger

                // 2. Estima cobertura 12x36 hoje e no próximo domingo
                $outros12Hoje = (int) $workersNesteSlot->filter(function ($f) use ($domingoPar) {
                    return $f->tipo_escala === '12x36' && ($f->id % 2 === 0) === $domingoPar;
                })->count();

                $outros12Proximo = (int) $workersNesteSlot->filter(function ($f) use ($proximoDomPar) {
                    return $f->tipo_escala === '12x36' && ($f->id % 2 === 0) === $proximoDomPar;
                })->count();

                // Cobertura deste domingo (excluindo mustRest já forçados a descansar)
                $coberturaHoje = count($quaseEsgotados) + count($livres) + $outros12Hoje;

                // Cobertura do próximo domingo SEM stagger:
                //   - mustRest descansaram hoje → cons reseta para 0 → disponíveis na semana seguinte
                //   - quaseEsgotados trabalharam hoje → cons = LIMITE → BLOQUEADOS no próximo domingo
                //   - livres trabalham hoje → cons < LIMITE → disponíveis no próximo domingo
                $coberturaProximo = count($mustRest) + count($livres) + $outros12Proximo;

                if ($coberturaProximo >= $minRequired) continue; // próximo domingo sem problemas

                // 3. Stagger preventivo: quantos quaseEsgotados devem descansar hoje?
                if ($coberturaProximo === 0) {
                    $targetX = (int) ceil(count($quaseEsgotados) / 2);
                } else {
                    $targetX = $minRequired - $coberturaProximo;
                }

                // Restrição: nunca reduzir este domingo a zero
                $maxX = max(0, $coberturaHoje - 1);

                $numParaDescansar = min($targetX, $maxX, count($quaseEsgotados));

                if ($numParaDescansar <= 0) continue; // sem margem

                $selecionados = array_slice($quaseEsgotados, 0, $numParaDescansar);
                foreach ($selecionados as $f) {
                    if (!in_array($f->id, $folgasDomingo)) {
                        $folgasDomingo[] = $f->id;
                    }
                }
            }
        }

        return $folgasDomingo;
    }

    /**
     * RN-DOM: retorna quantos domingos consecutivos cada funcionário 6x1 trabalhou
     * ao final do período anterior, para que o limite de 3 domingos consecutivos
     * seja respeitado na fronteira entre escalas.
     *
     * Percorre apenas os registros de domingo da escala anterior, do mais recente
     * para o mais antigo, e conta a sequência ininterrupta de domingos trabalhados.
     *
     * @return array<int, int>  [funcionario_id => domingos_consecutivos]
     */
    private function getDomingoConsecutivosEscalaAnterior(string $inicio): array
    {
        $escalaAnterior = Escala::where('fim', '<', $inicio)
            ->orderBy('fim', 'desc')
            ->where('status', 'ativa')
            ->first();

        if (!$escalaAnterior) return [];

        $itens = DB::table('escala_itens')
            ->where('escala_id', $escalaAnterior->id)
            ->whereNotNull('funcionario_id')
            ->where('tipo', 'normal')
            ->select('funcionario_id', 'data', 'turno')
            ->get()
            ->groupBy('funcionario_id');

        $consecutivos = [];

        foreach ($itens as $funcId => $registros) {
            // Filtra apenas domingos e garante uma entrada por data (mais recente)
            $domingosPorData = [];
            foreach ($registros as $r) {
                $dt = new \DateTime($r->data);
                if ((int) $dt->format('N') === 7 && !isset($domingosPorData[$r->data])) {
                    $domingosPorData[$r->data] = $r->turno;
                }
            }
            krsort($domingosPorData); // mais recente primeiro

            $count = 0;
            $dataEsperada = null;

            foreach ($domingosPorData as $data => $turno) {
                // Verifica que é o domingo imediatamente anterior (sem lacuna de semanas)
                if ($dataEsperada !== null && $data !== $dataEsperada) {
                    break;
                }
                if ($turno === 'F') {
                    break; // teve folga neste domingo — sequência interrompida
                }
                $count++;
                $dt = new \DateTime($data);
                $dt->modify('-7 days');
                $dataEsperada = $dt->format('Y-m-d');
            }

            if ($count > 0) {
                $consecutivos[$funcId] = $count;
            }
        }

        return $consecutivos;
    }

    private function getNoiteUltimaEscala(string $inicio): array
    {
        $diaAnterior = Carbon::parse($inicio)->subDay()->format('Y-m-d');

        return DB::table('escala_itens')
            ->where('data', $diaAnterior)
            ->where('turno', 'N')
            ->whereNotNull('funcionario_id')
            ->pluck('funcionario_id')
            ->toArray();
    }

    public function editarEscalaItens(array $itens)
    {
        $atualizados = [];

        foreach ($itens as $item) {

            DB::table('escala_itens')
                ->where('id', $item['id'])
                ->update([
                    'turno' => $item['turno'],
                    'updated_at' => now()
                ]);

            $atualizados[] = [
                'id' => $item['id'],
                'turno' => $item['turno']
            ];
        }

        return $atualizados;
    }
}
