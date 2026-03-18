export enum MarketPhase {
    BEFORE = 'before',
    DURING = 'during',
    AFTER = 'after',
}

export enum Emotion {
    CALM = 'calm',
    NEUTRAL = 'neutral',
    TIRED = 'tired',
    STRESSED = 'stressed',
    ANXIOUS = 'anxious',
    FEARFUL = 'fearful',
    OVERCONFIDENT = 'overconfident',
    GREED = 'greed',
    DOUBT = 'doubt',
    CONFIDENCE = 'confidence',
    FOMO = 'fomo',
    ANGER = 'anger',
    RELIEF = 'relief',
    FRUSTRATION = 'frustration',
    JOY = 'joy',
}

export enum EmotionPhase {
    PRE_MARKET = 'pre_market',
    ENTRY = 'entry',
    DURING = 'during',
    EXIT = 'exit',
    POST_MARKET = 'post_market',
}

export enum DailyIntention {
    PROCESS_CONSISTENCY = 'process_consistency',
    EMOTIONAL_CONTROL = 'emotional_control',
    SETUP_QUALITY = 'setup_quality',
}

export enum ExitType {
    PLANNED = 'planned',
    STOP = 'stop',
    MANUAL = 'manual',
}

export enum TradeType {
    SYSTEM = 'system',
    EMOTIONAL = 'emotional',
}

export enum TradeOutcome {
    PROFIT = 'profit',
    LOSS = 'loss',
    BREAKEVEN = 'breakeven',
}

export enum FearLevel {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum PrimaryFear {
    LOSING_CAPITAL = 'losing_capital',
    MISSING_OPPORTUNITY = 'missing_opportunity',
    BEING_WRONG = 'being_wrong',
    GIVING_BACK_PROFITS = 'giving_back_profits',
}
