import { useState, useMemo } from 'react';
import { useDebounce } from '../../hooks/useUtils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { getProblems } from '../../api/problems';
import { getCategories } from '../../api/categories';
import { Badge, Card } from '../../components/ui';
import { SkeletonList } from '../../components/ui/Skeleton';
import type { Problem, Category } from '../../types';
import './Problems.css';

export default function Problems() {
    const [params] = useSearchParams();
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState(params.get('difficulty') ?? '');
    const [categoryId, setCategoryId] = useState(params.get('category') ?? '');
    const navigate = useNavigate();
    const debouncedSearch = useDebounce(search, 300);

    const filters = useMemo(() => ({
        ...(difficulty && { difficulty }),
        ...(categoryId && { category: categoryId }),
        ...(debouncedSearch && { search: debouncedSearch }),
    }), [difficulty, categoryId, debouncedSearch]);

    const { data: problems, loading } = useApi(() => getProblems(filters), [difficulty, categoryId, debouncedSearch]);
    const { data: categories } = useApi(getCategories);

    return (
        <div className="problems-page animate-fadeIn">
            <h1 className="page-title">Problemas</h1>

            <div className="filters-bar">
                <input
                    className="filter-search"
                    type="text"
                    placeholder="Buscar problema..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select className="filter-select" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                    <option value="">Todas categorias</option>
                    {(categories ?? []).map((c: Category) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <select className="filter-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                    <option value="">Todas dificuldades</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            {loading ? (
                <SkeletonList rows={6} />
            ) : (
                <div className="problems-list">
                    {(problems ?? []).length === 0 ? (
                        <p className="empty-state">Nenhum problema encontrado com esses filtros.</p>
                    ) : (
                        (problems ?? []).map((p: Problem, i: number) => (
                            <Card key={p.id} className={`problem-card ${i < 6 ? 'stagger-item' : ''}`} hoverable onClick={() => navigate(`/problems/${p.id}`)}>
                                <div className="problem-header">
                                    <span className="problem-order">#{p.order}</span>
                                    <span className="problem-title">{p.title}</span>
                                    <Badge variant={p.difficulty}>{p.difficulty}</Badge>
                                </div>
                                <div className="problem-meta">
                                    <span className="problem-category">{p.category?.name ?? ''}</span>
                                    <span className="problem-xp">+{p.xp_reward} XP</span>
                                    <span className="problem-time">⏱ {p.time_limit_minutes}min</span>
                                </div>
                                {p.tags && p.tags.length > 0 && (
                                    <div className="problem-tags">
                                        {p.tags.map(t => <span key={t} className="problem-tag">{t}</span>)}
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
