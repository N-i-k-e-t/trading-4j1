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
    TrendingDown
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

export default function DashboardPage() {
    const { user, rules, trades, dailyLogs, session, logDaily, setCaptureOpen, analytics } = useRuleSci();
    const router = useRouter();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [activeNote, setActiveNote] = useState('');

    const today = new Date().toISOString().split('T')[0];
    const todayTrades = useMemo(() => trades.filter(t => t.date === today), [trades, today]);
    const todayPnL = useMemo(() => todayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0), [todayTrades]);

    const todayLog = dailyLogs.find(d => d.date === today);
    const checkedIds = todayLog?.rulesChecked || [];

    const handleToggleRule = (ruleId: string) => {
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

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col selection:bg-orange-100 italic-none pb-[calc(env(safe-area-inset-bottom)+84px)]">
            {/* STICKY HEADER */}
            <header className="sticky top-0 z-[100] h-[52px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-5">
                <h1 className="text-[17px] font-black text-[#1a1a2e]">Today</h1>
                <div className="bg-orange-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-orange-100">
                    <Flame size={14} className="text-orange-500 fill-orange-500" />
                    <span className="text-[12px] font-black text-orange-600 tabular-nums">{streak} days</span>
                </div>
            </header>

            <main className="px-5">
                {/* GREETING */}
                <header className="pt-6 mb-4">
                    <h2 className="text-[20px] font-black text-[#1a1a2e] leading-tight">Good morning, {user?.name || 'Trader'}</h2>
                    <p className="text-[13px] font-bold text-gray-400 capitalize">
                        {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </header>

                {/* HERO METRIC CARD */}
                <section className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-4 flex flex-col items-center">
                    <div className="relative w-[140px] h-[140px] flex items-center justify-center mb-4">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="70" cy="70" r={radius - 8} fill="transparent" stroke="#f3f4f6" strokeWidth="10" />
                            <motion.circle 
                                cx="70" cy="70" r={radius - 8} fill="transparent" 
                                stroke={gradeInfo.color} strokeWidth="10" strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[36px] font-black text-[#1a1a2e] leading-none mb-0.5 tabular-nums">{checkedIds.length}/{rules.filter(r=>r.isActive).length}</span>
                            <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">rules</span>
                        </div>
                    </div>

                    <div 
                        className="px-6 py-2 rounded-full text-[13px] font-black uppercase tracking-widest mb-6"
                        style={{ backgroundColor: `${gradeInfo.color}15`, color: gradeInfo.color }}
                    >
                        Grade {gradeInfo.grade} — {gradeInfo.label}
                    </div>

                    <div className="w-full flex items-center justify-between border-t border-gray-50 pt-6">
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-1">Win Rate</span>
                            <span className="text-[18px] font-black text-[#1a1a2e] tabular-nums">48%</span>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-1">Impact</span>
                            <div className="flex items-center gap-0.5 text-[18px] font-black tabular-nums text-red-500">
                                <TrendingDown size={14} strokeWidth={3} />
                                <span>₹{analytics.indisciplineCost.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-1">Trades</span>
                            <span className="text-[18px] font-black text-[#1a1a2e] tabular-nums">{todayTrades.length}</span>
                        </div>
                    </div>
                </section>

                {/* RULE CHECKLIST — EXPANDED BY DEFAULT */}
                <section className="mb-4">
                    <header className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-[13px] font-black text-gray-400 uppercase tracking-[0.15em]">Priority Checklist</h2>
                        <button onClick={() => router.push('/rules')} className="text-[13px] font-black text-blue-600">Review All</button>
                    </header>
                    <div className="flex flex-col gap-2">
                        {rules.filter(r => r.isActive).map((rule, i) => {
                            const isChecked = checkedIds.includes(rule.id);
                            const isViolated = !isChecked && todayTrades.some(t => t.rules_broken.includes(rule.id));
                            return (
                                <div key={rule.id} 
                                    onClick={() => !isViolated && handleToggleRule(rule.id)}
                                    className={`bg-white rounded-2xl h-[64px] flex items-center px-4 gap-4 border active:scale-[0.98] transition-all touch-manipulation cursor-pointer ${
                                        isChecked ? 'border-green-100 shadow-sm shadow-green-50' : 
                                        isViolated ? 'border-red-100 opacity-60' : 'border-gray-50'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors ${
                                        isChecked ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' : 
                                        isViolated ? 'bg-red-500 border-red-500 text-white' : 
                                        'border-gray-100 bg-gray-50'
                                    }`}>
                                        {isChecked ? <Check size={18} strokeWidth={4} /> : isViolated ? <X size={18} strokeWidth={4} /> : null}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[15px] font-black text-[#1a1a2e] leading-tight line-clamp-1 ${isViolated ? 'line-through opacity-40 text-gray-400' : ''}`}>
                                            {rule.text}
                                        </span>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{rule.category}</span>
                                    </div>
                                    <span className="ml-auto text-xl">{rule.emoji}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

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
