'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { 
    Home, 
    BookOpen, 
    Calendar, 
    Shield, 
    Activity 
} from 'lucide-react';

const navItems = [
    { to: '/today', icon: Home, label: 'Today' },
    { to: '/journal', icon: BookOpen, label: 'Journal' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/rules', icon: Shield, label: 'Rules' },
    { to: '/stats', icon: Activity, label: 'Stats' },
];

export default function BottomTabs() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-1 left-4 right-4 bg-white/90 backdrop-blur-xl border border-gray-100 px-4 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)] rounded-[32px] flex justify-between items-center z-[100] shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.to;
                return (
                    <Link
                        key={item.to}
                        href={item.to}
                        className={`flex flex-col items-center gap-1 transition-all flex-1 py-1.5 ${
                            isActive ? 'text-[#f59e0b]' : 'text-gray-300'
                        }`}
                    >
                        <div className={`transition-all ${isActive ? 'scale-110' : ''}`}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
