'use client';

import { useState } from 'react';
import { useRuleSci } from '@/lib/context';
import {
    Plus,
    X,
    CheckCircle2,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import { BaselineState, Trade } from '@/types/trading';

const baselineOptions: BaselineState[] = ['controlled', 'neutral', 'elevated', 'reactive', 'uncertain'];

export default function TradeLogPage() {
    const { trades, addTrade, session } = useRuleSci();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<Omit<Trade, 'id' | 'date'>>({
        pair: '',
        type: 'Long',
        entry: '',
        exit: '',
        followedRules: true,
        emotion: 'neutral',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.pair || !form.entry) return;

        addTrade({
            id: Date.now(),
            date: session.date,
            ...form,
        } as Trade);

        setForm({
            pair: '',
            type: 'Long',
            entry: '',
            exit: '',
            followedRules: true,
            emotion: 'neutral',
            notes: '',
        });
        setShowForm(false);
    };

    // Group trades by date
    const grouped = trades.reduce<Record<string, Trade[]>>((acc, trade) => {
        if (!acc[trade.date]) acc[trade.date] = [];
        acc[trade.date].push(trade);
        return acc;
    }, {});

    return (
        <div className="animate-fade-in-up max-w-[960px] mx-auto pb-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">My Trades</h1>
                    <p className="text-[15px] text-[var(--text-secondary)] mt-1 font-medium">Your trading history. Reflection leads to growth.</p>
                </div>
                <button
                    className="primary bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? <X size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
                    {showForm ? 'Cancel' : 'Log a Trade'}
                </button>
            </div>

            {/* New Trade Form */}
            {showForm && (
                <form className="card p-10 mb-10 animate-fade-in-up shadow-lg" onSubmit={handleSubmit}>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8">Log a New Trade</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Instrument</label>
                            <input
                                className="w-full"
                                type="text"
                                placeholder="e.g. EUR/USD or BTC"
                                value={form.pair}
                                onChange={(e) => setForm({ ...form, pair: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Direction</label>
                            <div className="flex bg-[var(--bg-secondary)] rounded-xl p-1.5 border border-[var(--border-color)]">
                                <button
                                    type="button"
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-base ${form.type === 'Long' ? 'bg-[var(--bg-primary)] text-[var(--accent-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                        }`}
                                    onClick={() => setForm({ ...form, type: 'Long' })}
                                >
                                    <ArrowUpRight size={16} strokeWidth={2.5} /> Buy / Long
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-base ${form.type === 'Short' ? 'bg-[var(--bg-primary)] text-[var(--accent-danger)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                        }`}
                                    onClick={() => setForm({ ...form, type: 'Short' })}
                                >
                                    <ArrowDownRight size={16} strokeWidth={2.5} /> Sell / Short
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Entry Price</label>
                            <input
                                className="w-full"
                                type="text"
                                placeholder="Entry level"
                                value={form.entry}
                                onChange={(e) => setForm({ ...form, entry: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Exit Price</label>
                            <input
                                className="w-full"
                                type="text"
                                placeholder="Exit level"
                                value={form.exit}
                                onChange={(e) => setForm({ ...form, exit: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">My Mood</label>
                            <select
                                className="w-full cursor-pointer font-medium"
                                value={form.emotion}
                                onChange={(e) => setForm({ ...form, emotion: e.target.value as BaselineState })}
                            >
                                {baselineOptions.map((em) => (
                                    <option key={em} value={em}>{em.charAt(0).toUpperCase() + em.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Followed Rules?</label>
                            <div className="flex bg-[var(--bg-secondary)] rounded-xl p-1.5 border border-[var(--border-color)]">
                                <button
                                    type="button"
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-base ${form.followedRules ? 'bg-[var(--bg-primary)] text-[var(--accent-success)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                        }`}
                                    onClick={() => setForm({ ...form, followedRules: true })}
                                >
                                    <CheckCircle2 size={16} strokeWidth={2.5} /> Yes
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-base ${!form.followedRules ? 'bg-[var(--bg-primary)] text-[var(--accent-danger)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                        }`}
                                    onClick={() => setForm({ ...form, followedRules: false })}
                                >
                                    <AlertTriangle size={16} strokeWidth={2.5} /> No
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-10">
                        <label className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Notes & Reflection</label>
                        <textarea
                            className="w-full min-h-[120px] resize-none"
                            placeholder="What did you feel? Why did you enter? Did you follow your plan?"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="primary bg-[var(--accent-primary)] text-[var(--bg-primary)] px-10 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            <CheckCircle2 size={18} strokeWidth={2.5} /> Save Trade
                        </button>
                    </div>
                </form>
            )}

            {/* Trade List */}
            <div className="flex flex-col gap-12">
                {Object.entries(grouped).map(([date, dateTrades]) => (
                    <div key={date} className="flex flex-col gap-5">
                        <h4 className="text-[15px] font-bold text-[var(--text-muted)] border-b border-[var(--border-color)] pb-3 px-1">
                            {formatDate(date)}
                        </h4>
                        <div className="grid grid-cols-1 gap-5">
                            {dateTrades.map((trade) => (
                                <div key={trade.id} className="card p-8 flex flex-col gap-6 bg-[var(--bg-card)]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <span className="text-xl font-bold text-[var(--text-primary)]">{trade.pair}</span>
                                            <span className={`flex items-center gap-1.5 text-[15px] font-bold ${trade.type === 'Long' ? 'text-[var(--accent-primary)]' : 'text-[var(--accent-danger)]'
                                                }`}>
                                                {trade.type === 'Long' ? <ArrowUpRight size={18} strokeWidth={2.5} /> : <ArrowDownRight size={18} strokeWidth={2.5} />}
                                                {trade.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {trade.followedRules ? (
                                                <span className="badge badge-calm py-1.5 px-4">
                                                    <CheckCircle2 size={14} strokeWidth={2.5} /> Followed Rules
                                                </span>
                                            ) : (
                                                <span className="badge badge-deviation py-1.5 px-4 font-bold">
                                                    <AlertTriangle size={14} strokeWidth={2.5} /> Rules Broken
                                                </span>
                                            )}
                                            <span className="badge badge-neutral py-1.5 px-4 capitalize font-bold">{trade.emotion}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-10 text-[16px]">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Entry</span>
                                            <span className="text-[var(--text-primary)] font-bold">{trade.entry}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Exit</span>
                                            <span className="text-[var(--text-primary)] font-bold">{trade.exit}</span>
                                        </div>
                                    </div>
                                    {trade.notes && (
                                        <div className="border-t border-[var(--border-color)] pt-5">
                                            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed italic font-medium">
                                                "{trade.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
}
