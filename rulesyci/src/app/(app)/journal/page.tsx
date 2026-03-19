'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { 
  Filter, 
  ChevronRight, 
  Activity,
  History,
  Calendar
} from 'lucide-react';

import EmptyState from '@/components/ui/EmptyState';

type FilterType = 'all' | 'wins' | 'losses' | 'today' | 'week' | 'month';

export default function JournalPage() {
    const { trades, user, setCaptureOpen } = useRuleSci();
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTrades = useMemo(() => {
        let list = [...trades].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        
        if (selectedFilter === 'wins') list = list.filter(t => (t.pnl || 0) > 0);
        if (selectedFilter === 'losses') list = list.filter(t => (t.pnl || 0) < 0);
        
        const todayStr = new Date().toISOString().split('T')[0];
        if (selectedFilter === 'today') list = list.filter(t => t.date === todayStr);
        
        if (selectedFilter === 'month') {
            const currentMonth = new Date().getMonth();
            list = list.filter(t => new Date(t.date).getMonth() === currentMonth);
        }

        if (searchQuery) {
            list = list.filter(t => 
                t.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.notes?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return list;
    }, [trades, selectedFilter, searchQuery]);

    const filters: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'Wins', value: 'wins' },
        { label: 'Losses', value: 'losses' },
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'week' },
        { label: 'This Month', value: 'month' },
    ];

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col pb-[calc(env(safe-area-inset-bottom)+84px)] italic-none">
            {/* STICKY HEADER */}
            <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 flex flex-col px-5 py-3 gap-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-[20px] font-black text-[#1a1a2e]">Journal</h1>
                    <button className="w-10 h-10 flex items-center justify-center text-[#1a1a2e] bg-gray-50 rounded-full active:scale-90 transition-transform">
                        <Filter size={20} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="relative">
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search assets or notes..."
                        className="w-full h-[48px] bg-gray-50 rounded-2xl px-4 text-[16px] font-bold text-[#1a1a2e] placeholder:text-gray-300 border-none outline-none focus:ring-1 focus:ring-[#1a1a2e]/5"
                    />
                </div>
            </header>

            {/* FILTER CHIPS (Horizontal Scroll) */}
            <div className="flex gap-2 p-5 overflow-x-auto no-scrollbar scroll-smooth">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setSelectedFilter(f.value)}
                        className={`px-5 h-10 rounded-full whitespace-nowrap text-[13px] font-black transition-all ${
                            selectedFilter === f.value 
                                ? 'bg-[#1a1a2e] text-white shadow-lg' 
                                : 'bg-gray-50 text-gray-400'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <main className="px-5 flex-1 flex flex-col gap-4 pb-12">
                <AnimatePresence mode="popLayout">
                    {filteredTrades.length > 0 ? filteredTrades.map((trade, idx) => {
                        const tradePnl = trade.pnl || 0;
                        const isWin = tradePnl > 0;
                        return (
                            <motion.button
                                key={trade.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => router.push(`/journal/${trade.id}`)}
                                className="bg-white rounded-[24px] p-4 flex flex-col gap-4 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all text-left touch-manipulation group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-0.5">
                                        <h3 className="text-[16px] font-black text-[#1a1a2e] flex items-center gap-2">
                                            {trade.pair}
                                            <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                trade.type === 'Long' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {trade.type}
                                            </div>
                                        </h3>
                                        <span className="text-[11px] font-bold text-gray-400 lowercase">{trade.date}</span>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className={`text-[19px] font-black tabular-nums ${isWin ? 'text-green-500' : 'text-red-500'}`}>
                                            {isWin ? '+' : ''}${tradePnl}
                                        </span>
                                        <span className="text-[11px] font-black text-gray-300 uppercase tracking-tighter">
                                            {trade.pnlR ? `${trade.pnlR}R` : (isWin ? '2.4R' : '-1.0R')}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                                    <div className="flex gap-1.5 overflow-hidden">
                                       {/* Rule compliance dots */}
                                       {(trade.rules_followed || [1,2]).map((_, d) => (
                                           <div key={d} className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)] flex-shrink-0" />
                                       ))}
                                       {(trade.rules_broken || [3]).map((_, d) => (
                                           <div key={d} className="w-2 h-2 rounded-full bg-red-400 opacity-60 flex-shrink-0" />
                                       ))}
                                    </div>
                                    <p className="flex-1 ml-4 text-[12px] font-medium text-gray-400 line-clamp-1 italic truncate">
                                        &ldquo;{trade.notes || 'Execution was aligned with playbook breakout...'}&rdquo;
                                    </p>
                                    <ChevronRight size={14} className="text-gray-200 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.button>
                        );
                    }) : trades.length === 0 ? (
                        <div className="flex-1 flex flex-col justify-center">
                            <EmptyState 
                                emoji="📖"
                                title="The Beginning"
                                description="Your trading journal is empty. Every master started with a single log."
                                ctaText="Log First Trade"
                                onCtaClick={() => setCaptureOpen(true)}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center">
                            <EmptyState 
                                emoji="🔍"
                                title="No Matches"
                                description={`We couldn't find anything for "${searchQuery}". Try a different asset.`}
                                ctaText="Clear Search"
                                onCtaClick={() => setSearchQuery('')}
                            />
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
