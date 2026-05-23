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
            if (!$blocoPreferido) continue;
            $resultado[$f->id] = [
                'id'    => $f->id,
                'nome'  => $f->nome,
                'bloco' => $blocoPreferido->id,
                'escala' => $escala->id,
                'dias'  => [],
            ];
        }

        // RN002: busca quem trabalhou à noite no último dia da escala anterior
        $noiteAnterior = $this->getNoiteUltimaEscala($raio['inicio']);

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

            $escalaDia = $this->gerarEscalaDia($regra, $data->format('Y-m-d'), $noiteAnterior, $horasSemana, $isWeekend);

            // Atualiza horas semanais com o que foi alocado hoje
            foreach ($escalaDia['escalados'] as $funcId => $horas) {
                $horasSemana[$funcId] = ($horasSemana[$funcId] ?? 0) + $horas;
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
            if ($pessoa['id'] === null) continue;
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
            if ($pessoa['id'] === null) continue;

            foreach ($pessoa['dias'] as $dia) {

                $linhas[] = [
                    'escala_id'      => $escala->id,
                    'funcionario_id' => $pessoa['id'],
                    'data'           => $dia['data'],
                    'turno'          => $dia['turno'],
                    'bloco_id'       => $pessoa['bloco'],
                    'tipo'           => $dia['turno'] === 'F' ? 'folga' : 'normal',
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ];
            }
        }

        // 🔥 bulk insert
        DB::table('escala_itens')->insert($linhas);

        // RN003: gerar plantões para cada dia inútil do período conforme a regra
        if ($regraDiaInutil) {
            for ($d = $inicio->copy(); $d->lte($fim); $d->addDay()) {
                if ($d->isWeekend()) {
                    $this->gerarPlantoes($escala->id, $d->format('Y-m-d'), $regraDiaInutil);
                }
            }
        }

        return array_values($resultado);
    }

    public function gerarEscalaDia($regra, $data = null, array $noiteAnterior = [], array $horasSemana = [], bool $isWeekend = false)
    {
        $LIMITE_SEMANAL_6X1 = 36;

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
        $diaPar   = $dayIndex % 2 === 0;

        $pool = ['M' => [], 'T' => [], 'N' => []];

        foreach ($funcionarios as $f) {
            $blocoPreferido = $f->blocos->firstWhere('pivot.ordem', 1);
            if (!$blocoPreferido) continue;

            // 5x2: trabalha apenas de segunda a sexta
            if ($f->tipo_escala === '5x2' && $isWeekend) continue;

            // 12x36: divide em dois grupos por paridade do ID do funcionário.
            // Grupo de ID par → trabalha nos dias de índice global par; ímpar → índice ímpar.
            if ($f->tipo_escala === '12x36') {
                $grupoPar = $f->id % 2 === 0;
                if ($grupoPar !== $diaPar) continue;
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
                'nome'  => $bloco->nome,
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
            $alocar = function (string $turnoKey, int $qtdMinima, int $blocoId)
                use (&$pool, &$escaladosHoje, &$escalados, $isWeekend, $horasSemana, $LIMITE_SEMANAL_6X1, $dayIndex): array {

                $candidatos12x36 = [];
                $candidatos6x1   = [];
                $candidatosOther = []; // 5x2 e outros

                foreach ($pool[$turnoKey] as $key => $pessoa) {
                    $funcId     = $pessoa['funcionario']->id;
                    $tipoEscala = $pessoa['funcionario']->tipo_escala;

                    if (in_array($funcId, $escaladosHoje)) continue;
                    if ($pessoa['bloco_id'] != $blocoId) continue;

                    $horasShift = match ($tipoEscala) {
                        '12x36' => 12,
                        '5x2'   => 8,
                        default => 6,
                    };

                    // Limite semanal se aplica apenas a 6x1
                    if ($tipoEscala === '6x1' && ($horasSemana[$funcId] ?? 0) + $horasShift > $LIMITE_SEMANAL_6X1) {
                        continue;
                    }

                    $candidato = [
                        'pessoa'      => $pessoa,
                        'horas'       => $horasShift,
                        'horasAtuais' => $horasSemana[$funcId] ?? 0,
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

                    // 6x1: rodízio — preenche apenas o que falta para atingir o mínimo
                    $faltam6x1 = max(0, $qtdMinima - count($selecionados));
                    if ($faltam6x1 > 0 && !empty($candidatos6x1)) {
                        uasort($candidatos6x1, function ($a, $b) use ($dayIndex) {
                            if ($a['horasAtuais'] !== $b['horasAtuais']) {
                                return $a['horasAtuais'] <=> $b['horasAtuais'];
                            }
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
            'escala'    => $escala,
            'escalados' => $escalados,
            'sobrando'  => [],
        ];
    }

    private function gerarPlantoes(int $escalaId, string $dataPlantao, Regra $regra): void
    {
        $now = now();
        $linhas = [];

        foreach ($regra->blocos as $bloco) {
            $qtd = (int) ($bloco->pivot->qtd_plantoes ?? 0);
            if ($qtd <= 0) continue;

            // Critério 1: já com plantão nesta escala neste bloco são inelegíveis
            $comPlantaoNaEscala = DB::table('escala_itens')
                ->where('escala_id', $escalaId)
                ->where('bloco_id', $bloco->id)
                ->where('tipo', 'plantao')
                ->pluck('funcionario_id')
                ->toArray();

            // Candidatos: 6x1, bloco preferido = este bloco, sem afastamento na data
            $candidatos = Funcionario::with('blocos')
                ->where('tipo_escala', '6x1')
                ->where('faz_plantao', true)
                ->whereNotIn('id', $comPlantaoNaEscala)
                ->whereDoesntHave('afastamentos', function ($q) use ($dataPlantao) {
                    $q->where('inicio', '<=', $dataPlantao)->where('fim', '>=', $dataPlantao);
                })
                ->whereHas('blocos', function ($q) use ($bloco) {
                    $q->where('blocos.id', $bloco->id)->where('funcionario_blocos.ordem', 1);
                })
                ->get();

            // Critérios 2, 3 e 4: enriquecer com métricas de plantão
            $candidatos = $candidatos->map(function ($f) {
                $stats = DB::table('escala_itens')
                    ->where('funcionario_id', $f->id)
                    ->where('tipo', 'plantao')
                    ->selectRaw('COUNT(*) as total, MAX(data) as ultimo')
                    ->first();

                $diasTrabalhados = max(1, Carbon::parse($f->data_contratacao)->diffInDays(now()));

                $f->_ultimo_plantao = $stats->ultimo;
                $f->_media_plantoes = $stats->total / $diasTrabalhados;

                return $f;
            });

            $selecionados = $candidatos->sort(function ($a, $b) {
                // Critério 2: nunca fez plantão = prioridade máxima; senão o mais antigo primeiro
                if ($a->_ultimo_plantao !== $b->_ultimo_plantao) {
                    if ($a->_ultimo_plantao === null) return -1;
                    if ($b->_ultimo_plantao === null) return 1;
                    return strcmp($a->_ultimo_plantao, $b->_ultimo_plantao);
                }
                // Critério 3: menor média de plantões por dia trabalhado
                $diffMedia = $a->_media_plantoes <=> $b->_media_plantoes;
                if ($diffMedia !== 0) return $diffMedia;
                // Critério 4: maior tempo de casa
                $diffCasa = strcmp($a->data_contratacao, $b->data_contratacao);
                if ($diffCasa !== 0) return $diffCasa;
                // Desempate final: ordem alfabética
                return strcmp($a->nome, $b->nome);
            })->take($qtd)->values();

            foreach ($selecionados as $f) {
                $linhas[] = [
                    'escala_id'      => $escalaId,
                    'funcionario_id' => $f->id,
                    'data'           => $dataPlantao,
                    'turno'          => 'MT',
                    'bloco_id'       => $bloco->id,
                    'tipo'           => 'plantao',
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ];
            }
        }

        if (!empty($linhas)) {
            DB::table('escala_itens')->insert($linhas);
        }
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
