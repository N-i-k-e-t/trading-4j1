'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { motion } from 'framer-motion';
import { Shield, Target, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Visual Collage Rule Card Component
function RuleCard({
    title,
    emoji,
    image,
    rotation = 0,
    delay = 0
}: {
    title: string;
    emoji: string;
    image: string;
    rotation?: number;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, rotate: rotation - 5 }}
            animate={{ opacity: 1, y: 0, rotate: rotation }}
            transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-[160px] h-[200px] rounded-[16px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] group flex-shrink-0"
        >
            <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full py-2 px-3 flex items-center gap-2 shadow-sm">
                <span className="text-sm">{emoji}</span>
                <span className="text-[11px] font-semibold text-[#1a1a2e] whitespace-nowrap overflow-hidden text-ellipsis">{title}</span>
                <div className="ml-auto w-3.5 h-3.5 rounded-full border border-[#1a1a2e]/10 flex-shrink-0" />
            </div>
        </motion.div>
    );
}

export default function LandingPage() {
    const { user } = useRuleSci();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && user) {
            router.push('/dashboard');
        }
    }, [isHydrated, user, router]);

    const rulesRow1 = [
        { title: "No revenge trading", emoji: "📉", image: "https://images.unsplash.com/photo-1611974717482-58a05a74bf4f?auto=format&fit=crop&q=80&w=400" },
        { title: "Follow the setup", emoji: "🎯", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400" },
        { title: "Max 3 trades", emoji: "🛡️", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400" },
        { title: "Journal every trade", emoji: "📓", image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=400" },
    ];

    const rulesRow2 = [
        { title: "Wait for confirmation", emoji: "⏳", image: "https://images.unsplash.com/photo-1507679799987-c7377ec486b6?auto=format&fit=crop&q=80&w=400" },
        { title: "Set stop loss", emoji: "🛑", image: "https://images.unsplash.com/photo-1518458028434-518823906660?auto=format&fit=crop&q=80&w=400" },
        { title: "No FOMO entries", emoji: "🧠", image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=400" },
        { title: "Review weekly", emoji: "📊", image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=400" },
    ];

    if (!isHydrated || user) {
        return <div className="min-h-screen bg-transparent" />; // Wait to route
    }

    return (
        <div className="min-h-screen flex flex-col pt-20">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between h-16 md:h-20 bg-transparent transition-all"
                style={{
                    paddingLeft: 'max(env(safe-area-inset-left, 0px), 20px)',
                    paddingRight: 'max(env(safe-area-inset-right, 0px), 20px)',
                }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#f59e0b]/10 text-[#f59e0b] rounded-full flex items-center justify-center shadow-sm">
                        <Target size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#1a1a2e]">RuleSci</span>
                </div>

                <div className="flex items-center gap-8">
                    <Link href="/login" className="text-[15px] font-semibold text-[#1a1a2e] hover:opacity-70 transition-opacity">
                        Log In
                    </Link>
                    <Link
                        href="/onboarding"
                        className="px-6 py-2.5 rounded-full border-2 border-[#1a1a2e] text-[15px] font-bold text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-all duration-300"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col md:flex-row items-center max-w-7xl mx-auto w-full px-6 md:px-12 gap-12 md:gap-0">
                {/* Left Side: Content */}
                <div className="flex-1 max-w-[540px] z-10 text-center md:text-left pt-12 md:pt-0">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-[36px] md:text-[64px] leading-[1.1] font-bold text-[#1a1a2e] mb-4"
                    >
                        Build Trading <br />
                        <span className="text-[#2563eb]">Discipline.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-[18px] text-[#6b7280] mb-10 max-w-[420px] mx-auto md:mx-0"
                    >
                        Track your rules. Follow your system. Trade with confidence.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link
                            href="/onboarding"
                            className="flex items-center justify-center bg-[#1a1a2e] text-white text-[15px] font-bold h-[52px] rounded-full w-full sm:w-auto sm:min-w-[220px] sm:px-10 active:scale-[0.98] transition-transform shadow-lg hover:shadow-xl"
                        >
                            Start Now — Free
                        </Link>
                    </motion.div>
                </div>

                {/* Right Side: Visual Collage */}
                <div className="flex-1 relative w-full h-auto overflow-visible pointer-events-none md:pointer-events-auto">
                    {/* Mobile rows stack */}
                    <div className="md:hidden flex flex-col gap-3 pb-4 overflow-hidden pointer-events-none select-none w-full">
                        <div className="flex gap-4">
                            {rulesRow1.map((rule, i) => (
                                <RuleCard key={`mob1-${i}`} {...rule} rotation={[2, -3, 3, -2][i]} delay={0.2} />
                            ))}
                        </div>
                        <div className="flex gap-4 -ml-16">
                            {rulesRow2.map((rule, i) => (
                                <RuleCard key={`mob2-${i}`} {...rule} rotation={[-3, 2, -2, 3][i]} delay={0.4} />
                            ))}
                        </div>
                    </div>
                
                    <div className="hidden md:flex md:absolute md:top-1/2 md:-translate-y-1/2 md:right-0 w-full flex-col gap-4 items-center">
                        {/* Row 1 */}
                        <div className="flex gap-4 md:translate-x-[40px]">
                            {rulesRow1.map((rule, i) => (
                                <RuleCard
                                    key={i}
                                    {...rule}
                                    rotation={[2, -3, 3, -2][i]}
                                    delay={0.6 + (i * 0.1)}
                                />
                            ))}
                        </div>
                        {/* Row 2 */}
                        <div className="flex gap-4 md:-translate-x-[40px]">
                            {rulesRow2.map((rule, i) => (
                                <RuleCard
                                    key={i}
                                    {...rule}
                                    rotation={[-3, 2, -2, 3][i]}
                                    delay={1 + (i * 0.1)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full pb-12 mt-20">
                <div className="flex flex-wrap justify-center gap-6 text-[14px] text-[#9ca3af]">
                    <Link href="/terms" className="hover:text-[#6b7280] transition-colors">Terms and Conditions</Link>
                    <span className="opacity-30">·</span>
                    <Link href="/privacy" className="hover:text-[#6b7280] transition-colors">Privacy Policy</Link>
                    <span className="opacity-30">·</span>
                    <Link href="/contact" className="hover:text-[#6b7280] transition-colors">Contact Us</Link>
                </div>
            </footer>
        </div>
    );
}
