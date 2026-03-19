'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { motion } from 'framer-motion';
import { Target, Camera, Target as TargetIcon, Zap } from 'lucide-react';

export default function LandingPage() {
    const { user } = useRuleSci();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && user) {
            router.push('/today');
        }
    }, [isHydrated, user, router]);

    if (!isHydrated || user) {
        return <div className="min-h-[100dvh] bg-white" />;
    }

    const featureCards = [
        { 
            icon: <Camera className="text-blue-600" size={24} />, 
            title: "Scan Your Diary", 
            text: "Photo of your notebook → instant digital journal" 
        },
        { 
            icon: <TargetIcon className="text-orange-600" size={24} />, 
            title: "Daily Rule Score", 
            text: "Track rules followed. Get graded A to D." 
        },
        { 
            icon: <Zap className="text-purple-600" size={24} />, 
            title: "Streak Tracking", 
            text: "Build consistency. See your discipline calendar." 
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col selection:bg-orange-100 italic-none">
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 h-[56px] z-[100] backdrop-blur-xl bg-white/80 border-b border-gray-100 flex items-center justify-between"
                style={{
                    paddingLeft: 'max(env(safe-area-inset-left), 20px)',
                    paddingRight: 'max(env(safe-area-inset-right), 20px)',
                }}
            >
                <div className="flex items-center gap-2">
                    <Target className="text-[#1a1a2e]" size={24} strokeWidth={2.5} />
                    <span className="text-[19px] font-black tracking-tight text-[#1a1a2e]">RuleSci</span>
                </div>
                <Link 
                    href="/login" 
                    className="text-sm font-bold text-[#1a1a2e] active:scale-[0.97] transition-transform touch-manipulation"
                >
                    Log In
                </Link>
            </nav>

            <main className="flex-1 flex flex-col pt-[56px] pb-12 px-6">
                {/* HERO SECTION */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex flex-col items-center text-center pt-12 md:pt-20 mb-16"
                >
                    <motion.span variants={itemVariants} className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-4 block">
                        Trading Discipline Tracker
                    </motion.span>
                    
                    <motion.h1 variants={itemVariants} className="text-[32px] md:text-[56px] font-black leading-[1.15] text-[#1a1a2e] mb-6 max-w-[320px] md:max-w-none">
                        Build Trading <br/> Discipline.
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-[15px] font-medium leading-relaxed text-gray-500 mb-10 max-w-[300px] mx-auto">
                        Track your rules. Score your discipline. Improve every session.
                    </motion.p>

                    <motion.div variants={itemVariants} className="w-full sm:w-auto flex flex-col items-center">
                        <Link
                            href="/onboarding"
                            className="bg-[#1a1a2e] text-white text-[15px] font-bold h-[52px] rounded-full w-full sm:w-auto sm:min-w-[280px] sm:px-12 flex items-center justify-center active:scale-[0.97] transition-transform touch-manipulation shadow-xl shadow-gray-200"
                        >
                            Start Free — 3 Day Trial
                        </Link>
                        <span className="mt-3 text-[11px] font-semibold text-gray-400">No credit card required</span>
                    </motion.div>

                    {/* SOCIAL PROOF */}
                    <motion.div variants={itemVariants} className="mt-12 flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-100 flex-shrink-0 overflow-hidden shadow-sm">
                                    <img 
                                        src={`https://i.pravatar.cc/100?u=${i + 10}`} 
                                        alt="Trader" 
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>
                            ))}
                        </div>
                        <span className="text-[13px] font-bold text-gray-400">2,100+ traders building discipline</span>
                    </motion.div>
                </motion.div>

                {/* FEATURE CARDS */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex flex-col gap-3 max-w-[400px] mx-auto w-full"
                >
                    {featureCards.map((card, i) => (
                        <motion.div 
                            key={i}
                            variants={itemVariants}
                            className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-start gap-4 active:scale-[0.98] transition-transform touch-manipulation"
                        >
                            <div className="w-12 h-12 rounded-[16px] bg-gray-50 flex items-center justify-center flex-shrink-0">
                                {card.icon}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[15px] font-black text-[#1a1a2e] mb-0.5">{card.title}</h3>
                                <p className="text-[13px] font-semibold text-gray-500 leading-snug">{card.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </main>

            {/* FOOTER */}
            <footer className="py-12 mt-auto flex flex-col items-center gap-4"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
            >
                <div className="flex items-center gap-6 text-[11px] font-black text-gray-300 uppercase tracking-widest">
                    <Link href="/terms" className="active:opacity-60 transition-opacity">Terms</Link>
                    <span className="opacity-30">·</span>
                    <Link href="/privacy" className="active:opacity-60 transition-opacity">Privacy</Link>
                    <span className="opacity-30">·</span>
                    <Link href="/contact" className="active:opacity-60 transition-opacity">Contact</Link>
                </div>
            </footer>
        </div>
    );
}
