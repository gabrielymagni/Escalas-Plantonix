<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notificacao;

class NotificacaoController extends Controller
{
    public function index()
    {
        $notificacoes = Notificacao::where('lida', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notificacoes, 200);
    }

    public function marcarLida($id)
    {
        $notificacao = Notificacao::find($id);

        if ($notificacao === null) {
            return response()->json(['message' => 'Notificação não encontrada'], 404);
        }

        $notificacao->update(['lida' => true]);

        return response()->json($notificacao, 200);
    }
}
