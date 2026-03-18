import { useState } from 'react'
import { useRuleSci } from '../context/RuleSciContext'
import {
    Shield,
    Activity,
    CircleDot,
    Lock,
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
} from 'lucide-react'
import './Session.css'

const baselines = [
    { key: 'controlled', label: 'Controlled', color: 'var(--muted-teal)' },
    { key: 'neutral', label: 'Neutral', color: 'var(--mist-gray)' },
    { key: 'elevated', label: 'Elevated', color: 'var(--soft-amber)' },
    { key: 'reactive', label: 'Reactive', color: 'var(--status-deviation)' },
    { key: 'uncertain', label: 'Uncertain', color: 'var(--slate-light)' },
]

function StabilityMeter({ score }) {
    const radius = 54
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference

    return (
        <div className="stability-meter">
            <svg width="128" height="128" viewBox="0 0 128 128">
                <circle
                    cx="64" cy="64" r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="8"
                />
                <circle
                    cx="64" cy="64" r={radius}
                    fill="none"
                    stroke="var(--muted-teal)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 64 64)"
                    className="stability-meter-progress"
                />
            </svg>
            <div className="stability-meter-value">
                <span className="stability-score">{score}</span>
                <span className="stability-label">Stability</span>
            </div>
        </div>
    )
}

export default function Session() {
    const {
        session,
        rules,
        analytics,
        setEmotionalBaseline,
        completePreSession,
    } = useRuleSci()

    const [showBaselinePicker, setShowBaselinePicker] = useState(false)

    const violatedRules = rules.filter(r => r.violated)
    const currentBaseline = baselines.find(b => b.key === session.emotionalBaseline)

    const today = new Date()
    const dateStr = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="session-page animate-fade-in-up">
            {/* Header */}
            <div className="session-header">
                <div>
                    <p className="session-date">{dateStr}</p>
                    <h1>Session Overview</h1>
                </div>
                <div className="session-consistency">
                    <span>{analytics.consistencyDays} days consistent</span>
                </div>
            </div>

            {/* Primary Observation Card */}
            <div className="focus-card card-focus stagger-children">
                <div className="focus-card-main">
                    <StabilityMeter score={session.stabilityScore} />

                    <div className="focus-card-info">
                        {/* Emotional Baseline */}
                        <div className="info-block">
                            <label className="info-label">
                                <CircleDot size={14} strokeWidth={1.6} /> Baseline State
                            </label>
                            <div className="baseline-selector-wrapper">
                                <button
                                    className="baseline-current"
                                    onClick={() => setShowBaselinePicker(!showBaselinePicker)}
                                    id="btn-baseline-picker"
                                    style={{ color: currentBaseline?.color }}
                                >
                                    {currentBaseline?.label}
                                    <ChevronDown size={14} />
                                </button>
                                {showBaselinePicker && (
                                    <div className="baseline-dropdown animate-fade-in">
                                        {baselines.map(bl => (
                                            <button
                                                key={bl.key}
                                                className={`baseline-option ${session.emotionalBaseline === bl.key ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setEmotionalBaseline(bl.key)
                                                    setShowBaselinePicker(false)
                                                }}
                                                style={{ color: bl.color }}
                                            >
                                                {bl.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rules Status */}
                        <div className="info-block">
                            <label className="info-label">
                                <Lock size={14} strokeWidth={1.6} /> Rule Framework
                            </label>
                            <div className="flex items-center gap-sm">
                                {session.rulesLocked ? (
                                    <span className="badge badge-calm">
                                        <Shield size={12} /> Locked
                                    </span>
                                ) : (
                                    <span className="badge badge-caution">
                                        <AlertTriangle size={12} /> Unlocked
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Trades */}
                        <div className="info-block">
                            <label className="info-label">
                                <Activity size={14} strokeWidth={1.6} /> Execution Count
                            </label>
                            <div className="trade-progress">
                                <span className="trade-count">
                                    {session.tradesTaken}
                                    <span className="trade-max"> / {session.tradesAllowed}</span>
                                </span>
                                <div className="trade-bar">
                                    <div
                                        className="trade-bar-fill"
                                        style={{
                                            width: `${(session.tradesTaken / session.tradesAllowed) * 100}%`,
                                            background: session.tradesTaken >= session.tradesAllowed
                                                ? 'var(--status-deviation)'
                                                : 'var(--muted-teal)',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pre-session check */}
                {!session.preSessionComplete && (
                    <div className="pre-session-prompt">
                        <p>Pre-session behavioral check-in required.</p>
                        <button
                            className="btn btn-primary"
                            onClick={completePreSession}
                            id="btn-complete-presession"
                        >
                            <CheckCircle2 size={16} /> Confirm Readiness
                        </button>
                    </div>
                )}
            </div>

            {/* Behavioral Metrics Grid */}
            <div className="stats-grid stagger-children">
                <div className="stat-card card">
                    <span className="stat-label">Rule Adherence</span>
                    <span className="stat-value">{analytics.ruleAdherence}%</span>
                    <span className="stat-sub text-muted">7-day average</span>
                </div>
                <div className="stat-card card">
                    <span className="stat-label">Avg Executions</span>
                    <span className="stat-value">{analytics.avgTradesPerDay}</span>
                    <span className="stat-sub text-muted">Per session</span>
                </div>
                <div className="stat-card card">
                    <span className="stat-label">Behavioral Trend</span>
                    <span className="stat-value capitalize">{analytics.behavioralTrend}</span>
                    <span className="stat-sub text-muted">Week over week</span>
                </div>
                <div className="stat-card card">
                    <span className="stat-label">Primary Deviation</span>
                    <span className="stat-value text-caution" style={{ fontSize: '0.9375rem' }}>{analytics.primaryDeviation}</span>
                    <span className="stat-sub text-muted">Most observed</span>
                </div>
            </div>

            {/* Rule deviations */}
            {violatedRules.length > 0 && (
                <div className="rule-violations card animate-fade-in">
                    <h3 className="flex items-center gap-sm">
                        <AlertTriangle size={18} color="var(--soft-amber)" />
                        Rule Deviations Observed
                    </h3>
                    <div className="violation-list">
                        {violatedRules.map(r => (
                            <div key={r.id} className="violation-item">
                                <span className="badge badge-deviation">{r.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
