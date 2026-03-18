'use client';

import { useState, useEffect } from 'react';
import { useRuleSci } from '@/lib/context';
import { X, FlaskConical, Clock } from 'lucide-react';

export default function LabMode() {
    const { setLabMode, session } = useRuleSci();
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const principles = [
        "Behavior stabilizes when observed without judgment.",
        "Structure precedes performance. Build the frame first.",
        "Impulse is data, not direction.",
        "The best execution is the one that follows process.",
        "If behavior is consistent, outcomes become predictable.",
    ];

    const principle = principles[Math.floor(Date.now() / 60000) % principles.length];

    const baselineLabels: Record<string, string> = {
        controlled: 'Controlled',
        neutral: 'Neutral',
        elevated: 'Elevated',
        reactive: 'Reactive',
        uncertain: 'Uncertain',
    };

    return (
        <div className="fixed inset-0 bg-[var(--bg-primary)] z-[100] flex items-center justify-center animate-fade-in transition-base">
            {/* Exit */}
            <button
                className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-base shadow-sm border border-[var(--border-color)]"
                onClick={() => setLabMode(false)}
            >
                <X size={24} strokeWidth={2.5} />
            </button>

            <div className="flex flex-col items-center gap-10 max-w-md text-center animate-fade-in-up">
                {/* Icon */}
                <div className="w-20 h-20 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-full flex items-center justify-center animate-pulse shadow-sm">
                    <FlaskConical size={32} strokeWidth={2.5} />
                </div>

                {/* Timer */}
                <div className="flex items-center gap-2 text-xl font-bold text-[var(--text-muted)] tabular-nums bg-[var(--bg-secondary)] px-6 py-2 rounded-full border border-[var(--border-color)]">
                    <Clock size={20} strokeWidth={2.5} />
                    <span>{formatTime(elapsed)}</span>
                </div>

                {/* Current state */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">Focus Session</h2>
                    <div className="flex flex-col gap-1">
                        <p className="text-[17px] font-bold text-[var(--text-secondary)]">
                            Mood: <span className="capitalize text-[var(--accent-primary)]">{baselineLabels[session.emotionalBaseline] || session.emotionalBaseline}</span>
                        </p>
                        <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {session.tradesTaken} of {session.tradesAllowed} trades taken
                        </p>
                    </div>
                </div>

                {/* Principle */}
                <div className="max-w-[360px] p-8 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] shadow-sm">
                    <p className="text-[17px] italic text-[var(--text-secondary)] leading-relaxed font-medium">"{principle}"</p>
                </div>

                {/* Status indicator */}
                <div className="flex flex-col items-center gap-4 mt-6">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent-primary)] animate-pulse">Session Active</span>
                </div>
            </div>
        </div>
    );
}

