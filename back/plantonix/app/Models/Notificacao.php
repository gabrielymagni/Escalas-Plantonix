<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacao extends Model
{
    protected $table = 'notificacoes';

    protected $fillable = ['tipo', 'mensagem', 'dados', 'lida'];

    protected function casts(): array
    {
        return [
            'dados' => 'array',
            'lida'  => 'boolean',
        ];
    }
}
