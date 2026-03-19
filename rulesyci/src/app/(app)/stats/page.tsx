'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import { runOrchestrator } from '@/lib/agents/orchestrator';
import EmptyState from '@/components/ui/EmptyState';
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
        <div className="flex flex-col gap-4 px-5 pb-[calc(env(safe-area-inset-bottom)+84px)] italic-none">
            {/* AI COACH — HERO INSIGHT */}
            {aiOutput.coachMessages.length > 0 && (
                <section className="bg-[#1a1a2e] rounded-[32px] p-6 text-white shadow-xl shadow-[#1a1a2e]/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#2563eb] text-white rounded-xl flex items-center justify-center">
                            <Lightbulb size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-white">Elite AI Coach</h3>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{aiOutput.coachMessages[0].tone}</span>
                        </div>
                    </div>
                    <p className="text-[15px] font-bold text-white/90 leading-relaxed italic border-l-2 border-blue-500 pl-4 py-1">
                        &ldquo;{aiOutput.coachMessages[0].message}&rdquo;
                    </p>
                </section>
            )}

            {/* Streak & Score Grid */}
            <div className="grid grid-cols-2 gap-3">
                <section className="bg-white rounded-[32px] p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="42" stroke="rgba(37, 99, 235, 0.05)" strokeWidth="8" fill="transparent" />
                            <motion.circle cx="48" cy="48" r="42" stroke="#2563eb" strokeWidth="8"
                                strokeDasharray={264}
                                strokeDashoffset={264 - (264 * streakPercent / 100)}
                                strokeLinecap="round" fill="transparent"
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-[#1a1a2e] tabular-nums">{streak}</span>
                            <span className="text-[9px] font-black text-[#9ca3af] uppercase tracking-wider">Streak</span>
                        </div>
                    </div>
                </section>

                <section className="bg-red-50/50 rounded-[32px] p-5 border border-red-100/50 flex flex-col items-center justify-center gap-1">
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest text-center">Indiscipline Leak</span>
                    <span className={`text-[20px] font-black tabular-nums ${analytics.indisciplineCost > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{analytics.indisciplineCost.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-red-400/60 uppercase tracking-wide">
                        {analytics.indisciplineCost > 0 ? 'Total Penalties' : 'Zero Leakage'}
                    </span>
                </section>
            </div>

            {/* CAPITAL SCALING TRACKER — PHILOSOPHICAL CORE */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[32px] p-6 text-white shadow-xl shadow-blue-200">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-base font-black">Capital Scaling</h3>
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Bootcamp Phase 1</p>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-full border border-white/20">
                        <span className="text-[12px] font-black">₹1L Cap</span>
                    </div>
                </header>

                <div className="flex flex-col gap-3 mb-6">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-blue-100">
                        <span>Current Tier</span>
                        <span>Unlock 2L</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(streak * 2, 100)}%` }}
                            className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        />
                    </div>
                    <p className="text-[11px] font-bold text-blue-100/70">
                        {streak >= 30 ? 'Elite Status: Scalable to 2L+' : `${30 - streak} more days of discipline to scale.`}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                        <p className="text-[9px] font-black text-blue-100/50 uppercase mb-1">Status</p>
                        <p className="text-[14px] font-black">{streak >= 10 ? 'Green Light' : 'Bootcamp'}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                        <p className="text-[9px] font-black text-blue-100/50 uppercase mb-1">Max Lot Size</p>
                        <p className="text-[14px] font-black">{streak >= 10 ? 'Standard' : 'Reduced'}</p>
                    </div>
                </div>
            </section>

            {/* Rule Compliance Chart */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest">Rule Compliance</h3>
                    <div className="flex gap-1.5 bg-gray-50 p-1 rounded-full">
                        {['Week', 'Month', 'All'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 h-7 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${period === p ? 'bg-white text-[#1a1a2e] shadow-sm' : 'text-gray-300'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {compliance.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {compliance.map((item, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[14px] font-bold text-[#1a1a2e]">{item.rule}</span>
                                    <span className={`text-[13px] font-black tabular-nums ${item.value > 80 ? 'text-[#22c55e]' : item.value > 60 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}`}>
                                        {item.value}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`h-full ${item.value > 80 ? 'bg-[#22c55e]' : item.value > 60 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-2 flex flex-col items-center">
                        <EmptyState 
                            emoji="📈"
                            title="Growth Ahead"
                            description="Log trades and mark rule compliance to see your performance stats here."
                            ctaText="Log First Trade"
                            onCtaClick={() => setCaptureOpen(true)}
                        />
                    </div>
                )}
            </section>

            {/* Trading Pattern Insights */}
            <section className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-[24px] px-4 py-4 shadow-sm flex flex-col gap-1 border border-gray-100">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Rules Followed</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[24px] font-black text-[#1a1a2e] tabular-nums">{followedWinRate}%</span>
                        <span className="text-[10px] font-black text-green-500 uppercase">Win</span>
                    </div>
                </div>
                <div className="bg-white rounded-[24px] px-4 py-4 shadow-sm flex flex-col gap-1 border border-gray-100">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Broke Rules</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[24px] font-black text-[#1a1a2e] tabular-nums">{brokenWinRate}%</span>
                        <span className="text-[10px] font-black text-red-500 uppercase">Win</span>
                    </div>
                </div>
            </section>

            {/* Heatmap */}
            <section className="bg-gray-50/50 rounded-[28px] px-5 py-5 border border-gray-100">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Weekly Discipline</h3>
                    <Info size={14} className="text-gray-200" />
                </div>
                <div className="flex justify-between gap-1">
                    {heatmap.map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className={`w-9 h-9 rounded-xl ${item.color} border border-gray-100/50`} />
                            <span className="text-[10px] font-black text-gray-300">{item.day}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI Insights & Alerts */}
            <section className="flex flex-col gap-4">
                {aiOutput.insights.map(insight => (
                    <div key={insight.id} className="bg-[#f59e0b]/5 rounded-2xl px-5 py-4 border border-[#f59e0b]/10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider">Pattern Detected</span>
                            <span className="text-[10px] font-bold text-[#9ca3af]">({Math.round(insight.confidence * 100)}% confidence)</span>
                        </div>
                        <p className="text-[14px] font-semibold text-[#1a1a2e] mb-1">{insight.pattern}</p>
                        <p className="text-[13px] text-[#6b7280]">{insight.suggestion}</p>
                    </div>
                ))}

                {/* Risk Alerts */}
                {aiOutput.riskAlerts.map((alert, i) => (
                    <div key={i} className={`rounded-2xl px-5 py-4 flex items-start gap-3 ${
                        alert.severity === 'critical' ? 'bg-[#ef4444]/10 border border-[#ef4444]/20' : 'bg-[#f59e0b]/10 border border-[#f59e0b]/20'
                    }`}>
                        <ShieldAlert size={18} className={alert.severity === 'critical' ? 'text-[#ef4444] mt-0.5' : 'text-[#f59e0b] mt-0.5'} />
                        <div>
                            <p className="text-[14px] font-semibold text-[#1a1a2e]">{alert.alert}</p>
                            {alert.action && (
                                <span className={`text-[11px] font-bold uppercase mt-1 inline-block ${
                                    alert.severity === 'critical' ? 'text-[#ef4444]' : 'text-[#f59e0b]'
                                }`}>
                                    Suggested: {alert.action}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {aiOutput.insights.length === 0 && (
                    <div className="py-4">
                        <EmptyState 
                            emoji="🧠"
                            title="Brain Power Pending"
                            description={`Log at least ${Math.max(0, 3 - trades.length)} more trades to unlock AI pattern analysis.`}
                            ctaText="Log a Trade"
                            onCtaClick={() => setCaptureOpen(true)}
                        />
                    </div>
                )}
            </section>
        </div>
    );
}
