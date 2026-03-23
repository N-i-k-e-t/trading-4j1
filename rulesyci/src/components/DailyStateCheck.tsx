import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import { Shield, Battery, Moon, Smile, ArrowRight, Check, Coffee } from 'lucide-react';

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
                    <Shield size={28} strokeWidth={2.5} />
                </div>
                <h1 className="text-[36px] font-black text-[#1a1a2e] leading-[0.9] tracking-tighter mb-4">Daily <br/> Readiness.</h1>
                <p className="text-[14px] font-bold text-gray-400 uppercase tracking-widest pl-1">Morning Check-In</p>
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
                                <div className="flex justify-between gap-3">
                                    {[1, 2, 3, 4, 5].map(val => (
                                        <button 
                                            key={val}
                                            onClick={() => setSleepScore(val)}
                                            className={`flex-1 h-16 rounded-full font-black text-[18px] transition-all ${sleepScore === val ? 'bg-[#1a1a2e] text-white scale-105 shadow-2xl' : 'bg-gray-50 text-gray-300'}`}
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
                                <div className="flex justify-between gap-3">
                                    {[1, 2, 3, 4, 5].map(val => (
                                        <button 
                                            key={val}
                                            onClick={() => setEnergyLevel(val)}
                                            className={`flex-1 h-16 rounded-full font-black text-[18px] transition-all ${energyLevel === val ? 'bg-[#1a1a2e] text-white scale-105 shadow-2xl' : 'bg-gray-50 text-gray-300'}`}
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
                                    <h3 className="text-lg font-black text-[#1a1a2e]">How I'm Feeling</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {['neutral', 'anxious', 'greedy', 'fearful', 'calm', 'distracted'].map(mood => (
                                        <button 
                                            key={mood}
                                            onClick={() => setEmotionalBaseline(mood as any)}
                                            className={`h-16 rounded-[32px] font-black capitalize transition-all border-2 ${session.emotionalBaseline === mood ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white shadow-xl' : 'bg-white border-gray-50 text-gray-300'}`}
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

            <footer className="pt-8 mb-4">
                {step < 2 ? (
                    <button 
                        onClick={() => setStep(step + 1)}
                        className="w-full h-20 bg-[#1a1a2e] text-white rounded-full font-black text-xl flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
                    >
                        Next Step <ArrowRight size={20} strokeWidth={3} />
                    </button>
                ) : (
                    <button 
                        onClick={handleComplete}
                        className="w-full h-20 bg-[#1a1a2e] text-white rounded-full font-black text-xl flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
                    >
                        Start My Session <Check size={24} strokeWidth={4} />
                    </button>
                )}
                <p className="text-[11px] font-bold text-gray-300 text-center mt-6 uppercase tracking-[0.2em]">RuleSci Discipline Shield Active</p>
            </footer>
        </div>
    );
}
