'use client';

import { useRuleSci } from '@/lib/context';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, ShieldCheck, Info, ChevronRight, Activity, Terminal, Key, Database, MoreVertical, Plus, Trash2 } from 'lucide-react';

/**
 * ApiKeysPage: The 'Connections' hub.
 * Allows traders to connect their broker accounts (Zerodha, Angel, Upstox)
 * and manage AI-agent credentials (OpenAI) with high encryption.
 */
export default function ApiKeysPage() {
    return (
        <div className="flex flex-col gap-8 md:gap-10 pb-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-[26px] font-bold text-[#1a1a2e] leading-tight mb-2 flex items-center gap-3">
                        <Link2 size={28} className="text-blue-600" />
                        Connections
                    </h1>
                    <p className="text-base text-[#6b7280]">Connect your brokers and AI for live-syncing intelligence.</p>
                </div>
                <div className="flex items-center gap-2 group">
                    <span className="p-3 bg-green-50 text-green-600 rounded-xl transition-all group-hover:scale-110">
                        <ShieldCheck size={20} />
                    </span>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-[#1a1a2e] uppercase tracking-widest leading-none mb-1">AES-256 Encrypted</p>
                        <p className="text-[11px] font-bold text-[#6b7280]">Your keys never leave your device.</p>
                    </div>
                </div>
            </header>

            {/* Broker Sync Section */}
            <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#6b7280] uppercase tracking-wider">Trading Brokers</h3>
                    <button className="text-[11px] font-bold text-[#2563eb] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">Support Request</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <BrokerCard name="Zerodha Kite" disabled icon="/zerodha.ico" />
                    <BrokerCard name="Angel One" disabled icon="/angel.ico" />
                    <BrokerCard name="CSV Import" active icon={<Database size={24} />} />
                </div>
            </section>

            {/* AI Agent Credentials */}
            <section className="bg-white rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#1a1a2e]/5 overflow-hidden">
                <div className="p-8 border-b border-[#1a1a2e]/5 flex items-center justify-between bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                            <Terminal size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#1a1a2e]">AI Orchestration Keys</h3>
                            <p className="text-sm text-[#6b7280]">Powers Scribe, Pattern, and Coach Agents.</p>
                        </div>
                    </div>
                    <button className="h-11 px-6 bg-[#1a1a2e] text-white rounded-[18px] text-[13px] font-bold shadow-xl shadow-[#1a1a2e]/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-2">
                        <Plus size={16} />
                        Add New Token
                    </button>
                </div>

                <div className="divide-y divide-[#1a1a2e]/5">
                    <ApiKeyRow name="OpenAI (GPT-4o Vision)" status="Active" keyMask="sk-proj-******************932a" />
                    <ApiKeyRow name="Whisper (STT v3)" status="Inactive" keyMask="sk-whis-******************44ba" />
                </div>
            </section>

            {/* Security Notice */}
            <div className="p-6 bg-[#1a1a2e]/5 border border-[#1a1a2e]/10 rounded-3xl flex items-start gap-4">
                <div className="w-10 h-10 bg-white text-[#1a1a2e] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Info size={20} />
                </div>
                <div>
                    <h4 className="text-[15px] font-bold text-[#1a1a2e] mb-1">Local Storage Policy</h4>
                    <p className="text-sm text-[#6b7280] leading-relaxed">
                        RuleSci stores all API credentials in your browser's encrypted `localStorage`. We do not have a middle-man server that sees your keys. This ensures absolute privacy, but means you must re-enter keys if you clear your browser cache.
                    </p>
                </div>
            </div>
        </div>
    );
}

function BrokerCard({ name, icon, active = false, disabled = false }: { name: string; icon: any; active?: boolean; disabled?: boolean }) {
    return (
        <div className={`group relative bg-white p-7 rounded-[32px] border border-[#1a1a2e]/5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col items-center text-center transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:border-blue-500/20 cursor-pointer'}`}>
            <div className={`w-16 h-16 rounded-[24px] bg-[#1a1a2e]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${active ? 'ring-2 ring-blue-500 ring-offset-4' : ''}`}>
                {typeof icon === 'string' ? <div className="w-10 h-10 bg-[#1a1a2e]/10 rounded-lg" /> : icon}
            </div>
            <h4 className="text-[17px] font-bold text-[#1a1a2e] mb-1">{name}</h4>
            <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-4">
                {active ? 'Synced 2h ago' : disabled ? 'Coming Soon' : 'Not Connected'}
            </p>
            {!disabled && (
                <button className={`w-full h-11 text-[13px] font-bold rounded-xl transition-all ${active ? 'bg-blue-50 text-blue-600' : 'bg-[#1a1a2e]/5 text-[#6b7280]'}`}>
                    {active ? 'Configuration' : 'Auto Sync'}
                </button>
            )}
            {active && <div className="absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
        </div>
    );
}

function ApiKeyRow({ name, status, keyMask }: { name: string; status: string; keyMask: string }) {
    return (
        <div className="px-8 py-5 flex items-center justify-between group hover:bg-gray-50/50 transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-[#9ca3af]'}`}>
                    <Key size={18} />
                </div>
                <div>
                    <h4 className="text-[15px] font-bold text-[#1a1a2e] mb-0.5">{name}</h4>
                    <p className="text-[13px] font-mono text-[#9ca3af]">{keyMask}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'Active' ? 'text-green-500' : 'text-[#9ca3af]'}`}>
                    {status}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-[#9ca3af] transition-all">
                        <Trash2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-[#1a1a2e]/5 text-[#9ca3af] rounded-lg">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
