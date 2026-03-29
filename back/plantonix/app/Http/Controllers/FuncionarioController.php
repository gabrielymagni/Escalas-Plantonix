<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\Funcionario;

class FuncionarioController extends Controller
{
    public function index()
    {
        $funcionarios = Funcionario::getFuncionarios();
        return response()->json($funcionarios, 200);
    }

    public function show($id)
    {
        $funcionario = Funcionario::findFuncionario($id);
        if ($funcionario == null) {
            return response()->json(["message" => "Funcionário não encontrado", 404]);
        }

        return response()->json([$funcionario], 200);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                "nome" => 'required|string|max:255',
                "email" => 'required|string|max:255',
                "coren" => 'required|string|max:20',
                "turno" => 'required|string|max:2',
                "tipo_escala" => 'required|string|max:6',
                "data_contratacao" => 'required|date',
                "blocos" => 'required|array'
            ]);

            $funcionario = Funcionario::createFuncinario($request);
            if ($funcionario['err'] != null) {
                return response()->json(["message" => "Erro ao criar novo funcionário", "err" => $funcionario['err']], 500);
            }

            return response()->json([$funcionario['funcionario']], 201);
        } catch (Exception $e) {
            return response()->json(["message" => "Erro ao criar novo funcionário", "err" => $e], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                "nome" => 'required|string|max:255',
                "email" => 'required|string|max:255',
                "coren" => 'required|string|max:20',
                "turno" => 'required|string|max:1',
                "tipo_escala" => 'required|string|max:6',
                "data_contratacao" => 'required|date',
                "blocos" => 'required|array'
            ]);

            $funcionario = Funcionario::updateFuncinario($request, $id);
            if ($funcionario['err'] != null) {
                $cod = $funcionario['err'] == 404 ? 404 : 500;
                return response()->json([
                    "message" => "Erro ao atualizar funcionário",
                    "err" => $funcionario['err']
                ], $cod);
            }

            return response()->json([$funcionario['funcionario']], 200);
        } catch (Exception $e) {
            return response()->json(["message" => "Erro ao atualizar funcionário", "err" => $e], 500);
        }
    }
    public function destroy($id)
    {
        $r = Funcionario::destroyFuncionario($id);
        if ($r == 404) {
            return response(['message' => 'Funcionário não encontrado'], 404);
        }
        if ($r != null) {
            return response(['message' => 'Erro ao excluir funcionário', 'err' => $r], 500);
        }
        return response([null], 204);
    }
}
