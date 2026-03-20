'use client';

import PnLCalendar from '@/components/calendar/PnLCalendar';
import { useRuleSci } from '@/lib/context';
import { motion } from 'framer-motion';
import { Target, TrendingUp, ShieldCheck, AlertCircle, Zap } from 'lucide-react';

export default function CalendarPage() {
    const { dailyLogs, marketEvents } = useRuleSci();

    const monthlyStats = {
        avgDiscipline: 'B+',
        tradingDays: dailyLogs.length,
        greenDays: dailyLogs.filter(l => (l.pnl || 0) > 0).length,
        disciplineA: dailyLogs.filter(l => l.grade === 'A').length,
    };

    return (
        <div className="flex flex-col gap-10 px-6 py-8">
            <header className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center">
                        <Zap size={16} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Performance Sync</span>
                </div>
                <h1 className="text-[32px] font-black tracking-[-0.04em] text-[#1a1a2e] leading-tight">Architecture.</h1>
                <p className="text-[15px] font-bold text-gray-300 leading-relaxed">
                    Correlation between discipline grades, net P&L, and institutional volatility events.
                </p>
            </header>

            <PnLCalendar />

            {/* Quick Insights */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#22c55e]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quality</span>
                    </div>
                    <div>
                        <span className="text-3xl font-black text-[#1a1a2e]">{monthlyStats.avgDiscipline}</span>
                        <p className="text-[11px] font-bold text-gray-300 mt-1 uppercase tracking-wider">{monthlyStats.disciplineA} 'A' Days</p>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-[#2563eb]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                    </div>
                    <div>
                        <span className="text-3xl font-black text-[#1a1a2e]">{monthlyStats.tradingDays}</span>
                        <p className="text-[11px] font-bold text-gray-300 mt-1 uppercase tracking-wider">{monthlyStats.greenDays} Profitable</p>
                    </div>
                </div>
            </div>

            {/* Upcoming Crucial Events */}
            <section className="pb-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">Institutional Volatility</h3>
                    <div className="h-[1px] flex-1 bg-gray-50 ml-4" />
                </div>
                <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-gray-50">
                    {marketEvents
                        .filter(e => e.impact === 'high' || e.impact === 'critical')
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .slice(0, 3)
                        .map((event, idx, arr) => (
                        <div 
                            key={event.id} 
                            className={`p-5 flex items-center justify-between ${idx !== arr.length - 1 ? 'border-b border-gray-50' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-[15px] font-black text-[#1a1a2e]">{event.title}</p>
                                    <p className="text-[12px] font-bold text-gray-300 uppercase tracking-wider">
                                        {new Date(event.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} • {event.time}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-red-500 uppercase bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                                {event.country}
                            </span>
                        </div>
                    ))}
                    {marketEvents.filter(e => e.impact === 'high' || e.impact === 'critical').length === 0 && (
                        <div className="p-10 text-center">
                            <p className="text-sm font-bold text-gray-300 uppercase tracking-widest italic">No major events detected</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
