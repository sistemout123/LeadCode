<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Problem;
use App\Models\Submission;
use App\Services\Ai\AiProviderFactory;
use App\Services\ProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function __construct(
        private ProgressService $progressService
    ) {
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'problem_id' => 'required|exists:problems,id',
            'user_code' => 'required|string|max:50000',
            'status' => 'required|in:submitted,gave_up',
            'time_spent_seconds' => 'required|integer|min:0|max:86400',
            'language' => 'sometimes|string|max:50',
        ]);

        $problem = Problem::findOrFail($validated['problem_id']);
        $submission = Submission::create($validated);

        $aiFeedback = null;
        $provider = AiProviderFactory::create();

        if ($provider) {
            try {
                $aiFeedback = $provider->analyze(
                    $validated['user_code'],
                    $problem,
                    $validated['status']
                );

                $submission->update([
                    'ai_feedback' => $aiFeedback,
                    'ai_provider' => $provider->getProviderName(),
                    'ai_model' => $provider->getModelName(),
                ]);
            } catch (\Throwable $e) {
                report($e);
            }
        }

        if ($validated['status'] === 'submitted') {
            $alreadySolved = Submission::where('problem_id', $problem->id)
                ->where('status', 'submitted')
                ->where('id', '!=', $submission->id)
                ->exists();

            $this->progressService->addXp($alreadySolved ? 0 : $problem->xp_reward, !$alreadySolved);
        } else {
            $this->progressService->addXp(0, false);
        }

        return response()->json([
            'submission' => $submission->fresh(),
            'ai_feedback' => $aiFeedback,
            'solution' => $validated['status'] === 'gave_up' ? [
                'solution_code' => $problem->solution_code,
                'explanation' => $problem->explanation,
            ] : null,
            'progress' => $this->progressService->getProgress(),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Submission::with('problem:id,title,slug,difficulty')
            ->orderByDesc('created_at');

        if ($request->has('problem_id')) {
            $query->where('problem_id', $request->problem_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
    }

    public function show(Submission $submission): JsonResponse
    {
        $submission->load('problem:id,title,slug,difficulty');

        return response()->json($submission);
    }
}
