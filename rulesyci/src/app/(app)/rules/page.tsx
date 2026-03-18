'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import {
    Plus,
    Target,
    Shield,
    Clock,
    Brain,
    TrendingUp,
    Zap,
    Lock,
    Search,
    Check
} from 'lucide-react';

const CATEGORIES = ['All', 'Risk Management', 'Entry', 'Exit', 'Mindset', 'Session', 'Review'];

const RULE_LIBRARY = [
    { id: 'l1', text: "Never risk more than 2% per trade", emoji: "🛡️", category: "Risk Management", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400" },
    { id: 'l2', text: "Always use a stop loss", emoji: "🛑", category: "Risk Management", image: "https://images.unsplash.com/photo-1621361891114-c10151f7a512?auto=format&fit=crop&q=80&w=400" },
    { id: 'l3', text: "Wait for confirmation candle", emoji: "🕯️", category: "Entry", image: "https://images.unsplash.com/photo-1611974717482-58a05a74bf4f?auto=format&fit=crop&q=80&w=400" },
    { id: 'l4', text: "No revenge trading", emoji: "🧠", category: "Mindset", image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=400" },
    { id: 'l5', text: "Max 3 trades per session", emoji: "🔢", category: "Session", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400" },
    { id: 'l6', text: "Stop after 2 consecutive losses", emoji: "⏸️", category: "Risk Management", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400" },
    { id: 'l7', text: "Check higher timeframe first", emoji: "📅", category: "Entry", image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=400" },
    { id: 'l8', text: "Set take profit before entering", emoji: "🎯", category: "Risk Management", image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=400" },
];

export default function RulesPage() {
    const { rules } = useRuleSci();
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredLibrary = RULE_LIBRARY.filter(r =>
        activeCategory === 'All' || r.category === activeCategory
    );

    return (
        <div className="flex flex-col gap-12 pb-12">
            {/* Header */}
            <header>
                <h1 className="text-[28px] font-bold text-[#1a1a2e] mb-2">My Rules</h1>
                <p className="text-base text-[#6b7280]">Build your trading framework, one rule at a time.</p>
            </header>

            {/* Active Rules List */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#1a1a2e]">Active Rules</h2>
                    <span className="text-sm font-bold text-[#9ca3af]">{rules.length} Rules Attached</span>
                </div>

                <div className="flex flex-col gap-3">
                    {rules.length > 0 ? (
                        rules.map((rule, i) => (
                            <div key={rule.id} className="card flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#1a1a2e]/5 rounded-xl flex items-center justify-center text-xl">
                                    {rule.emoji || '🎯'}
                                </div>
                                <div className="flex-1">
                                    <span className="block text-[16px] font-semibold text-[#1a1a2e]">{rule.text}</span>
                                    <span className="text-[11px] font-bold text-[#22c55e] uppercase tracking-wider">Followed 85% of time</span>
                                </div>
                                <div className="w-10 h-6 bg-[#2563eb] rounded-full relative p-1 cursor-pointer">
                                    <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-[#6b7280]">No active rules yet. Add some from the library below.</p>
                        </div>
                    )}

                    <button className="w-full h-16 rounded-[16px] border-2 border-dashed border-[#1a1a2e]/10 flex items-center justify-center gap-2 text-[#6b7280] font-bold hover:bg-[#1a1a2e]/5 transition-all">
                        <Plus size={20} />
                        Create Your Own Rule
                    </button>
                </div>
            </section>

            {/* Rule Library */}
            <section>
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Rule Library</h2>
                    <p className="text-sm text-[#6b7280]">Tap to add to your rules</p>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 h-11 flex-shrink-0 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                                    ? 'bg-[#1a1a2e] text-white'
                                    : 'bg-[#1a1a2e]/5 text-[#6b7280] hover:bg-[#1a1a2e]/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid of Library Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredLibrary.map((rule) => (
                        <div
                            key={rule.id}
                            className="relative aspect-square rounded-[24px] overflow-hidden shadow-sm group cursor-pointer"
                        >
                            <img
                                src={rule.image}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt={rule.text}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                            <div className="absolute bottom-3 left-3 right-3 bg-white rounded-full p-2 flex items-center justify-between shadow-md">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-sm shrink-0">{rule.emoji}</span>
                                    <span className="text-[10px] font-bold text-[#1a1a2e] truncate">{rule.text}</span>
                                </div>
                                <div className="w-6 h-6 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center shrink-0 ml-2">
                                    <Plus size={14} strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
