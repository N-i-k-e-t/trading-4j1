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
    Lock,
    Search,
    Check,
    X,
    BookOpen,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { generateRuleSuggestions } from '@/lib/agents/ruleSuggester';

const MASTER_LIBRARIES = [
    {
        title: "Jesse Livermore's Rules",
        author: "Reminiscences of a Stock Operator",
        icon: "🏛️",
        rules: [
            { id: 'jl1', text: "Never average losses", emoji: "📉", category: "Risk Management" },
            { id: 'jl2', text: "Buy rising stocks, sell falling", emoji: "📈", category: "Trend Following" },
            { id: 'jl3', text: "Don't become an involuntary investor", emoji: "🛑", category: "Exit" },
            { id: 'jl4', text: "Money is made by sitting, not trading", emoji: "🧘", category: "Mindset" },
        ]
    },
    {
        title: "Mark Douglas",
        author: "Trading in the Zone",
        icon: "🧠",
        rules: [
            { id: 'md1', text: "I objectively identify my edges", emoji: "🔍", category: "Mindset" },
            { id: 'md2', text: "Predefine risk on every trade", emoji: "🛡️", category: "Risk Management" },
            { id: 'md3', text: "Completely accept the risk", emoji: "🤝", category: "Mindset" },
            { id: 'md4', text: "Act on edges without reservation", emoji: "⚡", category: "Execution" },
            { id: 'md5', text: "Pay myself as the market makes money available", emoji: "💰", category: "Exit" },
        ]
    },
    {
        title: "Van Tharp",
        author: "Trade Your Way to Financial Freedom",
        icon: "📊",
        rules: [
            { id: 'vt1', text: "Max 1R risk per trade", emoji: "1️⃣", category: "Position Sizing" },
            { id: 'vt2', text: "Cut losses immediately when hit", emoji: "✂️", category: "Risk Management" },
            { id: 'vt3', text: "Let profits run to target", emoji: "🏃", category: "Exit" },
        ]
    },
    {
        title: "Day Trading Basics",
        author: "RuleSci Default Library",
        icon: "⚡",
        rules: [
            { id: 'dt1', text: "Wait for confirmation candle", emoji: "🕯️", category: "Entry" },
            { id: 'dt2', text: "No revenge trading", emoji: "🚫", category: "Mindset" },
            { id: 'dt3', text: "Max 3 trades per session", emoji: "🔢", category: "Session" },
            { id: 'dt4', text: "Check higher timeframe first", emoji: "📅", category: "Analysis" },
        ]
    }
];

