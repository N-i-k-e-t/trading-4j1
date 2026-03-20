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
        <div className="flex flex-col gap-6 px-5 pt-8 pb-[calc(env(safe-area-inset-bottom)+84px)] italic-none">
            {/* AI COACH — HERO INSIGHT */}
            {aiOutput.coachMessages.length > 0 && (
                <section className="bg-[#1a1a2e] rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-[#eab308] text-[#1a1a2e] rounded-xl flex items-center justify-center">
                            <Lightbulb size={24} />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-black text-white leading-tight">Elite AI Coach</h3>
                            <span className="text-[10px] font-black text-[#eab308] uppercase tracking-widest">{aiOutput.coachMessages[0].tone} Architecture</span>
                        </div>
                    </div>
                    <p className="text-[15px] font-bold text-white/90 leading-relaxed italic border-l-2 border-[#eab308] pl-4 py-1">
                        &ldquo;{aiOutput.coachMessages[0].message}&rdquo;
                    </p>
                </section>
            )}

            {/* Streak & Leak Grid */}
            <div className="grid grid-cols-2 gap-4">
                <section className="card-premium flex flex-col items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="42" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                            <motion.circle cx="48" cy="48" r="42" stroke="#eab308" strokeWidth="8"
                                strokeDasharray={264}
                                strokeDashoffset={264 - (264 * streakPercent / 100)}
                                strokeLinecap="round" fill="transparent"
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-[#1a1a2e] tabular-nums">{streak}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Streak</span>
                        </div>
                    </div>
                </section>

                <section className="card-premium !bg-red-50 !border-red-100 flex flex-col items-center justify-center gap-1">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">System Leak</span>
                    <span className="text-[20px] font-black text-red-600 tabular-nums">
                        ₹{analytics.indisciplineCost.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-red-400/60 uppercase">Indiscipline Cost</span>
                </section>
            </div>

            {/* CAPITAL SCALING TRACKER */}
            <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2a2a4a] rounded-2xl p-6 text-white shadow-xl">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-[17px] font-black">Capital Scaling</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phase 1: Validation</p>
                    </div>
                    <div className="bg-[#eab308] px-3 py-1 rounded-lg">
                        <span className="text-[11px] font-black text-[#1a1a2e]">₹1L CAP</span>
                    </div>
                </header>

                <div className="flex flex-col gap-3 mb-6">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>Current Stage</span>
                        <span>Unlock 2L+</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(streak * 3.33, 100)}%` }}
                            className="h-full bg-[#eab308] shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                        />
                    </div>
                    <p className="text-[11px] font-bold text-gray-400">
                        {streak >= 30 ? 'Architecture Stable: Scaling Authorized.' : `${30 - streak} more days of compliance to scale.`}
                    </p>
                </div>
            </section>

            {/* Rule Compliance Chart */}
            <section>
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-[14px] font-black text-[#1a1a2e] uppercase tracking-widest">Compliance</h3>
                    <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
                        {['Week', 'Month', 'All'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${period ===p ? 'bg-white text-[#1a1a2e] shadow-sm' : 'text-gray-400'}`}
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
                    <EmptyState 
                        emoji="📈"
                        title="Architecture Growth"
                        description="Log trades and maintain discipline to see your performance stats here."
                        action={{ label: "Log First Trade", onClick: () => setCaptureOpen(true) }}
                    />
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
                            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Pattern Architecture</span>
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
                        description={`Log at least ${3 - trades.length} more trades to unlock architectural pattern analysis.`}
                        action={{ label: "Log Trade", onClick: () => setCaptureOpen(true) }}
                    />
                )}
            </section>
        </div>
    );
}
