import type { Trade, Rule, DailyLog, PatternInsight, CoachMessage, RiskAlert } from '@/types/trading';
import { analyzePatterns } from './patternAnalyst';
import { getCoachMessage } from './disciplineCoach';
import { checkRisks } from './riskSentinel';

export interface OrchestratorOutput {
    insights: PatternInsight[];
    coachMessage: CoachMessage;
    riskAlerts: RiskAlert[];
}

export function runOrchestrator(
    trades: Trade[],
    rules: Rule[],
    dailyLogs: DailyLog[],
    streak: number,
    bestStreak: number,
    todayMood: string | null,
): OrchestratorOutput {
    // Run all agents
    const insights = analyzePatterns(trades, rules, dailyLogs);
    const coachMessage = getCoachMessage(trades, dailyLogs, streak, bestStreak, todayMood);
    const riskAlerts = checkRisks(trades, rules, todayMood);

    return {
        insights,
        coachMessage,
        riskAlerts,
    };
}
