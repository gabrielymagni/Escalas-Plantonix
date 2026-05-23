<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Funcionario;
use App\Services\AuditLogger;
use App\Services\HorasTrabalhadasService;

class FuncionarioController extends Controller
{
    public function index()
    {
        $funcionarios = Funcionario::getFuncionarios();
        return response()->json($funcionarios, 200);
    }

    public function show($id)
    {
        $funcionario = Funcionario::findFuncionario($id);
        if ($funcionario == null) {
            return response()->json(["message" => "Funcionário não encontrado", 404]);
        }

        return response()->json([$funcionario], 200);
    }

    public function store(Request $request)
    {
        try {
            $fazPlantao = $request->boolean('faz_plantao');

            $request->validate([
                "nome" => 'required|string|max:255',
                "email" => 'required|string|max:255',
                "coren" => 'required|string|max:20',
                "turno" => [Rule::requiredIf($fazPlantao), 'nullable', 'string', 'max:2'],
                "tipo_escala" => [Rule::requiredIf($fazPlantao), 'nullable', 'string', 'max:6'],
                "data_contratacao" => 'required|date',
                "cargo" => "required|string|max:255",
                "blocos" => [Rule::requiredIf($fazPlantao), 'nullable', 'array'],
            ]);

            if ($fazPlantao) {
                $erroRN001 = $this->validarRN001($request->input('tipo_escala'), $request->input('turno'));
                if ($erroRN001) {
                    return response()->json(['message' => $erroRN001], 422);
                }
            }

            $funcionario = Funcionario::createFuncinario($request);
            if ($funcionario['err'] != null) {
                return response()->json(["message" => "Erro ao criar novo funcionário", "err" => $funcionario['err']], 500);
            }

            AuditLogger::log('CREATE', 'Funcionario', $funcionario['funcionario']->id, [
                'nome'  => $funcionario['funcionario']->nome,
                'cargo' => $funcionario['funcionario']->cargo,
                'coren' => $funcionario['funcionario']->coren,
            ]);

            return response()->json([$funcionario['funcionario']], 201);
        } catch (Exception $e) {
            return response()->json(["message" => "Erro ao criar novo funcionário", "err" => $e], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $fazPlantao = $request->boolean('faz_plantao');

            $request->validate([
                "nome" => 'required|string|max:255',
                "email" => 'required|string|max:255',
                "coren" => 'required|string|max:20',
                "turno" => [Rule::requiredIf($fazPlantao), 'nullable', 'string', 'max:2'],
                "tipo_escala" => [Rule::requiredIf($fazPlantao), 'nullable', 'string', 'max:6'],
                "data_contratacao" => 'required|date',
                "cargo" => "required|string|max:255",
                "blocos" => [Rule::requiredIf($fazPlantao), 'nullable', 'array'],
            ]);

            if ($fazPlantao) {
                $erroRN001 = $this->validarRN001($request->input('tipo_escala'), $request->input('turno'));
                if ($erroRN001) {
                    return response()->json(['message' => $erroRN001], 422);
                }
            }

            $funcionario = Funcionario::updateFuncinario($request, $id);
            if ($funcionario['err'] != null) {
                $cod = $funcionario['err'] == 404 ? 404 : 500;
                return response()->json([
                    "message" => "Erro ao atualizar funcionário",
                    "err" => $funcionario['err']
                ], $cod);
            }

            AuditLogger::log('UPDATE', 'Funcionario', $id, [
                'nome'  => $funcionario['funcionario']->nome,
                'cargo' => $funcionario['funcionario']->cargo,
                'coren' => $funcionario['funcionario']->coren,
            ]);

            return response()->json([$funcionario['funcionario']], 200);
        } catch (Exception $e) {
            return response()->json(["message" => "Erro ao atualizar funcionário", "err" => $e], 500);
        }
    }

    public function getHoras($id)
    {
        $funcionario = Funcionario::find($id);
        if (!$funcionario) {
            return response()->json(['message' => 'Funcionário não encontrado'], 404);
        }

        $service = new HorasTrabalhadasService();
        $service->verificarEGerarCompensacoes((int) $id);
        $resultado = $service->calcularHorasAtivas((int) $id);

        return response()->json($resultado, 200);
    }

    private function validarRN001(?string $tipoEscala, ?string $turno): ?string
    {
        $turnosValidos = [
            '6x1'   => ['M', 'T'],
            '5x2'   => ['MT'],
            '12x36' => ['N'],
        ];

        if ($tipoEscala === null || $turno === null) {
            return null;
        }

        if (!isset($turnosValidos[$tipoEscala])) {
            return "Tipo de escala '{$tipoEscala}' inválido (RN001).";
        }

        if (!in_array($turno, $turnosValidos[$tipoEscala])) {
            return "O turno '{$turno}' não é permitido para a escala '{$tipoEscala}' (RN001).";
        }

        return null;
    }

    public function destroy($id)
    {
        $r = Funcionario::destroyFuncionario($id);
        if ($r == 404) {
            return response(['message' => 'Funcionário não encontrado'], 404);
        }
        if ($r != null) {
            return response(['message' => 'Erro ao excluir funcionário', 'err' => $r], 500);
        }

        AuditLogger::log('DELETE', 'Funcionario', $id);

        return response([null], 204);
    }
}
