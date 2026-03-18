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

export interface Trade {
    id: string;
    date: string;
    pair: string;
    type: 'Long' | 'Short';
    entry: string;
    exit: string;
    rules_followed: string[]; // Rule IDs followed
    rules_broken: string[]; // Rule IDs broken
    emotion: BaselineState;
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
