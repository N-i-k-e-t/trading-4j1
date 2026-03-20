'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    emoji?: string;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    ctaText?: string; // For backward compatibility
    onCtaClick?: () => void; // For backward compatibility
}

export function EmptyState({ 
    icon: Icon, 
    emoji,
    title, 
    description, 
    action,
    ctaText,
    onCtaClick
}: EmptyStateProps) {
    const handleAction = action?.onClick || onCtaClick;
    const label = action?.label || ctaText;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-10 text-center bg-[#f8fafc] rounded-2xl border border-dashed border-gray-200"
        >
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6">
                {emoji ? emoji : Icon ? <Icon size={32} className="text-gray-300" /> : '📋'}
            </div>
            <h3 className="text-[18px] font-black text-[#1a1a2e] mb-2">{title}</h3>
            <p className="text-[14px] font-bold text-gray-400 max-w-[260px] leading-relaxed mb-8">
                {description}
            </p>
            {handleAction && label && (
                <button 
                    onClick={handleAction}
                    className="h-12 px-8 bg-[#1a1a2e] text-white rounded-full font-black text-[14px] active:scale-95 transition-all shadow-lg shadow-gray-200"
                >
                    {label}
                </button>
            )}
        </motion.div>
    );
}

export default EmptyState;
