'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Home, 
    BookOpen, 
    Calendar, 
    Activity,
    Plus,
    FileText,
    Camera,
    ListChecks
} from 'lucide-react';
import { useRuleSci } from '@/lib/context';

const navItems = [
    { to: '/today', icon: Home, label: 'Today' },
    { to: '/journal', icon: BookOpen, label: 'Journal' },
    { type: 'fab' }, // Center FAB
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/stats', icon: Activity, label: 'Stats' },
];

export default function BottomTabs() {
    const pathname = usePathname();
    const router = useRouter();
    const { setCaptureOpen, setCaptureMode } = useRuleSci();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleAction = (type: string) => {
        setIsMenuOpen(false);
        setCaptureMode(type as any);
        setCaptureOpen(true);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[200]">
            {/* FAB Fan-out Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-[2px]"
                        />
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                            {[
                                { id: 'checklist', icon: ListChecks, label: 'Log Trade', color: 'bg-yellow-500' },
                                { id: 'text', icon: FileText, label: 'Quick Note', color: 'bg-blue-500' },
                                { id: 'photo', icon: Camera, label: 'Scan Rules', color: 'bg-purple-500' },
                            ].map((item, i) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.5 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.5 }}
                                    transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                                    onClick={() => handleAction(item.id)}
                                    className="flex items-center gap-3 pr-4 pl-3 py-2 bg-white rounded-full shadow-xl border border-gray-100"
                                >
                                    <div className={`${item.color} w-8 h-8 rounded-full flex items-center justify-center text-white`}>
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-[13px] font-black text-[#1a1a2e]">{item.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Bottom Tab Bar */}
            <div className="px-6 pb-[calc(env(safe-area-inset-bottom)+16px)]">
                <nav className="bg-white/80 backdrop-blur-3xl border border-white/40 rounded-[40px] px-2 h-[80px] flex justify-between items-center shadow-[0_25px_60px_rgba(0,0,0,0.15)] relative">
                    {navItems.map((item, i) => {
                        if (item.type === 'fab') {
                            return (
                                <div key="fab-container" className="flex-1 flex justify-center -mt-12">
                                    <button
                                        onClick={toggleMenu}
                                        className={`w-18 h-18 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white active:scale-90 transition-all z-[210] p-4 ${isMenuOpen ? 'rotate-45' : ''}`}
                                    >
                                        <Plus size={36} strokeWidth={4} />
                                    </button>
                                </div>
                            );
                        }

                        const Icon = item.icon!;
                        const isActive = pathname === item.to;
                        return (
                            <Link
                                key={item.to}
                                href={item.to!}
                                className={`flex flex-col items-center justify-center transition-all flex-1 h-full gap-1 ${
                                    isActive ? 'text-[#1a1a2e]' : 'text-gray-300'
                                }`}
                            >
                                <motion.div 
                                    whileTap={{ scale: 0.9 }}
                                    className={`relative flex items-center justify-center h-10 w-10 rounded-full transition-all ${isActive ? 'bg-gray-50/50' : ''}`}
                                >
                                    <Icon size={22} strokeWidth={isActive ? 3 : 2} />
                                </motion.div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-[#1a1a2e]' : 'text-gray-400'}`}>
                                     {item.label}
                                 </span>
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTabDot"
                                        className="w-1 h-1 bg-[#1a1a2e] rounded-full mt-0.5"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