export default function RulesPage() {
    const { rules, trades, addRule, toggleRuleActive, addRuleFromLibrary, showToast } = useRuleSci();
    const [isCreating, setIsCreating] = useState(false);
    const [newRuleText, setNewRuleText] = useState('');
    const [newRuleEmoji, setNewRuleEmoji] = useState('🎯');

    // Generate smart suggestion based on recent history
    const { suggestedRule, reason: suggestionReason } = generateRuleSuggestions(trades, rules.filter(r => r.isActive));

    // Compute per-rule compliance from trade data
    const getRuleCompliance = (ruleId: string) => {
        const relevantTrades = trades.filter(t =>
            t.rules_followed.includes(ruleId) || t.rules_broken.includes(ruleId)
        );
        if (relevantTrades.length === 0) return null;
        const followed = relevantTrades.filter(t => t.rules_followed.includes(ruleId)).length;
        return Math.round((followed / relevantTrades.length) * 100);
    };

    const handleCreateRule = () => {
        if (!newRuleText.trim()) {
            showToast('Please enter a rule', 'error');
            return;
        }
        const rule = {
            id: `custom_${Date.now()}`,
            text: newRuleText.trim(),
            emoji: newRuleEmoji,
            category: 'Custom',
            isActive: true,
        };
        addRule(rule);
        showToast('Rule created!', 'success');
        setNewRuleText('');
        setNewRuleEmoji('🎯');
        setIsCreating(false);
    };

    const handleAddFromLibrary = (libRule: any) => {
        const alreadyExists = rules.find(r => r.text === libRule.text);
        if (alreadyExists) {
            showToast('Rule already active!', 'info');
            return;
        }
        addRuleFromLibrary({
            id: `lib_${Date.now()}_${libRule.id}`,
            text: libRule.text,
            emoji: libRule.emoji,
            category: libRule.category,
            isActive: true,
        });
        showToast(`Imported: ${libRule.text}`, 'success');
    };

    const emojiOptions = ['🎯', '🛡️', '🛑', '🧠', '📊', '⚡', '🔥', '💎', '🚀', '⏸️', '📅', '🕯️'];

    return (
        <div className="flex flex-col gap-12 pb-12">
            {/* Header */}
            <header>
                <h1 className="text-[22px] font-bold text-[#1a1a2e] mb-2">Rule Library</h1>
                <p className="text-base text-[#6b7280]">Manage your active framework or import rules from trading legends.</p>
            </header>

            {/* Active Rules List */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#1a1a2e]">Active Rules</h2>
                    <span className="text-sm font-bold text-[#9ca3af]">{rules.filter(r => r.isActive).length} Active</span>
                </div>

                <div className="flex flex-col gap-3">
                    
                    {/* AI Suggestion Banner */}
                    {suggestedRule && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-[#2563eb]/10 to-[#60a5fa]/10 border-2 border-[#2563eb]/20 rounded-[20px] p-5 mb-2 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full translate-x-10 translate-y-[-10px]" />
                            
                            <div className="flex items-start gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#2563eb]/30">
                                    <Sparkles size={18} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-[#1e3a8a] mb-1">AI Suggestion</h3>
                                    <p className="text-[13px] text-[#1e3a8a]/80 mb-3 leading-relaxed">
                                        {suggestionReason}
                                    </p>
                                    
                                    <div className="bg-white rounded-xl p-3 shadow-sm border border-[#2563eb]/10 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-lg shrink-0">{suggestedRule.emoji}</span>
                                            <span className="text-sm font-bold text-[#1a1a2e] truncate">{suggestedRule.text}</span>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const rule = {
                                                    id: `ai_suggested_${Date.now()}`,
                                                    text: suggestedRule.text!,
                                                    emoji: suggestedRule.emoji!,
                                                    category: suggestedRule.category!,
                                                    isActive: true,
                                                };
                                                addRule(rule);
                                                showToast('Smart rule adopted!', 'success');
                                            }}
                                            className="px-4 h-8 bg-[#2563eb] text-white text-[12px] font-bold rounded-lg flex items-center gap-1 shrink-0 hover:bg-[#1d4ed8] transition-colors shadow-sm"
                                        >
                                            Adopt <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {rules.length > 0 ? (
                        rules.map((rule) => {
                            const compliance = getRuleCompliance(rule.id);
                            return (
                                <div key={rule.id} className="bg-white rounded-2xl px-4 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#1a1a2e]/5 rounded-xl flex items-center justify-center text-xl shrink-0">
                                        {rule.emoji || '🎯'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className={`block text-[16px] font-semibold truncate ${rule.isActive ? 'text-[#1a1a2e]' : 'text-[#9ca3af] line-through'}`}>{rule.text}</span>
                                        <span className={`text-[11px] font-bold uppercase tracking-wider ${
                                            compliance === null ? 'text-[#9ca3af]' :
                                            compliance >= 80 ? 'text-[#22c55e]' :
                                            compliance >= 50 ? 'text-[#f59e0b]' : 'text-[#ef4444]'
                                        }`}>
                                            {compliance !== null ? `Followed ${compliance}% of time` : 'No trade data yet'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => toggleRuleActive(rule.id)}
                                        className={`w-10 h-6 shrink-0 rounded-full relative p-1 cursor-pointer transition-colors ${rule.isActive ? 'bg-[#2563eb]' : 'bg-[#9ca3af]/30'}`}
                                    >
                                        <motion.div
                                            animate={{ x: rule.isActive ? 16 : 0 }}
                                            className="w-4 h-4 bg-white rounded-full shadow-sm"
                                        />
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-[#6b7280]">No active rules yet. Add some from the library below.</p>
                        </div>
                    )}

                    {/* Create Your Own Rule */}
                    {isCreating ? (
                        <div className="bg-white rounded-[16px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col gap-3">
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {emojiOptions.map(e => (
                                    <button
                                        key={e}
                                        onClick={() => setNewRuleEmoji(e)}
                                        className={`text-xl w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${newRuleEmoji === e ? 'bg-[#2563eb]/10 ring-2 ring-[#2563eb]' : 'bg-[#1a1a2e]/5'}`}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={newRuleText}
                                onChange={(e) => setNewRuleText(e.target.value)}
                                placeholder="Type your rule..."
                                autoFocus
                                className="w-full h-12 bg-[#1a1a2e]/5 rounded-xl px-4 text-[15px] font-semibold text-[#1a1a2e] placeholder-[#9ca3af] focus:ring-2 focus:ring-[#2563eb] border-none outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateRule()}
                            />
                            <div className="flex gap-2">
                                <button onClick={() => setIsCreating(false)} className="flex-1 h-10 rounded-xl bg-[#1a1a2e]/5 text-[#6b7280] font-bold text-sm">
                                    Cancel
                                </button>
                                <button onClick={handleCreateRule} className="flex-1 h-10 rounded-xl bg-[#1a1a2e] text-white font-bold text-sm">
                                    Add Rule
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full h-16 rounded-[16px] border-2 border-dashed border-[#1a1a2e]/10 flex items-center justify-center gap-2 text-[#6b7280] font-bold hover:bg-[#1a1a2e]/5 transition-all"
                        >
                            <Plus size={20} />
                            Create Your Own Rule
                        </button>
                    )}
                </div>
            </section>

            {/* Open Source / Legend Libraries */}
            <section>
                <div className="mb-6 flex items-center gap-2">
                    <BookOpen size={20} className="text-[#1a1a2e]" />
                    <h2 className="text-xl font-bold text-[#1a1a2e]">Master Libraries</h2>
                </div>

                <div className="flex flex-col gap-8">
                    {MASTER_LIBRARIES.map((lib, i) => (
                        <div key={i} className="flex flex-col gap-4">
                            <div>
                                <h3 className="text-[17px] font-bold text-[#1a1a2e] flex items-center gap-2">
                                    {lib.icon} {lib.title}
                                </h3>
                                <p className="text-[13px] text-[#6b7280]">{lib.author}</p>
                            </div>

                            <div className="bg-white rounded-2xl border-2 border-[#1a1a2e]/5 overflow-hidden">
                                {lib.rules.map((rule, j) => {
                                    const alreadyAdded = rules.some(r => r.text === rule.text);
                                    return (
                                        <div key={rule.id} className={`flex items-center gap-3 p-4 ${j !== lib.rules.length - 1 ? 'border-b border-[#1a1a2e]/5' : ''}`}>
                                            <div className="text-lg w-8 flex-shrink-0 text-center">{rule.emoji}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14.5px] font-semibold text-[#1a1a2e]">{rule.text}</p>
                                                <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">{rule.category}</p>
                                            </div>
                                            <button
                                                disabled={alreadyAdded}
                                                onClick={() => !alreadyAdded && handleAddFromLibrary(rule)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${alreadyAdded ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#1a1a2e]/5 text-[#1a1a2e] hover:bg-[#1a1a2e]/10'}`}
                                            >
                                                {alreadyAdded ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={2.5} />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
