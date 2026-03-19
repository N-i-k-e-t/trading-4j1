'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Mic, 
    Type, 
    Camera, 
    X,
    Sparkles,
    ArrowRight,
    Loader2,
    CheckCircle2,
    ChevronDown,
    ClipboardList,
    AlertCircle,
    Shield
} from 'lucide-react';
import { useRuleSci } from '@/lib/context';
import { getSupportedAudioMimeType } from '@/lib/utils/media';

type CaptureMode = 'none' | 'initial' | 'note' | 'voice' | 'photo' | 'checklist' | 'validation' | 'preview';

export default function CaptureHub() {
    const { rules, addTrade, showToast, isCaptureOpen, setCaptureOpen } = useRuleSci();
    const [mode, setMode] = useState<CaptureMode>('none');
    
    // Update local mode when global open state changes
    useEffect(() => {
        if (isCaptureOpen) {
            setMode('initial');
        } else {
            setMode('none');
        }
    }, [isCaptureOpen]);

    const [sheetHeight, setSheetHeight] = useState('auto');
    
    // Form States
    const [note, setNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    
    // Checklist Form
    const [checklistData, setChecklistData] = useState({
        pair: '',
        type: 'long' as 'long' | 'short',
        entry: '',
        checkedRules: [] as string[],
        isSystematic: true
    });

    // Preview / Structured Data
    const [structuredTrade, setStructuredTrade] = useState<any>(null);

    // Keyboard handling
    useEffect(() => {
        if (typeof window === 'undefined' || !window.visualViewport) return;

        const handleResize = () => {
            const viewport = window.visualViewport;
            if (!viewport) return;
            const bottomOffset = window.innerHeight - viewport.height;
            if (bottomOffset > 100) {
                // Keyboard is up
                setSheetHeight(`${viewport.height}px`);
            } else {
                setSheetHeight('auto');
            }
        };

        window.visualViewport.addEventListener('resize', handleResize);
        return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }, []);

    const reset = () => {
        setCaptureOpen(false);
        setMode('none');
        setNote('');
        setIsProcessing(false);
        setIsRecording(false);
        setRecordingTime(0);
        setCapturedImage(null);
        setStructuredTrade(null);
        setChecklistData({ pair: '', type: 'long', entry: '', checkedRules: [], isSystematic: true });
    };

    const handleParse = async (source: string) => {
        setIsProcessing(true);
        // Simulate AI Scribe logic
        setTimeout(() => {
            setIsProcessing(false);
            setStructuredTrade({
                id: Date.now().toString(),
                pair: 'BTC/USDT',
                type: 'long',
                entry: 64200,
                exit: 65100,
                pnl: 2.1,
                emotion: 'calm',
                rules_followed: ['1', '2'],
                rules_broken: [],
                isSystematic: checklistData.isSystematic
            });
            setMode('validation');
        }, 2000);
    };

    const handleSaveFinal = () => {
        if (!structuredTrade) return;
        addTrade({
            ...structuredTrade,
            date: new Date().toISOString()
        });
        showToast('Trade added to journal', 'success');
        reset();
    };

    // Mode Option Component
    const ModeOption = ({ icon: Icon, label, onClick, color }: any) => (
        <button 
            onClick={onClick}
            className="flex flex-col items-center gap-3 p-4 active:scale-95 transition-all group"
        >
            <div className={`w-[64px] h-[64px] rounded-2xl flex items-center justify-center shadow-sm ${color} transition-all border border-black/5`}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-black text-[#1a1a2e] opacity-60 group-active:opacity-100">{label}</span>
        </button>
    );

    return (
        <>
            {/* Bottom Sheet */}
            <AnimatePresence>
                {mode !== 'none' && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={reset}
                            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100]"
                        />

                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220, mass: 0.8 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[110] shadow-[0_-12px_40px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col"
                            style={{ 
                                maxHeight: '85vh', 
                                height: sheetHeight,
                                paddingBottom: 'env(safe-area-inset-bottom, 24px)'
                            }}
                        >
                            <div className="flex-none p-4">
                                <div className="w-9 h-1 bg-gray-100 rounded-full mx-auto" />
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 pb-6">
                                <AnimatePresence mode="wait">
                                    {/* INITIAL GRID */}
                                    {mode === 'initial' && (
                                        <motion.div 
                                            key="initial" 
                                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                                            className="pt-2"
                                        >
                                            <h2 className="text-[20px] font-black text-[#1a1a2e] mb-8">Log Trade</h2>
                                            <div className="grid grid-cols-2 gap-4">
                                                <ModeOption 
                                                    icon={Type} label="Quick Note" color="bg-orange-50 text-orange-600" 
                                                    onClick={() => setMode('note')} 
                                                />
                                                <ModeOption 
                                                    icon={Mic} label="Voice" color="bg-red-50 text-red-600" 
                                                    onClick={() => setMode('voice')} 
                                                />
                                                <ModeOption 
                                                    icon={Camera} label="Scan Photo" color="bg-blue-50 text-blue-600" 
                                                    onClick={() => setMode('photo')} 
                                                />
                                                <ModeOption 
                                                    icon={ClipboardList} label="Checklist" color="bg-green-50 text-green-600" 
                                                    onClick={() => setMode('checklist')} 
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* QUICK NOTE MODE */}
                                    {mode === 'note' && (
                                        <motion.div key="note" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <div className="flex items-center gap-3 mb-6">
                                                <button onClick={() => setMode('initial')} className="text-gray-400"><ArrowRight className="rotate-180" size={20}/></button>
                                                <h2 className="text-[18px] font-black text-[#1a1a2e]">Quick Note</h2>
                                            </div>
                                            <div className="flex flex-col gap-5">
                                                <textarea 
                                                    autoFocus
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    placeholder="e.g. Bought NIFTY 22400CE @ 120, felt fomo, closed @ 110."
                                                    className="w-full min-h-[160px] bg-gray-50 rounded-2xl p-5 text-[16px] font-bold text-[#1a1a2e] border-none focus:ring-2 focus:ring-[#1a1a2e]/5 outline-none resize-none"
                                                />
                                                <button 
                                                    onClick={() => handleParse('text')}
                                                    disabled={!note.trim() || isProcessing}
                                                    className="w-full h-14 bg-[#1a1a2e] text-white rounded-full font-black text-[16px] shadow-lg disabled:opacity-30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                                >
                                                    {isProcessing ? <Loader2 className="animate-spin" size={20}/> : <>Parse & Save <Sparkles size={18}/></>}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* VOICE MODE */}
                                    {mode === 'voice' && (
                                        <motion.div key="voice" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8">
                                            <h2 className="text-[18px] font-black text-[#1a1a2e] mb-12">Voice Scribe</h2>
                                            <div className="relative mb-12">
                                                <motion.button 
                                                    animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    onClick={() => setIsRecording(!isRecording)}
                                                    className={`w-[100px] h-[100px] rounded-full flex items-center justify-center shadow-2xl transition-all ${isRecording ? 'bg-red-500 text-white shadow-red-200' : 'bg-gray-100 text-red-500'}`}
                                                >
                                                    <Mic size={40} fill={isRecording ? 'white' : 'none'} />
                                                </motion.button>
                                                {isRecording && (
                                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[14px] font-black text-red-500 animate-pulse">
                                                        REC 00:0{recordingTime}s
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-center mb-10">
                                                <p className="text-[14px] font-bold text-gray-400 max-w-[200px] mx-auto">
                                                    {isRecording ? "Speak naturally about your entry, exit and mindset..." : "Tap to record your trade report"}
                                                </p>
                                            </div>
                                            {isRecording && (
                                                <button 
                                                    onClick={() => handleParse('voice')}
                                                    className="w-full h-14 bg-[#1a1a2e] text-white rounded-full font-black text-[16px]"
                                                >
                                                    Stop & Analyse
                                                </button>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* PHOTO MODE */}
                                    {mode === 'photo' && (
                                        <motion.div key="photo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8 gap-8">
                                            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                                                <Camera size={32} />
                                            </div>
                                            <div className="text-center">
                                                <h2 className="text-[18px] font-black text-[#1a1a2e] mb-2">Scan Your Chart</h2>
                                                <p className="text-[14px] font-bold text-gray-400">Capture charts or physical journals to extract the edge.</p>
                                            </div>
                                            <label className="w-full h-14 bg-[#1a1a2e] text-white rounded-full font-black text-[16px] flex items-center justify-center cursor-pointer active:scale-95 transition-all">
                                                Snap Photo
                                                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={() => handleParse('photo')} />
                                            </label>
                                        </motion.div>
                                    )}

                                    {/* CHECKLIST MODE */}
                                    {mode === 'checklist' && (
                                        <motion.div key="checklist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <button onClick={() => setMode('initial')} className="text-gray-400"><ArrowRight className="rotate-180" size={20}/></button>
                                                <h2 className="text-[18px] font-black text-[#1a1a2e]">Trade Checklist</h2>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <input 
                                                    placeholder="Asset (e.g. NIFTY)" 
                                                    value={checklistData.pair}
                                                    onChange={(e) => setChecklistData({...checklistData, pair: e.target.value.toUpperCase()})}
                                                    className="w-full h-14 bg-gray-50 rounded-2xl px-5 text-[15px] font-bold text-[#1a1a2e] border-none outline-none"
                                                />
                                                
                                                <div className="flex bg-gray-50 p-1 rounded-2xl">
                                                    <button 
                                                        onClick={() => setChecklistData({...checklistData, type: 'long'})}
                                                        className={`flex-1 py-3 rounded-xl text-[13px] font-black transition-all ${checklistData.type === 'long' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-400'}`}
                                                    >
                                                        LONG
                                                    </button>
                                                    <button 
                                                        onClick={() => setChecklistData({...checklistData, type: 'short'})}
                                                        className={`flex-1 py-3 rounded-xl text-[13px] font-black transition-all ${checklistData.type === 'short' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400'}`}
                                                    >
                                                        SHORT
                                                    </button>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest ml-1">Pre-trade Rules</label>
                                                    {rules.filter(r => r.isActive).map(rule => (
                                                        <button 
                                                            key={rule.id}
                                                            onClick={() => {
                                                                const current = checklistData.checkedRules;
                                                                setChecklistData({
                                                                    ...checklistData, 
                                                                    checkedRules: current.includes(rule.id) ? current.filter(id => id !== rule.id) : [...current, rule.id]
                                                                });
                                                            }}
                                                            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${checklistData.checkedRules.includes(rule.id) ? 'bg-[#1a1a2e]/5 border-[#1a1a2e]' : 'bg-white border-gray-100'}`}
                                                        >
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${checklistData.checkedRules.includes(rule.id) ? 'bg-[#1a1a2e] border-[#1a1a2e]' : 'border-gray-200'}`}>
                                                                {checklistData.checkedRules.includes(rule.id) && <CheckCircle2 size={12} className="text-white" />}
                                                            </div>
                                                            <span className="text-[14px] font-bold text-[#1a1a2e]">{rule.text}</span>
                                                        </button>
                                                    ))}
                                                </div>

                                                <button 
                                                    onClick={() => {
                                                        const mockTrade = {
                                                            id: Date.now().toString(),
                                                            pair: checklistData.pair || 'NIFTY',
                                                            type: checklistData.type,
                                                            entry: parseFloat(checklistData.entry) || 0,
                                                            exit: 0,
                                                            pnl: 0,
                                                            emotion: 'neutral',
                                                            rules_followed: checklistData.checkedRules,
                                                            rules_broken: rules.filter(r => r.isActive && !checklistData.checkedRules.includes(r.id)).map(r => r.id),
                                                            isSystematic: checklistData.isSystematic
                                                        };
                                                        setStructuredTrade(mockTrade);
                                                        setMode('validation');
                                                    }}
                                                    className="w-full h-14 bg-[#1a1a2e] text-white rounded-full font-black text-[16px] mt-4 shadow-lg shadow-gray-200 active:scale-95 transition-all"
                                                >
                                                    Lock & Enter Trade
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* VALIDATION MODE — PHILOSOPHICAL CORE */}
                                    {mode === 'validation' && (
                                        <motion.div key="validation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <button onClick={() => setMode('checklist')} className="text-gray-400"><ArrowRight className="rotate-180" size={20}/></button>
                                                <h2 className="text-[18px] font-black text-[#1a1a2e]">Execution Check</h2>
                                            </div>
                                            
                                            <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 mb-2">
                                                <h3 className="text-[15px] font-black text-[#1a1a2e] mb-4">Execution Intent</h3>
                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={() => setChecklistData({...checklistData, isSystematic: true})}
                                                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${checklistData.isSystematic ? 'bg-white border-blue-500 shadow-xl shadow-blue-50' : 'bg-transparent border-gray-100 opacity-40 grayscale'}`}
                                                    >
                                                        <Shield size={24} className="text-blue-500" />
                                                        <span className="text-[12px] font-black text-blue-600">SYSTEMATIC</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => setChecklistData({...checklistData, isSystematic: false})}
                                                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${!checklistData.isSystematic ? 'bg-white border-red-500 shadow-xl shadow-red-50' : 'bg-transparent border-gray-100 opacity-40 grayscale'}`}
                                                    >
                                                        <AlertCircle size={24} className="text-red-500" />
                                                        <span className="text-[12px] font-black text-red-600">EMOTIONAL</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                                <p className="text-[12px] font-bold text-orange-800 leading-relaxed italic">
                                                    "A trade taken against rules, even if profitable, is a long-term loss to the system." — RuleSci Principle
                                                </p>
                                            </div>

                                            <button 
                                                onClick={() => setMode('preview')}
                                                className="w-full h-16 bg-[#1a1a2e] text-white rounded-[24px] font-black text-[16px] shadow-xl group flex items-center justify-center gap-3"
                                            >
                                                Proceed to Confirmation <ArrowRight size={18} className="group-active:translate-x-1 transition-transform" />
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* STRUCTURED PREVIEW */}
                                    {mode === 'preview' && (
                                        <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                                            <h2 className="text-[18px] font-black text-[#1a1a2e]">Confirm Entry</h2>
                                            
                                            <div className="bg-gray-50 rounded-3xl p-6 flex flex-col gap-5 border border-gray-100">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Asset</span>
                                                        <span className="text-[16px] font-black text-[#1a1a2e]">{structuredTrade.pair}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Direction</span>
                                                        <span className={`text-[12px] font-black px-2 py-0.5 rounded-full w-fit ${structuredTrade.type === 'long' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                            {structuredTrade.type.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Entry</span>
                                                        <span className="text-[16px] font-black text-[#1a1a2e] tabular-nums">{structuredTrade.entry}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Exit</span>
                                                        <span className="text-[16px] font-black text-[#1a1a2e] tabular-nums">{structuredTrade.exit}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Compliance</span>
                                                        <span className="text-[12px] font-black text-green-600">Grade A</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {rules.map((_, i) => (
                                                            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 3 ? 'bg-green-500' : 'bg-gray-200'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={handleSaveFinal}
                                                className="w-full h-14 bg-green-500 text-white rounded-full font-black text-[16px] shadow-lg shadow-green-100 active:scale-95 transition-all"
                                            >
                                                Confirm & Log Trade
                                            </button>
                                            <button onClick={() => setMode('initial')} className="text-[14px] font-black text-gray-300">Edit Details</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
