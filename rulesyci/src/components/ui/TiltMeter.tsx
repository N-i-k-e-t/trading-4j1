'use client';

import { motion } from 'framer-motion';

interface TiltMeterProps {
  score: number; // Tilt Score (0-100)
}

export default function TiltMeter({ score }: TiltMeterProps) {
  const radius = 90; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Determine status based on tilt score
  const getStatus = (s: number) => {
    if (s <= 33) return { 
      label: 'STABLE', 
      color: '#22c55e', 
      text: 'Execution is disciplined. Stay in the zone.' 
    };
    if (s <= 66) return { 
      label: 'TILTING', 
      color: '#eab308', 
      text: 'Focus is wavering. Regroup and follow the plan.' 
    };
    return { 
      label: 'ON TILT', 
      color: '#ef4444', 
      text: 'System protocol breach. Stop trading immediately.' 
    };
  };

  const status = getStatus(score);

  return (
    <div className="flex flex-col items-center justify-center py-6 relative">
      <div className="relative w-[220px] h-[220px] flex items-center justify-center overflow-visible">
        {/* Background Glow */}
        <motion.div 
          className="absolute inset-4 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: status.color }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* SVG Gauge */}
        <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_8px_rgba(0,0,0,0.05)] overflow-visible">
          {/* Background Track */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="transparent"
            stroke="rgba(0,0,0,0.03)"
            strokeWidth="12"
          />
          
          {/* Animated Progress Ring */}
          <motion.circle
            cx="110"
            cy="110"
            r={radius}
            fill="transparent"
            stroke={status.color}
            strokeWidth="14"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            className="drop-shadow-[0_0_12px_rgba(0,0,0,0.1)]"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span 
            className="text-[48px] font-bold text-[#1a1a2e] leading-none tabular-nums"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {score}
          </motion.span>
          <motion.span 
            className="text-[14px] font-black uppercase tracking-[0.2em] mt-2"
            style={{ color: status.color }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {status.label}
          </motion.span>
        </div>
      </div>

      {/* Motivational Text */}
      <motion.p 
        className="mt-8 text-[14px] font-bold text-gray-400 text-center max-w-[280px] leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        {status.text}
      </motion.p>
    </div>
  );
}

