import { useRuleSci } from '../context/RuleSciContext'
import {
    Lock,
    Shield,
    AlertTriangle,
    CheckCircle2,
} from 'lucide-react'
import './Rules.css'

export default function Rules() {
    const { rules, toggleRuleViolation, session } = useRuleSci()

    const active = rules.filter(r => r.locked && !r.violated).length
    const deviated = rules.filter(r => r.violated).length
    const adherence = Math.round(((rules.length - deviated) / rules.length) * 100)

    return (
        <div className="rules-page animate-fade-in-up">
            <div className="page-header">
                <div>
                    <h1>Rule Framework</h1>
                    <p className="text-muted">Your behavioral structure. Deviations are observed, not judged.</p>
                </div>
            </div>

            {/* Rule Status Summary */}
            <div className="rules-summary stagger-children">
                <div className="summary-card card">
                    <Shield size={24} strokeWidth={1.4} color="var(--muted-teal)" />
                    <div>
                        <span className="summary-value">{active}</span>
                        <span className="summary-label">Active Rules</span>
                    </div>
                </div>
                <div className="summary-card card">
                    <AlertTriangle size={24} strokeWidth={1.4} color="var(--soft-amber)" />
                    <div>
                        <span className="summary-value">{deviated}</span>
                        <span className="summary-label">Deviations</span>
                    </div>
                </div>
                <div className="summary-card card">
                    <Lock size={24} strokeWidth={1.4} color="var(--mist-gray)" />
                    <div>
                        <span className="summary-value">{adherence}%</span>
                        <span className="summary-label">Adherence</span>
                    </div>
                </div>
            </div>

            {/* Rules locked notice */}
            {session.rulesLocked && (
                <div className="rules-locked-banner">
                    <Lock size={16} strokeWidth={1.6} />
                    <span>Rule framework is locked for the current session. Deviations are recorded for analysis.</span>
                </div>
            )}

            {/* Rule Cards */}
            <div className="rules-list stagger-children">
                {rules.map((rule, index) => (
                    <div
                        key={rule.id}
                        className={`rule-card card ${rule.violated ? 'violated' : ''}`}
                    >
                        <div className="rule-number">{String(index + 1).padStart(2, '0')}</div>
                        <div className="rule-content">
                            <p className="rule-text">{rule.text}</p>
                            <div className="rule-status">
                                {rule.violated ? (
                                    <span className="badge badge-deviation">
                                        <AlertTriangle size={12} /> Deviated
                                    </span>
                                ) : (
                                    <span className="badge badge-calm">
                                        <CheckCircle2 size={12} /> Held
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            className={`rule-toggle-btn ${rule.violated ? 'is-violated' : ''}`}
                            onClick={() => toggleRuleViolation(rule.id)}
                            title={rule.violated ? 'Mark as held' : 'Mark as deviated'}
                            id={`btn-rule-toggle-${rule.id}`}
                        >
                            {rule.violated ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <AlertTriangle size={18} />
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Structural principle */}
            <div className="rules-philosophy">
                <p>
                    Structure is not restriction.
                    It is the framework within which controlled performance becomes possible.
                    When behavior is consistent, outcomes stabilize.
                </p>
            </div>
        </div>
    )
}
