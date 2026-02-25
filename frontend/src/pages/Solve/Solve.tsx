import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useTimer } from '../../hooks/useTimer';
import { getProblem, requestHint } from '../../api/problems';
import { createSubmission } from '../../api/submissions';
import { parseApiError } from '../../api/errors';
import { Badge, Button, Modal, Spinner } from '../../components/ui';
import AiFeedback from '../../components/AiFeedback/AiFeedback';
import AnalyzingOverlay from '../../components/AnalyzingOverlay/AnalyzingOverlay';
import StatsUpdate from '../../components/StatsUpdate/StatsUpdate';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { SubmissionResponse } from '../../types';
import './Solve.css';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

export default function Solve() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: problem, loading } = useApi(() => getProblem(Number(id)), [id]);
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState(false);
    const [result, setResult] = useState<SubmissionResponse | null>(null);
    const [submitStatus, setSubmitStatus] = useState<'submitted' | 'gave_up'>('submitted');
    const [activeTab, setActiveTab] = useState<'feedback' | 'solution' | 'mycode'>('feedback');
    const [hintsRevealed, setHintsRevealed] = useState<number[]>([]);
    const [aiHints, setAiHints] = useState<string[]>([]);
    const [hintLoading, setHintLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const timer = useTimer({
        initialMinutes: problem?.time_limit_minutes ?? 15,
        autoStart: !!problem,
        storageKey: id ? `timer_${id}` : undefined,
    });

    useEffect(() => {
        if (problem?.starter_code) {
            setCode(problem.starter_code);
        }
    }, [problem]);

    const handleSubmit = useCallback(async (status: 'submitted' | 'gave_up') => {
        if (!problem) return;
        setSubmitting(true);
        setErrorMsg(null);
        setSubmitStatus(status);
        timer.pause();
        try {
            const res = await createSubmission({
                problem_id: problem.id,
                user_code: code,
                status,
                time_spent_seconds: timer.elapsedSeconds,
                language: 'javascript',
            });
            setResult(res);
            setActiveTab(status === 'gave_up' && res.solution ? 'solution' : 'feedback');
            setFeedbackModal(true);
        } catch (err) {
            setErrorMsg(parseApiError(err));
            setFeedbackModal(true);
            setResult(null);
            timer.resume();
        } finally {
            setSubmitting(false);
        }
    }, [problem, code, timer]);

    const handleHint = useCallback(async () => {
        if (!problem || hintLoading) return;
        setHintLoading(true);
        timer.pause();
        try {
            const res = await requestHint(problem.id, code);
            setAiHints(prev => [...prev, res.hint]);
        } catch (err) {
            setAiHints(prev => [...prev, parseApiError(err)]);
        } finally {
            setHintLoading(false);
            timer.resume();
        }
    }, [problem, code, hintLoading, timer]);

    const revealHint = (index: number) => {
        if (!hintsRevealed.includes(index)) {
            setHintsRevealed(prev => [...prev, index]);
        }
    };

    if (loading) return <div className="page-center"><Spinner size={40} /></div>;
    if (!problem) return <div className="page-center"><p>Problema não encontrado</p></div>;

    const xpGained = submitStatus === 'submitted' ? problem.xp_reward : 0;

    return (
        <div className="solve-page">
            <div className="solve-panel-left">
                <div className="solve-header">
                    <button className="solve-back" onClick={() => navigate('/problems')}>← Voltar</button>
                    <Badge variant={problem.difficulty}>{problem.difficulty}</Badge>
                    <span className="solve-xp">+{problem.xp_reward} XP</span>
                </div>

                <h1 className="solve-title">{problem.title}</h1>

                <div className="solve-description">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
                </div>

                {problem.constraints && (
                    <div className="solve-section">
                        <h3>Constraints</h3>
                        <code className="solve-constraints">{problem.constraints}</code>
                    </div>
                )}

                {problem.hints && problem.hints.length > 0 && (
                    <div className="solve-section">
                        <h3>Dicas</h3>
                        {problem.hints.map((hint, i) => (
                            <div key={i} className="hint-item" onClick={() => revealHint(i)}>
                                {hintsRevealed.includes(i) ? (
                                    <span className="hint-text">{hint}</span>
                                ) : (
                                    <span className="hint-hidden">Clique para revelar dica {i + 1}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {aiHints.length > 0 && (
                    <div className="solve-section ai-hint-section">
                        <h3>Dicas da IA</h3>
                        {aiHints.map((hint, i) => (
                            <div key={i} className="ai-hint-content" style={{ marginBottom: '8px' }}>{hint}</div>
                        ))}
                    </div>
                )}

                <div className="solve-section">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleHint}
                        loading={hintLoading}
                        disabled={hintLoading}
                    >
                        Pedir Dica à IA
                    </Button>
                </div>
            </div>

            <div className="solve-panel-right">
                <div className="editor-header">
                    <span className="editor-lang">JavaScript</span>
                    <div className={`timer ${timer.isWarning ? 'timer-warning' : ''} ${timer.isCritical ? 'timer-critical' : ''}`}>
                        {timer.formatted}
                    </div>
                </div>

                <div className="editor-wrap">
                    <Suspense fallback={<div className="page-center"><Spinner size={32} /></div>}>
                        <MonacoEditor
                            height="100%"
                            language="javascript"
                            theme="vs-dark"
                            value={code}
                            onChange={(v) => setCode(v ?? '')}
                            options={{
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', monospace",
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                padding: { top: 16 },
                                lineNumbers: 'on',
                                tabSize: 2,
                            }}
                        />
                    </Suspense>
                    <AnalyzingOverlay visible={submitting} />
                </div>

                <div className="editor-actions">
                    <Button variant="danger" size="md" onClick={() => handleSubmit('gave_up')} loading={submitting} disabled={submitting}>
                        Desistir
                    </Button>
                    <Button variant="success" size="lg" onClick={() => handleSubmit('submitted')} loading={submitting} disabled={submitting}>
                        Submeter Código
                    </Button>
                </div>
            </div>

            <Modal
                open={feedbackModal}
                onClose={() => setFeedbackModal(false)}
                title={submitStatus === 'submitted' ? 'Resultado' : 'Solução'}
            >
                <div className="feedback-modal-content">
                    {errorMsg ? (
                        <div className="feedback-error">
                            <span className="error-icon">⚠</span>
                            <p>{errorMsg}</p>
                        </div>
                    ) : result ? (
                        <>
                            {result.progress && (
                                <StatsUpdate
                                    progress={result.progress}
                                    xpGained={xpGained}
                                    status={submitStatus}
                                />
                            )}

                            {submitStatus === 'gave_up' && result.solution && (
                                <div className="feedback-tabs">
                                    <button
                                        className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('feedback')}
                                    >
                                        Explicação IA
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === 'solution' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('solution')}
                                    >
                                        Código Solução
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === 'mycode' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('mycode')}
                                    >
                                        Meu Código
                                    </button>
                                </div>
                            )}

                            <div className="feedback-tab-content">
                                {activeTab === 'feedback' && result.ai_feedback && (
                                    <AiFeedback
                                        feedback={result.ai_feedback}
                                        provider={result.submission.ai_provider ?? undefined}
                                        model={result.submission.ai_model ?? undefined}
                                    />
                                )}
                                {activeTab === 'feedback' && !result.ai_feedback && (
                                    <p className="empty-state">Feedback da IA indisponível. Configure um provedor em Configurações.</p>
                                )}
                                {activeTab === 'solution' && result.solution && (
                                    <div className="solution-view">
                                        <AiFeedback
                                            feedback={`## Explicação\n\n${result.solution.explanation}\n\n## Código Solução\n\n\`\`\`javascript\n${result.solution.solution_code}\n\`\`\``}
                                        />
                                    </div>
                                )}
                                {activeTab === 'mycode' && (
                                    <div className="mycode-view">
                                        <AiFeedback feedback={`\`\`\`javascript\n${code}\n\`\`\``} />
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer-actions">
                                <Button variant="secondary" size="md" onClick={() => setFeedbackModal(false)}>Fechar</Button>
                                <Button variant="primary" size="md" onClick={() => { setFeedbackModal(false); navigate('/problems'); }}>Voltar aos Problemas</Button>
                            </div>
                        </>
                    ) : null}
                </div>
            </Modal>
        </div>
    );
}
