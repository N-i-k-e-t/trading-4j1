import type { Trade, Rule, RiskAlert } from '@/types/trading';

export function checkRisks(
    trades: Trade[],
    rules: Rule[],
    todayMood: string | null,
): RiskAlert[] {
    const alerts: RiskAlert[] = [];
    const today = new Date().toISOString().split('T')[0];
    const todayTrades = trades.filter(t => t.date === today);

    // 1. Session trade limit
    const maxTradesRule = rules.find(r => r.isActive && r.text.toLowerCase().includes('max') && r.text.toLowerCase().includes('trade'));
    const maxAllowed = maxTradesRule ? parseInt(maxTradesRule.text.match(/\d+/)?.[0] || '3') : 3;
    if (todayTrades.length >= maxAllowed) {
        alerts.push({
            alert: `You've reached ${todayTrades.length}/${maxAllowed} trades today — your rule says to stop.`,
            severity: 'critical',
            action: 'End session',
            timestamp: new Date().toISOString(),
        });
    } else if (todayTrades.length === maxAllowed - 1) {
        alerts.push({
            alert: `${todayTrades.length}/${maxAllowed} trades taken — last one available.`,
            severity: 'warning',
            timestamp: new Date().toISOString(),
        });
    }

    // 2. Consecutive losses (broken rules)
    const consecutiveBroken = getConsecutiveBrokenCount(todayTrades);
    const stopAfterLossRule = rules.find(r => r.isActive && r.text.toLowerCase().includes('consecutive'));
    const stopAfter = stopAfterLossRule ? parseInt(stopAfterLossRule.text.match(/\d+/)?.[0] || '2') : 2;
    if (consecutiveBroken >= stopAfter) {
        alerts.push({
            alert: `${consecutiveBroken} consecutive trades with broken rules — consider ending this session.`,
            severity: 'critical',
            action: 'Take a break',
            timestamp: new Date().toISOString(),
        });
    }

    // 3. Mood deterioration warning
    if (todayMood === 'very_bad' && todayTrades.length === 0) {
        alerts.push({
            alert: "Your mood is very low today. Consider sitting this session out entirely.",
            severity: 'warning',
            action: 'Skip session',
            timestamp: new Date().toISOString(),
        });
    }

    // 4. Multiple rule breaks today
    const totalBrokenToday = todayTrades.reduce((sum, t) => sum + t.rules_broken.length, 0);
    if (totalBrokenToday >= 3) {
        alerts.push({
            alert: `${totalBrokenToday} total rule violations today — patterns forming. Step back.`,
            severity: 'warning',
            timestamp: new Date().toISOString(),
        });
    }

    // 5. Emotional Tilt Score
    const tiltScore = calculateTiltScore(todayTrades);
    if (tiltScore >= 70) {
        alerts.push({
            alert: `TILT WARNING (Score: ${tiltScore}/100): Your emotional state and execution patterns indicate critical instability. Stop now.`,
            severity: 'critical',
            action: 'CLOSE PLATFORM',
            timestamp: new Date().toISOString(),
        });
    } else if (tiltScore >= 40) {
        alerts.push({
            alert: `TILT ALERT (Score: ${tiltScore}/100): You are showing signs of emotional decay. Step away and reset.`,
            severity: 'warning',
            action: '10 min break',
            timestamp: new Date().toISOString(),
        });
    }

    return alerts;
}

export function calculateTiltScore(todayTrades: Trade[]): number {
    let score = 0;
    
    // Mood deterioration (before vs after)
    const moodMap: Record<string, number> = { 'very_bad': 0, 'bad': 1, 'neutral': 2, 'good': 3, 'great': 4 };
    
    todayTrades.forEach(t => {
        const before = moodMap[t.moodBefore || 'neutral'];
        const after = moodMap[t.moodAfter || 'neutral'];
        
        if (after < before) score += 20; // Dropped mood after trade
        if (after === 0) score += 30;    // Very bad mood after trade
        if (t.rules_broken.length > 0) score += 10 * t.rules_broken.length;
    });

    // Rapid fires
    if (todayTrades.length > 2) {
        const last = new Date(todayTrades[todayTrades.length - 1].date);
        const prev = new Date(todayTrades[todayTrades.length - 2].date);
        // If trades are < 5 mins apart (simplified here as we don't have full timestamps yet)
        // just use trade count for now
        score += (todayTrades.length - 2) * 15;
    }

    return Math.min(score, 100);
}

function getConsecutiveBrokenCount(trades: Trade[]): number {
    let count = 0;
    for (let i = trades.length - 1; i >= 0; i--) {
        if (trades[i].rules_broken.length > 0) {
            count++;
        } else {
            break;
        }
    }
    return count;
}
