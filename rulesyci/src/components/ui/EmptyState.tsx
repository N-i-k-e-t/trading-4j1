'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    emoji: string;
    title: string;
    description: string;
    ctaText: string;
    onCtaClick: () => void;
    className?: string;
}

export default function EmptyState({ 
    emoji, 
    title, 
    description, 
    ctaText, 
    onCtaClick,
    className = ""
}: EmptyStateProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center text-center px-6 py-12 ${className}`}
        >
            <div className="w-[84px] h-[84px] bg-gray-50 rounded-[32px] flex items-center justify-center text-[48px] mb-6 shadow-sm border border-black/5">
                {emoji}
            </div>
            
            <h3 className="text-[16px] font-black text-[#1a1a2e] mb-1 leading-tight">
                {title}
            </h3>
            
            <p className="text-[14px] font-bold text-gray-400 opacity-60 mb-8 max-w-[240px] leading-snug">
                {description}
            </p>
            
            <button 
                onClick={onCtaClick}
                className="min-h-[52px] px-8 bg-[#1a1a2e] text-white rounded-full text-[14px] font-black shadow-xl shadow-gray-200 active:scale-95 transition-all"
            >
                {ctaText}
            </button>
        </motion.div>
    );
}
