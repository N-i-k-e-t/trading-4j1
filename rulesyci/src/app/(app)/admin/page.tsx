'use client';

import { useState, useEffect } from 'react';
import { useRuleSci } from '@/lib/context';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, Users, TrendingUp, ShieldAlert, CheckCircle, 
    MoreHorizontal, Settings, ShieldQuestion, Activity, 
    Terminal, Zap, Globe, Lock, Cpu, Database, 
    ChevronRight, ArrowUpRight, Search
} from 'lucide-react';

/**
 * Admin Headquarters v2.0
 * The high-fidelity 'Command Center' for RuleSci.
 * Real-time telemetry, agent orchestration logs, and global governance.
 */
export default function AdminPage() {
    const { user } = useRuleSci();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'agents' | 'systems'>('overview');
    const [logs, setLogs] = useState<{ id: string, msg: string, time: string, type: string }[]>([]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        
        // Mocking real-time agent logs
        const logTemplates = [
            { msg: "Scribe: Extracted Trade Data from Diary ID #942", type: "success" },
            { msg: "Tilt: High-risk behavior detected for User #128", type: "warning" },
            { msg: "Coach: Generating 3 Insight Cards for Niket", type: "info" },
            { msg: "System: AES-256 Key rotation completed", type: "security" },
            { msg: "Pattern: Detected 'Thursday Expiry' underperformance trend", type: "analytics" }
        ];

        const logTimer = setInterval(() => {
            const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
            setLogs(prev => [{ 
                id: Math.random().toString(), 
                msg: template.msg, 
                time: new Date().toLocaleTimeString(), 
                type: template.type 
            }, ...prev].slice(0, 10));
        }, 3000);

        return () => { clearInterval(timer); clearInterval(logTimer); };
    }, []);

    if (!user?.isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center mb-6 shadow-red-500/10 shadow-xl">
                    <ShieldAlert size={32} />
                </div>
                <h1 className="text-2xl font-black text-[#1a1a2e]">Root Access Denied</h1>
                <p className="text-[#6b7280] mt-2 mb-8">Role: Trader. Required: Admin.</p>
                <button className="px-6 py-3 bg-[#1a1a2e] text-white rounded-2xl font-bold text-sm shadow-lg">Request Elevation</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 md:gap-10 pb-20">
            {/* Command Center Header */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 bg-white rounded-[40px] border border-[#1a1a2e]/5 shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-16 h-16 bg-purple-600 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-purple-200">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-[26px] font-black text-[#1a1a2e] leading-none mb-2">Command Center</h1>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest">
                                <Globe size={12} /> Global Cluster 01
                            </span>
                            <span className="w-1 h-1 bg-[#9ca3af] rounded-full" />
                            <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest">
                                {currentTime.toLocaleDateString()} · {currentTime.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100 hidden sm:block">
                        <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1">System Load</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-gray-200 rounded-full w-24 overflow-hidden">
                                <motion.div animate={{ width: "32%" }} className="h-full bg-green-500" />
                            </div>
                            <span className="text-xs font-bold text-[#1a1a2e]">32%</span>
                        </div>
                    </div>
                    <button className="h-14 px-8 bg-[#1a1a2e] text-white rounded-[20px] text-sm font-bold flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#1a1a2e]/20">
                        <Lock size={18} />
                        Security Lockdown
                    </button>
                </div>
            </header>

            {/* Main Tabs Navigation */}
            <nav className="flex items-center gap-2 p-1.5 bg-gray-50/50 backdrop-blur-sm rounded-[24px] border border-gray-100 self-start">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Executive Overview" icon={<TrendingUp size={16} />} />
                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="Trader Directory" icon={<Users size={16} />} />
                <TabButton active={activeTab === 'agents'} onClick={() => setActiveTab('agents')} label="Agent Telemetry" icon={<Cpu size={16} />} />
                <TabButton active={activeTab === 'systems'} onClick={() => setActiveTab('systems')} label="System Config" icon={<Settings size={16} />} />
            </nav>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* High-Level Stats */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <KPICloudCard 
                                label="Total Trading Desk Alpha" 
                                value="₹2,42,800" 
                                trend="+14.2%" 
                                icon={<TrendingUp className="text-green-500" size={20} />} 
                                chartColor="#22c55e"
                            />
                            <KPICloudCard 
                                label="Discipline Index (Avg)" 
                                value="84/100" 
                                trend="+2.4" 
                                icon={<Activity className="text-blue-500" size={20} />} 
                                chartColor="#3b82f6"
                            />
                            <StatBox icon={<Users size={18} />} label="Total Registered" value="1,284" sub="42 new today" />
                            <StatBox icon={<ShieldCheck size={18} />} label="Pro Conversion" value="34.2%" sub="Industry Avg: 12%" />
                        </div>

                        {/* Real-time Agent Logs Stream */}
                        <div className="bg-[#1a1a2e] rounded-[40px] p-8 flex flex-col shadow-2xl shadow-[#1a1a2e]/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                    <Terminal size={18} className="text-blue-400" />
                                    Live Agent Flux
                                </h3>
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                            </div>
                            <div className="flex-1 space-y-4 font-mono">
                                <AnimatePresence initial={false}>
                                    {logs.map((log) => (
                                        <motion.div 
                                            key={log.id} 
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                            className="text-[11px] leading-relaxed flex gap-3"
                                        >
                                            <span className="text-gray-500 whitespace-nowrap">[{log.time}]</span>
                                            <span className={`${
                                                log.type === 'warning' ? 'text-orange-400' :
                                                log.type === 'success' ? 'text-green-400' :
                                                log.type === 'security' ? 'text-purple-400' : 'text-blue-300'
                                            }`}>
                                                {log.msg}
                                            </span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-gray-500">
                                <span>STATUS: CLUSTER_READY</span>
                                <span>NODES: 128_ACTIVE</span>
                            </div>
                        </div>

                        {/* Middle Row: User Directory Component & Agent Health */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[40px] border border-[#1a1a2e]/5 shadow-sm overflow-hidden">
                                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-[#1a1a2e]">Vanguard Traders</h3>
                                    <button className="p-2 hover:bg-gray-50 rounded-xl text-blue-600 transition-all"><ChevronRight size={20} /></button>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    <MiniUserRow name="Niket Patil" status="Pro" discipline={94} modelConf="98%" />
                                    <MiniUserRow name="Aditya Parerao" status="Pro" discipline={88} modelConf="92%" />
                                    <MiniUserRow name="Sarah Connor" status="Free" discipline={72} modelConf="45%" />
                                </div>
                            </div>

                            <div className="bg-white rounded-[40px] border border-[#1a1a2e]/5 shadow-sm p-8">
                                <h3 className="text-lg font-bold text-[#1a1a2e] mb-8">Agent Orchestration Pulse</h3>
                                <div className="space-y-6">
                                    <AgentHealthBar name="Scribe (Vision API)" status="Optimal" load={42} />
                                    <AgentHealthBar name="Pattern Analyst" status="Optimal" load={18} />
                                    <AgentHealthBar name="Risk Sentinel" status="Optimal" load={76} />
                                    <AgentHealthBar name="Learner Node" status="Syncing" load={92} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'systems' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        <ConfigCard title="Global Intelligence Model" icon={<Cpu size={20} />} description="Switch between AI backends for agents.">
                            <div className="flex flex-col gap-3">
                                <ConfigOption active label="GPT-4o (Reasoning-Heavy)" value="v4.0.flux" />
                                <ConfigOption label="GPT-4-Turbo (Balanced)" value="v4-turbo" />
                                <ConfigOption label="Whisper Large v3 (Speech)" value="v3.0.opt" />
                            </div>
                        </ConfigCard>
                        
                        <ConfigCard title="Experimental Labs" icon={<Database size={20} />} description="Toggle features in 'Lab Mode' for beta testers.">
                            <div className="space-y-4">
                                <ToggleRow label="Ambient Narrative Voice" active />
                                <ToggleRow label="Biometric Discipline Sync" />
                                <ToggleRow label="Multi-Broker Bridge" active />
                            </div>
                        </ConfigCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// UI Sub-components

function TabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: any }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                active 
                ? 'bg-white text-[#1a1a2e] shadow-[0_4px_12px_rgba(0,0,0,0.06)] scale-100' 
                : 'text-[#6b7280] hover:text-[#1a1a2e] scale-95 opacity-70'
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

function KPICloudCard({ label, value, trend, icon, chartColor }: any) {
    return (
        <div className="bg-white rounded-[40px] p-8 border border-[#1a1a2e]/5 shadow-sm group hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                    {icon}
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-600 text-[11px] font-black rounded-full flex items-center gap-1">
                    <ArrowUpRight size={12} /> {trend}
                </div>
            </div>
            <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1">{label}</p>
            <h2 className="text-3xl font-black text-[#1a1a2e]">{value}</h2>
            {/* Visual Sparkline Mock */}
            <div className="mt-6 h-8 flex items-end gap-1">
                {[4, 6, 3, 7, 5, 8, 4, 9, 6, 8].map((h, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ height: 0 }} animate={{ height: `${h * 10}%` }}
                        className="flex-1 rounded-sm" style={{ backgroundColor: chartColor, opacity: 0.2 + (i * 0.08) }}
                    />
                ))}
            </div>
        </div>
    );
}

function StatBox({ icon, label, value, sub }: any) {
    return (
        <div className="bg-white rounded-[32px] p-6 border border-[#1a1a2e]/5 flex items-center gap-5 hover:bg-gray-50/50 transition-colors">
            <div className="w-12 h-12 bg-[#1a1a2e]/5 text-[#1a1a2e] rounded-xl flex items-center justify-center">{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-xl font-black text-[#1a1a2e] mb-0.5">{value}</p>
                <p className="text-[11px] font-semibold text-blue-600">{sub}</p>
            </div>
        </div>
    );
}

function MiniUserRow({ name, status, discipline, modelConf }: any) {
    return (
        <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold text-xs">{name.substring(0, 2)}</div>
                <div>
                    <h4 className="text-[14px] font-bold text-[#1a1a2e] mb-0.5">{name}</h4>
                    <span className="px-2 py-0.5 bg-[#1a1a2e]/5 text-[#6b7280] text-[9px] font-black uppercase tracking-widest rounded-md">{status}</span>
                </div>
            </div>
            <div className="flex items-center gap-8 text-right">
                <div>
                    <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1">Discipline</p>
                    <p className={`text-sm font-bold ${discipline > 90 ? 'text-green-500' : 'text-orange-500'}`}>{discipline}%</p>
                </div>
                <div className="hidden sm:block">
                    <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1">Model Conf</p>
                    <p className="text-sm font-bold text-[#1a1a2e]">{modelConf}</p>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#1a1a2e] transition-all" />
            </div>
        </div>
    );
}

function AgentHealthBar({ name, status, load }: any) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#1a1a2e]">{name}</span>
                <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">{status}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${load}%` }}
                    className={`h-full ${load > 85 ? 'bg-orange-500' : 'bg-blue-600'}`} 
                />
            </div>
        </div>
    );
}

function ConfigCard({ title, icon, description, children }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-[#1a1a2e]/5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">{icon}</div>
                <h3 className="text-lg font-bold text-[#1a1a2e]">{title}</h3>
            </div>
            <p className="text-sm text-[#6b7280] mb-8">{description}</p>
            {children}
        </div>
    );
}

function ConfigOption({ active, label, value }: any) {
    return (
        <div className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            active ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-transparent hover:border-gray-200'
        }`}>
            <div>
                <p className="text-sm font-bold text-[#1a1a2e]">{label}</p>
                <p className="text-[11px] font-mono text-[#6b7280]">{value}</p>
            </div>
            {active && <CheckCircle className="text-blue-600" size={18} />}
        </div>
    );
}

function ToggleRow({ label, active = false }: any) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#1a1a2e]">{label}</span>
            <div className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${active ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${active ? 'left-7' : 'left-1'}`} />
            </div>
        </div>
    );
}
