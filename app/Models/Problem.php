<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Problem extends Model
{
    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'difficulty',
        'description',
        'starter_code',
        'solution_code',
        'explanation',
        'time_limit_minutes',
        'xp_reward',
        'hints',
        'test_cases',
        'constraints',
        'tags',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'hints' => 'array',
            'test_cases' => 'array',
            'tags' => 'array',
            'xp_reward' => 'integer',
            'time_limit_minutes' => 'integer',
            'order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }
}
