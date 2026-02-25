<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Arrays', 'slug' => 'arrays', 'icon' => '📊', 'color' => '#3B82F6', 'description' => 'Problemas envolvendo manipulação de arrays, subarrays e técnicas como two pointers e sliding window.'],
            ['name' => 'Strings', 'slug' => 'strings', 'icon' => '🔤', 'color' => '#10B981', 'description' => 'Problemas de manipulação de strings, palíndromos, anagramas e pattern matching.'],
            ['name' => 'Hash Tables', 'slug' => 'hash-tables', 'icon' => '🗂️', 'color' => '#F59E0B', 'description' => 'Problemas usando hash maps, sets e técnicas de lookup O(1).'],
            ['name' => 'Linked Lists', 'slug' => 'linked-lists', 'icon' => '🔗', 'color' => '#EF4444', 'description' => 'Problemas com listas ligadas simples e duplas, ciclos e reversão.'],
            ['name' => 'Trees', 'slug' => 'trees', 'icon' => '🌳', 'color' => '#22C55E', 'description' => 'Problemas com árvores binárias, BSTs, traversals e recursão.'],
            ['name' => 'Dynamic Programming', 'slug' => 'dynamic-programming', 'icon' => '🧩', 'color' => '#8B5CF6', 'description' => 'Problemas de programação dinâmica, memoização e subproblemas ótimos.'],
            ['name' => 'Sorting & Searching', 'slug' => 'sorting-searching', 'icon' => '🔍', 'color' => '#06B6D4', 'description' => 'Algoritmos de ordenação, busca binária e técnicas de divide and conquer.'],
            ['name' => 'Stack & Queue', 'slug' => 'stack-queue', 'icon' => '📚', 'color' => '#F97316', 'description' => 'Problemas usando pilhas, filas, deques e monotonic stacks.'],
            ['name' => 'Graphs', 'slug' => 'graphs', 'icon' => '🕸️', 'color' => '#EC4899', 'description' => 'Problemas de grafos, BFS, DFS, topological sort e shortest path.'],
            ['name' => 'Math & Logic', 'slug' => 'math-logic', 'icon' => '🧮', 'color' => '#14B8A6', 'description' => 'Problemas matemáticos, bit manipulation e lógica.'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
