<?php

namespace App\Services;

use App\Models\Escala;
use Illuminate\Support\Facades\DB;

class HorasTrabalhadasService
{
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
        $escalasAtivas = Escala::ativa()->get(['id', 'inicio', 'fim']);

        $porEscala = [];
        $total = 0.0;

        foreach ($escalasAtivas as $escala) {
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
