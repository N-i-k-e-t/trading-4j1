import { useState } from 'react';
import { useRuleSci } from '@/lib/context';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Loader2, CheckCircle2, ChevronRight, PenTool, ClipboardList, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
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
                        className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20"
                    >
                        {/* THE SEGMENTED PROGRESS - CAL AI STYLE */}
                        <div className="absolute top-0 left-0 right-0 px-8 pt-4 flex gap-1 z-[210]">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-1 flex-1 bg-gray-100/50 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-[#1a1a2e]"
                                        initial={{ width: '0%' }}
                                        animate={{ width: uploadedImage ? (scanResult ? '100%' : '50%') : '0%' }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </div>
                            ))}
                        </div>

                        <header className="px-8 pt-12 pb-8 flex items-center justify-between bg-white relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center shadow-2xl">
                                    <Camera size={28} strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col">
                                     <h3 className="text-[32px] font-black text-[#1a1a2e] leading-none mb-1 tracking-tighter">Scan <br/> Journal.</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                        <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Scanning your notes</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center transition-all active:scale-95 text-gray-400">
                                <X size={24} strokeWidth={3} />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto px-8 pb-8 bg-white">
                            {!uploadedImage ? (
                                <div className="flex flex-col items-center justify-center py-20 border-4 border-dashed border-gray-50 rounded-[48px] bg-gray-50/30 group hover:border-[#1a1a2e]/10 transition-all cursor-pointer relative shadow-inner">
                                    <input 
                                        type="file" accept="image/*" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleUpload}
                                    />
                                    <div className="w-24 h-24 bg-white text-[#1a1a2e] rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
                                        <Upload size={40} strokeWidth={2.5} />
                                    </div>
                                    <h4 className="text-[22px] font-black text-[#1a1a2e] mb-3 tracking-tight">Scan to Digital</h4>
                                    <p className="text-gray-400 text-[15px] text-center max-w-[320px] font-bold leading-relaxed px-4">Snaps physical journals, charts, and handwritten logs into your secure digital library.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[500px]">
                                    {/* Panel 1: Original Image */}
                                    <div className="relative rounded-[40px] overflow-hidden bg-[#1a1a2e] border border-gray-100 shadow-2xl aspect-[4/5] lg:aspect-auto">
                                        <img src={uploadedImage} alt="Diary Scan" className={`w-full h-full object-cover transition-opacity duration-700 ${isScanning ? 'opacity-20' : 'opacity-80'}`} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        
                                        {isScanning && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <div className="relative">
                                                    <Loader2 size={64} className="text-white animate-spin opacity-40" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <ShieldCheck size={32} className="text-white animate-pulse" />
                                                    </div>
                                                </div>
                                                <p className="mt-8 text-[12px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Analyzing notes...</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Panel 2: Review Content */}
                                    <div className="flex flex-col gap-6">
                                        {scanResult && !isScanning && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                                                <div className="flex items-center justify-between bg-gray-50 p-6 rounded-[32px] border border-gray-100 shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center text-xl font-black shadow-xl">
                                                            {Math.round((scanResult.confidence || 0) * 100)}%
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Confidence Ratio</p>
                                                            <p className="text-[16px] font-black text-[#1a1a2e]">High Fidelity Scan</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    {scanResult.type === 'trade_note' && (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <DataField label="Asset" value={scanResult.extractedData.asset} onChange={(v) => updateField('asset', v)} />
                                                            <DataField label="Bias" value={scanResult.extractedData.direction} onChange={(v) => updateField('direction', v)} color="text-red-500" />
                                                        </div>
                                                    )}

                                                    <div className="p-6 border border-gray-50 rounded-[32px] bg-white shadow-sm flex flex-col gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center">
                                                                <PenTool size={14} />
                                                            </div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Handwriting conversion</p>
                                                        </div>
                                                        <p className="text-[16px] text-[#1a1a2e] font-bold leading-relaxed bg-gray-50/50 p-6 rounded-[24px] italic border border-gray-50 shadow-inner">"{scanResult.rawText}"</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {uploadedImage && !isScanning && (
                            <footer className="px-8 py-6 border-t border-gray-50 bg-white flex items-center justify-between relative z-10">
                                <button 
                                    onClick={() => {setUploadedImage(null); setScanResult(null);}}
                                    className="px-10 h-16 text-[14px] font-black text-gray-300 hover:text-[#1a1a2e] transition-all hover:bg-gray-50 rounded-full"
                                >
                                    Re-scan
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="h-20 px-12 bg-[#1a1a2e] text-white rounded-full text-[17px] font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4"
                                >
                                    Save Scan
                                    <ChevronRight size={24} strokeWidth={3} />
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
        <div className="p-6 bg-gray-50 rounded-[32px] group hover:shadow-xl transition-all border border-gray-100/50 focus-within:ring-2 focus-within:ring-[#1a1a2e]/10 focus-within:bg-white">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-[#1a1a2e] px-1">{label}</p>
            <div className="flex items-center justify-between">
                <input 
                    className={`w-full bg-transparent border-none p-1 text-[16px] font-black outline-none ${color}`}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    spellCheck={false}
                />
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <PenTool size={14} className="text-gray-400" />
                </div>
            </div>
        </div>
    );
}
