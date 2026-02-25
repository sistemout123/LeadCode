<?php

namespace App\Services\Ai;

use App\Models\Problem;

interface AiProviderInterface
{
    public function analyze(string $code, Problem $problem, string $type): string;
    public function getProviderName(): string;
    public function getModelName(): string;
}
