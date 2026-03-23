'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Target, ArrowLeft, Loader2, Zap } from 'lucide-react';

export default function LoginPage() {
    const { login, showToast, setUser, user } = useRuleSci();
    const router = useRouter();
    const supabase = createClient();
    
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const [localStats, setLocalStats] = useState<{ streak: number; score: number } | null>(null);
    const isPlaceholderAuth = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-id') || !process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Load local stats if they exist
    useEffect(() => {
        const savedData = localStorage.getItem('rulesci_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const streak = parsed.analytics?.consistencyDays || 0;
                const score = parsed.analytics?.ruleAdherence || 0;
                if (streak > 0 || score > 0) {
                    setLocalStats({ streak, score: Math.round(score) });
                }
            } catch (e) {}
        }
    }, []);

    // Handle session auto-redirect
    useEffect(() => {
        if (user) {
            router.replace('/today');
        }
    }, [user, router]);

    const handleGuestLogin = () => {
        setIsLoading(true);
        // Simulate a real architectural boot
        setTimeout(() => {
            const mockUser = {
                email: 'demo@rulesci.app',
                name: 'Elite Trader',
                isPro: true,
                isAdmin: true,
                trialStartDate: new Date().toISOString()
            };
            setUser(mockUser);
            showToast('Loading your dashboard...', 'success');
            router.replace('/today');
        }, 800);
    };

    const handleSocialLogin = async (provider: 'google' | 'github') => {
        if (isPlaceholderAuth) {
            showToast('Supabase not configured. Using Demo Mode.', 'info');
            handleGuestLogin();
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            showToast(err.message || 'OAuth initialization failed', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isPlaceholderAuth) {
            showToast('Supabase not configured. Using Demo Mode.', 'info');
            handleGuestLogin();
            return;
        }

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
                router.replace('/today');
            }
        } catch (err: any) {
            showToast(err.message || 'Verification failed', 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center px-6 selection:bg-blue-100 relative overflow-hidden"
            style={{ 
                paddingTop: 'env(safe-area-inset-top, 24px)', 
                paddingBottom: 'env(safe-area-inset-bottom, 24px)' 
            }}
        >
            {/* BACKGROUND ACCENT */}
            <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-100/30 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-indigo-100/30 blur-[100px] rounded-full" />

            {/* BACK LINK */}
            <Link 
                href="/" 
                className="absolute top-8 left-6 flex items-center gap-1.5 text-[14px] font-black text-gray-300 active:opacity-60 transition-opacity touch-manipulation z-10"
                style={{ top: 'max(env(safe-area-inset-top), 32px)' }}
            >
                <ArrowLeft size={16} strokeWidth={3} />
                Back
            </Link>

            {isPlaceholderAuth && (
                <div className="absolute top-8 right-6">
                    <div className="px-3 py-1 bg-blue-100 border border-blue-200 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-full">
                        Offline Mode
                    </div>
                </div>
            )}

            <div className="w-full max-w-[400px] flex flex-col pt-12 relative z-10">
                {/* HEADER */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-[#1a1a2e] text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-blue-100/50 mb-8 border border-white/10 group active:scale-90 transition-transform">
                        <Target size={32} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <h1 className="text-[34px] font-black text-[#1a1a2e] mb-1 tracking-tighter leading-none">Welcome Back.</h1>
                    <p className="text-[15px] font-bold text-gray-400 mt-2">Log in to your account.</p>
                </div>

                {/* STREAK PREVIEW CARD */}
                <AnimatePresence>
                    {localStats && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white border border-gray-100 rounded-[32px] p-6 mb-8 flex items-center gap-5 shadow-xl shadow-gray-100/50 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-14 h-14 bg-blue-600 rounded-[20px] flex items-center justify-center shadow-lg text-white text-2xl relative z-10">
                                🔥
                            </div>
                            <div className="flex-1 flex flex-col relative z-10">
                                <span className="text-[17px] font-black text-[#1a1a2e]">{localStats.streak}-day streak detected.</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest tabular-nums">{localStats.score}% Adherence Level</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* LOGIN CARD */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black text-[#1a1a2e] ml-1 uppercase tracking-[0.2em] opacity-30">Email Address</label>
                            <input
                                type="email"
                                inputMode="email"
                                placeholder="name@rulesci.io"
                                className="w-full h-[64px] bg-gray-50/50 border-2 border-transparent rounded-[22px] px-6 text-[16px] font-bold text-[#1a1a2e] focus:bg-white focus:border-blue-500/20 transition-all outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[11px] font-black text-[#1a1a2e] uppercase tracking-[0.2em] opacity-30">Password</label>
                                <button type="button" className="text-[11px] font-black text-blue-600 uppercase tracking-widest active:opacity-50">Forgot?</button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full h-[64px] bg-gray-50/50 border-2 border-transparent rounded-[22px] px-6 text-[16px] font-bold text-[#1a1a2e] pr-16 focus:bg-white focus:border-blue-500/20 transition-all outline-none"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 h-[64px] w-16 flex items-center justify-center text-gray-300 active:text-[#1a1a2e]"
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full h-[68px] bg-[#1a1a2e] text-white font-black rounded-[24px] shadow-2xl shadow-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-70 group"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>Log In <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={22} strokeWidth={3} /></>
                            )}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="px-10 pb-6 flex items-center gap-4">
                        <div className="flex-1 h-[1px] bg-gray-100/50" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Deployment Path</span>
                        <div className="flex-1 h-[1px] bg-gray-100/50" />
                    </div>

                    {/* ACTIONS */}
                    <div className="px-10 pb-10 flex flex-col gap-4">
                        <button 
                            onClick={handleGuestLogin}
                            className="w-full h-[60px] bg-white border-2 border-gray-100 text-[#1a1a2e] font-black rounded-[22px] active:scale-[0.97] transition-all flex items-center justify-center gap-2 uppercase tracking-[0.15em] text-[12px] hover:border-blue-500/20 shadow-sm"
                        >
                            <Zap size={18} className="text-blue-500" /> Try Demo Mode
                        </button>
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={() => handleSocialLogin('google')}
                                className="flex-1 h-[60px] bg-white border-2 border-gray-100 rounded-[22px] flex items-center justify-center gap-3 text-[14px] font-black text-[#1a1a2e] active:scale-[0.97] transition-all shadow-sm group hover:border-blue-500/20"
                            >
                                <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="G" />
                            </button>
                            <button 
                                onClick={() => handleSocialLogin('github')}
                                className="flex-1 h-[60px] bg-white border-2 border-gray-100 rounded-[22px] flex items-center justify-center gap-3 text-[14px] font-black text-[#1a1a2e] active:scale-[0.97] transition-all shadow-sm group hover:border-gray-800/20"
                            >
                                <img src="https://github.com/favicon.ico" className="w-5 h-5 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="A" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* FOOTER */}
                <p className="mt-12 text-center text-[15px] font-bold text-gray-400">
                    New here?{' '}
                    <Link href="/signup" className="text-blue-600 font-black border-b-2 border-blue-600/10 pb-1 hover:text-blue-700 transition-colors">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}
