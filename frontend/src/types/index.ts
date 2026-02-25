export interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    color: string;
    description: string | null;
    problems_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Problem {
    id: number;
    category_id: number;
    title: string;
    slug: string;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
    starter_code: string;
    solution_code?: string;
    explanation?: string;
    time_limit_minutes: number;
    xp_reward: number;
    hints: string[] | null;
    test_cases: TestCase[] | null;
    constraints: string | null;
    tags: string[] | null;
    order: number;
    category?: Category;
    created_at: string;
    updated_at: string;
}

export interface TestCase {
    input: Record<string, unknown>;
    output: unknown;
}

export interface Submission {
    id: number;
    problem_id: number;
    user_code: string;
    status: 'submitted' | 'gave_up';
    time_spent_seconds: number;
    ai_feedback: string | null;
    ai_provider: string | null;
    ai_model: string | null;
    language: string;
    problem?: Problem;
    created_at: string;
    updated_at: string;
}

export interface SubmissionPayload {
    problem_id: number;
    user_code: string;
    status: 'submitted' | 'gave_up';
    time_spent_seconds: number;
    language?: string;
}

export interface SubmissionResponse {
    submission: Submission;
    ai_feedback: string | null;
    solution: { solution_code: string; explanation: string } | null;
    progress: UserProgress;
}

export interface UserProgress {
    id: number;
    current_level: number;
    xp_points: number;
    problems_solved: number;
    problems_attempted: number;
    current_streak: number;
    best_streak: number;
    last_activity_at: string | null;
    level_progress: Record<string, unknown> | null;
}

export interface AiConfig {
    id: number;
    provider: 'gemini' | 'claude' | 'openai';
    model_name: string | null;
    is_active: boolean;
    has_key: boolean;
    created_at?: string;
}

export interface AiConfigPayload {
    provider: 'gemini' | 'claude' | 'openai';
    api_key: string;
    model_name?: string | null;
    is_active?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
