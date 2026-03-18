'use client';

import { useState } from 'react';
import { useRuleSci } from '@/lib/context';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Loader2, CheckCircle2, ChevronRight, PenTool, ClipboardList, TrendingUp } from 'lucide-react';
import { scanDiaryPage } from '@/lib/agents/visionScanner';
import { DiaryEntry } from '@/types/trading';

/**
 * DiaryScannerModal handles the capture/upload and processing pipeline.
 * It shows a 2-panel review UI after the AI scan is complete.
 */
export default function DiaryScannerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { addDiaryEntry, showToast } = useRuleSci();
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<Partial<DiaryEntry> | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Visual simulation of upload
        setUploadedImage(URL.createObjectURL(file));
        setIsScanning(true);

        try {
            // Simulated AI Scan
            const result = await scanDiaryPage(file);
            setScanResult(result);
            showToast("Diary page scanned successfully!", "success");
        } catch (err) {
            showToast("Scan failed. Try again.", "error");
        } finally {
            setIsScanning(false);
        }
    };

    const handleSave = () => {
        if (scanResult) {
            addDiaryEntry({
                ...scanResult,
                imagePath: uploadedImage || '',
                status: 'reviewed'
            } as DiaryEntry);
            onClose();
            setScanResult(null);
            setUploadedImage(null);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#1a1a2e]/60 backdrop-blur-md"
                />
                
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <header className="p-6 border-b border-[#1a1a2e]/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <Camera size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1a1a2e]">Scanner Intelligence</h3>
                                <p className="text-[12px] font-bold text-[#9ca3af] uppercase tracking-wider">Vision API v4.0</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-[#1a1a2e]/5 rounded-full transition-all">
                            <X size={20} className="text-[#9ca3af]" />
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6">
                        {!uploadedImage ? (
                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#1a1a2e]/10 rounded-3xl group hover:border-blue-500/50 transition-all cursor-pointer relative">
                                <input 
                                    type="file" accept="image/*" 
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleUpload}
                                />
                                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Upload size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-[#1a1a2e] mb-2">Snap your physical notes</h4>
                                <p className="text-[#6b7280] text-sm text-center max-w-[280px]">RuleSci reads handwriting, chart annotations, and P&L tables instantly.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[400px]">
                                {/* Panel 1: Original Image with AI Highlights */}
                                <div className="relative rounded-3xl overflow-hidden bg-[#1a1a2e]/5 border border-[#1a1a2e]/10 group">
                                    <img src={uploadedImage} alt="Diary Scan" className="w-full h-full object-cover opacity-80" />
                                    {isScanning && (
                                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center">
                                            <div className="relative">
                                                <Loader2 size={48} className="text-blue-600 animate-spin" />
                                                <motion.div 
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    className="absolute -inset-4 border-2 border-blue-600/30 rounded-full"
                                                />
                                            </div>
                                            <p className="mt-6 text-sm font-bold text-[#1a1a2e] uppercase tracking-widest">Analysing Handwriting...</p>
                                        </div>
                                    )}
                                    {scanResult && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            {/* Simulated AI Highlights */}
                                            <div className="absolute top-[20%] left-[10%] px-3 py-1 bg-blue-500/20 border border-blue-500 text-blue-700 text-[10px] font-bold rounded-md backdrop-blur-sm">ASSET: BANKNIFTY</div>
                                            <div className="absolute top-[45%] left-[15%] px-3 py-1 bg-red-500/20 border border-red-500 text-red-700 text-[10px] font-bold rounded-md backdrop-blur-sm">RULE VIOLATION: EARLY ENTRY</div>
                                        </div>
                                    )}
                                </div>

                                {/* Panel 2: Extracted Data Review */}
                                <div className="flex flex-col gap-6">
                                    {scanResult && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                    <span className="text-sm font-bold text-[#1a1a2e]">Extraction Confidence: {Math.round((scanResult.confidence || 0) * 100)}%</span>
                                                </div>
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter rounded-full border border-blue-100">
                                                    {scanResult.type?.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <div className="space-y-4">
                                                {scanResult.type === 'trade_note' && (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <DataField label="Asset" value={scanResult.extractedData.asset} />
                                                        <DataField label="Direction" value={scanResult.extractedData.direction} color="text-red-500" />
                                                        <DataField label="Entry" value={scanResult.extractedData.entry.toLocaleString()} />
                                                        <DataField label="Exit" value={scanResult.extractedData.exit.toLocaleString()} />
                                                        <DataField label="PnL Est." value={scanResult.extractedData.pnl_est} color="text-green-500" />
                                                        <DataField label="Emotion" value={scanResult.extractedData.emotion} />
                                                    </div>
                                                )}

                                                {scanResult.type === 'rule_list' && (
                                                    <div className="bg-[#1a1a2e]/5 p-5 rounded-3xl space-y-3">
                                                        {scanResult.extractedData.rules.map((r: string, i: number) => (
                                                            <div key={i} className="flex items-center gap-3 text-sm font-semibold text-[#1a1a2e]">
                                                                <CheckCircle2 size={16} className="text-green-500" />
                                                                {r}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="p-4 border border-[#1a1a2e]/5 rounded-2xl bg-gray-50/50">
                                                    <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-2">Original Context</p>
                                                    <p className="text-[13px] text-[#6b7280] italic leading-relaxed">"{scanResult.rawText}"</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {scanResult && (
                        <footer className="p-6 border-t border-[#1a1a2e]/5 bg-gray-50/50 flex items-center justify-between">
                            <button 
                                onClick={() => {setUploadedImage(null); setScanResult(null);}}
                                className="px-6 h-12 text-sm font-bold text-[#6b7280] hover:text-[#1a1a2e] transition-all"
                            >
                                Re-scan
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-8 h-12 bg-[#1a1a2e] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#1a1a2e]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                            >
                                Import structured data
                                <ChevronRight size={18} />
                            </button>
                        </footer>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function DataField({ label, value, color = "text-[#1a1a2e]" }: { label: string; value: string; color?: string }) {
    return (
        <div className="p-4 bg-[#1a1a2e]/5 rounded-2xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-[#1a1a2e]/5">
            <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-center justify-between">
                <span className={`text-[15px] font-bold ${color}`}>{value}</span>
                <PenTool size={12} className="text-[#9ca3af] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
}
