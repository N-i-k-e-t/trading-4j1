'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[700px] mx-auto px-6 py-12 md:py-24">
                <Link href="/" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#1a1a2e] transition-colors mb-12 font-medium">
                    <ArrowLeft size={20} />
                    Back to RuleSci
                </Link>

                <h1 className="text-[32px] md:text-[48px] font-bold text-[#1a1a2e] mb-6 leading-tight">
                    Privacy Policy
                </h1>
                
                <div className="text-[#6b7280] flex flex-col gap-6 text-[15px] leading-relaxed">
                    <p>Last updated: October 2023</p>

                    <h2 className="text-xl font-bold text-[#1a1a2e] mt-4">1. Data Collection</h2>
                    <p>RuleSci is designed as a privacy-first application. Currently, all your trading data, rules, journal entries, and AI insights are stored entirely <strong>locally on your device</strong> within your browser's local storage.</p>

                    <h2 className="text-xl font-bold text-[#1a1a2e] mt-4">2. Use of Data</h2>
                    <p>Since your data is stored locally, we do not have access to your trading history, rules, or journal entries. The AI agents (Pattern Analyst, Discipline Coach, and Risk Sentinel) run entirely on your client device and do not transmit your data to our servers.</p>

                    <h2 className="text-xl font-bold text-[#1a1a2e] mt-4">3. Analytics and Tracking</h2>
                    <p>We may collect anonymous, aggregated usage data (such as page views or feature usage frequency) to help us improve the RuleSci experience. This data cannot be linked back to your individual account or trading activity.</p>

                    <h2 className="text-xl font-bold text-[#1a1a2e] mt-4">4. Your Rights</h2>
                    <p>You have full control over your data. You can export your data at any time from the Settings page. You can also permanently clear all your data by using the "Log Out" function, which wipes the local storage environment completely.</p>

                    <p className="mt-8 text-sm opacity-70">
                        This is a placeholder for demonstration purposes. RuleSci is a conceptual application.
                    </p>
                </div>
            </div>
        </div>
    );
}
