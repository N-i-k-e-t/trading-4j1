'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import PersonaSheet from '@/components/settings/PersonaSheet';
import { 
    ChevronRight, 
    LogOut, 
    Settings, 
    CreditCard, 
    Download, 
    Bell, 
    Globe, 
    HelpCircle, 
    Mail, 
    Star, 
    ShieldCheck,
    Edit3,
    Camera,
    Sparkles,
    Brain
} from 'lucide-react';

export default function ProfilePage() {
    const { user, trades, analytics, userModel, logout, showToast, diaryEntries } = useRuleSci();
    const router = useRouter();
    const [isPersonaOpen, setIsPersonaOpen] = useState(false);

    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'TR';
    
    // Stats calculation
    const totalTrades = trades.length;
    const bestStreak = analytics.consistencyDays || 0;
    const memberSince = "Mar 2026"; // Mock or derived from metadata if added later

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const SectionLabel = ({ text }: { text: string }) => (
        <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.15em] ml-4 mb-2">
            {text}
        </h3>
    );

    const goals = ['Consistency', 'Account Growth', 'Career Full-time', 'Recovery'];
    const MenuItem = ({ icon: Icon, label, value, color = "text-[#1a1a2e]", iconColor, onClick, isLast = false }: any) => (
        <button 
            onClick={onClick}
            className={`w-full min-h-[52px] px-5 flex items-center justify-between active:bg-gray-50 transition-colors ${!isLast ? 'border-b border-gray-50' : ''}`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 ${iconColor || color}`}>
                    <Icon size={16} strokeWidth={2.5} />
                </div>
                <span className={`text-[15px] font-bold ${color}`}>{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {value && <span className="text-[13px] font-bold text-gray-400 tabular-nums">{value}</span>}
                <ChevronRight size={16} className="text-gray-200" />
            </div>
        </button>
    );

    return (
        <div className="min-h-[100dvh] bg-[#fcfcfd] flex flex-col pb-[calc(env(safe-area-inset-bottom)+84px)] italic-none">
            {/* PERSONA RECALIBRATION SHEET */}
            <PersonaSheet isOpen={isPersonaOpen} onClose={() => setIsPersonaOpen(false)} />

            {/* HEADER / USER CARD */}
            <header className="px-5 pt-12 pb-8 flex flex-col items-center">
                <div className="w-[64px] h-[64px] rounded-full bg-[#1a1a2e] flex items-center justify-center text-[22px] font-black text-white shadow-2xl mb-4 border-[6px] border-white ring-1 ring-gray-100">
                    {initials}
                </div>
                <h1 className="text-[18px] font-black text-[#1a1a2e] mb-0.5">{user?.name || 'Trader'}</h1>
                <p className="text-[13px] font-bold text-gray-400 mb-4">{user?.email}</p>
                
                <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${user?.isPro ? 'bg-orange-100 text-orange-600' : 'bg-[#1a1a2e]/5 text-[#1a1a2e]/60'}`}>
                    {user?.isPro ? 'Pro Member' : 'Trial Active'}
                </div>

                {/* 3-COLUMN STATS */}
                <div className="w-full grid grid-cols-3 gap-4 mt-8 bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] selection:bg-none">
                    <div className="flex flex-col items-center">
                        <span className="text-[18px] font-black text-[#1a1a2e] tabular-nums">{totalTrades}</span>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider text-center">Total Trades</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-gray-50">
                        <span className="text-[18px] font-black text-[#1a1a2e] tabular-nums">{bestStreak}d</span>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider text-center">Best Streak</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[18px] font-black text-[#1a1a2e] tabular-nums">{memberSince}</span>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider text-center">Member Since</span>
                    </div>
                </div>
            </header>

            <main className="px-5 flex flex-col gap-4">
                {/* TRADING DNA CARD — INTERACTIVE */}
                <button 
                    onClick={() => setIsPersonaOpen(true)}
                    className="bg-[#1a1a2e] rounded-3xl p-6 text-white shadow-xl shadow-[#1a1a2e]/10 text-left active:scale-[0.98] transition-all relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-active:opacity-40 transition-opacity">
                        <Sparkles size={48} className="text-white" />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🧬</span>
                        <h2 className="text-[16px] font-black tracking-tight flex items-center gap-2">
                            My Trading Style
                            <ChevronRight size={14} className="opacity-40" />
                        </h2>
                    </div>
                    <ul className="flex flex-col gap-3 relative z-10">
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                            <p className="text-[13px] font-bold text-white/80 leading-snug">
                                Primary style is <span className="text-white underline decoration-orange-400/50 underline-offset-2 capitalize">{userModel.primary_style.replace(/(_|Trading)/gi,'')}</span> focusing on {userModel.primary_market.toLowerCase()}.
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                            <p className="text-[13px] font-bold text-white/80 leading-snug">
                                Discipline trajectory: <span className="text-white">{userModel.discipline_trajectory}</span> with {userModel.model_confidence * 100}% AI confidence.
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                            <p className="text-[13px] font-bold text-white/80 leading-snug">
                                {userModel.revenge_trade_pattern ? "Monitoring bias suppression" : "High emotional stability"} noted.
                            </p>
                        </li>
                    </ul>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Tap to update profile</span>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <Brain size={14} className="text-white/60" />
                        </div>
                    </div>
                </button>

                {/* MENU SECTIONS */}
                <div className="flex flex-col gap-4">
                    {/* ACCOUNT */}
                    <section className="flex flex-col">
                        <SectionLabel text="Account" />
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <MenuItem icon={Edit3} label="Edit Profile" />
                            <MenuItem icon={CreditCard} label="Subscription" value={user?.isPro ? 'Pro' : '3-Day Trial'} iconColor="text-blue-500" onClick={() => router.push('/pricing')} />
                            <MenuItem icon={Download} label="Export Data" value="CSV / MD" isLast iconColor="text-orange-500" />
                        </div>
                    </section>

                    {/* PREFERENCES */}
                    <section className="flex flex-col">
                        <SectionLabel text="Preferences" />
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <MenuItem icon={Camera} label="Diary Scans" value={`${diaryEntries.length} Items`} onClick={() => router.push('/diary')} />
                            <MenuItem icon={Bell} label="Notifications" value="On" />
                            <MenuItem icon={Globe} label="Default Markets" value={userModel.primary_market} isLast />
                        </div>
                    </section>

                    {/* HELP */}
                    <section className="flex flex-col">
                        <SectionLabel text="Help & Feedback" />
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <MenuItem icon={HelpCircle} label="How It Works" />
                            <MenuItem icon={Mail} label="Contact Support" />
                            <MenuItem icon={Star} label="Rate RuleSci" value="v1.0.0" isLast iconColor="text-orange-500" />
                        </div>
                    </section>

                    {/* LOG OUT */}
                    <button 
                        onClick={handleLogout}
                        className="w-full h-[60px] bg-red-50 rounded-3xl flex items-center justify-center gap-2 text-red-600 font-black text-[15px] active:scale-[0.98] transition-all border border-red-100 mb-8"
                    >
                        <LogOut size={18} strokeWidth={3} />
                        Log Out
                    </button>
                </div>

                <div className="flex flex-col items-center py-4 opacity-20">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a1a2e]">
                        RuleSci v1.0 · Made for traders
                    </p>
                </div>
            </main>
        </div>
    );
}
