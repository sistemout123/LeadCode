import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAiConfigs, createAiConfig, updateAiConfig, deleteAiConfig } from '../../api/aiConfig';
import { Button, Spinner } from '../../components/ui';
import type { AiConfig } from '../../types';
import './Settings.css';

const PROVIDERS = [
    { key: 'gemini' as const, label: 'Google Gemini', defaultModel: 'gemini-2.0-flash' },
    { key: 'claude' as const, label: 'Anthropic Claude', defaultModel: 'claude-sonnet-4-20250514' },
    { key: 'openai' as const, label: 'OpenAI GPT', defaultModel: 'gpt-4o' },
];

export default function Settings() {
    const { data: configs, loading, refetch } = useApi(getAiConfigs);
    const [form, setForm] = useState<Record<string, { apiKey: string; model: string }>>({});
    const [activeProvider, setActiveProvider] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!configs) return;
        const formState: Record<string, { apiKey: string; model: string }> = {};
        for (const p of PROVIDERS) {
            const existing = configs.find((c: AiConfig) => c.provider === p.key);
            formState[p.key] = { apiKey: '', model: existing?.model_name || p.defaultModel };
            if (existing?.is_active) setActiveProvider(p.key);
        }
        setForm(formState);
    }, [configs]);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        // GAP-F05: Validate API key format
        for (const p of PROVIDERS) {
            const f = form[p.key];
            if (f?.apiKey && f.apiKey.length < 10) {
                setMessage(`API key do ${p.label} é muito curta (mínimo 10 caracteres).`);
                setSaving(false);
                return;
            }
        }

        try {
            for (const p of PROVIDERS) {
                const f = form[p.key];
                if (!f?.apiKey && !configs?.find((c: AiConfig) => c.provider === p.key)?.has_key) continue;

                const existing = configs?.find((c: AiConfig) => c.provider === p.key);
                const payload = {
                    provider: p.key,
                    api_key: f.apiKey || undefined,
                    model_name: f.model || null,
                    is_active: activeProvider === p.key,
                };

                if (existing) {
                    await updateAiConfig(existing.id, payload as Record<string, unknown>);
                } else if (f.apiKey) {
                    await createAiConfig({ ...payload, api_key: f.apiKey } as { provider: 'gemini' | 'claude' | 'openai'; api_key: string; model_name?: string | null; is_active?: boolean });
                }
            }
            setMessage('Configurações salvas com sucesso!');
            refetch();
        } catch {
            setMessage('Erro ao salvar. Verifique os dados.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza?')) return;
        try {
            await deleteAiConfig(id);
            refetch();
        } catch {
            setMessage('Erro ao remover provider.');
        }
    };

    if (loading) return <div className="page-center"><Spinner size={40} /></div>;

    return (
        <div className="settings-page animate-fadeIn">
            <h1 className="page-title">Configurações</h1>

            <section className="settings-section">
                <h2 className="section-title">Provedores de IA</h2>
                <p className="section-desc">Configure suas API keys. Apenas um provedor pode estar ativo por vez.</p>

                <div className="providers-list">
                    {PROVIDERS.map(p => {
                        const existing = configs?.find((c: AiConfig) => c.provider === p.key);
                        return (
                            <div key={p.key} className={`provider-card ${activeProvider === p.key ? 'provider-active' : ''}`}>
                                <div className="provider-header">
                                    <label className="provider-radio">
                                        <input type="radio" name="active-provider" checked={activeProvider === p.key} onChange={() => setActiveProvider(p.key)} />
                                        <span className="provider-name">{p.label}</span>
                                    </label>
                                    {existing?.has_key && <span className="provider-status">✓ Configurado</span>}
                                    {existing && (
                                        <button className="provider-delete" onClick={() => handleDelete(existing.id)} title="Remover">✕</button>
                                    )}
                                </div>
                                <div className="provider-fields">
                                    <div className="field">
                                        <label className="field-label">API Key</label>
                                        <input
                                            type="password"
                                            className="field-input"
                                            placeholder={existing?.has_key ? '••••••••••••' : 'Cole sua API key aqui'}
                                            value={form[p.key]?.apiKey ?? ''}
                                            onChange={e => setForm(prev => ({ ...prev, [p.key]: { ...prev[p.key], apiKey: e.target.value } }))}
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="field-label">Modelo</label>
                                        <input
                                            type="text"
                                            className="field-input"
                                            placeholder={p.defaultModel}
                                            value={form[p.key]?.model ?? ''}
                                            onChange={e => setForm(prev => ({ ...prev, [p.key]: { ...prev[p.key], model: e.target.value } }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="settings-actions">
                    <Button variant="primary" size="lg" onClick={handleSave} loading={saving}>Salvar Configurações</Button>
                    {message && <span className={`settings-msg ${message.includes('Erro') ? 'msg-error' : 'msg-success'}`}>{message}</span>}
                </div>
            </section>
        </div>
    );
}
