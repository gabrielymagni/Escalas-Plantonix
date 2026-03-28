<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bloco extends Model
{
    use SoftDeletes;
    protected $fillable = ['nome'];

    public function funcionarios()
    {
        return $this->belongsToMany(Funcionario::class, 'funcionario_blocos')
            ->withPivot('ordem')
            ->withTimestamps();
    }
}
