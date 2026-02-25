<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Problem;
use App\Services\Ai\AiProviderFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProblemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Problem::with('category:id,name,slug,icon,color')
            ->select('id', 'category_id', 'title', 'slug', 'difficulty', 'xp_reward', 'time_limit_minutes', 'order', 'tags');

        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        if ($request->has('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->has('search')) {
            $search = str_replace(['%', '_'], ['\\%', '\\_'], $request->search);
            $query->where('title', 'LIKE', "%{$search}%");
        }

        $problems = $query->orderBy('order')->get();

        return response()->json($problems);
    }

    public function show(Problem $problem): JsonResponse
    {
        $problem->load('category:id,name,slug,icon,color');

        return response()->json($problem->only([
            'id',
            'title',
            'slug',
            'difficulty',
            'description',
            'starter_code',
            'time_limit_minutes',
            'xp_reward',
            'hints',
            'constraints',
            'tags',
            'test_cases',
            'category',
            'order',
        ]));
    }

    public function solution(Problem $problem): JsonResponse
    {
        $hasAttempted = $problem->submissions()->exists();

        if (!$hasAttempted) {
            return response()->json([
                'message' => 'Você precisa tentar resolver o problema antes de ver a solução.',
            ], 403);
        }

        return response()->json([
            'solution_code' => $problem->solution_code,
            'explanation' => $problem->explanation,
        ]);
    }

    public function hint(Problem $problem, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_code' => 'required|string|max:50000',
        ]);

        $provider = AiProviderFactory::create();

        if (!$provider) {
            return response()->json([
                'hint' => 'Configure uma API de IA em Configurações para receber dicas.',
            ], 400);
        }

        try {
            $hint = $provider->analyze($validated['user_code'], $problem, 'hint');

            return response()->json(['hint' => $hint]);
        } catch (\Throwable $e) {
            report($e);
            return response()->json([
                'hint' => 'Não foi possível gerar a dica. Tente novamente.',
            ], 500);
        }
    }
}
