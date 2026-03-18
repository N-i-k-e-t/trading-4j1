'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import {
  Check,
  Flame,
  BarChart2,
  Plus,
  ShieldCheck,
  Target,
  Activity
} from 'lucide-react';
import { calculateTiltScore } from '@/lib/agents/riskSentinel';
import WeekStrip from '@/components/calendar/WeekStrip';
import { DailyLog } from '@/types/trading';

export default function TodayPage() {
  const { rules, user, trades, dailyLogs, playbooks, showToast, logDaily } = useRuleSci();
  const router = useRouter();
  const [mood, setMood] = useState<string | null>(null);
  const [checkedRules, setCheckedRules] = useState<Record<string, boolean>>({});

  const today = new Date().toISOString().split('T')[0];

  // Restore today's checks from dailyLogs
  useEffect(() => {
    const todayLog = dailyLogs.find(d => d.date === today);
    if (todayLog) {
      const restored: Record<string, boolean> = {};
      todayLog.rulesChecked.forEach(id => { restored[id] = true; });
      setCheckedRules(restored);
      if (todayLog.mood) setMood(todayLog.mood);
    }
  }, [dailyLogs, today]);

  const toggleRule = (id: string) => {
    setCheckedRules(prev => {
      const next = { ...prev, [id]: !prev[id] };
      // Persist to daily log
      const checkedIds = Object.entries(next).filter(([, v]) => v).map(([k]) => k);
      logDaily({
        date: today,
        tradesLogged: todayTrades.length,
        rulesChecked: checkedIds,
        mood: mood || '',
        rulesFollowed: checkedIds.length,
        rulesBroken: activeRules.length - checkedIds.length,
        pnl: todayPnL,
        grade: calculateGrade(activeRules.length > 0 ? (checkedIds.length / activeRules.length) * 100 : 100)
      });
      return next;
    });
  };

  const handleMoodSelect = (value: string) => {
    setMood(value);
    const checkedIds = Object.entries(checkedRules).filter(([, v]) => v).map(([k]) => k);
    logDaily({
      date: today,
      tradesLogged: todayTrades.length,
      rulesChecked: checkedIds,
      mood: value,
      rulesFollowed: checkedIds.length,
      rulesBroken: activeRules.length - checkedIds.length,
      pnl: todayPnL,
      grade: calculateGrade(compliance)
    });
    showToast('Mood saved', 'success');
  };

  // Dynamic date
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Real streak calculation
  const streak = useMemo(() => {
    let count = 0;
    const sortedLogs = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = d.toISOString().split('T')[0];
      const log = sortedLogs.find(l => l.date === dateStr);
      if (log && (log.rulesChecked.length > 0 || log.tradesLogged > 0)) {
        count++;
      } else if (i > 0) {
        break;
      }
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [dailyLogs]);

  const activeRules = rules.filter(r => r.isActive);
  const todayTrades = trades.filter(t => t.date === today);
  const checkedCount = Object.values(checkedRules).filter(Boolean).length;
  const compliance = activeRules.length > 0 ? Math.round((checkedCount / activeRules.length) * 100) : 0;

  const tiltScore = useMemo(() => calculateTiltScore(todayTrades), [todayTrades]);
  
  const tiltColor = tiltScore > 70 ? '#ef4444' : tiltScore > 40 ? '#f59e0b' : '#22c55e';
  const tiltMessage = tiltScore > 70 ? 'CRITICAL TILT' : tiltScore > 40 ? 'CAUTION' : 'STABLE';

  const moods = [
    { label: "Very Bad", emoji: "😢", value: "very_bad" },
    { label: "Bad", emoji: "😕", value: "bad" },
    { label: "Neutral", emoji: "😐", value: "neutral" },
    { label: "Good", emoji: "🙂", value: "good" },
    { label: "Great", emoji: "😄", value: "great" },
  ];

  const calculateGrade = (compl: number): DailyLog['grade'] => {
    if (compl >= 100) return 'A';
    if (compl >= 80) return 'B';
    if (compl >= 60) return 'C';
    if (compl >= 40) return 'D';
    return 'F';
  };

  const todayPnL = useMemo(() => todayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0), [todayTrades]);


  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <header>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[22px] font-bold text-[#1a1a2e] leading-tight">
            {greeting}, {user?.name?.split(' ')[0] || 'Trader'}
          </h1>
          {streak > 0 && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#f59e0b]/10 text-[#f59e0b] rounded-full flex-shrink-0 ml-3">
              <Flame size={14} fill="currentColor" />
              <span className="text-[12px] font-bold">{streak}-day streak</span>
            </div>
          )}
        </div>
        <p className="text-base text-[#6b7280]">{dateStr}</p>
      </header>

      {/* Week Strip Calendar */}
      <WeekStrip />

      {/* Tilt Meter - Signature Feature */}
      <section>
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#1a1a2e]/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <Activity size={120} />
            </div>
            
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-[0.2em] mb-1">Tilt Meter</h3>
                    <p className={`text-sm font-bold`} style={{ color: tiltColor }}>{tiltMessage}</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-black text-[#1a1a2e]">{tiltScore}</span>
                    <span className="text-[10px] font-bold text-[#9ca3af] ml-1">/100</span>
                </div>
            </div>

            <div className="relative h-3 w-full bg-[#1a1a2e]/5 rounded-full overflow-hidden mb-4">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${tiltScore}%` }}
                    className="h-full transition-colors duration-500"
                    style={{ backgroundColor: tiltColor }}
                />
            </div>

            <p className="text-[12px] text-[#6b7280] leading-relaxed">
                {tiltScore > 70 
                    ? "Your emotional threshold is breached. Force-stop all trading immediately." 
                    : tiltScore > 40 
                    ? "Warning: Frustration is mounting. Take a 15-minute reset walk."
                    : "Execution is disciplined. Stay in the zone."}
            </p>
        </div>
      </section>

      {/* Main Section: Today's Rules */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1a1a2e]">Today&apos;s Rules</h2>
          <button onClick={() => router.push('/rules')} className="text-sm font-bold text-[#2563eb]">Edit</button>
        </div>

        <div className="flex flex-col gap-3">
          {activeRules.length > 0 ? (
            activeRules.map((rule) => (
              <motion.div
                key={rule.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleRule(rule.id)}
                className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] cursor-pointer"
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
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-center p-12">
              <ShieldCheck size={48} className="mx-auto text-[#9ca3af] mb-4 opacity-20" />
              <p className="text-[#6b7280] font-medium mb-4">No active rules for today</p>
              <button
                onClick={() => router.push('/rules')}
                className="bg-[#1a1a2e] text-white px-6 py-2 rounded-full text-sm font-bold"
              >
                Add Rules
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Check-in */}
      <section>
        <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <h3 className="text-sm font-bold text-[#6b7280] uppercase tracking-wider mb-6">How are you feeling?</h3>
          <div className="flex justify-between gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => handleMoodSelect(m.value)}
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

      {/* Playbook Distribution */}
      {todayTrades.length > 0 && (
        <section>
            <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <h3 className="text-sm font-bold text-[#6b7280] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Target size={14} /> Setup Performance
                </h3>
                <div className="flex flex-col gap-3">
                    {Array.from(new Set(todayTrades.map(t => t.setupId))).map(setupId => {
                        const setupName = playbooks.find(p => p.id === setupId)?.name || 'Unknown Setup';
                        const count = todayTrades.filter(t => t.setupId === setupId).length;
                        return (
                            <div key={setupId} className="flex items-center justify-between">
                                <span className="text-[13px] font-semibold text-[#1a1a2e]">{setupName}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-bold text-[#6b7280]">{count} trade{count !== 1 ? 's' : ''}</span>
                                    <div className="w-16 h-1.5 bg-[#1a1a2e]/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#1a1a2e]/20" style={{ width: `${(count / todayTrades.length) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
      )}

      {/* Today's Summary */}
      <section>
        <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563eb]/10 text-[#2563eb] rounded-xl flex items-center justify-center">
              <BarChart2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a1a2e]">Today&apos;s Summary</h3>
              <p className="text-[12px] text-[#6b7280] font-medium uppercase tracking-wider">
                Based on {todayTrades.length} trade{todayTrades.length !== 1 ? 's' : ''} logged
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1a2e]/[0.04] rounded-xl p-3">
              <span className="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Trades</span>
              <span className="text-2xl font-bold text-[#1a1a2e]">{todayTrades.length}</span>
            </div>
            <div className="bg-[#1a1a2e]/[0.04] rounded-xl p-3">
              <span className="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Rules</span>
              <span className="text-2xl font-bold text-[#1a1a2e]">{checkedCount}/{activeRules.length}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#1a1a2e]">Compliance</span>
              <span className="text-sm font-bold text-[#2563eb]">{compliance}%</span>
            </div>
            <div className="w-full h-2 bg-[#1a1a2e]/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#2563eb] transition-all duration-500" style={{ width: `${compliance}%` }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
