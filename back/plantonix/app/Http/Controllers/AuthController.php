<?php

namespace App\Http\Controllers;

use App\Models\Funcionario;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller {
	public function login(Request $request) {
		$credentials = $request->validate([
			'email'    => 'required|email',
			'password' => 'required|string',
		]);

		if (!Auth::attempt($credentials)) {
			AuditLogger::log('LOGIN_FALHOU', 'Auth', null, ['email' => $request->email]);
			return response()->json(['message' => 'Credenciais inválidas.'], 401);
		}

		/** @var Funcionario $funcionario */
		$funcionario = Auth::user();

		$funcionario->tokens()->delete();

		$accessToken  = $funcionario->createToken('access', ['*'], now()->addMinutes(config('auth.access_token_ttl')));
		$refreshToken = $funcionario->createToken('refresh', ['refresh'], now()->addMinutes(config('auth.refresh_token_ttl')));

		AuditLogger::log('LOGIN', 'Auth', $funcionario->id, [
			'nome'  => $funcionario->nome,
			'cargo' => $funcionario->cargo,
		]);

		return response()->json([
			'access_token' => $accessToken->plainTextToken,
			'token_type'   => 'Bearer',
			'expires_in'   => config('auth.access_token_ttl') * 60,
			'funcionario'  => [
				'id'          => $funcionario->id,
				'nome'        => $funcionario->nome,
				'email'       => $funcionario->email,
				'cargo'       => $funcionario->cargo,
				'faz_plantao' => $funcionario->faz_plantao,
			],
		])->cookie(
			'refresh_token',
			$refreshToken->plainTextToken,
			config('auth.refresh_token_ttl'),
			'/',
			null,
			true,
			true,
			false,
			'Strict'
		);
	}

	public function refresh(Request $request) {
		$refreshTokenValue = $request->cookie('refresh_token');

		if (!$refreshTokenValue) {
			return response()->json(['message' => 'Refresh token não encontrado.'], 401);
		}

		[$id, $token] = explode('|', $refreshTokenValue, 2);

		$tokenRecord = \Laravel\Sanctum\PersonalAccessToken::find($id);

		if (
			!$tokenRecord ||
			!hash_equals($tokenRecord->token, hash('sha256', $token)) ||
			!in_array('refresh', $tokenRecord->abilities) ||
			($tokenRecord->expires_at && $tokenRecord->expires_at->isPast())
		) {
			return response()->json(['message' => 'Refresh token inválido ou expirado.'], 401);
		}

		/** @var Funcionario $funcionario */
		$funcionario = $tokenRecord->tokenable;

		$funcionario->tokens()->delete();

		$accessToken  = $funcionario->createToken('access', ['*'], now()->addMinutes(config('auth.access_token_ttl')));
		$refreshToken = $funcionario->createToken('refresh', ['refresh'], now()->addMinutes(config('auth.refresh_token_ttl')));

		return response()->json([
			'access_token' => $accessToken->plainTextToken,
			'token_type'   => 'Bearer',
			'expires_in'   => config('auth.access_token_ttl') * 60,
		])->cookie(
			'refresh_token',
			$refreshToken->plainTextToken,
			config('auth.refresh_token_ttl'),
			'/',
			null,
			true,
			true,
			false,
			'Strict'
		);
	}

	public function logout(Request $request) {
		/** @var Funcionario $funcionario */
		$funcionario = Auth::user();

		AuditLogger::log('LOGOUT', 'Auth', $funcionario->id, [
			'nome' => $funcionario->nome,
		]);

		$funcionario->tokens()->delete();

		return response()->json(['message' => 'Logout realizado com sucesso.'])
			->withoutCookie('refresh_token');
	}
}
