<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('problems')->get();

        return response()->json($categories);
    }

    public function show(Category $category): JsonResponse
    {
        $category->load('problems:id,category_id,title,slug,difficulty,xp_reward,order');

        return response()->json($category);
    }
}
