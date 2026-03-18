'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import BottomTabs from './BottomTabs';
import { useRuleSci } from '@/lib/context';
import LabMode from './LabMode';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { labMode, user } = useRuleSci();
    const router = useRouter();

    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const [daysLeft, setDaysLeft] = useState(3);

    useEffect(() => {
        if (!user) return; // Wait for hydrate
        if (user.isPro) return;

        if (user.trialStartDate) {
            const start = new Date(user.trialStartDate).getTime();
            const now = new Date().getTime();
            const elapsedHours = (now - start) / (1000 * 60 * 60);

            if (elapsedHours > 72) {
                setIsTrialExpired(true);
            } else {
                setDaysLeft(Math.max(1, Math.ceil((72 - elapsedHours) / 24)));
            }
        }
    }, [user]);

    if (isTrialExpired) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8f9fa] text-center">
                <div className="max-w-[400px] w-full bg-white p-8 rounded-[24px] shadow-xl">
                    <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Trial Expired</h2>
                    <p className="text-[#6b7280] mb-8">Your 3-day free trial has ended. Upgrade to RuleSci Pro to continue executing with discipline.</p>
                    <button 
                        onClick={() => router.push('/pricing')}
                        className="w-full h-14 bg-[#1a1a2e] text-white font-bold rounded-full shadow-lg"
                    >
                        View Pricing Plans
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main
                className={`flex-1 flex flex-col pt-6 pb-[100px] md:pb-20 md:ml-[240px] px-6 transition-all duration-300 ${labMode ? 'focus-mode' : ''
                    }`}
            >
                <div className="max-w-[480px] md:max-w-[800px] mx-auto w-full">
                    {!user?.isPro && user?.trialStartDate && !labMode && (
                        <div className="mb-6 p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#1a1a2e] rounded-2xl flex items-center justify-between shadow-sm">
                            <span className="text-sm font-semibold">
                                <span className="font-bold text-[#f59e0b]">Trial Active </span>
                                — {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                            </span>
                            <button 
                                onClick={() => router.push('/pricing')}
                                className="text-xs font-bold px-3 py-1.5 bg-[#f59e0b] text-white rounded-full leading-none shadow-sm hover:translate-y-[-1px] transition-transform"
                            >
                                Upgrade
                            </button>
                        </div>
                    )}
                    {children}
                </div>
            </main>

            {!labMode && <BottomTabs />}
            {labMode && <LabMode />}

            {/* Legal Footer - Only on desktop or hidden in app? The prompt says centered centered centered. */}
            {/* We'll keep it simple for now as per the prompt's focus on the 5 tabs. */}
        </div>
    );
}
