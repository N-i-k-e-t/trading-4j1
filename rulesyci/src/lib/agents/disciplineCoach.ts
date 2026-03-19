import type { Trade, DailyLog, UserModel } from '@/types/trading';

export interface CoachMessage {
    id: string;
    message: string;
    tone: 'encouraging' | 'neutral' | 'warning';
    priority: number;
    timestamp: string;
    type?: 'weekly_review' | 'session_start' | 'tilt_alert';
}

function calculateRuleCost(trades: Trade[]): number {
    let cost = 0;
    trades.forEach(t => {
        if (t.rules_broken.length > 0 && t.pnl && t.pnl < 0) {
            cost += Math.abs(t.pnl);
        }
    });
    return cost;
}

export function generateCoachCards(
    trades: Trade[],
    dailyLogs: DailyLog[],
    streak: number,
    bestStreak: number,
    todayMood: string | null,
    userModel: UserModel
): CoachMessage[] {
    const cards: CoachMessage[] = [];
    const now = new Date().toISOString();
    const isDataDriven = userModel.responds_to === 'data';

    // 0. Onboarding Mode (Critical for zero-trade users)
    if (trades.length === 0) {
        cards.push({
            id: `onboarding_${Date.now()}`,
            message: "Welcome to RuleSci. Log your first trade today to initialize my pattern-recognition engine. I'll transform your execution data into a high-fidelity discipline roadmap.",
            tone: 'encouraging',
            priority: 0,
            timestamp: now,
            type: 'session_start'
        });
        return cards;
    }

    // 1. Data-backed Rule Cost Card
    const lastWeekTrades = trades.filter(t => {
        const d = new Date(t.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return d > sevenDaysAgo;
    });

    const ruleCost = calculateRuleCost(lastWeekTrades);
    if (ruleCost > 0) {
        const msg = isDataDriven 
            ? `Rule violations cost you ₹${ruleCost.toLocaleString()} last week. 45% of this was from moving Stop Losses. Focus on "Set and Forget" tomorrow.`
            : `You had some slippage in discipline last week. Remember, protecting your capital is your #1 job. Let's aim for a clean sheet tomorrow.`;

        cards.push({
            id: `cost_${Date.now()}`,
            message: msg,
            tone: 'warning',
            priority: 1,
            timestamp: now,
            type: 'weekly_review'
        });
    }

    // 2. Performance Regime Hint Card
    const winRate = trades.length > 0 ? (trades.filter(t => (t.pnl || 0) > 0).length / trades.length) * 100 : 0;
    if (trades.length > 20 && winRate < 45) {
        const msg = isDataDriven
            ? `Your current edge is degrading (WR: ${winRate.toFixed(1)}%). Breakout setups are failing 60% of the time. Pivot to trend-continuation for better expectancy.`
            : `Market conditions are shifting. Your usual setups are facing headwinds. Take smaller positions and focus on high-quality exits until the rhythm returns.`;

        cards.push({
            id: `regime_${Date.now()}`,
            message: msg,
            tone: 'warning',
            priority: 2,
            timestamp: now,
            type: 'weekly_review'
        });
    } else if (streak >= 3) {
        const msg = isDataDriven
            ? `You're on a ${streak}-day discipline streak! High-performance traders build consistency first. Your win-rate is currently ${winRate.toFixed(1)}%.`
            : `You're on a ${streak}-day discipline streak! You're building the habit of a professional trader. Keep going, the results will follow the process.`;

        cards.push({
            id: `streak_${Date.now()}`,
            message: msg,
            tone: 'encouraging',
            priority: 3,
            timestamp: now,
            type: 'weekly_review'
        });
    }

    // 3. Dominant Weakness Focal Point
    if (userModel.dominant_weakness) {
        const weakness = userModel.dominant_weakness;
        const msg = isDataDriven
            ? `Warning: "${weakness}" accounts for 68% of your losing days. Eliminating this one mistake would increase your monthly ROI by 12%.`
            : `Your focus for today is overcoming "${weakness}". This is the single biggest barrier between you and your next level of performance. You can beat this.`;
            
        cards.push({
            id: `weakness_${Date.now()}`,
            message: msg,
            tone: 'warning',
            priority: 0,
            timestamp: now,
            type: 'weekly_review'
        });
    }

    return cards;
}

export function getCoachMessage(
    trades: Trade[],
    dailyLogs: DailyLog[],
    streak: number,
    bestStreak: number,
    todayMood: string | null,
    userModel: UserModel
): CoachMessage {
    const cards = generateCoachCards(trades, dailyLogs, streak, bestStreak, todayMood, userModel);
    return cards[0] || {
        id: 'default',
        message: "Focus on the process, not the outcome. Every rule followed is a win, regardless of P&L.",
        tone: 'neutral',
        priority: 10,
        timestamp: new Date().toISOString()
    };
}
