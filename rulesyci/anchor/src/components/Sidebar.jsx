import { NavLink, useLocation } from 'react-router-dom'
import { useRuleSci } from '../context/RuleSciContext'
import {
    LayoutDashboard,
    BookOpen,
    ScrollText,
    PenLine,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    FlaskConical,
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Session', id: 'nav-session' },
    { to: '/trades', icon: BookOpen, label: 'Trade Log', id: 'nav-trades' },
    { to: '/rules', icon: ScrollText, label: 'Rules', id: 'nav-rules' },
    { to: '/observe', icon: PenLine, label: 'Observe', id: 'nav-observe' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', id: 'nav-analytics' },
]

export default function Sidebar() {
    const { sidebarCollapsed, toggleSidebar, labMode, toggleLabMode } = useRuleSci()
    const location = useLocation()

    if (labMode) return null

    return (
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="brand-icon">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="26" height="26" rx="4" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M11 9L11 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M11 9L18 9C20.2 9 22 10.8 22 13C22 15.2 20.2 17 18 17L11 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <path d="M17 17L22 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                {!sidebarCollapsed && (
                    <div className="brand-text animate-fade-in">
                        <span className="brand-name">
                            Rule<span className="brand-sci">Sci</span>
                        </span>
                        <span className="brand-tagline">Behavior first</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map(item => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.to
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            id={item.id}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            title={sidebarCollapsed ? item.label : undefined}
                        >
                            <Icon size={20} strokeWidth={1.6} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </NavLink>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="sidebar-bottom">
                <button
                    className="nav-item lab-toggle"
                    onClick={toggleLabMode}
                    title="Lab Mode"
                    id="btn-lab-mode"
                >
                    <FlaskConical size={20} strokeWidth={1.6} />
                    {!sidebarCollapsed && <span>Lab Mode</span>}
                </button>

                <NavLink
                    to="/settings"
                    id="nav-settings"
                    className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
                    title={sidebarCollapsed ? 'Settings' : undefined}
                >
                    <Settings size={20} strokeWidth={1.6} />
                    {!sidebarCollapsed && <span>Settings</span>}
                </NavLink>

                <button
                    className="sidebar-toggle"
                    onClick={toggleSidebar}
                    id="btn-toggle-sidebar"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight size={18} />
                    ) : (
                        <ChevronLeft size={18} />
                    )}
                </button>
            </div>
        </aside>
    )
}
