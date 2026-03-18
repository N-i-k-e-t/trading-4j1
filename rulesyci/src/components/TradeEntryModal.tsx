'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import { X, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';
import type { BaselineState, Trade, Rule } from '@/types/trading';
import { parseRoughNote } from '@/lib/agents/magicJournal';
import { Wand2, Mic, Camera } from 'lucide-react';

const moods: { label: string; emoji: string; value: BaselineState }[] = [
    { label: "Very Bad", emoji: "😢", value: "very_bad" },
    { label: "Bad", emoji: "😕", value: "bad" },
    { label: "Neutral", emoji: "😐", value: "neutral" },
    { label: "Good", emoji: "🙂", value: "good" },
    { label: "Great", emoji: "😄", value: "great" },
];

interface TradeEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TradeEntryModal({ isOpen, onClose }: TradeEntryModalProps) {
    const { addTrade, rules, showToast } = useRuleSci();

    const [pair, setPair] = useState('');
    const [direction, setDirection] = useState<'Long' | 'Short'>('Long');
    const [entry, setEntry] = useState('');
    const [exit, setExit] = useState('');
    const [selectedMood, setSelectedMood] = useState<BaselineState>('neutral');
    const [notes, setNotes] = useState('');
    const [rulesFollowed, setRulesFollowed] = useState<string[]>([]);
    const [rulesBroken, setRulesBroken] = useState<string[]>([]);

    const [activeTab, setActiveTab] = useState<'manual' | 'magic'>('manual');
    const [roughNote, setRoughNote] = useState('');
    const [isParsing, setIsParsing] = useState(false);

    const activeRules = rules.filter((r: Rule) => r.isActive);

    const handleMagicParse = async () => {
        if (!roughNote.trim()) {
            showToast('Please type your raw notes first', 'error');
            return;
        }
        setIsParsing(true);
        const { parsedTrade, detectedFollowed, detectedBroken } = await parseRoughNote(roughNote, activeRules);
        setIsParsing(false);

        // Populate fields
        if (parsedTrade.pair && parsedTrade.pair !== "UNKNOWN") setPair(parsedTrade.pair);
        if (parsedTrade.type) setDirection(parsedTrade.type);
        if (parsedTrade.entry) setEntry(parsedTrade.entry);
        if (parsedTrade.exit) setExit(parsedTrade.exit);
        if (parsedTrade.emotion) setSelectedMood(parsedTrade.emotion);
        if (parsedTrade.notes) setNotes(parsedTrade.notes);
        
        setRulesFollowed(detectedFollowed);
        setRulesBroken(detectedBroken);

        showToast('AI successfully extracted structured data! Please review.', 'success');
        setActiveTab('manual'); // Switch to review mode
    };

    const toggleFollowed = (id: string) => {
        if (rulesFollowed.includes(id)) {
            setRulesFollowed(prev => prev.filter(r => r !== id));
        } else {
            setRulesFollowed(prev => [...prev, id]);
            setRulesBroken(prev => prev.filter(r => r !== id));
        }
    };

    const toggleBroken = (id: string) => {
        if (rulesBroken.includes(id)) {
            setRulesBroken(prev => prev.filter(r => r !== id));
        } else {
            setRulesBroken(prev => [...prev, id]);
            setRulesFollowed(prev => prev.filter(r => r !== id));
        }
    };

