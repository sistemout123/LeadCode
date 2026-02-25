<?php

namespace App\Services\Ai;

use App\Models\AiConfig;

class AiProviderFactory
{
    public static function create(?AiConfig $config = null): ?AiProviderInterface
    {
        $config ??= AiConfig::where('is_active', true)->first();

        if (!$config) {
            return null;
        }

        return match ($config->provider) {
            'gemini' => new GeminiProvider($config->api_key, $config->model_name ?? 'gemini-2.0-flash'),
            'claude' => new ClaudeProvider($config->api_key, $config->model_name ?? 'claude-sonnet-4-20250514'),
            'openai' => new GptProvider($config->api_key, $config->model_name ?? 'gpt-4o-mini'),
            default => null,
        };
    }
}
