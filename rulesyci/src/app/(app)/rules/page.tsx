'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import { 
    Plus, 
    GripVertical, 
    ChevronDown, 
    Search,
    BookOpen,
    Menu,
    ChevronRight,
    X,
    Target
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

type Tab = 'active' | 'library';
type Category = 'All' | 'Psychology' | 'Risk' | 'Entry' | 'Exit' | 'Sizing';

const LIBRARY_SECTIONS = [
    {
        title: "📖 Livermore",
        category: "Risk",
        rules: [
            { text: "Never average losses", emoji: "📉", category: "Risk" },
            { text: "Buy rising stocks, sell falling", emoji: "📈", category: "Entry" },
            { text: "Speculation is a hard business", emoji: "🏛️", category: "Psychology" },
        ]
    },
    {
        title: "🧠 Douglas",
        category: "Psychology",
        rules: [
            { text: "Predefine risk on every trade", emoji: "🛡️", category: "Risk" },
            { text: "Completely accept the risk", emoji: "🤝", category: "Psychology" },
            { text: "Act on edges without reservation", emoji: "⚡", category: "Entry" },
        ]
    },
    {
        title: "📐 Van Tharp",
        category: "Sizing",
        rules: [
            { text: "Focus on R-multiples", emoji: "🔢", category: "Sizing" },
            { text: "Your bias is the enemy", emoji: "🧠", category: "Psychology" },
        ]
    },
    {
        title: "🎯 Day Trading",
        category: "Entry",
        rules: [
            { text: "No trades in first 15 mins", emoji: "🕘", category: "Entry" },
            { text: "Max 3 trades per day", emoji: "🔢", category: "Sizing" },
            { text: "Exit all positions before close", emoji: "🔔", category: "Exit" },
        ]
    }
];

