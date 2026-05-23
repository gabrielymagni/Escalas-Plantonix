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

        $resultado = [];

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

        $linhas = [];
        $now = now();

        foreach ($resultado as $pessoa) {

            foreach ($pessoa['dias'] as $dia) {

                $linhas[] = [
                    'escala_id' => $escala->id,
                    'funcionario_id' => $pessoa['id'],
                    'data' => $dia['data'],
                    'turno' => $dia['turno'],
                    'bloco_id' => $pessoa['bloco'],
                    'tipo' => 'normal',
                    'created_at' => $now,
                    'updated_at' => $now,
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
        $LIMITE_SEMANAL = 36;

        $funcionarios = Funcionario::with('blocos')
            ->where('faz_plantao', true)
            ->when($data, function ($q) use ($data) {
                $q->whereDoesntHave('afastamentos', function ($af) use ($data) {
                    $af->where('inicio', '<=', $data)->where('fim', '>=', $data);
                });
            })
            ->get();

        $pool = ['M' => [], 'T' => [], 'N' => []];

        foreach ($funcionarios as $f) {
            $blocoPreferido = $f->blocos->firstWhere('pivot.ordem', 1);
            if (!$blocoPreferido) continue;

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

        // Índice do dia para desempate determinístico no rodízio de fim de semana
        $dayIndex = (new \DateTime($data ?? 'today'))->diff(new \DateTime('2020-01-01'))->days;

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
             * Aloca funcionários para um turno/bloco.
             *
             * Em dias úteis: aloca TODOS os elegíveis (qtd_* é mínimo).
             * Em fins de semana: aloca apenas o mínimo, priorizando quem
             * trabalhou menos horas na semana (rodízio justo).
             */
            $alocar = function (string $turnoKey, int $qtdMinima, int $blocoId)
                use (&$pool, &$escaladosHoje, &$escalados, $isWeekend, $horasSemana, $LIMITE_SEMANAL, $dayIndex): array {

                $candidatos = [];

                foreach ($pool[$turnoKey] as $key => $pessoa) {
                    $funcId = $pessoa['funcionario']->id;

                    if (in_array($funcId, $escaladosHoje)) continue;
                    if ($pessoa['bloco_id'] != $blocoId) continue;

                    $horasShift = match ($pessoa['funcionario']->tipo_escala) {
                        '12x36' => 12,
                        '5x2'   => 8,
                        default => 6,
                    };

                    if (($horasSemana[$funcId] ?? 0) + $horasShift > $LIMITE_SEMANAL) continue;

                    $candidatos[$key] = [
                        'pessoa'      => $pessoa,
                        'horas'       => $horasShift,
                        'horasAtuais' => $horasSemana[$funcId] ?? 0,
                    ];
                }

                if ($isWeekend) {
                    // Rodízio: quem trabalhou menos horas na semana vai primeiro;
                    // desempate determinístico por dia para variar quem é escalado.
                    uasort($candidatos, function ($a, $b) use ($dayIndex) {
                        if ($a['horasAtuais'] !== $b['horasAtuais']) {
                            return $a['horasAtuais'] <=> $b['horasAtuais'];
                        }
                        $hashA = crc32($a['pessoa']['funcionario']->id . '-' . $dayIndex);
                        $hashB = crc32($b['pessoa']['funcionario']->id . '-' . $dayIndex);
                        return $hashA <=> $hashB;
                    });
                    $selecionados = array_slice($candidatos, 0, $qtdMinima, true);
                } else {
                    // Dia útil: todos os elegíveis trabalham (qtd_* é apenas o mínimo)
                    $selecionados = $candidatos;
                }

                $alocados = [];
                foreach ($selecionados as $key => $c) {
                    $funcId = $c['pessoa']['funcionario']->id;
                    $alocados[] = $c['pessoa']['funcionario'];
                    $escaladosHoje[] = $funcId;
                    $escalados[$funcId] = ($escalados[$funcId] ?? 0) + $c['horas'];
                    unset($pool[$turnoKey][$key]);
                }

                // Mínimo não atingido: marca as vagas faltantes como ausente
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
        // (casos onde o mínimo não foi atingido por falta de match de bloco)
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
