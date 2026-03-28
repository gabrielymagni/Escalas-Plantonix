<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlocoController;
use App\Http\Controllers\FuncionarioController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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
