'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, ArrowLeft, Target } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center px-6">
            <Link 
                href="/" 
                className="absolute top-8 left-6 flex items-center gap-1.5 text-[14px] font-black text-gray-300 active:opacity-60 transition-opacity"
            >
                <ArrowLeft size={16} strokeWidth={3} />
                Back
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] flex flex-col items-center text-center"
            >
                <div className="w-16 h-16 bg-[#1a1a2e] text-white rounded-[24px] flex items-center justify-center shadow-2xl mb-8">
                    <Mail size={32} strokeWidth={2.5} />
                </div>
                
                <h1 className="text-[32px] font-black text-[#1a1a2e] mb-4 tracking-tight">Get in Touch.</h1>
                <p className="text-[16px] font-medium text-gray-500 mb-12">
                    Questions about your trading architecture? Our team is here to help.
                </p>

                <div className="w-full flex flex-col gap-4">
                    <a 
                        href="mailto:support@rulesci.app" 
                        className="w-full h-[72px] bg-gray-50 rounded-[28px] border border-gray-100 flex items-center px-6 gap-4 hover:bg-gray-100 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1a1a2e] shadow-sm group-hover:scale-110 transition-transform">
                            <Mail size={20} strokeWidth={3} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[15px] font-black text-[#1a1a2e]">Email Support</span>
                            <span className="text-[12px] font-bold text-gray-400">support@rulesci.app</span>
                        </div>
                    </a>

                    <button 
                        className="w-full h-[72px] bg-gray-50 rounded-[28px] border border-gray-100 flex items-center px-6 gap-4 hover:bg-gray-100 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1a1a2e] shadow-sm group-hover:scale-110 transition-transform">
                            <MessageSquare size={20} strokeWidth={3} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[15px] font-black text-[#1a1a2e]">Community Discord</span>
                            <span className="text-[12px] font-bold text-gray-400">Join the elite architects</span>
                        </div>
                    </button>
                </div>

                <div className="mt-16 flex items-center gap-2">
                    <Target className="text-gray-200" size={20} strokeWidth={3} />
                    <span className="text-[11px] font-black text-gray-200 uppercase tracking-[0.2em]">RuleSci Network v1.1</span>
                </div>
            </motion.div>
        </div>
    );
}
