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
        $uti        = Bloco::firstOrCreate(['nome' => 'UTI']);
        $enfermaria = Bloco::firstOrCreate(['nome' => 'Enfermaria']);
        $emergencia = Bloco::firstOrCreate(['nome' => 'Emergência']);

        // ---------------------------------------------------------------
        // Regras
        // ---------------------------------------------------------------
        $regraUtil    = Regra::firstOrCreate(['tipo_dia' => 'U'], ['tipo_profissional' => 'Enfermagem']);
        $regraInutil  = Regra::firstOrCreate(['tipo_dia' => 'I'], ['tipo_profissional' => 'Enfermagem']);

        // Quantidades por bloco em dia útil
        foreach ([
            [$regraUtil->id,   $uti->id,        2, 2, 2],
            [$regraUtil->id,   $enfermaria->id, 2, 2, 1],
            [$regraUtil->id,   $emergencia->id, 1, 1, 1],
        ] as [$regraId, $blocoId, $m, $t, $n]) {
            RegraBloco::firstOrCreate(
                ['regra_id' => $regraId, 'bloco_id' => $blocoId],
                ['qtd_manha' => $m, 'qtd_tarde' => $t, 'qtd_noite' => $n]
            );
        }

        // Quantidades por bloco em fim de semana (menos gente)
        foreach ([
            [$regraInutil->id, $uti->id,        1, 1, 2],
            [$regraInutil->id, $enfermaria->id, 1, 1, 1],
            [$regraInutil->id, $emergencia->id, 1, 1, 1],
        ] as [$regraId, $blocoId, $m, $t, $n]) {
            RegraBloco::firstOrCreate(
                ['regra_id' => $regraId, 'bloco_id' => $blocoId],
                ['qtd_manha' => $m, 'qtd_tarde' => $t, 'qtd_noite' => $n]
            );
        }

        // ---------------------------------------------------------------
        // Funcionários (5 por turno, distribuídos nos 3 blocos)
        // ---------------------------------------------------------------
        $funcionarios = [
            // Manhã — UTI (3) + Enfermaria (1) + Emergência (1)
            ['Ana Lima',       'M', $uti->id],
            ['Bruno Souza',    'M', $uti->id],
            ['Carla Mendes',   'M', $uti->id],
            ['Diego Rocha',    'M', $enfermaria->id],
            ['Elisa Ferreira', 'M', $emergencia->id],

            // Tarde — UTI (2) + Enfermaria (2) + Emergência (1)
            ['Fábio Nunes',    'T', $uti->id],
            ['Gabriela Costa', 'T', $uti->id],
            ['Henrique Alves', 'T', $enfermaria->id],
            ['Isabela Dias',   'T', $enfermaria->id],
            ['João Martins',   'T', $emergencia->id],

            // Noite — UTI (2) + Enfermaria (2) + Emergência (1)
            ['Kamila Ribeiro', 'N', $uti->id],
            ['Lucas Pereira',  'N', $uti->id],
            ['Marina Santos',  'N', $enfermaria->id],
            ['Nathan Oliveira','N', $enfermaria->id],
            ['Priscila Gomes', 'N', $emergencia->id],
        ];

        foreach ($funcionarios as $i => [$nome, $turno, $blocoId]) {
            $slug = strtolower(iconv('UTF-8', 'ASCII//TRANSLIT', explode(' ', $nome)[0]));
            $email = "dev.{$slug}{$i}@plantonix.dev";

            $f = Funcionario::firstOrCreate(
                ['email' => $email],
                [
                    'nome'             => $nome,
                    'turno'            => $turno,
                    'cargo'            => 'Enfermeiro',
                    'coren'            => 'COREN-' . str_pad($i + 100, 6, '0', STR_PAD_LEFT),
                    'tipo_escala'      => '12x36',
                    'data_contratacao' => '2023-01-01',
                    'password'         => 'dev123456',
                    'faz_plantao'      => true,
                ]
            );

            FuncionarioBloco::firstOrCreate(
                ['funcionario_id' => $f->id, 'bloco_id' => $blocoId],
                ['ordem' => 1]
            );
        }
    }
}