export default function RulesPage() {
    const { 
        rules, 
        addRule, 
        removeRule, 
        toggleRuleActive, 
        dailyLogs, 
        showToast 
    } = useRuleSci();
    
    const [activeTab, setActiveTab] = useState<Tab>('active');
    const [libCategory, setLibCategory] = useState<Category>('All');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
    // Bottom Sheet Form State
    const [ruleText, setRuleText] = useState('');
    const [ruleEmoji, setRuleEmoji] = useState('🎯');
    const [ruleCategory, setRuleCategory] = useState<Category>('Psychology');

    const activeRules = useMemo(() => rules.filter(r => r.isActive !== false), [rules]);

    // Compliance logic: Followed X/30 days
    const getCompliance = (ruleId: string) => {
        const last30Days = Array.from({ length: 30 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        });

        const followedDays = dailyLogs.filter(log => 
            last30Days.includes(log.date) && log.rulesChecked.includes(ruleId)
        ).length;

        const percentage = Math.round((followedDays / 30) * 100);
        return { count: followedDays, percent: percentage };
    };

    const handleSaveRule = () => {
        if (!ruleText.trim()) return;
        addRule({
            id: `rule_${Date.now()}`,
            text: ruleText,
            emoji: ruleEmoji,
            category: ruleCategory,
            isActive: true
        });
        showToast('Rule added to your system', 'success');
        setRuleText('');
        setIsSheetOpen(false);
    };

    const emojiOptions = ['🎯', '🛡️', '🧠', '📉', '📈', '🤝', '⚡', '🔢', '🔔', '🌍', '📊', '🕯️'];

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col italic-none pb-[calc(env(safe-area-inset-bottom)+84px)]">
            {/* STICKY HEADER */}
            <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 flex flex-col px-5 pt-3">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-[20px] font-black text-[#1a1a2e]">My Rules</h1>
                    <button 
                        onClick={() => setIsSheetOpen(true)}
                        className="h-10 px-5 rounded-full bg-[#1a1a2e] text-white text-[13px] font-black flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-[#1a1a2e]/10"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Add Rule
                    </button>
                </div>
                
                {/* TABS */}
                <div className="flex w-full">
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 py-3 text-[14px] font-black transition-all border-b-2 ${activeTab === 'active' ? 'border-[#1a1a2e] text-[#1a1a2e]' : 'border-transparent text-gray-300'}`}
                    >
                        Active Rules
                    </button>
                    <button 
                        onClick={() => setActiveTab('library')}
                        className={`flex-1 py-3 text-[14px] font-black transition-all border-b-2 ${activeTab === 'library' ? 'border-[#1a1a2e] text-[#1a1a2e]' : 'border-transparent text-gray-300'}`}
                    >
                        Rule Library
                    </button>
                </div>
            </header>

            <main className="px-5 flex-1 pt-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'active' ? (
                        <motion.div 
                            key="active"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex flex-col gap-2"
                        >
                            {activeRules.length > 0 ? activeRules.map((rule) => {
                                const stats = getCompliance(rule.id);
                                return (
                                    <div 
                                        key={rule.id}
                                        className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-4 group active:bg-gray-50 transition-colors"
                                    >
                                        <div className="text-gray-200 cursor-grab active:cursor-grabbing">
                                            <GripVertical size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xl">{rule.emoji}</span>
                                                <span className="text-[15px] font-black text-[#1a1a2e] leading-tight line-clamp-2">{rule.text}</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-400">
                                                Followed {stats.count}/30 days ({stats.percent}%)
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => toggleRuleActive(rule.id)}
                                            className={`w-[52px] h-[32px] rounded-full p-1.5 transition-colors duration-300 flex items-center ${rule.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${rule.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                );
                            }) : (
                                <div className="py-12">
                                    <EmptyState 
                                        emoji="📔"
                                        title="Rulebook Pending"
                                        description="You haven't defined any trading rules yet. Systemization is the key to profit."
                                        ctaText="Browse Library"
                                        onCtaClick={() => setActiveTab('library')}
                                    />
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="library"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex flex-col gap-6"
                        >
                            {/* CATEGORY CHIPS */}
                            <div className="flex gap-2 -mx-5 px-5 overflow-x-auto no-scrollbar">
                                {['All', 'Psychology', 'Risk', 'Entry', 'Exit', 'Sizing'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setLibCategory(cat as Category)}
                                        className={`px-4 py-2 rounded-full whitespace-nowrap text-[12px] font-black transition-all ${libCategory === cat ? 'bg-[#1a1a2e] text-white' : 'bg-gray-50 text-gray-400'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {LIBRARY_SECTIONS.map((section, idx) => {
                                const visibleRules = section.rules.filter(r => libCategory === 'All' || r.category === libCategory);
                                if (visibleRules.length === 0) return null;

                                return (
                                    <div key={idx} className="flex flex-col gap-3">
                                        <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest px-1">{section.title}</h3>
                                        <div className="flex flex-col gap-2">
                                            {visibleRules.map((rule, j) => {
                                                const isAdded = rules.some(r => r.text === rule.text);
                                                return (
                                                    <div key={j} className="bg-gray-50/50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xl">{rule.emoji}</span>
                                                            <p className="text-[14px] font-bold text-[#1a1a2e]">{rule.text}</p>
                                                        </div>
                                                        <button 
                                                            disabled={isAdded}
                                                            onClick={() => {
                                                                addRule({ id: `lib_${Date.now()}_${j}`, ...rule, isActive: true });
                                                                showToast('Rule Imported', 'success');
                                                            }}
                                                            className={`px-3 h-8 rounded-full text-[11px] font-black transition-all ${isAdded ? 'text-green-600 bg-green-50' : 'bg-white border border-gray-200 text-[#1a1a2e]'}`}
                                                        >
                                                            {isAdded ? 'Added ✓' : '+ Add'}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ADD RULE BOTTOM SHEET */}
            <AnimatePresence>
                {isSheetOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSheetOpen(false)}
                            className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[2px]"
                        />
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 right-0 bottom-0 z-[160] bg-white rounded-t-[32px] p-6 pb-[calc(env(safe-area-inset-bottom)+24px)] flex flex-col gap-6"
                        >
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto" />
                            <div className="flex items-center justify-between">
                                <h2 className="text-[18px] font-black text-[#1a1a2e]">Create Rule</h2>
                                <button onClick={() => setIsSheetOpen(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* EMOJI PICKER */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {emojiOptions.map(e => (
                                    <button 
                                        key={e}
                                        onClick={() => setRuleEmoji(e)}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-all ${ruleEmoji === e ? 'bg-[#1a1a2e] shadow-lg scale-110' : 'bg-gray-50'}`}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest px-1">Rule Detail</label>
                                    <textarea 
                                        value={ruleText}
                                        onChange={(e) => setRuleText(e.target.value)}
                                        placeholder="e.g. Never risk more than 2% per trade"
                                        className="w-full bg-gray-50 rounded-2xl p-4 text-[15px] font-bold text-[#1a1a2e] border-none focus:ring-2 focus:ring-[#1a1a2e] min-h-[100px] outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest px-1">Category</label>
                                    <div className="relative">
                                        <select 
                                            value={ruleCategory}
                                            onChange={(e) => setRuleCategory(e.target.value as Category)}
                                            className="w-full bg-gray-50 rounded-2xl px-4 h-14 text-[15px] font-bold text-[#1a1a2e] border-none focus:ring-2 focus:ring-[#1a1a2e] outline-none appearance-none"
                                        >
                                            {['Psychology', 'Risk', 'Entry', 'Exit', 'Sizing'].map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <button 
                                    onClick={handleSaveRule}
                                    className="w-full h-14 bg-[#1a1a2e] text-white rounded-full font-black text-[16px] shadow-xl shadow-[#1a1a2e]/20 active:scale-95 transition-all mt-4"
                                >
                                    Save Rule
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
