<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('compensacoes', function (Blueprint $table) {
            // Referência ao item de escala que originou a compensação (turno MT manual).
            // Nullable para manter compatibilidade com compensações antigas (144h).
            $table->unsignedBigInteger('escala_item_id')->nullable()->after('funcionario_id');
            $table->foreign('escala_item_id')->references('id')->on('escala_itens')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('compensacoes', function (Blueprint $table) {
            $table->dropForeign(['escala_item_id']);
            $table->dropColumn('escala_item_id');
        });
    }
};
