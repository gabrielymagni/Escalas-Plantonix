<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\Bloco;

class BlocoController extends Controller
{
    public function index()
    {
        $blocos = Bloco::all();
        return response()->json($blocos, 200);
    }

    public function show($id)
    {
        $bloco = Bloco::find($id);
        if ($bloco == null) {
            return response()->json(["message" => "Bloco não encontrado."], 404);
        }

        return response()->json([$bloco], 200);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'nome' => 'required|string|max:255'
            ], [
                'nome.required' => 'O nome é obrigatório.',
                'nome.string' => 'O nome deve ser um texto.',
                'nome.max' => 'O nome pode ter no máximo 255 caracteres.'
            ]);

            $bloco = Bloco::create([
                'nome' => $request->nome,
            ]);

            return response()->json([$bloco], 201);

        } catch (Exception $e) {
            return response()->json([
                'message' => "Erro ao cadastrar novo bloco",
                'err' => $e
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'nome' => 'required|string|max:255'
            ], [
                'nome.required' => 'O nome é obrigatório.',
                'nome.string' => 'O nome deve ser um texto.',
                'nome.max' => 'O nome pode ter no máximo 255 caracteres.'
            ]);

            $bloco = Bloco::find($id);
            if ($bloco == null) {
                return response()->json([
                    'message' => "Bloco não encontrado"
                ], 404);
            }

            $bloco->nome = $request->nome;
            $bloco->save();
            return response()->json([$bloco], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => "Erro ao atualizar novo bloco",
                'err' => $e
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $bloco = Bloco::find($id);
            if ($bloco == null) {
                return response()->json([
                    'message' => "Bloco não encontrado"
                ], 404);
            }

            $bloco->delete();
            return response()->json([null], 204);

        } catch (Exception $e) {
            return response()->json([
                'message' => "Erro ao cadastrar novo bloco",
                "err" => $e
            ], 500);
        }
    }
}
