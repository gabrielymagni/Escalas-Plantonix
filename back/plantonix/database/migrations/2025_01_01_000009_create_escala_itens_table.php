<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('escala_itens', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('escala_id');
            $table->unsignedInteger('funcionario_id')->nullable();
            $table->date('data');
            $table->string('turno', 2);
            $table->unsignedInteger('bloco_id');
            $table->string('tipo', 20)->nullable();
            $table->timestamps();

            $table->foreign('escala_id', 'fk_escala')
                ->references('id')->on('escalas')
                ->onDelete('cascade');

            $table->foreign('funcionario_id', 'fk_funcionario')
                ->references('id')->on('funcionarios')
                ->onDelete('set null');

            $table->foreign('bloco_id', 'fk_bloco')
                ->references('id')->on('blocos')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('escala_itens');
    }
};
