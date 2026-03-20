import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import { Sparkles, Brain, Check, MessageSquare, Coffee } from 'lucide-react';

interface MentalResetProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MentalReset({ isOpen, onClose }: MentalResetProps) {
    const { trades, showToast } = useRuleSci();
    const [step, setStep] = useState(1);
    
    const todayTrades = trades.filter(t => t.date.split('T')[0] === new Date().toISOString().split('T')[0]);
    const totalPnl = todayTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
    const winRate = todayTrades.length > 0 ? (todayTrades.filter(t => (t.pnl || 0) > 0).length / todayTrades.length) * 100 : 0;

    const handleFinalize = () => {
        showToast('Session Closed. See you tomorrow, Trader.', 'success');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col p-6 pb-[calc(env(safe-area-inset-bottom)+20px)] overflow-y-auto">
            {/* SEGMENTED PROGRESS BAR - CAL AI STYLE */}
            <div className="absolute top-0 left-0 right-0 px-6 pt-4 flex gap-1 z-[210]">
                {[1, 2].map((i) => (
                    <div key={i} className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-[#1a1a2e]"
                            initial={{ width: '0%' }}
                            animate={{ width: i <= step ? '100%' : '0%' }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                ))}
            </div>

            <header className="mb-12 pt-12">
                <div className="w-16 h-16 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center mb-8 shadow-xl">
                    <Brain size={28} strokeWidth={2.5} />
                </div>
                <h1 className="text-[36px] font-black text-[#1a1a2e] leading-[0.9] tracking-tighter mb-4">Mental <br/> Reset.</h1>
                <p className="text-[14px] font-bold text-gray-400 uppercase tracking-widest pl-1">Detach from outcome</p>
            </header>

            <div className="flex-1 flex flex-col gap-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.section 
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col gap-8 text-center"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 shadow-sm">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Net P&L</p>
                                    <p className={`text-3xl font-black tabular-nums ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {totalPnl >= 0 ? '+' : ''}${totalPnl}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 shadow-sm">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Efficiency</p>
                                    <p className="text-3xl font-black tabular-nums text-[#1a1a2e]">{Math.round(winRate)}%</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-6 px-4">
                                <h3 className="text-2xl font-black text-[#1a1a2e] tracking-tight">The numbers are data, <br/> not your self-worth.</h3>
                                <p className="text-[16px] font-bold text-gray-400 leading-relaxed max-w-[280px] mx-auto">
                                    You followed the process. That is the only victory that matters for long-term survival.
                                </p>
                            </div>
                        </motion.section>
                    )}

                    {step === 2 && (
                        <motion.section 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[18px] font-black text-[#1a1a2e] flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                        <MessageSquare size={16} />
                                    </div>
                                    Neural Reflection
                                </h3>
                                <textarea 
                                    autoFocus
                                    placeholder="One lesson you learned today..."
                                    className="w-full h-40 bg-gray-50 rounded-[32px] p-6 text-[17px] font-bold text-[#1a1a2e] border-none outline-none resize-none shadow-inner"
                                />
                            </div>
                            <div className="bg-blue-50/40 rounded-[32px] p-6 border border-blue-100 flex items-start gap-4">
                                <Sparkles size={20} className="text-blue-500 mt-0.5 flex-none" />
                                <p className="text-[13px] font-bold text-blue-900/60 leading-relaxed">
                                    Reflection converts raw data into wisdom. Your next session will benefit from this closure.
                                </p>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>

            <footer className="pt-8 mb-4">
                {step === 1 ? (
                    <button 
                        onClick={() => setStep(2)}
                        className="w-full h-20 bg-[#1a1a2e] text-white rounded-full font-black text-xl flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
                    >
                        Review Process <Check size={24} strokeWidth={4} />
                    </button>
                ) : (
                    <button 
                        onClick={handleFinalize}
                        className="w-full h-20 bg-[#1a1a2e] text-white rounded-full font-black text-xl flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
                    >
                        Close Baseline <Coffee size={24} strokeWidth={4} />
                    </button>
                )}
            </footer>
        </div>
    );
}
