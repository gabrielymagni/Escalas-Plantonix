<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regras', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tipo_profissional', 255)->nullable();
            $table->char('tipo_dia', 1)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regras');
    }
};
