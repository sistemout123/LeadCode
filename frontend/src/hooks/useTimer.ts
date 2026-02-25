import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
    initialMinutes: number;
    onTimeUp?: () => void;
    autoStart?: boolean;
    storageKey?: string;
}

export function useTimer({ initialMinutes, onTimeUp, autoStart = true, storageKey }: UseTimerOptions) {
    const total = initialMinutes * 60;
    const savedElapsed = storageKey ? Number(localStorage.getItem(storageKey) || 0) : 0;
    const [seconds, setSeconds] = useState(Math.max(total - savedElapsed, 0));
    const [isRunning, setIsRunning] = useState(autoStart && seconds > 0);
    const [elapsedSeconds, setElapsedSeconds] = useState(savedElapsed);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const saveRef = useRef(0);

    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    onTimeUp?.();
                    return 0;
                }
                return prev - 1;
            });
            setElapsedSeconds(prev => {
                const next = prev + 1;
                saveRef.current++;
                if (storageKey && saveRef.current % 5 === 0) {
                    localStorage.setItem(storageKey, String(next));
                }
                return next;
            });
        }, 1000);

        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, onTimeUp, storageKey]);

    const pause = useCallback(() => setIsRunning(false), []);
    const resume = useCallback(() => setIsRunning(true), []);
    const reset = useCallback(() => {
        setSeconds(total);
        setElapsedSeconds(0);
        setIsRunning(false);
        if (storageKey) localStorage.removeItem(storageKey);
    }, [total, storageKey]);

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const progress = total > 0 ? ((total - seconds) / total) * 100 : 100;
    const isWarning = seconds > 0 && seconds <= 180;
    const isCritical = seconds > 0 && seconds <= 60;

    return { seconds, elapsedSeconds, minutes, secs, formatted, progress, isRunning, isWarning, isCritical, pause, resume, reset };
}
