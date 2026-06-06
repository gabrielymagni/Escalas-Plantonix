<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('regra_blocos', function (Blueprint $table) {
            $table->dropColumn('qtd_plantoes');
        });
    }

    public function down(): void
    {
        Schema::table('regra_blocos', function (Blueprint $table) {
            $table->integer('qtd_plantoes')->default(0)->after('qtd_noite');
        });
    }
};
