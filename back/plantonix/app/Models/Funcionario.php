<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Funcionario extends Model
{
    use SoftDeletes;
    protected $fillable = ['nome', 'email', 'coren'];

    public static function getFuncionarios()
    {
        return self::with('blocos')->get();
    }

    public static function findFuncionario($id)
    {
        $funcionario = self::with('blocos')->find($id);
        return $funcionario;
    }

    public static function createFuncinario($dados)
    {
        try {
            $funcionario = self::create([
                "nome" => $dados->nome,
                "email" => $dados->email,
                "coren" => $dados->coren
            ]);

            foreach ($dados->blocos as $bloco) {
                FuncionarioBloco::create([
                    "funcionario_id" => $funcionario->id,
                    "bloco_id" => $bloco['id_bloco'],
                    "ordem" => $bloco['ordem']
                ]);
            }

            $funcionario->load('blocos');

            return ["funcionario" => $funcionario, "err" => null];

        } catch (Exception $e) {
            return ["funcionario" => null, "err" => $e];
        }
    }

    public static function updateFuncinario($dados, $id)
    {
        try {
            $funcionario = self::find($id);
            if ($funcionario == null) {
                return ["funcionario" => null, "err" => 404];
            }

            FuncionarioBloco::where('funcionario_id', '=', $funcionario->id)->delete();

            foreach ($dados->blocos as $bloco) {
                FuncionarioBloco::create([
                    "funcionario_id" => $funcionario->id,
                    "bloco_id" => $bloco['id_bloco'],
                    "ordem" => $bloco['ordem']
                ]);
            }

            $funcionario->update([
                "nome" => $dados->nome,
                "email" => $dados->email,
                "coren" => $dados->coren
            ]);

            $funcionario->load('blocos');

            return ["funcionario" => $funcionario, "err" => null];

        } catch (Exception $e) {
            return ["funcionario" => null, "err" => $e];
        }
    }

    public static function destroyFuncionario($id)
    {
        try {
            $funcionario = self::find($id);
            if ($funcionario == null) {
                return 404;
            }

            FuncionarioBloco::where('funcionario_id', '=', $funcionario->id)->delete();
            $funcionario->delete();

            return null;
        } catch (Exception $e) {
            return $e;
        }
    }

    public function blocos()
    {
        return $this->belongsToMany(Bloco::class, 'funcionario_blocos')
            ->withPivot('ordem')
            ->withTimestamps();
    }
}
