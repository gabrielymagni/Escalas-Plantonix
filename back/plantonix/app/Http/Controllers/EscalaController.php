<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Escala;
use App\Models\Funcionario;
use App\Services\AuditLogger;
use App\Services\HorasTrabalhadasService;

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

        AuditLogger::log('GERAR_ESCALA', 'Escala', null, [
            'inicio' => $request->inicio,
            'fim'    => $request->fim,
        ]);

        $service = new HorasTrabalhadasService();
        $ids = Funcionario::where('faz_plantao', true)->pluck('id');
        foreach ($ids as $id) {
            $service->verificarEGerarCompensacoes($id);
        }

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
        $escala = Escala::ativa()->latest()->first();

        if (!$escala) {
            return response()->json([
                'escala_id' => null,
                'data' => []
            ]);
        }

        $resultado = (new Escala())->getEscala($escala->id, $blocoId);

        return response()->json([
            'escala_id' => $escala->id,
            'data' => $resultado
        ]);
    }

    /**
     * 🔹 Lista todas as escalas geradas (histórico)
     */
    public function listarHistorico()
    {
        $escalas = Escala::orderBy('created_at', 'desc')
            ->leftJoin('funcionarios as f', 'f.id', '=', 'escalas.gerado_por')
            ->select('escalas.id', 'escalas.inicio', 'escalas.fim', 'escalas.status', 'escalas.created_at', 'f.nome as gerado_por_nome')
            ->get();

        return response()->json(['data' => $escalas]);
    }

    /**
     * 🔹 Busca escala específica por ID com filtro opcional de bloco
     */
    public function getEscalaPorId($escalaId, $blocoId = null)
    {
        $escala = Escala::find($escalaId);

        if (!$escala) {
            return response()->json(['message' => 'Escala não encontrada'], 404);
        }

        $resultado = (new Escala())->getEscala($escala->id, $blocoId);

        return response()->json([
            'escala_id' => $escala->id,
            'inicio'    => $escala->inicio,
            'fim'       => $escala->fim,
            'data'      => $resultado
        ]);
    }

    /**
     * 🔹 Edita turnos da escala
     */
    public function editarEscala(Request $request)
    {
        $request->validate([
            'itens' => 'required|array',
            // 'itens.*.id' => 'required|integer|exists:escala_itens,id',
            // 'itens.*.turno' => 'required|in:M,T,N',
        ]);

        $escalaModel = new Escala();

        $resultado = $escalaModel->editarEscalaItens(
            $request->itens
        );

        return response()->json([
            'message' => 'Escala atualizada com sucesso',
            'data' => $resultado
        ]);
    }
}
