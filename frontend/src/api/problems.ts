import api from './client';
import type { Problem } from '../types';

interface ProblemFilters {
    difficulty?: string;
    category_id?: number;
    search?: string;
}

export const getProblems = (filters?: ProblemFilters) =>
    api.get<Problem[]>('/problems', { params: filters }).then(r => r.data);

export const getProblem = (id: number) =>
    api.get<Problem>(`/problems/${id}`).then(r => r.data);

export const getSolution = (id: number) =>
    api.get<{ solution_code: string; explanation: string }>(`/problems/${id}/solution`).then(r => r.data);

export const requestHint = (id: number, userCode: string) =>
    api.post<{ hint: string }>(`/problems/${id}/hint`, { user_code: userCode }).then(r => r.data);
