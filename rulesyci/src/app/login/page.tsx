'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Target, ArrowLeft, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const { login, showToast, setUser, user } = useRuleSci();
    const router = useRouter();
    const supabase = createClient();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    // Handle session auto-redirect
    useEffect(() => {
        if (user) {
            router.replace('/dashboard');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            showToast('Enter email and password', 'info');
            return;
        }

        setIsLoading(true);
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            if (data.user) {
                showToast('Welcome back!', 'success');
                // The context.tsx listener will handle actual state update
                router.push('/dashboard');
            }
        } catch (err: any) {
            showToast(err.message || 'Login failed', 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center px-5 selection:bg-orange-100"
            style={{ 
                paddingTop: 'env(safe-area-inset-top, 24px)', 
                paddingBottom: 'env(safe-area-inset-bottom, 24px)' 
            }}
        >
            {/* BACK LINK */}
            <Link 
                href="/" 
                className="absolute top-8 left-5 flex items-center gap-1.5 text-[14px] font-bold text-gray-400 active:opacity-60 transition-opacity touch-manipulation"
                style={{ top: 'max(env(safe-area-inset-top), 32px)' }}
            >
                <ArrowLeft size={16} strokeWidth={2.5} />
                Back
            </Link>

            <div className="w-full max-w-[380px] flex flex-col pt-12">
                {/* HEADER */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-[#1a1a2e] text-white rounded-[16px] flex items-center justify-center shadow-lg mb-4">
                        <Target size={28} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-[20px] font-black text-[#1a1a2e] mb-1">Welcome back</h1>
                    <p className="text-[14px] font-semibold text-gray-400">Log in to continue your streak</p>
                </div>

                {/* STREAK PREVIEW CARD */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-50/50 border border-orange-100/50 rounded-[20px] p-4 mb-4 flex items-center gap-3"
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-lg">
                        🔥
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-black text-[#1a1a2e]">4-day streak active</span>
                        <span className="text-[11px] font-bold text-orange-600/70 tabular-nums">7/9 rules followed yesterday</span>
                    </div>
                </motion.div>

                {/* LOGIN CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[24px] shadow-sm border border-gray-50 overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-black text-[#1a1a2e] ml-1 uppercase tracking-wider opacity-60">Email Address</label>
                            <input
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="me@example.com"
                                className="w-full h-[50px] bg-gray-50 rounded-xl px-4 text-[16px] font-bold text-[#1a1a2e]"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[12px] font-black text-[#1a1a2e] uppercase tracking-wider opacity-60">Password</label>
                                <button type="button" className="text-[12px] font-bold text-blue-600 active:opacity-50">Forgot?</button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full h-[50px] bg-gray-50 rounded-xl px-4 text-[16px] font-bold text-[#1a1a2e] pr-12"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 h-[50px] w-12 flex items-center justify-center text-gray-400 active:text-[#1a1a2e]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full h-14 bg-[#1a1a2e] text-white font-black rounded-xl shadow-lg shadow-gray-200 active:scale-[0.97] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>Log In <ArrowLeft className="rotate-180" size={18} strokeWidth={3} /></>
                            )}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="px-6 pb-4 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">or skip to</span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* OAUTH */}
                    <div className="px-6 pb-8 flex gap-3">
                        <button className="flex-1 h-14 border border-gray-100 rounded-xl flex items-center justify-center gap-2 text-[14px] font-bold text-[#1a1a2e] active:scale-[0.97]">
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale" alt="G" />
                            Google
                        </button>
                        <button className="flex-1 h-14 border border-gray-100 rounded-xl flex items-center justify-center gap-2 text-[14px] font-bold text-[#1a1a2e] active:scale-[0.97]">
                            <img src="https://github.com/favicon.ico" className="w-4 h-4" alt="A" />
                            Apple
                        </button>
                    </div>
                </motion.div>

                {/* FOOTER */}
                <p className="mt-8 text-center text-[13px] font-bold text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-[#1a1a2e] font-black">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
