<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('problems', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->enum('difficulty', ['easy', 'medium', 'hard']);
            $table->text('description');
            $table->text('starter_code');
            $table->text('solution_code');
            $table->text('explanation');
            $table->integer('time_limit_minutes')->default(15);
            $table->integer('xp_reward')->default(10);
            $table->json('hints')->nullable();
            $table->json('test_cases')->nullable();
            $table->text('constraints')->nullable();
            $table->json('tags')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('problems');
    }
};
