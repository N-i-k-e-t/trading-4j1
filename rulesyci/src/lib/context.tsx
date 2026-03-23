'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { Rule, Trade, Observation, Session, Analytics, BaselineState, User, DailyLog, PatternInsight, CoachMessage, RiskAlert, Playbook, MarketEvent, UserModel, DiaryEntry } from '@/types/trading';
import { checkRisks } from '@/lib/agents/riskSentinel';
import { createClient } from '@/utils/supabase/client';

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
    dailyLogs: DailyLog[];
    insights: PatternInsight[];
    coachMessages: CoachMessage[];
    riskAlerts: RiskAlert[];
    playbooks: Playbook[];
    marketEvents: MarketEvent[];
    userModel: UserModel;
    diaryEntries: DiaryEntry[];
    toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
    isCheckingAuth: boolean;
    isCaptureOpen: boolean;
    captureMode: 'initial' | 'note' | 'voice' | 'photo' | 'checklist' | 'none';
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
    | { type: 'HYDRATE_STATE'; payload: AppState }
    | { type: 'ADD_RULE'; payload: Rule }
    | { type: 'REMOVE_RULE'; payload: string }
    | { type: 'TOGGLE_RULE_ACTIVE'; payload: string }
    | { type: 'ADD_RULE_FROM_LIBRARY'; payload: Rule }
    | { type: 'LOG_DAILY'; payload: DailyLog }
    | { type: 'SET_INSIGHTS'; payload: PatternInsight[] }
    | { type: 'SET_COACH_MESSAGES'; payload: CoachMessage[] }
    | { type: 'REMOVE_COACH_MESSAGE'; payload: string }
    | { type: 'ADD_RISK_ALERT'; payload: RiskAlert }
    | { type: 'ADD_PLAYBOOK'; payload: Playbook }
    | { type: 'SET_MARKET_EVENTS'; payload: MarketEvent[] }
    | { type: 'ADD_MARKET_EVENT'; payload: MarketEvent }
    | { type: 'SHOW_TOAST'; payload: { id: string; message: string; type: 'success' | 'error' | 'info' } }
    | { type: 'UPDATE_USER_MODEL'; payload: Partial<UserModel> }
    | { type: 'ADD_DIARY_ENTRY'; payload: DiaryEntry }
    | { type: 'UPDATE_DIARY_ENTRY'; payload: Partial<DiaryEntry> & { id: string } }
    | { type: 'DISMISS_TOAST'; payload: string }
    | { type: 'SET_CHECKING_AUTH'; payload: boolean }
    | { type: 'SET_CAPTURE_OPEN'; payload: boolean }
    | { type: 'SET_CAPTURE_MODE'; payload: 'initial' | 'note' | 'voice' | 'photo' | 'checklist' | 'none' }
    | { type: 'LOCK_RULES' }
    | { type: 'LOGOUT' };

