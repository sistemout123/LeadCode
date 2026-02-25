import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: 'Inter, sans-serif',
                    padding: '32px', textAlign: 'center',
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Algo deu errado</h1>
                    <p style={{ color: '#8b949e', marginBottom: '24px', maxWidth: '500px' }}>
                        Ocorreu um erro inesperado. Tente recarregar a página.
                    </p>
                    <code style={{
                        background: '#161b22', padding: '12px 20px', borderRadius: '8px',
                        fontSize: '0.8rem', color: '#f85149', marginBottom: '24px', maxWidth: '600px',
                        wordBreak: 'break-word',
                    }}>
                        {this.state.error?.message}
                    </code>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 24px', background: '#58a6ff', color: '#0d1117',
                            border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                            fontSize: '0.9rem',
                        }}
                    >
                        Recarregar Página
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
