import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const nav = [
    { to: '/', icon: '⌂', label: 'Dashboard' },
    { to: '/problems', icon: '◈', label: 'Problemas' },
    { to: '/history', icon: '▤', label: 'Histórico' },
    { to: '/settings', icon: '⚙', label: 'Configurações' },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="sidebar-logo">▶</span>
                <span className="sidebar-title">LeadCode</span>
            </div>
            <nav className="sidebar-nav">
                {nav.map(({ to, icon, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <span className="sidebar-icon">{icon}</span>
                        <span className="sidebar-label">{label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <span className="sidebar-version">v0.1.0</span>
            </div>
        </aside>
    );
}
