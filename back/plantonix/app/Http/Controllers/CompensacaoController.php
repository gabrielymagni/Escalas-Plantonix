<?php

namespace App\Http\Controllers;

use App\Models\Compensacao;
use Illuminate\Http\Request;

class CompensacaoController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');

        $compensacoes = Compensacao::with('funcionario:id,nome,cargo')
            ->when($status, fn($q) => $q->where('status', $status))
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $compensacoes]);
    }

    public function resolver($id)
    {
        $compensacao = Compensacao::find($id);

        if (!$compensacao) {
            return response()->json(['message' => 'Compensação não encontrada'], 404);
        }

        if ($compensacao->status === 'resolvida') {
            return response()->json(['message' => 'Compensação já foi resolvida'], 422);
        }

        $compensacao->update(['status' => 'resolvida']);

        return response()->json(['data' => $compensacao]);
    }
}
