'use client';

import PnLCalendar from '@/components/calendar/PnLCalendar';
import { useRuleSci } from '@/lib/context';
import { motion } from 'framer-motion';
import { Target, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';

export default function CalendarPage() {
    const { dailyLogs, marketEvents } = useRuleSci();

    const monthlyStats = {
        avgDiscipline: 'B+',
        tradingDays: dailyLogs.length,
        greenDays: dailyLogs.filter(l => (l.pnl || 0) > 0).length,
        disciplineA: dailyLogs.filter(l => l.grade === 'A').length,
    };

    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <header>
                <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">Performance Calendar</h1>
                <p className="text-base text-[#6b7280]">Correlation between discipline, P&L, and market events.</p>
            </header>

            <PnLCalendar />

            {/* Quick Insights */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck size={16} className="text-[#22c55e]" />
                        <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Discipline Grade</span>
                    </div>
                    <span className="text-2xl font-black text-[#1a1a2e]">{monthlyStats.avgDiscipline}</span>
                    <p className="text-[11px] text-[#6b7280] mt-1">Based on {monthlyStats.disciplineA} 'A' grade days</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={16} className="text-[#2563eb]" />
                        <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Trading Days</span>
                    </div>
                    <span className="text-2xl font-black text-[#1a1a2e]">{monthlyStats.tradingDays}</span>
                    <p className="text-[11px] text-[#6b7280] mt-1">{monthlyStats.greenDays} Profitable sessions</p>
                </div>
            </div>

            {/* Upcoming Crucial Events */}
            <section>
                <h3 className="text-sm font-bold text-[#6b7280] uppercase tracking-wider mb-4 px-1">Upcoming High Impact</h3>
                <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    {marketEvents
                        .filter(e => e.impact === 'high' || e.impact === 'critical')
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .slice(0, 3)
                        .map((event, idx, arr) => (
                        <div 
                            key={event.id} 
                            className={`p-4 flex items-center justify-between ${idx !== arr.length - 1 ? 'border-bottom border-[#1a1a2e]/5' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#ef4444]/10 text-[#ef4444] rounded-xl flex items-center justify-center">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-[#1a1a2e]">{event.title}</p>
                                    <p className="text-[11px] font-medium text-[#9ca3af]">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-[#ef4444] uppercase bg-[#ef4444]/10 px-2 py-1 rounded-lg">
                                {event.country}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
