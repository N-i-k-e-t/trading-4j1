import type { Trade, DailyLog, CoachMessage } from '@/types/trading';

export function getCoachMessage(
    trades: Trade[],
    dailyLogs: DailyLog[],
    streak: number,
    bestStreak: number,
    todayMood: string | null,
): CoachMessage {
    // Priority 1: Streak encouragement
    if (streak > 0 && bestStreak > streak && (bestStreak - streak) <= 3) {
        return {
            message: `You're ${bestStreak - streak} day${bestStreak - streak > 1 ? 's' : ''} away from beating your personal best streak of ${bestStreak} days! Keep going.`,
            tone: 'encouraging',
            priority: 1,
        };
    }

    // Priority 2: Mood-based coaching
    if (todayMood === 'very_bad' || todayMood === 'bad') {
        return {
            message: "Tough day? Consider reducing your position size or sitting this session out. Discipline means knowing when NOT to trade.",
            tone: 'warning',
            priority: 2,
        };
    }

    // Priority 3: Win streak
    const recentTrades = trades.slice(0, 5);
    const recentClean = recentTrades.filter(t => t.rules_broken.length === 0);
    if (recentTrades.length >= 3 && recentClean.length === recentTrades.length) {
        return {
            message: `${recentClean.length} clean trades in a row! Your discipline is compounding. Stay focused, stay process-driven.`,
            tone: 'encouraging',
            priority: 3,
        };
    }

    // Priority 4: Recent rule breaks
    if (recentTrades.length >= 2) {
        const brokenCount = recentTrades.filter(t => t.rules_broken.length > 0).length;
        if (brokenCount >= 2) {
            return {
                message: `You've broken rules in ${brokenCount} of your last ${recentTrades.length} trades. Pause, re-read your rules, and re-center before the next entry.`,
                tone: 'warning',
                priority: 4,
            };
        }
    }

    // Priority 5: Streak milestone
    if (streak >= 7 && streak % 7 === 0) {
        return {
            message: `${streak} days of discipline! That's ${Math.floor(streak / 7)} full week${streak >= 14 ? 's' : ''}. You're building a real habit.`,
            tone: 'encouraging',
            priority: 5,
        };
    }

    // Default: Process-focused
    return {
        message: "Focus on the process, not the outcome. Every rule followed is a win, regardless of P&L.",
        tone: 'neutral',
        priority: 10,
    };
}
