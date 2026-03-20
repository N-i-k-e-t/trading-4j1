'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, ShieldCheck, Zap, AlertCircle, ShoppingCart, Activity, Brain, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DailyLog, Trade, MarketEvent } from '@/types/trading';

interface CalendarDetailSheetProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date | null;
    data: { log?: DailyLog; events: MarketEvent[] } | null;
}

export default function CalendarDetailSheet({ isOpen, onClose, date, data }: CalendarDetailSheetProps) {
    if (!date) return null;

    const trades: Trade[] = []; // This would come from context in a real app or be passed in
    const log = data?.log;
    const events = data?.events || [];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-x-0 bottom-0 bg-white rounded-t-[40px] z-[70] max-h-[92vh] overflow-y-auto pb-safe shadow-2xl"
                    >
                        {/* HANDLE */}
                        <div className="flex justify-center pt-4 pb-2">
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full" />
                        </div>

                        {/* HEADER */}
                        <div className="px-6 pb-6 pt-2 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-50/50">
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-black tracking-tight text-[#1a1a2e]">
                                    {format(date, 'MMMM d')}
                                </h3>
                                <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">{format(date, 'EEEE')} Architecture</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 active:scale-90 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-6">
                            {/* PERFORMANCE OVERVIEW */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1a1a2e] rounded-[32px] p-5 border border-white/5 flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={14} className="text-green-500" />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Net Revenue</span>
                                    </div>
                                    <span className={`text-2xl font-black ${log?.pnl && log.pnl > 0 ? 'text-green-400' : 'text-gray-200'}`}>
                                        {log?.pnl ? (log.pnl > 0 ? `+$${log.pnl}` : `-$${Math.abs(log.pnl)}`) : '$0.00'}
                                    </span>
                                </div>
                                <div className="bg-blue-600 rounded-[32px] p-5 border border-white/10 flex flex-col gap-3 shadow-lg shadow-blue-500/20">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-white/60" />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Compliance</span>
                                    </div>
                                    <span className="text-2xl font-black text-white">
                                        {log?.grade || '—'}
                                    </span>
                                </div>
                            </div>

                            {/* SYSTEM STATUS (Rules) */}
                            <section>
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Zap size={12} /> System Constraints
                                    </h4>
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider">7/9 Followed</span>
                                </div>
                                <div className="bg-gray-50 rounded-[32px] p-2 flex flex-col gap-1">
                                    {[
                                        { id: '1', text: 'Never risk more than 2%', follows: true },
                                        { id: '2', text: 'Daily stop loss active', follows: true },
                                        { id: '3', text: 'Wait for bias confirmation', follows: false }
                                    ].map(rule => (
                                        <div key={rule.id} className="bg-white rounded-[24px] p-4 flex items-center justify-between border border-gray-100/50">
                                            <span className="text-[13px] font-bold text-[#1a1a2e]">{rule.text}</span>
                                            {rule.follows ? (
                                                <div className="w-6 h-6 bg-green-50 text-green-500 rounded-full flex items-center justify-center border border-green-100">
                                                    <ShieldCheck size={14} />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100">
                                                    <AlertCircle size={14} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* NEURAL BASELINE (Mood/State) */}
                            <section>
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4 px-1">
                                    <Brain size={12} /> Neural Architecture
                                </h4>
                                <div className="bg-orange-50/50 border border-orange-100/50 rounded-[32px] p-6 flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-orange-100">
                                            🧘
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-black text-[#1a1a2e]">Stable & Focused</p>
                                            <p className="text-[12px] font-bold text-orange-700/60 uppercase tracking-wider">High Alpha Baseline</p>
                                        </div>
                                    </div>
                                    <p className="text-[13px] font-bold text-orange-900/40 italic">
                                        "Detected low latency in decision making. No emotional bias found during morning session."
                                    </p>
                                </div>
                            </section>

                            {/* VOLATILITY CONTEXT (Events) */}
                            {events.length > 0 && (
                                <section>
                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4 px-1">
                                        <Activity size={12} /> Institutional Volatility
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        {events.map(event => (
                                            <div key={event.id} className="bg-white border border-gray-100 rounded-[28px] p-5 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${event.impact === 'critical' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                                                        <AlertCircle size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-black text-[#1a1a2e]">{event.title}</p>
                                                        <p className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">{event.time} • {event.country}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${event.impact === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                                    {event.impact}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* EMPTY STATE OR TRADES */}
                            {!log && events.length === 0 && (
                                <div className="py-20 text-center flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                        <Calendar size={32} />
                                    </div>
                                    <p className="text-[13px] font-bold text-gray-300 uppercase tracking-widest">No Architectural Data Detected</p>
                                </div>
                            )}

                            <div className="h-20" /> {/* SPACING */}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
