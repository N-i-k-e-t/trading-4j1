'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import {
    Calendar,
    BookOpen,
    ScrollText,
    BarChart3,
    Settings,
    Target,
    Activity,
    Zap,
    Link2,
    ShieldCheck
} from 'lucide-react';

const navItems = [
    { to: '/today', icon: Zap, label: 'Today' },
    { to: '/diary', icon: BookOpen, label: 'Diary' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/journal', icon: ScrollText, label: 'Journal' },
    { to: '/rules', icon: Target, label: 'Rules' },
    { to: '/stats', icon: BarChart3, label: 'Stats' },
];

export default function Sidebar() {
    const { labMode, user, logout } = useRuleSci();
    const pathname = usePathname();

    if (labMode) return null;

    return (
        <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[240px] bg-white border-r border-[#1a1a2e]/5 flex-col p-6 z-[90]">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 mb-12 px-2">
                <div className="w-10 h-10 bg-[#f59e0b]/10 text-[#f59e0b] rounded-full flex items-center justify-center shadow-sm">
                    <Target size={22} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#1a1a2e]">RuleSci</span>
            </Link>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            href={item.to}
                            className={`flex items-center gap-4 p-3 rounded-2xl text-[15px] font-bold transition-all ${isActive
                                ? 'bg-[#2563eb]/10 text-[#2563eb]'
                                : 'text-[#6b7280] hover:bg-[#1a1a2e]/5 hover:text-[#1a1a2e]'
                                }`}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                {/* Connections - Restricted to Pro/Admin */}
                {(user?.isPro || user?.isAdmin) && (
                    <Link
                        href="/api-keys"
                        className={`flex items-center gap-4 p-3 rounded-2xl text-[15px] font-bold transition-all ${pathname === '/api-keys'
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'text-[#6b7280] hover:bg-[#1a1a2e]/5 hover:text-[#1a1a2e]'
                            }`}
                    >
                        <Link2 size={22} strokeWidth={pathname === '/api-keys' ? 2.5 : 2} />
                        <span>Connections</span>
                    </Link>
                )}

                {/* Admin - Restricted to Admin */}
                {user?.isAdmin && (
                    <Link
                        href="/admin"
                        className={`flex items-center gap-4 p-3 rounded-2xl text-[15px] font-bold transition-all ${pathname === '/admin'
                            ? 'bg-purple-500/10 text-purple-600'
                            : 'text-[#6b7280] hover:bg-[#1a1a2e]/5 hover:text-[#1a1a2e]'
                            }`}
                    >
                        <ShieldCheck size={22} strokeWidth={pathname === '/admin' ? 2.5 : 2} />
                        <span>Admin Panel</span>
                    </Link>
                )}
            </nav>

            {/* Profile/Bottom section */}
            <div className="pt-6 border-t border-[#1a1a2e]/5 flex flex-col gap-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[12px] font-bold text-white shadow-sm">
                        {user?.name?.substring(0, 2).toUpperCase() || 'GU'}
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <span className="text-sm font-bold text-[#1a1a2e] truncate">
                            {user?.name || 'Guest User'}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${user?.isPro ? 'text-[#2563eb]' : 'text-[#9ca3af]'}`}>
                            {user?.isPro ? 'Pro Access' : 'Free Plan'}
                        </span>
                    </div>
                </div>
                
                <button 
                    onClick={logout}
                    className="w-full h-11 bg-red-50 text-red-600 rounded-xl text-[13px] font-black uppercase tracking-widest active:scale-95 transition-all"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
