'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, ShieldCheck, Zap, AlertCircle, ShoppingCart, Activity, Brain, Calendar, Check } from 'lucide-react';
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[260]"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                        className="fixed inset-x-0 bottom-0 bg-white rounded-t-[50px] z-[270] max-h-[94vh] overflow-y-auto pb-safe shadow-[0_-20px_60px_rgba(0,0,0,0.2)]"
                    >
                        {/* HANDLE */}
                        <div className="flex justify-center pt-6 pb-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full" />
                        </div>

                        {/* HEADER */}
                        <div className="px-8 pb-8 pt-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                            <div className="flex flex-col">
                                <h3 className="text-[32px] font-black tracking-[-0.04em] text-[#1a1a2e] leading-tight">
                                    {format(date, 'MMMM d')}
                                </h3>
                                <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">{format(date, 'EEEE')} Protocol</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-[#1a1a2e] active:scale-90 transition-all border border-gray-100"
                            >
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="px-8 pb-12 flex flex-col gap-10">
                            {/* PERFORMANCE OVERVIEW */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1a1a2e] rounded-[35px] p-6 border border-white/5 flex flex-col gap-4 shadow-xl">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={14} className="text-green-500" />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Net Revenue</span>
                                    </div>
                                    <span className={`text-3xl font-black tracking-tighter ${log?.pnl && log.pnl > 0 ? 'text-green-400' : 'text-gray-200'}`}>
                                        {log?.pnl ? (log.pnl > 0 ? `+$${log.pnl}` : `-$${Math.abs(log.pnl)}`) : '$0.00'}
                                    </span>
                                </div>
                                <div className="bg-blue-600 rounded-[35px] p-6 border border-white/10 flex flex-col gap-4 shadow-2xl shadow-blue-500/30">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-white/60" />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Compliance</span>
                                    </div>
                                    <span className="text-3xl font-black text-white tracking-tighter">
                                        {log?.grade || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* SYSTEM STATUS (Rules) */}
                            <section>
                                <div className="flex items-center justify-between mb-6 px-1">
                                    <h4 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Zap size={14} className="text-blue-500" /> System Constraints
                                    </h4>
                                    <div className="h-[1px] flex-1 bg-gray-50 ml-4" />
                                </div>
                                <div className="bg-gray-50/50 rounded-[40px] p-3 flex flex-col gap-2 border border-gray-100/50">
                                    {[
                                        { id: '1', text: 'Risk Ceiling 2% Unit', follows: true },
                                        { id: '2', text: 'Hard Stop Activation', follows: true },
                                        { id: '3', text: 'Bias Confirmation Vector', follows: false }
                                    ].map(rule => (
                                        <div key={rule.id} className="bg-white rounded-[28px] p-5 flex items-center justify-between border border-gray-100 shadow-sm">
                                            <span className="text-[15px] font-black text-[#1a1a2e]">{rule.text}</span>
                                            {rule.follows ? (
                                                <div className="w-8 h-8 bg-green-50 text-green-500 rounded-full flex items-center justify-center border border-green-100 shadow-sm">
                                                    <Check size={18} strokeWidth={4} />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100 shadow-sm">
                                                    <AlertCircle size={18} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* NEURAL BASELINE (Mood/State) */}
                            <section>
                                <div className="flex items-center justify-between mb-6 px-1">
                                    <h4 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Brain size={14} className="text-orange-500" /> Neural Baseline
                                    </h4>
                                    <div className="h-[1px] flex-1 bg-gray-50 ml-4" />
                                </div>
                                <div className="bg-[#1a1a2e] rounded-[40px] p-8 flex flex-col gap-6 relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                                    <div className="flex items-center gap-5 relative z-10 transition-transform hover:scale-[1.02]">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-xl border border-white/5">
                                            🧘
                                        </div>
                                        <div>
                                            <p className="text-[18px] font-black text-white">Stable & Focused</p>
                                            <p className="text-[12px] font-bold text-orange-400 uppercase tracking-widest mt-0.5">High Alpha State</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-white/5 rounded-3xl border border-white/5 relative z-10">
                                        <p className="text-[14px] font-bold text-gray-400 italic leading-relaxed">
                                            "Architecture stable. Decision latency at minimum. Mental capital preserved throughout session."
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* VOLATILITY CONTEXT (Events) */}
                            {events.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between mb-6 px-1">
                                        <h4 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Activity size={14} className="text-red-500" /> Market Volatility
                                        </h4>
                                        <div className="h-[1px] flex-1 bg-gray-50 ml-4" />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {events.map(event => (
                                            <div key={event.id} className="bg-white border border-gray-100 rounded-[35px] p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${event.impact === 'critical' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                                                        <AlertCircle size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[16px] font-black text-[#1a1a2e]">{event.title}</p>
                                                        <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">{event.time} • {event.country}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${event.impact === 'critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                                    {event.impact}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* EMPTY STATE */}
                            {!log && events.length === 0 && (
                                <div className="py-24 text-center flex flex-col items-center gap-6">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-100 animate-pulse">
                                        <Calendar size={48} strokeWidth={3} />
                                    </div>
                                    <p className="text-[12px] font-black text-gray-300 uppercase tracking-[0.3em]">No Architecture Data</p>
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

