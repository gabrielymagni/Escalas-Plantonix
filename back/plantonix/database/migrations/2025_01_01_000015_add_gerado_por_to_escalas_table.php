<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('escalas', function (Blueprint $table) {
            $table->unsignedInteger('gerado_por')->nullable()->after('status');
            $table->foreign('gerado_por')->references('id')->on('funcionarios')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('escalas', function (Blueprint $table) {
            $table->dropForeign(['gerado_por']);
            $table->dropColumn('gerado_por');
        });
    }
};
