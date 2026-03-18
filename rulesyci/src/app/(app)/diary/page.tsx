'use client';

import { useState } from 'react';
import { useRuleSci } from '@/lib/context';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Calendar, FileText, ChevronRight, Filter, BookOpen, Clock, Activity } from 'lucide-react';
import DiaryScannerModal from '@/components/diary/DiaryScannerModal';

/**
 * DiaryPage: The 'Diary Library' hub.
 * Centralized repository for all physical-to-digital scans.
 * Supports full-text search across extracted diary data.
 */
export default function DiaryPage() {
    const { diaryEntries } = useRuleSci();
    const [searchQuery, setSearchQuery] = useState('');
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const filteredEntries = diaryEntries.filter(entry => 
        (entry.rawText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         entry.type.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex flex-col gap-8 md:gap-10 pb-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-[26px] font-bold text-[#1a1a2e] leading-tight mb-2 flex items-center gap-3">
                        <BookOpen size={28} className="text-blue-600" />
                        Diary Library
                    </h1>
                    <p className="text-base text-[#6b7280]">Your physical memory, digitalized and searchable.</p>
                </div>
                <button 
                    onClick={() => setIsScannerOpen(true)}
                    className="h-14 px-8 bg-[#1a1a2e] text-white rounded-[24px] text-sm font-bold shadow-2xl shadow-[#1a1a2e]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <Plus size={20} />
                    Scan New Page
                </button>
            </header>

            {/* Persistence Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={<FileText size={18} />} label="Pages Scanned" value={diaryEntries.length.toString()} color="bg-blue-600" />
                <StatCard icon={<Clock size={18} />} label="Earliest Note" value={diaryEntries.length > 0 ? "Mar 14" : "None"} color="bg-purple-600" />
                <StatCard icon={<Activity size={18} />} label="Rule Extracts" value="12" color="bg-orange-600" />
            </section>

            {/* Search and Filters */}
            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={20} />
                <input 
                    type="text"
                    placeholder="Search handwriting, patterns, or dates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-16 pl-14 pr-32 bg-white rounded-[28px] text-[15px] font-medium border border-[#1a1a2e]/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all placeholder:text-[#9ca3af]"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 hover:bg-[#1a1a2e]/5 rounded-xl text-[#6b7280] transition-all">
                    <Filter size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Filter</span>
                </button>
            </div>

            {/* Diary List */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredEntries.map((entry, i) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-white rounded-[32px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#1a1a2e]/5 hover:shadow-2xl hover:border-blue-500/10 transition-all cursor-pointer flex items-center gap-6"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-[#1a1a2e]/5 overflow-hidden flex-shrink-0 relative">
                                {entry.imagePath ? <img src={entry.imagePath} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <FileText className="w-full h-full p-6 text-[#9ca3af]" />}
                                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-[17px] font-bold text-[#1a1a2e]">
                                        {entry.type === 'trade_note' ? "Trade Observations" : 
                                         entry.type === 'weekly_review' ? "Weekly Strategy Reflection" :
                                         entry.type === 'rule_list' ? "Index Card Rule Extract" : "Physical Diary Page"}
                                    </h4>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter rounded-full">
                                        {entry.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-[#9ca3af] font-medium">
                                    <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(entry.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    {entry.confidence > 0.9 && <span className="text-green-500">✅ High Fidelity</span>}
                                </div>
                                <p className="mt-3 text-[14px] text-[#6b7280] leading-relaxed line-clamp-1 italic">
                                    "{entry.rawText?.slice(0, 100)}..."
                                </p>
                            </div>

                            <button className="w-12 h-12 rounded-2xl bg-gray-50 text-[#1a1a2e] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <ChevronRight size={20} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredEntries.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-[#1a1a2e]/5 rounded-[40px] flex items-center justify-center mb-8 border border-[#1a1a2e]/5 shadow-sm">
                            <BookOpen size={40} className="text-[#9ca3af] animate-pulse" />
                        </div>
                        <h4 className="text-xl font-bold text-[#1a1a2e] mb-2">No pages found</h4>
                        <p className="text-[#6b7280] max-w-[320px] text-sm leading-relaxed">Scan your first diary page to unlock your physical-digital archive.</p>
                    </div>
                )}
            </div>

            <DiaryScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
    return (
        <div className="bg-white rounded-[28px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#1a1a2e]/5 flex items-center gap-5 group hover:shadow-xl transition-all">
            <div className={`w-14 h-14 ${color} text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-black text-[#1a1a2e]">{value}</p>
            </div>
        </div>
    );
}
