import type { Trade, Rule, DailyLog, PatternInsight, CoachMessage, RiskAlert, UserModel } from '@/types/trading';
import { analyzePatterns } from './patternAnalyst';
import { generateCoachCards } from './disciplineCoach';
import { checkRisks } from './riskSentinel';

export interface OrchestratorOutput {
    insights: PatternInsight[];
    coachMessages: CoachMessage[];
    riskAlerts: RiskAlert[];
}

export function runOrchestrator(
    trades: Trade[],
    rules: Rule[],
    dailyLogs: DailyLog[],
    streak: number,
    bestStreak: number,
    todayMood: string | null,
    userModel: UserModel
): OrchestratorOutput {
    // Run all agents
    const insights = analyzePatterns(trades, rules, dailyLogs);
    const coachMessages = generateCoachCards(trades, dailyLogs, streak, bestStreak, todayMood, userModel);
    const riskAlerts = checkRisks(trades, rules, todayMood);

    return {
        insights,
        coachMessages,
        riskAlerts,
    };
}
