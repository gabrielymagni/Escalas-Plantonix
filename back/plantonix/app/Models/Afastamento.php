<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Services\AuditLogger;

class Afastamento extends Model
{
    protected $fillable = ['funcionario_id', 'inicio', 'fim', 'motivo', 'descricao'];

    public function funcionario()
    {
        return $this->belongsTo(Funcionario::class);
    }

    public static function registrar($funcionarioId, $dados)
    {
        try {
            $funcionario = Funcionario::find($funcionarioId);
            if ($funcionario === null) {
                return ['data' => null, 'itens_afetados' => 0, 'err' => 404];
            }

            $afastamento = self::create([
                'funcionario_id' => $funcionarioId,
                'inicio'         => $dados['inicio'],
                'fim'            => $dados['fim'],
                'motivo'         => $dados['motivo'],
                'descricao'      => $dados['descricao'] ?? null,
            ]);

            $itensAfetados = DB::table('escala_itens')
                ->where('funcionario_id', $funcionarioId)
                ->whereBetween('data', [$dados['inicio'], $dados['fim']])
                ->count();

            DB::table('escala_itens')
                ->where('funcionario_id', $funcionarioId)
                ->whereBetween('data', [$dados['inicio'], $dados['fim']])
                ->update(['funcionario_id' => null, 'updated_at' => now()]);

            $motivos = ['ferias' => 'Férias', 'licenca' => 'Licença', 'atestado' => 'Atestado', 'outros' => 'Outros'];
            $motivoLabel = $motivos[$dados['motivo']] ?? $dados['motivo'];

            Notificacao::create([
                'tipo'     => 'afastamento',
                'mensagem' => "Funcionário {$funcionario->nome} foi afastado ({$motivoLabel}) de {$dados['inicio']} a {$dados['fim']}. {$itensAfetados} turno(s) tornaram-se vacância.",
                'dados'    => json_encode([
                    'funcionario_id' => $funcionarioId,
                    'nome'           => $funcionario->nome,
                    'inicio'         => $dados['inicio'],
                    'fim'            => $dados['fim'],
                    'motivo'         => $dados['motivo'],
                    'itens_afetados' => $itensAfetados,
                ]),
                'lida' => false,
            ]);

            AuditLogger::log('CREATE', 'Afastamento', $afastamento->id, [
                'funcionario_id' => $funcionarioId,
                'nome'           => $funcionario->nome,
                'inicio'         => $dados['inicio'],
                'fim'            => $dados['fim'],
                'motivo'         => $dados['motivo'],
                'itens_afetados' => $itensAfetados,
            ]);

            return ['data' => $afastamento, 'itens_afetados' => $itensAfetados, 'err' => null];

        } catch (Exception $e) {
            return ['data' => null, 'itens_afetados' => 0, 'err' => $e];
        }
    }

    public static function remover($afastamentoId)
    {
        try {
            $afastamento = self::find($afastamentoId);
            if ($afastamento === null) {
                return 404;
            }

            AuditLogger::log('DELETE', 'Afastamento', $afastamentoId, [
                'funcionario_id' => $afastamento->funcionario_id,
            ]);

            $afastamento->delete();

            return null;
        } catch (Exception $e) {
            return $e;
        }
    }
}
