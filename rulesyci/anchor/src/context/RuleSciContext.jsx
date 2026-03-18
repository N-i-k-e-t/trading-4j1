import { createContext, useContext, useReducer, useCallback } from 'react'

const RuleSciContext = createContext(null)

const initialState = {
    // Sidebar
    sidebarCollapsed: false,

    // Lab Mode (formerly Focus Mode)
    labMode: false,

    // Today's Session
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

    // Behavioral Rules
    rules: [
        { id: 1, text: 'No entries before 9:30 AM', locked: true, violated: false },
        { id: 2, text: 'Maximum 3 trades per session', locked: true, violated: false },
        { id: 3, text: 'Halt after 2 consecutive losses', locked: true, violated: false },
        { id: 4, text: 'No position after impulse trigger', locked: true, violated: false },
        { id: 5, text: 'Execute the setup, not the feeling', locked: true, violated: false },
    ],

    // Trade Log — Behavioral Observations
    trades: [
        {
            id: 1,
            date: '2026-02-17',
            pair: 'EUR/USD',
            type: 'Long',
            entry: '1.0845',
            exit: '1.0872',
            followedRules: true,
            emotion: 'neutral',
            notes: 'Setup confirmed. Entry waited for structure. No deviation observed.',
        },
        {
            id: 2,
            date: '2026-02-17',
            pair: 'GBP/USD',
            type: 'Short',
            entry: '1.2601',
            exit: '1.2585',
            followedRules: true,
            emotion: 'neutral',
            notes: 'Slight hesitation on entry. Held structure. Observation: hesitation pattern recurring.',
        },
        {
            id: 3,
            date: '2026-02-16',
            pair: 'USD/JPY',
            type: 'Long',
            entry: '150.42',
            exit: '150.28',
            followedRules: false,
            emotion: 'reactive',
            notes: 'Entry without confirmation. Trigger: quantity increased after first profitable trade.',
        },
    ],

    // Observations (formerly Reflections)
    observations: [
        {
            id: 1,
            date: '2026-02-17',
            title: 'Structure held under pressure',
            content: 'Observed: waited for setup confirmation instead of reacting to price movement. Outcome correlated with patience. Difference from last week: reduced noise reactivity. Pattern: when entry is structural, execution quality improves.',
            state: 'controlled',
        },
        {
            id: 2,
            date: '2026-02-16',
            title: 'Overtrading pattern identified',
            content: 'Observation: trade quantity increased after consecutive wins. Hypothesis: confidence creates impulse trigger. Proposed adjustment: after 2 consecutive wins, enforce 30-minute observation period before next entry.',
            state: 'analytical',
        },
    ],

    // Behavioral Analytics
    analytics: {
        weeklyStability: [72, 85, 68, 91, 88, 79, 85],
        ruleAdherence: 82,
        avgTradesPerDay: 2.3,
        behavioralTrend: 'stabilizing',
        consistencyDays: 4,
        primaryDeviation: 'Impulse entry after win',
    },
}

function ruleSciReducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_SIDEBAR':
            return { ...state, sidebarCollapsed: !state.sidebarCollapsed }

        case 'TOGGLE_LAB_MODE':
            return { ...state, labMode: !state.labMode }

        case 'SET_LAB_MODE':
            return { ...state, labMode: action.payload }

        case 'UPDATE_SESSION':
            return { ...state, session: { ...state.session, ...action.payload } }

        case 'ADD_TRADE':
            return {
                ...state,
                trades: [action.payload, ...state.trades],
                session: {
                    ...state.session,
                    tradesTaken: state.session.tradesTaken + 1,
                },
            }

        case 'TOGGLE_RULE_VIOLATION':
            return {
                ...state,
                rules: state.rules.map(r =>
                    r.id === action.payload ? { ...r, violated: !r.violated } : r
                ),
            }

        case 'ADD_OBSERVATION':
            return {
                ...state,
                observations: [action.payload, ...state.observations],
            }

        case 'SET_EMOTIONAL_BASELINE':
            return {
                ...state,
                session: { ...state.session, emotionalBaseline: action.payload },
            }

        case 'COMPLETE_PRE_SESSION':
            return {
                ...state,
                session: { ...state.session, preSessionComplete: true },
            }

        default:
            return state
    }
}

export function RuleSciProvider({ children }) {
    const [state, dispatch] = useReducer(ruleSciReducer, initialState)

    const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), [])
    const toggleLabMode = useCallback(() => dispatch({ type: 'TOGGLE_LAB_MODE' }), [])
    const setLabMode = useCallback((val) => dispatch({ type: 'SET_LAB_MODE', payload: val }), [])
    const updateSession = useCallback((data) => dispatch({ type: 'UPDATE_SESSION', payload: data }), [])
    const addTrade = useCallback((trade) => dispatch({ type: 'ADD_TRADE', payload: trade }), [])
    const toggleRuleViolation = useCallback((id) => dispatch({ type: 'TOGGLE_RULE_VIOLATION', payload: id }), [])
    const addObservation = useCallback((obs) => dispatch({ type: 'ADD_OBSERVATION', payload: obs }), [])
    const setEmotionalBaseline = useCallback((em) => dispatch({ type: 'SET_EMOTIONAL_BASELINE', payload: em }), [])
    const completePreSession = useCallback(() => dispatch({ type: 'COMPLETE_PRE_SESSION' }), [])

    const value = {
        ...state,
        toggleSidebar,
        toggleLabMode,
        setLabMode,
        updateSession,
        addTrade,
        toggleRuleViolation,
        addObservation,
        setEmotionalBaseline,
        completePreSession,
    }

    return (
        <RuleSciContext.Provider value={value}>
            {children}
        </RuleSciContext.Provider>
    )
}

export function useRuleSci() {
    const ctx = useContext(RuleSciContext)
    if (!ctx) throw new Error('useRuleSci must be used within RuleSciProvider')
    return ctx
}
