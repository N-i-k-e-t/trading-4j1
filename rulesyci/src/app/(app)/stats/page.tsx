'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import { runOrchestrator } from '@/lib/agents/orchestrator';
import { EmptyState } from '@/components/ui/EmptyState';
import {
    Flame,
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Info,
    ShieldAlert
} from 'lucide-react';

export default function StatsPage() {
    const { trades, rules, dailyLogs, userModel, setCaptureOpen, analytics } = useRuleSci();
    const [period, setPeriod] = useState('All');

    // Filter trades by period
    const filteredTrades = useMemo(() => {
        if (period === 'All') return trades;
        const now = new Date();
        const cutoff = new Date();
        if (period === 'Week') cutoff.setDate(now.getDate() - 7);
        if (period === 'Month') cutoff.setDate(now.getDate() - 30);
        const cutoffStr = cutoff.toISOString().split('T')[0];
        return trades.filter(t => t.date >= cutoffStr);
    }, [trades, period]);

    // Streak
    const { streak, bestStreak } = useMemo(() => {
        let current = 0;
        let best = 0;
        const sortedLogs = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
        const d = new Date();
        for (let i = 0; i < 365; i++) {
            const dateStr = d.toISOString().split('T')[0];
            const log = sortedLogs.find(l => l.date === dateStr);
            if (log && (log.rulesChecked.length > 0 || log.tradesLogged > 0)) {
                current++;
            } else if (i > 0) {
                break;
            }
            d.setDate(d.getDate() - 1);
        }

        // Compute best streak
        let tempStreak = 0;
        const ascending = [...dailyLogs].sort((a, b) => a.date.localeCompare(b.date));
        ascending.forEach(log => {
            if (log.rulesChecked.length > 0 || log.tradesLogged > 0) {
                tempStreak++;
                if (tempStreak > best) best = tempStreak;
            } else {
                tempStreak = 0;
            }
        });
        if (current > best) best = current;

        return { streak: current, bestStreak: best };
    }, [dailyLogs]);

    // Per-rule compliance
    const compliance = useMemo(() => {
        const activeRules = rules.filter(r => r.isActive);
        return activeRules.map(rule => {
            const relevant = filteredTrades.filter(t =>
                t.rules_followed.includes(rule.id) || t.rules_broken.includes(rule.id)
            );
            const followed = relevant.filter(t => t.rules_followed.includes(rule.id)).length;
            const value = relevant.length > 0 ? Math.round((followed / relevant.length) * 100) : 0;
            return { rule: rule.text, value, total: relevant.length };
        }).filter(c => c.total > 0);
    }, [filteredTrades, rules]);

    // Win rates
    const { followedWinRate, brokenWinRate } = useMemo(() => {
        const cleanTrades = filteredTrades.filter(t => t.rules_broken.length === 0);
        const dirtyTrades = filteredTrades.filter(t => t.rules_broken.length > 0);
        return {
            followedWinRate: cleanTrades.length > 0 ? Math.round((cleanTrades.length / filteredTrades.length) * 100) : 0,
            brokenWinRate: dirtyTrades.length > 0 ? Math.round((dirtyTrades.length / filteredTrades.length) * 100) : 0,
        };
    }, [filteredTrades]);

    // Heatmap (last 7 days)
    const heatmap = useMemo(() => {
        const result = [];
        const d = new Date();
        // Go back to last Monday
        const dayOfWeek = d.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        d.setDate(d.getDate() - diff);

        for (let i = 0; i < 7; i++) {
            const dateStr = d.toISOString().split('T')[0];
            const log = dailyLogs.find(l => l.date === dateStr);
            const dayTrades = trades.filter(t => t.date === dateStr);
            let color = 'bg-[#1a1a2e]/5'; // No activity
            if (log && log.tradesLogged > 0) {
                const hasBroken = dayTrades.some(t => t.rules_broken.length > 0);
                const allFollowed = dayTrades.every(t => t.rules_broken.length === 0);
                if (allFollowed) color = 'bg-[#22c55e]/30';
                else if (hasBroken) color = 'bg-[#ef4444]/20';
            } else if (log && log.rulesChecked.length > 0) {
                color = 'bg-[#22c55e]/15';
            }
            result.push({ day: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i], color });
            d.setDate(d.getDate() + 1);
        }
        return result;
    }, [dailyLogs, trades]);

    // AI Insights
    const aiOutput = useMemo(() => {
        return runOrchestrator(trades, rules, dailyLogs, streak, bestStreak, null, userModel);
    }, [trades, rules, dailyLogs, streak, bestStreak, userModel]);

    const streakPercent = bestStreak > 0 ? Math.min((streak / Math.max(bestStreak, 1)) * 100, 100) : (streak > 0 ? 100 : 0);

    return (
        <div className="min-h-[100dvh] flex flex-col gap-6 px-5 pt-[calc(env(safe-area-inset-top)+20px)] pb-[calc(env(safe-area-inset-bottom)+110px)] italic-none overflow-x-hidden">
            {/* HEADER */}
            <header className="px-1 mb-2">
                <h1 className="text-[38px] font-black text-[#1a1a2e] leading-none mb-2 tracking-tighter">My Stats.</h1>
                <p className="text-[14px] font-bold text-gray-400 uppercase tracking-widest pl-1">Analyze my trading performance</p>
            </header>

            {/* AI COACH — HERO INSIGHT */}
            {aiOutput.coachMessages.length > 0 && (
                <section className="bg-[#1a1a2e] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Lightbulb size={120} />
                    </div>
                    <div className="flex items-center gap-5 mb-6 relative z-10">
                        <div className="w-16 h-16 bg-white text-[#1a1a2e] rounded-full flex items-center justify-center shadow-xl">
                            <Lightbulb size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-[20px] font-black text-white leading-tight">AI Coach</h3>
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Today's Insight</span>
                        </div>
                    </div>
                    <p className="text-[17px] font-bold text-white leading-relaxed italic border-l-4 border-white/20 pl-6 py-2 relative z-10">
                        &ldquo;{aiOutput.coachMessages[0].message}&rdquo;
                    </p>
                </section>
            )}

            {/* Streak & Leak Grid */}
            <div className="grid grid-cols-2 gap-4">
                <section className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col items-center">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="56" cy="56" r="50" stroke="#f8fafc" strokeWidth="10" fill="transparent" />
                            <motion.circle cx="56" cy="56" r="50" stroke="#1a1a2e" strokeWidth="10"
                                strokeDasharray={314}
                                strokeDashoffset={314 - (314 * streakPercent / 100)}
                                strokeLinecap="round" fill="transparent"
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-[#1a1a2e] tabular-nums leading-none mb-1">{streak}</span>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Days</span>
                        </div>
                    </div>
                </section>

                <section className="bg-red-50/50 rounded-[32px] p-6 border border-red-100 flex flex-col items-center justify-center gap-2">
                    <span className="text-[11px] font-black text-red-500 uppercase tracking-widest">Money Lost to Broken Rules</span>
                    <span className="text-[24px] font-black text-red-600 tabular-nums leading-none">
                        ₹{analytics.indisciplineCost.toLocaleString()}
                    </span>
                    <p className="text-[10px] font-bold text-red-400/60 uppercase text-center px-2">Cost of Breaking Rules</p>
                </section>
            </div>

            {/* CAPITAL SCALING TRACKER */}
            <section className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm overflow-hidden relative">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-[22px] font-black text-[#1a1a2e] tracking-tight">Account Growth</h3>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-0.5">Level 1: Building Habits</p>
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
                        <span className="text-[12px] font-black text-green-600">₹1L CAP Active</span>
                    </div>
                </header>

                <div className="flex flex-col gap-4 mb-2">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1a2e]">
                        <span>Starting Point</span>
                        <span className="opacity-30">Unlock Next Level</span>
                    </div>
                    <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(streak * 3.33, 100)}%` }}
                            className="h-full bg-[#1a1a2e] rounded-full shadow-lg"
                        />
                    </div>
                    <p className="text-[14px] font-bold text-gray-400 pl-1">
                        {streak >= 30 ? 'Habits Stable: Scaling Ready.' : `${30 - streak} days of discipline until you can scale.`}
                    </p>
                </div>
            </section>

            {/* Rule Compliance Chart */}
            <section className="px-1">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[16px] font-black text-[#1a1a2e] uppercase tracking-[0.2em]">Monthly Discipline %</h3>
                    <div className="flex gap-2 bg-gray-50 p-1.5 rounded-[20px] border border-gray-100 shadow-inner">
                        {['Week', 'Month', 'All'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-5 h-10 rounded-[15px] text-[11px] font-black uppercase tracking-widest transition-all ${period ===p ? 'bg-white text-[#1a1a2e] shadow-sm' : 'text-gray-400'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {compliance.length > 0 ? (
                    <div className="flex flex-col gap-5">
                        {compliance.map((item, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[15px] font-bold text-[#1a1a2e]">{item.rule}</span>
                                    <span className={`text-[13px] font-black tabular-nums ${item.value > 80 ? 'text-green-500' : item.value > 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {item.value}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`h-full ${item.value > 80 ? 'bg-green-500' : item.value > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl">📈</div>
                        <h3 className="text-[18px] font-black text-[#1a1a2e]">Your progress will appear after your first week.</h3>
                        <p className="text-[14px] font-bold text-gray-400">Log trades daily and we'll show you patterns you can't see on your own.</p>
                        <button 
                            onClick={() => setCaptureOpen(true)}
                            className="bg-[#1a1a2e] text-white px-8 h-12 rounded-full font-black text-[13px] uppercase tracking-widest mt-2"
                        >
                            Start Today →
                        </button>
                    </div>
                )}
            </section>

            {/* Trading Pattern Insights */}
            <section className="grid grid-cols-2 gap-4">
                <div className="card-premium">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Rules Kept</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[24px] font-black text-green-600 tabular-nums">{followedWinRate}%</span>
                        <span className="text-[10px] font-black text-green-500 uppercase">Win</span>
                    </div>
                </div>
                <div className="card-premium">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Rules Broken</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[24px] font-black text-red-600 tabular-nums">{brokenWinRate}%</span>
                        <span className="text-[10px] font-black text-red-500 uppercase">Win</span>
                    </div>
                </div>
            </section>

            {/* AI Insights & Alerts */}
            <section className="flex flex-col gap-4">
                {aiOutput.insights.map(insight => (
                    <div key={insight.id} className="card-premium !bg-yellow-50/30 !border-yellow-100">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Trading Pattern</span>
                            <span className="text-[10px] font-bold text-gray-400">({Math.round(insight.confidence * 100)}% Conf.)</span>
                        </div>
                        <p className="text-[15px] font-black text-[#1a1a2e] mb-1">{insight.pattern}</p>
                        <p className="text-[13px] font-bold text-gray-400">{insight.suggestion}</p>
                    </div>
                ))}

                {aiOutput.riskAlerts.map((alert, i) => (
                    <div key={i} className={`card-premium flex items-start gap-4 ${
                        alert.severity === 'critical' ? '!bg-red-50 !border-red-100' : '!bg-yellow-50 !border-yellow-100'
                    }`}>
                        <ShieldAlert size={20} className={alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-600'} />
                        <div>
                            <p className="text-[15px] font-black text-[#1a1a2e]">{alert.alert}</p>
                            {alert.action && (
                                <span className={`text-[11px] font-black uppercase mt-1 inline-block ${
                                    alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-600'
                                }`}>
                                    Suggested: {alert.action}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {aiOutput.insights.length === 0 && trades.length < 3 && (
                    <EmptyState 
                        emoji="🧠"
                        title="AI Analysis Pending"
                        description={`Log at least ${3 - trades.length} more trades to unlock detailed pattern analysis.`}
                        action={{ label: "Log Trade", onClick: () => setCaptureOpen(true) }}
                    />
                )}
            </section>
        </div>
    );
}
