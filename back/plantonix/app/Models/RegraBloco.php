<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegraBloco extends Model
{
    protected $fillable = ['bloco_id', 'regra_id', 'qtd_manha', 'qtd_tarde', 'qtd_noite', 'qtd_plantoes'];
}
