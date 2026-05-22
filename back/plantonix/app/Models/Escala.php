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
                'ei.turno'
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
                'turno' => $r->turno
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

        for ($data = $inicio->copy(); $data->lte($fim); $data->addDay()) {

            $regra = $data->isWeekend() ? $regraDiaInutil : $regraDiaUtil;

            $escalaDia = $this->gerarEscalaDia($regra, $data->format('Y-m-d'));

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

        return array_values($resultado);
    }

    public function gerarEscalaDia($regra, $data = null)
    {
        $funcionarios = Funcionario::with('blocos')
            ->where('faz_plantao', true)
            ->when($data, function ($q) use ($data) {
                $q->whereDoesntHave('afastamentos', function ($af) use ($data) {
                    $af->where('inicio', '<=', $data)->where('fim', '>=', $data);
                });
            })
            ->get();

        // 🔹 Separar funcionários por turno e bloco preferido (ordem = 1)
        $pool = [
            'M' => [],
            'T' => [],
            'N' => [],
        ];

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

        // Rotaciona o pool a cada dia para distribuição justa (base para RN002)
        $dayIndex = (new \DateTime($data ?? 'today'))->diff(new \DateTime('2020-01-01'))->days;
        foreach ($pool as $turno => &$pessoas) {
            if (count($pessoas) > 1) {
                $offset = $dayIndex % count($pessoas);
                $pessoas = array_values(array_merge(
                    array_slice($pessoas, $offset),
                    array_slice($pessoas, 0, $offset)
                ));
            }
        }
        unset($pessoas);

        $escala = [];
        $sobrando = [];

        foreach ($regra->blocos as $bloco) {

            $escala[$bloco->id] = [
                'nome' => $bloco->nome,
                'manha' => [],
                'tarde' => [],
                'noite' => [],
            ];

            // Função auxiliar pra alocar
            $alocar = function ($turno, $qtd, $blocoId) use (&$pool, &$sobrando) {
                $alocados = [];

                foreach ($pool[$turno] as $key => $pessoa) {
                    if ($qtd <= 0)
                        break;

                    if ($pessoa['bloco_id'] == $blocoId) {
                        $alocados[] = $pessoa['funcionario'];
                        unset($pool[$turno][$key]);
                        $qtd--;
                    }
                }

                // Se faltar gente
                while ($qtd > 0) {
                    $alocados[] = ['ausente' => true];
                    $qtd--;
                }

                return $alocados;
            };

            // 🔹 Preencher cada turno
            $escala[$bloco->id]['manha'] = $alocar('M', $bloco->pivot->qtd_manha, $bloco->id);
            $escala[$bloco->id]['tarde'] = $alocar('T', $bloco->pivot->qtd_tarde, $bloco->id);
            $escala[$bloco->id]['noite'] = $alocar('N', $bloco->pivot->qtd_noite, $bloco->id);
        }

        // 🔹 Coletar sobras
        foreach ($pool as $turno => $pessoas) {
            foreach ($pessoas as $p) {
                $sobrando[] = $p['funcionario']->nome;
            }
        }

        // 🔹 Preencher ausentes com sobras (aleatório)
        foreach ($escala as &$bloco) {
            foreach (['manha', 'tarde', 'noite'] as $turno) {
                foreach ($bloco[$turno] as &$pessoa) {

                    if (is_array($pessoa) && isset($pessoa['ausente']) && count($sobrando) > 0) {
                        $randomKey = array_rand($sobrando);
                        $pessoa = [
                            'nome' => $sobrando[$randomKey],
                            'tipo' => 'sorteado'
                        ];
                        unset($sobrando[$randomKey]);
                    }
                }
            }
        }

        return [
            'escala' => $escala,
            'sobrando' => array_values($sobrando)
        ];
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
