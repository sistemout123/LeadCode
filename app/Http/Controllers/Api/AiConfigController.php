<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiConfigController extends Controller
{
    public function index(): JsonResponse
    {
        $configs = AiConfig::all()->map(fn($c) => [
            'id' => $c->id,
            'provider' => $c->provider,
            'model_name' => $c->model_name,
            'is_active' => $c->is_active,
            'has_key' => !empty($c->api_key),
            'created_at' => $c->created_at,
        ]);

        return response()->json($configs);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'provider' => 'required|in:gemini,claude,openai',
            'api_key' => 'required|string',
            'model_name' => 'nullable|string|max:100',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validated['is_active'] ?? false) {
            AiConfig::where('is_active', true)->update(['is_active' => false]);
        }

        $config = AiConfig::updateOrCreate(
            ['provider' => $validated['provider']],
            $validated
        );

        return response()->json([
            'id' => $config->id,
            'provider' => $config->provider,
            'model_name' => $config->model_name,
            'is_active' => $config->is_active,
            'has_key' => true,
        ], 201);
    }

    public function update(Request $request, AiConfig $aiConfig): JsonResponse
    {
        $validated = $request->validate([
            'api_key' => 'sometimes|string',
            'model_name' => 'nullable|string|max:100',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validated['is_active'] ?? false) {
            AiConfig::where('id', '!=', $aiConfig->id)->update(['is_active' => false]);
        }

        $aiConfig->update($validated);

        return response()->json([
            'id' => $aiConfig->id,
            'provider' => $aiConfig->provider,
            'model_name' => $aiConfig->model_name,
            'is_active' => $aiConfig->is_active,
            'has_key' => !empty($aiConfig->api_key),
        ]);
    }

    public function destroy(AiConfig $aiConfig): JsonResponse
    {
        $aiConfig->delete();

        return response()->json(null, 204);
    }
}
