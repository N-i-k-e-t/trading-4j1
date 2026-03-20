'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { 
    Plus, 
    Flame, 
    Check, 
    ChevronRight, 
    Shield,
    Sparkles,
    Zap,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import MentalReset from '@/components/MentalReset';

export default function DashboardPage() {
    const { 
        rules, trades, dailyLogs, session, logDaily, setCaptureOpen, 
        analytics, lockRules, showToast 
    } = useRuleSci();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const todayTrades = useMemo(() => trades.filter(t => t.date === today), [trades, today]);
    const todayLog = dailyLogs.find(d => d.date === today);
    const checkedIds = todayLog?.rulesChecked || [];

    useEffect(() => {
        setMounted(true);
    }, []);

    // TIME-AWARE GREETING - CAL AI STYLE
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Morning";
        if (hour < 17) return "Afternoon";
        return "Evening";
    }, []);

    const activeRules = rules.filter(r => r.isActive !== false);
    const score = activeRules.length > 0 
        ? Math.round((checkedIds.length / activeRules.length) * 100) 
        : 0;
    const isPerfect = score === 100 && activeRules.length > 0;

    const streak = 4; // Mock for UI elegance

    const handleToggleRule = (ruleId: string) => {
        if (session.rulesLocked) {
            showToast('System is locked.', 'error');
            return;
        }
        const isChecked = checkedIds.includes(ruleId);
        const newChecked = isChecked 
            ? checkedIds.filter(id => id !== ruleId) 
            : [...checkedIds, ruleId];
        
        const newScore = Math.round((newChecked.length / activeRules.length) * 100);
        
        logDaily({ 
            date: today, 
            rulesChecked: newChecked,
            complianceScore: newScore,
            mood: todayLog?.mood || 'neutral',
            tradesLogged: todayTrades.length,
            rulesFollowed: newChecked.length,
            rulesBroken: todayTrades.reduce((acc, t) => acc + (t.rules_broken?.length || 0), 0)
        });
    };

    const handleSetMood = (mood: string) => {
        logDaily({
            date: today,
            rulesChecked: checkedIds,
            complianceScore: score,
            mood,
            tradesLogged: todayTrades.length,
            rulesFollowed: checkedIds.length,
            rulesBroken: todayTrades.reduce((acc, t) => acc + (t.rules_broken?.length || 0), 0)
        });
        showToast('System state updated', 'success');
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col items-center pt-32 px-6">
                <div className="w-48 h-10 bg-gray-100 rounded-full animate-pulse mb-10" />
                <div className="w-72 h-72 rounded-full border-8 border-gray-100 animate-pulse" />
            </div>
        );
    }

    const phases = [
        { name: 'Onboarding Prep', icon: '⚡', category: 'Risk Management' },
        { name: 'Execution Discipline', icon: '🎯', category: 'Entry' },
        { name: 'Psychology Maintenance', icon: '🧠', category: 'Mindset' }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] pb-48 selection:bg-blue-100">
            <main className="px-5 pt-20 flex flex-col items-center">
                {/* HORIZONTAL CALENDAR - PERFECT DAY STYLE */}
                <header className="w-full mb-12 flex flex-col items-center">
                    <Link 
                        href="/calendar"
                        className="flex items-center gap-2 mb-8 cursor-pointer active:scale-95 transition-all hover:opacity-70 group"
                    >
                        <span className="text-[22px] font-black text-[#1a1a2e] tracking-tight group-hover:text-blue-600 transition-colors">
                            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <ChevronRight size={20} className="rotate-90 text-[#1a1a2e] group-hover:text-blue-500 transition-colors" strokeWidth={3} />
                    </Link>

                    <div className="w-full flex justify-between px-2">
                        {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                            const date = new Date();
                            date.setDate(date.getDate() + offset);
                            const isToday = offset === 0;
                            return (
                                <motion.div 
                                    key={offset}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <span className={`text-[12px] font-bold uppercase tracking-widest ${isToday ? 'text-[#1a1a2e]' : 'text-gray-300'}`}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                    <div className={`w-11 h-11 rounded-full flex flex-col items-center justify-center transition-all ${isToday ? 'bg-[#1a1a2e] text-white shadow-xl' : 'text-gray-400'}`}>
                                        <span className="text-[15px] font-black leading-none">{date.getDate()}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isToday ? 'bg-white' : 'bg-gray-100'}`} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </header>

                {/* DISCIPLINE RING - CENTRAL FOCUS (PERFECT DAY STYLE) */}
                <div className="relative w-80 h-80 mb-14">
                    {/* Breathing Glow */}
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className={`absolute inset-0 rounded-full blur-[60px] -z-10 ${isPerfect ? 'bg-green-400' : 'bg-blue-400'}`}
                    />
                    
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="160" cy="160" r="140" stroke="#f1f5f9" strokeWidth="24" fill="transparent" />
                        <motion.circle 
                            cx="160" cy="160" r="140" 
                            stroke={isPerfect ? "#22c55e" : "#3b82f6"} 
                            strokeWidth="24"
                            strokeDasharray={880}
                            strokeDashoffset={880 - (880 * score / 100)}
                            strokeLinecap="round" 
                            fill="transparent"
                            className="transition-all duration-[1500ms] ease-out"
                        />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={score}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center"
                            >
                                <span className="text-[84px] font-black text-[#1a1a2e] tracking-tighter tabular-nums leading-none">
                                    {score}<span className="text-[32px] font-bold text-gray-200">%</span>
                                </span>
                                {isPerfect ? (
                                    <div className="mt-2 px-3 py-1 bg-green-50 rounded-full flex items-center gap-1.5 border border-green-100">
                                        <ShieldCheck size={14} className="text-green-500" />
                                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Perfect Session</span>
                                    </div>
                                ) : (
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3">
                                        Architecture Score
                                    </span>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* NEURAL STATUS CARDS */}
                <div className="w-full grid grid-cols-2 gap-4 mb-14">
                    <motion.div whileTap={{ scale: 0.98 }} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                            <Zap size={10} /> Model Precision
                        </span>
                        <span className="text-[20px] font-black text-[#1a1a2e]">99.2%</span>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.98 }} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                            <TrendingUp size={10} /> Edge Factor
                        </span>
                        <span className="text-[20px] font-black text-blue-600">HIGH</span>
                    </motion.div>
                </div>

                {/* SYSTEM STATE SELECTOR */}
                <section className="w-full mb-14">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Neural Baseline</span>
                        <div className="h-[1px] flex-1 bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { e: '🧘', m: 'flow', l: 'Flow' },
                            { e: '🔋', m: 'charged', l: 'Ready' },
                            { e: '🛡️', m: 'defensive', l: 'Defend' },
                            { e: '⚠️', m: 'tilt', l: 'Focus' }
                        ].map((item) => (
                            <button
                                key={item.m}
                                onClick={() => handleSetMood(item.m)}
                                className={`flex flex-col items-center justify-center gap-2 h-28 rounded-[40px] transition-all border-2 ${
                                    todayLog?.mood === item.m
                                    ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white shadow-2xl scale-[1.05] z-10' 
                                    : 'bg-white border-transparent text-gray-300 hover:border-gray-100'
                                }`}
                            >
                                <span className="text-3xl mb-1">{item.e}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest">{item.l}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* PROTOCOL PHASES */}
                <section className="w-full flex flex-col gap-12">
                    {phases.map((phase) => {
                        const phaseRules = rules.filter(r => r.category === phase.category && r.isActive);
                        if (phaseRules.length === 0) return null;
                        
                        return (
                            <div key={phase.name} className="flex flex-col gap-6">
                                <div className="flex items-center gap-3 px-2">
                                    <div className="h-10 px-4 bg-white/60 backdrop-blur-md border border-gray-100 rounded-full flex items-center gap-3 shadow-sm">
                                        <span className="text-[18px]">{phase.icon}</span>
                                        <span className="text-[11px] font-black text-[#1a1a2e] uppercase tracking-widest leading-none">{phase.name}</span>
                                    </div>
                                    <div className="h-[1px] flex-1 bg-gray-100" />
                                </div>

                                <div className="flex flex-col gap-4">
                                    {phaseRules.map((rule, idx) => {
                                        const gradients = [
                                            'from-pink-100/60 to-transparent',
                                            'from-green-100/60 to-transparent',
                                            'from-blue-100/60 to-transparent',
                                            'from-orange-100/60 to-transparent'
                                        ];
                                        const grad = gradients[idx % gradients.length];
                                        
                                        return (
                                            <div key={rule.id} className="flex flex-col items-center gap-4">
                                                {idx > 0 && (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="text-3xl grayscale opacity-40">😎</span>
                                                        <span className="text-[10px] font-bold text-gray-200 uppercase tracking-widest">Buffer Zone</span>
                                                    </div>
                                                )}
                                                <motion.button
                                                    onClick={() => handleToggleRule(rule.id)}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`relative w-full p-5 rounded-[45px] border-2 transition-all flex items-center justify-between group bg-white shadow-sm hover:shadow-md overflow-hidden ${
                                                        checkedIds.includes(rule.id) ? 'border-gray-50' : 'border-transparent'
                                                    }`}
                                                >
                                                    {/* Perfect Day Gradient Hint */}
                                                    <div className={`absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r ${grad} opacity-80`} />
                                                    
                                                    <div className="flex items-center gap-4 relative z-10 flex-1">
                                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-xl flex-none">
                                                            {rule.emoji || '🛡️'}
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            <span className={`text-[17px] font-black text-[#1a1a2e] leading-tight ${checkedIds.includes(rule.id) ? 'opacity-30 line-through' : ''}`}>
                                                                {rule.text}
                                                            </span>
                                                            <span className="text-[11px] font-bold text-gray-300 mt-1 uppercase tracking-widest">
                                                                {rule.category} • {checkedIds.includes(rule.id) ? 'Compliant' : 'Awaiting Entry'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className={`w-10 h-10 rounded-full border-2 flex-none flex items-center justify-center transition-all relative z-10 ${
                                                        checkedIds.includes(rule.id)
                                                        ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white shadow-xl'
                                                        : 'border-gray-100 bg-white'
                                                    }`}>
                                                        {checkedIds.includes(rule.id) && <Check size={20} strokeWidth={4} />}
                                                    </div>
                                                </motion.button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* PERFECT DAY FAB - CENTERED BOTTOM */}
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200]">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ y: -5 }}
                        onClick={() => setCaptureOpen(true)}
                        className="w-20 h-20 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white active:scale-95 transition-all"
                    >
                        <Plus size={36} strokeWidth={4} />
                    </motion.button>
                </div>
            </main>
            <MentalReset isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
        </div>
    );
}
