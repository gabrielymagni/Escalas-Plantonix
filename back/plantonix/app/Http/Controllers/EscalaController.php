<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Escala;
use App\Models\Afastamento;
use App\Models\Compensacao;
use App\Models\Funcionario;
use App\Models\Notificacao;
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
            'fim'    => 'required|date|after_or_equal:inicio',
        ]);

        $escalaModel = new Escala();

        $resultado = $escalaModel->gerarEscalaMes([
            'inicio' => $request->inicio,
            'fim'    => $request->fim,
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
     * 🔹 Busca escala (última criada) com filtro opcional de bloco e período
     *
     * Query param opcional: ?inicio=YYYY-MM-DD → busca a escala ativa que cobre essa data
     */
    public function getEscala(Request $request, $blocoId = null)
    {
        if ($request->has('inicio')) {
            $inicio = $request->input('inicio');
            $escala = Escala::ativa()
                ->where('inicio', '<=', $inicio)
                ->where('fim', '>=', $inicio)
                ->latest()
                ->first();
        } else {
            $escala = Escala::ativa()->latest()->first();
        }

        if (!$escala) {
            return response()->json([
                'escala_id'    => null,
                'data'         => [],
                'deficiencias' => [],
            ]);
        }

        $escalaModel  = new Escala();
        $resultado    = $escalaModel->getEscala($escala->id, $blocoId);
        $deficiencias = $escalaModel->getDeficiencias($escala->id, $blocoId ? (int) $blocoId : null);
        $afastados    = $this->getAfastadosNoPeriodo($escala->inicio, $escala->fim, $blocoId ? (int) $blocoId : null);

        return response()->json([
            'escala_id'    => $escala->id,
            'inicio'       => $escala->inicio,
            'fim'          => $escala->fim,
            'data'         => $resultado,
            'deficiencias' => $deficiencias,
            'afastados'    => $afastados,
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

        $escalaModel  = new Escala();
        $resultado    = $escalaModel->getEscala($escala->id, $blocoId);
        $deficiencias = $escalaModel->getDeficiencias($escala->id, $blocoId ? (int) $blocoId : null);
        $afastados    = $this->getAfastadosNoPeriodo($escala->inicio, $escala->fim, $blocoId ? (int) $blocoId : null);

        return response()->json([
            'escala_id'    => $escala->id,
            'inicio'       => $escala->inicio,
            'fim'          => $escala->fim,
            'data'         => $resultado,
            'deficiencias' => $deficiencias,
            'afastados'    => $afastados,
        ]);
    }

    /**
     * 🔹 Retorna funcionários afastados no período da escala, filtrados por bloco (opcional)
     */
    private function getAfastadosNoPeriodo(string $inicio, string $fim, ?int $blocoId = null): array
    {
        return Afastamento::with('funcionario')
            ->where('inicio', '<=', $fim)
            ->where('fim', '>=', $inicio)
            ->whereHas('funcionario', function ($q) use ($blocoId) {
                $q->where('faz_plantao', true);
                if ($blocoId) {
                    $q->whereHas('blocos', function ($b) use ($blocoId) {
                        $b->where('blocos.id', $blocoId);
                    });
                }
            })
            ->get()
            ->map(fn($a) => [
                'nome'   => $a->funcionario->nome ?? '—',
                'motivo' => $a->motivo,
                'inicio' => substr($a->inicio, 0, 10),
                'fim'    => substr($a->fim, 0, 10),
            ])
            ->values()
            ->toArray();
    }

    /**
     * 🔹 Edita turnos da escala
     *
     * RN-MT: se um colaborador 6x1 tiver seu turno alterado de M/T → MT,
     * gera automaticamente uma compensação de folga.
     * Se reverter de MT → M/T, remove a compensação pendente vinculada ao item.
     */
    public function editarEscala(Request $request)
    {
        $request->validate([
            'itens' => 'required|array',
        ]);

        // Processa regra RN-MT antes de salvar as alterações
        foreach ($request->itens as $item) {
            $itemAtual = DB::table('escala_itens as ei')
                ->join('funcionarios as f', 'f.id', '=', 'ei.funcionario_id')
                ->where('ei.id', $item['id'])
                ->whereNotNull('ei.funcionario_id')
                ->select('ei.turno as turno_atual', 'f.id as funcionario_id', 'f.tipo_escala', 'f.nome')
                ->first();

            // Regra aplica-se somente a trabalhadores 6x1 com funcionário alocado
            if (!$itemAtual || $itemAtual->tipo_escala !== '6x1') {
                continue;
            }

            $turnoAntigo = $itemAtual->turno_atual;
            $turnoNovo   = $item['turno'];

            // M, T ou F → MT: criar compensação de folga
            if (in_array($turnoAntigo, ['M', 'T', 'F']) && $turnoNovo === 'MT') {
                $compensacao = Compensacao::create([
                    'funcionario_id' => $itemAtual->funcionario_id,
                    'escala_item_id' => $item['id'],
                    'tipo'           => 'folga',
                    'motivo'         => "Turno MT atribuído manualmente na escala (RN-MT)",
                    'status'         => 'pendente',
                ]);

                Notificacao::create([
                    'tipo'     => 'compensacao',
                    'mensagem' => "Funcionário {$itemAtual->nome} recebeu turno MT manual e tem direito a 1 dia de folga (RN-MT).",
                    'dados'    => json_encode([
                        'funcionario_id'  => $itemAtual->funcionario_id,
                        'nome'            => $itemAtual->nome,
                        'compensacao_id'  => $compensacao->id,
                        'escala_item_id'  => $item['id'],
                        'link'            => '/private/compensacoes',
                    ]),
                    'lida' => false,
                ]);
            }

            // MT → M, T, N ou F: remover compensação pendente vinculada ao item
            if ($turnoAntigo === 'MT' && $turnoNovo !== 'MT') {
                Compensacao::where('escala_item_id', $item['id'])
                    ->where('status', 'pendente')
                    ->delete();
            }
        }

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
