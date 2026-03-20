'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import { 
  Filter, 
  ChevronRight, 
  Search,
  Camera,
  Clock,
  BookOpen,
  Activity
} from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import DiaryScannerModal from '@/components/diary/DiaryScannerModal';

type ModeType = 'trades' | 'scans';
type FilterType = 'all' | 'wins' | 'losses' | 'today' | 'week' | 'month';

export default function JournalPage() {
    const { trades, diaryEntries, setCaptureOpen } = useRuleSci();
    const router = useRouter();
    const [mode, setMode] = useState<ModeType>('trades');
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const filteredTrades = useMemo(() => {
        let list = [...trades].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        if (selectedFilter === 'wins') list = list.filter(t => (t.pnl || 0) > 0);
        if (selectedFilter === 'losses') list = list.filter(t => (t.pnl || 0) < 0);
        
        const todayStr = new Date().toISOString().split('T')[0];
        if (selectedFilter === 'today') list = list.filter(t => t.date === todayStr);

        if (searchQuery) {
            list = list.filter(t => 
                t.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.notes?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return list;
    }, [trades, selectedFilter, searchQuery]);

    const filteredScans = useMemo(() => {
        return diaryEntries.filter(entry => 
            entry.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.date.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [diaryEntries, searchQuery]);

    const filters: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'Wins', value: 'wins' },
        { label: 'Losses', value: 'losses' },
        { label: 'Today', value: 'today' },
    ];

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col pb-[calc(env(safe-area-inset-bottom)+84px)] italic-none">
            {/* HEADER */}
            <header className="px-5 pt-8 mb-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-[32px] font-black text-[#1a1a2e]">Trading Log</h1>
                    <button 
                        onClick={() => mode === 'trades' ? setCaptureOpen(true) : setIsScannerOpen(true)}
                        className="w-12 h-12 bg-[#eab308] text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
                    >
                        {mode === 'trades' ? <Activity size={24} /> : <Camera size={24} />}
                    </button>
                </div>

                {/* MODE TOGGLE */}
                <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-6">
                    <button 
                        onClick={() => setMode('trades')}
                        className={`flex-1 h-12 rounded-xl text-[14px] font-black transition-all ${mode === 'trades' ? 'bg-white shadow-sm text-[#1a1a2e]' : 'text-gray-400'}`}
                    >
                        Trade Log
                    </button>
                    <button 
                        onClick={() => setMode('scans')}
                        className={`flex-1 h-12 rounded-xl text-[14px] font-black transition-all ${mode === 'scans' ? 'bg-white shadow-sm text-[#1a1a2e]' : 'text-gray-400'}`}
                    >
                        Scan Library
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${mode}...`}
                        className="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-4 text-[16px] font-bold text-[#1a1a2e] border-none outline-none focus:ring-1 focus:ring-[#eab308]/20"
                    />
                </div>
            </header>

            {mode === 'trades' && (
                <div className="flex gap-2 px-5 mb-6 overflow-x-auto no-scrollbar">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setSelectedFilter(f.value)}
                            className={`px-5 h-10 rounded-full whitespace-nowrap text-[12px] font-black transition-all ${
                                selectedFilter === f.value 
                                    ? 'bg-[#1a1a2e] text-white' 
                                    : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            )}

            <main className="px-5 flex-1 flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                    {mode === 'trades' ? (
                        filteredTrades.length > 0 ? filteredTrades.map((trade, idx) => (
                            <motion.button
                                key={trade.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => router.push(`/journal/${trade.id}`)}
                                className="card-premium flex flex-col gap-4 text-left group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-[17px] font-black text-[#1a1a2e] mb-1">{trade.pair}</h3>
                                        <p className="text-[12px] font-bold text-gray-400">{trade.date} • {trade.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[20px] font-black tabular-nums ${(trade.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {(trade.pnl || 0) >= 0 ? '+' : ''}{(trade.pnl || 0).toFixed(1)}R
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <div className="flex gap-1">
                                        {trade.rules_followed?.slice(0, 5).map((_, i) => (
                                            <div key={i} className="w-2 h-2 rounded-full bg-green-400" />
                                        ))}
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300" />
                                </div>
                            </motion.button>
                        )) : (
                            <EmptyState 
                                emoji="📖"
                                title="No trades found"
                                description="Log your executions to start tracking your trading discipline architecture."
                                action={{ label: "Log Trade", onClick: () => setCaptureOpen(true) }}
                            />
                        )
                    ) : (
                        filteredScans.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {filteredScans.map((entry, idx) => (
                                    <motion.div 
                                        key={entry.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col group active:scale-[0.98] transition-all"
                                    >
                                        <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                                            <img src={entry.imagePath} alt="Scan" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] font-black uppercase tracking-widest">
                                                {entry.type}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <span className="text-[13px] font-black text-[#1a1a2e] block truncate">{entry.date}</span>
                                            <span className="text-[10px] font-bold text-gray-300">Digtally Secured</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState 
                                emoji="📸"
                                title="Scan Library Empty"
                                description="Digitize your physical trading journals or hand-drawn charts."
                                action={{ label: "Scan Now", onClick: () => setIsScannerOpen(true) }}
                            />
                        )
                    )}
                </AnimatePresence>
            </main>

            <DiaryScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
        </div>
    );
}
