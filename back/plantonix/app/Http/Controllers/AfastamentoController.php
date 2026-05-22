<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\Afastamento;
use App\Services\AuditLogger;

class AfastamentoController extends Controller
{
    public function store(Request $request, $funcionarioId)
    {
        try {
            $request->validate([
                'motivo'    => 'required|string|in:ferias,licenca,atestado,outros',
                'inicio'    => 'required|date',
                'fim'       => 'required|date|after_or_equal:inicio',
                'descricao' => 'required_if:motivo,outros|nullable|string|max:500',
            ]);

            $resultado = Afastamento::registrar($funcionarioId, $request->all());

            if ($resultado['err'] === 404) {
                return response()->json(['message' => 'Funcionário não encontrado'], 404);
            }

            if ($resultado['err'] !== null) {
                return response()->json(['message' => 'Erro ao registrar afastamento', 'err' => $resultado['err']], 500);
            }

            return response()->json([
                'data'           => $resultado['data'],
                'itens_afetados' => $resultado['itens_afetados'],
            ], 201);

        } catch (Exception $e) {
            return response()->json(['message' => 'Erro ao registrar afastamento', 'err' => $e->getMessage()], 500);
        }
    }

    public function destroy($afastamentoId)
    {
        $resultado = Afastamento::remover($afastamentoId);

        if ($resultado === 404) {
            return response()->json(['message' => 'Afastamento não encontrado'], 404);
        }

        if ($resultado !== null) {
            return response()->json(['message' => 'Erro ao remover afastamento', 'err' => $resultado], 500);
        }

        AuditLogger::log('DELETE', 'Afastamento', $afastamentoId);

        return response([null], 204);
    }
}
