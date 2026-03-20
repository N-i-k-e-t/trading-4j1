'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            <main className="px-6 pt-16 flex flex-col items-center">
                {/* HERO HEADER - CAL AI STYLE */}
                <header className="w-full text-center mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[42px] font-black text-[#1a1a2e] leading-tight mb-3 tracking-tighter"
                    >
                        Good {greeting}.
                    </motion.h1>
                    <div className="flex items-center justify-center gap-2">
                        <motion.div 
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2 bg-orange-50 rounded-full border border-orange-100 flex items-center gap-2 shadow-sm"
                        >
                            <Flame size={18} className="text-orange-500 fill-orange-500" />
                            <span className="text-[13px] font-black text-orange-600 uppercase tracking-widest">{streak} Day Sequence</span>
                        </motion.div>
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

                                <div className="flex flex-col gap-3">
                                    {phaseRules.map((rule) => (
                                        <motion.button
                                            key={rule.id}
                                            onClick={() => handleToggleRule(rule.id)}
                                            whileTap={{ scale: 0.98 }}
                                            className={`p-6 rounded-[36px] border transition-all text-left flex items-center justify-between group bg-white shadow-sm hover:shadow-md ${
                                                checkedIds.includes(rule.id) ? 'border-green-50 shadow-inner' : 'border-transparent'
                                            }`}
                                        >
                                            <div className="flex flex-col gap-1 pr-6 flex-1 text-left">
                                                <h3 className={`text-[17px] font-black text-[#1a1a2e] transition-all ${checkedIds.includes(rule.id) ? 'opacity-30 line-through' : ''}`}>
                                                    {rule.text}
                                                </h3>
                                            </div>
                                            <div className={`w-11 h-11 rounded-full border-2 flex-none flex items-center justify-center transition-all ${
                                                checkedIds.includes(rule.id)
                                                ? 'bg-green-500 border-green-500 text-white shadow-xl shadow-green-100'
                                                : 'border-gray-50 bg-gray-50/50'
                                            }`}>
                                                {checkedIds.includes(rule.id) && <Check size={24} strokeWidth={4} />}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* ACTION HUD */}
                <div className="w-full fixed bottom-28 left-0 right-0 px-6 flex flex-col gap-4 z-50">
                    <motion.button 
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setCaptureOpen(true)}
                        className="w-full h-20 bg-blue-600 text-white rounded-[40px] font-black text-[18px] shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 transition-all"
                    >
                        <Plus size={28} strokeWidth={3} />
                        Capture Execution
                    </motion.button>
                    {!session.rulesLocked && (
                        <motion.button 
                            whileTap={{ scale: 0.96 }}
                            onClick={lockRules}
                            className="w-full h-14 bg-[#1a1a2e] text-white rounded-[28px] font-black text-[13px] flex items-center justify-center gap-3 transition-all uppercase tracking-widest shadow-xl"
                        >
                            <Shield size={18} />
                            Deploy System Lock
                        </motion.button>
                    )}
                </div>
            </main>
            <MentalReset isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
        </div>
    );
}
