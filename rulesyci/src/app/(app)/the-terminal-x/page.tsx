'use client';

import { useState, useEffect } from 'react';
import { useRuleSci } from '@/lib/context';
import { createClient } from '@/utils/supabase/client';
import { 
    ShieldAlert, 
    Users, 
    Database, 
    Cpu, 
    Activity, 
    Search,
    ChevronRight,
    Lock,
    Unlock,
    RefreshCw,
    Terminal as TerminalIcon,
    Flame,
    Zap,
    AlertTriangle,
    Eye,
    Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SecretAdminPage() {
    const { user, showToast } = useRuleSci();
    const supabase = createClient();
    
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTrades: 0,
        activeRules: 0,
        aiRequests: 0,
        dbSize: '1.2 MB'
    });
    
    const [users, setUsers] = useState<any[]>([]);
    const [isSystemActive, setIsSystemActive] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'database' | 'ai'>('overview');

    useEffect(() => {
        // Restricted access for development - in production this would be even tighter
        if (user && !user.isAdmin && process.env.NODE_ENV === 'production') {
            window.location.href = '/today';
            return;
        }
        
        loadAdminData();
    }, [user]);

    const loadAdminData = async () => {
        setIsLoading(true);
        try {
            // Mocking some admin data for now until we have proper admin queries
            setStats({
                totalUsers: 142,
                totalTrades: 8940,
                activeRules: 1240,
                aiRequests: 4500,
                dbSize: '2.4 MB'
            });

            // If we have a real users table, we'd query it here
            setUsers([
                { id: '1', name: 'Alpha Trader', email: 'alpha@trader.io', status: 'pro', activity: 'High' },
                { id: '2', name: 'Risk Master', email: 'risk@sentinel.ai', status: 'trial', activity: 'Med' },
                { id: '3', name: 'Rule Follower', email: 'discipline@rulesci.com', status: 'pro', activity: 'Low' },
            ]);

            setIsLoading(false);
        } catch (e) {
            showToast("Failed to load admin terminal", "error");
            setIsLoading(false);
        }
    };

    const toggleSystem = () => {
        setIsSystemActive(!isSystemActive);
        showToast(isSystemActive ? "System Suspended" : "System Reactivated", "info");
    };

    if (isLoading) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <Loader size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white p-8 selection:bg-blue-500/30 selection:text-white">
            {/* TERMINAL HEADER */}
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                        <TerminalIcon size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-[28px] font-black tracking-tight leading-none mb-1 uppercase">Terminal X</h1>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Control Center</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-[#16161a] border border-white/5 rounded-xl flex items-center gap-2">
                        <Globe size={14} className="text-blue-500" />
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Live Node-01</span>
                    </div>
                    <button 
                        onClick={toggleSystem}
                        className={`h-12 px-6 rounded-2xl flex items-center gap-2 text-[13px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                            isSystemActive ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                        }`}
                    >
                        {isSystemActive ? <Lock size={16} /> : <Unlock size={16} />}
                        {isSystemActive ? "Suspend Node" : "Reactivate Node"}
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* SIDE NAV */}
                <nav className="lg:col-span-3 flex flex-col gap-2">
                    <AdminNavItem 
                        active={activeTab === 'overview'} 
                        onClick={() => setActiveTab('overview')} 
                        icon={Activity} 
                        label="Overview" 
                    />
                    <AdminNavItem 
                        active={activeTab === 'users'} 
                        onClick={() => setActiveTab('users')} 
                        icon={Users} 
                        label="User Management" 
                    />
                    <AdminNavItem 
                        active={activeTab === 'database'} 
                        onClick={() => setActiveTab('database')} 
                        icon={Database} 
                        label="Data Vault" 
                    />
                    <AdminNavItem 
                        active={activeTab === 'ai'} 
                        onClick={() => setActiveTab('ai')} 
                        icon={Cpu} 
                        label="AI Engine Config" 
                    />
                    
                    <div className="mt-8 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl">
                        <div className="flex items-center gap-2 text-yellow-500 mb-3">
                            <AlertTriangle size={18} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Warning</span>
                        </div>
                        <p className="text-[12px] text-gray-500 font-bold leading-relaxed">
                            Terminal X bypasses standard security filters. All actions are logged and irreversible.
                        </p>
                    </div>
                </nav>

                {/* MAIN CONTENT */}
                <main className="lg:col-span-9 flex flex-col gap-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div 
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <StatCard label="Total Users" value={stats.totalUsers.toString()} icon={Users} color="text-blue-500" />
                                <StatCard label="Rule Executions" value={stats.activeRules.toString()} icon={Flame} color="text-orange-500" />
                                <StatCard label="AI Inferences" value={stats.aiRequests.toString()} icon={Zap} color="text-purple-500" />
                                <StatCard label="Storage Capacity" value={stats.dbSize} icon={Database} color="text-green-500" />

                                <div className="md:col-span-2 bg-[#16161a] border border-white/5 rounded-[40px] p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-[18px] font-black uppercase tracking-widest text-gray-400">System Activity</h2>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                                                <RefreshCw size={14} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="flex items-center gap-6 p-4 rounded-3xl bg-white/5 border border-transparent hover:border-white/5 transition-all">
                                                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                                                    <Activity size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[15px] font-bold text-white mb-0.5">Rule Violation Detected</p>
                                                    <p className="text-[12px] text-gray-500 font-bold">User #X0842 • 2 seconds ago</p>
                                                </div>
                                                <ChevronRight size={18} className="text-gray-700" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'users' && (
                            <motion.div 
                                key="users"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-[#16161a] border border-white/5 rounded-[40px] p-8"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-[18px] font-black uppercase tracking-widest text-gray-400">Master Directory</h2>
                                    <div className="bg-white/5 px-4 h-11 rounded-xl flex items-center gap-3 border border-white/5 w-64">
                                        <Search size={16} className="text-gray-500" />
                                        <input 
                                            placeholder="Search IDs/Emails..."
                                            className="bg-transparent border-none text-[13px] font-black text-white outline-none w-full"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {users.map(u => (
                                        <div key={u.id} className="group p-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-3xl flex items-center gap-6 transition-all">
                                            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-lg font-black text-blue-500 group-hover:scale-110 transition-transform">
                                                {u.name[0]}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-[16px] font-black text-white leading-none mb-1.5">{u.name}</h4>
                                                <p className="text-[12px] text-gray-400 font-bold">{u.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.status === 'pro' ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-500'}`}>
                                                    {u.status}
                                                </span>
                                                <p className="text-[11px] text-gray-600 font-bold mt-2">Activity: {u.activity}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pl-4">
                                                <button className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center">
                                                    <ShieldAlert size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        
                        {activeTab === 'ai' && (
                            <motion.div 
                                key="ai"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8"
                            >
                                <div className="bg-[#16161a] border border-white/5 rounded-[40px] p-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
                                            <Cpu size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-[22px] font-black tracking-tighter">AI Logic Proxy</h2>
                                            <p className="text-[13px] text-gray-500 font-bold">Configure how the "Coach" and "Scanner" interpret data</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <ConfigToggle label="Enable GPT-4o Vision" description="Allow users to scan handwritten journal pages" active={true} />
                                        <ConfigToggle label="Deep Pattern Analysis" description="Use LLM to find behavioral weaknesses across trade history" active={false} />
                                        <ConfigToggle label="Real-time Risk Alerts" description="Inject live AI warnings during the trading session" active={true} />
                                        <ConfigToggle label="Anonymous Logic Tracking" description="Log all AI prompts and responses for fine-tuning" active={true} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
    return (
        <div className="bg-[#16161a] border border-white/5 rounded-[40px] p-8 flex flex-col gap-4 group hover:border-white/10 transition-all">
            <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
                <p className="text-[32px] font-black text-white tracking-tighter tabular-nums">{value}</p>
            </div>
        </div>
    );
}

function AdminNavItem({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-4 px-6 h-14 rounded-2xl text-[14px] font-black uppercase tracking-wider transition-all ${
                active ? 'bg-blue-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
        >
            <Icon size={20} />
            {label}
        </button>
    );
}

function ConfigToggle({ label, description, active }: { label: string, description: string, active: boolean }) {
    return (
        <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
            <div className="flex flex-col gap-1">
                <span className="text-[15px] font-black text-white">{label}</span>
                <span className="text-[12px] text-gray-500 font-bold">{description}</span>
            </div>
            <div className={`w-12 h-7 rounded-full p-1 transition-colors ${active ? 'bg-blue-600' : 'bg-gray-800'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
        </div>
    );
}

function Loader({ size }: { size: number }) {
    return <RefreshCw size={size} className="text-blue-500 animate-spin" />;
}
