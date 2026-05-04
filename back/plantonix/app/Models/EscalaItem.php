<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EscalaItem extends Model
{
    protected $fillable = [
        'escala_id',
        'funcionario_id',
        'data',
        'turno',
        'bloco_id',
        'tipo'
    ];

    public function escala()
    {
        return $this->belongsTo(Escala::class);
    }

    public function funcionario()
    {
        return $this->belongsTo(Funcionario::class);
    }

    public function bloco()
    {
        return $this->belongsTo(Bloco::class);
    }
}
