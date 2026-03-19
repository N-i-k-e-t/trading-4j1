'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Target, User, ArrowLeft, Loader2 } from 'lucide-react';

export default function SignupPage() {
    const { showToast } = useRuleSci();
    const router = useRouter();
    const supabase = createClient();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const strength = useMemo(() => {
        const pass = formData.password;
        if (!pass) return { score: 0, color: 'bg-gray-100' };
        
        let score = 0;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score <= 2) return { score, color: 'bg-red-500' };
        if (score === 3) return { score, color: 'bg-orange-500' };
        return { score, color: 'bg-green-500' };
    }, [formData.password]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Full name is required';
        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
        if (formData.password.length < 8) newErrors.password = 'Min 8 characters required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return;

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
                showToast('Welcome to RuleSci!', 'success');
                router.push('/onboarding');
            }
        } catch (err: any) {
            showToast(err.message || 'Signup failed', 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center px-5 selection:bg-orange-100 italic-none"
            style={{ 
                paddingTop: 'env(safe-area-inset-top, 24px)', 
                paddingBottom: 'env(safe-area-inset-bottom, 24px)' 
            }}
        >
            {/* STEP INDICATOR */}
            <div className="absolute top-12 left-0 right-0 flex justify-center" style={{ top: 'max(env(safe-area-inset-top), 48px)' }}>
                <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">Step 1 of 2</span>
            </div>

            <div className="w-full max-w-[380px] flex flex-col pt-16">
                {/* HEADER */}
                <div className="flex flex-col items-center mb-6 text-center">
                    <h1 className="text-[22px] font-black text-[#1a1a2e] mb-1">Create your account</h1>
                    <p className="text-[14px] font-semibold text-gray-400">Then we'll personalise your experience</p>
                </div>

                {/* SIGNUP CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[24px] shadow-sm border border-gray-50 overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-black text-[#1a1a2e] ml-1 uppercase tracking-wider opacity-60">Full Name</label>
                            <input
                                type="text"
                                autoComplete="name"
                                autoCapitalize="words"
                                placeholder="Your trading name"
                                className="w-full h-[50px] bg-gray-50 rounded-xl px-4 text-[16px] font-bold text-[#1a1a2e]"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

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
                            <label className="text-[12px] font-black text-[#1a1a2e] ml-1 uppercase tracking-wider opacity-60">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
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
                            
                            {/* Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2 text-left">
                                    <div className="flex gap-1 mb-1.5">
                                        {[1, 2, 3, 4].map((step) => (
                                            <div 
                                                key={step}
                                                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                                                    step <= strength.score ? strength.color : 'bg-gray-100'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-400">8+ chars with letters & numbers</p>
                                </div>
                            )}
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full h-14 bg-[#1a1a2e] text-white font-black rounded-xl shadow-lg shadow-gray-200 active:scale-[0.97] transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>Start Free Trial — 3 Days</>
                            )}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="px-6 pb-4 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">or faster with</span>
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

                {/* TERMS */}
                <p className="mt-6 px-4 text-center text-[10px] font-bold text-gray-300 leading-relaxed uppercase tracking-widest">
                    By signing up, you agree to our{' '}
                    <Link href="/terms" className="underline">Terms</Link> and{' '}
                    <Link href="/privacy" className="underline">Privacy Policy</Link>
                </p>

                {/* FOOTER */}
                <p className="mt-8 text-center text-[13px] font-bold text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#1a1a2e] font-black">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
