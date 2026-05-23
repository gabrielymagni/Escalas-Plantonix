<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compensacao extends Model
{
    protected $table = 'compensacoes';

    protected $fillable = ['funcionario_id', 'escala_item_id', 'tipo', 'motivo', 'status'];

    public function funcionario()
    {
        return $this->belongsTo(Funcionario::class);
    }
}
