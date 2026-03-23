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
    ShieldCheck,
    X,
    Info
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
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekOffset, setWeekOffset] = useState(0);
    const [showWelcome, setShowWelcome] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const targetTrades = useMemo(() => trades.filter(t => t.date?.split('T')[0] === selectedDateStr), [trades, selectedDateStr]);
    const targetLog = dailyLogs.find(d => d.date === selectedDateStr);
    const checkedIds = targetLog?.rulesChecked || [];

    useEffect(() => {
        setMounted(true);
        // Show welcome if it's the first visit and no trades/logs exist yet
        const welcomeDismissed = localStorage.getItem('rulesci_welcome_dismissed');
        if (!welcomeDismissed && dailyLogs.length === 0 && trades.length === 0) {
            setShowWelcome(true);
        }
    }, [dailyLogs.length, trades.length]);

    const activeRules = rules.filter(r => r.isActive !== false);
    const score = activeRules.length > 0 
        ? Number(((checkedIds.length / activeRules.length) * 100).toFixed(1)) 
        : 0;
    const isPerfect = score === 100 && activeRules.length > 0;

    const streak = analytics.consistencyDays || 0;

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
            date: selectedDateStr, 
            rulesChecked: newChecked,
            complianceScore: newScore,
            mood: targetLog?.mood || 'neutral',
            tradesLogged: targetTrades.length,
            rulesFollowed: newChecked.length,
            rulesBroken: targetTrades.reduce((acc, t) => acc + (t.rules_broken?.length || 0), 0)
        });
    };

    const handleSetMood = (mood: string) => {
        logDaily({
            date: selectedDateStr,
            rulesChecked: checkedIds,
            complianceScore: score,
            mood,
            tradesLogged: targetTrades.length,
            rulesFollowed: checkedIds.length,
            rulesBroken: targetTrades.reduce((acc, t) => acc + (t.rules_broken?.length || 0), 0)
        });
        showToast('Mood updated', 'success');
    };

    const handleDismissWelcome = () => {
        setShowWelcome(false);
        localStorage.setItem('rulesci_welcome_dismissed', 'true');
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
        { name: 'Pre-Session Rules', icon: '⚡', category: 'Pre-Session Rules' },
        { name: 'Entry/Exit Rules', icon: '🎯', category: 'Entry/Exit Rules' },
        { name: 'Mindset Rules', icon: '🧠', category: 'Mindset Rules' }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] pb-48 selection:bg-blue-100 italic-none">
            <main className="px-5 pt-20 flex flex-col items-center">
                <header className="w-full mb-10 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-8 px-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Account Level</span>
                            <span className="text-[13px] font-black text-[#1a1a2e]">RULESCI COMPLIANCE</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Systems Active</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 mb-8">
                        <div className="flex items-center gap-2">
                            <span className="text-[28px] font-black text-[#1a1a2e] tracking-tight">
                                {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                            </span>
                            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                                <Flame size={14} className="text-orange-500 fill-orange-500" />
                                <span className="text-[13px] font-black text-orange-600">{streak} Day Streak</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{selectedDate.getFullYear()}</span>
                    </div>

                    {/* WELCOME CARD - Fix 2 */}
                    <AnimatePresence>
                        {showWelcome && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full bg-[#1a1a2e] text-white rounded-[32px] p-7 mb-8 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-4 right-4 bg-white/10 p-1.5 rounded-full" onClick={handleDismissWelcome}>
                                    <X size={14} className="cursor-pointer" />
                                </div>
                                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                                    <Sparkles size={20} className="text-yellow-400" /> Welcome to RuleSci!
                                </h3>
                                <div className="space-y-4 mb-6 text-[13px] font-bold text-gray-300">
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-[11px] font-black shrink-0">1</div>
                                        <p><span className="text-white">Check in</span> (rate your sleep, energy, mood) — 30 seconds</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-[11px] font-black shrink-0">2</div>
                                        <p><span className="text-white">Review your rules</span> before trading — 1 minute</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-[11px] font-black shrink-0">3</div>
                                        <p><span className="text-white">After each trade</span>, tap + to log it — 2 minutes</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleDismissWelcome}
                                    className="w-full h-12 bg-white text-[#1a1a2e] font-black text-[13px] rounded-full active:scale-95 transition-all shadow-xl"
                                >
                                    Got it, let's go
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* WEEK NAVIGATION */}
                    <div className="w-full flex flex-col gap-4 mb-8">
                        <div className="flex items-center justify-between px-2">
                            <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-2 bg-gray-50 border border-gray-100 rounded-full text-gray-400 active:scale-90 transition-all">
                                <ChevronRight size={14} className="rotate-180" />
                            </button>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">This Week</span>
                            <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-2 bg-gray-50 border border-gray-100 rounded-full text-gray-400 active:scale-90 transition-all">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                        
                        <div className="w-full relative">
                            <div className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide snap-x snap-mandatory">
                                {Array.from({ length: 31 }).map((_, i) => {
                                    const date = new Date();
                                    date.setDate(date.getDate() + (i - 15) + (weekOffset * 7));
                                    const isSelected = selectedDate.toDateString() === date.toDateString();
                                    const isToday = new Date().toDateString() === date.toDateString();
                                    
                                    return (
                                        <motion.button 
                                            key={i}
                                            onClick={() => setSelectedDate(date)}
                                            whileTap={{ scale: 0.9 }}
                                            className="flex flex-col items-center gap-2 flex-none snap-center"
                                        >
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-[#1a1a2e]' : 'text-gray-300'}`}>
                                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </span>
                                            <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-[#1a1a2e] text-white shadow-xl scale-110' : 'text-gray-400 bg-white border border-gray-100 shadow-sm'}`}>
                                                <span className="text-[15px] font-black leading-none">{date.getDate()}</span>
                                                {isToday && (
                                                    <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-blue-400' : 'bg-blue-500'}`} />
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </header>

                {/* MORNING CHECK-IN */}
                <section className="w-full mb-10">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Morning Check-In</span>
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
                                className={`flex flex-col items-center justify-center gap-1.5 h-24 rounded-[32px] transition-all border-2 ${
                                    targetLog?.mood === item.m
                                    ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white shadow-xl scale-105 z-10' 
                                    : 'bg-white border-transparent text-gray-300 hover:border-gray-100 shadow-sm'
                                }`}
                            >
                                <span className="text-2xl">{item.e}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest">{item.l}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* TODAY'S RULES - HERO SECTION */}
                <section className="w-full flex flex-col gap-6 mb-12">
                    <div className="flex items-center gap-3 px-2">
                        <span className="text-[10px] font-black text-[#1a1a2e] uppercase tracking-widest">Today's Rules</span>
                        <div className="h-[1.5px] flex-1 bg-blue-100" />
                        <Link href="/rules" className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
                            Edit <ChevronRight size={10} strokeWidth={4} />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        {activeRules.length > 0 ? (
                            activeRules.map((rule) => {
                                const phase = phases.find(p => p.category === rule.category) || phases[0];
                                return (
                                    <motion.button
                                        key={rule.id}
                                        onClick={() => handleToggleRule(rule.id)}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full p-4 rounded-[24px] border-2 transition-all flex items-center justify-between group ${
                                            checkedIds.includes(rule.id) 
                                            ? 'bg-blue-50/30 border-blue-50' 
                                            : 'bg-white border-transparent shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                                                checkedIds.includes(rule.id) ? 'bg-blue-100/50' : 'bg-gray-50'
                                            }`}>
                                                {rule.emoji || '🛡️'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-[15px] font-black text-[#1a1a2e] leading-tight ${checkedIds.includes(rule.id) ? 'opacity-30 line-through' : ''}`}>
                                                    {rule.text}
                                                </span>
                                                <span className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">
                                                    {phase.name} • {checkedIds.includes(rule.id) ? 'Followed' : 'Not checked yet'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`w-8 h-8 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                                            checkedIds.includes(rule.id)
                                            ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white shadow-lg'
                                            : 'border-gray-100'
                                        }`}>
                                            {checkedIds.includes(rule.id) && <Check size={16} strokeWidth={4} />}
                                        </div>
                                    </motion.button>
                                );
                            })
                        ) : (
                            <Link href="/onboarding" className="p-10 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center gap-3 text-center">
                                <Shield className="text-gray-300" size={32} />
                                <span className="text-[13px] font-bold text-gray-400">No rules set up yet.<br/>Tap to architect your plan.</span>
                            </Link>
                        )}
                    </div>
                </section>

                {/* TRADE COUNTER & ACTION */}
                <section className="w-full flex flex-col items-center gap-6 mb-14">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Trade Counter</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-[#1a1a2e] leading-none">{targetTrades.length}</span>
                            <span className="text-xl font-bold text-gray-300">/ {session.tradesAllowed}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setCaptureOpen(true)}
                        className="w-full h-18 bg-[#1a1a2e] text-white rounded-[32px] font-black text-[16px] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(26,26,46,0.2)] active:scale-95 transition-all py-5"
                    >
                        <Plus size={20} strokeWidth={4} />
                        Log Trade
                    </button>
                </section>

                {/* DISCIPLINE SCORE */}
                <div className="w-full flex flex-col items-center mb-14">
                    <div className="relative w-64 h-64">
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.1, 0.05] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className={`absolute inset-0 rounded-full blur-3xl -z-10 ${isPerfect ? 'bg-green-400' : 'bg-blue-400'}`}
                        />
                        
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="128" cy="128" r="110" stroke="#f1f5f9" strokeWidth="18" fill="transparent" />
                            <motion.circle 
                                cx="128" cy="128" r="110" 
                                stroke={isPerfect ? "#22c55e" : "#3b82f6"} 
                                strokeWidth="18"
                                strokeDasharray={691}
                                strokeDashoffset={691 - (691 * score / 100)}
                                strokeLinecap="round" 
                                fill="transparent"
                                className="transition-all duration-[1000ms] ease-out"
                            />
                        </svg>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[52px] font-black text-[#1a1a2e] tracking-tighter tabular-nums leading-none">
                                {score}<span className="text-[18px] font-bold text-gray-300 ml-0.5">%</span>
                            </span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Discipline Score</span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 mt-10">
                        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-50 flex flex-col items-center gap-1.5">
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
                                <Zap size={10} /> Rules Followed
                            </span>
                            <span className="text-[18px] font-black text-[#1a1a2e]">{score}%</span>
                        </div>
                        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-50 flex flex-col items-center gap-1.5">
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
                                <TrendingUp size={10} /> Today's Focus
                            </span>
                            <span className="text-[18px] font-black text-blue-600 uppercase">Strong</span>
                        </div>
                    </div>
                </div>

                {/* AI TIP - SIMPLIFIED */}
                <div className="w-full bg-[#f8fafc] border border-gray-100 rounded-[28px] p-5 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <Info size={16} strokeWidth={3} />
                    </div>
                    <p className="text-[14px] font-bold text-gray-600 leading-tight">
                        {streak >= 30 ? "Elite focus today. Your emotional baseline is stable." : "Maintain discipline for a 5-day streak to unlock rewards."}
                    </p>
                </div>
            </main>
            <MentalReset isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
        </div>
    );
}

