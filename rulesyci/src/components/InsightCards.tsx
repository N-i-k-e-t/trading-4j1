'use client';

import { useRuleSci } from '@/lib/context';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, TrendingDown, Target, Zap } from 'lucide-react';

export default function InsightCards() {
    const { coachMessages, removeCoachMessage } = useRuleSci();

    if (!coachMessages || coachMessages.length === 0) return null;

    return (
        <section className="relative overflow-hidden py-2">
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-1 snap-x">
                <AnimatePresence mode="popLayout">
                    {coachMessages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            layout
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                            className="flex-shrink-0 w-[280px] snap-center"
                        >
                            <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#1a1a2e]/5 relative group overflow-hidden">
                                {/* Ambient Background Glow */}
                                <div className={`absolute -top-10 -right-10 w-24 h-24 blur-3xl opacity-10 rounded-full ${
                                    msg.tone === 'warning' ? 'bg-red-500' : 'bg-blue-500'
                                }`} />
                                
                                <button 
                                    onClick={() => removeCoachMessage(msg.id)}
                                    className="absolute top-4 right-4 p-1.5 bg-[#1a1a2e]/5 rounded-full text-[#9ca3af] hover:bg-[#1a1a2e]/10 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X size={14} />
                                </button>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className={`p-2 rounded-xl ${
                                        msg.tone === 'warning' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                    }`}>
                                        {msg.id.includes('time') ? <Zap size={18} /> : 
                                         msg.id.includes('cost') ? <TrendingDown size={18} /> : 
                                         <Lightbulb size={18} />}
                                    </div>
                                    <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">
                                        {msg.type === 'weekly_review' ? 'Weekly Insight' : 'System Alert'}
                                    </span>
                                </div>

                                <p className="text-[13px] font-semibold text-[#1a1a2e] leading-relaxed mb-4">
                                    {msg.message}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-[10px] font-bold text-[#9ca3af]">{new Date(msg.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    <button className="text-[10px] font-black text-[#2563eb] uppercase tracking-wider">Act Now</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}
