<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notificacao;
use App\Models\NotificacaoLeitura;

class NotificacaoController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $notificacoes = Notificacao::whereDoesntHave('leituras', function ($q) use ($userId) {
            $q->where('funcionario_id', $userId);
        })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notificacoes, 200);
    }

    public function lidas(Request $request)
    {
        $userId = $request->user()->id;

        $notificacoes = Notificacao::whereHas('leituras', function ($q) use ($userId) {
            $q->where('funcionario_id', $userId);
        })
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json($notificacoes, 200);
    }

    public function marcarLida(Request $request, $id)
    {
        $notificacao = Notificacao::find($id);

        if ($notificacao === null) {
            return response()->json(['message' => 'Notificação não encontrada'], 404);
        }

        NotificacaoLeitura::firstOrCreate(
            ['notificacao_id' => $id, 'funcionario_id' => $request->user()->id],
            ['created_at' => now()]
        );

        return response()->json($notificacao, 200);
    }
}