const initialState: AppState = {
    sidebarCollapsed: false,
    labMode: false,
    user: null, // Start as null to prevent auth hydration loops

    session: {
        date: '2026-03-21', // Static placeholder for hydration safety
        emotionalBaseline: 'neutral',
        rulesLocked: false, // Start unlocked so user can prep
        tradesTaken: 0,
        tradesAllowed: 3,
        stabilityScore: 85,
        preSessionComplete: false,
        notes: '',
    },
    rules: [
        { id: '1', text: 'Never risk more than 2% per trade', emoji: '🛡️', category: 'Risk Rules', isActive: true },
        { id: '2', text: 'Always use a stop loss', emoji: '🛑', category: 'Risk Rules', isActive: true },
        { id: '3', text: 'Wait for confirmation candle', emoji: '🕯️', category: 'Entry/Exit Rules', isActive: true },
        { id: '4', text: 'No revenge trading', emoji: '🧠', category: 'Mindset Rules', isActive: true },
        { id: '5', text: 'Max 3 trades per session', emoji: '🔢', category: 'Pre-Session Rules', isActive: true },
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
        indisciplineCost: 14200, // Initial mock for first impression
    },
    dailyLogs: [],
    insights: [],
    coachMessages: [],
    riskAlerts: [],
    playbooks: [
        { id: 'pb1', name: 'NIFTY Opening Range Breakout', description: 'Trading the 15min range break in morning', rules: ['1', '2', '3'], criteria: ['High volume', 'Vix < 25', 'RSI > 60'] }
    ],
    marketEvents: [
        { id: 'ev1', date: '2026-03-18', time: '10:00', title: 'CPI India Data', impact: 'high', country: 'India', type: 'CPI' },
        { id: 'ev2', date: '2026-03-19', time: '14:30', title: 'NIFTY Weekly Expiry', impact: 'high', country: 'India', type: 'Expiry' },
        { id: 'ev3', date: '2026-03-25', time: '12:00', title: 'RBI MPC Meeting', impact: 'critical', country: 'India', type: 'RBI' },
        { id: 'ev4', date: '2026-03-20', time: '14:00', title: 'FOMC Minutes', impact: 'medium', country: 'US', type: 'FOMC' },
    ],
    userModel: {
        primary_style: 'day_trading',
        primary_market: 'NIFTY_options',
        session_preference: 'morning',
        avg_trades_per_day: 3.2,
        typical_position_size_pct: 1.8,
        dominant_weakness: 'moved_sl',
        tilt_trigger: 'consecutive_losses',
        tilt_threshold: 2,
        revenge_trade_pattern: true,
        fomo_pattern: false,
        overconfidence_pattern: true,
        best_time_window: '09:30-10:15',
        worst_time_window: '14:00-15:00',
        best_day: 'wednesday',
        worst_day: 'thursday',
        edge_setup: 'breakout',
        losing_setup: 'reversal',
        news_sensitivity: 'high',
        responds_to: 'data',
        insight_engagement_rate: 0.84,
        preferred_input: 'voice',
        average_note_length: 'short',
        discipline_trajectory: 'improving',
        streak_sensitivity: 'high',
        goal: 'consistency',
        confidence_level: 3.2,
        model_updated_at: '2026-03-21T00:00:00Z',
        model_confidence: 0.82
    },
    diaryEntries: [],
    toasts: [],
    isCheckingAuth: true,
    isCaptureOpen: false,
    captureMode: 'none',
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
            return { 
                ...state, 
                ...action.payload, 
                isCheckingAuth: state.isCheckingAuth, // Preserve the ongoing auth check status
                labMode: false, 
                toasts: [] 
            };

        // New actions
        case 'ADD_RULE':
            return { ...state, rules: [...state.rules, action.payload] };

        case 'REMOVE_RULE':
            return { ...state, rules: state.rules.filter(r => r.id !== action.payload) };

        case 'TOGGLE_RULE_ACTIVE':
            return {
                ...state,
                rules: state.rules.map(r =>
                    r.id === action.payload ? { ...r, isActive: !r.isActive } : r
                ),
            };

        case 'ADD_RULE_FROM_LIBRARY': {
            const exists = state.rules.find(r => r.text === action.payload.text);
            if (exists) return state;
            return { ...state, rules: [...state.rules, action.payload] };
        }

        case 'LOG_DAILY': {
            const existingIdx = state.dailyLogs.findIndex(d => d.date === action.payload.date);
            if (existingIdx >= 0) {
                const updated = [...state.dailyLogs];
                updated[existingIdx] = action.payload;
                return { ...state, dailyLogs: updated };
            }
            return { ...state, dailyLogs: [...state.dailyLogs, action.payload] };
        }

        case 'SET_INSIGHTS':
            return { ...state, insights: action.payload };

        case 'SET_COACH_MESSAGES':
            return { ...state, coachMessages: action.payload };

        case 'REMOVE_COACH_MESSAGE':
            return { ...state, coachMessages: state.coachMessages.filter(m => m.id !== action.payload) };

        case 'ADD_RISK_ALERT':
            return { ...state, riskAlerts: [action.payload, ...state.riskAlerts].slice(0, 10) };

        case 'ADD_PLAYBOOK':
            return { ...state, playbooks: [...state.playbooks, action.payload] };

        case 'SET_MARKET_EVENTS':
            return { ...state, marketEvents: action.payload };

        case 'ADD_MARKET_EVENT':
            return { ...state, marketEvents: [...state.marketEvents, action.payload] };

        case 'SHOW_TOAST':
            return { ...state, toasts: [...state.toasts, action.payload] };

        case 'UPDATE_USER_MODEL':
            return { ...state, userModel: { ...state.userModel, ...action.payload } };

        case 'ADD_DIARY_ENTRY':
            return { ...state, diaryEntries: [action.payload, ...state.diaryEntries] };

        case 'UPDATE_DIARY_ENTRY':
            return { 
                ...state, 
                diaryEntries: state.diaryEntries.map(e => e.id === action.payload.id ? { ...e, ...action.payload } : e)
            };

        case 'DISMISS_TOAST':
            return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
        
        case 'SET_CAPTURE_OPEN':
            return { ...state, isCaptureOpen: action.payload };
        
        case 'SET_CAPTURE_MODE':
            return { ...state, captureMode: action.payload };

        case 'LOCK_RULES':
            return { 
                ...state, 
                session: { ...state.session, rulesLocked: true } 
            };

        case 'SET_CHECKING_AUTH':
            return { ...state, isCheckingAuth: action.payload };
        
        case 'LOGOUT':
            return { ...initialState, isCheckingAuth: false, isCaptureOpen: false, captureMode: 'none' };
        
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
    logout: () => void;
    updateSession: (data: Partial<Session>) => void;
    addTrade: (trade: Trade) => void;
    toggleRuleViolation: (id: string) => void;
    addObservation: (obs: Observation) => void;
    setEmotionalBaseline: (em: BaselineState) => void;
    completePreSession: () => void;
    addRule: (rule: Rule) => void;
    removeRule: (id: string) => void;
    toggleRuleActive: (id: string) => void;
    addRuleFromLibrary: (rule: Rule) => void;
    logDaily: (log: DailyLog) => void;
    setInsights: (insights: PatternInsight[]) => void;
    setCoachMessages: (msgs: CoachMessage[]) => void;
    removeCoachMessage: (id: string) => void;
    addRiskAlert: (alert: RiskAlert) => void;
    addPlaybook: (pb: Playbook) => void;
    setMarketEvents: (events: MarketEvent[]) => void;
    addMarketEvent: (event: MarketEvent) => void;
    updateUserModel: (model: Partial<UserModel>) => void;
    addDiaryEntry: (entry: DiaryEntry) => void;
    updateDiaryEntry: (entry: Partial<DiaryEntry> & { id: string }) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    dismissToast: (id: string) => void;
    isCheckingAuth: boolean;
    setCaptureOpen: (open: boolean) => void;
    setCaptureMode: (mode: 'initial' | 'note' | 'voice' | 'photo' | 'checklist' | 'none') => void;
    lockRules: () => void;
}

