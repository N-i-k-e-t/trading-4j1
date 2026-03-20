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

    const updateField = (key: string, value: any) => {
        if (scanResult && scanResult.extractedData) {
            setScanResult({
                ...scanResult,
                extractedData: {
                    ...scanResult.extractedData,
                    [key]: value
                }
            });
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
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#1a1a2e]/60 backdrop-blur-md"
                    />
                    
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <header className="p-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#eab308] text-white rounded-xl flex items-center justify-center shadow-lg shadow-yellow-100">
                                    <Camera size={24} />
                                </div>
                                <div>
                                    <h3 className="text-[20px] font-black text-[#1a1a2e]">Vision Engine</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Digitizing Edge Architecture</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-3 bg-gray-50 rounded-full transition-all active:scale-95">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                            {!uploadedImage ? (
                                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-2xl bg-white group hover:border-[#eab308] transition-all cursor-pointer relative shadow-sm">
                                    <input 
                                        type="file" accept="image/*" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleUpload}
                                    />
                                    <div className="w-20 h-20 bg-yellow-50 text-[#eab308] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Upload size={32} />
                                    </div>
                                    <h4 className="text-[18px] font-black text-[#1a1a2e] mb-2">Snapshot Architecture</h4>
                                    <p className="text-gray-400 text-[14px] text-center max-w-[280px] font-bold leading-relaxed">Snaps physical journals, charts, and handwritten logs into your secure library.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[500px]">
                                    {/* Panel 1: Original Image */}
                                    <div className="relative rounded-2xl overflow-hidden bg-[#1a1a2e] border border-gray-100 shadow-xl aspect-[4/5] lg:aspect-auto">
                                        <img src={uploadedImage} alt="Diary Scan" className={`w-full h-full object-cover transition-opacity duration-700 ${isScanning ? 'opacity-30' : 'opacity-80'}`} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        
                                        {isScanning && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <div className="relative">
                                                    <Loader2 size={48} className="text-[#eab308] animate-spin" />
                                                </div>
                                                <p className="mt-6 text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Scanning Handwriting...</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Panel 2: Review Content */}
                                    <div className="flex flex-col gap-4">
                                        {scanResult && !isScanning && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-black">
                                                            {Math.round((scanResult.confidence || 0) * 100)}%
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Confidence Score</p>
                                                            <p className="text-[13px] font-black text-[#1a1a2e]">High Fidelity Scan</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    {scanResult.type === 'trade_note' && (
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <DataField label="Asset" value={scanResult.extractedData.asset} onChange={(v) => updateField('asset', v)} />
                                                            <DataField label="Direction" value={scanResult.extractedData.direction} onChange={(v) => updateField('direction', v)} color="text-red-500" />
                                                            <DataField label="Entry" value={scanResult.extractedData.entry} onChange={(v) => updateField('entry', v)} />
                                                            <DataField label="Exit" value={scanResult.extractedData.exit} onChange={(v) => updateField('exit', v)} />
                                                        </div>
                                                    )}

                                                    <div className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <ClipboardList size={14} className="text-[#eab308]" />
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Transcription</p>
                                                        </div>
                                                        <p className="text-[14px] text-[#1a1a2e] font-bold leading-relaxed bg-gray-50 p-4 rounded-xl italic">"{scanResult.rawText}"</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {scanResult && !isScanning && (
                            <footer className="p-6 border-t border-gray-100 bg-white flex items-center justify-between relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                                <button 
                                    onClick={() => {setUploadedImage(null); setScanResult(null);}}
                                    className="px-6 h-12 text-[13px] font-black text-gray-400 hover:text-[#1a1a2e] transition-all hover:bg-gray-50 rounded-xl"
                                >
                                    Re-scan
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="h-14 px-8 bg-[#1a1a2e] text-white rounded-full text-[14px] font-black shadow-lg shadow-gray-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                                >
                                    Commit Record
                                    <ChevronRight size={18} />
                                </button>
                            </footer>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function DataField({ label, value, onChange, color = "text-[#1a1a2e]" }: { label: string; value: any; onChange: (v: string) => void; color?: string }) {
    return (
        <div className="p-4 bg-white rounded-2xl group hover:shadow-xl transition-all border border-[#1a1a2e]/5 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600">
            <p className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest mb-1 group-focus-within:text-blue-600 px-1">{label}</p>
            <div className="flex items-center justify-between">
                <input 
                    className={`w-full bg-transparent border-none p-1 text-[15px] font-bold outline-none ${color}`}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    spellCheck={false}
                />
                <PenTool size={12} className="text-[#9ca3af] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
}
