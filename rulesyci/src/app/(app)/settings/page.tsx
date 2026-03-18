'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import {
    User,
    Mail,
    Lock,
    Bell,
    Shield,
    LineChart,
    LogOut,
    ChevronRight,
    Download,
    FileUp,
    CreditCard,
    Target
} from 'lucide-react';

export default function SettingsPage() {
    const { user } = useRuleSci();
    const [notifications, setNotifications] = useState(true);

    const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="flex flex-col gap-2">
            <h3 className="text-[12px] font-bold text-[#9ca3af] uppercase tracking-[0.15em] ml-4 mb-1">
                {title}
            </h3>
            <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] divide-y divide-[#1a1a2e]/5">
                {children}
            </div>
        </div>
    );

    const Item = ({ icon: Icon, label, value, color = "text-[#1a1a2e]" }: { icon: any; label: string; value?: string; color?: string }) => (
        <button className="w-full flex items-center justify-between p-5 hover:bg-[#1a1a2e]/[0.02] transition-colors text-left">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1a1a2e]/5 rounded-xl flex items-center justify-center text-[#1a1a2e]">
                    <Icon size={18} strokeWidth={2.5} className={color} />
                </div>
                <span className={`text-[15px] font-bold ${color}`}>{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {value && <span className="text-[14px] font-medium text-[#9ca3af]">{value}</span>}
                <ChevronRight size={18} className="text-[#9ca3af]" />
            </div>
        </button>
    );

    return (
        <div className="flex flex-col gap-10 pb-12">
            <header>
                <h1 className="text-[28px] font-bold text-[#1a1a2e] mb-2">Settings</h1>
                <p className="text-base text-[#6b7280]">Customize your experience and manage your account.</p>
            </header>

            {/* Profile Section */}
            <section className="flex flex-col items-center gap-4 pt-4">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-[#1a1a2e] flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                        {user?.name?.substring(0, 2).toUpperCase() || 'GU'}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#2563eb] text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <User size={14} strokeWidth={3} />
                    </button>
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-[#1a1a2e]">{user?.name || 'Guest User'}</h2>
                    <p className="text-sm font-medium text-[#6b7280]">{user?.email || 'guest@example.com'}</p>
                </div>
                <button className="px-6 py-2 bg-[#2563eb]/10 text-[#2563eb] rounded-full text-sm font-bold mt-2">
                    Edit Profile
                </button>
            </section>

            {/* Settings Groups */}
            <div className="flex flex-col gap-8">
                <Group title="Account">
                    <Item icon={Mail} label="Change Email" value={user?.email || 'guest@example.com'} />
                    <Item icon={Lock} label="Change Password" />
                    <Item icon={CreditCard} label="Subscription" value={user?.isPro ? 'Pro Access (Unlimited)' : 'Free Plan'} />
                </Group>

                <Group title="Preferences">
                    <Item icon={LineChart} label="Default Market" value="Forex" />
                    <div className="flex items-center justify-between p-5 hover:bg-[#1a1a2e]/[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#1a1a2e]/5 rounded-xl flex items-center justify-center text-[#1a1a2e]">
                                <Bell size={18} strokeWidth={2.5} />
                            </div>
                            <span className="text-[15px] font-bold text-[#1a1a2e]">Daily Rule Reminder</span>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`w-12 h-7 rounded-full transition-colors relative p-1 ${notifications ? 'bg-[#22c55e]' : 'bg-[#9ca3af]'}`}
                        >
                            <motion.div
                                animate={{ x: notifications ? 20 : 0 }}
                                className="w-5 h-5 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    </div>
                    <Item icon={Target} label="Session Goals" value="$500 Daily" />
                </Group>

                <Group title="Data">
                    <Item icon={Download} label="Export Trading Data" value="CSV" />
                    <Item icon={FileUp} label="Import Rules" />
                </Group>

                <Group title="Danger Zone">
                    <Item icon={LogOut} label="Log Out" color="text-[#ef4444]" />
                </Group>
            </div>

            <footer className="text-center py-6">
                <p className="text-[12px] font-bold text-[#9ca3af] uppercase tracking-widest">RuleSci v2.0.0</p>
                <div className="flex justify-center gap-4 mt-2">
                    <button className="text-[11px] font-bold text-[#2563eb] hover:underline uppercase tracking-wide">Privacy Policy</button>
                    <button className="text-[11px] font-bold text-[#2563eb] hover:underline uppercase tracking-wide">Terms of Use</button>
                </div>
            </footer>
        </div>
    );
}
