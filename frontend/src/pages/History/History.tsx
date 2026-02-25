import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getSubmissions } from '../../api/submissions';
import { Badge } from '../../components/ui';
import { SkeletonList } from '../../components/ui/Skeleton';
import AiFeedback from '../../components/AiFeedback/AiFeedback';
import type { Submission } from '../../types';
import './History.css';

export default function History() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const { data, loading } = useApi(() => getSubmissions({ page, ...(statusFilter && { status: statusFilter }) }), [page, statusFilter]);

    const submissions = data?.data ?? [];
    const lastPage = data?.last_page ?? 1;

    return (
        <div className="history-page animate-fadeIn">
            <h1 className="page-title">Histórico</h1>

            <div className="filters-bar">
                <select className="filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                    <option value="">Todos status</option>
                    <option value="submitted">Submetidos</option>
                    <option value="gave_up">Desistências</option>
                </select>
            </div>

            {loading ? (
                <SkeletonList rows={4} />
            ) : submissions.length === 0 ? (
                <p className="empty-state">Nenhuma submissão encontrada.</p>
            ) : (
                <>
                    <div className="history-table">
                        <div className="history-header-row">
                            <span>Status</span>
                            <span>Problema</span>
                            <span>Tempo</span>
                            <span>Provider</span>
                            <span>Data</span>
                        </div>
                        {submissions.map((sub: Submission, i: number) => (
                            <HistoryRow key={sub.id} submission={sub} className={i < 6 ? 'stagger-item' : ''} />
                        ))}
                    </div>

                    <div className="pagination">
                        <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Anterior</button>
                        <span className="page-info">{page} / {lastPage}</span>
                        <button className="page-btn" disabled={page >= lastPage} onClick={() => setPage(p => p + 1)}>Próximo →</button>
                    </div>
                </>
            )}
        </div>
    );
}

function HistoryRow({ submission, className = '' }: { submission: Submission; className?: string }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`history-row ${expanded ? 'expanded' : ''} ${className}`}>
            <div className="history-row-main" onClick={() => setExpanded(!expanded)}>
                <Badge variant={submission.status === 'submitted' ? 'easy' : 'hard'}>
                    {submission.status === 'submitted' ? '✓ Submetido' : '✗ Desistiu'}
                </Badge>
                <span className="history-problem">{submission.problem?.title ?? `#${submission.problem_id}`}</span>
                <span className="history-time">{Math.floor(submission.time_spent_seconds / 60)}:{String(submission.time_spent_seconds % 60).padStart(2, '0')}</span>
                <span className="history-provider">{submission.ai_provider ?? '—'}</span>
                <span className="history-date">{new Date(submission.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
            {expanded && (
                <div className="history-details animate-fadeIn">
                    <div className="history-code">
                        <h4>Código</h4>
                        <pre><code>{submission.user_code}</code></pre>
                    </div>
                    {submission.ai_feedback && (
                        <div className="history-feedback">
                            <h4>Feedback da IA</h4>
                            <AiFeedback
                                feedback={submission.ai_feedback}
                                provider={submission.ai_provider ?? undefined}
                                model={submission.ai_model ?? undefined}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
