'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Flame,
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Info
} from 'lucide-react';

export default function StatsPage() {
    const [period, setPeriod] = useState('Week');

    const compliance = [
        { rule: "Stop Loss", value: 92 },
        { rule: "Max 3 Trades", value: 78 },
        { rule: "Risk < 2%", value: 85 },
        { rule: "Wait for Setup", value: 64 },
    ];

    return (
        <div className="flex flex-col gap-10 pb-12">
            {/* Header */}
            <header>
                <h1 className="text-[28px] font-bold text-[#1a1a2e] mb-2">Performance</h1>
                <p className="text-base text-[#6b7280]">Analyze your discipline patterns and growth.</p>
            </header>

            {/* Streak & Score */}
            <section className="flex flex-col items-center justify-center p-8 bg-white rounded-[32px] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Circular Progress (Simplified) */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="80" cy="80" r="70"
                            stroke="rgba(37, 99, 235, 0.05)"
                            strokeWidth="12"
                            fill="transparent"
                        />
                        <circle
                            cx="80" cy="80" r="70"
                            stroke="#2563eb"
                            strokeWidth="12"
                            strokeDasharray={440}
                            strokeDashoffset={440 - (440 * 0.85)}
                            strokeLinecap="round"
                            fill="transparent"
                            className="transition-all duration-1000"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-[#1a1a2e]">12</span>
                        <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest mt-1">Day Streak</span>
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute top-0 right-0 p-2 bg-[#f59e0b] text-white rounded-full shadow-lg"
                    >
                        <Flame size={20} fill="currentColor" />
                    </motion.div>
                </div>
                <p className="mt-8 text-sm font-bold text-[#9ca3af] uppercase tracking-wider">Best streak: 28 days</p>
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
                                className={`px-4 h-8 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${period === p ? 'bg-white text-[#1a1a2e] shadow-sm' : 'text-[#6b7280]'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {compliance.map((item, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[15px] font-semibold text-[#1a1a2e]">{item.rule}</span>
                                <span className={`text-sm font-bold ${item.value > 80 ? 'text-[#22c55e]' : item.value > 60 ? 'text-[#f59e0b]' : 'text-[#ef4444]'
                                    }`}>{item.value}%</span>
                            </div>
                            <div className="w-full h-3 bg-[#1a1a2e]/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className={`h-full ${item.value > 80 ? 'bg-[#22c55e]' : item.value > 60 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'
                                        }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trading Pattern Insights */}
            <section className="grid grid-cols-2 gap-4">
                <div className="card flex flex-col gap-4 border-l-4 border-[#22c55e]">
                    <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Followed Rules</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#1a1a2e]">72%</span>
                        <span className="text-[12px] font-bold text-[#22c55e]">Win Rate</span>
                    </div>
                    <TrendingUp size={24} className="text-[#22c55e] opacity-20 ml-auto" />
                </div>
                <div className="card flex flex-col gap-4 border-l-4 border-[#ef4444]">
                    <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Broke Rules</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#1a1a2e]">34%</span>
                        <span className="text-[12px] font-bold text-[#ef4444]">Win Rate</span>
                    </div>
                    <TrendingDown size={24} className="text-[#ef4444] opacity-20 ml-auto" />
                </div>
            </section>

            {/* Heatmap (Simplified Placeholder) */}
            <section className="card">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-[#6b7280] uppercase tracking-wider">Weekly Discipline</h3>
                    <Info size={14} className="text-[#9ca3af]" />
                </div>
                <div className="flex justify-between gap-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${i === 0 ? 'bg-[#ef4444]/20' : i === 5 || i === 6 ? 'bg-[#1a1a2e]/5' : 'bg-[#22c55e]/30'
                                }`} />
                            <span className="text-[11px] font-bold text-[#9ca3af]">{day}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI Insights */}
            <section>
                <div className="card bg-[#2563eb]/5 border-2 border-[#2563eb]/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#2563eb] text-white rounded-xl flex items-center justify-center">
                            <Lightbulb size={20} />
                        </div>
                        <h3 className="text-base font-bold text-[#1a1a2e]">AI Insights</h3>
                    </div>
                    <p className="text-[15px] text-[#6b7280] leading-relaxed italic">
                        "You break rules most often on Monday mornings. Consider starting Mondays with a reflection session or lowering your size by 50% until you find your rhythm."
                    </p>
                </div>
            </section>
        </div>
    );
}
