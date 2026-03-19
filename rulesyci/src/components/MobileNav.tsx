'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Zap, 
    BookOpen, 
    Calendar, 
    ScrollText, 
    Target, 
    BarChart3 
} from 'lucide-react';

const navItems = [
    { to: '/today', icon: Zap, label: 'Today' },
    { to: '/diary', icon: BookOpen, label: 'Diary' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/rules', icon: Target, label: 'Rules' },
    { to: '/stats', icon: BarChart3, label: 'Stats' },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] flex justify-between items-center z-[100]">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.to;
                return (
                    <Link
                        key={item.to}
                        href={item.to}
                        className={`flex flex-col items-center gap-1 transition-all ${
                            isActive ? 'text-[#f59e0b]' : 'text-gray-400'
                        }`}
                    >
                        <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#f59e0b]/10' : ''}`}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
