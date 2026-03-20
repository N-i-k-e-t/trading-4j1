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

    // Internal Form State for Log Trade
    const [tradeData, setTradeData] = useState({
        ticker: '',
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
            // Reset y position and spring when opening
            y.set(window.innerHeight * (captureMode === 'checklist' ? SNAP_POINTS.FULL : SNAP_POINTS.HALF));
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
        setTradeData({
            ticker: '',
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
        if (!tradeData.ticker) {
            showToast('Ticker is required', 'error');
            return;
        }
        
        setIsProcessing(true);
        setTimeout(() => {
            addTrade({
                id: Date.now().toString(),
                date: new Date().toISOString(),
                pair: tradeData.ticker,
                type: tradeData.direction,
                entry: tradeData.entry,
                exit: tradeData.exit,
                plannedSL: tradeData.sl,
                pnl: (parseFloat(tradeData.exit) - parseFloat(tradeData.entry)) * parseFloat(tradeData.size || '1'),
                rules_followed: tradeData.checkedRules,
                rules_broken: rules.filter(r => r.isActive && !tradeData.checkedRules.includes(r.id)).map(r => r.id),
                emotion: 'neutral',
                notes: tradeData.notes
            });
            showToast('Trade logged successfully', 'success');
            setIsProcessing(false);
            reset();
        }, 1000);
    };

    if (captureMode === 'none') return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-end justify-center">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={reset}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Premium Bottom Sheet */}
            <motion.div
                drag="y"
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: window.innerHeight }}
                style={{ y: springY }}
                onDragEnd={handleDragEnd}
                className="relative w-full max-w-[430px] h-[100vh] bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
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
                            <p className="text-[15px] font-bold text-gray-400 mb-10">Choose your architecture mode.</p>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <button onClick={() => setCaptureMode('checklist')} className="aspect-square bg-yellow-50 rounded-[32px] flex flex-col items-center justify-center gap-4 active:scale-95 transition-all text-yellow-600 border border-yellow-100/50 shadow-sm">
                                    <ListChecks size={36} strokeWidth={2.5} />
                                    <span className="font-black text-[14px] uppercase tracking-widest">Execution</span>
                                </button>
                                <button onClick={() => setCaptureMode('note')} className="aspect-square bg-orange-50 rounded-[32px] flex flex-col items-center justify-center gap-4 active:scale-95 transition-all text-orange-600 border border-orange-100/50 shadow-sm">
                                    <FileText size={36} strokeWidth={2.5} />
                                    <span className="font-black text-[14px] uppercase tracking-widest">Scribe</span>
                                </button>
                                <button onClick={() => setCaptureMode('voice')} className="aspect-square bg-red-50 rounded-[32px] flex flex-col items-center justify-center gap-4 active:scale-95 transition-all text-red-600 border border-red-100/50 shadow-sm">
                                    <Mic size={36} strokeWidth={2.5} />
                                    <span className="font-black text-[14px] uppercase tracking-widest">Neural</span>
                                </button>
                                <button onClick={() => setCaptureMode('photo')} className="aspect-square bg-blue-50 rounded-[32px] flex flex-col items-center justify-center gap-4 active:scale-95 transition-all text-blue-600 border border-blue-100/50 shadow-sm">
                                    <Camera size={36} strokeWidth={2.5} />
                                    <span className="font-black text-[14px] uppercase tracking-widest">Vision</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {captureMode === 'checklist' && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="pt-4 flex flex-col gap-10"
                        >
                            <header className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-[32px] font-black text-[#1a1a2e] leading-tight mb-1">Execution.</h2>
                                    <p className="text-[14px] font-bold text-gray-400">Recording system compliance.</p>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${tradeData.isSystematic ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {tradeData.isSystematic ? 'Compliance' : 'Impulse'}
                                </div>
                            </header>

                            {/* Asset Architecture */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset</div>
                                    <div className="h-[1px] flex-1 bg-gray-50" />
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { id: 'NIFTY', label: 'Nifty', icon: '📈' },
                                        { id: 'BANKNIFTY', label: 'BNF', icon: '🏦' },
                                        { id: 'FINNIFTY', label: 'FIN', icon: '💰' },
                                        { id: 'EQUITY', label: 'EQ', icon: '📊' }
                                    ].map((asset) => (
                                        <button
                                            key={asset.id}
                                            onClick={() => setTradeData({...tradeData, ticker: asset.id})}
                                            className={`aspect-square rounded-[24px] flex flex-col items-center justify-center gap-1 transition-all border-2 ${
                                                tradeData.ticker === asset.id 
                                                ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white shadow-lg' 
                                                : 'bg-white border-transparent text-gray-400 opacity-60'
                                            }`}
                                        >
                                            <span className="text-xl">{asset.icon}</span>
                                            <span className="text-[9px] font-black uppercase tracking-wider">{asset.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <input 
                                    placeholder="Enter Ticker Manually..." 
                                    value={['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'EQUITY'].includes(tradeData.ticker) ? '' : tradeData.ticker}
                                    onChange={(e) => setTradeData({...tradeData, ticker: e.target.value.toUpperCase()})}
                                    className="w-full h-14 bg-gray-50 rounded-[24px] px-6 text-[15px] font-black placeholder:text-gray-300 outline-none border border-transparent focus:border-yellow-200 transition-all"
                                />
                            </div>

                            {/* Risk/Reward Architecture */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">Risk Model</div>
                                    <div className="h-[1px] flex-1 bg-gray-50" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#fafafa] p-6 rounded-[32px] border border-gray-100 relative">
                                        <span className="text-[10px] font-black text-red-400 uppercase absolute top-4 left-6 tracking-widest">Risk</span>
                                        <div className="flex items-end gap-1 mt-4">
                                            <span className="text-gray-300 font-black text-xl mb-1">₹</span>
                                            <input 
                                                type="number"
                                                placeholder="0.00"
                                                value={tradeData.risk || ''}
                                                onChange={(e) => setTradeData({...tradeData, risk: Number(e.target.value)})}
                                                className="w-full bg-transparent border-none outline-none text-[28px] font-black tabular-nums"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-[#fafafa] p-6 rounded-[32px] border border-gray-100 relative">
                                        <span className="text-[10px] font-black text-green-400 uppercase absolute top-4 left-6 tracking-widest">Reward</span>
                                        <div className="flex items-end gap-1 mt-4">
                                            <span className="text-gray-300 font-black text-xl mb-1">₹</span>
                                            <input 
                                                type="number"
                                                placeholder="0.00"
                                                value={tradeData.reward || ''}
                                                onChange={(e) => setTradeData({...tradeData, reward: Number(e.target.value)})}
                                                className="w-full bg-transparent border-none outline-none text-[28px] font-black tabular-nums"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center px-4 py-6 bg-[#1a1a2e] rounded-[32px] text-white shadow-xl">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Projected Ratio</span>
                                        <span className="text-[24px] font-black tabular-nums">1 : {((tradeData.reward || 0) / (tradeData.risk || 1)).toFixed(1)}</span>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${tradeData.reward / tradeData.risk >= 2 ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                                        {tradeData.reward / tradeData.risk >= 2 ? 'Optimal' : 'Sub-Par'}
                                    </div>
                                </div>
                            </div>

                            {/* Protocol Compliance */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">Compliance</div>
                                    <div className="h-[1px] flex-1 bg-gray-50" />
                                </div>
                                <div className="flex flex-col gap-3">
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
                                            className={`flex items-center gap-4 p-5 rounded-[24px] border transition-all ${tradeData.checkedRules.includes(rule.id) ? 'bg-green-50/30 border-green-100 shadow-sm' : 'bg-white border-gray-100 opacity-60'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${tradeData.checkedRules.includes(rule.id) ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200'}`}>
                                                {tradeData.checkedRules.includes(rule.id) && <Check size={18} strokeWidth={4} />}
                                            </div>
                                            <span className={`text-[15px] font-bold text-[#1a1a2e] ${tradeData.checkedRules.includes(rule.id) ? 'opacity-100' : 'opacity-40'}`}>
                                                {rule.text}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reflections</div>
                                    <div className="h-[1px] flex-1 bg-gray-50" />
                                </div>
                                <textarea 
                                    placeholder="Setup details, mental state, anomalies..." 
                                    rows={4}
                                    value={tradeData.notes}
                                    onChange={(e) => setTradeData({...tradeData, notes: e.target.value})}
                                    className="w-full bg-gray-50 rounded-[32px] p-6 text-[16px] font-bold text-[#1a1a2e] outline-none border border-transparent focus:bg-white focus:border-yellow-200 transition-all resize-none shadow-inner"
                                />
                            </div>

                            {/* Final Action */}
                            <div className="pt-4 flex flex-col gap-4">
                                <button 
                                    onClick={handleSaveTrade}
                                    disabled={isProcessing}
                                    className="w-full h-20 bg-[#eab308] text-white rounded-[32px] font-black text-[20px] shadow-2xl shadow-yellow-100 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <>Commit Architecture</>}
                                </button>
                                <button 
                                    onClick={reset}
                                    className="w-full h-14 bg-gray-50 text-gray-400 rounded-full font-black text-[13px] uppercase tracking-widest active:scale-95 transition-all"
                                >
                                    Cancel Log
                                </button>
                            </div>
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
                                    {captureMode === 'note' ? 'Scribe.' : captureMode === 'voice' ? 'Neural.' : 'Vision.'}
                                </h2>
                                <p className="text-[16px] font-bold text-gray-400 px-10">Recording system insights using {captureMode} architecture.</p>
                            </div>
                            <div className="w-full flex flex-col gap-4 px-4">
                                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="h-full bg-blue-500"
                                    />
                                </div>
                                <button 
                                    onClick={() => setCaptureMode('checklist')}
                                    className="w-full h-16 bg-white text-[#1a1a2e] rounded-[24px] font-black text-[15px] border border-gray-100 shadow-sm active:scale-95 transition-all"
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
