'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Target, Zap, TrendingUp, Brain, Globe } from 'lucide-react';
import { useRuleSci } from '@/lib/context';

interface PersonaSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PersonaSheet({ isOpen, onClose }: PersonaSheetProps) {
    const { userModel, updateUserModel, showToast } = useRuleSci();
    const [localPersona, setLocalPersona] = useState({
        primary_style: userModel.primary_style || 'Day Trading',
        primary_market: userModel.primary_market || 'Forex',
        dominant_weakness: userModel.dominant_weakness || 'FOMO',
        goal: userModel.goal || 'Consistency',
    });

    const styles = ['Day Trading', 'Swing Trading', 'Position Trading', 'Mixed'];
    const markets = ['Forex', 'Crypto', 'Stocks', 'Indices'];
    const weaknesses = ['FOMO', 'Revenge Trading', 'Oversizing', 'Early Exits', 'Hesitation'];
    const goals = ['Consistency', 'Account Growth', 'Career Full-time', 'Recovery'];

    const handleSave = () => {
        updateUserModel(localPersona);
        showToast('Trading Persona Updated — AI Coach synced.', 'success');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-[430px] bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#1a1a2e] text-white rounded-lg flex items-center justify-center">
                                    <Brain size={18} />
                                </div>
                                <h2 className="text-[17px] font-black text-[#1a1a2e]">My Trading Profile</h2>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-300 bg-gray-50 rounded-full active:scale-90 transition-transform">
                                <X size={18} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 no-scrollbar">
                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                <p className="text-[13px] font-bold text-blue-700 leading-relaxed flex items-start gap-2">
                                    <Sparkles size={16} className="shrink-0 mt-0.5" />
                                    Your profile helps RuleSci provide better coaching based on your trading style.
                                </p>
                            </div>

                            {/* Section: Trading Style */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Zap size={12} strokeWidth={3} />
                                    Primary Style
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {styles.map(style => (
                                        <button
                                            key={style}
                                            onClick={() => setLocalPersona({ ...localPersona, primary_style: style })}
                                            className={`h-11 rounded-xl text-[13px] font-bold border transition-all ${
                                                localPersona.primary_style === style 
                                                    ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] shadow-lg shadow-[#1a1a2e]/10' 
                                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                                            }`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Markets */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Globe size={12} strokeWidth={3} />
                                    Focused Markets
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {markets.map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setLocalPersona({ ...localPersona, primary_market: m })}
                                            className={`h-11 rounded-xl text-[13px] font-bold border transition-all ${
                                                localPersona.primary_market === m 
                                                    ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] shadow-lg shadow-[#1a1a2e]/10' 
                                                    : 'bg-white text-gray-400 border-gray-100'
                                            }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Weakness */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Target size={12} strokeWidth={3} />
                                    Biggest Struggle
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {weaknesses.map(w => (
                                        <button
                                            key={w}
                                            onClick={() => setLocalPersona({ ...localPersona, dominant_weakness: w })}
                                            className={`px-4 h-10 rounded-xl text-[12px] font-bold border transition-all ${
                                                localPersona.dominant_weakness === w 
                                                    ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/10' 
                                                    : 'bg-white text-gray-400 border-gray-100'
                                            }`}
                                        >
                                            {w}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Goal */}
                            <div className="flex flex-col gap-3 pb-8">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <TrendingUp size={12} strokeWidth={3} />
                                    Main Goal
                                </label>
                                <div className="flex flex-col gap-2">
                                    {goals.map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setLocalPersona({ ...localPersona, goal: g })}
                                            className={`w-full h-12 px-4 rounded-xl flex items-center justify-between text-[14px] font-bold border transition-all ${
                                                localPersona.goal === g 
                                                    ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' 
                                                    : 'bg-white text-gray-400 border-gray-100'
                                            }`}
                                        >
                                            {g}
                                            {localPersona.goal === g && <Check size={16} strokeWidth={3} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Overlay for safe area */}
                        <div className="p-6 bg-white border-t border-gray-50 pb-[calc(env(safe-area-inset-bottom)+24px)]">
                            <button
                                onClick={handleSave}
                                className="w-full h-14 bg-blue-600 text-white font-black rounded-xl shadow-xl shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Save Profile
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
