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
    Target
} from 'lucide-react';

const navItems = [
    { to: '/dashboard', icon: Calendar, label: 'Today' },
    { to: '/journal', icon: BookOpen, label: 'Journal' },
    { to: '/rules', icon: ScrollText, label: 'Rules' },
    { to: '/stats', icon: BarChart3, label: 'Stats' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
    const { labMode, user } = useRuleSci();
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
            <nav className="flex flex-col gap-2 flex-1">
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
            </nav>

            {/* Profile/Bottom section could go here */}
            <div className="pt-6 border-t border-[#1a1a2e]/5">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[12px] font-bold text-white shadow-sm">
                        {user?.name?.substring(0, 2).toUpperCase() || 'GU'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1a1a2e] truncate max-w-[120px]">
                            {user?.name || 'Guest User'}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${user?.isPro ? 'text-[#2563eb]' : 'text-[#9ca3af]'}`}>
                            {user?.isPro ? 'Pro Access' : 'Free Plan'}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
