<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProgressService;
use Illuminate\Http\JsonResponse;

class ProgressController extends Controller
{
    public function __construct(
        private ProgressService $progressService
    ) {
    }

    public function show(): JsonResponse
    {
        return response()->json($this->progressService->getProgress());
    }
}
