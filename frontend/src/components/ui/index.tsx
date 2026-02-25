import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './ui.css';
export { default as Tooltip } from './Tooltip';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, children, disabled, className = '', ...props }: ButtonProps) {
    return (
        <button className={`btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${className}`} disabled={disabled || loading} {...props}>
            {loading && <span className="btn-spinner animate-spin" />}
            {children}
        </button>
    );
}

interface BadgeProps { variant: 'easy' | 'medium' | 'hard' | 'info' | 'default'; children: ReactNode; }
export function Badge({ variant, children }: BadgeProps) {
    return <span className={`badge badge-${variant}`}>{children}</span>;
}

interface CardProps { children: ReactNode; className?: string; hoverable?: boolean; onClick?: () => void; }
export function Card({ children, className = '', hoverable, onClick }: CardProps) {
    return (
        <div className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
            {children}
        </div>
    );
}

interface ProgressBarProps { value: number; max?: number; color?: string; label?: string; size?: 'sm' | 'md'; showValue?: boolean; }
export function ProgressBar({ value, max = 100, color, label, size = 'md', showValue }: ProgressBarProps) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className={`progress-wrap progress-${size}`}>
            {label && <span className="progress-label">{label}</span>}
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%`, background: color || 'var(--accent-primary)' }} />
            </div>
            {showValue && <span className="progress-value">{Math.round(pct)}%</span>}
        </div>
    );
}

export function Spinner({ size = 24 }: { size?: number }) {
    return (
        <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </svg>
    );
}

interface ModalProps { open: boolean; onClose: () => void; title?: string; children: ReactNode; }
export function Modal({ open, onClose, title, children }: ModalProps) {
    if (!open) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content animate-fadeIn" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    {title && <h2 className="modal-title">{title}</h2>}
                    <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}
