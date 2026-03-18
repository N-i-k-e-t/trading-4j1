'use client';

import { useRuleSci } from '@/lib/context';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Target, Activity, Flame } from 'lucide-react';
import { useState, useMemo } from 'react';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeekStrip() {
    const { trades, marketEvents, dailyLogs } = useRuleSci();
    const [currentDate, setCurrentDate] = useState(new Date());

    const weekDays = useMemo(() => {
        const d = new Date(currentDate);
        const day = d.getDay();
        const start = new Date(d.setDate(d.getDate() - day));
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            return date;
        });
    }, [currentDate]);

    const todayStr = new Date().toISOString().split('T')[0];

    const prevWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    };

    const nextWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    };

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#1a1a2e]/5 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#2563eb]/10 text-[#2563eb] rounded-xl">
                        <Calendar size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wider">Weekly Performance</h3>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevWeek} className="p-1.5 hover:bg-[#1a1a2e]/5 rounded-lg transition-all text-[#9ca3af]">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextWeek} className="p-1.5 hover:bg-[#1a1a2e]/5 rounded-lg transition-all text-[#9ca3af]">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="flex justify-between gap-2">
                {weekDays.map((date, i) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isToday = dateStr === todayStr;
                    const log = dailyLogs.find(l => l.date === dateStr);
                    const events = marketEvents.filter(e => e.date === dateStr);
                    const isHighImpact = events.some(e => e.impact === 'high' || e.impact === 'critical');
                    
                    const pnl = trades.filter(t => t.date === dateStr).reduce((sum, t) => sum + (t.pnl || 0), 0);
                    
                    return (
                        <motion.div
                            key={dateStr}
                            whileTap={{ scale: 0.95 }}
                            className={`flex flex-col items-center gap-3 flex-1 py-4 rounded-2xl transition-all relative ${
                                isToday ? 'bg-[#1a1a2e] text-white shadow-lg' : 'bg-[#1a1a2e]/[0.02] hover:bg-[#1a1a2e]/[0.05]'
                            }`}
                        >
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? 'text-white/50' : 'text-[#9ca3af]'}`}>
                                {DAYS_SHORT[i]}
                            </span>
                            <span className="text-[15px] font-black">
                                {date.getDate()}
                            </span>
                            
                            <div className="flex flex-col items-center gap-1 min-h-[12px]">
                                {events.length > 0 && (
                                    <div className={`w-1.5 h-1.5 rounded-full ${isHighImpact ? 'bg-[#ef4444]' : 'bg-[#f59e0b]'}`} />
                                )}
                                {pnl !== 0 && (
                                    <span className={`text-[8px] font-bold ${pnl > 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                        {pnl > 0 ? '+' : ''}{pnl > 1000 ? (pnl/1000).toFixed(1) + 'k' : pnl}
                                    </span>
                                )}
                            </div>

                            {/* Today highlights */}
                            {isToday && (
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#2563eb] rounded-full border-2 border-white" />
                            )}
                        </motion.div>
                    );
                })}
            </div>
            
            {/* Event pill if today has one */}
            {marketEvents.filter(e => e.date === todayStr).length > 0 && (
                <div className="mt-5 pt-5 border-t border-[#1a1a2e]/5">
                    {marketEvents.filter(e => e.date === todayStr).map(e => (
                        <div key={e.id} className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    e.impact === 'high' || e.impact === 'critical' ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'
                                }`}>
                                    {e.type}
                                </span>
                                <span className="text-[12px] font-semibold text-[#1a1a2e]">{e.title}</span>
                            </div>
                            <span className="text-[11px] font-bold text-[#9ca3af]">{e.time}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
