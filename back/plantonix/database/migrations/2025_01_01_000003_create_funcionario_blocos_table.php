<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('funcionario_blocos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('funcionario_id')->nullable();
            $table->unsignedInteger('bloco_id')->nullable();
            $table->integer('ordem')->nullable();
            $table->timestamps();

            $table->foreign('bloco_id', 'fk_bloco')->references('id')->on('blocos');
            $table->foreign('funcionario_id', 'fk_funcionario')->references('id')->on('funcionarios');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('funcionario_blocos');
    }
};
