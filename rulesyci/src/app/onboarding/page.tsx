'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

type Step = {
    id: number;
    question: string;
    type: 'single' | 'multi';
    options: { label: string; value: string }[];
};

const steps: Step[] = [
    {
        id: 1,
        question: "What drives your trading?",
        type: 'single',
        options: [
            { label: "Extra income", value: "income" },
            { label: "Financial freedom", value: "freedom" },
            { label: "Replacing my job", value: "career" },
            { label: "Growing my savings", value: "savings" },
            { label: "The challenge", value: "challenge" },
        ],
    },
    {
        id: 2,
        question: "What best describes you?",
        type: 'single',
        options: [
            { label: "Complete beginner", value: "beginner" },
            { label: "I've traded a few times", value: "intermediate" },
            { label: "I trade regularly", value: "experienced" },
            { label: "I'm a full-time trader", value: "pro" },
        ],
    },
    {
        id: 3,
        question: "What's your biggest struggle?",
        type: 'multi',
        options: [
            { label: "I break my own rules", value: "rules" },
            { label: "I trade emotionally", value: "emotions" },
            { label: "I overtrade", value: "overtrade" },
            { label: "I don't have clear rules", value: "no_rules" },
            { label: "I don't review my trades", value: "no_review" },
            { label: "I chase losses", value: "revenge" },
        ],
    },
    {
        id: 4,
        question: "What markets do you trade?",
        type: 'single',
        options: [
            { label: "Forex", value: "forex" },
            { label: "Stocks", value: "stocks" },
            { label: "Crypto", value: "crypto" },
            { label: "Options", value: "options" },
            { label: "Futures", value: "futures" },
            { label: "Multiple", value: "multiple" },
        ],
    },
    {
        id: 5,
        question: "When do you usually trade?",
        type: 'single',
        options: [
            { label: "Morning (before open)", value: "pre" },
            { label: "During market hours", value: "session" },
            { label: "Evening/night", value: "post" },
            { label: "Whenever I see an opportunity", value: "all" },
        ],
    },
    {
        id: 6,
        question: "How many rules per session?",
        type: 'single',
        options: [
            { label: "1-3 rules (keep it simple)", value: "simple" },
            { label: "4-6 rules", value: "medium" },
            { label: "7+ rules", value: "complex" },
        ],
    },
];

export default function OnboardingPage() {
    const { user } = useRuleSci();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingText, setLoadingText] = useState("Analyzing your trading style...");
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && user) {
            router.push('/dashboard');
        }
    }, [isHydrated, user, router]);

    const progress = ((currentStep + 1) / (steps.length + 1)) * 100;

    useEffect(() => {
        if (isProcessing) {
            const texts = [
                "Analyzing your trading style...",
                "Creating your personalized rules...",
                "Setting up your dashboard...",
            ];
            let i = 0;
            const interval = setInterval(() => {
                i++;
                if (i < texts.length) {
                    setLoadingText(texts[i]);
                } else {
                    clearInterval(interval);
                    router.push('/pricing');
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isProcessing, router]);

    const handleSelect = (value: string) => {
        const step = steps[currentStep];
        if (step.type === 'single') {
            setAnswers({ ...answers, [step.id]: value });
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                setIsProcessing(true);
            }
        } else {
            const current = (answers[step.id] as string[]) || [];
            if (current.includes(value)) {
                setAnswers({ ...answers, [step.id]: current.filter((v) => v !== value) });
            } else {
                setAnswers({ ...answers, [step.id]: [...current, value] });
            }
        }
    };

    const handleContinue = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsProcessing(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            router.push('/');
        }
    };

    if (!isHydrated || user) {
        return <div className="min-h-screen" />; // Wait to route
    }

    if (isProcessing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Building your trading discipline plan...</h2>
                <div className="w-full max-w-[300px] h-1.5 bg-[#1a1a2e]/5 rounded-full overflow-hidden mb-6">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3 }}
                        className="h-full bg-[#2563eb]"
                    />
                </div>
                <p className="text-[#6b7280] font-medium animate-pulse">{loadingText}</p>
            </div>
        );
    }

    const step = steps[currentStep];

    return (
        <div className="min-h-screen flex flex-col pt-12">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1.5 bg-[#1a1a2e]/5">
                <motion.div
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#2563eb]"
                />
            </div>

            <div className="max-w-[480px] mx-auto w-full px-6 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-center mb-12">
                    <button onClick={handleBack} className="p-2 -ml-2 text-[#1a1a2e] hover:opacity-60 transition-opacity">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex flex-col flex-1"
                    >
                        <h2 className="text-[28px] font-bold text-[#1a1a2e] text-center leading-tight mb-12">
                            {step.question}
                        </h2>

                        <div className="flex flex-col gap-4">
                            {step.options.map((option) => {
                                const isSelected = step.type === 'single'
                                    ? answers[step.id] === option.value
                                    : ((answers[step.id] as string[]) || []).includes(option.value);

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`w-full h-16 rounded-full flex items-center justify-center px-8 text-base font-bold transition-all duration-200 ${isSelected
                                                ? 'bg-[#1a1a2e] text-white shadow-lg'
                                                : 'bg-white text-[#1a1a2e] border-2 border-[#1a1a2e]/5 hover:border-[#1a1a2e]/20 shadow-sm'
                                            }`}
                                    >
                                        {option.label}
                                        {step.type === 'multi' && isSelected && (
                                            <div className="ml-auto w-5 h-5 bg-[#2563eb] rounded-full flex items-center justify-center">
                                                <Check size={12} strokeWidth={4} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {step.type === 'multi' && (
                            <div className="mt-12">
                                <button
                                    onClick={handleContinue}
                                    disabled={!answers[step.id] || (answers[step.id] as string[]).length === 0}
                                    className="w-full h-14 bg-[#1a1a2e] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-30 disabled:translate-y-0"
                                >
                                    Continue
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
