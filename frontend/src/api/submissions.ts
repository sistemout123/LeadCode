import api from './client';
import type { Submission, SubmissionPayload, SubmissionResponse, PaginatedResponse } from '../types';

interface SubmissionFilters {
    problem_id?: number;
    status?: string;
    page?: number;
}

export const getSubmissions = (filters?: SubmissionFilters) =>
    api.get<PaginatedResponse<Submission>>('/submissions', { params: filters }).then(r => r.data);

export const getSubmission = (id: number) =>
    api.get<Submission>(`/submissions/${id}`).then(r => r.data);

export const createSubmission = (data: SubmissionPayload) =>
    api.post<SubmissionResponse>('/submissions', data).then(r => r.data);
