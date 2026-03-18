export type BaselineState = 'very_bad' | 'bad' | 'neutral' | 'good' | 'great';

export interface User {
    email: string;
    name: string;
    isPro: boolean;
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
    message: string;
    tone: 'encouraging' | 'neutral' | 'warning';
    priority: number;
}

export interface RiskAlert {
    alert: string;
    severity: 'info' | 'warning' | 'critical';
    action?: string;
    timestamp: string;
}

// Daily activity log for streaks + heatmap
export interface DailyLog {
    date: string; // YYYY-MM-DD
    tradesLogged: number;
    rulesChecked: string[]; // rule IDs checked off
    mood: string;
    rulesFollowed: number;
    rulesBroken: number;
}
