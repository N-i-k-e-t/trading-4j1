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
    const { trades, diaryEntries, setCaptureOpen, setCaptureMode } = useRuleSci();
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
        <div className="min-h-[100dvh] bg-white flex flex-col pb-[calc(env(safe-area-inset-bottom)+110px)] italic-none overflow-x-hidden">
            {/* HEADER */}
            <header className="px-5 pt-[calc(env(safe-area-inset-top)+20px)] mb-8">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex flex-col">
                        <h1 className="text-[38px] font-black text-[#1a1a2e] leading-none mb-1 tracking-tighter">Trade <br/> Journal.</h1>
                        <p className="text-[14px] font-bold text-gray-400 uppercase tracking-widest pl-1">My Trading History</p>
                    </div>
                    <button 
                        onClick={() => {
                            if (mode === 'trades') {
                                setCaptureMode('checklist');
                                setCaptureOpen(true);
                            } else {
                                setIsScannerOpen(true);
                            }
                        }}
                        className="w-16 h-16 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all"
                    >
                        {mode === 'trades' ? <Activity size={28} strokeWidth={2.5} /> : <Camera size={28} strokeWidth={2.5} />}
                    </button>
                </div>

                {/* MODE TOGGLE - PREMIUM STYLE */}
                <div className="flex bg-gray-50 p-2 rounded-[32px] mb-8 border border-gray-100/50 shadow-inner">
                    <button 
                        onClick={() => setMode('trades')}
                        className={`flex-1 h-14 rounded-[24px] text-[15px] font-black transition-all ${mode === 'trades' ? 'bg-[#1a1a2e] shadow-xl text-white' : 'text-gray-300'}`}
                    >
                        Trade Log
                    </button>
                    <button 
                        onClick={() => setMode('scans')}
                        className={`flex-1 h-14 rounded-[24px] text-[15px] font-black transition-all ${mode === 'scans' ? 'bg-[#1a1a2e] shadow-xl text-white' : 'text-gray-300'}`}
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

                <div className="flex gap-3 px-5 mb-8 overflow-x-auto no-scrollbar">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setSelectedFilter(f.value)}
                            className={`px-7 h-11 rounded-full whitespace-nowrap text-[13px] font-black transition-all ${
                                selectedFilter === f.value 
                                    ? 'bg-[#1a1a2e] text-white shadow-lg' 
                                    : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

            <main className="px-5 flex-1 flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                    {mode === 'trades' ? (
                        filteredTrades.length > 0 ? (
                            filteredTrades.map((trade) => (
                                <motion.button
                                    key={trade.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => router.push(`/journal/${trade.id}`)}
                                    className="p-6 bg-white rounded-[40px] border border-gray-50 shadow-sm flex flex-col gap-5 text-left group active:scale-[0.98] transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-[18px] font-black text-[#1a1a2e] mb-1 leading-tight">{trade.pair}</h3>
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{trade.date} • {trade.type}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className={`text-[22px] font-black tabular-nums leading-none mb-1 ${(trade.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {(trade.pnl || 0) >= 0 ? '+' : ''}{(trade.pnl || 0).toFixed(1)}R
                                            </span>
                                            <div className={`w-8 h-1 bg-current opacity-20 rounded-full ${(trade.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50/50">
                                        <div className="flex gap-1.5">
                                            {trade.rules_followed?.slice(0, 5).map((_, i) => (
                                                <div key={i} className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                                            ))}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                                            <ChevronRight size={16} strokeWidth={3} />
                                        </div>
                                    </div>
                                </motion.button>
                            ))
                        ) : (
                            <div className="p-12 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center text-center gap-4 py-20">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl">📖</div>
                                <h3 className="text-[18px] font-black text-[#1a1a2e]">No trades yet today.</h3>
                                <p className="text-[14px] font-bold text-gray-400">After your next trade, tap here to log it. It takes 30 seconds.</p>
                                <button 
                                    onClick={() => {
                                        setCaptureMode('checklist');
                                        setCaptureOpen(true);
                                    }}
                                    className="bg-[#1a1a2e] text-white px-8 h-12 rounded-full font-black text-[13px] uppercase tracking-widest mt-2"
                                >
                                    Log My First Trade
                                </button>
                            </div>
                        )
                    ) : (
                        filteredScans.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {filteredScans.map((entry) => (
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
                                            <span className="text-[10px] font-bold text-gray-300">Digitally Secured</span>
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
