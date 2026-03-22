'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useDragControls, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
    Plus, 
    Mic, 
    Camera, 
    X,
    Sparkles,
    ArrowRight,
    Loader2,
    CheckCircle2,
    ChevronDown,
    ListChecks,
    AlertCircle,
    Shield,
    FileText,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Target,
    Check
} from 'lucide-react';
import { useRuleSci } from '@/lib/context';
import { getSupportedAudioMimeType } from '@/lib/utils/media';

const SNAP_POINTS = {
    PEEK: 0.7,   // 30% from top (70% down)
    HALF: 0.4,   // 60% from top (40% down)
    FULL: 0.05    // 95% from top (5% down)
};

export default function CaptureHub() {
    const { 
        rules, 
        addTrade, 
        showToast, 
        isCaptureOpen, 
        setCaptureOpen, 
        captureMode, 
        setCaptureMode 
    } = useRuleSci();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    
    // Snapping Logic
    const [snapPoint, setSnapPoint] = useState(SNAP_POINTS.HALF);
    const dragControls = useDragControls();
    const y = useMotionValue(0);
    const springY = useSpring(y, { damping: 30, stiffness: 200 });

    // Internal Form State for Log Trade (Step-based)
    const [tradeStep, setTradeStep] = useState(1);
    const [tradeResult, setTradeResult] = useState<'WIN' | 'LOSS' | null>(null);
    const [rulesStatus, setRulesStatus] = useState<'ALL' | 'SOME' | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [tradeData, setTradeData] = useState({
        ticker: 'NIFTY',
        direction: 'Long' as 'Long' | 'Short',
        entry: '',
        exit: '',
        sl: '',
        size: '',
        risk: 0,
        reward: 0,
        notes: '',
        checkedRules: [] as string[],
        isSystematic: true
    });

    useEffect(() => {
        if (isCaptureOpen) {
            y.set(window.innerHeight * (captureMode === 'checklist' ? SNAP_POINTS.FULL : SNAP_POINTS.HALF));
            setTradeStep(1);
            setTradeResult(null);
            setRulesStatus(null);
        } else {
            y.set(window.innerHeight);
        }
    }, [isCaptureOpen, captureMode]);

    const handleDragEnd = (event: any, info: any) => {
        const threshold = 100;
        const currentY = y.get();
        const v = info.velocity.y;
        
        const h = window.innerHeight;
        const points = [h * SNAP_POINTS.FULL, h * SNAP_POINTS.HALF, h * SNAP_POINTS.PEEK, h];
        
        // Find closest point
        const closest = points.reduce((prev, curr) => {
            return Math.abs(curr - currentY) < Math.abs(prev - currentY) ? curr : prev;
        });

        // Handle Flick down to close
        if (v > 500 && currentY > h * 0.5) {
            reset();
            return;
        }

        y.set(closest);
        if (closest === h) reset();
    };

    const reset = () => {
        setCaptureOpen(false);
        setCaptureMode('none');
        setIsProcessing(false);
        setIsRecording(false);
        setCapturedImage(null);
        setTradeStep(1);
        setTradeResult(null);
        setRulesStatus(null);
        setShowAdvanced(false);
        setTradeData({
            ticker: 'NIFTY',
            direction: 'Long',
            entry: '',
            exit: '',
            sl: '',
            size: '',
            risk: 0,
            reward: 0,
            notes: '',
            checkedRules: [],
            isSystematic: true
        });
    };

    const handleSaveTrade = () => {
        setIsProcessing(true);
        
        // Finalize checked rules if "Yes All" was selected
        const finalRules = rulesStatus === 'ALL' 
            ? rules.filter(r => r.isActive).map(r => r.id)
            : tradeData.checkedRules;

        setTimeout(() => {
            addTrade({
                id: Date.now().toString(),
                date: new Date().toISOString(),
                pair: tradeData.ticker || 'NIFTY',
                type: tradeData.direction,
                entry: tradeData.entry,
                exit: tradeData.exit,
                plannedSL: tradeData.sl,
                pnl: tradeResult === 'WIN' ? 1 : -1, // Simplified P&L
                rules_followed: finalRules,
                rules_broken: rules.filter(r => r.isActive && !finalRules.includes(r.id)).map(r => r.id),
                emotion: 'neutral',
                notes: tradeData.notes
            });
            showToast('Trade logged', 'success');
            setIsProcessing(false);
            reset();
        }, 800);
    };

    if (captureMode === 'none') return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-end justify-center italic-none">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={reset}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Premium Bottom Sheet */}
            <motion.div
                drag="y"
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: window.innerHeight }}
                style={{ y: springY }}
                onDragEnd={handleDragEnd}
                className="relative w-full max-w-[430px] h-[92vh] bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
            >
                {/* Drag Handle Area */}
                <div 
                    onPointerDown={(e) => dragControls.start(e)}
                    className="flex-none p-6 pb-2 cursor-grab active:cursor-grabbing"
                >
                    <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto" />
                </div>

                {/* Dynamic Content */}
                <div className="flex-1 overflow-y-auto px-8 pb-32 custom-scrollbar">
                    {captureMode === 'initial' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pt-4"
                        >
                            <h2 className="text-[32px] font-black text-[#1a1a2e] leading-tight mb-2">Record.</h2>
                            <p className="text-[15px] font-bold text-gray-400 mb-10">Choose your entry mode.</p>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <button onClick={() => setCaptureMode('checklist')} className="aspect-square bg-yellow-50 rounded-[32px] flex flex-col items-center justify-center gap-4 active:scale-95 transition-all text-yellow-600 border border-yellow-100/50 shadow-sm">
                                    <ListChecks size={36} strokeWidth={2.5} />
                                    <span className="font-black text-[14px] uppercase tracking-widest">Log Trade</span>
                                </button>
                                <button onClick={() => setCaptureMode('note')} className="aspect-square bg-orange-50 rounded-[32px] flex flex-col items-center justify-center gap-4 active:scale-95 transition-all text-orange-600 border border-orange-100/50 shadow-sm">
                                    <FileText size={36} strokeWidth={2.5} />
                                    <span className="font-black text-[14px] uppercase tracking-widest">Quick Note</span>
                                </button>
                                <button onClick={() => setCaptureMode('voice')} className="aspect-square bg-red-50 rounded-[32px] flex flex-col items-center justify-center gap-4 active:scale-95 transition-all text-red-600 border border-red-100/50 shadow-sm">
                                    <Mic size={36} strokeWidth={2.5} />
                                    <span className="font-black text-[14px] uppercase tracking-widest">Voice</span>
                                </button>
                                <button onClick={() => setCaptureMode('photo')} className="aspect-square bg-blue-50 rounded-[32px] flex flex-col items-center justify-center gap-4 active:scale-95 transition-all text-blue-600 border border-blue-100/50 shadow-sm">
                                    <Camera size={36} strokeWidth={2.5} />
                                    <span className="font-black text-[14px] uppercase tracking-widest">Scan Rules</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {captureMode === 'checklist' && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="pt-4 flex flex-col gap-8"
                        >
                            <header>
                                <h2 className="text-[32px] font-black text-[#1a1a2e] leading-tight mb-1">Log Trade.</h2>
                                <p className="text-[14px] font-bold text-gray-400">Step {tradeStep} of 3</p>
                            </header>

                            {/* STEP 1: WIN OR LOSS */}
                            {tradeStep === 1 && (
                                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-6">
                                    <h3 className="text-xl font-black text-[#1a1a2e]">Was it a Win or Loss?</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => { setTradeResult('WIN'); setTradeStep(2); }}
                                            className="h-32 bg-green-50 rounded-[32px] border-2 border-transparent hover:border-green-500 transition-all flex flex-col items-center justify-center gap-2 group"
                                        >
                                            <TrendingUp size={32} className="text-green-500" />
                                            <span className="font-black text-green-600 uppercase tracking-widest">WIN</span>
                                        </button>
                                        <button 
                                            onClick={() => { setTradeResult('LOSS'); setTradeStep(2); }}
                                            className="h-32 bg-red-50 rounded-[32px] border-2 border-transparent hover:border-red-500 transition-all flex flex-col items-center justify-center gap-2 group"
                                        >
                                            <TrendingDown size={32} className="text-red-500" />
                                            <span className="font-black text-red-600 uppercase tracking-widest">LOSS</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: RULES FOLLOWED */}
                            {tradeStep === 2 && (
                                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-6">
                                    <h3 className="text-xl font-black text-[#1a1a2e]">Did you follow your rules?</h3>
                                    <div className="flex flex-col gap-4">
                                        <button 
                                            onClick={() => { setRulesStatus('ALL'); setTradeStep(3); }}
                                            className="w-full h-20 bg-blue-50 rounded-[28px] border-2 border-transparent hover:border-blue-500 transition-all flex items-center justify-center gap-4 px-6"
                                        >
                                            <CheckCircle2 size={24} className="text-blue-500" />
                                            <span className="font-black text-blue-600 uppercase tracking-widest">Yes, all rules</span>
                                        </button>
                                        <button 
                                            onClick={() => { setRulesStatus('SOME'); }}
                                            className={`w-full h-20 rounded-[28px] border-2 transition-all flex items-center justify-center gap-4 px-6 ${rulesStatus === 'SOME' ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white' : 'bg-gray-50 border-transparent hover:border-gray-200 text-gray-400'}`}
                                        >
                                            <AlertCircle size={24} className={rulesStatus === 'SOME' ? 'text-white' : 'text-gray-300'} />
                                            <span className={`font-black uppercase tracking-widest ${rulesStatus === 'SOME' ? 'text-white' : 'text-gray-400'}`}>Broke some rules</span>
                                        </button>
                                    </div>

                                    {rulesStatus === 'SOME' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 mt-4">
                                            <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Check rules you FOLLOWED:</p>
                                            {rules.filter(r => r.isActive !== false).map(rule => (
                                                <button 
                                                    key={rule.id}
                                                    onClick={() => {
                                                        const current = tradeData.checkedRules;
                                                        setTradeData({
                                                            ...tradeData, 
                                                            checkedRules: current.includes(rule.id) ? current.filter(id => id !== rule.id) : [...current, rule.id]
                                                        });
                                                    }}
                                                    className={`flex items-center gap-4 p-4 rounded-[24px] border transition-all ${tradeData.checkedRules.includes(rule.id) ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-100'}`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${tradeData.checkedRules.includes(rule.id) ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200'}`}>
                                                        {tradeData.checkedRules.includes(rule.id) && <Check size={14} strokeWidth={4} />}
                                                    </div>
                                                    <span className={`text-[14px] font-bold ${tradeData.checkedRules.includes(rule.id) ? 'text-[#1a1a2e]' : 'text-gray-300'}`}>
                                                        {rule.text}
                                                    </span>
                                                </button>
                                            ))}
                                            <button 
                                                onClick={() => setTradeStep(3)}
                                                className="w-full h-16 bg-[#1a1a2e] text-white rounded-[24px] font-black text-[14px] uppercase tracking-widest mt-4 shadow-xl mb-4"
                                            >
                                                Continue
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* STEP 3: FINAL NOTES & ADVANCED */}
                            {tradeStep === 3 && (
                                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-6">
                                    <h3 className="text-xl font-black text-[#1a1a2e]">Reflections & Details</h3>
                                    
                                    <textarea 
                                        placeholder="Quick note (optional)..." 
                                        rows={3}
                                        value={tradeData.notes}
                                        onChange={(e) => setTradeData({...tradeData, notes: e.target.value})}
                                        className="w-full bg-gray-50 rounded-[28px] p-6 text-[15px] font-bold text-[#1a1a2e] outline-none border border-transparent focus:bg-white focus:border-yellow-200 transition-all resize-none"
                                    />

                                    <button 
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-[#1a1a2e] transition-colors w-fit px-2"
                                    >
                                        {showAdvanced ? 'Hide Advanced Fields' : 'Add Advanced Fields (Ticker, RR)'}
                                        <ChevronDown size={14} className={showAdvanced ? 'rotate-180' : ''} />
                                    </button>

                                    {showAdvanced && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-4 overflow-hidden">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">Ticker / Pair</span>
                                                <input 
                                                    placeholder="Ticker (e.g. NIFTY)" 
                                                    value={tradeData.ticker}
                                                    onChange={(e) => setTradeData({...tradeData, ticker: e.target.value.toUpperCase()})}
                                                    className="w-full h-12 bg-gray-50 rounded-2xl px-5 text-[14px] font-bold outline-none border border-transparent focus:border-gray-200"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">Risk (₹)</span>
                                                    <input 
                                                        type="number"
                                                        value={tradeData.risk || ''}
                                                        onChange={(e) => setTradeData({...tradeData, risk: Number(e.target.value)})}
                                                        className="w-full h-12 bg-gray-50 rounded-2xl px-5 text-[14px] font-bold outline-none"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">Reward (₹)</span>
                                                    <input 
                                                        type="number"
                                                        value={tradeData.reward || ''}
                                                        onChange={(e) => setTradeData({...tradeData, reward: Number(e.target.value)})}
                                                        className="w-full h-12 bg-gray-50 rounded-2xl px-5 text-[14px] font-bold outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="flex flex-col gap-4 mt-4">
                                        <button 
                                            onClick={handleSaveTrade}
                                            disabled={isProcessing}
                                            className="w-full h-20 bg-[#1a1a2e] text-white rounded-[32px] font-black text-[18px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isProcessing ? <Loader2 className="animate-spin" /> : <>SAVE TRADE</>}
                                        </button>
                                        <button 
                                            onClick={() => setTradeStep(2)}
                                            className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] hover:text-gray-400"
                                        >
                                            Back
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Placeholder for other modes */}
                    {(captureMode === 'note' || captureMode === 'photo' || captureMode === 'voice') && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-20 flex flex-col items-center text-center gap-10">
                            <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center shadow-xl ${
                                captureMode === 'note' ? 'bg-orange-50 text-orange-500' : 
                                captureMode === 'voice' ? 'bg-red-50 text-red-500' : 
                                'bg-blue-50 text-blue-500'
                            }`}>
                                {captureMode === 'note' ? <FileText size={42} /> : captureMode === 'voice' ? <Mic size={42} /> : <Camera size={42} />}
                            </div>
                            <div>
                                <h2 className="text-[28px] font-black text-[#1a1a2e] mb-3">
                                    {captureMode === 'note' ? 'Quick Note' : captureMode === 'voice' ? 'Voice Check' : 'Scan Rules'}
                                </h2>
                                <p className="text-[16px] font-bold text-gray-400 px-10">Recording details using AI powered input.</p>
                            </div>
                            <div className="w-full flex flex-col gap-4 px-4">
                                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="h-full bg-[#1a1a2e]"
                                    />
                                </div>
                                <button 
                                    onClick={() => setCaptureMode('checklist')}
                                    className="w-full h-16 bg-white text-[#1a1a2e] rounded-[24px] font-black text-[14px] border border-gray-100 shadow-sm active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    Switch to Manual Entry
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
