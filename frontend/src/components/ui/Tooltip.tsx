import type { ReactNode } from 'react';
import './Tooltip.css';

interface TooltipProps {
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    children: ReactNode;
}

export default function Tooltip({ text, position = 'top', children }: TooltipProps) {
    return (
        <span className={`tooltip-wrap tooltip-${position}`}>
            {children}
            <span className="tooltip-text">{text}</span>
        </span>
    );
}
