'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Check, Loader2, Sparkles, TrendingUp, ShieldCheck, Zap, Target, Lock, Brain, Globe, Clock, Award } from 'lucide-react';
import Image from 'next/image';

export default function OnboardingPage() {
    const { user, showToast, updateUserModel } = useRuleSci();
    const router = useRouter();
    const supabase = createClient();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<any>({
        style: '',
        assetClass: '',
        riskPerTrade: '1%',
        maxLoss: '2%',
        experience: '',
        frequency: 3,
        goalLevel: 'Expert',
        primaryConstraint: '',
        timeWindow: '',
        contractType: '',
        leverageLevel: '',
        systemType: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Auto-advance Step 9 (Architecture Generation)
    useEffect(() => {
        if (currentStep === 9) {
            const timer = setTimeout(() => {
                nextStep();
            }, 4500);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleSingleSelect = (key: string, value: string, autoAdvance = true) => {
        setAnswers({ ...answers, [key]: value });
        if (autoAdvance) {
            setTimeout(() => nextStep(), 250);
        }
    };

    const handleFinish = async () => {
        setIsGenerating(true);
        
        // Sync with Context
        updateUserModel({
            primary_style: answers.style,
            avg_trades_per_day: answers.frequency,
            dominant_weakness: answers.primaryConstraint,
            goal: answers.goalLevel,
            primary_market: answers.assetClass
        });

        // Sync with Supabase Metadata
        if (user) {
            await supabase.auth.updateUser({
                data: { 
                    onboarding_completed: true,
                    trading_style: answers.style,
                    challenge: answers.primaryConstraint,
                    experience: answers.experience
                }
            });
        }

        setTimeout(() => {
            setIsGenerating(false);
            nextStep(); // Final Welcome
        }, 4000);
    };

    if (!isHydrated) return <div className="min-h-[100dvh] bg-white flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

    const totalSteps = 15; // Consolidated 25-step feel into 15 high-impact screens
    const progress = (currentStep / totalSteps) * 100;

    const OptionCard = ({ emoji, title, subtitle, selected, onClick }: any) => (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`card-premium w-full group flex items-center gap-4 transition-all !p-5 ${
                selected ? 'ring-2 ring-blue-500 bg-blue-50/20' : ''
            }`}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${selected ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-50'}`}>
                {emoji}
            </div>
            <div className="flex flex-col items-start text-left">
                <span className="text-[17px] font-black text-[#1a1a2e]">{title}</span>
                {subtitle && <span className="text-[12px] font-bold text-gray-400">{subtitle}</span>}
            </div>
            {selected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" strokeWidth={4} />
                </motion.div>
            )}
        </motion.button>
    );

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col pb-[calc(env(safe-area-inset-bottom)+20px)]">
            {/* SEGMENTED PROGRESS BAR (Cal AI Style) */}
            <div className="fixed top-0 left-0 right-0 px-5 pt-3 flex gap-1.5 z-[110]" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className="h-1.5 flex-1 bg-gray-50 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-blue-500"
                            initial={{ x: '-100%' }}
                            animate={{ x: i < currentStep ? '0%' : (i === currentStep ? '0%' : '-100%') }}
                            transition={{ duration: 0.4 }}
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
                    <ArrowLeft size={20} strokeWidth={3} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest tabular-nums">Step {currentStep + 1} of {totalSteps}</span>
                </div>
                <div className="w-10 h-10" />
            </nav>

            <main className="flex-1 px-5 flex flex-col pt-4 overflow-x-hidden">
                <AnimatePresence mode="wait">
                    {/* STEP 0: THE SPLASH */}
                    {currentStep === 0 && (
                        <motion.div key="s0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col items-center justify-center text-center gap-10">
                            <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-gray-50 bg-[#1a1a2e]">
                                <Image 
                                    src="/brain/54a113ee-baac-4c15-b0e6-cd80b556d9d1/rulesci_dashboard_preview_onboarding_1774010392149.png" 
                                    alt="RuleSci Preview" 
                                    fill 
                                    className="object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 text-left">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Architecture Preview</p>
                                    <p className="text-white font-black text-lg">Elite Discipline System</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h1 className="text-[36px] font-black text-[#1a1a2e] leading-tight">Master Your <br/> Execution.</h1>
                                <p className="text-[16px] font-bold text-gray-400 px-10">
                                    Build a custom trading architecture based on your psychology profile.
                                </p>
                            </div>
                            <button onClick={nextStep} className="h-[68px] w-full max-w-[320px] bg-blue-600 text-white rounded-[28px] font-black text-[20px] shadow-2xl shadow-blue-100 active:scale-95 transition-all">
                                Setup My Protocol
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 1: IDENTITY */}
                    {currentStep === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">I identify as a...</h2>
                                <p className="text-[14px] font-bold text-gray-400">Defining your profile improves compliance.</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <OptionCard emoji="🏦" title="Institutional Mind" subtitle="Focus on large trends, risk-averse" onClick={() => handleSingleSelect('style', 'institutional')} selected={answers.style === 'institutional'} />
                                <OptionCard emoji="🗡️" title="Aggressive Scalper" subtitle="High intensity, precision entries" onClick={() => handleSingleSelect('style', 'scalper')} selected={answers.style === 'scalper'} />
                                <OptionCard emoji="🏰" title="Portfolio Manager" subtitle="Swing focused, diversified" onClick={() => handleSingleSelect('style', 'portfolio')} selected={answers.style === 'portfolio'} />
                                <OptionCard emoji="🧪" title="Systematic Researcher" subtitle="Rules based, purely technical" onClick={() => handleSingleSelect('style', 'systematic')} selected={answers.style === 'systematic'} />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: ASSET CLASS */}
                    {currentStep === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">Primary Asset?</h2>
                                <p className="text-[14px] font-bold text-gray-400">Where do you spend 80% of your time?</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { e: '📈', t: 'Indices', s: 'NQ, ES, DAX' },
                                    { e: '₿', t: 'Crypto', s: 'BTC, ETH' },
                                    { e: '💱', t: 'Forex', s: 'EUR/USD, GBP' },
                                    { e: '🟡', t: 'Commodities', s: 'Gold, Oil' },
                                    { e: '📊', t: 'Stocks', s: 'TSLA, NVDA' },
                                    { e: '📉', t: 'Options', s: 'SPY, QQQ' }
                                ].map(item => (
                                    <button 
                                        key={item.t}
                                        onClick={() => handleSingleSelect('assetClass', item.t)}
                                        className={`h-[110px] rounded-[32px] border-2 transition-all p-4 flex flex-col items-center justify-center gap-1 ${
                                            answers.assetClass === item.t ? 'border-blue-500 bg-blue-50/20 text-[#1a1a2e]' : 'border-gray-50 text-gray-400'
                                        }`}
                                    >
                                        <span className="text-3xl">{item.e}</span>
                                        <span className="text-[13px] font-black">{item.t}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: EXPERIENCE LEVEL */}
                    {currentStep === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-2 text-center">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">Trading Tenure?</h2>
                                <p className="text-[14px] font-bold text-gray-400 text-center">How many years of live market exposure?</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <OptionCard emoji="🌱" title="Apprentice" subtitle="Less than 1 Year" onClick={() => handleSingleSelect('experience', '1')} selected={answers.experience === '1'} />
                                <OptionCard emoji="💪" title="The Grind" subtitle="1 to 3 Years" onClick={() => handleSingleSelect('experience', '3')} selected={answers.experience === '3'} />
                                <OptionCard emoji="🏅" title="The Architect" subtitle="3 to 5 Years" onClick={() => handleSingleSelect('experience', '5')} selected={answers.experience === '5'} />
                                <OptionCard emoji="💎" title="Veteran" subtitle="Over 5 Years" onClick={() => handleSingleSelect('experience', '10')} selected={answers.experience === '10'} />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: TIME WINDOW */}
                    {currentStep === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">Trading Window?</h2>
                                <p className="text-[14px] font-bold text-gray-400">Constraint-based trading reduces errors.</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <OptionCard emoji="🗽" title="New York Session" subtitle="9:30 AM - 4:00 PM EST" onClick={() => handleSingleSelect('timeWindow', 'nyc')} selected={answers.timeWindow === 'nyc'} />
                                <OptionCard emoji="🏰" title="London Session" subtitle="3:00 AM - 11:30 AM EST" onClick={() => handleSingleSelect('timeWindow', 'ldn')} selected={answers.timeWindow === 'ldn'} />
                                <OptionCard emoji="🗼" title="Asian Session" subtitle="7:00 PM - 3:00 AM EST" onClick={() => handleSingleSelect('timeWindow', 'asia')} selected={answers.timeWindow === 'asia'} />
                                <OptionCard emoji="🌍" title="24/7 Global" subtitle="Crypto or swing trading" onClick={() => handleSingleSelect('timeWindow', '247')} selected={answers.timeWindow === '247'} />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: DAILY TRADE CAP (Framer Motion interaction) */}
                    {currentStep === 5 && (
                        <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center flex-1 gap-12">
                            <div className="flex flex-col gap-2 text-center">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">Daily Execution Cap?</h2>
                                <p className="text-[14px] font-bold text-gray-400 px-8">System will lock entries after this limit to prevent overtrading.</p>
                            </div>
                            <div className="flex items-center gap-8">
                                <button onClick={() => setAnswers({...answers, frequency: Math.max(1, answers.frequency - 1)})} className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a2e] border border-gray-100 active:scale-90 transition-all font-black text-3xl"><Minus /></button>
                                <span className="text-[100px] font-black tabular-nums text-[#1a1a2e] leading-none">{answers.frequency}</span>
                                <button onClick={() => setAnswers({...answers, frequency: Math.min(20, answers.frequency + 1)})} className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-200 active:scale-90 transition-all font-black text-3xl"><Plus /></button>
                            </div>
                            <button onClick={nextStep} className="h-[72px] w-full bg-[#1a1a2e] text-white rounded-[28px] font-black text-[20px] shadow-2xl active:scale-95 transition-all">Continue</button>
                        </motion.div>
                    )}

                    {/* STEP 6: RISK PER TRADE */}
                    {currentStep === 6 && (
                        <motion.div key="s6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">Risk Per Trade?</h2>
                                <p className="text-[14px] font-bold text-gray-400">High volatility requires tighter risk architecture.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {['0.25%', '0.5%', '1.0%', '2.0%'].map(val => (
                                    <button 
                                        key={val} 
                                        onClick={() => handleSingleSelect('riskPerTrade', val)}
                                        className={`h-[80px] rounded-[28px] border-2 font-black text-xl transition-all ${
                                            answers.riskPerTrade === val ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-50 bg-white text-gray-300'
                                        }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 7: BIGGEST BIAS */}
                    {currentStep === 7 && (
                        <motion.div key="s7" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-[28px] font-black text-[#1a1a2e] leading-tight">Hardest Constraint?</h2>
                                <p className="text-[14px] font-bold text-gray-400">Be honest — where does it go wrong?</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <OptionCard emoji="🎰" title="Impulse Entry" subtitle="Entering without rules confirmation" onClick={() => handleSingleSelect('primaryConstraint', 'impulse')} selected={answers.primaryConstraint === 'impulse'} />
                                <OptionCard emoji="📉" title="Moving Stops" subtitle="Letting losers run too far" onClick={() => handleSingleSelect('primaryConstraint', 'stoploss')} selected={answers.primaryConstraint === 'stoploss'} />
                                <OptionCard emoji="😤" title="Revenge Trading" subtitle="Trying to make back losses fast" onClick={() => handleSingleSelect('primaryConstraint', 'revenge')} selected={answers.primaryConstraint === 'revenge'} />
                                <OptionCard emoji="⏰" title="Overtrading" subtitle="Forcing trades off-session" onClick={() => handleSingleSelect('primaryConstraint', 'overtrade')} selected={answers.primaryConstraint === 'overtrade'} />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 8: THE PROMISE (Micro-Commitment) */}
                    {currentStep === 8 && (
                        <motion.div key="s8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center text-center gap-12">
                            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                                <Lock size={48} strokeWidth={3} />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-[32px] font-black text-[#1a1a2e] leading-tight">The Discipline <br/> Contract.</h2>
                                <p className="text-[16px] font-bold text-gray-400 px-10">
                                    I commit to following my custom architecture for the next **14 days** without deviation.
                                </p>
                            </div>
                            <button onClick={nextStep} className="h-[72px] w-full max-w-[320px] bg-[#1a1a2e] text-white rounded-[28px] font-black text-[20px] active:scale-95 transition-all shadow-2xl">
                                I Accept
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 9: GENERATION SEQUENCE (Cal AI Reveal) */}
                    {currentStep === 9 && (
                        <motion.div key="s9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center gap-12">
                            <div className="relative">
                                <Loader2 className="animate-spin text-blue-500" size={64} />
                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 bg-blue-100 rounded-full blur-2xl" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-[24px] font-black text-[#1a1a2e]">Building Architecture...</h2>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Risk Protocol', status: 'Hardwired' },
                                        { label: 'System Lock', status: 'Active' },
                                        { label: 'Neural Baseline', status: 'Calibrating...' }
                                    ].map((l, i) => (
                                        <motion.div key={l.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.8 }} className="flex items-center justify-between w-[240px] px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-[12px] font-black text-gray-400 uppercase">{l.label}</span>
                                            <span className="text-[11px] font-black text-blue-500 uppercase">{l.status}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 10: FINAL PAYWALL / PLAN CONFIRMATION (Perfect Day Style) */}
                    {currentStep === 10 && (
                        <motion.div key="s10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col gap-10">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-lg"><Award size={32} /></div>
                                <h2 className="text-[32px] font-black text-[#1a1a2e] leading-tight text-center">Protocol <br/> Engineered.</h2>
                            </div>
                            
                            <div className="card-premium !bg-[#1a1a2e] !p-8 text-white relative overflow-hidden shadow-2xl">
                                <Sparkles className="absolute top-4 right-4 text-white/10" size={48} />
                                <p className="text-[11px] font-black uppercase tracking-widest text-blue-400 mb-2">Selected Tier</p>
                                <h3 className="text-[38px] font-black mb-4 tracking-tighter">Elite Access</h3>
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Check size={12} strokeWidth={4} /></div>
                                        <span className="text-[15px] font-bold text-gray-200">Rule-based Model Lock</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Check size={12} strokeWidth={4} /></div>
                                        <span className="text-[15px] font-bold text-gray-200">Neural Mood Correlation</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Check size={12} strokeWidth={4} /></div>
                                        <span className="text-[15px] font-bold text-gray-200">Daily Discipline Credits</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => router.push('/today')}
                                className="h-[72px] bg-blue-600 text-white rounded-[28px] font-black text-[20px] flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-blue-100"
                            >
                                Enter Dashboard <Sparkles size={24} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
