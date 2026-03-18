import { useState, useEffect } from 'react'
import { useRuleSci } from '../context/RuleSciContext'
import {
    X,
    FlaskConical,
    Clock,
} from 'lucide-react'
import './LabMode.css'

export default function LabMode() {
    const { setLabMode, session } = useRuleSci()
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed(prev => prev + 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }

    const principles = [
        "Behavior stabilizes when observed without judgment.",
        "Structure precedes performance. Build the frame first.",
        "Impulse is data, not direction.",
        "The best execution is the one that follows process.",
        "If behavior is consistent, outcomes become predictable.",
    ]

    const principle = principles[Math.floor(Date.now() / 60000) % principles.length]

    const baselineLabels = {
        controlled: 'Controlled',
        neutral: 'Neutral',
        elevated: 'Elevated',
        reactive: 'Reactive',
        uncertain: 'Uncertain',
    }

    return (
        <div className="lab-mode-overlay">
            {/* Exit */}
            <button
                className="lab-exit-btn"
                onClick={() => setLabMode(false)}
                id="btn-exit-lab"
            >
                <X size={20} />
            </button>

            <div className="lab-content animate-fade-in-scale">
                {/* Icon */}
                <div className="lab-icon">
                    <FlaskConical size={40} strokeWidth={1.2} />
                </div>

                {/* Timer */}
                <div className="lab-timer">
                    <Clock size={16} strokeWidth={1.6} />
                    <span>{formatTime(elapsed)}</span>
                </div>

                {/* Current state */}
                <div className="lab-state">
                    <h2>Observation Mode</h2>
                    <p className="lab-baseline">
                        Baseline: <span className="capitalize">{baselineLabels[session.emotionalBaseline] || session.emotionalBaseline}</span>
                    </p>
                    <p className="lab-executions">
                        {session.tradesTaken} of {session.tradesAllowed} executions recorded
                    </p>
                </div>

                {/* Principle */}
                <div className="lab-principle">
                    <p>{principle}</p>
                </div>

                {/* Rhythm indicator */}
                <div className="lab-rhythm">
                    <div className="rhythm-dot" />
                    <span className="rhythm-label">Observe</span>
                </div>
            </div>
        </div>
    )
}
