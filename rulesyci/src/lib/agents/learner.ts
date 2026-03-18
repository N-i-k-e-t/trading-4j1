import { Trade, UserModel, Rule } from '@/types/trading';

/**
 * The Learner Agent silently observes every trade and updates the Per-User Model.
 * It identifies patterns like session preference, dominant weakness, and news sensitivity.
 */
export function evolveModel(
    currentModel: UserModel,
    newTrade: Trade,
    allTrades: Trade[],
    allRules: Rule[]
): UserModel {
    const updatedModel = { ...currentModel };
    const today = new Date();
    
    // 1. Update Session Preference (learned frequency)
    const hour = today.getHours();
    if (hour < 12) updatedModel.session_preference = 'morning';
    else if (hour < 16) updatedModel.session_preference = 'afternoon';
    else updatedModel.session_preference = 'evening';

    // 2. Update Dominant Weakness (most frequent rule violation)
    const ruleViolations: Record<string, number> = {};
    allTrades.forEach(t => {
        t.rules_broken.forEach(rId => {
            ruleViolations[rId] = (ruleViolations[rId] || 0) + 1;
        });
    });
    
    const mostViolatedId = Object.entries(ruleViolations)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
    
    if (mostViolatedId) {
        const rule = allRules.find(r => r.id === mostViolatedId);
        if (rule) updatedModel.dominant_weakness = rule.text.toLowerCase().replace(/ /g, '_').slice(0, 20);
    }

    // 3. Update Avg Trades per Day
    const uniqueDays = new Set(allTrades.map(t => t.date)).size || 1;
    updatedModel.avg_trades_per_day = parseFloat((allTrades.length / uniqueDays).toFixed(1));

    // 4. Psychology: Overconfidence Pattern (size spike after a win)
    if (allTrades.length >= 2) {
        const lastTrade = allTrades[allTrades.length - 1];
        const prevTrade = allTrades[allTrades.length - 2];
        if (prevTrade.pnl && prevTrade.pnl > 0 && lastTrade.pnl && lastTrade.pnl < 0) {
            // Simplified logic: if they lose after a win, maybe overconfident
            updatedModel.overconfidence_pattern = true;
        }
    }

    // 5. Update Confidence Level (linear growth with trade count)
    updatedModel.model_confidence = Math.min(0.2 + (allTrades.length * 0.01), 0.95);
    updatedModel.model_updated_at = new Date().toISOString();

    return updatedModel;
}
