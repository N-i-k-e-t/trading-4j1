'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Target, User, ArrowLeft, Loader2, Sparkles, Check } from 'lucide-react';

export default function SignupPage() {
    const { showToast } = useRuleSci();
    const router = useRouter();
    const supabase = createClient();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [termsAccepted, setTermsAccepted] = useState(false);

    const strength = useMemo(() => {
        const pass = formData.password;
        if (!pass) return { score: 0, color: 'bg-gray-100' };
        
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score <= 1) return { score, color: 'bg-red-500' };
        if (score <= 3) return { score, color: 'bg-blue-400' };
        return { score, color: 'bg-green-500' };
    }, [formData.password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password.length < 8) {
            showToast('Password too short (min 8 chars)', 'error');
            return;
        }

        if (!termsAccepted) {
            showToast('Please accept the Terms & Conditions', 'info');
            return;
        }

        setIsLoading(true);
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                showToast('Account created! Welcome to RuleSci.', 'success');
                router.push('/onboarding');
            }
        } catch (err: any) {
            showToast(err.message || 'Registration failed', 'error');
            setIsLoading(false);
        }
    };

    const handleSocialSignup = async (provider: 'google' | 'github') => {
        if (!termsAccepted) {
            showToast('Please accept the Terms & Conditions first', 'info');
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
            showToast(err.message || 'Social signup failed', 'error');
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
            <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-100/30 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-indigo-100/30 blur-[100px] rounded-full" />

            {/* STEP INDICATOR */}
            <div className="absolute top-12 left-0 right-0 flex justify-center z-20" style={{ top: 'max(env(safe-area-inset-top), 48px)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-1 bg-[#1a1a2e] rounded-full" />
                    <div className="w-8 h-1 bg-gray-100 rounded-full" />
                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] ml-2">Step 1 of 2</span>
                </div>
            </div>

            <div className="w-full max-w-[400px] flex flex-col pt-16 relative z-10">
                {/* HEADER */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-[18px] flex items-center justify-center mb-6 shadow-inner">
                        <Sparkles size={24} />
                    </div>
                    <h1 className="text-[34px] font-black text-[#1a1a2e] mb-1 tracking-tighter leading-none">Create Account.</h1>
                    <p className="text-[15px] font-bold text-gray-400 mt-2">Join RuleSci and build your trading plan.</p>
                </div>

                {/* SIGNUP CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black text-[#1a1a2e] ml-1 uppercase tracking-[0.2em] opacity-30">Your Name</label>
                            <input
                                type="text"
                                placeholder="Your trading alias"
                                className="w-full h-[60px] bg-gray-50/50 border-2 border-transparent rounded-[20px] px-6 text-[16px] font-bold text-[#1a1a2e] focus:bg-white focus:border-blue-500/20 transition-all outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                             <label className="text-[11px] font-black text-[#1a1a2e] ml-1 uppercase tracking-[0.2em] opacity-30">Email</label>
                            <input
                                type="email"
                                placeholder="name@rulesci.io"
                                className="w-full h-[60px] bg-gray-50/50 border-2 border-transparent rounded-[20px] px-6 text-[16px] font-bold text-[#1a1a2e] focus:bg-white focus:border-blue-500/20 transition-all outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black text-[#1a1a2e] ml-1 uppercase tracking-[0.2em] opacity-30">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full h-[60px] bg-gray-50/50 border-2 border-transparent rounded-[20px] px-6 text-[16px] font-bold text-[#1a1a2e] pr-16 focus:bg-white focus:border-blue-500/20 transition-all outline-none"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 h-[60px] w-16 flex items-center justify-center text-gray-300 active:text-[#1a1a2e]"
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                            
                            {/* Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2 px-1">
                                    <div className="flex gap-1.5 mb-2">
                                        {[1, 2, 3, 4].map((step) => (
                                            <div 
                                                key={step}
                                                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                                                    step <= strength.score ? strength.color : 'bg-gray-100'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Password Strength: {strength.score === 4 ? 'Elite' : strength.score >= 2 ? 'Secure' : 'Weak'}</p>
                                </div>
                            )}
                        </div>

                        {/* TERMS CHECKBOX */}
                        <div className="flex items-start gap-3 mt-1 px-1">
                            <button
                                type="button"
                                onClick={() => setTermsAccepted(!termsAccepted)}
                                className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                                    termsAccepted ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white' : 'bg-gray-50 border-gray-100'
                                }`}
                            >
                                {termsAccepted && <Check size={14} strokeWidth={4} />}
                            </button>
                            <span className="text-[11px] font-bold text-gray-400 leading-tight uppercase tracking-wider">
                                I accept the <Link href="/terms" className="text-[#1a1a2e] underline underline-offset-4">Terms</Link> & <Link href="/privacy" className="text-[#1a1a2e] underline underline-offset-4">Privacy Policy</Link>
                            </span>
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full h-[68px] bg-[#1a1a2e] text-white font-black rounded-[24px] shadow-2xl shadow-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-70 group"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>Get Started <Sparkles className="group-hover:rotate-12 transition-transform" size={22} /></>
                            )}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="px-10 pb-6 flex items-center gap-4">
                        <div className="flex-1 h-[1px] bg-gray-100/50" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">or sign up with</span>
                        <div className="flex-1 h-[1px] bg-gray-100/50" />
                    </div>

                    {/* OAUTH */}
                    <div className="px-10 pb-10 flex gap-4">
                        <button 
                            onClick={() => handleSocialSignup('google')}
                            className="flex-1 h-[60px] bg-white border-2 border-gray-100 rounded-[22px] flex items-center justify-center gap-3 text-[14px] font-black text-[#1a1a2e] active:scale-[0.97] transition-all shadow-sm group hover:border-blue-500/20"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="G" />
                        </button>
                        <button 
                            onClick={() => handleSocialSignup('github')}
                            className="flex-1 h-[60px] bg-white border-2 border-gray-100 rounded-[22px] flex items-center justify-center gap-3 text-[14px] font-black text-[#1a1a2e] active:scale-[0.97] transition-all shadow-sm group hover:border-gray-800/20"
                        >
                            <img src="https://github.com/favicon.ico" className="w-5 h-5 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="A" />
                        </button>
                    </div>
                </motion.div>

                {/* FOOTER */}
                <p className="mt-12 text-center text-[15px] font-bold text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 font-black border-b-2 border-blue-600/10 pb-1">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
