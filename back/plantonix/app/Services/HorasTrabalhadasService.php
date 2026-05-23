<?php

namespace App\Services;

use App\Models\Compensacao;
use App\Models\Escala;
use App\Models\Funcionario;
use App\Models\Notificacao;
use Illuminate\Support\Facades\DB;

class HorasTrabalhadasService
{
    const LIMITE_HORAS = 144;

    public function calcularHorasPorEscala(int $funcionarioId, int $escalaId): float
    {
        $itens = DB::table('escala_itens as ei')
            ->join('funcionarios as f', 'f.id', '=', 'ei.funcionario_id')
            ->where('ei.escala_id', $escalaId)
            ->where('ei.funcionario_id', $funcionarioId)
            ->whereNotNull('ei.funcionario_id')
            ->where('ei.data', '<=', now()->toDateString())
            ->select('f.tipo_escala')
            ->get();

        return $itens->sum(fn($item) => $this->horasPorTipoEscala($item->tipo_escala));
    }

    public function calcularHorasAtivas(int $funcionarioId): array
    {
        $escalas = Escala::ativa()->get(['id', 'inicio', 'fim']);

        $porEscala = [];
        $total = 0.0;

        foreach ($escalas as $escala) {
            $horas = $this->calcularHorasPorEscala($funcionarioId, $escala->id);
            if ($horas > 0) {
                $porEscala[] = [
                    'escala_id' => $escala->id,
                    'inicio'    => $escala->inicio,
                    'fim'       => $escala->fim,
                    'horas'     => $horas,
                ];
                $total += $horas;
            }
        }

        return [
            'funcionario_id' => $funcionarioId,
            'horas_totais'   => $total,
            'por_escala'     => $porEscala,
        ];
    }

    /**
     * Verifica se o funcionário atingiu 144h e cria compensações + notificações pendentes.
     * Atualiza horas_checkpoint para evitar duplicação.
     */
    public function verificarEGerarCompensacoes(int $funcionarioId): void
    {
        $funcionario = Funcionario::find($funcionarioId);

        if (!$funcionario || !$funcionario->faz_plantao || $funcionario->tipo_escala !== '12x36') {
            return;
        }

        $resultado   = $this->calcularHorasAtivas($funcionarioId);
        $horasTotais = $resultado['horas_totais'];
        $checkpoint  = (float) ($funcionario->horas_checkpoint ?? 0);
        $horasLivres = $horasTotais - $checkpoint;

        if ($horasLivres < self::LIMITE_HORAS) {
            return;
        }

        $novoCheckpoint = $checkpoint;

        while ($horasLivres >= self::LIMITE_HORAS) {
            $novoCheckpoint += self::LIMITE_HORAS;
            $horasLivres    -= self::LIMITE_HORAS;

            Compensacao::create([
                'funcionario_id' => $funcionarioId,
                'tipo'           => 'folga',
                'motivo'         => "Atingiu " . self::LIMITE_HORAS . "h trabalhadas (RN005)",
                'status'         => 'pendente',
            ]);

            Notificacao::create([
                'tipo'     => 'compensacao',
                'mensagem' => "Funcionário {$funcionario->nome} atingiu {$novoCheckpoint}h trabalhadas e tem direito a 1 dia de folga (RN005).",
                'dados'    => json_encode([
                    'funcionario_id' => $funcionarioId,
                    'nome'           => $funcionario->nome,
                    'horas'          => $novoCheckpoint,
                    'link'           => '/private/compensacoes',
                ]),
                'lida' => false,
            ]);
        }

        DB::table('funcionarios')
            ->where('id', $funcionarioId)
            ->update(['horas_checkpoint' => $novoCheckpoint]);
    }

    private function horasPorTipoEscala(string $tipoEscala): int
    {
        return match ($tipoEscala) {
            '12x36' => 12,
            '6x1'   => 6,
            '5x2'   => 8,
            default => 0,
        };
    }
}
