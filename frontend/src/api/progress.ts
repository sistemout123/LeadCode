import api from './client';
import type { UserProgress } from '../types';

export const getProgress = () => api.get<UserProgress>('/progress').then(r => r.data);
