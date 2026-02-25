import type { AxiosError } from 'axios';

interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
}

export function parseApiError(err: unknown): string {
    const axiosErr = err as AxiosError<ApiErrorResponse>;

    if (!axiosErr.response) {
        if (axiosErr.code === 'ECONNABORTED') {
            return 'A IA demorou para responder. Tente novamente.';
        }
        return 'Sem conexão com o servidor. Verifique se o backend está rodando.';
    }

    const status = axiosErr.response.status;
    const data = axiosErr.response.data;

    switch (status) {
        case 400:
            return data?.message || 'Configure uma API de IA em ⚙️ Configurações.';
        case 401:
        case 403:
            return 'API key inválida ou expirada. Verifique em ⚙️ Configurações.';
        case 422:
            if (data?.errors) {
                const firstField = Object.keys(data.errors)[0];
                return data.errors[firstField]?.[0] || 'Dados inválidos.';
            }
            return 'Dados inválidos. Verifique os campos.';
        case 429:
            return 'Muitas requisições. Aguarde 1 minuto e tente novamente.';
        case 500:
            return 'Erro interno. Submissão salva, mas feedback da IA indisponível.';
        default:
            return data?.message || `Erro inesperado (${status}). Tente novamente.`;
    }
}
