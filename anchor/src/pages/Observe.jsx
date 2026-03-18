import { useState } from 'react'
import { useRuleSci } from '../context/RuleSciContext'
import {
    PenLine,
    X,
    Plus,
    Calendar,
    Microscope,
} from 'lucide-react'
import './Observe.css'

const states = [
    { key: 'controlled', label: 'Controlled' },
    { key: 'analytical', label: 'Analytical' },
    { key: 'reactive', label: 'Reactive' },
    { key: 'uncertain', label: 'Uncertain' },
    { key: 'aware', label: 'Aware' },
    { key: 'structured', label: 'Structured' },
]

export default function Observe() {
    const { observations, addObservation, setLabMode } = useRuleSci()
    const [writing, setWriting] = useState(false)
    const [form, setForm] = useState({
        title: '',
        content: '',
        state: 'analytical',
    })

    const handleSubmit = () => {
        if (!form.content.trim()) return

        addObservation({
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            ...form,
        })

        setForm({ title: '', content: '', state: 'analytical' })
        setWriting(false)
    }

    const startWriting = () => {
        setWriting(true)
    }

    const cancelWriting = () => {
        setWriting(false)
        setForm({ title: '', content: '', state: 'analytical' })
    }

    // Full-screen observation mode
    if (writing) {
        return (
            <div className="observe-fullscreen animate-fade-in">
                <div className="observe-fullscreen-header">
                    <div className="observe-fullscreen-meta">
                        <select
                            className="state-selector"
                            value={form.state}
                            onChange={e => setForm({ ...form, state: e.target.value })}
                            id="select-observe-state"
                        >
                            {states.map(s => (
                                <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="observe-fullscreen-actions">
                        <button className="btn btn-ghost" onClick={cancelWriting} id="btn-cancel-observe">
                            <X size={16} /> Discard
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit} id="btn-save-observe">
                            <PenLine size={16} /> Save Observation
                        </button>
                    </div>
                </div>

                <div className="observe-editor">
                    <input
                        className="observe-title-input"
                        type="text"
                        placeholder="Observation title..."
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        id="input-observe-title"
                        autoFocus
                    />
                    <textarea
                        className="observe-content-input"
                        placeholder="Record your behavioral observation. What patterns occurred? What triggered them? What was the behavioral state before, during, and after?"
                        value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })}
                        id="input-observe-content"
                    />
                </div>

                <div className="observe-word-count">
                    {form.content.split(/\s+/).filter(Boolean).length} words
                </div>
            </div>
        )
    }

    return (
        <div className="observe-page animate-fade-in-up">
            <div className="page-header">
                <div>
                    <h1>Observe</h1>
                    <p className="text-muted">Structured behavioral observation. No judgment. Only data.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={startWriting}
                    id="btn-new-observation"
                >
                    <Plus size={16} /> New Observation
                </button>
            </div>

            {/* Observation Prompt */}
            <div className="observe-prompt card-focus">
                <Microscope size={24} strokeWidth={1.4} color="var(--muted-teal)" />
                <div>
                    <h3>Today's Inquiry</h3>
                    <p>"What behavioral pattern am I repeating? Is it structural or reactive?"</p>
                </div>
            </div>

            {/* Past Observations */}
            <div className="observations-list stagger-children">
                {observations.map(obs => (
                    <div key={obs.id} className="observation-card card">
                        <div className="observation-header">
                            <div className="observation-date">
                                <Calendar size={14} strokeWidth={1.6} />
                                {formatDate(obs.date)}
                            </div>
                            <span className="badge badge-neutral">{obs.state}</span>
                        </div>
                        <h3 className="observation-title">{obs.title}</h3>
                        <p className="observation-content">{obs.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}