const RuleSciContext = createContext<RuleSciContextType | null>(null);

export function RuleSciProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(ruleSciReducer, initialState);

    const supabase = createClient();

    const isPlaceholderAuth = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-id') || !process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Sync with Supabase Auth (PWA Persistent)
    useEffect(() => {
        let isMounted = true;

        const syncUser = async () => {
            // 1. OPTIMISTIC: Check localStorage for instant-on
            const savedData = localStorage.getItem('rulesci_data');
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    if (parsed.version === SYSTEM_VERSION) {
                        if (parsed.user) {
                            dispatch({ type: 'SET_USER', payload: parsed.user });
                        }
                        dispatch({ type: 'HYDRATE_STATE', payload: { ...initialState, ...parsed } });
                    }
                } catch (e) {}
            }

            // 2. REAL AUTH: Check Supabase in background
            if (!isPlaceholderAuth) {
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user && isMounted) {
                        const email = session.user.email || '';
                        const isPro = ALLOWED_PRO_EMAILS.includes(email.toLowerCase());
                        dispatch({ 
                            type: 'SET_USER', 
                            payload: { 
                                email, 
                                name: session.user.user_metadata?.full_name || 'Trader',
                                isPro,
                                isAdmin: isPro && email === 'niketpatil1624@gmail.com'
                            } 
                        });
                    }
                } catch (e) {
                    console.error('Auth check failed', e);
                }
            }

            // Always release the loading lock
            if (isMounted) {
                dispatch({ type: 'SET_CHECKING_AUTH', payload: false });
            }
        };

        syncUser();

        // Safety Valve: Force unlock after 2 seconds to prevent infinite spinners
        const safetyValve = setTimeout(() => {
            if (isMounted) dispatch({ type: 'SET_CHECKING_AUTH', payload: false });
        }, 2000);

        let subscription: any = null;
        if (!isPlaceholderAuth) {
            const res = supabase.auth.onAuthStateChange((event, session) => {
                if (session?.user) {
                    dispatch({ 
                        type: 'SET_USER', 
                        payload: { 
                            email: session.user.email!, 
                            name: session.user.user_metadata?.full_name || 'Trader',
                            isPro: ALLOWED_PRO_EMAILS.includes(session.user.email!),
                            isAdmin: session.user.email === 'niketpatil1624@gmail.com'
                        } 
                    });
                }
 else if (!isPlaceholderAuth && isMounted) {
                    dispatch({ type: 'SET_USER', payload: null });
                }
                if (isMounted) dispatch({ type: 'SET_CHECKING_AUTH', payload: false });
            });
            subscription = res.data.subscription;
        }

        return () => {
            isMounted = false;
            if (subscription) subscription.unsubscribe();
            clearTimeout(safetyValve);
        };
    }, [isPlaceholderAuth, supabase]);

    const SYSTEM_VERSION = '1.1.0'; // Updated for Calendar Architecture

    // Persist to LocalStorage (Excluding transient auth states)
    useEffect(() => {
        if (state !== initialState) {
            const { toasts, isCheckingAuth, ...persistable } = state; 
            localStorage.setItem('rulesci_data', JSON.stringify({
                ...persistable,
                version: SYSTEM_VERSION
            }));
        }
    }, [state]);

    // Financial Impact Calculator (Cost of Indiscipline)
    useEffect(() => {
        if (state.trades.length > 0) {
            const cost = state.trades.reduce((acc, trade) => {
                // If any rules broken, add the loss (if pnl is negative) or absolute value if it's a "bad" win
                // For now, let's sum negative P&L on broken rule trades
                if (trade.rules_broken.length > 0 && trade.pnl && trade.pnl < 0) {
                    return acc + Math.abs(trade.pnl);
                }
                return acc;
            }, 0);

            if (cost !== state.analytics.indisciplineCost) {
                dispatch({ 
                    type: 'UPDATE_USER_MODEL', 
                    payload: { confidence_level: Math.max(0, 100 - (cost / 1000)) } as any // Secondary effect
                });
                // Note: We don't have a direct UPDATE_ANALYTICS yet, we'll patch it via UPDATE_USER_MODEL or similar for now or just let it be computed
                // Actually, let's just use it as a computed value in the UI or add a proper action.
            }
        }
    }, [state.trades]);

    const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
    const toggleLabMode = useCallback(() => dispatch({ type: 'TOGGLE_LAB_MODE' }), []);
    const setLabMode = useCallback((val: boolean) => dispatch({ type: 'SET_LAB_MODE', payload: val }), []);
    const setUser = useCallback((user: User | null) => dispatch({ type: 'SET_USER', payload: user }), []);

    const login = useCallback(async (email: string, name: string = 'Trader') => {
        // This is now reactive via onAuthStateChange
        // But we can keep it as a placeholder for manual overrides if needed
        console.log('Login initiated for', email);
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('rulesci_data');
        dispatch({ type: 'LOGOUT' });
    }, [supabase]);

    const updateSession = useCallback((data: Partial<Session>) => dispatch({ type: 'UPDATE_SESSION', payload: data }), []);
    
    const addTrade = useCallback((trade: Trade) => {
        dispatch({ type: 'ADD_TRADE', payload: trade });
        
        // After trade is added, run Risk Sentinel
        // We use state.trades + new trade
        const newTrades = [trade, ...state.trades];
        const activeRules = state.rules.filter(r => r.isActive);
        const alerts = checkRisks(newTrades, activeRules, state.session.emotionalBaseline);
        
        // Update alerts in state
        alerts.forEach(alert => {
            dispatch({ type: 'ADD_RISK_ALERT', payload: alert });
        });
    }, [state.trades, state.rules, state.session.emotionalBaseline]);

    const toggleRuleViolation = useCallback((id: string) => dispatch({ type: 'TOGGLE_RULE_VIOLATION', payload: id }), []);
    const addObservation = useCallback((obs: Observation) => dispatch({ type: 'ADD_OBSERVATION', payload: obs }), []);
    const setEmotionalBaseline = useCallback((em: BaselineState) => dispatch({ type: 'SET_EMOTIONAL_BASELINE', payload: em }), []);
    const completePreSession = useCallback(() => dispatch({ type: 'COMPLETE_PRE_SESSION' }), []);

    // New action dispatchers
    const addRule = useCallback((rule: Rule) => dispatch({ type: 'ADD_RULE', payload: rule }), []);
    const removeRule = useCallback((id: string) => dispatch({ type: 'REMOVE_RULE', payload: id }), []);
    const toggleRuleActive = useCallback((id: string) => dispatch({ type: 'TOGGLE_RULE_ACTIVE', payload: id }), []);
    const addRuleFromLibrary = useCallback((rule: Rule) => dispatch({ type: 'ADD_RULE_FROM_LIBRARY', payload: rule }), []);
    const logDaily = useCallback((log: DailyLog) => dispatch({ type: 'LOG_DAILY', payload: log }), []);
    const setInsights = useCallback((insights: PatternInsight[]) => dispatch({ type: 'SET_INSIGHTS', payload: insights }), []);
    const setCoachMessages = useCallback((msgs: CoachMessage[]) => dispatch({ type: 'SET_COACH_MESSAGES', payload: msgs }), []);
    const removeCoachMessage = useCallback((id: string) => dispatch({ type: 'REMOVE_COACH_MESSAGE', payload: id }), []);
    const addRiskAlert = useCallback((alert: RiskAlert) => dispatch({ type: 'ADD_RISK_ALERT', payload: alert }), []);
    const addPlaybook = useCallback((pb: Playbook) => dispatch({ type: 'ADD_PLAYBOOK', payload: pb }), []);
    const setMarketEvents = useCallback((events: MarketEvent[]) => dispatch({ type: 'SET_MARKET_EVENTS', payload: events }), []);
    const addMarketEvent = useCallback((event: MarketEvent) => dispatch({ type: 'ADD_MARKET_EVENT', payload: event }), []);
    const updateUserModel = useCallback((model: Partial<UserModel>) => dispatch({ type: 'UPDATE_USER_MODEL', payload: model }), []);
    const addDiaryEntry = useCallback((entry: DiaryEntry) => dispatch({ type: 'ADD_DIARY_ENTRY', payload: entry }), []);
    const updateDiaryEntry = useCallback((entry: Partial<DiaryEntry> & { id: string }) => dispatch({ type: 'UPDATE_DIARY_ENTRY', payload: entry }), []);
    const setCaptureOpen = useCallback((open: boolean) => dispatch({ type: 'SET_CAPTURE_OPEN', payload: open }), []);
    const setCaptureMode = useCallback((mode: 'initial' | 'note' | 'voice' | 'photo' | 'checklist' | 'none') => dispatch({ type: 'SET_CAPTURE_MODE', payload: mode }), []);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = `toast_${Date.now()}`;
        dispatch({ type: 'SHOW_TOAST', payload: { id, message, type } });
        setTimeout(() => dispatch({ type: 'DISMISS_TOAST', payload: id }), 3000);
    }, []);

    const dismissToast = useCallback((id: string) => dispatch({ type: 'DISMISS_TOAST', payload: id }), []);

    const value = {
        ...state,
        toggleSidebar,
        toggleLabMode,
        setLabMode,
        setUser,
        login,
        logout,
        updateSession,
        addTrade,
        toggleRuleViolation,
        addObservation,
        setEmotionalBaseline,
        completePreSession,
        addRule,
        removeRule,
        toggleRuleActive,
        addRuleFromLibrary,
        logDaily,
        setInsights,
        setCoachMessages,
        removeCoachMessage,
        addRiskAlert,
        addPlaybook,
        setMarketEvents,
        addMarketEvent,
        updateUserModel,
        addDiaryEntry,
        updateDiaryEntry,
        showToast,
        dismissToast,
        setCaptureOpen,
        setCaptureMode,
        lockRules: () => dispatch({ type: 'LOCK_RULES' }),
    };

    return <RuleSciContext.Provider value={value}>{children}</RuleSciContext.Provider>;
}

export function useRuleSci() {
    const ctx = useContext(RuleSciContext);
    if (!ctx) throw new Error('useRuleSci must be used within RuleSciProvider');
    return ctx;
}
