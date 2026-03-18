'use client';

import { useRuleSci } from '@/lib/context';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, TrendingUp, ShieldAlert, CheckCircle, MoreHorizontal, Settings, ShieldQuestion } from 'lucide-react';

/**
 * AdminPanel: Internal tool for governing RuleSci.
 * Role-based access only. Allows for user management and system health monitoring.
 */
export default function AdminPage() {
    const { user } = useRuleSci();

    if (!user?.isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center mb-6">
                    <ShieldAlert size={32} />
                </div>
                <h1 className="text-2xl font-black text-[#1a1a2e]">Access Denied</h1>
                <p className="text-[#6b7280] mt-2">You do not have administrative privileges to view this page.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 md:gap-10 pb-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-[26px] font-bold text-[#1a1a2e] leading-tight mb-2 flex items-center gap-3">
                        <ShieldCheck size={28} className="text-purple-600" />
                        Admin Headquarters
                    </h1>
                    <p className="text-base text-[#6b7280]">Manage users, revenue, and system-wide intelligence.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-purple-50 text-purple-600 text-[11px] font-black uppercase tracking-widest rounded-xl border border-purple-100">
                        Root Access Active
                    </span>
                </div>
            </header>

            {/* System Health Stats */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AdminStatCard icon={<Users size={18} />} label="Total Traders" value="1,284" color="bg-blue-600" trend="+12% this wk" />
                <AdminStatCard icon={<TrendingUp size={18} />} label="Active Sessions" value="24" color="bg-green-600" />
                <AdminStatCard icon={<ShieldCheck size={18} />} label="Pro Users" value="482" color="bg-purple-600" />
                <AdminStatCard icon={<Settings size={18} />} label="Avg Model Conf." value="87%" color="bg-orange-600" />
            </section>

            {/* User Management Table */}
            <section className="bg-white rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#1a1a2e]/5 overflow-hidden">
                <div className="p-8 border-b border-[#1a1a2e]/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#1a1a2e]">User Directory</h3>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Search by email..." 
                            className="h-10 px-4 bg-[#1a1a2e]/5 rounded-xl text-sm font-medium border-none focus:ring-2 focus:ring-purple-500/20"
                        />
                    </div>
                </div>
                
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest">Trader</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest">Last Activity</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest">Model Conf</th>
                            <th className="px-8 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a2e]/5">
                        <UserRow name="Niket Patil" email="niket@rulesci.ai" status="Pro" activity="2 min ago" conf="94%" />
                        <UserRow name="Aditya Parerao" email="aditya@rulesci.ai" status="Pro" activity="1 hour ago" conf="88%" />
                        <UserRow name="Sarah Connor" email="sarah@trading.com" status="Free" activity="Yesterday" conf="42%" />
                        <UserRow name="Peter Parker" email="peter@dailybugle.com" status="Free" activity="3 days ago" conf="12%" />
                    </tbody>
                </table>
            </section>

            {/* Agent Status Alerts */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[40px] border border-[#1a1a2e]/5 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1a1a2e] mb-6 flex items-center gap-2">
                        <ShieldQuestion size={20} className="text-blue-600" />
                        Agent Orchestration Health
                    </h3>
                    <div className="space-y-4">
                        <AgentLifeItem name="Scribe Agent" status="Online" latency="42ms" />
                        <AgentLifeItem name="Pattern Agent" status="Idle" latency="120ms" />
                        <AgentLifeItem name="Tilt Agent" status="Online" latency="8ms" />
                        <AgentLifeItem name="Learner Agent" status="Batching" latency="-" />
                    </div>
                </div>
            </section>
        </div>
    );
}

function AdminStatCard({ icon, label, value, color, trend }: { icon: any; label: string; value: string; color: string; trend?: string }) {
    return (
        <div className="bg-white rounded-[32px] p-6 border border-[#1a1a2e]/5 hover:shadow-xl transition-all">
            <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-[#1a1a2e]">{value}</p>
                {trend && <span className="text-[10px] font-bold text-green-500 uppercase">{trend}</span>}
            </div>
        </div>
    );
}

function UserRow({ name, email, status, activity, conf }: { name: string; email: string; status: string; activity: string; conf: string }) {
    return (
        <tr className="hover:bg-gray-50/50 transition-all group">
            <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase tracking-tighter">
                        {name.substring(0, 2)}
                    </div>
                    <div>
                        <p className="text-[15px] font-bold text-[#1a1a2e]">{name}</p>
                        <p className="text-[13px] text-[#9ca3af]">{email}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-5">
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${
                    status === 'Pro' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-100 text-[#9ca3af] border-transparent'
                }`}>
                    {status}
                </span>
            </td>
            <td className="px-8 py-5 text-sm font-semibold text-[#6b7280]">{activity}</td>
            <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-20">
                        <div className="h-full bg-purple-500" style={{ width: conf }} />
                    </div>
                    <span className="text-[11px] font-bold text-[#1a1a2e]">{conf}</span>
                </div>
            </td>
            <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-[#1a1a2e]/5 rounded-lg text-[#9ca3af] hover:text-[#1a1a2e]">
                    <MoreHorizontal size={18} />
                </button>
            </td>
        </tr>
    );
}

function AgentLifeItem({ name, status, latency }: { name: string; status: string; latency: string }) {
    return (
        <div className="flex items-center justify-between p-4 bg-[#1a1a2e]/5 rounded-2xl">
            <div className="flex items-center gap-3">
                <CheckCircle size={16} className={status === 'Online' ? 'text-green-500' : 'text-blue-400'} />
                <span className="text-sm font-bold text-[#1a1a2e]">{name}</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">{status}</span>
                <span className="text-[11px] font-bold text-[#2563eb]">{latency}</span>
            </div>
        </div>
    );
}
