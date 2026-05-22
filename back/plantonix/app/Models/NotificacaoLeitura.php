<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificacaoLeitura extends Model
{
    public $timestamps = false;

    protected $table = 'notificacao_leituras';

    protected $fillable = ['notificacao_id', 'funcionario_id', 'created_at'];

    public function notificacao()
    {
        return $this->belongsTo(Notificacao::class);
    }

    public function funcionario()
    {
        return $this->belongsTo(Funcionario::class);
    }
}
