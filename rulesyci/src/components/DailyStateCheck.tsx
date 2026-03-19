import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import { Shield, Battery, Moon, Smile, ArrowRight, Check } from 'lucide-react';

export default function DailyStateCheck() {
    const { session, completePreSession, setEmotionalBaseline } = useRuleSci();
    const [step, setStep] = useState(1);
    
    // Internal states for the check
    const [sleepScore, setSleepScore] = useState(3); // 1-5
    const [energyLevel, setEnergyLevel] = useState(3); // 1-5
    
    if (session.preSessionComplete) return null;

    const handleComplete = () => {
        completePreSession();
    };

    return (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col p-6 pb-[calc(env(safe-area-inset-bottom)+20px)] overflow-y-auto">
            <header className="mb-12 pt-8">
                <div className="w-12 h-12 bg-[#1a1a2e] text-white rounded-2xl flex items-center justify-center mb-6">
                    <Shield size={24} />
                </div>
                <h1 className="text-[28px] font-black text-[#1a1a2e] leading-tight mb-2">Daily Readiness</h1>
                <p className="text-base text-gray-400 font-bold uppercase tracking-wider">Before you enter the arena</p>
            </header>

            <div className="flex-1 flex flex-col gap-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.section 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 mb-2">
                                    <Moon size={20} className="text-blue-500" />
                                    <h3 className="text-lg font-black text-[#1a1a2e]">Sleep Quality</h3>
                                </div>
                                <div className="flex justify-between gap-2">
                                    {[1, 2, 3, 4, 5].map(val => (
                                        <button 
                                            key={val}
                                            onClick={() => setSleepScore(val)}
                                            className={`flex-1 h-14 rounded-2xl font-black transition-all ${sleepScore === val ? 'bg-blue-600 text-white scale-105 shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-300'}`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between px-1">
                                    <span className="text-[10px] font-bold text-gray-300 uppercase">Poor</span>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase">Elite</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 mb-2">
                                    <Battery size={20} className="text-orange-500" />
                                    <h3 className="text-lg font-black text-[#1a1a2e]">Energy Levels</h3>
                                </div>
                                <div className="flex justify-between gap-2">
                                    {[1, 2, 3, 4, 5].map(val => (
                                        <button 
                                            key={val}
                                            onClick={() => setEnergyLevel(val)}
                                            className={`flex-1 h-14 rounded-2xl font-black transition-all ${energyLevel === val ? 'bg-orange-500 text-white scale-105 shadow-lg shadow-orange-100' : 'bg-gray-50 text-gray-300'}`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between px-1">
                                    <span className="text-[10px] font-bold text-gray-300 uppercase">Drained</span>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase">Peak</span>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {step === 2 && (
                        <motion.section 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <Smile size={20} className="text-purple-500" />
                                    <h3 className="text-lg font-black text-[#1a1a2e]">Emotional Baseline</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {['neutral', 'anxious', 'greedy', 'fearful', 'calm', 'distracted'].map(mood => (
                                        <button 
                                            key={mood}
                                            onClick={() => setEmotionalBaseline(mood as any)}
                                            className={`h-14 rounded-2xl font-black capitalize transition-all border-2 ${session.emotionalBaseline === mood ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-white border-gray-100 text-gray-400'}`}
                                        >
                                            {mood}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>

            <footer className="pt-8">
                {step < 2 ? (
                    <button 
                        onClick={() => setStep(step + 1)}
                        className="w-full h-16 bg-[#1a1a2e] text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                    >
                        Next Step <ArrowRight size={20} />
                    </button>
                ) : (
                    <button 
                        onClick={handleComplete}
                        className="w-full h-16 bg-green-600 text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-100 active:scale-95 transition-all"
                    >
                        Lock In & Sync <Check size={20} />
                    </button>
                )}
                <p className="text-[11px] font-bold text-gray-300 text-center mt-6 uppercase tracking-[0.2em]">RuleSci Discipline Shield Active</p>
            </footer>
        </div>
    );
}
