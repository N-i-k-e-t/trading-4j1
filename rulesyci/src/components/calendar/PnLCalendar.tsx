'use client';

import { useRuleSci } from '@/lib/context';
import { DailyLog, MarketEvent } from '@/types/trading';
import { 
    ChevronLeft, 
    ChevronRight, 
    TrendingUp, 
    TrendingDown, 
    Check, 
    X, 
    Shield, 
    Brain,
    X as CloseIcon,
    CalendarDays,
    Info,
    ArrowRight
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = [2024, 2025, 2026];

export default function PnLCalendar() {
    const { dailyLogs, marketEvents, trades } = useRuleSci();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const daysInMonth = useMemo(() => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [month, year]);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const jumpToToday = () => setCurrentDate(new Date());

    const selectYearMonth = (newYear: number, newMonth: number) => {
        setCurrentDate(new Date(newYear, newMonth, 1));
        setIsYearPickerOpen(false);
    };

    // Calculate Monthly Summary
    const stats = useMemo(() => {
        const monthTrades = trades.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === month && d.getFullYear() === year;
        });
        const uniqueDays = new Set(monthTrades.map(t => t.date)).size;
        
        const dayStats = Array.from(new Set(monthTrades.map(t => t.date))).map(d => {
            const dayTrades = monthTrades.filter(t => t.date === d);
            const pnl = dayTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
            const perfect = dayTrades.every(t => t.rules_broken.length === 0);
            return { pnl, perfect };
        });

        const aDays = dayStats.filter(s => s.pnl > 0 && s.perfect).length;
        let grade = 'N/A';
        let gradeColor = 'text-gray-400';
        let gradeBg = 'bg-gray-50';

        if (uniqueDays > 0) {
            const ratio = aDays / uniqueDays;
            if (ratio >= 0.8) { grade = 'A'; gradeColor = 'text-green-600'; gradeBg = 'bg-green-100'; }
            else if (ratio >= 0.6) { grade = 'B'; gradeColor = 'text-blue-600'; gradeBg = 'bg-blue-100'; }
            else if (ratio >= 0.4) { grade = 'C'; gradeColor = 'text-amber-600'; gradeBg = 'bg-amber-100'; }
            else { grade = 'D'; gradeColor = 'text-red-600'; gradeBg = 'bg-red-100'; }
        }

        const totalPnL = monthTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);

        return { uniqueDays, grade, gradeColor, gradeBg, totalPnL };
    }, [trades, month, year]);

    const selectedLog = dailyLogs.find(l => l.date === selectedDate);
    const selectedTrades = trades.filter(t => t.date === selectedDate);
    const selectedEvents = marketEvents.filter(e => e.date === selectedDate);

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white/70 backdrop-blur-3xl rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-white relative overflow-hidden">
                {/* Year/Month Picker Overlay */}
                <AnimatePresence>
                    {isYearPickerOpen && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[18px] font-black text-[#1a1a2e] uppercase tracking-widest">Jump to Date</h3>
                                <button onClick={() => setIsYearPickerOpen(false)} className="p-2 bg-gray-100 rounded-full">
                                    <CloseIcon size={20} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {YEARS.map(y => (
                                    <div key={y} className="mb-8">
                                        <h4 className="text-[14px] font-black text-gray-300 mb-4 ml-1">{y}</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {MONTHS.map((m, idx) => (
                                                <button 
                                                    key={m}
                                                    onClick={() => selectYearMonth(y, idx)}
                                                    className={`h-12 rounded-[16px] text-[12px] font-black uppercase tracking-wider transition-all ${
                                                        y === year && idx === month 
                                                        ? 'bg-[#1a1a2e] text-white' 
                                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {m.substring(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between mb-10 px-2">
                    <button 
                        onClick={() => setIsYearPickerOpen(true)}
                        className="flex items-center gap-3 active:scale-95 transition-all text-left"
                    >
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#1a1a2e] shadow-sm">
                            <CalendarDays size={24} />
                        </div>
                        <div>
                            <h2 className="text-[24px] font-black text-[#1a1a2e] leading-tight">{MONTHS[month]}</h2>
                            <p className="text-[14px] font-bold text-gray-300 tracking-widest uppercase">{year}</p>
                        </div>
                    </button>
                    <div className="flex gap-2">
                        <button onClick={jumpToToday} className="px-4 h-12 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 active:scale-95 transition-all">
                            Today
                        </button>
                        <button onClick={prevMonth} className="w-12 h-12 bg-gray-50 rounded-2xl text-[#1a1a2e] flex items-center justify-center active:scale-95 transition-all shadow-sm">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="w-12 h-12 bg-gray-50 rounded-2xl text-[#1a1a2e] flex items-center justify-center active:scale-95 transition-all shadow-sm">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-3 mb-6">
                    {['M','T','W','T','F','S','S'].map((d, i) => (
                        <div key={i} className="text-center">
                            <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${i >= 5 ? 'text-red-300' : 'text-[#9ca3af]'}`}>{d}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-3">
                    {/* Padding cells */}
                    {Array.from({ length: (new Date(year, month, 1).getDay() || 7) - 1 }).map((_, i) => (
                        <div key={`pad-${i}`} className="aspect-square" />
                    ))}

                    {daysInMonth.map((date) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const dayTrades = trades.filter(t => t.date === dateStr);
                        const events = marketEvents.filter(e => e.date === dateStr);
                        const isToday = dateStr === todayStr;
                        
                        let colorClass = 'bg-[#fcfcfc]';
                        let textColorClass = 'text-[#1a1a2e]/30';
                        let borderClass = 'border-transparent';
                        
                        if (dayTrades.length > 0) {
                            const totalPnL = dayTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
                            const hasBroken = dayTrades.some(t => t.rules_broken.length > 0);
                            
                            if (totalPnL > 0 && !hasBroken) {
                                colorClass = 'bg-[#10b981] shadow-xl shadow-green-100/50';
                                textColorClass = 'text-white';
                            } else if (totalPnL < 0 || hasBroken) {
                                colorClass = 'bg-[#ef4444] shadow-xl shadow-red-100/50';
                                textColorClass = 'text-white';
                            } else {
                                colorClass = 'bg-[#f59e0b] shadow-xl shadow-amber-100/50';
                                textColorClass = 'text-white';
                            }
                        }

                        if (isToday) {
                            borderClass = 'border-2 border-[#1a1a2e] ring-4 ring-[#1a1a2e]/5';
                        }

                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                        return (
                            <motion.div
                                key={dateStr}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`aspect-square rounded-[20px] relative flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${colorClass} ${borderClass} ${isWeekend && dayTrades.length === 0 ? 'opacity-20' : ''}`}
                            >
                                <span className={`text-[14px] font-black ${textColorClass}`}>
                                    {date.getDate()}
                                </span>
                                
                                {events.length > 0 && (
                                    <div className="absolute top-2 right-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${events.some(e => e.impact === 'high' || e.impact === 'critical') ? 'bg-red-400' : 'bg-yellow-400'} ring-1 ring-white`} />
                                    </div>
                                )}
                                
                                {dayTrades.length > 0 && (
                                    <div className="absolute bottom-2 flex gap-0.5">
                                        <div className={`w-3 h-0.5 rounded-full ${textColorClass === 'text-white' ? 'bg-white/40' : 'bg-[#1a1a2e]/10'}`} />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Monthly Sync Status */}
                <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Architecture</span>
                        <div className="flex items-center gap-3 mt-1">
                            <div className={`px-4 py-2 rounded-2xl ${stats.gradeBg} ${stats.gradeColor} text-[18px] font-black`}>
                                {stats.grade}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[16px] font-black text-[#1a1a2e]">{stats.uniqueDays} Days Active</span>
                                <span className="text-[11px] font-bold text-gray-300">Compliance Factor</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Revenue</span>
                        <div className="flex items-center gap-3 mt-1">
                            <div className={`text-[24px] font-black tabular-nums ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stats.totalPnL >= 0 ? '+' : ''}₹{Math.abs(stats.totalPnL).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DETAIL SHEET */}
            <AnimatePresence>
                {selectedDate && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedDate(null)}
                            className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[201] max-h-[90vh] overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+32px)] shadow-[0_-20px_60px_rgba(0,0,0,0.15)]"
                        >
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-6" />
                            <div className="px-8 flex flex-col gap-10">
                                <header className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-[28px] font-black text-[#1a1a2e] leading-tight mb-1">
                                            {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}.
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="px-3 py-1 bg-[#1a1a2e] text-white rounded-full text-[10px] font-black uppercase tracking-widest">{year}</div>
                                            <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                                                {selectedLog?.grade ? `Grade ${selectedLog.grade}` : 'Zero Day'}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedDate(null)} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 active:scale-90 transition-all">
                                        <CloseIcon size={24} />
                                    </button>
                                </header>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#fafafa] p-6 rounded-[32px] border border-gray-100">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Performance</span>
                                        <div className={`text-[24px] font-black tabular-nums flex items-center gap-2 ${selectedLog?.pnl && selectedLog.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            ₹{Math.abs(selectedLog?.pnl || 0).toLocaleString()}
                                            {selectedLog?.pnl && selectedLog.pnl > 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                                        </div>
                                    </div>
                                    <div className="bg-[#fafafa] p-6 rounded-[32px] border border-gray-100">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Tactical</span>
                                        <div className="text-[24px] font-black text-[#1a1a2e] tabular-nums">{selectedTrades.length} Trades</div>
                                    </div>
                                </div>

                                {selectedTrades.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trade Architecture</div>
                                            <div className="h-[1px] flex-1 bg-gray-50" />
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            {selectedTrades.map((trade, i) => (
                                                <div key={i} className="bg-white border-2 border-gray-50 p-5 rounded-[24px] flex items-center justify-between shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center font-black text-[16px] ${trade.type === 'Long' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                            {trade.pair.substring(0, 1).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-[16px] font-black text-[#1a1a2e]">{trade.pair} — {trade.type}</p>
                                                            <p className="text-[12px] font-bold text-gray-300 uppercase tracking-widest">{trade.setupId || 'Neural Edge'}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`text-[17px] font-black tabular-nums ${(trade.pnl || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {(trade.pnl || 0) > 0 ? '+' : ''}₹{(trade.pnl || 0).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">Neural Sync</div>
                                        <div className="h-[1px] flex-1 bg-gray-50" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-blue-50/20 p-6 rounded-[32px] border border-blue-50 flex items-center gap-5">
                                            <div className="w-12 h-12 bg-blue-500 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-blue-200/50">
                                                <Shield size={22} />
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-black text-blue-900 leading-tight">System Compliance</p>
                                                <p className="text-[13px] font-bold text-blue-400 uppercase tracking-widest mt-1">
                                                    {selectedLog?.rulesChecked?.length || 0} followed · {selectedLog?.rulesBroken || 0} Broken
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-purple-50/20 p-6 rounded-[32px] border border-purple-50 flex items-center gap-5">
                                            <div className="w-12 h-12 bg-purple-500 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-purple-200/50">
                                                <Brain size={22} />
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-black text-purple-900 leading-tight">Emotional Architecture</p>
                                                <p className="text-[13px] font-bold text-purple-400 uppercase tracking-widest mt-1">
                                                    Baseline: {selectedLog?.mood || 'Equanimity'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                
                                {selectedEvents.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Context</div>
                                            <div className="h-[1px] flex-1 bg-gray-50" />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {selectedEvents.map(e => (
                                                <div key={e.id} className="flex items-center justify-between p-4 bg-red-50/20 border border-red-50 rounded-2xl">
                                                    <div className="flex items-center gap-3">
                                                        <Info size={16} className="text-red-400" />
                                                        <span className="text-[14px] font-bold text-red-900">{e.title}</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">{e.impact} impact</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
