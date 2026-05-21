<?php

namespace Database\Seeders;

use App\Models\Funcionario;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Funcionario::firstOrCreate(
            ['email' => 'admin@plantonix.com.br'],
            [
                'nome'     => 'Admin',
                'cargo'    => 'Coordenador',
                'password' => 'admin123',
            ]
        );
    }
}
