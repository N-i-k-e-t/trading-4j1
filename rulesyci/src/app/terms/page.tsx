'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-[100dvh] bg-white">
            <div className="max-w-[700px] mx-auto px-6 py-12 md:py-24">
                <Link href="/" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#1a1a2e] transition-colors mb-12 font-medium">
                    <ArrowLeft size={20} />
                    Back to RuleSci
                </Link>

                <h1 className="text-[32px] md:text-[48px] font-bold text-[#1a1a2e] mb-6 leading-tight">
                    Terms & Conditions
                </h1>
                
                <div className="text-[#6b7280] flex flex-col gap-6 text-[15px] leading-relaxed">
                    <p>Last updated: October 2023</p>

                    <h2 className="text-xl font-bold text-[#1a1a2e] mt-4">1. Acceptance of Terms</h2>
                    <p>By accessing and using RuleSci ("the Application"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Application's particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

                    <h2 className="text-xl font-bold text-[#1a1a2e] mt-4">2. Financial Disclaimer</h2>
                    <p>RuleSci is a tool designed to help traders track their personal discipline and behavior. <strong>We are not financial advisors.</strong> The App does not provide financial, investment, or trading advice. All trading involves risk, and you are solely responsible for your own trading decisions and outcomes.</p>

                    <h2 className="text-xl font-bold text-[#1a1a2e] mt-4">3. Subscriptions</h2>
                    <p>Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis (such as weekly or annually), depending on the type of Subscription plan you select when purchasing the Subscription.</p>

                    <h2 className="text-xl font-bold text-[#1a1a2e] mt-4">4. User Accounts</h2>
                    <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

                    <p className="mt-8 text-sm opacity-70">
                        This is a placeholder for demonstration purposes. RuleSci is a conceptual application.
                    </p>
                </div>
            </div>
        </div>
    );
}
