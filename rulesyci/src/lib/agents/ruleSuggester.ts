import { Trade, Rule } from '@/types/trading';

/**
 * Analyzes trade history to find consistently broken rules,
 * particularly those broken multiple times recently, and recommends
 * creating new reinforcing micro-rules (like pre-entry checklists).
 */
export function generateRuleSuggestions(trades: Trade[], activeRules: Rule[]): { suggestedRule: Partial<Rule> | null, reason: string } {
    // We only care about recent active trading history (e.g. last 30 trades or last 14 days)
    const recentTrades = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 30);
    
    // Count broken rules
    const brokenCounts: Record<string, number> = {};
    recentTrades.forEach(t => {
        t.rules_broken.forEach(rId => {
            brokenCounts[rId] = (brokenCounts[rId] || 0) + 1;
        });
    });

    // Find the most frequently broken rule (minimum 3 times to trigger suggestion)
    let worstRuleId: string | null = null;
    let worstCount = 0;
    
    Object.entries(brokenCounts).forEach(([rId, count]) => {
        if (count > worstCount && count >= 3) {
            worstCount = count;
            worstRuleId = rId;
        }
    });

    if (!worstRuleId) {
        return { suggestedRule: null, reason: "" };
    }

    const worstRule = activeRules.find(r => r.id === worstRuleId);
    if (!worstRule) return { suggestedRule: null, reason: "" };

    const ruleTextLower = worstRule.text.toLowerCase();

    // Generate a targeted micro-rule suggestion based on keyword heuristics
    let newSuggestion: string = "Pre-trade checklist: Wait 5 minutes before executing";
    let newCategory: string = "Mindset";
    let newEmoji: string = "⏳";
    
    if (ruleTextLower.includes("stop loss") || ruleTextLower.includes("sl")) {
        newSuggestion = "Checklist: Stop loss is placed in broker before entering";
        newCategory = "Risk Management";
        newEmoji = "🛡️";
    } else if (ruleTextLower.includes("confirmation") || ruleTextLower.includes("candle")) {
        newSuggestion = "Checklist: High timeframe candle is actually closed";
        newCategory = "Entry";
        newEmoji = "🕯️";
    } else if (ruleTextLower.includes("revenge") || ruleTextLower.includes("loss")) {
        newSuggestion = "Checklist: Have I walked away for 10m after my last loss?";
        newCategory = "Mindset";
        newEmoji = "🚶";
    }

    // Check if the user already has this exact suggestion active
    if (activeRules.some(r => r.text === newSuggestion)) {
        return { suggestedRule: null, reason: "" };
    }

    return {
        suggestedRule: {
            text: newSuggestion,
            category: newCategory,
            emoji: newEmoji,
            isActive: true
        },
        reason: `You've broken "${worstRule.text}" ${worstCount} times recently. Want to add a pre-entry checklist rule to fix this habit?`
    };
}
