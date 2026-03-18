import { useState } from 'react'
import { useRuleSci } from '../context/RuleSciContext'
import {
    TrendingUp,
    Microscope,
    BarChart3,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
import './Analytics.css'

function MiniBarChart({ data }) {
    const max = Math.max(...data)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return (
        <div className="mini-chart">
            <div className="mini-chart-bars">
                {data.map((val, i) => (
                    <div key={i} className="mini-bar-wrapper">
                        <div
                            className="mini-bar"
                            style={{
                                height: `${(val / max) * 100}%`,
                                background: val >= 80
                                    ? 'var(--muted-teal)'
                                    : val >= 60
                                        ? 'var(--soft-amber)'
                                        : 'var(--status-deviation)',
                                opacity: 0.8 + (val / max) * 0.2,
                            }}
                        />
                        <span className="mini-bar-label">{days[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function AnalyticsPanel({ title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className={`analytics-panel card ${open ? 'expanded' : ''}`}>
            <button
                className="analytics-panel-header"
                onClick={() => setOpen(!open)}
            >
                <h3>{title}</h3>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {open && (
                <div className="analytics-panel-body animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    )
}

export default function Analytics() {
    const { analytics, trades, observations } = useRuleSci()

    const rulesFollowed = trades.filter(t => t.followedRules).length
    const totalTrades = trades.length
    const adherenceRate = totalTrades > 0 ? Math.round((rulesFollowed / totalTrades) * 100) : 0

    // Baseline state distribution
    const baselineCounts = trades.reduce((acc, t) => {
        acc[t.emotion] = (acc[t.emotion] || 0) + 1
        return acc
    }, {})

    return (
        <div className="analytics-page animate-fade-in-up">
            <div className="page-header">
                <div>
                    <h1>Analytics</h1>
                    <p className="text-muted">Behavioral data. Collapsed by default. Expand what requires attention.</p>
                </div>
            </div>

            {/* Primary Metrics */}
            <div className="analytics-metrics stagger-children">
                <div className="metric-card card">
                    <TrendingUp size={20} strokeWidth={1.4} color="var(--muted-teal)" />
                    <div className="metric-info">
                        <span className="metric-value">{analytics.consistencyDays}</span>
                        <span className="metric-label">Consistent Days</span>
                    </div>
                </div>
                <div className="metric-card card">
                    <BarChart3 size={20} strokeWidth={1.4} color="var(--muted-teal)" />
                    <div className="metric-info">
                        <span className="metric-value">{adherenceRate}%</span>
                        <span className="metric-label">Adherence Rate</span>
                    </div>
                </div>
                <div className="metric-card card">
                    <Microscope size={20} strokeWidth={1.4} color="var(--muted-teal)" />
                    <div className="metric-info">
                        <span className="metric-value capitalize">{analytics.behavioralTrend}</span>
                        <span className="metric-label">Behavioral Trend</span>
                    </div>
                </div>
            </div>

            {/* Collapsible Analytics Panels */}
            <div className="analytics-sections stagger-children">
                <AnalyticsPanel title="Weekly Stability Score" defaultOpen={true}>
                    <MiniBarChart data={analytics.weeklyStability} />
                    <div className="analytics-summary">
                        <p>
                            Average stability:{' '}
                            <strong>
                                {Math.round(
                                    analytics.weeklyStability.reduce((a, b) => a + b, 0) /
                                    analytics.weeklyStability.length
                                )}%
                            </strong>{' '}
                            across 7 sessions.{' '}
                            {analytics.weeklyStability[6] > analytics.weeklyStability[0]
                                ? 'Observation: stability increased through the week. Structure held under repeated exposure.'
                                : 'Observation: stability decreased mid-week. Examine environmental or behavioral triggers.'}
                        </p>
                    </div>
                </AnalyticsPanel>

                <AnalyticsPanel title="Baseline State Distribution">
                    <div className="baseline-breakdown">
                        {Object.entries(baselineCounts).map(([state, count]) => (
                            <div key={state} className="baseline-row">
                                <span className="baseline-name capitalize">{state}</span>
                                <div className="baseline-bar-track">
                                    <div
                                        className="baseline-bar-fill"
                                        style={{
                                            width: `${(count / totalTrades) * 100}%`,
                                            background: state === 'neutral' || state === 'controlled'
                                                ? 'var(--muted-teal)'
                                                : state === 'uncertain'
                                                    ? 'var(--mist-gray)'
                                                    : 'var(--soft-amber)',
                                        }}
                                    />
                                </div>
                                <span className="baseline-count">{count}</span>
                            </div>
                        ))}
                    </div>
                    <div className="analytics-summary">
                        <p>
                            Most frequent baseline state during execution:{' '}
                            <strong className="capitalize">
                                {Object.entries(baselineCounts).sort((a, b) => b[1] - a[1])[0]?.[0]}
                            </strong>.{' '}
                            Correlation between baseline state and rule adherence can indicate behavioral triggers.
                        </p>
                    </div>
                </AnalyticsPanel>

                <AnalyticsPanel title="Execution Data">
                    <div className="behavior-stats">
                        <div className="behavior-stat">
                            <span className="behavior-value">{totalTrades}</span>
                            <span className="behavior-label">Total Executions</span>
                        </div>
                        <div className="behavior-stat">
                            <span className="behavior-value">{rulesFollowed}</span>
                            <span className="behavior-label">Rules Adhered</span>
                        </div>
                        <div className="behavior-stat">
                            <span className="behavior-value">{totalTrades - rulesFollowed}</span>
                            <span className="behavior-label">Deviations</span>
                        </div>
                        <div className="behavior-stat">
                            <span className="behavior-value">{observations.length}</span>
                            <span className="behavior-label">Observations</span>
                        </div>
                    </div>
                </AnalyticsPanel>

                <AnalyticsPanel title="Primary Deviation Pattern">
                    <div className="deviation-analysis">
                        <span className="badge badge-caution">{analytics.primaryDeviation}</span>
                        <p className="mt-sm text-muted" style={{ fontSize: '0.875rem', lineHeight: '1.7' }}>
                            This is the most frequently observed behavioral pattern preceding rule deviations.
                            Consider implementing a structural intervention: a pre-execution checklist addressing this specific trigger.
                        </p>
                    </div>
                </AnalyticsPanel>
            </div>
        </div>
    )
}
