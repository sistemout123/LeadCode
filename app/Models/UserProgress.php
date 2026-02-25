<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProgress extends Model
{
    protected $table = 'user_progress';

    protected $fillable = [
        'current_level',
        'xp_points',
        'problems_solved',
        'problems_attempted',
        'current_streak',
        'best_streak',
        'last_activity_at',
        'level_progress',
    ];

    protected function casts(): array
    {
        return [
            'current_level' => 'integer',
            'xp_points' => 'integer',
            'problems_solved' => 'integer',
            'problems_attempted' => 'integer',
            'current_streak' => 'integer',
            'best_streak' => 'integer',
            'last_activity_at' => 'datetime',
            'level_progress' => 'array',
        ];
    }
}
