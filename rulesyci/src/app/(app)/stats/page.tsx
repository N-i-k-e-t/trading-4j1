'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import { runOrchestrator } from '@/lib/agents/orchestrator';
import {
    Flame,
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Info,
    ShieldAlert
} from 'lucide-react';

export default function StatsPage() {
    const { trades, rules, dailyLogs } = useRuleSci();
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
        return runOrchestrator(trades, rules, dailyLogs, streak, bestStreak, null);
    }, [trades, rules, dailyLogs, streak, bestStreak]);

    const streakPercent = bestStreak > 0 ? Math.min((streak / Math.max(bestStreak, 1)) * 100, 100) : (streak > 0 ? 100 : 0);

    return (
        <div className="flex flex-col gap-8 md:gap-10 pb-12">
            {/* Header */}
            <header>
                <h1 className="text-[22px] font-bold text-[#1a1a2e] mb-2">Performance</h1>
                <p className="text-base text-[#6b7280]">Analyze your discipline patterns and growth.</p>
            </header>

            {/* Streak & Score */}
            <section className="flex flex-col items-center justify-center p-8 bg-white rounded-[32px] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="rgba(37, 99, 235, 0.05)" strokeWidth="12" fill="transparent" />
                        <circle cx="80" cy="80" r="70" stroke="#2563eb" strokeWidth="12"
                            strokeDasharray={440}
                            strokeDashoffset={440 - (440 * streakPercent / 100)}
                            strokeLinecap="round" fill="transparent"
                            className="transition-all duration-1000"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-[#1a1a2e]">{streak}</span>
                        <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest mt-1">Day Streak</span>
                    </div>
                    {streak > 0 && (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute top-0 right-0 p-2 bg-[#f59e0b] text-white rounded-full shadow-lg"
                        >
                            <Flame size={20} fill="currentColor" />
                        </motion.div>
                    )}
                </div>
                <p className="mt-8 text-sm font-bold text-[#9ca3af] uppercase tracking-wider">
                    Best streak: {bestStreak} day{bestStreak !== 1 ? 's' : ''}
                </p>
            </section>

            {/* Rule Compliance Chart */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-[#1a1a2e]">Rule Compliance</h2>
                    <div className="flex gap-2 bg-[#1a1a2e]/5 p-1 rounded-full">
                        {['Week', 'Month', 'All'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 h-8 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${period === p ? 'bg-white text-[#1a1a2e] shadow-sm' : 'text-[#6b7280]'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {compliance.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        {compliance.map((item, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[15px] font-semibold text-[#1a1a2e]">{item.rule}</span>
                                    <span className={`text-sm font-bold ${item.value > 80 ? 'text-[#22c55e]' : item.value > 60 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}`}>
                                        {item.value}%
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-[#1a1a2e]/5 rounded-full overflow-hidden">
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
                    <div className="text-center py-8 text-[#9ca3af]">
                        <p className="font-medium">No compliance data yet</p>
                        <p className="text-sm mt-1">Log trades and mark rule compliance to see stats here</p>
                    </div>
                )}
            </section>

            {/* Trading Pattern Insights */}
            <section className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl px-4 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-4 border-l-4 border-[#22c55e]">
                    <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Rules Followed</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#1a1a2e]">{followedWinRate}%</span>
                        <span className="text-[12px] font-bold text-[#22c55e]">Clean</span>
                    </div>
                    <TrendingUp size={24} className="text-[#22c55e] opacity-20 ml-auto" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-4 border-l-4 border-[#ef4444]">
                    <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Broke Rules</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#1a1a2e]">{brokenWinRate}%</span>
                        <span className="text-[12px] font-bold text-[#ef4444]">Violated</span>
                    </div>
                    <TrendingDown size={24} className="text-[#ef4444] opacity-20 ml-auto" />
                </div>
            </section>

            {/* Heatmap */}
            <section className="bg-white rounded-2xl px-5 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-[#6b7280] uppercase tracking-wider">Weekly Discipline</h3>
                    <Info size={14} className="text-[#9ca3af]" />
                </div>
                <div className="flex justify-between gap-2">
                    {heatmap.map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${item.color}`} />
                            <span className="text-[11px] font-bold text-[#9ca3af]">{item.day}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI Insights */}
            <section className="flex flex-col gap-4">
                {/* Coach Message */}
                {aiOutput.coachMessages.length > 0 && (
                    <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border-2 border-[#2563eb]/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#2563eb] text-white rounded-xl flex items-center justify-center">
                                <Lightbulb size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#1a1a2e]">AI Coach</h3>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                    aiOutput.coachMessages[0].tone === 'encouraging' ? 'text-[#22c55e]' :
                                    aiOutput.coachMessages[0].tone === 'warning' ? 'text-[#f59e0b]' : 'text-[#9ca3af]'
                                }`}>
                                    {aiOutput.coachMessages[0].tone}
                                </span>
                            </div>
                        </div>
                        <p className="text-[15px] text-[#6b7280] leading-relaxed italic">
                            &ldquo;{aiOutput.coachMessages[0].message}&rdquo;
                        </p>
                    </div>
                )}

                {/* Pattern Insights */}
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

                {aiOutput.insights.length === 0 && trades.length < 3 && (
                    <div className="text-center py-6 text-[#9ca3af]">
                        <p className="font-medium">Log at least 3 trades to unlock AI pattern analysis</p>
                    </div>
                )}
            </section>
        </div>
    );
}
