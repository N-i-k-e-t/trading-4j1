'use client';

import { useRuleSci } from '@/lib/context';
import { DailyLog, MarketEvent } from '@/types/trading';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertCircle, Info, X as CloseIcon, TrendingUp, TrendingDown, Check, X, Shield, Brain } from 'lucide-react';
import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';

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
    const { dailyLogs, marketEvents, trades, rules } = useRuleSci();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const daysInMonth = useMemo(() => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            // Include weekendGrey out as per user request (even if greyed)
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [month, year]);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const selectedLog = dailyLogs.find(l => l.date === selectedDate);
    const selectedTrades = trades.filter(t => t.date === selectedDate);
    const selectedEvents = marketEvents.filter(e => e.date === selectedDate);

    return (
        <>
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#1a1a2e]/5">
                <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-xl font-bold text-[#1a1a2e]">{MONTHS[month]} {year}</h2>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 bg-[#1a1a2e]/5 rounded-xl text-[#1a1a2e]">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="p-2 bg-[#1a1a2e]/5 rounded-xl text-[#1a1a2e]">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4 text-center">
                    {['M','T','W','T','F','S','S'].map((d, i) => (
                        <span key={i} className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">{d}</span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {/* Pad start of month */}
                    {Array.from({ length: (new Date(year, month, 1).getDay() || 7) - 1 }).map((_, i) => (
                        <div key={`pad-${i}`} className="aspect-square" />
                    ))}

                    {daysInMonth.map((date) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const todayStr = new Date().toISOString().split('T')[0];
                        const isToday = dateStr === todayStr;
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        const log = dailyLogs.find(l => l.date === dateStr);
                        const events = marketEvents.filter(e => e.date === dateStr);
                        const grade = log?.grade || 'None';

                        return (
                            <motion.div
                                key={dateStr}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`aspect-square rounded-xl relative flex flex-col items-center justify-center cursor-pointer transition-all ${
                                    isWeekend && grade === 'None' ? 'bg-gray-50 opacity-40' : gradeColors[grade]
                                } ${isToday ? 'ring-2 ring-[#1a1a2e] ring-offset-2' : ''}`}
                            >
                                <span className={`text-[12px] font-black ${grade === 'None' ? 'text-[#1a1a2e]/40' : 'text-white'} ${isToday && grade === 'None' ? 'text-[#1a1a2e]' : ''}`}>
                                    {date.getDate()}
                                </span>
                                
                                <div className="absolute bottom-1 flex gap-0.5">
                                    {events.map(e => (
                                        <div key={e.id} className={`w-1 h-1 rounded-full ${e.impact === 'high' || e.impact === 'critical' ? 'bg-[#ef4444]' : 'bg-[#f59e0b]'}`} />
                                    ))}
                                    {log && log.rulesBroken > 0 && <div className="w-1 h-1 rounded-full bg-white/50" />}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-[#1a1a2e]/5 pt-6">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                            <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">High News</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                            <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Mid News</span>
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
                            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[101] max-h-[85vh] overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-[0_-8px_40px_rgba(0,0,0,0.1)]"
                        >
                            {/* Grabber */}
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-4" />
                            
                            <div className="px-6 py-2">
                                <header className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-[20px] font-black text-[#1a1a2e] leading-tight">
                                            {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </h3>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{selectedLog?.grade ? `Discipline Grade ${selectedLog.grade}` : 'No Session Logged'}</p>
                                    </div>
                                    <button onClick={() => setSelectedDate(null)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                        <CloseIcon size={20} />
                                    </button>
                                </header>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50 p-5 rounded-[24px]">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Net P&L</p>
                                        <div className={`text-xl font-black tabular-nums flex items-center gap-1.5 ${selectedLog?.pnl && selectedLog.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedLog?.pnl && selectedLog.pnl > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                            ₹{Math.abs(selectedLog?.pnl || 0).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-5 rounded-[24px]">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trades</p>
                                        <div className="text-xl font-black text-[#1a1a2e] tabular-nums">{selectedTrades.length}</div>
                                    </div>
                                </div>

                                <section className="mb-8">
                                    <h4 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-4">Daily Performance</h4>
                                    <div className="flex flex-col gap-3">
                                        {selectedTrades.map((trade, i) => (
                                            <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${trade.type === 'Long' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                        {trade.pair.substring(0, 1)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-bold text-[#1a1a2e]">{trade.pair} — {trade.type}</p>
                                                        <p className="text-[12px] font-bold text-gray-400 tracking-wide">{trade.setupId || 'Price Action'}</p>
                                                    </div>
                                                </div>
                                                <div className={`text-[15px] font-black tabular-nums ${(trade.pnl || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {(trade.pnl || 0) > 0 ? '+' : ''}₹{(trade.pnl || 0).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                        {selectedTrades.length === 0 && (
                                            <div className="py-4 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                                <p className="text-sm font-bold text-gray-300">No trades recorded</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section className="mb-4">
                                    <h4 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-4">Discipline & Context</h4>
                                    <div className="flex flex-col gap-3">
                                        <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center gap-4">
                                            <Shield className="text-blue-600" size={20} />
                                            <div>
                                                <p className="text-[14px] font-bold text-blue-900">Rule Compliance</p>
                                                <p className="text-[12px] font-bold text-blue-600/70">{selectedLog?.rulesChecked?.length || 0} followed · {selectedLog?.rulesBroken || 0} broken</p>
                                            </div>
                                        </div>
                                        <div className="bg-purple-50/50 p-4 rounded-2xl flex items-center gap-4">
                                            <Brain className="text-purple-600" size={20} />
                                            <div>
                                                <p className="text-[14px] font-bold text-purple-900">Emotional Baseline</p>
                                                <p className="text-[12px] font-bold text-purple-600/70 capitalize">{selectedLog?.mood || 'Neutral'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
