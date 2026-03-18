'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PricingPage() {
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-transparent pb-24">
            {/* Sticky Top Bar */}
            <div className="sticky top-0 left-0 right-0 z-[110] bg-white border-b border-[#1a1a2e]/5 px-6 h-20 flex items-center justify-between shadow-sm">
                <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Discount reserved for:</span>
                    <span className="text-xl font-bold text-[#1a1a2e] tabular-nums">{formatTime(timeLeft)}</span>
                </div>
                <Link
                    href="/signup"
                    className="bg-[#1a1a2e] text-white px-8 h-11 flex items-center justify-center rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                    START NOW
                </Link>
            </div>

            <main className="max-w-[620px] mx-auto px-6 pt-12 text-center">
                <h1 className="text-2xl md:text-[28px] font-bold text-[#1a1a2e] mb-2">
                    Start Your Trading Discipline Journey!
                </h1>
                <p className="text-base text-[#6b7280] mb-12">
                    Track your rules. Build consistency. Trade with confidence.
                </p>

                {/* Plan Cards */}
                <div className="flex flex-col gap-4 mb-12">
                    {/* Most Popular */}
                    <Link href="/signup" className="group">
                        <div className="relative bg-white rounded-2xl border-2 border-[#1a1a2e] p-6 shadow-lg text-left overflow-hidden transition-transform group-hover:translate-y-[-2px]">
                            <div className="absolute top-0 left-0 right-0 bg-[#1a1a2e] py-1 text-center">
                                <span className="text-[10px] font-bold text-white uppercase tracking-[0.1em]">MOST POPULAR</span>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-[#1a1a2e]">12-MONTHS</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-[#9ca3af] line-through">$199.99</span>
                                        <span className="text-base font-bold text-[#22c55e]">$59.99</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-[#1a1a2e]">$4.99</span>
                                    <span className="block text-[11px] text-[#6b7280] font-medium uppercase tracking-wider">per month</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-[#1a1a2e]/5">
                                <div className="h-1 bg-[#ef4444]/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#ef4444] animate-[pulse_2s_infinite]" style={{ width: '40%' }} />
                                </div>
                                <p className="text-[11px] font-bold text-[#ef4444] mt-2 uppercase tracking-wide">
                                    Limited offer: ends in {formatTime(timeLeft)}
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Regular Plan */}
                    <Link href="/signup" className="group">
                        <div className="bg-white/50 rounded-2xl border-2 border-[#1a1a2e]/5 p-6 shadow-sm text-left transition-transform group-hover:translate-y-[-2px] group-hover:border-[#1a1a2e]/10">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-[#1a1a2e]">1-WEEK</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-[#9ca3af] line-through">$14.99</span>
                                        <span className="text-base font-bold text-[#6b7280]">$9.99</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-[#1a1a2e]">$1.42</span>
                                    <span className="block text-[11px] text-[#6b7280] font-medium uppercase tracking-wider">per day</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                <p className="text-[14px] font-bold text-[#f59e0b] mb-3 uppercase tracking-wider">
                    🎉 Includes 3-Day Free Trial
                </p>
                <Link
                    href="/signup"
                    className="w-full bg-[#1a1a2e] text-white h-14 flex items-center justify-center rounded-full text-base font-bold shadow-xl hover:translate-y-[-2px] transition-all mb-4"
                >
                    Start 3-Day Free Trial
                </Link>
                <p className="text-[14px] text-[#9ca3af] mb-1">Cancel anytime.</p>
                <div className="flex items-center justify-center gap-2 text-[14px] font-semibold text-[#1a1a2e] mb-20">
                    <ShieldCheck size={16} className="text-[#22c55e]" />
                    14-day money-back guarantee!
                </div>

                {/* Social Proof */}
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-10">Traders love RuleSysci</h2>
                <div className="flex flex-col gap-4 mb-20">
                    {[
                        { name: "Marco S.", rating: 5, text: "The first app that actually made me stick to my stop loss. The interface is calming and the rules library is gold." },
                        { name: "Sarah L.", rating: 5, text: "I've tried every journal out there. RuleSysci is different. It focuses on the behavior, not just the numbers." },
                        { name: "David K.", rating: 5, text: "The onboarding quiz really nailed my struggle with overtrading. Worth every penny." }
                    ].map((review, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-left">
                            <div className="flex gap-1 mb-3">
                                {[...Array(review.rating)].map((_, j) => (
                                    <Star key={j} size={14} fill="#f59e0b" className="text-[#f59e0b]" />
                                ))}
                            </div>
                            <p className="text-[14px] leading-relaxed text-[#6b7280] mb-3">"{review.text}"</p>
                            <p className="text-[14px] font-bold text-[#1a1a2e]">{review.name}</p>
                        </div>
                    ))}
                </div>

                {/* Badges */}
                <div className="flex items-center justify-center gap-4">
                    <div className="bg-[#1a1a2e]/5 p-4 rounded-xl flex flex-col items-center gap-1 min-w-[140px]">
                        <span className="text-xl font-bold text-[#1a1a2e]">4.5</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => <Star key={j} size={10} fill="#1a1a2e" className="text-[#1a1a2e]" />)}
                        </div>
                        <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">App Store</span>
                    </div>
                    <div className="bg-[#1a1a2e]/5 p-4 rounded-xl flex flex-col items-center gap-1 min-w-[140px]">
                        <span className="text-xl font-bold text-[#1a1a2e]">4.1</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => <Star key={j} size={10} fill="#1a1a2e" className="text-[#1a1a2e]" />)}
                        </div>
                        <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Play Store</span>
                    </div>
                </div>
                <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-[0.2em] mt-8">Coming Soon to Devices</p>
            </main>
        </div>
    );
}
