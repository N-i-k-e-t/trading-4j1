'use client';

import { useState, useMemo } from 'react';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, addDays, isSameDay, setYear, setMonth, setDate } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Flame, Award, Check, Clock, Shield, Search, X } from 'lucide-react';
import { useRuleSci } from '@/lib/context';

export default function TimelineCalendar() {
    const { dailyLogs, marketEvents, rules } = useRuleSci();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isAdvancedPickerOpen, setIsAdvancedPickerOpen] = useState(false);

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
        'from-blue-50 to-transparent',
        'from-green-50 to-transparent',
        'from-purple-50 to-transparent',
        'from-orange-50 to-transparent'
    ];

    return (
        <div className="flex flex-col gap-10">
            {/* HORIZONTAL DATE PICKER - PERFECT DAY STYLE */}
            <header className="flex flex-col gap-8">
                <div className="flex items-center justify-between px-2">
                    <button onClick={() => setIsAdvancedPickerOpen(true)} className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-[#1a1a2e] text-white rounded-2xl flex items-center justify-center shadow-xl group-active:scale-95 transition-all">
                            <Clock size={24} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl font-black text-[#1a1a2e] leading-none mb-1 flex items-center gap-2">
                                {format(selectedDate, 'MMMM')}
                                <Search size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                            </h2>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Protocol Timeline</p>
                        </div>
                    </button>
                    <div className="flex bg-gray-50 p-1.5 rounded-full border border-gray-100 shadow-sm">
                        <button onClick={() => setSelectedDate(addDays(selectedDate, -7))} className="p-2 hover:bg-white rounded-full transition-all text-gray-400 hover:text-[#1a1a2e] active:scale-90"><ChevronLeft size={20} /></button>
                        <button onClick={() => setSelectedDate(addDays(selectedDate, 7))} className="p-2 hover:bg-white rounded-full transition-all text-gray-400 hover:text-[#1a1a2e] active:scale-90"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <motion.div 
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset }) => {
                        if (offset.x > 80) setSelectedDate(addDays(selectedDate, -7));
                        else if (offset.x < -80) setSelectedDate(addDays(selectedDate, 7));
                    }}
                    className="flex justify-between px-2 bg-white rounded-[40px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50/50 relative overflow-hidden cursor-grab active:cursor-grabbing"
                >
                    <AnimatePresence>
                        {isAdvancedPickerOpen && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, scale: 0.95 }} 
                                className="absolute inset-0 bg-white/95 backdrop-blur-3xl z-40 p-6 flex flex-col gap-4 shadow-2xl"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black text-[#1a1a2e]">Jump to Date</h3>
                                    <button onClick={() => setIsAdvancedPickerOpen(false)} className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400"><X size={16} /></button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => { setSelectedDate(setMonth(selectedDate, i)); setIsAdvancedPickerOpen(false); }}
                                            className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${selectedDate.getMonth() === i ? 'bg-[#1a1a2e] text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}
                                        >
                                            {format(new Date(2025, i, 1), 'MMM')}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {[2024, 2025, 2026].map(y => (
                                        <button 
                                            key={y} 
                                            onClick={() => { setSelectedDate(setYear(selectedDate, y)); setIsAdvancedPickerOpen(false); }}
                                            className={`py-2 rounded-xl text-[10px] font-bold transition-all ${selectedDate.getFullYear() === y ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}
                                        >
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {weekDays.map((date) => {
                        const isSelected = isSameDay(date, selectedDate);
                        const hasLog = getDayData(date).log;
                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className="flex flex-col items-center gap-3 active:scale-90 transition-all z-10"
                            >
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSelected ? 'text-blue-500' : 'text-gray-200'}`}>
                                    {format(date, 'eee')}
                                </span>
                                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${isSelected ? 'bg-[#1a1a2e] text-white shadow-2xl scale-125' : 'text-gray-400 bg-gray-50 border border-transparent'}`}>
                                    <span className="text-[16px] font-black">{format(date, 'd')}</span>
                                    {hasLog && <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-blue-400' : 'bg-blue-500'}`} />}
                                </div>
                            </button>
                        );
                    })}
                </motion.div>
            </header>

            {/* TIMELINE LIST - PERFECT DAY STYLE */}
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4 px-2">
                    <h3 className="text-[12px] font-black text-gray-300 uppercase tracking-[0.2em] flex-none">Session Constraints</h3>
                    <div className="h-[1px] flex-1 bg-gray-50" />
                </div>

                <div className="flex flex-col gap-6">
                    {activeDateData.log ? (
                        <AnimatePresence mode="popLayout">
                            {checkedRules.map((rule, idx) => (
                                <motion.div 
                                    key={rule.id} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-full flex gap-4 pr-1">
                                        <div className="w-14 flex-none flex flex-col items-end pt-6">
                                            <span className="text-[13px] font-black text-[#1a1a2e]">09:{15 + (idx * 12)}</span>
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Verified</span>
                                        </div>
                                        <div className="flex-1 relative group">
                                            <div className={`p-6 bg-white rounded-[40px] border border-gray-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center justify-between overflow-hidden relative active:scale-[0.98] transition-all group-hover:shadow-md`}>
                                                <div className={`absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r ${gradients[idx % gradients.length]} opacity-60`} />
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                        {rule.emoji}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[16px] font-black text-[#1a1a2e] leading-tight">{rule.text}</span>
                                                        <span className="text-[11px] font-bold text-gray-300 uppercase mt-1 tracking-widest">{rule.category}</span>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center z-10 shadow-lg shadow-green-100 flex-none">
                                                    <Check size={20} strokeWidth={4} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {idx < checkedRules.length - 1 && (
                                        <div className="w-0.5 h-6 bg-gray-50 ml-14 my-1" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-gray-50 rounded-[30px] flex items-center justify-center text-4xl grayscale opacity-30">
                                🕰️
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[12px] font-black text-gray-200 uppercase tracking-[0.3em]">System Inactive</p>
                                <p className="text-[11px] font-bold text-gray-400">No architectural data detected for this epoch.</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

