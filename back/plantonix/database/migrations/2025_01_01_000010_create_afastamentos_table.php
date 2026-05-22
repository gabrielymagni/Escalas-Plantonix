<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('afastamentos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('funcionario_id');
            $table->date('inicio');
            $table->date('fim');
            $table->string('motivo', 20);
            $table->text('descricao')->nullable();
            $table->timestamps();

            $table->foreign('funcionario_id', 'fk_afastamento_funcionario')
                ->references('id')->on('funcionarios')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('afastamentos');
    }
};
