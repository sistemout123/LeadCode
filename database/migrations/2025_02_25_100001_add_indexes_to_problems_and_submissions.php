<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('problems', function (Blueprint $table) {
            $table->index('difficulty');
            $table->index('order');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->index(['problem_id', 'created_at']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('problems', function (Blueprint $table) {
            $table->dropIndex(['difficulty']);
            $table->dropIndex(['order']);
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->dropIndex(['problem_id', 'created_at']);
            $table->dropIndex(['status']);
        });
    }
};
