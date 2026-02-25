<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    protected $fillable = [
        'problem_id',
        'user_code',
        'status',
        'time_spent_seconds',
        'ai_feedback',
        'ai_provider',
        'ai_model',
        'language',
    ];

    protected function casts(): array
    {
        return [
            'time_spent_seconds' => 'integer',
        ];
    }

    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }
}
