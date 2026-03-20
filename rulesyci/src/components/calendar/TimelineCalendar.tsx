'use client';

import { useState, useMemo } from 'react';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Flame, Award, Check, Clock, Shield } from 'lucide-react';
import { useRuleSci } from '@/lib/context';

export default function TimelineCalendar() {
    const { dailyLogs, marketEvents, rules } = useRuleSci();
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Generate days for the horizontal week view
    const weekDays = useMemo(() => {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [selectedDate]);

    const getDayData = (date: Date) => {
        const dStr = format(date, 'yyyy-MM-dd');
        const log = dailyLogs.find(l => l.date === dStr);
        const events = marketEvents.filter(e => e.date === dStr);
        return { log, events };
    };

    const activeDateData = getDayData(selectedDate);
    const checkedRules = rules.filter(r => activeDateData.log?.rulesChecked.includes(r.id));
    const unCheckedRules = rules.filter(r => !activeDateData.log?.rulesChecked.includes(r.id) && r.isActive);

    const gradients = [
        'from-pink-100/60 to-transparent',
        'from-green-100/60 to-transparent',
        'from-blue-100/60 to-transparent',
        'from-orange-100/60 to-transparent'
    ];

    return (
        <div className="flex flex-col gap-10">
            {/* HORIZONTAL DATE PICKER - PERFECT DAY STYLE */}
            <header className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1a1a2e] text-white rounded-2xl flex items-center justify-center shadow-lg">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#1a1a2e] leading-none mb-1">Timeline</h2>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Protocol Sessions</p>
                        </div>
                    </div>
                    <div className="flex bg-gray-50 p-1 rounded-full border border-gray-100 shadow-sm">
                        <button onClick={() => setSelectedDate(addDays(selectedDate, -7))} className="p-2 hover:bg-white rounded-full transition-all text-gray-400 hover:text-[#1a1a2e]"><ChevronLeft size={18} /></button>
                        <button onClick={() => setSelectedDate(addDays(selectedDate, 7))} className="p-2 hover:bg-white rounded-full transition-all text-gray-400 hover:text-[#1a1a2e]"><ChevronRight size={18} /></button>
                    </div>
                </div>

                <div className="flex justify-between px-2">
                    {weekDays.map((date) => {
                        const isSelected = isSameDay(date, selectedDate);
                        const hasLog = getDayData(date).log;
                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className="flex flex-col items-center gap-3 active:scale-90 transition-all"
                            >
                                <span className={`text-[11px] font-bold uppercase tracking-widest ${isSelected ? 'text-[#1a1a2e]' : 'text-gray-300'}`}>
                                    {format(date, 'eee')}
                                </span>
                                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-[#1a1a2e] text-white shadow-2xl scale-110' : 'text-gray-400 bg-white border border-transparent shadow-sm'}`}>
                                    <span className="text-[15px] font-black">{format(date, 'd')}</span>
                                    {hasLog && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-blue-400' : 'bg-blue-500'}`} />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* TIMELINE LIST - PERFECT DAY STYLE */}
            <div className="flex flex-col gap-10">
                <div className="flex items-center gap-4 px-2">
                    <h3 className="text-[12px] font-black text-gray-300 uppercase tracking-[0.2em] flex-none">Sessions Log</h3>
                    <div className="h-[1px] flex-1 bg-gray-100" />
                </div>

                <div className="flex flex-col gap-0">
                    {/* Placeholder for 'Mock' Timelines in the screenshot style */}
                    {activeDateData.log ? (
                        <>
                            {checkedRules.map((rule, idx) => (
                                <div key={rule.id} className="flex flex-col items-center">
                                    {idx > 0 && (
                                        <div className="flex flex-col items-center gap-1 py-4 opacity-50">
                                            <span className="text-3xl">😎</span>
                                        </div>
                                    )}
                                    <div className="w-full flex gap-4 pr-2">
                                        <div className="w-16 flex-none flex flex-col items-end pt-5">
                                            <span className="text-[12px] font-black text-[#1a1a2e]">09:15</span>
                                            <span className="text-[10px] font-bold text-gray-300 uppercase">Start</span>
                                        </div>
                                        <div className="flex-1 relative group">
                                            <div className={`p-6 bg-white rounded-[45px] border-2 border-transparent shadow-sm flex items-center justify-between overflow-hidden relative active:scale-[0.98] transition-all`}>
                                                <div className={`absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r ${gradients[idx % gradients.length]} opacity-80`} />
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-xl">
                                                        {rule.emoji}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[16px] font-black text-[#1a1a2e] leading-tight">{rule.text}</span>
                                                        <span className="text-[11px] font-bold text-gray-300 uppercase mt-1 tracking-widest">{rule.category}</span>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center z-10 shadow-lg shadow-green-100">
                                                    <Check size={20} strokeWidth={4} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {checkedRules.length === 0 && (
                                <div className="p-20 text-center opacity-30 flex flex-col items-center gap-4">
                                    <Shield size={48} />
                                    <p className="text-[12px] font-black uppercase tracking-widest">No Discipline Recorded</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-20 text-center opacity-20 flex flex-col items-center gap-4">
                            <span className="text-6xl">🕰️</span>
                            <p className="text-[12px] font-black uppercase tracking-widest">System Inactive</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
