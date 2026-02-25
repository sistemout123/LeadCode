<?php

namespace Database\Seeders;

use App\Models\UserProgress;
use Illuminate\Database\Seeder;

class UserProgressSeeder extends Seeder
{
    public function run(): void
    {
        UserProgress::create([
            'current_level' => 1,
            'xp_points' => 0,
            'problems_solved' => 0,
            'problems_attempted' => 0,
            'current_streak' => 0,
            'best_streak' => 0,
            'level_progress' => [],
        ]);
    }
}
