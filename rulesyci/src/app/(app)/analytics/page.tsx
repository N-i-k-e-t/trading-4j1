'use client';

import { useState } from 'react';
import { useRuleSci } from '@/lib/context';
import {
    TrendingUp,
    Microscope,
    BarChart3,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { Trade } from '@/types/trading';

function MiniBarChart({ data }: { data: number[] }) {
    const max = Math.max(...data);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="mb-8">
            <div className="flex items-end gap-3 h-40 px-4">
                {data.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-3 h-full group">
                        <div
                            className="w-full max-w-[48px] rounded-t-lg transition-all duration-1000 ease-out min-h-[12px] shadow-sm group-hover:opacity-100 opacity-90"
                            style={{
                                height: `${(val / max) * 100}%`,
                                backgroundColor: val >= 80
                                    ? 'var(--accent-success)'
                                    : val >= 60
                                        ? 'var(--accent-warning)'
                                        : 'var(--accent-danger)',
                            }}
                        />
                        <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{days[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AnalyticsPanel({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={`card overflow-hidden transition-base border-[var(--border-color)] ${open ? 'shadow-md' : 'shadow-sm'}`}>
            <button
                className="flex items-center justify-between w-full p-6 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-base text-left"
                onClick={() => setOpen(!open)}
            >
                <h3 className="text-lg font-bold">{title}</h3>
                {open ? <ChevronUp size={20} strokeWidth={2.5} /> : <ChevronDown size={20} strokeWidth={2.5} />}
            </button>
            {open && (
                <div className="p-8 pt-2 border-t border-[var(--border-color)] animate-fade-in bg-[var(--bg-card)]">
                    {children}
                </div>
            )}
        </div>
    );
}

export default function AnalyticsPage() {
    const { analytics, trades, observations } = useRuleSci();

    const rulesFollowed = trades.filter((t) => t.followedRules).length;
    const totalTrades = trades.length;
    const adherenceRate = totalTrades > 0 ? Math.round((rulesFollowed / totalTrades) * 100) : 0;

    // Baseline state distribution
    const baselineCounts = trades.reduce<Record<string, number>>((acc, t) => {
        acc[t.emotion] = (acc[t.emotion] || 0) + 1;
        return acc;
    }, {});

    const sortedBaselines = Object.entries(baselineCounts).sort((a, b) => b[1] - a[1]);
    const primaryState = sortedBaselines[0]?.[0] || 'neutral';

    return (
        <div className="animate-fade-in-up max-w-[960px] mx-auto pb-24">
            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">My Stats</h1>
                <p className="text-[15px] text-[var(--text-secondary)] mt-1 font-medium">Your progress data. Statistics that help you grow.</p>
            </div>

            {/* Primary Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="card p-8 flex flex-col items-center justify-center text-center">
                    <TrendingUp size={24} strokeWidth={2.5} className="text-[var(--accent-primary)] mb-3" />
                    <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Streak</span>
                    <span className="text-3xl font-bold text-[var(--text-primary)] leading-tight">{analytics.consistencyDays} Days</span>
                </div>
                <div className="card p-8 flex flex-col items-center justify-center text-center">
                    <BarChart3 size={24} strokeWidth={2.5} className="text-[var(--accent-primary)] mb-3" />
                    <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Rule Score</span>
                    <span className="text-3xl font-bold text-[var(--text-primary)] leading-tight">{adherenceRate}%</span>
                </div>
                <div className="card p-8 flex flex-col items-center justify-center text-center">
                    <Microscope size={24} strokeWidth={2.5} className="text-[var(--accent-primary)] mb-3" />
                    <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Trading Trend</span>
                    <span className="text-3xl font-bold text-[var(--text-primary)] leading-tight capitalize">{analytics.behavioralTrend}</span>
                </div>
            </div>

            {/* Collapsible Analytics Panels */}
            <div className="flex flex-col gap-6">
                <AnalyticsPanel title="Weekly Stability" defaultOpen={true}>
                    <MiniBarChart data={analytics.weeklyStability} />
                    <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 mt-4">
                        <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] font-medium">
                            Average stability:{' '}
                            <strong className="text-[var(--text-primary)] font-bold">
                                {Math.round(
                                    analytics.weeklyStability.reduce((a, b) => a + b, 0) /
                                    analytics.weeklyStability.length
                                )}%
                            </strong>{' '}
                            across 7 sessions.{' '}
                            {analytics.weeklyStability[6] > analytics.weeklyStability[0]
                                ? 'Observation: stability increased through the week. Structure held under repeated exposure.'
                                : 'Observation: stability decreased mid-week. Examine environmental or behavioral triggers.'}
                        </p>
                    </div>
                </AnalyticsPanel>

                <AnalyticsPanel title="Mood Breakdown">
                    <div className="flex flex-col gap-6 mb-8 mt-4">
                        {Object.entries(baselineCounts).map(([state, count]) => (
                            <div key={state} className="flex items-center gap-6">
                                <span className="text-sm font-bold text-[var(--text-primary)] capitalize w-24 flex-shrink-0">{state}</span>
                                <div className="flex-1 h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-1000 ease-out shadow-sm rounded-full"
                                        style={{
                                            width: `${(count / totalTrades) * 100}%`,
                                            backgroundColor: ['neutral', 'controlled'].includes(state)
                                                ? 'var(--accent-primary)'
                                                : state === 'uncertain'
                                                    ? 'var(--text-muted)'
                                                    : 'var(--accent-warning)',
                                        }}
                                    />
                                </div>
                                <span className="text-[13px] font-bold text-[var(--text-muted)] w-10 text-right">{count}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
                        <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] font-medium">
                            Most frequent baseline state during execution:{' '}
                            <strong className="text-[var(--text-primary)] font-bold capitalize">
                                {primaryState}
                            </strong>.
                            Correlation between mood and rule following can indicate triggers for further study.
                        </p>
                    </div>
                </AnalyticsPanel>

                <AnalyticsPanel title="Trade Statistics">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                        <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 text-center">
                            <span className="block text-3xl font-bold text-[var(--text-primary)] leading-tight mb-1">{totalTrades}</span>
                            <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Total Trades</span>
                        </div>
                        <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 text-center">
                            <span className="block text-3xl font-bold text-[var(--accent-success)] leading-tight mb-1">{rulesFollowed}</span>
                            <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Kept Rules</span>
                        </div>
                        <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 text-center">
                            <span className="block text-3xl font-bold text-[var(--accent-danger)] leading-tight mb-1">{totalTrades - rulesFollowed}</span>
                            <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Violations</span>
                        </div>
                        <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 text-center">
                            <span className="block text-3xl font-bold text-[var(--text-primary)] leading-tight mb-1">{observations.length}</span>
                            <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Journal</span>
                        </div>
                    </div>
                </AnalyticsPanel>

                <AnalyticsPanel title="Biggest Mistake Pattern">
                    <div className="p-8 border-2 border-[var(--accent-danger)]/10 bg-[var(--accent-danger)]/[0.02] rounded-2xl mt-4">
                        <span className="badge badge-deviation py-2 px-6 mb-4">{analytics.primaryDeviation}</span>
                        <p className="text-[16px] leading-relaxed text-[var(--text-secondary)] font-medium italic">
                            "This is the most frequently observed behavioral pattern preceding rule deviations. Consider implementing a structural intervention: a pre-execution checklist addressing this specific trigger to destabilize the habit loop."
                        </p>
                    </div>
                </AnalyticsPanel>
            </div>
        </div>
    );
}
