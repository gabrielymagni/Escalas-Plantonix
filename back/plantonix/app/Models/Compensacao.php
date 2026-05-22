<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compensacao extends Model
{
    protected $fillable = ['funcionario_id', 'tipo', 'motivo', 'status'];

    public function funcionario()
    {
        return $this->belongsTo(Funcionario::class);
    }
}
