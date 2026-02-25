<?php

namespace App\Services;

use App\Models\UserProgress;
use Illuminate\Support\Facades\DB;

class ProgressService
{
    private const XP_PER_LEVEL = 100;

    public function addXp(int $xpAmount, bool $solved = true): UserProgress
    {
        return DB::transaction(function () use ($xpAmount, $solved) {
            $progress = UserProgress::lockForUpdate()->firstOrCreate([], [
                'current_level' => 1,
                'xp_points' => 0,
            ]);

            $progress->xp_points += $xpAmount;
            $progress->problems_attempted++;

            if ($solved) {
                $progress->problems_solved++;
                $progress->current_streak++;
                $progress->best_streak = max($progress->best_streak, $progress->current_streak);
            }

            // GAP-014: Reset streak if last activity was not today
            if ($progress->last_activity_at && !$progress->last_activity_at->isToday()) {
                $progress->current_streak = $solved ? 1 : 0;
            }

            $progress->last_activity_at = now();

            while ($progress->xp_points >= self::XP_PER_LEVEL * $progress->current_level) {
                $progress->xp_points -= self::XP_PER_LEVEL * $progress->current_level;
                $progress->current_level++;
            }

            $progress->save();

            return $progress;
        });
    }

    public function getProgress(): UserProgress
    {
        return UserProgress::firstOrCreate([], [
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
