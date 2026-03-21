'use client';

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, isToday, setYear, setMonth, setDate } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Flame, Award, Check, Calendar as CalendarIcon, Filter, Search, X } from 'lucide-react';
import { useRuleSci } from '@/lib/context';
import CalendarDetailSheet from './CalendarDetailSheet';

export default function PnLCalendar() {
    const { dailyLogs, marketEvents } = useRuleSci();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
    const [isAdvancedPickerOpen, setIsAdvancedPickerOpen] = useState(false);

    // Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const days = useMemo(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const dateInterval = eachDayOfInterval({ start, end });
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

    // REAL-TIME PROCESS: STREAK & EFFICIENCY
    const { activeStreak, maxStreak, monthlyEfficiency } = useMemo(() => {
        const today = new Date();
        const sortedLogs = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
        
        let currentS = 0;
        const checkDate = new Date();
        for (let i = 0; i < 60; i++) {
            const dStr = format(checkDate, 'yyyy-MM-dd');
            const log = sortedLogs.find(l => l.date === dStr);
            if (log && log.complianceScore === 100) {
                currentS++;
            } else if (dStr !== format(today, 'yyyy-MM-dd')) {
                break;
            }
            checkDate.setDate(checkDate.getDate() - 1);
        }

        let maxS = 0;
        let tempS = 0;
        [...dailyLogs].sort((a,b) => a.date.localeCompare(b.date)).forEach(log => {
            if (log.complianceScore === 100) {
                tempS++;
                maxS = Math.max(maxS, tempS);
            } else {
                tempS = 0;
            }
        });

        const monthStr = format(currentDate, 'yyyy-MM');
        const monthLogs = dailyLogs.filter(l => l.date.startsWith(monthStr));
        const perfectDays = monthLogs.filter(l => l.complianceScore === 100).length;
        const efficiency = monthLogs.length > 0 ? Math.round((perfectDays / monthLogs.length) * 100) : 0;

        return { 
            activeStreak: currentS, 
            maxStreak: Math.max(maxS, currentS), 
            monthlyEfficiency: efficiency 
        };
    }, [dailyLogs, currentDate]);

    return (
        <div className="flex flex-col gap-6">
            <header className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                    <button onClick={() => setIsAdvancedPickerOpen(true)} className="flex flex-col items-start group">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Live Epoch</span>
                        </div>
                        <h2 className="text-[32px] font-black tracking-[-0.05em] text-[#1a1a2e] leading-none flex items-center gap-2">
                            {format(currentDate, 'MMMM')} <span className="text-gray-200 group-hover:text-blue-500 transition-colors">{format(currentDate, 'yyyy')}</span>
                            <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                <Search size={12} strokeWidth={3} />
                            </div>
                        </h2>
                    </button>
                </div>
                
                <div className="flex items-center gap-2">
                    <button onClick={goToToday} className="h-10 px-4 bg-gray-50 border border-gray-100 rounded-full text-[12px] font-black text-[#1a1a2e] active:scale-95 transition-all shadow-sm flex items-center gap-2">
                        <Zap size={14} className="text-blue-500" /> Today
                    </button>
                    <div className="flex bg-gray-50 border border-gray-100 rounded-full p-1 shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-white rounded-full transition-colors active:scale-90 text-gray-400 hover:text-[#1a1a2e]"><ChevronLeft size={18} /></button>
                        <button onClick={nextMonth} className="p-2 hover:bg-white rounded-full transition-colors active:scale-90 text-gray-400 hover:text-[#1a1a2e]"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-[40px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50/50 relative overflow-hidden min-h-[420px]">
                <AnimatePresence>
                    {isAdvancedPickerOpen && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.95 }} 
                            className="absolute inset-0 bg-white/95 backdrop-blur-3xl z-40 p-8 flex flex-col gap-8 shadow-2xl"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Jump to Session</span>
                                    <h3 className="text-2xl font-black text-[#1a1a2e]">Select Date</h3>
                                </div>
                                <button onClick={() => setIsAdvancedPickerOpen(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-black active:scale-90 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {/* Year Selection */}
                                <div className="flex flex-col gap-3">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">Epoch</span>
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {[2024, 2025, 2026, 2027].map(y => (
                                            <button 
                                                key={y} 
                                                onClick={() => setCurrentDate(setYear(currentDate, y))}
                                                className={`px-6 py-3 rounded-2xl text-sm font-black transition-all flex-none ${currentDate.getFullYear() === y ? 'bg-[#1a1a2e] text-white shadow-xl' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
                                            >
                                                {y}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Month Selection */}
                                <div className="flex flex-col gap-3">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">Month</span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setCurrentDate(setMonth(currentDate, i))}
                                                className={`py-3 rounded-[20px] text-[10px] font-bold uppercase tracking-widest transition-all ${currentDate.getMonth() === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}
                                            >
                                                {format(new Date(2025, i, 1), 'MMM')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setIsAdvancedPickerOpen(false)}
                                    className="h-[64px] w-full bg-[#1a1a2e] text-white rounded-[28px] font-black text-[16px] shadow-2xl active:scale-95 transition-all mt-4"
                                >
                                    Confirm Session
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-7 gap-1 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-[10px] font-black text-gray-200 uppercase tracking-widest py-2">{day}</div>
                    ))}
                </div>

                <motion.div 
                    layout
                    className="grid grid-cols-7 gap-y-4 gap-x-2"
                >
                    {days.map((date, i) => {
                        if (!date) return <div key={`pad-${i}`} className="aspect-square" />;
                        const { log, events } = getDayData(date);
                        const isTodayDate = isToday(date);
                        const adherencePct = log?.complianceScore || 0;
                        const isPerfect = adherencePct === 100 && log;

                        return (
                            <motion.button 
                                key={date.toISOString()} 
                                layoutId={`date-${date.toISOString()}`}
                                whileTap={{ scale: 0.85 }} 
                                onClick={() => setSelectedDate(date)} 
                                className="relative aspect-square flex items-center justify-center transition-all group"
                            >
                                {log && !isPerfect && (
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 p-1">
                                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-50" />
                                        <motion.circle initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 100 - adherencePct }} cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray="100 100" className={adherencePct > 70 ? "text-blue-500" : "text-orange-400"} strokeLinecap="round" />
                                    </svg>
                                )}
                                <div className={`w-[85%] h-[85%] rounded-full flex flex-col items-center justify-center z-10 transition-all duration-300 relative overflow-hidden shadow-sm ${isPerfect ? 'bg-[#22c55e] shadow-[0_4px_15px_rgba(34,197,94,0.4)] scale-110' : log ? 'bg-white border border-gray-100' : 'bg-transparent'} ${isTodayDate && !isPerfect ? 'border-2 border-blue-500 shadow-lg' : ''}`}>
                                    <span className={`text-[13px] font-black ${isPerfect ? 'text-white' : isTodayDate ? 'text-blue-500' : 'text-[#1a1a2e]'}`}>{format(date, 'd')}</span>
                                    {log?.pnl !== undefined && log.pnl !== 0 && !isPerfect && (
                                        <div className={`w-1 h-1 rounded-full mt-0.5 ${log.pnl > 0 ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                                    )}
                                </div>
                                {events.some(e => e.impact === 'high' || e.impact === 'critical') && (
                                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse z-20 shadow-sm" />
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>

            <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Protocol Efficiency</span>
                        <p className="text-[13px] font-black text-[#1a1a2e]">Monthly Benchmark</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black text-blue-600 tracking-tighter">{monthlyEfficiency}%</span>
                    </div>
                </div>
                <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${monthlyEfficiency}%` }} className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                </div>
                <p className="text-[12px] font-bold text-gray-400 leading-relaxed">You've maintained a perfect architecture for <span className="text-[#1a1a2e] font-black">{monthlyEfficiency}%</span> of your trading days this month.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <motion.div whileTap={{ scale: 0.98 }} className="bg-[#1a1a2e] rounded-[32px] p-6 border border-white/5 shadow-2xl flex flex-col">
                    <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                        <Flame size={20} className="text-orange-500 fill-orange-500" />
                    </div>
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Active Streak</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white leading-none">{activeStreak}</span>
                        <span className="text-[10px] font-black text-white/40">DAYS</span>
                    </div>
                </motion.div>
                
                <motion.div whileTap={{ scale: 0.98 }} className="bg-blue-600 rounded-[32px] p-6 border border-white/10 shadow-2xl shadow-blue-500/20 flex flex-col">
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                        <Award size={20} className="text-blue-100" />
                    </div>
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Architecture Max</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white leading-none">{maxStreak}</span>
                        <span className="text-[10px] font-black text-white/40">DAYS</span>
                    </div>
                </motion.div>
            </div>

            <CalendarDetailSheet 
                isOpen={!!selectedDate} 
                onClose={() => setSelectedDate(null)} 
                date={selectedDate}
                data={selectedDate ? getDayData(selectedDate) : null}
            />
        </div>
    );
}

