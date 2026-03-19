'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import { 
    Camera, 
    ChevronRight, 
    Clock, 
    FileText, 
    MoreVertical,
    Search
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import DiaryScannerModal from '@/components/diary/DiaryScannerModal';

export default function DiaryHistoryPage() {
    const { diaryEntries, setCaptureOpen } = useRuleSci();
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEntries = diaryEntries.filter(entry => 
        entry.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col pb-[calc(env(safe-area-inset-bottom)+84px)] italic-none">
            {/* STICKY HEADER */}
            <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 pt-3 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-[20px] font-black text-[#1a1a2e]">Diary Scans</h1>
                    <button 
                        onClick={() => setIsScannerOpen(true)}
                        className="w-10 h-10 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
                    >
                        <Camera size={20} />
                    </button>
                </div>
                
                {/* MOBILE STATS GRID (Stacked) */}
                <div className="flex flex-col gap-2 mb-4">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Pages Scanned</span>
                        <span className="text-[18px] font-black text-[#1a1a2e] tabular-nums">{diaryEntries.length}</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col gap-1 border border-gray-100">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rule Extracts</span>
                            <span className="text-[16px] font-black text-[#1a1a2e] tabular-nums">
                                {diaryEntries.reduce((acc, e) => acc + (e.status === 'reviewed' ? 3 : 0), 0)}
                            </span>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col gap-1 border border-gray-100">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Efficiency</span>
                            <span className="text-[16px] font-black text-green-600 tabular-nums">
                                {diaryEntries.length > 0 ? '98%' : '0%'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search scans..."
                        className="w-full h-12 bg-gray-50 rounded-2xl pl-12 pr-4 text-[14px] font-bold text-[#1a1a2e] border-none outline-none focus:ring-1 focus:ring-[#1a1a2e]/5 placeholder:text-gray-300"
                    />
                </div>
            </header>

            <main className="flex-1 px-5 pt-6">
                <AnimatePresence mode="popLayout">
                    {diaryEntries.length === 0 ? (
                        <div className="h-full flex flex-col justify-center py-20">
                            <EmptyState 
                                emoji="📸"
                                title="Digital Memories"
                                description="Your scan library is empty. Snap your physical charts or journal pages to digitize them."
                                ctaText="Scan Page"
                                onCtaClick={() => setIsScannerOpen(true)}
                            />
                        </div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="h-full flex flex-col justify-center py-20">
                            <EmptyState 
                                emoji="🔍"
                                title="Safe & Sound"
                                description={`No scans found for "${searchQuery}". They might be under a different category.`}
                                ctaText="Reset Search"
                                onCtaClick={() => setSearchQuery('')}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {filteredEntries.map((entry, idx) => (
                                <motion.div 
                                    key={entry.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm flex flex-col group active:scale-[0.98] transition-all"
                                >
                                    <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                                        <img src={entry.imagePath} alt="Scan" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[9px] font-black uppercase tracking-widest text-[#1a1a2e]">
                                            {entry.type.replace('_', ' ')}
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[14px] font-black text-[#1a1a2e] line-clamp-1">{entry.date}</span>
                                            <MoreVertical size={14} className="text-gray-300" />
                                        </div>
                                        <div className="flex items-center gap-1.5 opacity-40">
                                            <Clock size={10} strokeWidth={3} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Processed</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </main>

            <DiaryScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
        </div>
    );
}
