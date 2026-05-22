<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegraController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlocoController;
use App\Http\Controllers\FuncionarioController;
use App\Http\Controllers\EscalaController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/escala', [EscalaController::class, 'gerarEscala']);
    Route::get('/escala/historico', [EscalaController::class, 'listarHistorico']);
    Route::get('/escala/{escalaId}/detalhes/{blocoId?}', [EscalaController::class, 'getEscalaPorId']);
    Route::get('/escala/{blocoId?}', [EscalaController::class, 'getEscala']);
    Route::put('/escala', [EscalaController::class, 'editarEscala']);

    Route::get('/bloco', [BlocoController::class, 'index']);
    Route::post('/bloco', [BlocoController::class, 'store']);
    Route::get('/bloco/{id}', [BlocoController::class, 'show']);
    Route::put('/bloco/{id}', [BlocoController::class, 'update']);
    Route::delete('/bloco/{id}', [BlocoController::class, 'destroy']);

    Route::get('/funcionario', [FuncionarioController::class, 'index']);
    Route::post('/funcionario', [FuncionarioController::class, 'store']);
    Route::get('/funcionario/{id}', [FuncionarioController::class, 'show']);
    Route::put('/funcionario/{id}', [FuncionarioController::class, 'update']);
    Route::delete('/funcionario/{id}', [FuncionarioController::class, 'destroy']);

    Route::get('/regra', [RegraController::class, 'index']);
    Route::post('/regra', [RegraController::class, 'store']);
    Route::get('/regra/{id}', [RegraController::class, 'show']);
    Route::put('/regra/{id}', [RegraController::class, 'update']);
    Route::delete('/regra/{id}', [RegraController::class, 'destroy']);
});
