import { ProgressBar } from '../ui';
import type { UserProgress } from '../../types';
import './StatsUpdate.css';

interface StatsUpdateProps {
    progress: UserProgress;
    xpGained: number;
    status: 'submitted' | 'gave_up';
}

export default function StatsUpdate({ progress, xpGained, status }: StatsUpdateProps) {
    const xpForLevel = progress.current_level * 100;

    return (
        <div className="stats-update animate-fadeIn">
            <div className={`stats-status ${status === 'submitted' ? 'status-success' : 'status-gaveup'}`}>
                {status === 'submitted' ? '✅ Submetido com sucesso!' : '📖 Solução revelada'}
            </div>

            <div className="stats-row">
                <div className="stats-item">
                    <span className="stats-label">XP Ganho</span>
                    <span className={`stats-xp ${xpGained > 0 ? 'xp-gained' : ''}`}>
                        {xpGained > 0 ? `+${xpGained}` : '0'} ★
                    </span>
                </div>
                <div className="stats-item">
                    <span className="stats-label">Nível</span>
                    <span className="stats-level">{progress.current_level}</span>
                </div>
                <div className="stats-item">
                    <span className="stats-label">Streak</span>
                    <span className="stats-streak">🔥 {progress.current_streak}</span>
                </div>
            </div>

            <div className="stats-progress">
                <ProgressBar value={progress.xp_points} max={xpForLevel} color="var(--accent-primary)" size="md" />
                <span className="stats-progress-text">{progress.xp_points} / {xpForLevel} XP</span>
            </div>
        </div>
    );
}
