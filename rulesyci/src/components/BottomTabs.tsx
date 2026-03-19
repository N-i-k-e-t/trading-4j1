'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Calendar,
    BookOpen,
    ScrollText,
    Settings,
    Plus
} from 'lucide-react';
import { useRuleSci } from '@/lib/context';

const navItems = [
    { to: '/dashboard', icon: Calendar, label: 'Today' },
    { to: '/journal', icon: BookOpen, label: 'Journal' },
    { to: 'CAPTURE', icon: Plus, label: '' },
    { to: '/rules', icon: ScrollText, label: 'Rules' },
    { to: '/settings', icon: Settings, label: 'Profile' },
];

export default function BottomTabs() {
    const pathname = usePathname();
    const { setCaptureOpen } = useRuleSci();

    return (
        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#1a1a2e]/5 flex items-start justify-around px-2 z-[90]"
            style={{
                paddingTop: '10px',
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)',
                minHeight: '60px',
            }}
        >
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.to;
                
                if (item.to === 'CAPTURE') {
                    return (
                        <button
                            key="capture-btn"
                            onClick={() => setCaptureOpen(true)}
                            className="flex flex-col items-center justify-center -mt-8"
                        >
                            <div className="w-14 h-14 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center shadow-xl shadow-gray-200 border-4 border-white active:scale-90 transition-all">
                                <Plus size={28} strokeWidth={3} />
                            </div>
                        </button>
                    );
                }

                return (
                    <Link
                        key={item.to}
                        href={item.to}
                        className={`flex flex-col items-center gap-[3px] transition-colors ${
                            isActive ? 'text-[#2563eb]' : 'text-[#9ca3af]'
                        }`}
                        style={{ minWidth: '44px', minHeight: '44px', justifyContent: 'center' }}
                    >
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider leading-none ${
                            isActive ? 'opacity-100' : 'opacity-50'
                        }`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
