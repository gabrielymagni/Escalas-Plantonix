<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regra_blocos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('bloco_id')->nullable();
            $table->unsignedInteger('regra_id')->nullable();
            $table->integer('qtd_manha')->nullable();
            $table->integer('qtd_tarde')->nullable();
            $table->integer('qtd_noite')->nullable();
            $table->timestamps();

            $table->foreign('bloco_id', 'fk_bloco')->references('id')->on('blocos');
            $table->foreign('regra_id', 'fk_regras')->references('id')->on('regras');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regra_blocos');
    }
};
