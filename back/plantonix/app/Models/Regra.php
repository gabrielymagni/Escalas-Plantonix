<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Model;

class Regra extends Model
{
    protected $fillable = ['tipo_profissional', 'tipo_dia'];

    public static function getRegras()
    {
        return self::with('blocos')->get();
    }

    public static function findRegra($id)
    {
        return self::with('blocos')->find($id);
    }

    public static function createRegra($dados)
    {
        try {
            $regra = self::create([
                'tipo_profissionarl' => $dados->tipo_profissional,
                'tipo_dia' => $dados->tipo_dia,
            ]);

            foreach ($dados->blocos as $bloco) {
                RegraBloco::create([
                    'bloco_id' => $bloco['bloco_id'],
                    'regra_id' => $regra->id,
                    'qtd_manha' => $bloco['qtd_manha'],
                    'qtd_tarde' => $bloco['qtd_tarde'],
                    'qtd_noite' => $bloco['qtd_noite'],
                ]);
            }

            $regra->load('blocos');

            return ['regra' => $regra, 'err' => null];

        } catch (Exception $e) {
            return ["regra" => null, "err" => 'aaa' . $e];
        }
    }

    public static function updateRegra($dados, $id)
    {
        try {
            $regra = self::find($id);
            if ($regra == null) {
                return ['regra' => null, 'err' => 404];
            }

            RegraBloco::where('regra_id', '=', $regra->id)->delete();

            foreach ($dados->blocos as $bloco) {
                RegraBloco::create([
                    'bloco_id' => $bloco['bloco_id'],
                    'regra_id' => $regra->id,
                    'qtd_manha' => $bloco['qtd_manha'],
                    'qtd_tarde' => $bloco['qtd_tarde'],
                    'qtd_noite' => $bloco['qtd_noite'],
                ]);
            }

            $regra->update([
                'tipo_profissionarl' => $dados->tipo_profissional,
                'tipo_dia' => $dados->tipo_dia,
            ]);

            $regra->load('blocos');

            return ['regra' => $regra, 'err' => null];

        } catch (Exception $e) {
            return ['regra' => null, 'err' => $e];
        }
    }

    public static function destroyRegra($id)
    {
        try {
            $regra = self::find($id);
            if ($regra == null) {
                return 404;
            }

            RegraBloco::where('regra_id', '=', $regra->id)->delete();
            $regra->delete();

            return null;
        } catch (Exception $e) {
            return $e;
        }
    }

    public function blocos()
    {
        return $this->belongsToMany(
            Bloco::class,
            'regra_blocos',
            'regra_id',
            'bloco_id'
        )
            ->withPivot('qtd_manha', 'qtd_tarde', 'qtd_noite')
            ->withTimestamps();
    }
}
