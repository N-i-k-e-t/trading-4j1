'use client';

import { useRuleSci } from '@/lib/context';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
};
const colors = {
    success: 'bg-[#22c55e]',
    error: 'bg-[#ef4444]',
    info: 'bg-[#2563eb]',
};

export default function ToastContainer() {
    const { toasts, dismissToast } = useRuleSci();

    return (
        <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const Icon = icons[toast.type];
                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 80, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            onClick={() => dismissToast(toast.id)}
                            className="pointer-events-auto cursor-pointer flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] min-w-[260px] max-w-[360px]"
                        >
                            <div className={`w-8 h-8 ${colors[toast.type]} rounded-full flex items-center justify-center flex-shrink-0`}>
                                <Icon size={16} className="text-white" strokeWidth={3} />
                            </div>
                            <span className="text-[14px] font-semibold text-[#1a1a2e] leading-snug">{toast.message}</span>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
