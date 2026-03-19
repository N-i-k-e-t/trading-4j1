'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import BottomTabs from './BottomTabs';
import { useRuleSci } from '@/lib/context';
import LabMode from './LabMode';
import InstallPrompt from './InstallPrompt';
import CaptureHub from './capture/CaptureHub';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { labMode, user, isCheckingAuth } = useRuleSci();
    const router = useRouter();

    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const [daysLeft, setDaysLeft] = useState(3);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Route Protection
    useEffect(() => {
        if (isHydrated && !isCheckingAuth && !user) {
            router.push('/login');
        }
    }, [isHydrated, isCheckingAuth, user, router]);

    useEffect(() => {
        if (!user) return;
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

    // Don't render shell until hydrated and auth checked 
    if (!isHydrated || isCheckingAuth) {
        return <div className="min-h-[100dvh] bg-white flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#1a1a2e] border-t-transparent rounded-full animate-spin" />
        </div>;
    }

    if (!user) {
        return null;
    }

    if (isTrialExpired) {
        return (
            <div className="min-h-[100dvh] flex flex-col items-center justify-center px-5 bg-[#f8f9fa] text-center">
                <div className="w-full max-w-[360px] bg-white p-6 rounded-[24px] shadow-xl">
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
        <div className="flex min-h-[100dvh] bg-white overflow-x-hidden">
            {/* Sidebar — Desktop Only */}
            <Sidebar />
            
            <main
                className={`flex-1 flex flex-col pt-0 md:pt-5 md:ml-[240px] transition-all duration-300 ${labMode ? 'focus-mode' : ''}`}
                style={{
                    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 84px)',
                }}
            >
                <div className="w-full max-w-[430px] mx-auto xl:max-w-none xl:px-8">
                    {!user?.isPro && user?.trialStartDate && !labMode && (
                        <div className="mx-5 md:mx-0 mt-4 mb-4 p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#1a1a2e] rounded-2xl flex items-center justify-between shadow-sm">
                            <span className="text-sm font-semibold">
                                <span className="font-bold text-[#f59e0b]">Trial Active </span>
                                — {daysLeft} days left
                            </span>
                            <button 
                                onClick={() => router.push('/pricing')}
                                className="text-xs font-bold px-3 py-1.5 bg-[#f59e0b] text-white rounded-full"
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
            
            <InstallPrompt />
            <CaptureHub />
        </div>
    );
}
