export type BaselineState = 'very_bad' | 'bad' | 'neutral' | 'good' | 'great';

export interface User {
    email: string;
    name: string;
    isPro: boolean;
    isAdmin?: boolean;
    role?: 'admin' | 'trader';
    trialStartDate?: string;
}

export interface Rule {
    id: string;
    text: string;
    emoji?: string;
    category?: string;
    isActive: boolean;
    violated?: boolean; // Keep for backward compat or temporary state
}

export interface Playbook {
    id: string;
    name: string;
    description: string;
    rules: string[]; // Rule IDs that belong to this playbook
    criteria: string[];
    avgR?: number;
    winRate?: number;
}

export interface Trade {
    id: string;
    date: string;
    pair: string;
    type: 'Long' | 'Short';
    entry: string;
    exit: string;
    plannedEntry?: string;
    plannedSL?: string;
    actualSL?: string;
    plannedTP?: string;
    pnl?: number;
    pnlR?: number; // R-Multiple
    rules_followed: string[]; // Rule IDs followed
    rules_broken: string[]; // Rule IDs broken
    emotion: BaselineState; // Combined/Final emotion
    moodBefore?: BaselineState; // Tilt Tracker
    moodAfter?: BaselineState; // Tilt Tracker
    setupId?: string; // Link to Playbook
    setupQuality?: number; // 1-10 string
    notes: string;
}

export interface Observation {
    id: string;
    date: string;
    title: string;
    content: string;
    state: string;
}

export interface Session {
    date: string;
    emotionalBaseline: BaselineState;
    rulesLocked: boolean;
    tradesTaken: number;
    tradesAllowed: number;
    stabilityScore: number;
    preSessionComplete: boolean;
    notes: string;
}

export interface Analytics {
    weeklyStability: number[];
    ruleAdherence: number;
    avgTradesPerDay: number;
    behavioralTrend: string;
    consistencyDays: number;
    primaryDeviation: string;
    indisciplineCost: number; // The "Financial Impact" metric
}

// AI Agent Types
export interface PatternInsight {
    id: string;
    pattern: string;
    confidence: number;
    suggestion: string;
    agentSource: 'analyst' | 'coach' | 'risk';
}

export interface CoachMessage {
    id: string;
    message: string;
    tone: 'encouraging' | 'neutral' | 'warning';
    priority: number;
    timestamp: string;
    type?: 'weekly_review' | 'session_start' | 'tilt_alert';
}

export interface RiskAlert {
    alert: string;
    severity: 'info' | 'warning' | 'critical';
    action?: string;
    timestamp: string;
}

export interface MarketEvent {
    id: string;
    date: string; // YYYY-MM-DD
    time?: string; // HH:mm
    title: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    country?: string; // India, US, etc.
    type?: string; // CPI, FOMC, RBI, Expiry
}

// Daily activity log for streaks + heatmap
export interface DailyLog {
    date: string; // YYYY-MM-DD
    tradesLogged: number;
    rulesChecked: string[]; // rule IDs checked off
    mood: string;
    rulesFollowed: number;
    rulesBroken: number;
    pnl?: number; // Total PnL for the day
    hasPrePlan?: boolean; // 25% of grade
    hasPostNote?: boolean; // 25% of grade
    complianceScore?: number; // 0-100 total
    grade?: 'A' | 'B' | 'C' | 'D' | 'F' | 'None'; // Discipline Grade
    events?: string[]; // MarketEvent IDs that happened this day
}

export type ScanType = 'trade_note' | 'pre_plan' | 'weekly_review' | 'rule_list' | 'pnl_table' | 'chart_annotation' | 'whiteboard';

export interface DiaryEntry {
    id: string;
    date: string;
    imagePath: string;
    type: ScanType;
    extractedData: any;
    confidence: number;
    rawText?: string;
    status: 'pending' | 'reviewed' | 'discarded';
}

export interface UserModel {
    primary_style: string;
    primary_market: string;
    session_preference: string;
    avg_trades_per_day: number;
    typical_position_size_pct: number;
    
    // Psychology
    dominant_weakness: string;
    tilt_trigger: string;
    tilt_threshold: number;
    revenge_trade_pattern: boolean;
    fomo_pattern: boolean;
    overconfidence_pattern: boolean;
    
    // Performance
    best_time_window: string;
    worst_time_window: string;
    best_day: string;
    worst_day: string;
    edge_setup: string;
    losing_setup: string;
    news_sensitivity: 'low' | 'medium' | 'high';
    
    // Learning
    responds_to: 'data' | 'encouragement' | 'warnings';
    insight_engagement_rate: number;
    preferred_input: 'voice' | 'text';
    average_note_length: 'short' | 'medium' | 'long';
    
    // Progress
    discipline_trajectory: 'improving' | 'declining' | 'stable';
    streak_sensitivity: 'low' | 'medium' | 'high';
    goal: string;
    confidence_level: number;
    
    model_updated_at: string;
    model_confidence: number;
}