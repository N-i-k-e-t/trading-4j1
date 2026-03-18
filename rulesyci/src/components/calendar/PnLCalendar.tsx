'use client';

import { useRuleSci } from '@/lib/context';
import { DailyLog, MarketEvent } from '@/types/trading';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { useState, useMemo } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const gradeColors = {
    'A': 'bg-[#22c55e]',
    'B': 'bg-[#4ade80]',
    'C': 'bg-[#f59e0b]',
    'D': 'bg-[#ef4444]',
    'F': 'bg-[#991b1b]',
    'None': 'bg-[#1a1a2e]/5',
};

export default function PnLCalendar() {
    const { dailyLogs, marketEvents } = useRuleSci();
    const [currentDate, setCurrentDate] = useState(new Date());

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const daysInMonth = useMemo(() => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            // Only include Mon-Fri
            const dayOfWeek = date.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                days.push(new Date(date));
            }
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [month, year]);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#1a1a2e]/5">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-[#1a1a2e]">{MONTHS[month]} {year}</h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 bg-[#1a1a2e]/5 rounded-xl text-[#1a1a2e] hover:bg-[#1a1a2e]/10 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-2 bg-[#1a1a2e]/5 rounded-xl text-[#1a1a2e] hover:bg-[#1a1a2e]/10 transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-4 text-center">
                {DAYS.map(d => (
                    <span key={d} className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">{d}</span>
                ))}
            </div>

            <div className="grid grid-cols-5 gap-3">
                {/* Pad start of month */}
                {Array.from({ length: (new Date(year, month, 1).getDay() || 7) - 1 }).map((_, i) => {
                    const d = (new Date(year, month, 1).getDay() || 7) - 1;
                    if (i < d && (i + 1) < 6) return <div key={`pad-${i}`} className="aspect-square" />;
                    return null;
                })}

                {daysInMonth.map((date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const log = dailyLogs.find(l => l.date === dateStr);
                    const events = marketEvents.filter(e => e.date === dateStr);
                    const grade = log?.grade || 'None';

                    return (
                        <motion.div
                            key={dateStr}
                            whileTap={{ scale: 0.95 }}
                            className={`aspect-square rounded-2xl ${gradeColors[grade]} relative flex flex-col items-center justify-center cursor-pointer group shadow-sm`}
                        >
                            <span className={`text-[13px] font-bold ${grade === 'None' ? 'text-[#1a1a2e]/40' : 'text-white'}`}>
                                {date.getDate()}
                            </span>
                            
                            {/* Indicators */}
                            <div className="absolute bottom-1.5 flex gap-0.5">
                                {events.map(e => (
                                    <div 
                                        key={e.id} 
                                        className={`w-1 h-1 rounded-full ${e.impact === 'high' || e.impact === 'critical' ? 'bg-[#ef4444]' : 'bg-[#f59e0b]'}`} 
                                    />
                                ))}
                                {log && log.rulesBroken > 0 && (
                                    <div className="w-1 h-1 rounded-full bg-white/50" />
                                ) }
                            </div>

                            {/* Hover Tooltip logic would go here or handled by a DetailSheet */}
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[#1a1a2e]/5 pt-6">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                        <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">High Impact News</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                        <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Medium Impact</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
