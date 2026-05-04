<?php

namespace App\Http\Controllers;

use App\Models\Regra;
use App\Services\AuditLogger;
use Exception;
use Illuminate\Http\Request;

class RegraController extends Controller
{
    public function index()
    {
        $regras = Regra::getRegras();
        return response()->json($regras, 200);
    }

    public function show($id)
    {
        $regra = Regra::findRegra($id);
        if ($regra == null) {
            return response()->json(['message' => 'Regra não encontrada.'], 404);
        }
        return response()->json($regra, 200);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'tipo_profissional' => 'required|string|max:255',
                'tipo_dia' => 'required|string|max:1',
                'blocos' => 'required|array'
            ]);

            $regra = Regra::createRegra($request);
            if ($regra['err'] != null) {
                return response()->json(['message' => 'Erro ao criar nova regra', 'err' => $regra['err']], 500);
            }

            AuditLogger::log('CREATE', 'Regra', $regra['regra']->id, [
                'tipo_profissional' => $regra['regra']->tipo_profissional,
                'tipo_dia'          => $regra['regra']->tipo_dia,
            ]);

            return response()->json([$regra['regra']], 201);

        } catch (Exception $e) {
            return response()->json(["message" => 'Erro ao criar nova regra', "err" => $e], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'tipo_profissional' => 'required|string|max:255',
                'tipo_dia' => 'required|string|max:1',
                'blocos' => 'required|array'
            ]);

            $regra = Regra::updateRegra($request, $id);
            if ($regra['err'] != null) {
                $cod = $regra['err'] == 404 ? 404 : 500;
                return response()->json([
                    'message' => 'Erro ao atualizar regra',
                    'err' => $regra['err']
                ], $cod);
            }

            AuditLogger::log('UPDATE', 'Regra', $id, [
                'tipo_profissional' => $regra['regra']->tipo_profissional,
                'tipo_dia'          => $regra['regra']->tipo_dia,
            ]);

            return response()->json([$regra['regra']], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Erro ao atualizar a regra', 'err' => $e], 500);
        }
    }

    public function destroy($id)
    {
        $r = Regra::destroyRegra($id);
        if ($r == 404) {
            return response(['message' => 'Regra não encontrada'], 404);
        }
        if ($r != null) {
            return response(['message' => 'Erro ao excluir regra', 'err' => $r], 500);
        }

        AuditLogger::log('DELETE', 'Regra', $id);

        return response([null], 204);
    }
}
