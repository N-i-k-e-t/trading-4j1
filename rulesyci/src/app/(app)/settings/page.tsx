'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import JSZip from 'jszip';
import { tradeToMarkdown, markdownToTrade } from '@/lib/utils/markdownUtils';
import { Trade } from '@/types/trading';
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
    Target,
    Pencil,
    Check,
    X
} from 'lucide-react';

export default function SettingsPage() {
    const { user, trades, rules, logout, showToast, login, addTrade } = useRuleSci();
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleSaveName = () => {
        if (editName.trim() && user) {
            login(user.email, editName.trim());
            showToast('Name updated!', 'success');
            setIsEditingName(false);
        }
    };

    const handleExportCSV = () => {
        if (trades.length === 0) {
            showToast('No trades to export', 'info');
            return;
        }

        const headers = ['Date', 'Pair', 'Direction', 'Entry', 'Exit', 'Rules Followed', 'Rules Broken', 'Mood', 'Notes'];
        const rows = trades.map(t => [
            t.date,
            t.pair,
            t.type,
            t.entry,
            t.exit,
            t.rules_followed.length.toString(),
            t.rules_broken.length.toString(),
            t.emotion,
            `"${(t.notes || '').replace(/"/g, '""')}"`,
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rulesci_trades_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Exported ${trades.length} trades!`, 'success');
    };

    const handleExportObsidian = async () => {
        if (trades.length === 0) {
            showToast('No trades to export', 'info');
            return;
        }

        const zip = new JSZip();
        trades.forEach(trade => {
            const dateStr = new Date(trade.date).toISOString().split('T')[0];
            const safePair = (trade.pair || 'Unknown').replace(/[^a-zA-Z0-9]/g, '');
            const filename = `${dateStr}_${safePair}_${trade.id.substring(0, 6)}.md`;
            const mdContent = tradeToMarkdown(trade);
            zip.file(filename, mdContent);
        });

        try {
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rulesci_obsidian_export_${new Date().toISOString().split('T')[0]}.zip`;
            a.click();
            URL.revokeObjectURL(url);
            showToast(`Exported ${trades.length} markdown files!`, 'success');
        } catch (e) {
            showToast('Failed to create ZIP', 'error');
        }
    };

    const handleImportObsidian = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        let importCount = 0;
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                if (text) {
                    const partialTrade = markdownToTrade(text);
                    if (partialTrade.date && (partialTrade.pair || partialTrade.entry)) {
                        addTrade(partialTrade as Trade);
                        importCount++;
                    }
                }
            };
            reader.readAsText(file);
        });

        // Simulating async completion for the toast
        setTimeout(() => {
            if (importCount > 0) showToast(`Imported ${importCount} trades!`, 'success');
        }, 1000);
        
        // Reset input
        e.target.value = '';
    };

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

    const Item = ({ icon: Icon, label, value, color = "text-[#1a1a2e]", onClick }: { icon: any; label: string; value?: string; color?: string; onClick?: () => void }) => (
        <button onClick={onClick} className="w-full flex items-center justify-between p-5 hover:bg-[#1a1a2e]/[0.02] transition-colors text-left">
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
                <h1 className="text-[22px] font-bold text-[#1a1a2e] mb-2">Settings</h1>
                <p className="text-base text-[#6b7280]">Customize your experience and manage your account.</p>
            </header>

            {/* Profile Section */}
            <section className="flex flex-col items-center gap-4 pt-4">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-[#1a1a2e] flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                        {user?.name?.substring(0, 2).toUpperCase() || 'GU'}
                    </div>
                </div>
                <div className="text-center">
                    {isEditingName ? (
                        <div className="flex items-center gap-2">
                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                autoFocus
                                className="text-xl font-bold text-[#1a1a2e] text-center bg-[#1a1a2e]/5 rounded-xl px-3 py-1 border-none outline-none focus:ring-2 focus:ring-[#2563eb]"
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                            />
                            <button onClick={handleSaveName} className="w-8 h-8 bg-[#22c55e] text-white rounded-full flex items-center justify-center">
                                <Check size={14} strokeWidth={3} />
                            </button>
                            <button onClick={() => setIsEditingName(false)} className="w-8 h-8 bg-[#9ca3af]/20 text-[#6b7280] rounded-full flex items-center justify-center">
                                <X size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        <h2 className="text-xl font-bold text-[#1a1a2e]">{user?.name || 'Guest User'}</h2>
                    )}
                    <p className="text-sm font-medium text-[#6b7280]">{user?.email || 'guest@example.com'}</p>
                </div>
                {!isEditingName && (
                    <button
                        onClick={() => { setEditName(user?.name || ''); setIsEditingName(true); }}
                        className="px-6 py-2 bg-[#2563eb]/10 text-[#2563eb] rounded-full text-sm font-bold mt-2 flex items-center gap-2"
                    >
                        <Pencil size={14} />
                        Edit Profile
                    </button>
                )}
            </section>

            {/* Settings Groups */}
            <div className="flex flex-col gap-8">
                <Group title="Account">
                    <Item icon={Mail} label="Email" value={user?.email || 'guest@example.com'} />
                    <Item icon={Lock} label="Change Password" onClick={() => showToast('Coming soon!', 'info')} />
                    <Item
                        icon={CreditCard}
                        label="Subscription"
                        value={user?.isPro ? 'Pro Access (Unlimited)' : 'Free Plan'}
                        onClick={() => router.push('/pricing')}
                    />
                </Group>

                <Group title="Preferences">
                    <Item icon={LineChart} label="Default Market" value="Forex" onClick={() => showToast('Coming soon!', 'info')} />
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
                    <Item icon={Target} label="Session Goals" value="$500 Daily" onClick={() => showToast('Coming soon!', 'info')} />
                </Group>

                <Group title="Data">
                    <Item icon={Download} label="Export Trading Data" value="CSV" onClick={handleExportCSV} />
                    <Item icon={Download} label="Export to Obsidian" value="Markdown ZIP" onClick={handleExportObsidian} />
                    <div className="relative">
                        <input 
                            type="file" 
                            multiple 
                            accept=".md"
                            onChange={handleImportObsidian}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Item icon={FileUp} label="Import from Obsidian" value="Select .md files" />
                    </div>
                </Group>

                <Group title="Danger Zone">
                    <button onClick={handleLogout} className="w-full flex items-center justify-between p-5 hover:bg-[#ef4444]/5 transition-colors text-left">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#ef4444]/10 rounded-xl flex items-center justify-center">
                                <LogOut size={18} strokeWidth={2.5} className="text-[#ef4444]" />
                            </div>
                            <span className="text-[15px] font-bold text-[#ef4444]">Log Out</span>
                        </div>
                        <ChevronRight size={18} className="text-[#9ca3af]" />
                    </button>
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
