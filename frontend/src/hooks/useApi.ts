import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
    const [state, setState] = useState<UseApiState<T>>({ data: null, loading: true, error: null });
    const abortRef = useRef<AbortController | null>(null);

    const load = useCallback(async () => {
        // Cancel previous request
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await fetcher();
            if (!controller.signal.aborted) {
                setState({ data, loading: false, error: null });
            }
        } catch (err) {
            if (controller.signal.aborted) return;
            const message = err instanceof Error ? err.message : 'Erro desconhecido';
            setState({ data: null, loading: false, error: message });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        load();
        return () => { abortRef.current?.abort(); };
    }, [load]);

    return { ...state, refetch: load };
}
