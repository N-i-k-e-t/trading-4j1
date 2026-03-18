'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const tourSteps = [
    {
        heading: "Create Your Trading Rules",
        body: "Add the rules you want to follow. We have 50+ ready-made rules or create your own.",
        image: "https://images.unsplash.com/photo-1611974717482-58a05a74bf4f?auto=format&fit=crop&q=80&w=600",
    },
    {
        heading: "Check Off Rules Daily",
        body: "Before each session, review your rules. After trading, mark which ones you followed.",
        image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=600",
    },
    {
        heading: "Watch Your Discipline Grow",
        body: "Track your streaks, see your compliance, and discover patterns in your behavior.",
        image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=600",
    },
];

export default function WelcomeTour() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.push('/dashboard');
        }
    };

    const step = tourSteps[currentStep];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="flex flex-col items-center text-center max-w-[400px] w-full"
                >
                    <div className="w-full aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl mb-12">
                        <img src={step.image} className="w-full h-full object-cover" alt={step.heading} />
                    </div>

                    <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">
                        {step.heading}
                    </h1>
                    <p className="text-lg text-[#6b7280] mb-12 leading-relaxed">
                        {step.body}
                    </p>

                    <button
                        onClick={handleNext}
                        className="w-full h-16 bg-[#1a1a2e] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all"
                    >
                        {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
                    </button>

                    {/* Step Indicators */}
                    <div className="flex gap-2 mt-8">
                        {tourSteps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-[#2563eb]' : 'w-2 bg-[#1a1a2e]/10'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
