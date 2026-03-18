'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Target, User } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Redirect to welcome tour for now
        router.push('/welcome');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-[400px]">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 justify-center mb-12">
                    <div className="w-10 h-10 bg-[#f59e0b]/10 text-[#f59e0b] rounded-full flex items-center justify-center shadow-sm">
                        <Target size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#1a1a2e]">RuleSci</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[24px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                >
                    <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2 text-center">Create your account</h1>
                    <p className="text-sm text-[#6b7280] mb-8 text-center">Start your journey to trading discipline.</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-[#1a1a2e] ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                                <input
                                    type="text"
                                    placeholder="Niket Patil"
                                    className="w-full h-14 bg-[#1a1a2e]/5 border-none rounded-full pl-12 pr-4 text-base focus:ring-2 focus:ring-[#2563eb] transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-[#1a1a2e] ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full h-14 bg-[#1a1a2e]/5 border-none rounded-full pl-12 pr-4 text-base focus:ring-2 focus:ring-[#2563eb] transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-[#1a1a2e] ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full h-14 bg-[#1a1a2e]/5 border-none rounded-full pl-12 pr-12 text-base focus:ring-2 focus:ring-[#2563eb] transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a1a2e]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button className="w-full h-14 bg-[#1a1a2e] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all mt-4">
                            Create Account
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#1a1a2e]/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[12px] uppercase">
                            <span className="bg-white px-3 text-[#9ca3af] font-bold tracking-widest">or</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button className="w-full h-12 rounded-full border-2 border-[#1a1a2e]/5 flex items-center justify-center gap-3 text-sm font-bold text-[#1a1a2e] hover:bg-[#1a1a2e]/5 transition-all">
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                            Continue with Google
                        </button>
                        <button className="w-full h-12 rounded-full border-2 border-[#1a1a2e]/5 flex items-center justify-center gap-3 text-sm font-bold text-[#1a1a2e] hover:bg-[#1a1a2e]/5 transition-all">
                            <img src="https://github.com/favicon.ico" className="w-4 h-4" alt="Apple" />
                            Continue with Apple
                        </button>
                    </div>
                </motion.div>

                <p className="mt-8 text-center text-sm text-[#6b7280]">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#2563eb] font-bold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
