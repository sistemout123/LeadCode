import './Skeleton.css';

interface SkeletonProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    count?: number;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', count = 1 }: SkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton animate-shimmer" style={{ width, height, borderRadius }} />
            ))}
        </>
    );
}

export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <Skeleton height="16px" width="60%" />
            <Skeleton height="12px" width="40%" />
            <Skeleton height="8px" width="80%" />
        </div>
    );
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
    return (
        <div className="skeleton-list">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="skeleton-row">
                    <Skeleton width="32px" height="32px" borderRadius="50%" />
                    <div className="skeleton-row-content">
                        <Skeleton height="14px" width={`${60 + Math.random() * 30}%`} />
                        <Skeleton height="10px" width="40%" />
                    </div>
                </div>
            ))}
        </div>
    );
}
