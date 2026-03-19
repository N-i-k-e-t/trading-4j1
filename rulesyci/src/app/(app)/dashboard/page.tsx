'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { 
    Plus, 
    Flame, 
    Check, 
    X, 
    ChevronRight, 
    Target, 
    Mic, 
    Camera, 
    FileText, 
    ListChecks, 
    Calendar as CalendarIcon,
    TrendingDown,
    Shield,
    Coffee
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import MentalReset from '@/components/MentalReset';

export default function DashboardPage() {
    const { user, rules, trades, dailyLogs, session, logDaily, setCaptureOpen, analytics, lockRules, showToast } = useRuleSci();
    const router = useRouter();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [activeNote, setActiveNote] = useState('');

    const today = new Date().toISOString().split('T')[0];
    const todayTrades = useMemo(() => trades.filter(t => t.date === today), [trades, today]);
    const todayPnL = useMemo(() => todayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0), [todayTrades]);

    const todayLog = dailyLogs.find(d => d.date === today);
    const checkedIds = todayLog?.rulesChecked || [];

    const handleToggleRule = (ruleId: string) => {
        if (session.rulesLocked) {
            showToast('System is locked. Rules cannot be modified mid-session.', 'error');
            return;
        }
        
        const isChecked = checkedIds.includes(ruleId);
        const newChecked = isChecked 
            ? checkedIds.filter(id => id !== ruleId) 
            : [...checkedIds, ruleId];
        
        logDaily({ 
            date: today, 
            rulesChecked: newChecked,
            tradesLogged: todayTrades.length,
            mood: todayLog?.mood || 'Neutral',
            rulesFollowed: newChecked.length,
            rulesBroken: todayTrades.reduce((acc, t) => acc + (t.rules_broken?.length || 0), 0)
        });
    };

    // RESTORE SCORE LOGIC
    const { score, gradeInfo } = useMemo(() => {
        const activeRules = rules.filter(r => r.isActive !== false);
        const checkedCount = checkedIds.length;
        
        const ruleScore = activeRules.length > 0 ? (checkedCount / activeRules.length) * 50 : 50;
        const hasPrePlan = session.preSessionComplete || todayTrades.length > 0;
        const hasPostNote = activeNote.length > 30;

        const totalScore = Math.min(100, Math.round(
          ruleScore + 
          (hasPrePlan ? 25 : 0) + 
          (hasPostNote ? 25 : 0)
        ));

        const getGrade = (s: number) => {
          if (s >= 90) return { grade: 'A', label: 'Elite Execution', color: '#22c55e' };
          if (s >= 75) return { grade: 'B', label: 'Strong Discipline', color: '#3b82f6' };
          if (s >= 60) return { grade: 'C', label: 'Average Focus', color: '#f59e0b' };
          if (s >= 40) return { grade: 'D', label: 'At Risk', color: '#f97316' };
          return { grade: 'F', label: 'System Breach', color: '#ef4444' };
        };

        return { score: totalScore, gradeInfo: getGrade(totalScore) };
    }, [rules, checkedIds, session.preSessionComplete, todayTrades.length, activeNote]);

    // RESTORE STREAK LOGIC
    const streak = useMemo(() => {
        let count = 0;
        const sortedLogs = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
        if (score >= 75) count = 1;

        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - 1);

        for (let i = 0; i < 30; i++) {
            const dStr = checkDate.toISOString().split('T')[0];
            const log = sortedLogs.find(l => l.date === dStr);
            if (log && (log.complianceScore ?? 0) >= 75) {
                count++;
            } else {
                break;
            }
            checkDate.setDate(checkDate.getDate() - 1);
        }
        return count;
    }, [dailyLogs, score]);
    
    // SVG Progress logic
    const radius = 70; // Matching the updated circle size
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const navToCapture = (type: string) => {
        setIsSheetOpen(false);
        router.push(`/capture?type=${type}`);
    };

    // TIME-AWARE GREETING
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        const firstName = user?.name?.split(' ')[0] || 'Trader';
        if (hour < 12) return `Good morning, ${firstName} ☀️`;
        if (hour < 17) return `Good afternoon, ${firstName} ☕`;
        return `Good evening, ${firstName} 🌙`;
    }, [user?.name]);

    const handleSetMood = (mood: string) => {
        logDaily({
            date: today,
            rulesChecked: checkedIds,
            tradesLogged: todayTrades.length,
            mood,
            rulesFollowed: checkedIds.length,
            rulesBroken: todayTrades.reduce((acc, t) => acc + (t.rules_broken?.length || 0), 0)
        });
    };

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col selection:bg-orange-100 italic-none pb-[calc(env(safe-area-inset-bottom)+84px)]">
            {/* STICKY HEADER */}
            <header className="sticky top-0 z-[100] h-[52px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-5">
                <h1 className="text-[17px] font-black text-[#1a1a2e]">RuleSci</h1>
                <div className="bg-orange-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-orange-100">
                    <Flame size={14} className={`text-orange-500 ${streak > 0 ? 'fill-orange-500 animate-pulse' : ''}`} />
                    <span className="text-[12px] font-black text-orange-600 tabular-nums">{streak} Day Streak</span>
                </div>
            </header>

            <main className="px-5">
                {/* GREETING & MOOD PULSE */}
                <header className="pt-6 mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-[24px] font-black text-[#1a1a2e] leading-tight">{greeting}</h2>
                        {streak > 7 && <span className="text-2xl animate-bounce">🔥</span>}
                    </div>
                    <p className="text-[13px] font-bold text-gray-400 capitalize mb-6">
                        {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>

                    {/* MOOD PICKER — BEFORE TRADING */}
                    <div className="bg-gray-50/50 border border-gray-100 rounded-[28px] p-5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Emotional Pulse Check</p>
                        <div className="flex justify-between px-2">
                            {['😭', '📉', '😐', '📈', '🚀'].map((emoji, i) => {
                                const moodVal = ['Distressed', 'Anxious', 'Neutral', 'Focused', 'Optimal'][i];
                                const isSelected = todayLog?.mood === moodVal;
                                return (
                                    <button 
                                        key={emoji}
                                        onClick={() => handleSetMood(moodVal)}
                                        className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all active:scale-90 ${
                                            isSelected ? 'bg-white shadow-lg shadow-gray-200 border border-gray-100 scale-110' : 'opacity-40 grayscale-[50%] hover:grayscale-0 hover:opacity-100'
                                        }`}
                                    >
                                        {emoji}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </header>

                {/* HERO METRIC CARD */}
                <section className="bg-[#1a1a2e] text-white rounded-[40px] p-8 shadow-2xl shadow-[#1a1a2e]/20 mb-8 relative overflow-hidden">
                    {/* Abstract design elements */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl text-blue-500" />
                    
                    <div className="relative z-10 flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Session Performance</p>
                            <h3 className="text-3xl font-black tabular-nums flex items-center gap-2">
                                {todayPnL >= 0 ? '+' : '-'}₹{Math.abs(todayPnL).toLocaleString()} 
                                <span className={`text-sm px-2 py-0.5 rounded-lg ${todayPnL >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {todayTrades.length} Trades
                                </span>
                            </h3>
                        </div>
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                <motion.circle 
                                    cx="32" cy="32" r="28" fill="transparent" 
                                    stroke={gradeInfo.color} strokeWidth="6" strokeDasharray={2 * Math.PI * 28}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                                    animate={{ strokeDashoffset: (2 * Math.PI * 28) - (score / 100) * (2 * Math.PI * 28) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-[15px] font-black">{gradeInfo.grade}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                        <div className="text-center">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Impact</p>
                            <p className="text-[15px] font-black text-red-400 tabular-nums">-{analytics.indisciplineCost / 1000}k</p>
                        </div>
                        <div className="text-center border-x border-white/5">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Discipline</p>
                            <p className="text-[15px] font-black text-white tabular-nums">{score}%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Streak</p>
                            <p className="text-[15px] font-black text-orange-400 tabular-nums">{streak}d</p>
                        </div>
                    </div>
                </section>

                {/* RULE CHECKLIST — EXPANDED BY DEFAULT */}
                <section className="mb-10">
                    <header className="flex items-center justify-between mb-5 px-1">
                        <div>
                            <h2 className="text-[14px] font-black text-[#1a1a2e] uppercase tracking-[0.15em] mb-1">System Compliance</h2>
                            <p className="text-[11px] font-bold text-gray-400">Tap to log execution for each rule.</p>
                        </div>
                        <button onClick={() => router.push('/rules')} className="text-[13px] font-black text-blue-600 px-4 py-2 bg-blue-50 rounded-full">Review</button>
                    </header>
                    <div className="flex flex-col gap-3">
                        {rules.filter(r => r.isActive).map((rule, i) => {
                            const isChecked = checkedIds.includes(rule.id);
                            const isViolated = !isChecked && todayTrades.some(t => t.rules_broken?.includes(rule.id));
                            return (
                                <div key={rule.id} 
                                    onClick={() => !isViolated && handleToggleRule(rule.id)}
                                    className={`bg-white rounded-3xl min-h-[72px] flex items-center px-4 gap-4 border-2 active:scale-[0.98] transition-all touch-manipulation cursor-pointer ${
                                        isChecked ? 'border-green-500/20 bg-green-50/20' : 
                                        isViolated ? 'border-red-500/20 opacity-60' : 'border-gray-50 bg-gray-50/30'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                        isChecked ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' : 
                                        isViolated ? 'bg-red-500 border-red-500 text-white' : 
                                        'border-gray-200 bg-white'
                                    }`}>
                                        {isChecked ? <Check size={20} strokeWidth={4} /> : isViolated ? <X size={20} strokeWidth={4} /> : i+1}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[16px] font-black text-[#1a1a2e] leading-tight ${isViolated ? 'line-through opacity-40 text-gray-400' : ''}`}>
                                                {rule.text}
                                            </span>
                                            <span className="text-lg grayscale-[50%]">{rule.emoji}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mt-0.5">{rule.category}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* SYSTEM LOCK CTA — PHILOSOPHICAL CORE */}
                {!session.rulesLocked && (
                    <section className="mb-10 px-4 py-10 bg-[#1a1a2e] rounded-[40px] text-white flex flex-col items-center text-center shadow-2xl shadow-blue-900/10 border border-blue-400/10">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                            <Shield size={32} className="text-blue-400" />
                        </div>
                        <h4 className="text-[20px] font-black mb-2 text-white">Engage System Lock?</h4>
                        <p className="text-[14px] font-bold text-gray-400 mb-8 px-8 max-w-[320px]">Lock your rules to prevent impulsive mid-session changes. Standard RuleSci protocol.</p>
                        <button 
                            onClick={lockRules}
                            className="w-full max-w-[260px] h-16 bg-blue-600 text-white rounded-3xl font-black text-[16px] shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                        >
                            Lock System Now
                        </button>
                    </section>
                )}
                {session.rulesLocked && (
                    <div className="mb-10 flex items-center justify-center gap-3 text-[11px] font-black text-blue-600 uppercase tracking-[0.25em] bg-blue-50/30 py-4 rounded-[32px] border border-blue-200/50">
                        <Shield size={16} className="fill-blue-600/10" />
                        System Discipline Shield Active
                    </div>
                )}

                {/* RECENT TRADES */}
                <section className="mb-4">
                    <header className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-[13px] font-black text-gray-400 uppercase tracking-[0.15em]">Recent Trades</h2>
                        <button onClick={() => router.push('/journal')} className="text-[13px] font-bold text-blue-600">See All →</button>
                    </header>
                    <div className="flex flex-col gap-2">
                        {todayTrades.length > 0 ? todayTrades.slice(0, 3).map(trade => (
                            <div key={trade.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all touch-manipulation">
                                <div className="flex flex-col gap-0.5 text-left">
                                    <span className="text-[15px] font-black text-[#1a1a2e]">{trade.pair}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${trade.type === 'Long' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {trade.type}
                                        </span>
                                        <span className="text-[11px] font-bold text-gray-300">Today</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-[16px] font-black tabular-nums ${(trade.pnl || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {(trade.pnl || 0) > 0 ? '+' : ''}${trade.pnl || 0}
                                    </span>
                                    <div className="flex gap-1">
                                        {[1,2,3].map(d => <div key={d} className={`w-1.5 h-1.5 rounded-full ${d === 3 ? 'bg-red-400' : 'bg-green-400'}`} />)}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-2">
                                <EmptyState 
                                    emoji="🎯"
                                    title="Zero to Hero"
                                    description="You haven't logged any trades today. Ready to build your legacy?"
                                    ctaText="Log a Trade"
                                    onCtaClick={() => setCaptureOpen(true)}
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* CALENDAR GRID */}
                <section className="mb-8">
                    <header className="mb-3 px-1">
                        <h2 className="text-[13px] font-black text-gray-400 uppercase tracking-[0.15em]">This Month</h2>
                    </header>
                    <div className="bg-gray-50/50 rounded-[28px] p-4 border border-gray-100">
                        <div className="grid grid-cols-7 gap-2">
                            {['M','T','W','T','F','S','S'].map(d => <span key={d} className="text-[10px] font-black text-gray-300 text-center">{d}</span>)}
                            {Array.from({ length: 31 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`aspect-square rounded-xl flex items-center justify-center text-[12px] font-bold transition-transform active:scale-90 ${
                                        i === 18 ? 'ring-2 ring-[#1a1a2e] bg-white' :
                                        i < 10 ? 'bg-green-100 text-green-700' :
                                        i < 15 ? 'bg-orange-100 text-orange-700' :
                                        'bg-white text-gray-200'
                                    }`}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CLOSE SESSION — PHILOSOPHICAL CORE */}
                {session.rulesLocked && (
                    <section className="mb-12">
                        <button 
                            onClick={() => setIsResetOpen(true)}
                            className="w-full h-16 bg-gray-50 text-[#1a1a2e] rounded-[32px] border border-gray-100 font-black text-[15px] flex items-center justify-center gap-3 active:scale-95 transition-all"
                        >
                            <Coffee size={20} className="text-[#1a1a2e]/40" />
                            Close Today's Session
                        </button>
                    </section>
                )}

                <MentalReset isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
            </main>

            {/* FAB */}
            <button 
                onClick={() => setIsSheetOpen(true)}
                className="fixed right-5 z-[120] w-[56px] h-[56px] rounded-full bg-[#1a1a2e] text-white flex items-center justify-center shadow-xl shadow-gray-400 active:scale-90 transition-all touch-manipulation"
                style={{ bottom: 'calc(env(safe-area-inset-bottom) + 104px)' }}
            >
                <Plus size={28} strokeWidth={3} />
            </button>

            {/* BOTTOM SHEET */}
            <AnimatePresence>
                {isSheetOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSheetOpen(false)}
                            className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[2px]"
                        />
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 right-0 bottom-0 z-[160] bg-white rounded-t-[32px] p-6 pb-[calc(env(safe-area-inset-bottom)+24px)] flex flex-col gap-6"
                        >
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-2" />
                            <h2 className="text-[18px] font-black text-[#1a1a2e]">New Entry</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => navToCapture('text')} className="bg-gray-50 h-[80px] rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all text-gray-600">
                                    <FileText size={24} />
                                    <span className="text-[13px] font-bold">Quick Text</span>
                                </button>
                                <button onClick={() => navToCapture('voice')} className="bg-orange-50 h-[80px] rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all text-orange-600">
                                    <Mic size={24} />
                                    <span className="text-[13px] font-bold">Voice</span>
                                </button>
                                <button onClick={() => navToCapture('photo')} className="bg-blue-50 h-[80px] rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all text-blue-600">
                                    <Camera size={24} />
                                    <span className="text-[13px] font-bold">Scan Photo</span>
                                </button>
                                <button onClick={() => navToCapture('checklist')} className="bg-green-50 h-[80px] rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all text-green-600">
                                    <ListChecks size={24} />
                                    <span className="text-[13px] font-bold">Checklist</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
