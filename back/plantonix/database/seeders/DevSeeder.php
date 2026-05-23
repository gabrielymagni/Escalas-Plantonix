<?php

namespace Database\Seeders;

use App\Models\Bloco;
use App\Models\Funcionario;
use App\Models\FuncionarioBloco;
use App\Models\Regra;
use App\Models\RegraBloco;
use Illuminate\Database\Seeder;

class DevSeeder extends Seeder
{
    public function run(): void
    {
        // ---------------------------------------------------------------
        // Blocos
        // ---------------------------------------------------------------
        $cir = Bloco::firstOrCreate(['nome' => 'Cirúrgico']);
        $mat = Bloco::firstOrCreate(['nome' => 'Maternidade']);
        $cli = Bloco::firstOrCreate(['nome' => 'Clinica Médica']);
        $pa  = Bloco::firstOrCreate(['nome' => 'Pronto atendimento']);

        // ---------------------------------------------------------------
        // Regras
        // ---------------------------------------------------------------
        $regraUtil   = Regra::firstOrCreate(['tipo_dia' => 'U'], ['tipo_profissional' => 'Técnica']);
        $regraInutil = Regra::firstOrCreate(['tipo_dia' => 'I'], ['tipo_profissional' => 'Técnica']);

        // Quantidades por bloco — dia útil
        foreach ([
            [$regraUtil->id, $cli->id, 1, 1, 0],
            [$regraUtil->id, $cir->id, 2, 2, 2],
            [$regraUtil->id, $mat->id, 2, 2, 2],
            [$regraUtil->id, $pa->id,  3, 3, 2],
        ] as [$regraId, $blocoId, $m, $t, $n]) {
            RegraBloco::firstOrCreate(
                ['regra_id' => $regraId, 'bloco_id' => $blocoId],
                ['qtd_manha' => $m, 'qtd_tarde' => $t, 'qtd_noite' => $n]
            );
        }

        // Quantidades por bloco — fim de semana
        foreach ([
            [$regraInutil->id, $cli->id, 1, 1, 0],
            [$regraInutil->id, $cir->id, 2, 2, 2],
            [$regraInutil->id, $mat->id, 2, 2, 2],
            [$regraInutil->id, $pa->id,  3, 3, 2],
        ] as [$regraId, $blocoId, $m, $t, $n]) {
            RegraBloco::firstOrCreate(
                ['regra_id' => $regraId, 'bloco_id' => $blocoId],
                ['qtd_manha' => $m, 'qtd_tarde' => $t, 'qtd_noite' => $n]
            );
        }

        // ---------------------------------------------------------------
        // Funcionários — dados do dump + blocos em ordem de preferência
        // ---------------------------------------------------------------
        $c = $cir->id;
        $m = $mat->id;
        $l = $cli->id;
        $p = $pa->id;

        $funcionarios = [
            // [nome, turno, tipo_escala, data_contratacao, cargo, [[bloco_id, ordem], ...]]
            ['Joana',     'M', '6x1',   '2026-04-01', 'Técnica', [[$c,1],[$l,2],[$m,3],[$p,4]]],
            ['Maria',     'M', '6x1',   '2026-04-02', 'Técnica', [[$c,1],[$l,2],[$m,3],[$p,4]]],
            ['Pedra',     'T', '6x1',   '2026-04-03', 'Técnica', [[$c,1],[$l,2],[$m,3],[$p,4]]],
            ['Josina',    'T', '6x1',   '2026-04-04', 'Técnica', [[$c,1],[$l,2],[$m,3],[$p,4]]],
            ['Nina',      'N', '12x36', '2026-04-05', 'Técnica', [[$c,1],[$l,2],[$m,3],[$p,4]]],
            ['Lúcia',     'N', '12x36', '2026-04-06', 'Técnica', [[$c,1],[$l,2],[$m,3],[$p,4]]],
            ['Clara',     'M', '6x1',   '2026-04-07', 'Técnica', [[$l,1],[$c,2],[$m,3],[$p,4]]],
            ['Giusepa',   'T', '6x1',   '2026-04-08', 'Técnica', [[$l,1],[$c,2],[$m,3],[$p,4]]],
            ['Helena',    'M', '6x1',   '2026-04-09', 'Técnica', [[$m,1],[$l,2],[$c,3],[$p,4]]],
            ['Cecilia',   'M', '6x1',   '2026-04-10', 'Técnica', [[$m,1],[$l,2],[$c,3],[$p,4]]],
            ['Maitê',     'T', '6x1',   '2026-04-11', 'Técnica', [[$m,1],[$l,2],[$p,3],[$c,4]]],
            ['Laura',     'T', '6x1',   '2026-04-12', 'Técnica', [[$m,1],[$l,2],[$c,3],[$p,4]]],
            ['Alice',     'N', '12x36', '2026-04-13', 'Técnica', [[$m,1],[$l,2],[$c,3],[$p,4]]],
            ['Claudia',   'N', '12x36', '2026-04-14', 'Técnica', [[$m,1],[$l,2],[$c,3],[$p,4]]],
            ['Eduarda',   'M', '6x1',   '2026-04-15', 'Técnica', [[$p,1],[$l,2],[$m,3],[$c,4]]],
            ['Mariah',    'M', '6x1',   '2026-04-16', 'Técnica', [[$p,1],[$l,2],[$c,3],[$m,4]]],
            ['Ana Clara', 'M', '6x1',   '2026-04-17', 'Técnica', [[$p,1],[$l,2],[$c,3],[$m,4]]],
            ['Eva',       'T', '6x1',   '2026-04-18', 'Técnica', [[$p,1],[$l,2],[$c,3],[$m,4]]],
            ['Luna',      'T', '6x1',   '2026-04-19', 'Técnica', [[$p,1],[$l,2],[$c,3],[$m,4]]],
            ['Antonella', 'T', '6x1',   '2026-04-20', 'Técnica', [[$p,1],[$l,2],[$c,3],[$m,4]]],
            ['Regina',    'N', '12x36', '2026-04-21', 'Técnica', [[$p,1],[$l,2],[$c,3],[$m,4]]],
            ['Eulália',   'N', '12x36', '2026-04-22', 'Técnica', [[$p,1],[$c,2],[$l,3],[$m,4]]],
            ['Vini',      'M', '6x1',   '2002-05-25', 'Técnico', [[$c,1],[$p,2],[$m,3],[$l,4]]],
        ];

        foreach ($funcionarios as $i => [$nome, $turno, $tipoEscala, $dataContratacao, $cargo, $blocos]) {
            $slug  = strtolower(iconv('UTF-8', 'ASCII//TRANSLIT', explode(' ', $nome)[0]));
            $email = "dev.{$slug}{$i}@plantonix.dev";

            $f = Funcionario::firstOrCreate(
                ['email' => $email],
                [
                    'nome'             => $nome,
                    'turno'            => $turno,
                    'cargo'            => $cargo,
                    'coren'            => 'COREN-' . str_pad($i + 100, 6, '0', STR_PAD_LEFT),
                    'tipo_escala'      => $tipoEscala,
                    'data_contratacao' => $dataContratacao,
                    'password'         => 'dev123456',
                    'faz_plantao'      => true,
                ]
            );

            foreach ($blocos as [$blocoId, $ordem]) {
                FuncionarioBloco::firstOrCreate(
                    ['funcionario_id' => $f->id, 'bloco_id' => $blocoId],
                    ['ordem' => $ordem]
                );
            }
        }
    }
}
