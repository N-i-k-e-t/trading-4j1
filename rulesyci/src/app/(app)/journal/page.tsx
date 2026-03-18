'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    XCircle,
    MessageSquare
} from 'lucide-react';

export default function JournalPage() {
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());

    const days = [
        { name: 'M', date: 16 },
        { name: 'T', date: 17, hasTrades: true },
        { name: 'W', date: 18, hasTrades: true },
        { name: 'T', date: 19 },
        { name: 'F', date: 20, hasTrades: true },
        { name: 'S', date: 21, isSelected: true },
        { name: 'S', date: 22 },
    ];

    const trades = [
        {
            id: 1,
            pair: "EUR/USD",
            direction: "LONG",
            entry: "1.0845",
            exit: "1.0890",
            status: "success",
            mood: "🙂",
            rules: "Followed",
            notes: "Clean breakout retest. Waited for confirmation."
        },
        {
            id: 2,
            pair: "BTC/USDT",
            direction: "SHORT",
            entry: "52400",
            exit: "52850",
            status: "broken",
            mood: "😕",
            rules: "Rule broken: No FOMO entries",
            notes: "Chased the dump. Stop hit early."
        }
    ];

    return (
        <div className="flex flex-col gap-8">
            {/* Calendar Strip */}
            <section className="bg-white rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-[#1a1a2e]">February 2026</h2>
                    <div className="flex gap-2">
                        <button className="p-2 text-[#9ca3af] hover:text-[#1a1a2e] transition-colors"><ChevronLeft size={20} /></button>
                        <button className="p-2 text-[#9ca3af] hover:text-[#1a1a2e] transition-colors"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="flex justify-between items-center px-2">
                    {days.map((day, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedDay(day.date)}
                            className="flex flex-col items-center gap-3 group"
                        >
                            <span className="text-[12px] font-bold text-[#9ca3af] uppercase tracking-widest">{day.name}</span>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${selectedDay === day.date
                                    ? 'bg-[#2563eb] text-white shadow-md'
                                    : 'bg-transparent text-[#1a1a2e] hover:bg-[#1a1a2e]/5'
                                }`}>
                                {day.date}
                            </div>
                            {day.hasTrades && (
                                <div className={`w-1.5 h-1.5 rounded-full ${selectedDay === day.date ? 'bg-[#2563eb]' : 'bg-[#22c55e]'}`} />
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Trades List */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-[#1a1a2e]">Today's Entries</h2>
                </div>

                {trades.map((trade) => (
                    <div key={trade.id} className="card flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`px-2 py-1 rounded-md text-[11px] font-bold ${trade.direction === 'LONG' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#ef4444]/10 text-[#ef4444]'
                                    }`}>
                                    {trade.direction}
                                </div>
                                <h3 className="text-lg font-bold text-[#1a1a2e]">{trade.pair}</h3>
                            </div>
                            <span className="text-xl">{trade.mood}</span>
                        </div>

                        <div className="flex justify-between text-sm py-2 border-y border-[#1a1a2e]/5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Entry</span>
                                <span className="font-bold text-[#1a1a2e]">{trade.entry}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                                <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Exit</span>
                                <span className="font-bold text-[#1a1a2e]">{trade.exit}</span>
                            </div>
                        </div>

                        <div className={`flex items-center gap-2 text-sm font-bold ${trade.status === 'success' ? 'text-[#22c55e]' : 'text-[#ef4444]'
                            }`}>
                            {trade.status === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                            {trade.rules}
                        </div>

                        {trade.notes && (
                            <div className="bg-[#1a1a2e]/5 rounded-xl p-3 flex gap-3">
                                <MessageSquare size={16} className="text-[#9ca3af] mt-1 shrink-0" />
                                <p className="text-sm text-[#6b7280] italic leading-relaxed">
                                    "{trade.notes}"
                                </p>
                            </div>
                        )}
                    </div>
                ))}

                {trades.length === 0 && (
                    <div className="text-center py-20">
                        <span className="text-6xl mb-6 block">📓</span>
                        <p className="text-[#6b7280] font-medium">No trades logged today</p>
                        <p className="text-sm text-[#9ca3af] mt-1">Tap + to record your first trade</p>
                    </div>
                )}
            </section>

            {/* Floating Action Button */}
            <button className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-14 h-14 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[100]">
                <Plus size={28} strokeWidth={2.5} />
            </button>
        </div>
    );
}
