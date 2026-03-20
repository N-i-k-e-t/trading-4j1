'use client';

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Target, ShieldCheck, AlertCircle, TrendingUp, Calendar as CalendarIcon, Zap, Flame, Award } from 'lucide-react';
import { useRuleSci } from '@/lib/context';
import { DailyLog } from '@/types/trading';
import CalendarDetailSheet from './CalendarDetailSheet';

export default function PnLCalendar() {
    const { dailyLogs, marketEvents } = useRuleSci();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

    // Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const days = useMemo(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const dateInterval = eachDayOfInterval({ start, end });
        
        // Pad beginning of month
        const firstDayOfMonth = getDay(start);
        const padding = Array.from({ length: firstDayOfMonth }).map((_, i) => null);
        
        return [...padding, ...dateInterval];
    }, [currentDate]);

    const getDayData = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const log = dailyLogs.find(l => l.date === dateStr);
        const events = marketEvents.filter(e => e.date === dateStr);
        return { log, events };
    };

    // Streak Logic (Derived)
    const activeStreak = 4; // Mock for UI
    const maxStreak = 12;

    return (
        <div className="flex flex-col gap-6">
            {/* Nav Header */}
            <header className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                    <button 
                        onClick={() => setIsYearPickerOpen(!isYearPickerOpen)}
                        className="flex items-center gap-2 group"
                    >
                        <h2 className="text-2xl font-black tracking-tight text-[#1a1a2e]">
                            {format(currentDate, 'MMMM')} <span className="text-gray-300 group-hover:text-blue-500 transition-colors">{format(currentDate, 'yyyy')}</span>
                        </h2>
                    </button>
                    <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest mt-0.5">Performance Grid</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={goToToday}
                        className="h-10 px-4 bg-gray-50 border border-gray-100 rounded-full text-[12px] font-black text-[#1a1a2e] active:scale-95 transition-all shadow-sm flex items-center gap-2"
                    >
                        <Zap size={14} className="text-blue-500" />
                        Today
                    </button>
                    <div className="flex bg-gray-50 border border-gray-100 rounded-full p-1 shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-white rounded-full transition-colors active:scale-90 text-gray-400 hover:text-[#1a1a2e]"><ChevronLeft size={18} /></button>
                        <button onClick={nextMonth} className="p-2 hover:bg-white rounded-full transition-colors active:scale-90 text-gray-400 hover:text-[#1a1a2e]"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </header>

            {/* Calendar Structure */}
            <div className="bg-white rounded-[40px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50/50 relative overflow-hidden min-h-[420px]">
                {/* Year Picker Overlay */}
                <AnimatePresence>
                    {isYearPickerOpen && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute inset-x-6 top-6 bottom-6 bg-white/95 backdrop-blur-xl z-20 rounded-[32px] p-6 flex flex-col gap-6 shadow-2xl border border-gray-100"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black uppercase tracking-widest text-[#1a1a2e]">Select Epoch</span>
                                <button onClick={() => setIsYearPickerOpen(false)} className="text-gray-400 font-bold p-2">Close</button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[2024, 2025, 2026].map(y => (
                                    <button 
                                        key={y}
                                        onClick={() => {
                                            setCurrentDate(new Date(y, currentDate.getMonth(), 1));
                                            setIsYearPickerOpen(false);
                                        }}
                                        className={`h-16 rounded-2xl flex items-center justify-center text-lg font-black transition-all ${currentDate.getFullYear() === y ? 'bg-[#1a1a2e] text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-4 gap-2 flex-1">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => {
                                            setCurrentDate(new Date(currentDate.getFullYear(), i, 1));
                                            setIsYearPickerOpen(false);
                                        }}
                                        className={`rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-tighter transition-all ${currentDate.getMonth() === i ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-50 text-gray-300'}`}
                                    >
                                        {format(new Date(2025, i, 1), 'MMM')}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Day Labels */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-[10px] font-black text-gray-200 uppercase tracking-widest py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                    {days.map((date, i) => {
                        if (!date) return <div key={`pad-${i}`} className="aspect-square" />;
                        
                        const { log, events } = getDayData(date);
                        const isTodayDate = isToday(date);
                        
                        // Rule Adherence Progress (Cal AI Ring logic)
                        const rulesTotal = 9; 
                        const rulesFollowed = log?.grade === 'A' ? 9 : log?.grade === 'B' ? 7 : log?.grade === 'C' ? 5 : 0;
                        const adherencePct = (rulesFollowed / rulesTotal) * 100;
                        const isPerfect = rulesFollowed === rulesTotal && log;

                        return (
                            <motion.button
                                key={date.toISOString()}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => setSelectedDate(date)}
                                className="relative aspect-square flex items-center justify-center transition-all group"
                            >
                                {/* THE RING (Cal AI Style) */}
                                {log && !isPerfect && (
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 p-1">
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="42%"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="transparent"
                                            className="text-gray-50"
                                        />
                                        <motion.circle
                                            initial={{ strokeDashoffset: 100 }}
                                            animate={{ strokeDashoffset: 100 - adherencePct }}
                                            cx="50%"
                                            cy="50%"
                                            r="42%"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="transparent"
                                            strokeDasharray="100 100"
                                            className="text-blue-500"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                )}

                                {/* THE CELL (Perfect Day Style) */}
                                <div className={`
                                    w-[85%] h-[85%] rounded-full flex flex-col items-center justify-center z-10 
                                    transition-all duration-300 relative overflow-hidden shadow-sm
                                    ${isPerfect ? 'bg-[#22c55e] shadow-[0_4px_15px_rgba(34,197,94,0.4)] scale-110' : 
                                      log ? 'bg-white border border-gray-100' : 'bg-transparent'}
                                    ${isTodayDate && !isPerfect ? 'border-2 border-blue-500' : ''}
                                `}>
                                    <span className={`text-[13px] font-black ${isPerfect ? 'text-white' : isTodayDate ? 'text-blue-500' : 'text-[#1a1a2e]'}`}>
                                        {format(date, 'd')}
                                    </span>

                                    {/* P&L Glow/Indicator */}
                                    {log?.pnl !== undefined && log.pnl !== 0 && !isPerfect && (
                                        <div className={`w-1 h-1 rounded-full mt-0.5 ${log.pnl > 0 ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                                    )}
                                </div>

                                {/* Event Pulse */}
                                {events.some(e => e.impact === 'high' || e.impact === 'critical') && (
                                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse z-20" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Streak Architecture (Perfect Day Inspired Footer) */}
            <div className="grid grid-cols-2 gap-4">
                <motion.div 
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#1a1a2e] rounded-[32px] p-5 flex items-center justify-between border border-white/5 shadow-xl"
                >
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Active Sequence</span>
                        <div className="flex items-center gap-2">
                            <Flame size={16} className="text-orange-500 fill-orange-500" />
                            <span className="text-xl font-black text-white">{activeStreak} <span className="text-[10px] text-white/40">DAYS</span></span>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 rounded-[32px] p-5 flex items-center justify-between border border-white/10 shadow-xl shadow-blue-500/10"
                >
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Max Architecture</span>
                        <div className="flex items-center gap-2">
                            <Award size={16} className="text-blue-200" />
                            <span className="text-xl font-black text-white">{maxStreak} <span className="text-[10px] text-white/40">DAYS</span></span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Sheet Detail */}
            <CalendarDetailSheet 
                isOpen={!!selectedDate} 
                onClose={() => setSelectedDate(null)} 
                date={selectedDate}
                data={selectedDate ? getDayData(selectedDate) : null}
            />
        </div>
    );
}
