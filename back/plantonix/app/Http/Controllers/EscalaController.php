<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Escala;

class EscalaController extends Controller
{
    /**
     * 🔹 Gera uma nova escala
     */
    public function gerarEscala(Request $request)
    {
        $request->validate([
            'inicio' => 'required|date',
            'fim' => 'required|date|after_or_equal:inicio'
        ]);

        $escalaModel = new Escala();

        $resultado = $escalaModel->gerarEscalaMes([
            'inicio' => $request->inicio,
            'fim' => $request->fim
        ]);

        return response()->json([
            'message' => 'Escala gerada com sucesso',
            'data' => $resultado
        ]);
    }

    /**
     * 🔹 Busca escala (última criada) com filtro opcional de bloco
     */
    public function getEscala($blocoId = null)
    {
        $escala = Escala::latest()->first();

        if (!$escala) {
            return response()->json([
                'message' => 'Nenhuma escala encontrada'
            ], 404);
        }

        $resultado = (new Escala())->getEscala($escala->id, $blocoId);

        return response()->json([
            'escala_id' => $escala->id,
            'data' => $resultado
        ]);
    }
}
