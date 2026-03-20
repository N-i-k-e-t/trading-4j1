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

    const totalSteps = 10;
    const progress = (currentStep / totalSteps) * 100;

    const OptionCard = ({ emoji, title, subtitle, selected, onClick }: any) => (
        <button
            onClick={onClick}
            className={`card-premium w-full group flex items-center gap-4 transition-all !p-5 ${
                selected ? 'ring-2 ring-[#1a1a2e] bg-gray-50' : ''
            }`}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${selected ? 'bg-white shadow-sm' : 'bg-gray-50 group-active:scale-90'}`}>
                {emoji}
            </div>
            <div className="flex flex-col items-start text-left">
                <span className="text-[16px] font-black text-[#1a1a2e]">{title}</span>
                {subtitle && <span className="text-[12px] font-bold text-gray-400">{subtitle}</span>}
            </div>
            {selected && (
                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    className="ml-auto w-6 h-6 bg-[#1a1a2e] rounded-full flex items-center justify-center"
                >
                    <Check size={14} className="text-white" strokeWidth={4} />
                </motion.div>
            )}
        </button>
    );

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col italic-none pb-[calc(env(safe-area-inset-bottom)+20px)]">
            {/* SEGMENTED PROGRESS BAR */}
            <div className="fixed top-0 left-0 right-0 px-5 pt-3 flex gap-1.5 z-[110]" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-[#1a1a2e]"
                            initial={{ x: '-100%' }}
                            animate={{ x: i < currentStep ? '0%' : (i === currentStep ? '0%' : '-100%') }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                ))}
            </div>

            {/* NAV BAR */}
            <nav className="h-14 flex items-center justify-between px-5 z-[100] mt-6">
                <button 
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="w-10 h-10 flex items-center justify-center text-[#1a1a2e] bg-gray-50 rounded-full disabled:opacity-0 active:scale-90 transition-all"
                >
                    <ArrowLeft size={18} strokeWidth={3} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest tabular-nums">Step {currentStep + 1} of {totalSteps}</span>
                </div>
                <div className="w-10 h-10" />
            </nav>

            <main className="flex-1 px-5 flex flex-col pt-4 overflow-x-hidden">
                <AnimatePresence mode="wait">
                    {/* SCREEN 0: SPLASH */}
                    {currentStep === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex-1 flex flex-col items-center justify-center text-center gap-10"
                        >
                            <div className="relative">
                                <div className="text-8xl animate-bounce">🎯</div>
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-blue-500 rounded-full blur-3xl -z-10"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <h1 className="text-[32px] font-black text-[#1a1a2e] leading-tight">
                                    Master Your <br/> Trading Mind
                                </h1>
                                <p className="text-[16px] font-bold text-gray-400 px-10">
                                    Personalise RuleSci to build bulletproof discipline in 60 seconds.
                                </p>
                            </div>
                            <button 
                                onClick={nextStep}
                                className="h-[64px] w-full max-w-[300px] bg-[#1a1a2e] text-white rounded-[24px] font-black text-[18px] shadow-2xl shadow-gray-200 active:scale-95 transition-all mt-4"
                            >
                                Let's Begin
                            </button>
                        </motion.div>
                    )}

                    {/* SCREEN 1: TRADING STYLE */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="flex flex-col gap-2">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">What's your <br/> trading style?</h2>
                                <p className="text-[14px] font-bold text-gray-400">Select the approach that fits you best.</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <OptionCard emoji="⚡" title="Intraday / Scalping" subtitle="High speed, multiple trades a day" selected={answers.style === 'day'} onClick={() => handleSingleSelect('style', 'day')} />
                                <OptionCard emoji="📊" title="Swing Trading" subtitle="Hold positions for days/weeks" selected={answers.style === 'swing'} onClick={() => handleSingleSelect('style', 'swing')} />
                                <OptionCard emoji="🏗️" title="Position Trading" subtitle="Long-term trend following" selected={answers.style === 'position'} onClick={() => handleSingleSelect('style', 'position')} />
                                <OptionCard emoji="🔄" title="Hybrid" subtitle="Combination of multiple styles" selected={answers.style === 'mixed'} onClick={() => handleSingleSelect('style', 'mixed')} />
                            </div>
                        </motion.div>
                    )}

                    {/* SCREEN 2: MARKETS */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="flex flex-col gap-2">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">Which markets <br/> do you trade?</h2>
                                <p className="text-[14px] font-bold text-gray-400">Select all that apply.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {['Stocks', 'Options', 'Futures', 'Forex', 'Crypto', 'Commodities', 'Indices'].map(market => (
                                    <button
                                        key={market}
                                        onClick={() => toggleMarket(market)}
                                        className={`h-[72px] rounded-[24px] font-black text-[15px] transition-all touch-manipulation active:scale-95 border-2 ${
                                            answers.markets.includes(market) ? 'border-[#1a1a2e] bg-[#1a1a2e]/5 text-[#1a1a2e]' : 'border-gray-50 bg-white text-gray-400'
                                        }`}
                                    >
                                        {market}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-auto">
                                <button 
                                    disabled={answers.markets.length === 0}
                                    onClick={nextStep}
                                    className="h-[64px] w-full bg-[#1a1a2e] text-white rounded-[24px] font-black text-[18px] disabled:opacity-20 active:scale-95 transition-all shadow-xl"
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* SCREEN 3: BIGGEST CHALLENGE */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="flex flex-col gap-2">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">What's your <br/> biggest hurdle?</h2>
                                <p className="text-[14px] font-bold text-gray-400">Be honest — we've all been there.</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <OptionCard emoji="🎰" title="Impulse Trading" subtitle="Entering without a clear setup" selected={answers.challenge === 'impulse'} onClick={() => handleSingleSelect('challenge', 'impulse')} />
                                <OptionCard emoji="📉" title="Moving Stops" subtitle="Letting losers run too far" selected={answers.challenge === 'stoploss'} onClick={() => handleSingleSelect('challenge', 'stoploss')} />
                                <OptionCard emoji="😤" title="Revenge Trading" subtitle="Trying to make back losses fast" selected={answers.challenge === 'revenge'} onClick={() => handleSingleSelect('challenge', 'revenge')} />
                                <OptionCard emoji="⏰" title="Overtrading" subtitle="Forcing trades when flat" selected={answers.challenge === 'overtrade'} onClick={() => handleSingleSelect('challenge', 'overtrade')} />
                            </div>
                        </motion.div>
                    )}

                    {/* SCREEN 4: EXPERIENCE */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="flex flex-col gap-2">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">How long have <br/> you been trading?</h2>
                                <p className="text-[14px] font-bold text-gray-400">Experience helps us tailor the risk alerts.</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <OptionCard emoji="🌱" title="New Trader" subtitle="Less than 6 months" selected={answers.experience === 'new'} onClick={() => handleSingleSelect('experience', 'new')} />
                                <OptionCard emoji="📈" title="Improving" subtitle="6 months to 2 years" selected={answers.experience === 'junior'} onClick={() => handleSingleSelect('experience', 'junior')} />
                                <OptionCard emoji="💼" title="Consistent" subtitle="2 to 5 years" selected={answers.experience === 'mid'} onClick={() => handleSingleSelect('experience', 'mid')} />
                                <OptionCard emoji="🏆" title="Veteran" subtitle="Over 5 years" selected={answers.experience === 'senior'} onClick={() => handleSingleSelect('experience', 'senior')} />
                            </div>
                        </motion.div>
                    )}

                    {/* SCREEN 5: FREQUENCY */}
                    {currentStep === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex flex-col items-center justify-center flex-1 gap-12"
                        >
                            <div className="flex flex-col gap-2 text-center">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">Max trades <br/> per day?</h2>
                                <p className="text-[14px] font-bold text-gray-400">We'll help you stop when you hit this limit.</p>
                            </div>
                            
                            <div className="flex items-center gap-10">
                                <button 
                                    onClick={() => setAnswers({...answers, frequency: Math.max(1, answers.frequency - 1)})}
                                    className="w-[72px] h-[72px] rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a2e] active:scale-90 transition-all border border-gray-100"
                                >
                                    <Minus size={32} strokeWidth={3} />
                                </button>
                                <span className="text-[84px] font-black tabular-nums text-[#1a1a2e] min-w-[120px] text-center">
                                    {answers.frequency}
                                </span>
                                <button 
                                    onClick={() => setAnswers({...answers, frequency: Math.min(20, answers.frequency + 1)})}
                                    className="w-[72px] h-[72px] rounded-full bg-[#1a1a2e] text-white flex items-center justify-center active:scale-90 transition-all shadow-xl"
                                >
                                    <Plus size={32} strokeWidth={3} />
                                </button>
                            </div>
                            
                            <div className="w-full">
                                <button 
                                    onClick={nextStep}
                                    className="h-[64px] w-full bg-[#1a1a2e] text-white rounded-[24px] font-black text-[18px] active:scale-95 transition-all shadow-xl"
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* SCREEN 6: PSYCHOLOGY FOCUS */}
                    {currentStep === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="flex flex-col gap-2">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">Psychology focus?</h2>
                                <p className="text-[14px] font-bold text-gray-400">Which mental aspect do you want to build?</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <OptionCard emoji="🧘" title="Patience" subtitle="Wait for perfect setups" selected={answers.goal === 'discipline'} onClick={() => handleSingleSelect('goal', 'discipline', false)} />
                                <OptionCard emoji="🏗️" title="Consistency" subtitle="Reliable execution every time" selected={answers.goal === 'profit'} onClick={() => handleSingleSelect('goal', 'profit', false)} />
                                <OptionCard emoji="🦁" title="Inner Strength" subtitle="Stick to plan under pressure" selected={answers.goal === 'risk'} onClick={() => handleSingleSelect('goal', 'risk', false)} />
                            </div>
                            <button 
                                disabled={!answers.goal}
                                onClick={nextStep}
                                className="mt-auto h-[64px] w-full bg-[#1a1a2e] text-white rounded-[24px] font-black text-[18px] disabled:opacity-20 active:scale-95 transition-all shadow-xl"
                            >
                                Build My Plan
                            </button>
                        </motion.div>
                    )}

                    {/* SCREEN 7: DISCIPLINE AUTO-PILOT reveal */}
                    {currentStep === 7 && (
                        <motion.div
                            key="step7"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center gap-10"
                        >
                            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center shadow-inner">
                                <Sparkles size={48} />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-[32px] font-black text-[#1a1a2e] leading-tight">Discipline <br/> Auto-Pilot</h2>
                                <p className="text-[16px] font-bold text-gray-400 px-8">
                                    We've created a custom trading system based on your {answers.experience} level and {answers.style} style.
                                </p>
                            </div>
                            <div className="w-full max-w-[320px] bg-gray-50 rounded-[32px] p-6 text-left border border-gray-100">
                                <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-4">Plan Highlights</p>
                                <ul className="flex flex-col gap-3">
                                    <li className="flex items-center gap-3 text-[14px] font-black text-[#1a1a2e]">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white"><Check size={14} strokeWidth={4} /></div>
                                        {answers.frequency} Daily Trade Cap
                                    </li>
                                    <li className="flex items-center gap-3 text-[14px] font-black text-[#1a1a2e]">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white"><Check size={14} strokeWidth={4} /></div>
                                        Pro-active {answers.challenge} Alerts
                                    </li>
                                    <li className="flex items-center gap-3 text-[14px] font-black text-[#1a1a2e]">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white"><Check size={14} strokeWidth={4} /></div>
                                        Rules-first Entry Lock
                                    </li>
                                </ul>
                            </div>
                            <button 
                                onClick={handleFinish}
                                className="h-[64px] w-full max-w-[300px] bg-[#1a1a2e] text-white rounded-[24px] font-black text-[18px] shadow-2xl active:scale-95 transition-all"
                            >
                                Show Final Plan
                            </button>
                        </motion.div>
                    )}

                    {/* SCREEN 8: FINAL REVEAL (Generated) */}
                    {currentStep === 8 && (
                        <motion.div
                            key="step8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 flex flex-col justify-center"
                        >
                            {isGenerating ? (
                                <div className="flex flex-col items-center gap-8">
                                    <div className="relative">
                                        <Loader2 className="animate-spin text-blue-600" size={64} />
                                        <motion.div 
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="absolute inset-0 bg-blue-100 rounded-full blur-2xl"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-[20px] font-black text-[#1a1a2e] mb-2">Syncing with MetaTrader...</h2>
                                        <p className="text-[14px] font-bold text-gray-300">Hardwiring your discipline protocols.</p>
                                    </div>
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="flex flex-col gap-10"
                                >
                                    <div className="flex flex-col items-center text-center gap-4">
                                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-lg">
                                            <TrendingUp size={40} />
                                        </div>
                                        <h2 className="text-[32px] font-black text-[#1a1a2e] leading-tight">Ready for <br/> Elite Execution.</h2>
                                    </div>

                                    <div className="card-premium !bg-blue-600 !p-8 text-white relative overflow-hidden">
                                        <Sparkles className="absolute top-4 right-4 text-white/20" size={48} />
                                        <p className="text-[11px] font-black uppercase tracking-widest text-blue-200 mb-2">Projected Improvement</p>
                                        <h3 className="text-[48px] font-black mb-4">+24% <span className="text-[18px] font-bold text-blue-100">Discipline</span></h3>
                                        <p className="text-[14px] font-bold text-blue-50 leading-relaxed">
                                            Traders with {answers.challenge} patterns see a 24% reduction in errors within 14 days of using the RuleSci Tilt Meter.
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => router.push('/today')}
                                        className="h-[72px] bg-[#1a1a2e] text-white rounded-[28px] font-black text-[20px] flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl"
                                    >
                                        Enter Dashboard <ArrowLeft className="rotate-180" size={24} strokeWidth={4} />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
