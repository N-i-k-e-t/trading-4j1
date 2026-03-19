'use client';

import { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPrompt() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        // Detect if already in standalone mode (installed as PWA)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

        if (isIOS && !isStandalone) {
            const dismissed = localStorage.getItem('rulesci_pwa_dismissed');
            if (!dismissed) {
                setShow(true);
            }
        }
    }, []);

    const dismiss = () => {
        localStorage.setItem('rulesci_pwa_dismissed', 'true');
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-24 left-4 right-4 z-[100] bg-white rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-[#1a1a2e]/5"
                >
                    <button 
                        onClick={dismiss}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#1a1a2e] transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-[#1a1a2e] text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#1a1a2e]/20">
                            <PlusSquare size={32} />
                        </div>
                        
                        <h3 className="text-lg font-black text-[#1a1a2e] mb-2">Install RuleSci</h3>
                        <p className="text-sm text-[#6b7280] mb-6 leading-relaxed">
                            Add to your Home Screen for **Push Notifications**, real-time **Tilt Alerts**, and a full-screen experience.
                        </p>

                        <div className="w-full bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-sm font-bold text-[#1a1a2e]">
                                <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-blue-600">
                                    <Share size={16} />
                                </div>
                                <span>1. Tap the Share icon below</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-[#1a1a2e]">
                                <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center">
                                    <PlusSquare size={16} />
                                </div>
                                <span>2. Select &quot;Add to Home Screen&quot;</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
