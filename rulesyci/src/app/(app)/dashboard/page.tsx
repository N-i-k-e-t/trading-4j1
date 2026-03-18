'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRuleSci } from '@/lib/context';
import {
  Check,
  Flame,
  BarChart2,
  Plus,
  ShieldCheck,
  Target
} from 'lucide-react';

export default function TodayPage() {
  const { rules, user } = useRuleSci();
  const [mood, setMood] = useState<string | null>(null);
  const [checkedRules, setCheckedRules] = useState<Record<string, boolean>>({});

  const toggleRule = (id: string) => {
    setCheckedRules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const moods = [
    { label: "Very Bad", emoji: "😢", value: "very_bad" },
    { label: "Bad", emoji: "😕", value: "bad" },
    { label: "Neutral", emoji: "😐", value: "neutral" },
    { label: "Good", emoji: "🙂", value: "good" },
    { label: "Great", emoji: "😄", value: "great" },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[28px] font-bold text-[#1a1a2e]">
            Good evening, {user?.name?.split(' ')[0] || 'Trader'}
          </h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f59e0b]/10 text-[#f59e0b] rounded-full">
            <Flame size={16} fill="currentColor" />
            <span className="text-[13px] font-bold">4-day streak</span>
          </div>
        </div>
        <p className="text-base text-[#6b7280]">Saturday, February 21</p>
      </header>

      {/* Main Section: Today's Rules */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1a1a2e]">Today's Rules</h2>
          <span className="text-sm font-bold text-[#2563eb]">Edit</span>
        </div>

        <div className="flex flex-col gap-3">
          {rules.length > 0 ? (
            rules.map((rule) => (
              <motion.div
                key={rule.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleRule(rule.id)}
                className="card flex items-center gap-4 cursor-pointer"
              >
                <div className="w-10 h-10 bg-[#1a1a2e]/5 rounded-xl flex items-center justify-center text-xl">
                  {rule.emoji || '🎯'}
                </div>
                <span className="flex-1 text-[16px] font-semibold text-[#1a1a2e]">
                  {rule.text}
                </span>
                <div
                  className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${checkedRules[rule.id]
                    ? 'bg-[#22c55e] border-[#22c55e]'
                    : 'border-[#1a1a2e]/10 bg-transparent'
                    }`}
                >
                  {checkedRules[rule.id] && <Check size={16} strokeWidth={4} className="text-white" />}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="card text-center p-12">
              <ShieldCheck size={48} className="mx-auto text-[#9ca3af] mb-4 opacity-20" />
              <p className="text-[#6b7280] font-medium mb-4">No active rules for today</p>
              <button className="bg-[#1a1a2e] text-white px-6 py-2 rounded-full text-sm font-bold">
                Add Rules
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Check-in */}
      <section>
        <div className="card">
          <h3 className="text-sm font-bold text-[#6b7280] uppercase tracking-wider mb-6">How are you feeling?</h3>
          <div className="flex justify-between gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex flex-col items-center gap-2 flex-1 pt-3 pb-4 rounded-2xl transition-all ${mood === m.value
                  ? 'bg-[#2563eb]/10 ring-2 ring-[#2563eb]'
                  : 'bg-[#1a1a2e]/5 hover:bg-[#1a1a2e]/10'
                  }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${mood === m.value ? 'text-[#2563eb]' : 'text-[#9ca3af]'
                  }`}>
                  {m.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Summary */}
      <section>
        <div className="card flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563eb]/10 text-[#2563eb] rounded-xl flex items-center justify-center">
              <BarChart2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a1a2e]">Today's Summary</h3>
              <p className="text-[12px] text-[#6b7280] font-medium uppercase tracking-wider">Based on 3 trades logged</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1a2e]/5 rounded-2xl p-4">
              <span className="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Trades</span>
              <span className="text-2xl font-bold text-[#1a1a2e]">3</span>
            </div>
            <div className="bg-[#1a1a2e]/5 rounded-2xl p-4">
              <span className="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Rules</span>
              <span className="text-2xl font-bold text-[#1a1a2e]">5/6</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#1a1a2e]">Compliance</span>
              <span className="text-sm font-bold text-[#2563eb]">83%</span>
            </div>
            <div className="w-full h-2 bg-[#1a1a2e]/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#2563eb]" style={{ width: '83%' }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
