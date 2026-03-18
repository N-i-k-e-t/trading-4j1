'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRuleSci } from '@/lib/context';
import {
  Check,
  Flame,
  BarChart2,
  Plus,
  ShieldCheck,
  Target,
  Activity,
  Shield,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { calculateTiltScore } from '@/lib/agents/riskSentinel';
import WeekStrip from '@/components/calendar/WeekStrip';
import InsightCards from '@/components/InsightCards';
import { runOrchestrator } from '@/lib/agents/orchestrator';
import { DailyLog } from '@/types/trading';

export default function TodayPage() {
  const { rules, user, trades, dailyLogs, playbooks, showToast, logDaily, setCoachMessages, setInsights, analytics, userModel } = useRuleSci();
  const router = useRouter();
  const [mood, setMood] = useState<string | null>(null);
  const [checkedRules, setCheckedRules] = useState<Record<string, boolean>>({});
  const [showSolid, setShowSolid] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayTrades = useMemo(() => trades.filter(t => t.date === today), [trades, today]);
  const todayPnL = useMemo(() => todayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0), [todayTrades]);

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

  // Intelligent Rule Sorting & Selection
  const { focusedRule, topRules, solidRules, activeRulesCount } = useMemo(() => {
    const active = rules.filter(r => r.isActive);
    
    const violationCounts: Record<string, number> = {};
    trades.forEach(t => t.rules_broken.forEach(id => {
      violationCounts[id] = (violationCounts[id] || 0) + 1;
    }));

    const focusId = Object.entries(violationCounts).sort((a,b) => b[1] - a[1])[0]?.[0];
    const focus = active.find(r => r.id === focusId);

    const main = active.filter(r => r.id !== focusId && (violationCounts[r.id] || 0) > 0);
    const solid = active.filter(r => r.id !== focusId && !violationCounts[r.id]);

    return { 
        focusedRule: focus, 
        topRules: main.sort((a,b) => (violationCounts[b.id] || 0) - (violationCounts[a.id] || 0)),
        solidRules: solid,
        activeRulesCount: active.length
    };
  }, [rules, trades]);

  const checkedCount = Object.values(checkedRules).filter(Boolean).length;
  const compliance = activeRulesCount > 0 ? Math.round((checkedCount / activeRulesCount) * 100) : 100;

  const toggleRule = (id: string) => {
    setCheckedRules(prev => {
      const next = { ...prev, [id]: !prev[id] };
      const checkedIds = Object.entries(next).filter(([, v]) => v).map(([k]) => k);
      logDaily({
        date: today,
        tradesLogged: todayTrades.length,
        rulesChecked: checkedIds,
        mood: mood || '',
        rulesFollowed: checkedIds.length,
        rulesBroken: activeRulesCount - checkedIds.length,
        pnl: todayPnL,
        grade: calculateGrade(activeRulesCount > 0 ? (checkedIds.length / activeRulesCount) * 100 : 100)
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
      rulesBroken: activeRulesCount - checkedIds.length,
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
        const dStr = d.toISOString().split('T')[0];
        const log = sortedLogs.find(l => l.date === dStr);
        if (log && (log.rulesChecked.length > 0 || log.tradesLogged > 0)) {
            count++;
        } else if (i > 0) {
            break;
        }
        d.setDate(d.getDate() - 1);
    }
    return count;
  }, [dailyLogs]);

  const tiltScore = useMemo(() => calculateTiltScore(todayTrades), [todayTrades]);
  const tiltColor = tiltScore > 70 ? '#ef4444' : tiltScore > 40 ? '#f59e0b' : '#22c55e';
  const tiltMessage = tiltScore > 70 ? 'CRITICAL TILT' : tiltScore > 40 ? 'CAUTION' : 'STABLE';

  // Run Orchestrator for insights
  useEffect(() => {
    if (trades.length > 0) {
      const output = runOrchestrator(
        trades, 
        rules, 
        dailyLogs, 
        streak, 
        analytics.consistencyDays, 
        mood,
        userModel
      );
      setCoachMessages(output.coachMessages);
      setInsights(output.insights);
    }
  }, [trades, rules, dailyLogs, streak, analytics.consistencyDays, mood, setCoachMessages, setInsights]);

  const calculateGrade = (compl: number): DailyLog['grade'] => {
    if (compl >= 90) return 'A';
    if (compl >= 75) return 'B';
    if (compl >= 60) return 'C';
    if (compl >= 40) return 'D';
    return 'F';
  };

  const moods = [
    { label: "Very Bad", emoji: "😢", value: "very_bad" },
    { label: "Bad", emoji: "😕", value: "bad" },
    { label: "Neutral", emoji: "😐", value: "neutral" },
    { label: "Good", emoji: "🙂", value: "good" },
    { label: "Great", emoji: "😄", value: "great" },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a2e] leading-tight flex items-center gap-2">
            {greeting}, {user?.name?.split(' ')[0] || 'Trader'}
          </h1>
          <p className="text-base text-[#6b7280]">{dateStr}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <span className="text-[9px] font-black uppercase tracking-widest">Model Confidence</span>
                <span className="text-[11px] font-bold">{Math.round(userModel.model_confidence * 100)}%</span>
            </div>
            {streak > 0 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-[#f59e0b]/10 text-[#f59e0b] rounded-full">
                    <Flame size={12} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{streak}-day streak</span>
                </div>
            )}
        </div>
      </header>

      {/* Focus Rule Banner */}
      {focusedRule && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="p-5 bg-[#1a1a2e] rounded-3xl text-white relative overflow-hidden group border border-white/10 shadow-xl shadow-[#1a1a2e]/20"
          >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                  <Shield size={64} />
              </div>
              <div className="relative z-10">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Today&apos;s Focus Rule</p>
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                          {focusedRule.emoji || '🛡️'}
                      </div>
                      <h3 className="text-[17px] font-bold leading-tight">{focusedRule.text}</h3>
                  </div>
              </div>
          </motion.div>
      )}

      {/* Ambient Intelligence Cards */}
      <InsightCards />

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
          <h2 className="text-xl font-bold text-[#1a1a2e] flex items-center gap-2">
            Priority Checklist
            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Sorted by risk
            </span>
          </h2>
          <button onClick={() => router.push('/rules')} className="text-sm font-bold text-[#2563eb]">Edit</button>
        </div>

        <div className="flex flex-col gap-3">
          {topRules.map((rule) => (
             <RuleRow key={rule.id} rule={rule} checked={checkedRules[rule.id]} onToggle={() => toggleRule(rule.id)} />
          ))}

          {solidRules.length > 0 && (
              <div className="mt-4">
                  <button 
                    onClick={() => setShowSolid(!showSolid)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-50/50 rounded-2xl text-[#6b7280] hover:bg-gray-50 transition-all border border-gray-100"
                  >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">Solid Foundations</span>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-gray-100">{solidRules.length}</span>
                      </div>
                      <ChevronDown size={16} className={`transition-transform duration-300 ${showSolid ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                      {showSolid && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden flex flex-col gap-2 mt-2"
                          >
                              {solidRules.map((rule) => (
                                <RuleRow key={rule.id} rule={rule} checked={checkedRules[rule.id]} onToggle={() => toggleRule(rule.id)} faded />
                              ))}
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>
          )}

          {activeRulesCount === 0 && (
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-center p-12">
              <ShieldCheck size={48} className="mx-auto text-[#9ca3af] mb-4 opacity-20" />
              <p className="text-[#6b7280] font-medium mb-4">No active rules for today</p>
              <button
                onClick={() => router.push('/rules')}
                className="bg-[#1a1a2e] text-white px-6 py-2 rounded-full text-sm font-bold"
              >
                  Define your playbook
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Mood Tracker */}
      <section className="pb-8">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">How are you feeling?</h2>
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#1a1a2e]/5">
          <div className="flex justify-between items-center gap-2 overflow-x-auto pb-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => handleMoodSelect(m.value)}
                className={`flex flex-col items-center gap-2 min-w-[64px] transition-all ${mood === m.value ? 'scale-110' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                  }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function RuleRow({ rule, checked, onToggle, faded = false }: any) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onToggle}
            className={`bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] cursor-pointer border border-transparent hover:border-blue-500/10 transition-all ${faded ? 'opacity-60' : ''}`}
        >
            <div className={`w-10 h-10 bg-[#1a1a2e]/5 rounded-xl flex items-center justify-center text-xl ${faded ? 'grayscale' : ''}`}>
                {rule.emoji || '🎯'}
            </div>
            <span className={`flex-1 text-[16px] font-semibold text-[#1a1a2e] ${faded ? 'text-[#6b7280]' : ''}`}>
                {rule.text}
            </span>
            <div
                className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${checked
                    ? 'bg-[#22c55e] border-[#22c55e]'
                    : 'border-[#1a1a2e]/10 bg-transparent'
                    }`}
            >
                {checked && <Check size={16} strokeWidth={4} className="text-white" />}
            </div>
        </motion.div>
    );
}
