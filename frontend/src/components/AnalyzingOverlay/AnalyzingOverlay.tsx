import { useState, useEffect } from 'react';
import './AnalyzingOverlay.css';

interface AnalyzingOverlayProps {
    visible: boolean;
}

const STEPS = [
    { label: 'Enviando código...', duration: 1500 },
    { label: 'Analisando com IA...', duration: 15000 },
    { label: 'Gerando feedback detalhado...', duration: 10000 },
];

export default function AnalyzingOverlay({ visible }: AnalyzingOverlayProps) {
    const [step, setStep] = useState(0);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!visible) { setStep(0); setElapsed(0); return; }

        const timer = setInterval(() => setElapsed(prev => prev + 100), 100);

        const t1 = setTimeout(() => setStep(1), STEPS[0].duration);
        const t2 = setTimeout(() => setStep(2), STEPS[0].duration + STEPS[1].duration);

        return () => { clearInterval(timer); clearTimeout(t1); clearTimeout(t2); };
    }, [visible]);

    if (!visible) return null;

    const elapsedSec = (elapsed / 1000).toFixed(1);

    return (
        <div className="analyzing-overlay animate-fadeIn">
            <div className="analyzing-card">
                <div className="analyzing-spinner" />
                <div className="analyzing-text">
                    <span className="analyzing-step">{STEPS[step].label}</span>
                    <span className="analyzing-time">{elapsedSec}s</span>
                </div>
                <div className="analyzing-dots">
                    {STEPS.map((_, i) => (
                        <span key={i} className={`analyzing-dot ${i <= step ? 'active' : ''}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
