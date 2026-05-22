<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegraController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlocoController;
use App\Http\Controllers\FuncionarioController;
use App\Http\Controllers\EscalaController;
use App\Http\Controllers\AfastamentoController;
use App\Http\Controllers\NotificacaoController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // leitura: qualquer autenticado
    Route::get('/escala/historico', [EscalaController::class, 'listarHistorico']);
    Route::get('/escala/{escalaId}/detalhes/{blocoId?}', [EscalaController::class, 'getEscalaPorId']);
    Route::get('/escala/{blocoId?}', [EscalaController::class, 'getEscala']);
    Route::get('/bloco', [BlocoController::class, 'index']);
    Route::get('/bloco/{id}', [BlocoController::class, 'show']);
    Route::get('/funcionario', [FuncionarioController::class, 'index']);
    Route::get('/funcionario/{id}', [FuncionarioController::class, 'show']);
    Route::get('/regra', [RegraController::class, 'index']);
    Route::get('/regra/{id}', [RegraController::class, 'show']);

    // escrita: apenas admin
    Route::middleware('admin')->group(function () {
        Route::post('/escala', [EscalaController::class, 'gerarEscala']);
        Route::put('/escala', [EscalaController::class, 'editarEscala']);

        Route::post('/bloco', [BlocoController::class, 'store']);
        Route::put('/bloco/{id}', [BlocoController::class, 'update']);
        Route::delete('/bloco/{id}', [BlocoController::class, 'destroy']);

        Route::post('/funcionario', [FuncionarioController::class, 'store']);
        Route::put('/funcionario/{id}', [FuncionarioController::class, 'update']);
        Route::delete('/funcionario/{id}', [FuncionarioController::class, 'destroy']);

        Route::post('/regra', [RegraController::class, 'store']);
        Route::put('/regra/{id}', [RegraController::class, 'update']);
        Route::delete('/regra/{id}', [RegraController::class, 'destroy']);

        Route::post('/funcionario/{id}/afastamento', [AfastamentoController::class, 'store']);
        Route::delete('/afastamento/{id}', [AfastamentoController::class, 'destroy']);

        Route::get('/notificacoes', [NotificacaoController::class, 'index']);
        Route::put('/notificacoes/{id}/lida', [NotificacaoController::class, 'marcarLida']);
    });
});
