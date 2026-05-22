<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Funcionario extends Authenticatable
{
    use HasApiTokens, SoftDeletes, Notifiable;

    protected $fillable = ['nome', 'email', 'coren', 'turno', 'tipo_escala', 'data_contratacao', 'cargo', 'password', 'faz_plantao', 'role'];
    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'faz_plantao' => 'boolean',
            'email_verified_at' => 'datetime',
        ];
    }

    public static function getFuncionarios()
    {
        return self::with('blocos', 'afastamentos')->get();
    }

    public static function findFuncionario($id)
    {
        return self::with('blocos', 'afastamentos')->find($id);
    }

    public static function createFuncinario($dados)
    {
        try {
            $fazPlantao = $dados->faz_plantao ?? false;

            $funcionario = self::create([
                "nome" => $dados->nome,
                "email" => $dados->email,
                "coren" => $dados->coren,
                "turno" => $fazPlantao ? ($dados->turno ?? null) : null,
                "tipo_escala" => $fazPlantao ? ($dados->tipo_escala ?? null) : null,
                "data_contratacao" => $dados->data_contratacao,
                "cargo" => $dados->cargo,
                "faz_plantao" => $fazPlantao,
                "role" => $dados->role ?? 'funcionario',
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

            $fazPlantao = $dados->faz_plantao ?? $funcionario->faz_plantao;

            $funcionario->update([
                "nome" => $dados->nome,
                "email" => $dados->email,
                "coren" => $dados->coren,
                "turno" => $fazPlantao ? ($dados->turno ?? null) : null,
                "tipo_escala" => $fazPlantao ? ($dados->tipo_escala ?? null) : null,
                "data_contratacao" => $dados->data_contratacao,
                "cargo" => $dados->cargo,
                "faz_plantao" => $fazPlantao,
                "role" => $dados->role ?? $funcionario->role,
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

    public function afastamentos()
    {
        return $this->hasMany(Afastamento::class);
    }
}
