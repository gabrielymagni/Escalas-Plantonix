<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('funcionarios', function (Blueprint $table) {
            $table->string('turno', 50)->nullable();
            $table->string('tipo_escala', 50)->nullable();
            $table->date('data_contratacao')->nullable();
            $table->string('password', 255)->nullable();
            $table->string('remember_token', 100)->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->boolean('faz_plantao')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('funcionarios', function (Blueprint $table) {
            $table->dropColumn([
                'turno',
                'tipo_escala',
                'data_contratacao',
                'password',
                'remember_token',
                'email_verified_at',
                'faz_plantao',
            ]);
        });
    }
};
