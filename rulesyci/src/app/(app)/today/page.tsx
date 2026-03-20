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
    Sparkles
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

    // STREAK LOGIC
    const streak = useMemo(() => {
        let count = 0;
        const sortedLogs = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
        const checkDate = new Date();
        
        for (let i = 0; i < 30; i++) {
            const dStr = checkDate.toISOString().split('T')[0];
            const log = sortedLogs.find(l => l.date === dStr);
            if (log && (log.complianceScore ?? 0) >= 75) {
                count++;
            } else if (dStr !== today) {
                break;
            }
            checkDate.setDate(checkDate.getDate() - 1);
        }
        return count;
    }, [dailyLogs, today]);

    const activeRules = rules.filter(r => r.isActive !== false);
    const score = activeRules.length > 0 
        ? Math.round((checkedIds.length / activeRules.length) * 100) 
        : 0;

    const handleToggleRule = (ruleId: string) => {
        if (session.rulesLocked) {
            showToast('System is locked. Rules cannot be modified mid-session.', 'error');
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
            tradesLogged: todayTrades.length,
            mood: todayLog?.mood || 'neutral',
            complianceScore: newScore,
            rulesFollowed: newChecked.length,
            rulesBroken: todayTrades.reduce((acc, t) => acc + (t.rules_broken?.length || 0), 0)
        });
    };

    const handleSetMood = (mood: string) => {
        logDaily({
            date: today,
            rulesChecked: checkedIds,
            tradesLogged: todayTrades.length,
            mood,
            complianceScore: score,
            rulesFollowed: checkedIds.length,
            rulesBroken: todayTrades.reduce((acc, t) => acc + (t.rules_broken?.length || 0), 0)
        });
        showToast('System state updated', 'success');
    };

    if (!mounted) return null;

    const phases = [
        { name: 'Architecture Prep', icon: '⚡', category: 'Risk Management' },
        { name: 'Execution Discipline', icon: '🎯', category: 'Entry' },
        { name: 'Protocol Maintenance', icon: '🧠', category: 'Mindset' },
        { name: 'Session Maintenance', icon: '🔢', category: 'Session' }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] pb-40">
            <main className="px-6 pt-12 flex flex-col items-center">
                {/* HERO HEADER - CAL AI STYLE */}
                <header className="w-full text-center mb-10">
                    <h1 className="text-[48px] font-black text-[#1a1a2e] leading-tight mb-2">
                        Good {greeting}.
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <div className="px-4 py-1.5 bg-orange-50 rounded-full border border-orange-100 flex items-center gap-2">
                            <Flame size={18} className="text-orange-500 fill-orange-500" />
                            <span className="text-[14px] font-black text-orange-600 uppercase tracking-widest">{streak} Day Streak</span>
                        </div>
                    </div>
                </header>

                {/* DISCIPLINE RING - CENTRAL FOCUS (PERFECT DAY STYLE) */}
                <div className="relative w-72 h-72 mb-12">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="144" cy="144" r="128" stroke="#f1f5f9" strokeWidth="20" fill="transparent" />
                        <motion.circle 
                            cx="144" cy="144" r="128" 
                            stroke="#eab308" strokeWidth="20"
                            strokeDasharray={804}
                            strokeDashoffset={804 - (804 * score / 100)}
                            strokeLinecap="round" 
                            fill="transparent"
                            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[72px] font-black text-[#1a1a2e] tracking-tighter tabular-nums leading-none">
                            {score}%
                        </span>
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3">
                            Discipline Score
                        </span>
                    </div>
                </div>

                {/* SYSTEM HEALTH CARDS */}
                <div className="w-full grid grid-cols-2 gap-4 mb-12">
                    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Model Conf.</span>
                        <span className="text-[20px] font-black text-[#1a1a2e]">98.4%</span>
                    </div>
                    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">System Bias</span>
                        <span className="text-[20px] font-black text-blue-600 uppercase">Neural</span>
                    </div>
                </div>

                {/* MOOD / MENTAL LOGGING - PERFECT DAY STYLE CIRCLES */}
                <section className="w-full mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-gray-100 rounded-full flex items-center gap-2 shadow-sm">
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">System State</span>
                        </div>
                        <div className="h-[1px] flex-1 bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { e: '🧘', m: 'flow', l: 'Flow' },
                            { e: '🔋', m: 'charged', l: 'Ready' },
                            { e: '🛡️', m: 'defensive', l: 'Patient' },
                            { e: '⚠️', m: 'tilt', l: 'Caution' }
                        ].map((item) => (
                            <button
                                key={item.m}
                                onClick={() => handleSetMood(item.m)}
                                className={`flex flex-col items-center justify-center gap-2 h-24 rounded-[32px] transition-all border-2 ${
                                    todayLog?.mood === item.m
                                    ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white shadow-xl scale-[1.05]' 
                                    : 'bg-white border-transparent text-gray-400 opacity-60'
                                }`}
                            >
                                <span className="text-3xl">{item.e}</span>
                                <span className="text-[9px] font-black uppercase tracking-wider">{item.l}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* PHASED DISCIPLINE PROTOCOLS */}
                <section className="w-full flex flex-col gap-10">
                    {phases.map((phase) => {
                        const phaseRules = rules.filter(r => r.category === phase.category && r.isActive);
                        if (phaseRules.length === 0) return null;
                        
                        return (
                            <div key={phase.name} className="flex flex-col gap-5">
                                <div className="flex items-center gap-3">
                                    <div className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-gray-100 rounded-full flex items-center gap-2 shadow-sm">
                                        <span className="text-[14px]">{phase.icon}</span>
                                        <span className="text-[11px] font-black text-[#1a1a2e] uppercase tracking-widest">{phase.name}</span>
                                    </div>
                                    <div className="h-[1px] flex-1 bg-gray-100" />
                                </div>

                                <div className="flex flex-col gap-3">
                                    {phaseRules.map((rule) => (
                                        <motion.button
                                            key={rule.id}
                                            onClick={() => handleToggleRule(rule.id)}
                                            whileTap={{ scale: 0.98 }}
                                            className={`p-6 rounded-[32px] border transition-all text-left flex items-center justify-between group bg-white ${
                                                checkedIds.includes(rule.id)
                                                ? 'border-green-100 shadow-sm'
                                                : 'border-transparent shadow-sm'
                                            }`}
                                        >
                                            <div className="flex flex-col gap-1 pr-6 flex-1 text-left">
                                                <h3 className={`text-[17px] font-black text-[#1a1a2e] transition-all ${checkedIds.includes(rule.id) ? 'opacity-30 line-through' : ''}`}>
                                                    {rule.text}
                                                </h3>
                                            </div>
                                            <div className={`w-10 h-10 rounded-full border-2 flex-none flex items-center justify-center transition-all ${
                                                checkedIds.includes(rule.id)
                                                ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-100'
                                                : 'border-gray-100 bg-[#fafafa]'
                                            }`}>
                                                {checkedIds.includes(rule.id) && <Check size={22} strokeWidth={4} />}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* ACTION HUD */}
                <div className="w-full fixed bottom-24 left-0 right-0 px-6 flex flex-col gap-3 z-50">
                    <button 
                        onClick={() => setCaptureOpen(true)}
                        className="w-full h-16 bg-[#eab308] text-white rounded-full font-black text-[17px] shadow-2xl shadow-yellow-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                        <Plus size={24} strokeWidth={3} />
                        Log Trade Architecture
                    </button>
                    {!session.rulesLocked && (
                        <button 
                            onClick={lockRules}
                            className="w-full h-14 bg-[#1a1a2e] text-white rounded-full font-black text-[14px] flex items-center justify-center gap-3 active:scale-95 transition-all"
                        >
                            <Shield size={18} />
                            Engage System Lock
                        </button>
                    )}
                </div>
            </main>
            <MentalReset isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
        </div>
    );
}
