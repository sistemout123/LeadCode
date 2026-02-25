import api from './client';
import type { AiConfig, AiConfigPayload } from '../types';

export const getAiConfigs = () => api.get<AiConfig[]>('/ai-configs').then(r => r.data);

export const createAiConfig = (data: AiConfigPayload) =>
    api.post<AiConfig>('/ai-configs', data).then(r => r.data);

export const updateAiConfig = (id: number, data: Partial<AiConfigPayload>) =>
    api.put<AiConfig>(`/ai-configs/${id}`, data).then(r => r.data);

export const deleteAiConfig = (id: number) =>
    api.delete(`/ai-configs/${id}`);