    const handleSubmit = () => {
        if (!pair.trim()) {
            showToast('Please enter a trading pair', 'error');
            return;
        }

        const trade: Trade = {
            id: `trade_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            pair: pair.trim().toUpperCase(),
            type: direction,
            entry,
            exit,
            rules_followed: rulesFollowed,
            rules_broken: rulesBroken,
            emotion: selectedMood,
            notes,
        };

        addTrade(trade);
        showToast(`${pair.toUpperCase()} ${direction} trade logged!`, 'success');

        // Reset form
        setPair('');
        setDirection('Long');
        setEntry('');
        setExit('');
        setSelectedMood('neutral');
        setNotes('');
        setRulesFollowed([]);
        setRulesBroken([]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 z-[150] backdrop-blur-sm"
                    />
                    {/* Modal */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[160] bg-white rounded-t-[32px] max-h-[90vh] overflow-y-auto"
                        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
                    >
                        <div className="p-6">
                            {/* Handle bar */}
                            <div className="w-10 h-1 bg-[#1a1a2e]/10 rounded-full mx-auto mb-6" />

                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#1a1a2e]">Log Trade</h2>
                                <button onClick={onClose} className="p-2 text-[#9ca3af] hover:text-[#1a1a2e]">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex bg-[#1a1a2e]/5 rounded-xl p-1 mb-6">
                                <button
                                    onClick={() => setActiveTab('manual')}
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-bold transition-all ${activeTab === 'manual' ? 'bg-white text-[#1a1a2e] shadow-sm' : 'text-[#6b7280]'}`}
                                >
                                    Detailed Log
                                </button>
                                <button
                                    onClick={() => setActiveTab('magic')}
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-bold transition-all ${activeTab === 'magic' ? 'bg-white text-[#1a1a2e] shadow-sm' : 'text-[#6b7280]'}`}
                                >
                                    <Wand2 size={16} className={activeTab === 'magic' ? 'text-[#2563eb]' : ''} />
                                    AI Magic Scan
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'magic' ? (
                                    <motion.div
                                        key="magic"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col gap-5"
                                    >
                                        <div className="bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-xl p-4 text-[#1a1a2e] text-sm leading-relaxed">
                                            <p className="font-bold flex items-center gap-2 mb-1">
                                                <Wand2 size={16} className="text-[#2563eb]" />
                                                Rough Note Parser
                                            </p>
                                            <p className="text-[#6b7280]">
                                                Just brain-dump your trade details. Our AI (GPT-4o simulated) will extract the pair, entry/exit, emotion, and auto-score your active rules.
                                            </p>
                                            <p className="text-[#9ca3af] text-[11px] font-bold mt-2 uppercase tracking-wide">
                                                Example: "took a long NIFTY at 24100, SL was 24050, but i moved it..."
                                            </p>
                                        </div>

                                        <div className="relative">
                                            <textarea
                                                value={roughNote}
                                                onChange={(e) => setRoughNote(e.target.value)}
                                                placeholder="Speak or type your rough trading note..."
                                                rows={5}
                                                className="w-full bg-[#1a1a2e]/5 border-2 border-transparent focus:border-[#2563eb]/30 rounded-xl px-4 py-3 text-[15px] font-medium text-[#1a1a2e] placeholder-[#9ca3af] outline-none transition-all resize-none shadow-inner"
                                            />
                                            {/* Fake multimedia buttons purely for UI demonstration */}
                                            <div className="absolute bottom-3 right-3 flex gap-2">
                                                <div className="p-2 bg-white rounded-lg cursor-not-allowed hover:bg-gray-50 border border-gray-100 shadow-sm text-gray-400 hint-group relative" title="Whisper Voice STT (Coming Soon)">
                                                    <Mic size={18} />
                                                </div>
                                                <div className="p-2 bg-white rounded-lg cursor-not-allowed hover:bg-gray-50 border border-gray-100 shadow-sm text-gray-400 hint-group relative" title="Chart Photo Parse (Coming Soon)">
                                                    <Camera size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleMagicParse}
                                            disabled={isParsing || !roughNote.trim()}
                                            className="w-full h-[52px] bg-[#2563eb] text-white font-bold rounded-full shadow-lg shadow-[#2563eb]/20 active:scale-[0.98] transition-transform text-[15px] flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isParsing ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Wand2 size={18} />
                                                    Extract Structured Data
                                                </>
                                            )}
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="manual"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        {/* Pair + Direction */}
                                        <div className="flex gap-3 mb-5">
                                            <div className="flex-1">
                                                <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-1.5 block">Pair</label>
                                                <input
                                                    type="text"
                                                    value={pair}
                                                    onChange={(e) => setPair(e.target.value)}
                                                    placeholder="EUR/USD"
                                                    className="w-full h-[48px] bg-[#1a1a2e]/5 rounded-xl px-4 text-[15px] font-semibold text-[#1a1a2e] placeholder-[#9ca3af] focus:ring-2 focus:ring-[#2563eb] border-none outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-1.5 block">Direction</label>
                                                <div className="flex h-[48px] bg-[#1a1a2e]/5 rounded-xl overflow-hidden">
                                                    <button
                                                        onClick={() => setDirection('Long')}
                                                        className={`px-5 text-[13px] font-bold transition-all ${direction === 'Long' ? 'bg-[#22c55e] text-white' : 'text-[#6b7280]'}`}
                                                    >
                                                        Long
                                                    </button>
                                                    <button
                                                        onClick={() => setDirection('Short')}
                                                        className={`px-5 text-[13px] font-bold transition-all ${direction === 'Short' ? 'bg-[#ef4444] text-white' : 'text-[#6b7280]'}`}
                                                    >
                                                        Short
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                            {/* Entry / Exit */}
                            <div className="flex gap-3 mb-5">
                                <div className="flex-1">
                                    <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-1.5 block">Entry</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={entry}
                                        onChange={(e) => setEntry(e.target.value)}
                                        placeholder="0.0000"
                                        className="w-full h-[48px] bg-[#1a1a2e]/5 rounded-xl px-4 text-[15px] font-semibold text-[#1a1a2e] placeholder-[#9ca3af] focus:ring-2 focus:ring-[#2563eb] border-none outline-none"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-1.5 block">Exit</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={exit}
                                        onChange={(e) => setExit(e.target.value)}
                                        placeholder="0.0000"
                                        className="w-full h-[48px] bg-[#1a1a2e]/5 rounded-xl px-4 text-[15px] font-semibold text-[#1a1a2e] placeholder-[#9ca3af] focus:ring-2 focus:ring-[#2563eb] border-none outline-none"
                                    />
                                </div>
                            </div>

                            {/* Rules Followed / Broken */}
                            {activeRules.length > 0 && (
                                <div className="mb-5">
                                    <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-2 block">Rules Compliance</label>
                                    <div className="flex flex-col gap-2">
                                        {activeRules.map((rule) => {
                                            const followed = rulesFollowed.includes(rule.id);
                                            const broken = rulesBroken.includes(rule.id);
                                            return (
                                                <div key={rule.id} className="flex items-center gap-2 bg-[#1a1a2e]/[0.03] rounded-xl p-3">
                                                    <span className="text-sm flex-shrink-0">{rule.emoji || '🎯'}</span>
                                                    <span className="text-[13px] font-semibold text-[#1a1a2e] flex-1 truncate">{rule.text}</span>
                                                    <button
                                                        onClick={() => toggleFollowed(rule.id)}
                                                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${followed ? 'bg-[#22c55e] text-white' : 'bg-[#1a1a2e]/5 text-[#9ca3af]'}`}
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={() => toggleBroken(rule.id)}
                                                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${broken ? 'bg-[#ef4444] text-white' : 'bg-[#1a1a2e]/5 text-[#9ca3af]'}`}
                                                    >
                                                        ✗
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Mood */}
                            <div className="mb-5">
                                <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-2 block">Mood During Trade</label>
                                <div className="flex justify-between gap-2">
                                    {moods.map((m) => (
                                        <button
                                            key={m.value}
                                            onClick={() => setSelectedMood(m.value)}
                                            className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-all ${selectedMood === m.value
                                                ? 'bg-[#2563eb]/10 ring-2 ring-[#2563eb]'
                                                : 'bg-[#1a1a2e]/5'
                                                }`}
                                        >
                                            <span className="text-lg">{m.emoji}</span>
                                            <span className={`text-[9px] font-bold uppercase ${selectedMood === m.value ? 'text-[#2563eb]' : 'text-[#9ca3af]'}`}>
                                                {m.label.split(' ')[0]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mb-6">
                                <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-1.5 block">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="What happened? What did you learn?"
                                    rows={3}
                                    className="w-full bg-[#1a1a2e]/5 rounded-xl px-4 py-3 text-[14px] text-[#1a1a2e] placeholder-[#9ca3af] resize-none focus:ring-2 focus:ring-[#2563eb] border-none outline-none"
                                />
                            </div>

                                        {/* Submit */}
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full h-[52px] bg-[#1a1a2e] text-white font-bold rounded-full shadow-lg active:scale-[0.98] transition-transform text-[15px]"
                                        >
                                            Save Trade
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
