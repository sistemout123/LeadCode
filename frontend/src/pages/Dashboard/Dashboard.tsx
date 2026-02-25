import { useApi } from '../../hooks/useApi';
import { getProgress } from '../../api/progress';
import { getCategories } from '../../api/categories';
import { getSubmissions } from '../../api/submissions';
import { Card, ProgressBar, Badge } from '../../components/ui';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import type { Category, Submission } from '../../types';
import './Dashboard.css';

export default function Dashboard() {
    const { data: progress, loading: pl } = useApi(getProgress);
    const { data: categories, loading: cl } = useApi(getCategories);
    const { data: submissions, loading: sl } = useApi(() => getSubmissions({ page: 1 }));
    const navigate = useNavigate();

    if (pl || cl || sl) return (
        <div className="dashboard animate-fadeIn">
            <h1 className="page-title">Dashboard</h1>
            <div className="stats-grid">
                <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
        </div>
    );

    const xpForLevel = (progress?.current_level ?? 1) * 100;
    const recentSubs = submissions?.data?.slice(0, 5) ?? [];

    return (
        <div className="dashboard animate-fadeIn">
            <h1 className="page-title">Dashboard</h1>

            <div className="stats-grid">
                <Card className="stat-card stagger-item">
                    <div className="stat-value">{progress?.current_level ?? 1}</div>
                    <div className="stat-label">Nível</div>
                    <ProgressBar value={progress?.xp_points ?? 0} max={xpForLevel} color="var(--accent-primary)" size="sm" />
                    <div className="stat-sub">{progress?.xp_points ?? 0} / {xpForLevel} XP</div>
                </Card>
                <Card className="stat-card stagger-item">
                    <div className="stat-value">{progress?.xp_points ?? 0}</div>
                    <div className="stat-label">XP Total</div>
                    <div className="stat-icon">★</div>
                </Card>
                <Card className="stat-card stagger-item">
                    <div className="stat-value">{progress?.current_streak ?? 0}</div>
                    <div className="stat-label">Streak Atual</div>
                    <div className="stat-icon streak-fire">🔥</div>
                    <div className="stat-sub">Melhor: {progress?.best_streak ?? 0}</div>
                </Card>
                <Card className="stat-card stagger-item">
                    <div className="stat-value">{progress?.problems_solved ?? 0}</div>
                    <div className="stat-label">Resolvidos</div>
                    <div className="stat-sub">de {progress?.problems_attempted ?? 0} tentados</div>
                </Card>
            </div>

            <section className="dashboard-section">
                <h2 className="section-title">Categorias</h2>
                <div className="categories-grid">
                    {(categories ?? []).map((cat: Category) => (
                        <Card key={cat.id} className="category-card" hoverable onClick={() => navigate(`/problems?category=${cat.slug}`)}>
                            <div className="category-icon">{cat.icon}</div>
                            <div className="category-info">
                                <span className="category-name">{cat.name}</span>
                                <span className="category-count">{cat.problems_count ?? 0} problemas</span>
                            </div>
                            <div className="category-bar" style={{ background: cat.color, width: `${Math.min((cat.problems_count ?? 0) * 10, 100)}%` }} />
                        </Card>
                    ))}
                </div>
            </section>

            <section className="dashboard-section">
                <h2 className="section-title">Atividade Recente</h2>
                {recentSubs.length === 0 ? (
                    <p className="empty-state">Nenhuma submissão ainda. Comece resolvendo um problema!</p>
                ) : (
                    <div className="recent-list">
                        {recentSubs.map((sub: Submission) => (
                            <div key={sub.id} className="recent-item">
                                <Badge variant={sub.status === 'submitted' ? 'easy' : 'hard'}>
                                    {sub.status === 'submitted' ? '✓' : '✗'}
                                </Badge>
                                <span className="recent-title">{sub.problem?.title ?? `Problema #${sub.problem_id}`}</span>
                                <span className="recent-time">{Math.floor(sub.time_spent_seconds / 60)}min</span>
                                <span className="recent-date">{new Date(sub.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
