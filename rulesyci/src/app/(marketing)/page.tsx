'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Target, 
    Camera, 
    Zap, 
    CheckCircle2, 
    ChevronRight, 
    ShieldCheck, 
    BrainCircuit, 
    BarChart3, 
    ArrowRight, 
    Star, 
    UserCircle,
    HelpCircle,
    Plus,
    Minus,
    MessageSquare,
    Play
} from 'lucide-react';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            duration: 0.6, 
            ease: "easeOut" as const
        } 
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export default function LandingPage() {
    const { user } = useRuleSci();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && user) {
            router.push('/today');
        }
    }, [isHydrated, user, router]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const next = prev > 0 ? prev - 1 : 600; // Reset if reaches zero
                localStorage.setItem('rulesci_pricing_timer', next.toString());
                return next;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    if (!isHydrated || user) {
        return <div className="min-h-[100dvh] bg-white text-[#1a1a2e]" />;
    }

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col selection:bg-blue-100 italic-none text-[#1a1a2e] overflow-x-hidden">
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 h-[64px] z-[1000] backdrop-blur-xl bg-white/80 border-b border-gray-100/50 flex items-center justify-between"
                style={{
                    paddingLeft: 'max(env(safe-area-inset-left), 24px)',
                    paddingRight: 'max(env(safe-area-inset-right), 24px)',
                }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#1a1a2e] text-white rounded-lg flex items-center justify-center shadow-lg">
                        <Target size={18} strokeWidth={3} />
                    </div>
                    <span className="text-[20px] font-black tracking-tight text-[#1a1a2e]">RuleSci</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/pricing" className="hidden sm:block text-[13px] font-black uppercase tracking-widest text-gray-400 hover:text-[#1a1a2e] transition-colors">Pricing</Link>
                    <Link 
                        href="/login" 
                        className="text-[14px] font-bold text-[#1a1a2e] bg-gray-50 px-5 py-2 rounded-full border border-gray-100 active:scale-95 transition-all shadow-sm"
                    >
                        Log In
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col pt-[64px]">
                {/* HERO SECTION */}
                <section className="relative pt-16 md:pt-24 pb-20 px-6 overflow-hidden">
                    {/* ACCENT BACKGROUNDS */}
                    <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-50/40 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-[5%] -left-[10%] w-[40%] h-[40%] bg-orange-50/40 blur-[120px] rounded-full pointer-events-none" />

                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="flex flex-col items-center text-center max-w-5xl mx-auto relative z-10"
                    >
                        <motion.h1 variants={itemVariants} className="text-[42px] leading-[1.05] sm:text-[68px] md:text-[84px] font-black text-[#1a1a2e] mb-8 tracking-tighter">
                            Stop losing money to <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">broken rules.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-[17px] sm:text-[20px] font-bold leading-relaxed text-gray-400 mb-12 max-w-[580px] mx-auto px-4">
                            Log trades, digitize your physical journals, and let AI score your discipline. No more revenge trades. Just pure execution.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-6">
                            <Link
                                href="/signup"
                                className="bg-[#1a1a2e] text-white text-[16px] font-black h-[60px] rounded-full w-full sm:min-w-[320px] flex items-center justify-center active:scale-[0.97] transition-all touch-manipulation shadow-[0_20px_40px_rgba(26,26,46,0.15)] group"
                            >
                                Start Free — 3 Day Trial
                                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-1 text-[#eab308]">
                                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-current" />)}
                                <span className="ml-2 text-[12px] font-black text-[#1a1a2e] uppercase tracking-widest">Rated 4.9/5 by 2,100+ Traders</span>
                            </div>
                            <div className="flex -space-x-3 mb-2">
                                {[1,2,3,4,5,6].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 flex-shrink-0 overflow-hidden shadow-sm">
                                        <img 
                                            src={`https://i.pravatar.cc/100?u=${i + 60}`} 
                                            alt="Trader" 
                                            className="w-full h-full object-cover grayscale"
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* PRODUCT PREVIEW MOCKUP */}
                        <motion.div 
                            variants={itemVariants} 
                            className="mt-20 relative w-full max-w-[800px] aspect-[16/10] bg-gray-50 rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden group rotate-1 hover:rotate-0 transition-transform duration-700 p-2 sm:p-4"
                        >
                            <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative shadow-inner">
                                <img 
                                    src="/mockup-hero.png" 
                                    alt="RuleSci Dashboard Mockup" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-20 h-20 bg-white/90 backdrop-blur-md text-[#1a1a2e] rounded-full flex items-center justify-center shadow-2xl cursor-pointer active:scale-90 transition-transform">
                                        <Play size={32} className="fill-current" />
                                    </div>
                                </div>
                            </div>
                            {/* FLOATING BADGE */}
                            <div className="absolute -bottom-6 -right-6 md:-right-12 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-50 max-w-[200px] hidden sm:block">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Discipline Score</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[32px] font-black text-green-500 leading-none tracking-tight">94.2</span>
                                    <span className="text-green-500/50 font-black">%</span>
                                </div>
                                <p className="text-[11px] font-bold text-gray-400 mt-2 uppercase tracking-wider">Top 5% Tier 1 Traders</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* LOGO BAR */}
                <section className="py-12 bg-gray-50/50 border-y border-gray-100/50">
                    <div className="max-w-6xl mx-auto px-6 overflow-hidden">
                        <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] text-center mb-10">Trusted by Traders from Elite Prop Firms</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale saturate-0">
                            {[
                                { n: "FTMO", i: <ShieldCheck size={28} /> },
                                { n: "Topstep", i: <BarChart3 size={28} /> },
                                { n: "FundingPips", i: <Target size={28} /> },
                                { n: "The5%ers", i: <Star size={28} /> },
                                { n: "Elite Funded", i: <Zap size={28} /> }
                            ].map((firm, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {firm.i}
                                    <span className="text-[22px] font-black tracking-tighter">{firm.n}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS SECTION */}
                <section className="py-24 px-6 bg-white overflow-hidden">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-[13px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">The Protocol</h2>
                            <h3 className="text-[38px] md:text-[52px] font-black tracking-tighter leading-none mb-6">Build a Habit of Hard Discipline.</h3>
                            <p className="text-[18px] font-bold text-gray-400 uppercase tracking-widest max-w-[500px] mx-auto text-[14px]">Simple. Scalable. Scientific.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            {/* CONNECTING LINES - DESKTOP */}
                            <div className="absolute top-1/2 left-[30%] right-[30%] h-0.5 bg-gray-50 hidden md:block" />

                            {[
                                { 
                                    step: "01", 
                                    title: "Set Your Rules", 
                                    desc: "Define your 'Trading Plan' or scan your physical journal pages and let our AI extract your rules instantly.", 
                                    icon: <ShieldCheck size={28} /> 
                                },
                                { 
                                    step: "02", 
                                    title: "Log Daily Execution", 
                                    desc: "Logging a trade takes only 3 taps. Mark your wins and whether you stuck to your rules or crumbled.", 
                                    icon: <BarChart3 size={28} /> 
                                },
                                { 
                                    step: "03", 
                                    title: "Achieve AI Analysis", 
                                    desc: "RuleSci AI grades your discipline score and identifies performance-killing patterns you don't even see.", 
                                    icon: <BrainCircuit size={28} /> 
                                }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="flex flex-col items-center text-center relative z-10"
                                >
                                    <div className="w-20 h-20 bg-[#1a1a2e] text-white rounded-[24px] flex items-center justify-center mb-8 shadow-2xl group transition-transform hover:rotate-6">
                                        {item.icon}
                                    </div>
                                    <span className="text-[56px] font-black text-gray-50 absolute -top-10 -left-4 md:-top-16 opacity-50 z-0 select-none">
                                        {item.step}
                                    </span>
                                    <h4 className="text-[22px] font-black mb-4 relative z-10">{item.title}</h4>
                                    <p className="text-[15px] font-semibold text-gray-400 leading-relaxed max-w-[280px]">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* THE PROBLEM SECTION */}
                <section className="py-24 bg-[#1a1a2e] text-white overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:32px_32px]" />
                    </div>
                    
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h3 className="text-[36px] md:text-[56px] font-black tracking-tighter leading-none mb-10" style={{ color: 'white' }}>
                            92% of traders fail. Not for bad strategy — but for <span className="text-red-500">broken discipline.</span>
                        </h3>
                        <p className="text-[18px] md:text-[22px] font-medium text-white/60 leading-relaxed mb-12">
                            A spreadsheet can't stop a revenge trade. A notebook can't grade your emotional state. RuleSci calculates the exact <span className="text-white">cost of your indiscipline</span> and builds a habit of compliance.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                            {[
                                "Emotional classification for every trade",
                                "Revenue leakage calculations",
                                "Rule-based 'Hard Stop' alerts",
                                "Historical compliance audits"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                                    <span className="text-[15px] font-bold text-white/80">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FEATURE GRID SECTION */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 px-1">
                            <div>
                                <h2 className="text-[13px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Core Tech</h2>
                                <h3 className="text-[42px] font-black tracking-tighter leading-tight">Engineered for <br/> Elite Compliance.</h3>
                            </div>
                            <p className="text-gray-400 text-[15px] font-bold md:max-w-[300px] mt-6 md:mt-0 leading-relaxed">Everything you need to treat trading like a high-performance business.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { 
                                    title: "Diary Scanner (OCR)", 
                                    desc: "Take a photo of your trading journal. Our AI extracts market sentiments & rules instantly.",
                                    icon: <Camera />,
                                    color: "bg-blue-50 text-blue-600"
                                },
                                { 
                                    title: "AI Pattern Discovery", 
                                    desc: "Identifies whether you perform better under pressure or when market conditions are calm.",
                                    icon: <BrainCircuit />,
                                    color: "bg-purple-50 text-purple-600"
                                },
                                { 
                                    title: "Daily Rule Score", 
                                    desc: "Quantify your discipline level every session. Turn subjectivity into objective data.",
                                    icon: <BarChart3 />,
                                    color: "bg-green-50 text-green-600"
                                },
                                { 
                                    title: "Capital Scaling Tracker", 
                                    desc: "Automatically approves position size increases based on your compliance habit streaks.",
                                    icon: <Zap />,
                                    color: "bg-orange-50 text-orange-600"
                                },
                                { 
                                    title: "Indiscipline Cost Counter", 
                                    desc: "Calculates exactly how much money you’ve lost to impulsive, off-plan trading decisions.",
                                    icon: <ShieldCheck />,
                                    color: "bg-red-50 text-red-600"
                                },
                                { 
                                    title: "Mental State Logging", 
                                    desc: "Correlation analysis between your mood and your adherence to rule parameters.",
                                    icon: <BrainCircuit />,
                                    color: "bg-cyan-50 text-cyan-600"
                                }
                            ].map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className={`w-14 h-14 ${feature.color} rounded-[20px] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-[20px] font-black text-[#1a1a2e] mb-3">{feature.title}</h4>
                                    <p className="text-gray-400 text-[14px] font-semibold leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS SECTION */}
                <section className="py-24 px-6 bg-gray-50/50 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-[13px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Social Proof</h2>
                            <h3 className="text-[38px] font-black tracking-tighter">Verified Trader Results.</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Rahul M.",
                                    role: "Bank Nifty Options Trader",
                                    quote: "I used to overtrade every Thursday. RuleSci showed me I was losing 1.2L a month to greed alone. Fixed it in two weeks.",
                                    grade: "B → A+"
                                },
                                {
                                    name: "Sarah Chen",
                                    role: "Funded FX Trader",
                                    quote: "The Rule Scanner is a game changer. I still journal by hand but now I have a digital compliance audit for my prop firm.",
                                    grade: "C+ → A"
                                },
                                {
                                    name: "James Wilson",
                                    role: "Crypto Scalper",
                                    quote: "Finally a tool that focuses on ME instead of just my entries. My streak is at 24 days and my account is at ATH.",
                                    grade: "D → B+"
                                }
                            ].map((testi, i) => (
                                <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <MessageSquare size={100} />
                                    </div>
                                    <div className="flex items-center gap-1 text-[#eab308] mb-6">
                                        {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-current" />)}
                                    </div>
                                    <p className="text-[16px] font-bold text-gray-500 leading-relaxed mb-8 italic">
                                        &ldquo;{testi.quote}&rdquo;
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                <img src={`https://i.pravatar.cc/100?u=${i + 15}`} alt={testi.name} />
                                            </div>
                                            <div>
                                                <h5 className="text-[15px] font-black text-[#1a1a2e] leading-none mb-1">{testi.name}</h5>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{testi.role}</p>
                                            </div>
                                        </div>
                                        <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-xl border border-green-100">
                                            <span className="text-[11px] font-black">{testi.grade} Score</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PERSONA / WHO IS THIS FOR SECTION */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-[13px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Target Personas</h2>
                            <h3 className="text-[42px] font-black tracking-tighter">Who is this optimized for?</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: "The Revenge Trader",
                                    desc: "You have a solid strategy, but one loss sends you into a revenge trade cycle. RuleSci's 'Hard Stop' protocol prevents the second impulsive entry.",
                                    icon: <Zap />
                                },
                                {
                                    title: "The Strategy Jumper",
                                    desc: "You change strategies every week because of boredom. We track your compliance to one strategy and only authorize changes if you hit consistency targets.",
                                    icon: <BrainCircuit />
                                },
                                {
                                    title: "The Beginners",
                                    desc: "You don't know what you're doing wrong. We grade every day, score every rule, and show you exactly where your edge is crumbling.",
                                    icon: <UserCircle />
                                },
                                {
                                    title: "The Professional",
                                    desc: "You trade for a living or a prop firm. You need a digital compliance record that proves you are sticking to your mandates 100% of the time.",
                                    icon: <ShieldCheck />
                                }
                            ].map((p, i) => (
                                <div key={i} className="flex gap-6 p-10 bg-gray-50/50 rounded-[40px] border border-gray-100 group hover:bg-white hover:shadow-2xl transition-all duration-300">
                                    <div className="w-16 h-16 bg-[#1a1a2e] text-white rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-lg group-hover:-rotate-6 transition-transform">
                                        {p.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-[22px] font-black text-[#1a1a2e] mb-3">{p.title}</h4>
                                        <p className="text-gray-400 text-[15px] font-semibold leading-relaxed">{p.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PRICING SECTION */}
                <section className="py-24 px-6 bg-gray-50/50" id="pricing">
                    <div className="max-w-[620px] mx-auto text-center px-4">
                        <div className="mb-16">
                            <h2 className="text-[28px] md:text-[34px] font-black text-[#1a1a2e] mb-4 tracking-tighter">
                                Start Your Trading Discipline Journey!
                            </h2>
                            <p className="text-[17px] font-bold text-gray-400 max-w-[450px] mx-auto opacity-70">
                                Track your rules. Build consistency. Trade with confidence.
                            </p>
                        </div>

                        {/* Plan Cards */}
                        <div className="flex flex-col gap-6 mb-12">
                            {/* Most Popular */}
                            <Link href="/signup" className="group">
                                <motion.div 
                                    whileHover={{ y: -4 }}
                                    className="relative bg-white rounded-[32px] border-2 border-[#1a1a2e] p-8 shadow-2xl text-left overflow-hidden group-hover:shadow-[0_20px_40px_rgba(26,26,46,0.1)] transition-shadow"
                                >
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex flex-col">
                                            <span className="text-[20px] font-black text-[#1a1a2e] tracking-tight">ANNUAL ACCESS</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[14px] font-bold text-gray-300 line-through tracking-tight">₹11,999</span>
                                                <span className="text-[16px] font-black text-green-500 tracking-tight">Save 33%</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[32px] font-black text-[#1a1a2e] leading-none tracking-tighter">₹7,999</span>
                                            <span className="block text-[11px] text-gray-400 font-black uppercase tracking-widest mt-1">Billed Annually</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <p className="text-[11px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                                            <Zap size={10} className="fill-red-500" />
                                            Limited offer: ends in {formatTime(timeLeft)}
                                        </p>
                                        <span className="text-[13px] font-black text-[#1a1a2e]">~₹666/mo</span>
                                    </div>
                                </motion.div>
                            </Link>

                            {/* Monthly Plan */}
                            <Link href="/signup" className="group">
                                <motion.div 
                                    whileHover={{ y: -4 }}
                                    className="bg-white/50 rounded-[32px] border-2 border-gray-100 p-8 shadow-sm text-left transition-all group-hover:border-gray-300 group-hover:bg-white group-hover:shadow-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[20px] font-black text-[#1a1a2e] tracking-tight">MONTHLY PASS</span>
                                            <span className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Full Pro Access</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[32px] font-black text-[#1a1a2e] leading-none tracking-tighter">₹999</span>
                                            <span className="block text-[11px] text-gray-400 font-black uppercase tracking-widest mt-1">per month</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>

                        <div className="px-4">
                            <p className="text-[14px] font-black text-orange-500 mb-6 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                <Star size={14} className="fill-orange-500" />
                                Includes 3-Day Free Trial
                            </p>
                            <Link
                                href="/signup"
                                className="w-full bg-[#1a1a2e] text-white h-[64px] flex items-center justify-center rounded-full text-[16px] font-black shadow-2xl active:scale-[0.97] transition-all mb-6 uppercase tracking-widest"
                            >
                                Start 3-Day Free Trial
                            </Link>
                            <p className="text-[13px] font-bold text-gray-400 mb-2">Cancel anytime.</p>
                            <div className="flex items-center justify-center gap-2 text-[13px] font-black text-[#1a1a2e] uppercase tracking-widest">
                                <ShieldCheck size={16} className="text-green-500" />
                                14-day money-back guarantee!
                            </div>
                        </div>

                        {/* FEATURES AT A GLANCE */}
                        <div className="mt-20 text-left bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
                            <h4 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] mb-8">What's Included in Pro</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                {[
                                    "UNLIMITED Diary Scans (AI-OCR)",
                                    "AI Emotional Pattern Classifier",
                                    "Capital Scaling Authority",
                                    "Zero-Indiscipline Leak Audits",
                                    "Multi-Device Performance Sync",
                                    "Priority AI Habit Coaching"
                                ].map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0" />
                                        <span className="text-[13px] font-bold text-gray-500">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-24 px-6 bg-white overflow-hidden">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-[13px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Concerns</h2>
                            <h3 className="text-[38px] font-black tracking-tighter leading-none mb-6">Frequently Asked Questions.</h3>
                        </div>

                        <div className="flex flex-col gap-4">
                            {[
                                { 
                                    q: "Is my trading data safe?", 
                                    a: "Absolutely. We use 256-bit bank-level encryption. We only store your trade records to provide your performance analytics; we never sell or share your execution data with third parties." 
                                },
                                { 
                                    q: "Do I need to connect my broker account?", 
                                    a: "No. RuleSci is focused on DISCIPLINE, not just bookkeeping. By manually logging (which takes 3 taps), you build self-awareness and accountability that automated trackers cannot provide." 
                                },
                                { 
                                    q: "Can I use it for Crypto, Stocks, or Options?", 
                                    a: "Yes. The RuleSci protocol is asset-agnostic. Whether you trade Bank Nifty options, Bitcoin, or US Tech stocks, you can track your rules and compliance here." 
                                },
                                { 
                                    q: "How does the Rule Scanner work?", 
                                    a: "Just take a photo of your physical notebook. Our proprietary OCR engine reads your handwriting and automatically converts your written rules into digital checklist items." 
                                },
                                { 
                                    q: "What is an 'A-Grade' day?", 
                                    a: "An A-Grade day doesn't necessarily mean you made money. It means you followed 100% of your rules without deviation. In RuleSci, following rules is more important than the P&L." 
                                }
                            ].map((faq, i) => (
                                <div key={i} className="border border-gray-100 rounded-[24px] overflow-hidden">
                                    <button 
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full p-8 text-left flex items-center justify-between group active:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-[17px] font-black text-[#1a1a2e] group-hover:text-blue-600 transition-colors">{faq.q}</span>
                                        <div className={`p-2 rounded-full border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all ${openFaq === i ? 'rotate-180 bg-gray-50' : ''}`}>
                                            <Plus size={16} className={openFaq === i ? 'hidden' : 'block'} />
                                            <Minus size={16} className={openFaq === i ? 'block' : 'hidden'} />
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-8 pb-8 text-[15px] font-semibold text-gray-500 leading-relaxed max-w-[90%]"
                                            >
                                                {faq.a}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* COMPARISON SECTION */}
                <section className="py-24 px-6 bg-gray-50 overflow-hidden">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-[13px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Differentiation</h2>
                            <h3 className="text-[38px] font-black tracking-tighter">Why RuleSci?</h3>
                        </div>

                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="p-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">Capabilities</th>
                                        <th className="p-8 text-[14px] font-black text-[#1a1a2e] text-center bg-blue-50/50">RuleSci</th>
                                        <th className="p-8 text-[14px] font-black text-gray-300 text-center">Spreadsheet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { t: "RuleScanner (AI-OCR)", s: true, o: false },
                                        { t: "Discipline Grading (A-D)", s: true, o: false },
                                        { t: "Manual Accountability Mode", s: true, o: true },
                                        { t: "Automatic Compliance Streak", s: true, o: false },
                                        { t: "Indiscipline Revenue Leak calculation", s: true, o: false },
                                        { t: "AI Habit Coaching", s: true, o: false }
                                    ].map((row, i) => (
                                        <tr key={i} className={i !== 5 ? 'border-b border-gray-50' : ''}>
                                            <td className="p-8 text-[14px] font-black text-[#1a1a2e]">{row.t}</td>
                                            <td className="p-8 text-center bg-blue-50/20">
                                                <div className="inline-flex w-8 h-8 rounded-full bg-blue-500 text-white items-center justify-center">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                            </td>
                                            <td className="p-8 text-center">
                                                {row.o ? (
                                                    <div className="inline-flex w-8 h-8 rounded-full bg-gray-100 text-gray-300 items-center justify-center">
                                                        <CheckCircle2 size={16} />
                                                    </div>
                                                ) : (
                                                    <span className="text-[20px] font-black text-gray-200">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FINAL CTA SECTION */}
                <section className="py-32 px-6 relative overflow-hidden bg-white">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
                    
                    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-10 shadow-inner">
                            <Target size={32} className="text-[#1a1a2e]" />
                        </div>
                        <h3 className="text-[42px] md:text-[68px] font-black tracking-tighter leading-none mb-10">
                            Your next 14 days of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">discipline</span> start now.
                        </h3>
                        <p className="text-[18px] font-bold text-gray-400 mb-12 max-w-[480px]">
                            Join 2,100+ traders who have stopped gambling and started executing like professionals.
                        </p>
                        <Link
                            href="/signup"
                            className="bg-[#1a1a2e] text-white text-[16px] font-black h-[64px] px-12 rounded-full active:scale-[0.97] transition-all shadow-2xl hover:bg-black uppercase tracking-widest"
                        >
                            Build My Discipline Plan
                        </Link>
                        <span className="mt-6 text-[11px] font-black text-gray-300 uppercase tracking-widest leading-none">3-Day Free Pro Access · No Card Required</span>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="py-24 bg-[#1a1a2e] text-white/40 border-t border-white/5 relative z-10 px-8"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}
            >
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-24 mb-24">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-9 h-9 bg-white text-[#1a1a2e] rounded-xl flex items-center justify-center shadow-lg">
                                <Target size={20} strokeWidth={3} />
                            </div>
                            <span className="text-[22px] font-black tracking-tight text-white">RuleSci</span>
                        </div>
                        <p className="text-[14px] font-bold leading-relaxed mb-8 text-white/60">
                            Building the world's most disciplined trading community. No fluff, just pure habit architecture for elite execution.
                        </p>
                        <div className="flex gap-4 text-white">
                            {[
                                { icon: <MessageSquare size={18} />, label: "Twitter" },
                                { icon: <Star size={18} />, label: "LinkedIn" },
                                { icon: <Zap size={18} />, label: "ProductHunt" }
                            ].map((social, i) => (
                                <div 
                                    key={i} 
                                    className="w-11 h-11 bg-white/5 rounded-2xl border border-white/10 hover:bg-white hover:text-[#1a1a2e] hover:border-white transition-all cursor-pointer flex items-center justify-center group shadow-sm active:scale-90"
                                    title={social.label}
                                >
                                    {social.icon}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="md:pl-12">
                        <h5 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-8">Product</h5>
                        <ul className="flex flex-col gap-5 text-[14px] font-bold">
                            <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Security</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Rule Scanner</li>
                            <li className="hover:text-white cursor-pointer transition-colors">AI Coaching</li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-8">Resources</h5>
                        <ul className="flex flex-col gap-5 text-[14px] font-bold">
                            <li className="hover:text-white cursor-pointer transition-colors">Psychology Blog</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Rule Library</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Trader Community</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Contact Support</li>
                        </ul>
                    </div>

                    <div className="bg-white/5 p-8 rounded-[32px] border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck size={80} />
                        </div>
                        <h5 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-6 relative z-10">Newsletter</h5>
                        <p className="text-[13px] font-bold mb-6 italic leading-relaxed text-white/50 relative z-10">
                            Get weekly insights on the psychology of trading excellence. 
                        </p>
                        <form className="relative z-10" onSubmit={(e) => { e.preventDefault(); alert('Subscribed to RuleSci Labs!'); }}>
                            <input 
                                required
                                type="email" 
                                placeholder="Your Email" 
                                className="w-full h-12 bg-white/5 border border-white/20 rounded-xl px-4 text-[13px] font-bold placeholder:text-white/20 focus:outline-none focus:border-white/40 mb-3" 
                            />
                            <button 
                                type="submit"
                                className="w-full h-12 bg-white text-[#1a1a2e] rounded-xl flex items-center justify-center font-black text-[13px] uppercase tracking-widest active:scale-95 transition-all shadow-xl"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] font-black uppercase tracking-[0.2em] border-t border-white/5 pt-12">
                    <div className="flex items-center gap-8">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                    <span className="text-white/20">© 2026 RuleSci. Engineered for Discipline.</span>
                </div>
            </footer>
        </div>
    );
}
