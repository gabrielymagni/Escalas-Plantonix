<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notificacao_leituras', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('notificacao_id');
            $table->unsignedInteger('funcionario_id');
            $table->timestamp('created_at')->nullable();

            $table->foreign('notificacao_id')->references('id')->on('notificacoes')->onDelete('cascade');
            $table->foreign('funcionario_id')->references('id')->on('funcionarios')->onDelete('cascade');
            $table->unique(['notificacao_id', 'funcionario_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificacao_leituras');
    }
};
