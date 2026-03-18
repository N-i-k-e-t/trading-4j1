'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import TradeEntryModal from '@/components/TradeEntryModal';
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    MessageSquare
} from 'lucide-react';

export default function JournalPage() {
    const { trades } = useRuleSci();
    const [weekOffset, setWeekOffset] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Compute the current week based on offset
    const { days, monthLabel, selectedDay, setSelectedDay } = useMemo(() => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1 + (weekOffset * 7)); // Monday

        const daysArr = [];
        const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            daysArr.push({
                name: dayNames[i],
                date: d.getDate(),
                fullDate: dateStr,
                hasTrades: trades.some(t => t.date === dateStr),
            });
        }

        const monthLabel = startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return { days: daysArr, monthLabel, selectedDay: null as string | null, setSelectedDay: null as any };
    }, [weekOffset, trades]);

    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const filteredTrades = trades.filter(t => t.date === selectedDate);

    return (
        <div className="flex flex-col gap-8">
            {/* Calendar Strip */}
            <section className="bg-white rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-[#1a1a2e]">{monthLabel}</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setWeekOffset(prev => prev - 1)}
                            className="p-2 text-[#9ca3af] hover:text-[#1a1a2e] transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setWeekOffset(prev => prev + 1)}
                            className="p-2 text-[#9ca3af] hover:text-[#1a1a2e] transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center px-2">
                    {days.map((day, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedDate(day.fullDate)}
                            className="flex flex-col items-center gap-3 group"
                        >
                            <span className="text-[12px] font-bold text-[#9ca3af] uppercase tracking-widest">{day.name}</span>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${selectedDate === day.fullDate
                                    ? 'bg-[#2563eb] text-white shadow-md'
                                    : 'bg-transparent text-[#1a1a2e] hover:bg-[#1a1a2e]/5'
                                }`}>
                                {day.date}
                            </div>
                            {day.hasTrades && (
                                <div className={`w-1.5 h-1.5 rounded-full ${selectedDate === day.fullDate ? 'bg-[#2563eb]' : 'bg-[#22c55e]'}`} />
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Trades List */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-[#1a1a2e]">
                        {selectedDate === new Date().toISOString().split('T')[0] ? "Today's" : new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + "'s"} Entries
                    </h2>
                    <span className="text-sm font-bold text-[#9ca3af]">{filteredTrades.length} trade{filteredTrades.length !== 1 ? 's' : ''}</span>
                </div>

                {filteredTrades.map((trade) => (
                    <div key={trade.id} className="bg-white rounded-2xl px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`px-2 py-1 rounded-md text-[11px] font-bold ${trade.type === 'Long' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#ef4444]/10 text-[#ef4444]'
                                    }`}>
                                    {trade.type.toUpperCase()}
                                </div>
                                <h3 className="text-lg font-bold text-[#1a1a2e]">{trade.pair}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {trade.rules_broken.length > 0 && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#ef4444]/10 text-[#ef4444] rounded-full">
                                        ⚠️ {trade.rules_broken.length} broken
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between text-sm py-2 border-y border-[#1a1a2e]/5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Entry</span>
                                <span className="font-bold text-[#1a1a2e]">{trade.entry || '—'}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                                <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Exit</span>
                                <span className="font-bold text-[#1a1a2e]">{trade.exit || '—'}</span>
                            </div>
                        </div>

                        <div className={`flex items-center gap-2 text-sm font-bold ${trade.rules_broken.length === 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                            }`}>
                            {trade.rules_broken.length === 0 ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                            {trade.rules_broken.length === 0 ? 'All rules followed' : `${trade.rules_broken.length} rule${trade.rules_broken.length > 1 ? 's' : ''} broken`}
                        </div>

                        {trade.notes && (
                            <div className="bg-[#1a1a2e]/5 rounded-xl p-3 flex gap-3">
                                <MessageSquare size={16} className="text-[#9ca3af] mt-1 shrink-0" />
                                <p className="text-sm text-[#6b7280] italic leading-relaxed">
                                    &ldquo;{trade.notes}&rdquo;
                                </p>
                            </div>
                        )}
                    </div>
                ))}

                {filteredTrades.length === 0 && (
                    <div className="text-center py-20">
                        <span className="text-6xl mb-6 block">📓</span>
                        <p className="text-[#6b7280] font-medium">No trades logged for this day</p>
                        <p className="text-sm text-[#9ca3af] mt-1">Tap + to record your first trade</p>
                    </div>
                )}
            </section>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-14 h-14 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[100]"
            >
                <Plus size={28} strokeWidth={2.5} />
            </button>

            <TradeEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
