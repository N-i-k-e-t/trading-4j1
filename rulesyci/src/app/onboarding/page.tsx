'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Check, Loader2, Sparkles, TrendingUp } from 'lucide-react';

export default function OnboardingPage() {
    const { user, showToast, updateUserModel } = useRuleSci();
    const router = useRouter();
    const supabase = createClient();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<any>({
        style: '',
        markets: [],
        challenge: '',
        experience: '',
        frequency: 3,
        goal: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleSingleSelect = (key: string, value: string, autoAdvance = true) => {
        setAnswers({ ...answers, [key]: value });
        if (autoAdvance) {
            setTimeout(() => nextStep(), 300);
        }
    };

    const toggleMarket = (market: string) => {
        const current = answers.markets;
        if (current.includes(market)) {
            setAnswers({ ...answers, markets: current.filter((m: string) => m !== market) });
        } else {
            setAnswers({ ...answers, markets: [...current, market] });
        }
    };

    const handleFinish = async () => {
        setIsGenerating(true);
        
        // Sync with Context
        updateUserModel({
            primary_style: answers.style,
            avg_trades_per_day: answers.frequency,
            dominant_weakness: answers.challenge,
            goal: answers.goal,
            primary_market: answers.markets.join(', ')
        });

        // Sync with Supabase Metadata for persistence
        if (user) {
            await supabase.auth.updateUser({
                data: { 
                    onboarding_completed: true,
                    trading_style: answers.style,
                    challenge: answers.challenge
                }
            });
        }

        setTimeout(() => {
            setIsGenerating(false);
            nextStep(); // Move to Screen 7 (Reveal)
        }, 3200);
    };

    if (!isHydrated) return <div className="min-h-[100dvh] bg-white" />;

    const progress = (currentStep / 7) * 100;

    const OptionCard = ({ emoji, title, subtitle, selected, onClick }: any) => (
        <button
            onClick={onClick}
            className={`w-full h-[72px] rounded-[20px] px-5 flex items-center gap-4 transition-all touch-manipulation active:scale-[0.98] border-2 ${
                selected ? 'border-[#1a1a2e] bg-[#1a1a2e]/5' : 'border-gray-100 bg-white'
            }`}
        >
            <span className="text-xl">{emoji}</span>
            <div className="flex flex-col items-start">
                <span className="text-[15px] font-bold text-[#1a1a2e]">{title}</span>
                {subtitle && <span className="text-[12px] font-semibold text-gray-400">{subtitle}</span>}
            </div>
            {selected && <div className="ml-auto w-5 h-5 bg-[#1a1a2e] rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={4} />
            </div>}
        </button>
    );

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col italic-none">
            {/* PROGRESS BAR */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-50 z-[110]" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
                <motion.div 
                    className="h-full bg-[#1a1a2e]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 7) * 100}%` }}
                />
            </div>

            {/* NAV BAR */}
            <nav className="h-14 flex items-center justify-between px-5 z-[100] mt-1" style={{ marginTop: 'calc(env(safe-area-inset-top, 0px) + 4px)' }}>
                <button 
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="w-10 h-10 flex items-center justify-center text-[#1a1a2e] bg-gray-50 rounded-full disabled:opacity-0 active:scale-90 transition-all shadow-sm"
                >
                    <ArrowLeft size={18} strokeWidth={3} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] tabular-nums">Step {currentStep + 1} of 7</span>
                </div>
                <div className="w-10 h-10" />
            </nav>

            <main className="flex-1 px-5 flex flex-col pt-8">
                <AnimatePresence mode="wait">
                    {/* SCREEN 0: WELCOME */}
                    {currentStep === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex-1 flex flex-col items-center justify-center text-center gap-8"
                        >
                            <div className="text-6xl mb-4">🎯</div>
                            <h1 className="text-[28px] font-black text-[#1a1a2e] leading-tight">
                                Let&apos;s personalise <br/> RuleSci for you
                            </h1>
                            <p className="text-[15px] font-semibold text-gray-400">
                                This takes 30 seconds and helps us <br/> build your discipline profile.
                            </p>
                            <button 
                                onClick={nextStep}
                                className="mt-8 h-[56px] w-full max-w-[280px] bg-[#1a1a2e] text-white rounded-full font-black text-[16px] shadow-xl shadow-gray-200 active:scale-95 transition-all touch-manipulation"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {/* SCREEN 1: STYLE */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex flex-col gap-8"
                        >
                            <h2 className="text-[24px] font-black text-[#1a1a2e] mt-4">How do you trade?</h2>
                            <div className="flex flex-col gap-3">
                                <OptionCard emoji="⚡" title="Day Trading" subtitle="Intraday, closed same day" selected={answers.style === 'day'} onClick={() => handleSingleSelect('style', 'day')} />
                                <OptionCard emoji="📊" title="Swing Trading" subtitle="Hold days to weeks" selected={answers.style === 'swing'} onClick={() => handleSingleSelect('style', 'swing')} />
                                <OptionCard emoji="🏗️" title="Position Trading" subtitle="Weeks to months" selected={answers.style === 'position'} onClick={() => handleSingleSelect('style', 'position')} />
                                <OptionCard emoji="🔄" title="Mixed" subtitle="Multiple styles" selected={answers.style === 'mixed'} onClick={() => handleSingleSelect('style', 'mixed')} />
                            </div>
                        </motion.div>
                    )}

                    {/* SCREEN 2: MARKETS */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex flex-col gap-8"
                        >
                            <h2 className="text-[24px] font-black text-[#1a1a2e] mt-4">What do you trade?</h2>
                            <div className="flex flex-wrap gap-2">
                                {['Stocks', 'Options', 'Futures', 'Forex', 'Crypto', 'Commodities', 'Indices'].map(market => (
                                    <button
                                        key={market}
                                        onClick={() => toggleMarket(market)}
                                        className={`h-[48px] px-6 rounded-full font-bold text-sm transition-all touch-manipulation active:scale-95 ${
                                            answers.markets.includes(market) ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        {market}
                                    </button>
                                ))}
                            </div>
                            <button 
                                disabled={answers.markets.length === 0}
                                onClick={nextStep}
                                className="mt-auto h-[56px] w-full bg-[#1a1a2e] text-white rounded-full font-black disabled:opacity-30 active:scale-95 transition-all shadow-lg"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {/* SCREEN 3: CHALLENGE */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex flex-col gap-8"
                        >
                            <h2 className="text-[24px] font-black text-[#1a1a2e] mt-4">Biggest struggle?</h2>
                            <div className="flex flex-col gap-3">
                                <OptionCard emoji="🎰" title="Impulsive trades" selected={answers.challenge === 'impulse'} onClick={() => handleSingleSelect('challenge', 'impulse')} />
                                <OptionCard emoji="📉" title="Moving stop loss" selected={answers.challenge === 'stoploss'} onClick={() => handleSingleSelect('challenge', 'stoploss')} />
                                <OptionCard emoji="😤" title="Revenge trading" selected={answers.challenge === 'revenge'} onClick={() => handleSingleSelect('challenge', 'revenge')} />
                                <OptionCard emoji="⏰" title="Overtrading" selected={answers.challenge === 'overtrade'} onClick={() => handleSingleSelect('challenge', 'overtrade')} />
                            </div>
                        </motion.div>
                    )}

                    {/* SCREEN 4: EXPERIENCE */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex flex-col gap-8"
                        >
                            <h2 className="text-[24px] font-black text-[#1a1a2e] mt-4">Trading experience?</h2>
                            <div className="flex flex-col gap-3">
                                <OptionCard emoji="🌱" title="<6 months" selected={answers.experience === 'new'} onClick={() => handleSingleSelect('experience', 'new')} />
                                <OptionCard emoji="📈" title="6mo–2yr" selected={answers.experience === 'junior'} onClick={() => handleSingleSelect('experience', 'junior')} />
                                <OptionCard emoji="💼" title="2–5yr" selected={answers.experience === 'mid'} onClick={() => handleSingleSelect('experience', 'mid')} />
                                <OptionCard emoji="🏆" title="5+yr" selected={answers.experience === 'senior'} onClick={() => handleSingleSelect('experience', 'senior')} />
                            </div>
                        </motion.div>
                    )}

                    {/* SCREEN 5: FREQUENCY */}
                    {currentStep === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex flex-col items-center justify-center flex-1 gap-12"
                        >
                            <h2 className="text-[24px] font-black text-[#1a1a2e] text-center leading-tight">
                                How many trades <br/> per day?
                            </h2>
                            <div className="flex items-center gap-10">
                                <button 
                                    onClick={() => setAnswers({...answers, frequency: Math.max(1, answers.frequency - 1)})}
                                    className="w-[64px] h-[64px] rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a2e] active:scale-90 transition-transform shadow-sm"
                                >
                                    <Minus size={28} strokeWidth={3} />
                                </button>
                                <span className="text-[64px] font-black tabular-nums text-[#1a1a2e]">
                                    {answers.frequency}
                                </span>
                                <button 
                                    onClick={() => setAnswers({...answers, frequency: Math.min(20, answers.frequency + 1)})}
                                    className="w-[64px] h-[64px] rounded-full bg-[#1a1a2e] text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg"
                                >
                                    <Plus size={28} strokeWidth={3} />
                                </button>
                            </div>
                            <button 
                                onClick={nextStep}
                                className="mt-8 h-[56px] w-full bg-[#1a1a2e] text-white rounded-full font-black text-[16px] active:scale-95 transition-all shadow-xl"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {/* SCREEN 6: GOAL */}
                    {currentStep === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex flex-col gap-8"
                        >
                            <h2 className="text-[24px] font-black text-[#1a1a2e] mt-4">Next 90 days goal?</h2>
                            <div className="flex flex-col gap-3">
                                <OptionCard emoji="🎯" title="Follow rules consistently" selected={answers.goal === 'discipline'} onClick={() => handleSingleSelect('goal', 'discipline', false)} />
                                <OptionCard emoji="💰" title="Become profitable" selected={answers.goal === 'profit'} onClick={() => handleSingleSelect('goal', 'profit', false)} />
                                <OptionCard emoji="🛡️" title="Control risk better" selected={answers.goal === 'risk'} onClick={() => handleSingleSelect('goal', 'risk', false)} />
                            </div>
                            <button 
                                disabled={!answers.goal}
                                onClick={handleFinish}
                                className="mt-auto h-[56px] w-full bg-[#1a1a2e] text-white rounded-full font-black disabled:opacity-30 active:scale-95 transition-all shadow-xl"
                            >
                                Generate My Plan
                            </button>
                        </motion.div>
                    )}

                    {/* SCREEN 7: PLAN REVEAL */}
                    {currentStep === 7 && (
                        <motion.div
                            key="step7"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center flex-1 gap-8"
                        >
                            {isGenerating ? (
                                <div className="flex flex-col items-center gap-6">
                                    <Loader2 className="animate-spin text-orange-500" size={48} />
                                    <h2 className="text-xl font-bold text-[#1a1a2e] animate-pulse">Building your plan...</h2>
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-full flex flex-col gap-6"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                            <Check size={32} strokeWidth={3} />
                                        </div>
                                        <h2 className="text-[28px] font-black text-[#1a1a2e] mb-1">Your plan is ready</h2>
                                        <p className="text-[14px] font-semibold text-gray-400">Based on your trading profile</p>
                                    </div>

                                    {/* Summary Card */}
                                    <div className="bg-gray-50 rounded-[28px] p-6 flex flex-col gap-4 border border-gray-100">
                                        <div className="flex justify-between items-center text-sm font-bold border-b border-gray-100 pb-4">
                                            <span className="text-gray-400 uppercase tracking-widest text-[10px]">Your Selection</span>
                                            <span className="text-[#1a1a2e]">{answers.style.toUpperCase()}</span>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[15px] font-bold text-[#1a1a2e] flex items-center gap-2">
                                                <Sparkles className="text-orange-500" size={16} /> 18% Win Rate Boost
                                            </span>
                                            <p className="text-[13px] font-medium text-gray-500 leading-snug">
                                                Traders with {answers.challenge.replace('_',' ')} struggles improve win rate by 18% after 30 days of consistent rule following on RuleSci.
                                            </p>
                                        </div>
                                        {/* Animated projection bars */}
                                        <div className="flex flex-col gap-2 mt-2">
                                            <div className="flex items-center justify-between text-[11px] font-black text-gray-400">
                                                <span>PROJECTED DISCIPLINE</span>
                                                <span className="text-green-600">↑ 40%</span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '85%' }}
                                                    transition={{ delay: 0.5, duration: 1 }}
                                                    className="h-full bg-green-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            {/* CTA AREA */}
            <div className="px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-6">
                 {currentStep === 7 ? (
                    <button 
                        onClick={() => router.push('/dashboard')} // Changed to router.push for step 7
                        className="w-full h-14 bg-[#1a1a2e] text-white font-black rounded-xl shadow-lg shadow-gray-200 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                    >
                        Start My Free Trial <ArrowLeft className="rotate-180" size={18} strokeWidth={3} />
                    </button>
                 ) : (
                    <button 
                        disabled={
                            (currentStep === 1 && !answers.style) ||
                            (currentStep === 2 && answers.markets.length === 0) ||
                            (currentStep === 3 && !answers.challenge) ||
                            (currentStep === 4 && !answers.experience) ||
                            (currentStep === 6 && !answers.goal)
                        }
                        onClick={currentStep === 6 ? handleFinish : nextStep} // Conditional action for step 6
                        className="w-full h-14 bg-[#1a1a2e] text-white font-black rounded-xl shadow-lg shadow-gray-200 active:scale-[0.97] transition-all flex items-center justify-center gap-2 disabled:bg-gray-50 disabled:text-gray-300 disabled:shadow-none"
                    >
                        Continue <ArrowLeft className="rotate-180" size={18} strokeWidth={3} />
                    </button>
                 )}
            </div>
        </div>
    );
}
