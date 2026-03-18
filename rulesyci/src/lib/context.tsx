'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { Rule, Trade, Observation, Session, Analytics, BaselineState, User } from '@/types/trading';

const ALLOWED_PRO_EMAILS = ['niketpatil1624@gmail.com', 'adityaparerao8@gmail.com'];

interface AppState {
    sidebarCollapsed: boolean;
    labMode: boolean;
    user: User | null;
    session: Session;
    rules: Rule[];
    trades: Trade[];
    observations: Observation[];
    analytics: Analytics;
}

type Action =
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'TOGGLE_LAB_MODE' }
    | { type: 'SET_LAB_MODE'; payload: boolean }
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'UPDATE_SESSION'; payload: Partial<Session> }
    | { type: 'ADD_TRADE'; payload: Trade }
    | { type: 'TOGGLE_RULE_VIOLATION'; payload: string }
    | { type: 'ADD_OBSERVATION'; payload: Observation }
    | { type: 'SET_EMOTIONAL_BASELINE'; payload: BaselineState }
    | { type: 'COMPLETE_PRE_SESSION' }
    | { type: 'HYDRATE_STATE'; payload: AppState };

const initialState: AppState = {
    sidebarCollapsed: false,
    labMode: false,
    user: null,
    session: {
        date: new Date().toISOString().split('T')[0],
        emotionalBaseline: 'neutral',
        rulesLocked: true,
        tradesTaken: 0,
        tradesAllowed: 3,
        stabilityScore: 85,
        preSessionComplete: false,
        notes: '',
    },
    rules: [
        { id: '1', text: 'Never risk more than 2% per trade', emoji: '🛡️', category: 'Risk Management', isActive: true },
        { id: '2', text: 'Always use a stop loss', emoji: '🛑', category: 'Risk Management', isActive: true },
        { id: '3', text: 'Wait for confirmation candle', emoji: '🕯️', category: 'Entry', isActive: true },
        { id: '4', text: 'No revenge trading', emoji: '🧠', category: 'Mindset', isActive: true },
        { id: '5', text: 'Max 3 trades per session', emoji: '🔢', category: 'Session', isActive: true },
    ],
    trades: [],
    observations: [],
    analytics: {
        weeklyStability: [72, 85, 68, 91, 88, 79, 85],
        ruleAdherence: 82,
        avgTradesPerDay: 2.3,
        behavioralTrend: 'stabilizing',
        consistencyDays: 4,
        primaryDeviation: 'Impulse entry after win',
    },
};

function ruleSciReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'TOGGLE_SIDEBAR':
            return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
        case 'TOGGLE_LAB_MODE':
            return { ...state, labMode: !state.labMode };
        case 'SET_LAB_MODE':
            return { ...state, labMode: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'UPDATE_SESSION':
            return { ...state, session: { ...state.session, ...action.payload } };
        case 'ADD_TRADE':
            return {
                ...state,
                trades: [action.payload, ...state.trades],
                session: {
                    ...state.session,
                    tradesTaken: state.session.tradesTaken + 1,
                },
            };
        case 'TOGGLE_RULE_VIOLATION':
            return {
                ...state,
                rules: state.rules.map((r) =>
                    r.id === action.payload ? { ...r, violated: !r.violated } : r
                ),
            };
        case 'ADD_OBSERVATION':
            return {
                ...state,
                observations: [action.payload, ...state.observations],
            };
        case 'SET_EMOTIONAL_BASELINE':
            return {
                ...state,
                session: { ...state.session, emotionalBaseline: action.payload },
            };
        case 'COMPLETE_PRE_SESSION':
            return {
                ...state,
                session: { ...state.session, preSessionComplete: true },
            };
        case 'HYDRATE_STATE':
            return { ...action.payload, labMode: false }; // Keep lab mode false on reload
        default:
            return state;
    }
}

interface RuleSciContextType extends AppState {
    toggleSidebar: () => void;
    toggleLabMode: () => void;
    setLabMode: (val: boolean) => void;
    setUser: (user: User | null) => void;
    login: (email: string, name?: string) => void;
    updateSession: (data: Partial<Session>) => void;
    addTrade: (trade: Trade) => void;
    toggleRuleViolation: (id: string) => void;
    addObservation: (obs: Observation) => void;
    setEmotionalBaseline: (em: BaselineState) => void;
    completePreSession: () => void;
}

const RuleSciContext = createContext<RuleSciContextType | null>(null);

export function RuleSciProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(ruleSciReducer, initialState);

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('rulesci_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed) dispatch({ type: 'HYDRATE_STATE', payload: parsed });
            } catch (e) {
                console.error('Failed to parse local data', e);
            }
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        if (state !== initialState) {
            localStorage.setItem('rulesci_data', JSON.stringify(state));
        }
    }, [state]);

    const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
    const toggleLabMode = useCallback(() => dispatch({ type: 'TOGGLE_LAB_MODE' }), []);
    const setLabMode = useCallback((val: boolean) => dispatch({ type: 'SET_LAB_MODE', payload: val }), []);
    const setUser = useCallback((user: User | null) => dispatch({ type: 'SET_USER', payload: user }), []);

    const login = useCallback((email: string, name: string = 'Trader') => {
        const isPro = ALLOWED_PRO_EMAILS.includes(email.toLowerCase());
        
        // Handle trial period
        const saved = localStorage.getItem('rulesci_data');
        let parsed = null;
        if (saved) {
            try { parsed = JSON.parse(saved); } catch(e){}
        }
        
        let trialStartDate = parsed?.user?.trialStartDate;
        if (!trialStartDate && !isPro) {
            trialStartDate = new Date().toISOString();
        }

        dispatch({
            type: 'SET_USER',
            payload: { email, name, isPro, trialStartDate }
        });
    }, []);

    const updateSession = useCallback((data: Partial<Session>) => dispatch({ type: 'UPDATE_SESSION', payload: data }), []);
    const addTrade = useCallback((trade: Trade) => dispatch({ type: 'ADD_TRADE', payload: trade }), []);
    const toggleRuleViolation = useCallback((id: string) => dispatch({ type: 'TOGGLE_RULE_VIOLATION', payload: id }), []);
    const addObservation = useCallback((obs: Observation) => dispatch({ type: 'ADD_OBSERVATION', payload: obs }), []);
    const setEmotionalBaseline = useCallback((em: BaselineState) => dispatch({ type: 'SET_EMOTIONAL_BASELINE', payload: em }), []);
    const completePreSession = useCallback(() => dispatch({ type: 'COMPLETE_PRE_SESSION' }), []);

    const value = {
        ...state,
        toggleSidebar,
        toggleLabMode,
        setLabMode,
        setUser,
        login,
        updateSession,
        addTrade,
        toggleRuleViolation,
        addObservation,
        setEmotionalBaseline,
        completePreSession,
    };

    return <RuleSciContext.Provider value={value}>{children}</RuleSciContext.Provider>;
}

export function useRuleSci() {
    const ctx = useContext(RuleSciContext);
    if (!ctx) throw new Error('useRuleSci must be used within RuleSciProvider');
    return ctx;
}
