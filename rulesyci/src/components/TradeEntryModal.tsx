'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import { X, TrendingUp, TrendingDown, MessageSquare, Target, Activity, ShieldCheck, Wand2, Mic, Camera } from 'lucide-react';
import type { BaselineState, Trade, Rule, Playbook } from '@/types/trading';
import { parseRoughNote } from '@/lib/agents/magicJournal';

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
    const { addTrade, rules, playbooks, showToast } = useRuleSci();

    const [pair, setPair] = useState('');
    const [direction, setDirection] = useState<'Long' | 'Short'>('Long');
    const [entry, setEntry] = useState('');
    const [exit, setExit] = useState('');
    const [plannedSL, setPlannedSL] = useState('');
    const [plannedTP, setPlannedTP] = useState('');
    const [pnl, setPnl] = useState('');
    const [moodBefore, setMoodBefore] = useState<BaselineState>('neutral');
    const [moodAfter, setMoodAfter] = useState<BaselineState>('neutral');
    const [setupQuality, setSetupQuality] = useState(7);
    const [selectedPlaybook, setSelectedPlaybook] = useState<string>(playbooks[0]?.id || '');
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
        if (parsedTrade.emotion) {
            setMoodBefore(parsedTrade.emotion);
            setMoodAfter(parsedTrade.emotion);
        }
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

        const pVal = parseFloat(pnl) || 0;
        const entryVal = parseFloat(entry);
        const slVal = parseFloat(plannedSL);
        const exitVal = parseFloat(exit);
        
        let rMultiple = 0;
        if (entryVal && slVal && exitVal) {
            const risk = Math.abs(entryVal - slVal);
            const reward = direction === 'Long' ? (exitVal - entryVal) : (entryVal - exitVal);
            rMultiple = risk > 0 ? reward / risk : 0;
        }

        const trade: Trade = {
            id: `trade_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            pair: pair.trim().toUpperCase(),
            type: direction,
            entry,
            exit,
            plannedSL,
            plannedTP,
            pnl: pVal,
            pnlR: parseFloat(rMultiple.toFixed(2)),
            rules_followed: rulesFollowed,
            rules_broken: rulesBroken,
            emotion: moodAfter,
            moodBefore,
            moodAfter,
            setupId: selectedPlaybook,
            setupQuality,
            notes,
        };

        addTrade(trade);
        showToast(`${pair.toUpperCase()} ${direction} trade logged!`, 'success');

        // Reset form
        setPair('');
        setDirection('Long');
        setEntry('');
        setExit('');
        setPlannedSL('');
        setPlannedTP('');
        setPnl('');
        setMoodBefore('neutral');
        setMoodAfter('neutral');
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
                            <div className="w-10 h-1 bg-[#1a1a2e]/10 rounded-full mx-auto mb-6" />

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#1a1a2e]">Log Trade</h2>
                                <button onClick={onClose} className="p-2 text-[#9ca3af] hover:text-[#1a1a2e]">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex bg-[#1a1a2e]/5 rounded-xl p-1 mb-6">
                                <button
                                    onClick={() => setActiveTab('manual')}
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-bold transition-all ${activeTab === 'manual' ? 'bg-white text-[#1a1a2e] shadow-sm' : 'text-[#6b7280]'}`}
                                >
                                    Step-by-Step
                                </button>
                                <button
                                    onClick={() => setActiveTab('magic')}
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-bold transition-all ${activeTab === 'magic' ? 'bg-white text-[#1a1a2e] shadow-sm' : 'text-[#6b7280]'}`}
                                >
                                    <Wand2 size={16} className={activeTab === 'magic' ? 'text-[#2563eb]' : ''} />
                                    Voice/Text Sync
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
                                                Easy Log
                                            </p>
                                            <p className="text-[#6b7280]">
                                                Just brain-dump your trade details. Our AI (GPT-4o simulated) will extract the pair, entry/exit, emotion, and auto-score your active rules.
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
                                            <div className="absolute bottom-3 right-3 flex gap-2">
                                                <div className="p-2 bg-white rounded-lg cursor-not-allowed hover:bg-gray-50 border border-gray-100 shadow-sm text-gray-400">
                                                    <Mic size={18} />
                                                </div>
                                                <div className="p-2 bg-white rounded-lg cursor-not-allowed hover:bg-gray-50 border border-gray-100 shadow-sm text-gray-400">
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
                                        <div className="flex gap-3 mb-5">
                                            <div className="flex-1">
                                                <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-1.5 block">Asset</label>
                                                <input
                                                    type="text"
                                                    value={pair}
                                                    onChange={(e) => setPair(e.target.value)}
                                                    placeholder="NIFTY / EURUSD"
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

                                        <div className="mb-5">
                                            <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-1.5 block">Playbook Setup</label>
                                            <select
                                                value={selectedPlaybook}
                                                onChange={(e) => setSelectedPlaybook(e.target.value)}
                                                className="w-full h-[48px] bg-[#1a1a2e]/5 rounded-xl px-4 text-[15px] font-semibold text-[#1a1a2e] focus:ring-2 focus:ring-[#2563eb] border-none outline-none appearance-none cursor-pointer"
                                            >
                                                {playbooks.map(pb => (
                                                    <option key={pb.id} value={pb.id}>{pb.name}</option>
                                                ))}
                                                <option value="none">No specific setup</option>
                                            </select>
                                        </div>

                                        <div className="bg-[#1a1a2e]/5 rounded-2xl p-4 mb-5">
                                            <h3 className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <Target size={12} /> Entry/Exit Rules
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-[#1a1a2e]/50 mb-1.5 block">Planned Entry</label>
                                                    <input
                                                        type="text"
                                                        value={entry}
                                                        onChange={(e) => setEntry(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full bg-white rounded-lg px-3 py-2 text-sm font-bold border border-[#1a1a2e]/5"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-[#1a1a2e]/50 mb-1.5 block">Planned SL</label>
                                                    <input
                                                        type="text"
                                                        value={plannedSL}
                                                        onChange={(e) => setPlannedSL(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full bg-white rounded-lg px-3 py-2 text-sm font-bold border border-[#1a1a2e]/5"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-[#1a1a2e]/50 mb-1.5 block">Actual Exit</label>
                                                    <input
                                                        type="text"
                                                        value={exit}
                                                        onChange={(e) => setExit(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full bg-white rounded-lg px-3 py-2 text-sm font-bold border border-[#1a1a2e]/5"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-[#1a1a2e]/50 mb-1.5 block">PnL (₹ / $)</label>
                                                    <input
                                                        type="text"
                                                        value={pnl}
                                                        onChange={(e) => setPnl(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full bg-white rounded-lg px-3 py-2 text-sm font-bold border border-[#1a1a2e]/5"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {activeRules.length > 0 && (
                                            <div className="mb-5">
                                                <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-2 block">Rule Execution</label>
                                                <div className="flex flex-col gap-2">
                                                    {activeRules.map((rule) => {
                                                        const followed = rulesFollowed.includes(rule.id);
                                                        const broken = rulesBroken.includes(rule.id);
                                                        return (
                                                            <div key={rule.id} className="flex items-center gap-2 bg-[#1a1a2e]/[0.03] rounded-xl p-3">
                                                                <span className="text-sm flex-shrink-0">{rule.emoji || '🎯'}</span>
                                                                <span className="text-[13px] font-semibold text-[#1a1a2e] flex-1 truncate">{rule.text}</span>
                                                                <div className="flex gap-1">
                                                                    <button
                                                                        onClick={() => toggleFollowed(rule.id)}
                                                                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${followed ? 'bg-[#22c55e] text-white' : 'bg-[#1a1a2e]/5 text-[#9ca3af]'}`}
                                                                    >
                                                                        Followed
                                                                    </button>
                                                                    <button
                                                                        onClick={() => toggleBroken(rule.id)}
                                                                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${broken ? 'bg-[#ef4444] text-white' : 'bg-[#1a1a2e]/5 text-[#9ca3af]'}`}
                                                                    >
                                                                        Broken
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-6 flex flex-col gap-6">
                                            <div>
                                                <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-3 block flex items-center gap-2">
                                                    <Activity size={12} className="text-[#2563eb]" /> How I was feeling before
                                                </label>
                                                <div className="flex justify-between gap-1.5">
                                                    {moods.map((m) => (
                                                        <button
                                                            key={m.value}
                                                            onClick={() => setMoodBefore(m.value)}
                                                            className={`flex flex-col items-center gap-1.5 flex-1 py-3 rounded-2xl transition-all border ${moodBefore === m.value ? 'bg-[#2563eb]/5 border-[#2563eb]' : 'bg-[#1a1a2e]/[0.02] border-transparent'}`}
                                                        >
                                                            <span className="text-lg">{m.emoji}</span>
                                                            <span className={`text-[8px] font-bold uppercase tracking-widest ${moodBefore === m.value ? 'text-[#2563eb]' : 'text-[#9ca3af]'}`}>
                                                                {m.label.split(' ')[0]}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider ml-1 mb-3 block flex items-center gap-2">
                                                    <ShieldCheck size={12} className="text-[#22c55e]" /> How I'm feeling now
                                                </label>
                                                <div className="flex justify-between gap-1.5">
                                                    {moods.map((m) => (
                                                        <button
                                                            key={m.value}
                                                            onClick={() => setMoodAfter(m.value)}
                                                            className={`flex flex-col items-center gap-1.5 flex-1 py-3 rounded-2xl transition-all border ${moodAfter === m.value ? 'bg-[#22c55e]/5 border-[#22c55e]' : 'bg-[#1a1a2e]/[0.02] border-transparent'}`}
                                                        >
                                                            <span className="text-lg">{m.emoji}</span>
                                                            <span className={`text-[8px] font-bold uppercase tracking-widest ${moodAfter === m.value ? 'text-[#22c55e]' : 'text-[#9ca3af]'}`}>
                                                                {m.label.split(' ')[0]}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

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
