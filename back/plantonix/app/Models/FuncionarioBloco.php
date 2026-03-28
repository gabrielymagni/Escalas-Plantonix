<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FuncionarioBloco extends Model
{
    protected $fillable = ['funcionario_id', 'bloco_id', 'ordem'];
}
