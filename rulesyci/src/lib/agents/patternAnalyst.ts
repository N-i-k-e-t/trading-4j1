import type { Trade, Rule, DailyLog, PatternInsight } from '@/types/trading';

// Group trades by day of week (0 = Sunday, 6 = Saturday)
function groupByDayOfWeek(trades: Trade[]): Record<number, Trade[]> {
    const groups: Record<number, Trade[]> = {};
    trades.forEach(t => {
        const day = new Date(t.date + 'T12:00:00').getDay();
        if (!groups[day]) groups[day] = [];
        groups[day].push(t);
    });
    return groups;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function analyzePatterns(trades: Trade[], rules: Rule[], dailyLogs: DailyLog[]): PatternInsight[] {
    const insights: PatternInsight[] = [];

    if (trades.length < 3) return insights; // Need minimum data

    // 1. Day-of-week analysis
    const dayGroups = groupByDayOfWeek(trades);
    let worstDay = -1;
    let worstCompliance = 100;
    Object.entries(dayGroups).forEach(([day, dayTrades]) => {
        if (dayTrades.length < 2) return;
        const brokenCount = dayTrades.filter(t => t.rules_broken.length > 0).length;
        const compliance = ((dayTrades.length - brokenCount) / dayTrades.length) * 100;
        if (compliance < worstCompliance) {
            worstCompliance = compliance;
            worstDay = parseInt(day);
        }
    });
    if (worstDay >= 0 && worstCompliance < 70) {
        insights.push({
            id: 'pattern_day',
            pattern: `You break rules most often on ${DAY_NAMES[worstDay]}s (${Math.round(worstCompliance)}% compliance)`,
            confidence: 0.85,
            suggestion: `Consider reducing position size on ${DAY_NAMES[worstDay]}s or starting with a reflection session.`,
            agentSource: 'analyst',
        });
    }

    // 2. Mood-to-performance correlation
    const moodPerf: Record<string, { total: number; broken: number }> = {};
    trades.forEach(t => {
        if (!moodPerf[t.emotion]) moodPerf[t.emotion] = { total: 0, broken: 0 };
        moodPerf[t.emotion].total++;
        if (t.rules_broken.length > 0) moodPerf[t.emotion].broken++;
    });
    const worstMood = Object.entries(moodPerf)
        .filter(([, v]) => v.total >= 2)
        .sort((a, b) => (b[1].broken / b[1].total) - (a[1].broken / a[1].total))[0];
    if (worstMood && (worstMood[1].broken / worstMood[1].total) > 0.5) {
        const moodLabels: Record<string, string> = {
            very_bad: 'Very Bad', bad: 'Bad', neutral: 'Neutral', good: 'Good', great: 'Great'
        };
        insights.push({
            id: 'pattern_mood',
            pattern: `When your mood is "${moodLabels[worstMood[0]] || worstMood[0]}", you break rules ${Math.round((worstMood[1].broken / worstMood[1].total) * 100)}% of the time`,
            confidence: 0.8,
            suggestion: 'Consider sitting out or lowering size when you feel this way.',
            agentSource: 'analyst',
        });
    }

    // 3. Most broken rule
    const ruleBreakCount: Record<string, number> = {};
    trades.forEach(t => {
        t.rules_broken.forEach(rId => {
            ruleBreakCount[rId] = (ruleBreakCount[rId] || 0) + 1;
        });
    });
    const mostBroken = Object.entries(ruleBreakCount).sort((a, b) => b[1] - a[1])[0];
    if (mostBroken && mostBroken[1] >= 2) {
        const rule = rules.find(r => r.id === mostBroken[0]);
        if (rule) {
            insights.push({
                id: 'pattern_rule',
                pattern: `"${rule.text}" is your most-broken rule (${mostBroken[1]} times)`,
                confidence: 0.9,
                suggestion: 'Make this rule your #1 focus before each session. Write it on a sticky note.',
                agentSource: 'analyst',
            });
        }
    }

    // 4. Streak pattern
    if (dailyLogs.length >= 5) {
        let streaks: number[] = [];
        let current = 0;
        const sorted = [...dailyLogs].sort((a, b) => a.date.localeCompare(b.date));
        sorted.forEach((log, i) => {
            if (log.rulesChecked.length > 0 || log.tradesLogged > 0) {
                current++;
            } else {
                if (current > 0) streaks.push(current);
                current = 0;
            }
        });
        if (current > 0) streaks.push(current);
        const avgStreak = streaks.length > 0 ? Math.round(streaks.reduce((a, b) => a + b, 0) / streaks.length) : 0;
        if (avgStreak > 0 && avgStreak < 7) {
            insights.push({
                id: 'pattern_streak',
                pattern: `Your streaks typically last ${avgStreak} days before breaking`,
                confidence: 0.75,
                suggestion: `Focus on pushing past day ${avgStreak} — set a reminder and reward yourself for beating it.`,
                agentSource: 'analyst',
            });
        }
    }

    return insights;
}
