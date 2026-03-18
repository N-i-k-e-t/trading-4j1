'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Calendar,
    BookOpen,
    ScrollText,
    BarChart3,
    Settings
} from 'lucide-react';

const navItems = [
    { to: '/dashboard', icon: Calendar, label: 'Today' },
    { to: '/journal', icon: BookOpen, label: 'Journal' },
    { to: '/rules', icon: ScrollText, label: 'Rules' },
    { to: '/stats', icon: BarChart3, label: 'Stats' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomTabs() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-[#1a1a2e]/5 flex items-center justify-around px-2 z-[90] pb-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.to;
                return (
                    <Link
                        key={item.to}
                        href={item.to}
                        className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors ${isActive ? 'text-[#2563eb]' : 'text-[#9ca3af]'
                            }`}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
