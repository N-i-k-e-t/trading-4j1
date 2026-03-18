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
                        className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <header className="p-6 md:p-8 border-b border-[#1a1a2e]/5 flex items-center justify-between bg-white relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-blue-200">
                                    <Camera size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#1a1a2e]">Vision Intelligence</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest">Digitizing physical memories</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-[#1a1a2e]/5 rounded-full transition-all">
                                <X size={20} className="text-[#9ca3af]" />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/30">
                            {!uploadedImage ? (
                                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-[#1a1a2e]/10 rounded-[40px] bg-white group hover:border-blue-500 transition-all cursor-pointer relative shadow-sm">
                                    <input 
                                        type="file" accept="image/*" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleUpload}
                                    />
                                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
                                        <Upload size={40} />
                                    </div>
                                    <h4 className="text-xl font-black text-[#1a1a2e] mb-3">Snapshot to Digital Intelligence</h4>
                                    <p className="text-[#6b7280] text-sm text-center max-w-[320px] font-medium leading-relaxed">Snaps physical diary notes, handwritten charts, and P&L tallies into your searchable library.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[500px]">
                                    {/* Panel 1: Original Image with AI Highlights */}
                                    <div className="relative rounded-[32px] overflow-hidden bg-[#1a1a2e] border border-[#1a1a2e]/10 shadow-2xl aspect-[4/5] lg:aspect-auto">
                                        <img src={uploadedImage} alt="Diary Scan" className={`w-full h-full object-cover transition-opacity duration-700 ${isScanning ? 'opacity-40' : 'opacity-80'}`} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        
                                        {isScanning && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <div className="relative">
                                                    <Loader2 size={64} className="text-blue-400 animate-spin" />
                                                    <motion.div 
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className="absolute -inset-6 border-2 border-blue-400/30 rounded-full"
                                                    />
                                                </div>
                                                <p className="mt-8 text-xs font-black text-white uppercase tracking-[0.3em] animate-pulse">Scanning Handwriting...</p>
                                            </div>
                                        )}

                                        {scanResult && !isScanning && (
                                            <div className="absolute inset-0 p-6 pointer-events-none">
                                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-[15%] left-[10%] px-4 py-2 bg-blue-600/90 text-white text-[10px] font-bold rounded-xl backdrop-blur-md shadow-xl border border-white/20">
                                                    DETECTED: TRADE NOTES
                                                </motion.div>
                                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="absolute top-[40%] left-[20%] px-4 py-2 bg-purple-600/90 text-white text-[10px] font-bold rounded-xl backdrop-blur-md shadow-xl border border-white/20">
                                                    EXTRACTED: ENTRY @ {scanResult?.extractedData?.entry || '----'}
                                                </motion.div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Panel 2: Extracted Data Review */}
                                    <div className="flex flex-col gap-6">
                                        {scanResult && !isScanning && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                                <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-[#1a1a2e]/5 shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-bold">
                                                            {Math.round((scanResult.confidence || 0) * 100)}%
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">Confidence Score</p>
                                                            <p className="text-[13px] font-bold text-[#1a1a2e]">AI Extraction High Fidelity</p>
                                                        </div>
                                                    </div>
                                                    <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                                                        {scanResult.type?.replace('_', ' ')}
                                                    </span>
                                                </div>

                                                <div className="space-y-6">
                                                    {scanResult.type === 'trade_note' && (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <DataField label="Asset" value={scanResult.extractedData.asset} onChange={(v) => updateField('asset', v)} />
                                                            <DataField label="Direction" value={scanResult.extractedData.direction} onChange={(v) => updateField('direction', v)} color="text-red-500" />
                                                            <DataField label="Entry Price" value={scanResult.extractedData.entry} onChange={(v) => updateField('entry', v)} />
                                                            <DataField label="Exit Price" value={scanResult.extractedData.exit} onChange={(v) => updateField('exit', v)} />
                                                            <DataField label="PnL Est." value={scanResult.extractedData.pnl_est} onChange={(v) => updateField('pnl_est', v)} color="text-green-500" />
                                                            <DataField label="Final Mood" value={scanResult.extractedData.emotion} onChange={(v) => updateField('emotion', v)} />
                                                        </div>
                                                    )}

                                                    {scanResult.type === 'rule_list' && (
                                                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-[#1a1a2e]/5 space-y-4">
                                                            <h4 className="text-[11px] font-black text-[#9ca3af] uppercase tracking-widest">Detected Playbook Rules</h4>
                                                            <div className="space-y-3">
                                                                {scanResult.extractedData.rules.map((r: string, i: number) => (
                                                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-sm font-bold text-[#1a1a2e]">
                                                                        <CheckCircle2 size={16} className="text-green-500" />
                                                                        {r}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="p-6 border border-[#1a1a2e]/5 rounded-[32px] bg-white shadow-sm">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <ClipboardList size={14} className="text-blue-600" />
                                                            <p className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest">Raw AI Transcription</p>
                                                        </div>
                                                        <p className="text-[13px] text-[#1a1a2e] font-medium leading-relaxed bg-[#1a1a2e]/5 p-4 rounded-xl italic">"{scanResult.rawText}"</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {scanResult && !isScanning && (
                            <footer className="p-8 border-t border-[#1a1a2e]/5 bg-white flex items-center justify-between relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.02)]">
                                <button 
                                    onClick={() => {setUploadedImage(null); setScanResult(null);}}
                                    className="px-6 py-3 text-sm font-bold text-[#6b7280] hover:text-[#1a1a2e] transition-all hover:bg-gray-50 rounded-2xl"
                                >
                                    Cancel & Re-scan
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="h-14 px-10 bg-[#1a1a2e] text-white rounded-[22px] text-sm font-black shadow-2xl shadow-[#1a1a2e]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 border border-white/10"
                                >
                                    Final Review: Commit Note
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
