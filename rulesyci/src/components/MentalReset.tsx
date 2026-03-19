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
        <div className="fixed inset-0 z-[200] bg-white flex flex-col p-6 pb-[calc(env(safe-area-inset-bottom)+20px)]">
            <header className="mb-12 pt-8">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                    <Brain size={24} />
                </div>
                <h1 className="text-[28px] font-black text-[#1a1a2e] leading-tight mb-2">Mental Reset</h1>
                <p className="text-base text-gray-400 font-bold uppercase tracking-wider italic">Detach from the outcome</p>
            </header>

            <div className="flex-1 flex flex-col gap-10 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.section 
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col gap-8 text-center"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-3xl p-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">P&L</p>
                                    <p className={`text-2xl font-black tabular-nums ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {totalPnl >= 0 ? '+' : ''}${totalPnl}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-3xl p-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Win Rate</p>
                                    <p className="text-2xl font-black tabular-nums text-[#1a1a2e]">{Math.round(winRate)}%</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-4 px-4">
                                <h3 className="text-lg font-black text-[#1a1a2e]">Take a deep breath.</h3>
                                <p className="text-[14px] font-bold text-gray-400 leading-relaxed">
                                    The numbers above are data points, not your self-worth. You followed the process. That is the only victory.
                                </p>
                            </div>
                        </motion.section>
                    )}

                    {step === 2 && (
                        <motion.section 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-black text-[#1a1a2e] flex items-center gap-2">
                                    <MessageSquare size={20} className="text-blue-500" />
                                    Final Note
                                </h3>
                                <textarea 
                                    autoFocus
                                    placeholder="One lesson you learned today..."
                                    className="w-full h-32 bg-gray-50 rounded-2xl p-5 text-[16px] font-bold text-[#1a1a2e] border-none outline-none resize-none"
                                />
                            </div>
                            <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 flex items-start gap-3">
                                <Sparkles size={18} className="text-blue-500 mt-0.5" />
                                <p className="text-[12px] font-bold text-blue-800 leading-relaxed">
                                    Reflection converts experience into wisdom. Your future self thanks you.
                                </p>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>

            <footer className="pt-8">
                {step === 1 ? (
                    <button 
                        onClick={() => setStep(2)}
                        className="w-full h-16 bg-[#1a1a2e] text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                    >
                        Review Process <Check size={20} />
                    </button>
                ) : (
                    <button 
                        onClick={handleFinalize}
                        className="w-full h-16 bg-[#1a1a2e] text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                    >
                        Close Session <Coffee size={20} />
                    </button>
                )}
            </footer>
        </div>
    );
}
