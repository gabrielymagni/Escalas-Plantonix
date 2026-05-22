<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compensacoes', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('funcionario_id');
            $table->foreign('funcionario_id')->references('id')->on('funcionarios')->onDelete('cascade');
            $table->string('tipo', 50)->default('folga');
            $table->text('motivo')->nullable();
            $table->string('status', 20)->default('pendente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compensacoes');
    }
};
