'use client';

import { useState } from 'react';
import { useRuleSci } from '@/lib/context';
import {
    PenLine,
    X,
    Plus,
    Calendar,
    Microscope,
} from 'lucide-react';
import { Observation } from '@/types/trading';

const states = [
    { key: 'controlled', label: 'Controlled' },
    { key: 'analytical', label: 'Clear Headed' },
    { key: 'reactive', label: 'Reactive' },
    { key: 'uncertain', label: 'Uncertain' },
    { key: 'aware', label: 'Self Aware' },
    { key: 'structured', label: 'Following Plan' },
];

export default function ObservePage() {
    const { observations, addObservation } = useRuleSci();
    const [writing, setWriting] = useState(false);
    const [form, setForm] = useState<Omit<Observation, 'id' | 'date'>>({
        title: '',
        content: '',
        state: 'analytical',
    });

    const handleSubmit = () => {
        if (!form.content.trim()) return;

        addObservation({
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            ...form,
        } as Observation);

        setForm({ title: '', content: '', state: 'analytical' });
        setWriting(false);
    };

    const startWriting = () => setWriting(true);
    const cancelWriting = () => {
        setWriting(false);
        setForm({ title: '', content: '', state: 'analytical' });
    };

    // Full-screen observation mode
    if (writing) {
        return (
            <div className="fixed inset-0 bg-[var(--bg-primary)] z-[200] flex flex-col p-8 animate-fade-in transition-base">
                <div className="flex items-center justify-between pb-6 border-b border-[var(--border-color)] flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <select
                            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full px-6 py-2.5 text-sm font-bold text-[var(--text-primary)] outline-none cursor-pointer appearance-none shadow-sm"
                            value={form.state}
                            onChange={(e) => setForm({ ...form, state: e.target.value })}
                        >
                            {states.map((s) => (
                                <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-base" onClick={cancelWriting}>
                            <X size={18} strokeWidth={2.5} /> Discard
                        </button>
                        <button className="primary bg-[var(--accent-primary)] text-[var(--bg-primary)] px-8 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2" onClick={handleSubmit}>
                            <PenLine size={18} strokeWidth={2.5} /> Save Entry
                        </button>
                    </div>
                </div>

                <div className="flex-1 max-w-[800px] mx-auto w-full py-20 flex flex-col overflow-y-auto">
                    <input
                        className="text-5xl font-bold text-[var(--text-primary)] border-none bg-transparent outline-none mb-10 tracking-tight placeholder:text-[var(--text-muted)] w-full"
                        type="text"
                        placeholder="Give your entry a title..."
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        autoFocus
                    />
                    <textarea
                        className="flex-1 text-[20px] leading-[1.8] text-[var(--text-secondary)] border-none bg-transparent outline-none resize-none placeholder:text-[var(--text-muted)] font-medium"
                        placeholder="Start writing your thoughts here. How are you feeling today? What patterns are you noticing in your behavior?"
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                    />
                </div>

                <div className="text-center text-sm font-bold text-[var(--text-muted)] py-6 flex-shrink-0">
                    {form.content.split(/\s+/).filter(Boolean).length} words
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up max-w-[960px] mx-auto pb-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">My Journal</h1>
                    <p className="text-[15px] text-[var(--text-secondary)] mt-1 font-medium">Clear your mind. Reflect on your trading behavior to stay sharp.</p>
                </div>
                <button
                    className="primary bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    onClick={startWriting}
                >
                    <Plus size={20} strokeWidth={2.5} /> Write Entry
                </button>
            </div>

            {/* Observation Prompt */}
            <div className="card-focus mb-10 p-10 flex flex-col items-center text-center gap-4 bg-[var(--bg-secondary)] border-[var(--accent-primary)]/10">
                <div className="w-12 h-12 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-full flex items-center justify-center mb-2">
                    <PenLine size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-[12px] font-bold text-[var(--accent-primary)] uppercase tracking-widest">Today's Reflection</h3>
                <p className="text-3xl font-bold text-[var(--text-primary)] leading-tight max-w-[600px] italic">
                    "What behavioral patterns am I repeating? Is it structural or reactive?"
                </p>
            </div>

            {/* Past Observations */}
            <div className="grid grid-cols-1 gap-6">
                {observations.map((obs) => (
                    <div key={obs.id} className="card p-10 flex flex-col gap-6 bg-[var(--bg-card)]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-muted)]">
                                <Calendar size={16} strokeWidth={2.5} />
                                {formatDate(obs.date)}
                            </div>
                            <span className="badge badge-neutral py-1.5 px-4 font-bold capitalize">{states.find(s => s.key === obs.state)?.label || obs.state}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{obs.title}</h3>
                        <p className="text-[17px] leading-relaxed text-[var(--text-secondary)] font-medium">{obs.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


function formatDate(dateStr: string) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
