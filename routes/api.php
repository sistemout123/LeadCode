<?php

use App\Http\Controllers\Api\AiConfigController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProblemController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\SubmissionController;
use Illuminate\Support\Facades\Route;

// Public routes (rate limited: 60 req/min)
Route::middleware('throttle:60,1')->group(function () {
    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);

    // Problems
    Route::get('/problems', [ProblemController::class, 'index']);
    Route::get('/problems/{problem}', [ProblemController::class, 'show']);
    Route::get('/problems/{problem}/solution', [ProblemController::class, 'solution']);

    // Submissions (stricter: 10 req/min for writes)
    Route::get('/submissions', [SubmissionController::class, 'index']);
    Route::get('/submissions/{submission}', [SubmissionController::class, 'show']);

    // Progress
    Route::get('/progress', [ProgressController::class, 'show']);

    // AI Config (read only - public)
    Route::get('/ai-configs', [AiConfigController::class, 'index']);
});

// Write routes (local use: 60 req/min to avoid false-positive throttling)
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/submissions', [SubmissionController::class, 'store']);
    Route::post('/problems/{problem}/hint', [ProblemController::class, 'hint']);
    Route::post('/ai-configs', [AiConfigController::class, 'store']);
    Route::put('/ai-configs/{aiConfig}', [AiConfigController::class, 'update']);
    Route::delete('/ai-configs/{aiConfig}', [AiConfigController::class, 'destroy']);
});
