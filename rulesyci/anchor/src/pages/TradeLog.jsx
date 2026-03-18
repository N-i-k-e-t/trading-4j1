import { useState } from 'react'
import { useRuleSci } from '../context/RuleSciContext'
import {
    Plus,
    X,
    CheckCircle2,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react'
import './TradeLog.css'

const baselineOptions = ['controlled', 'neutral', 'elevated', 'reactive', 'uncertain']

export default function TradeLog() {
    const { trades, addTrade, session } = useRuleSci()
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        pair: '',
        type: 'Long',
        entry: '',
        exit: '',
        followedRules: true,
        emotion: 'neutral',
        notes: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.pair || !form.entry) return

        addTrade({
            id: Date.now(),
            date: session.date,
            ...form,
        })

        setForm({
            pair: '',
            type: 'Long',
            entry: '',
            exit: '',
            followedRules: true,
            emotion: 'neutral',
            notes: '',
        })
        setShowForm(false)
    }

    // Group trades by date
    const grouped = trades.reduce((acc, trade) => {
        if (!acc[trade.date]) acc[trade.date] = []
        acc[trade.date].push(trade)
        return acc
    }, {})

    return (
        <div className="tradelog-page animate-fade-in-up">
            <div className="page-header">
                <div>
                    <h1>Trade Log</h1>
                    <p className="text-muted">Behavioral observation record.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    id="btn-new-trade"
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? 'Cancel' : 'Log Execution'}
                </button>
            </div>

            {/* New Trade Form */}
            {showForm && (
                <form className="trade-form card-elevated animate-fade-in-up" onSubmit={handleSubmit}>
                    <h3>Record Execution</h3>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Instrument</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="e.g. EUR/USD"
                                value={form.pair}
                                onChange={e => setForm({ ...form, pair: e.target.value })}
                                id="input-trade-pair"
                            />
                        </div>

                        <div className="form-group">
                            <label>Direction</label>
                            <div className="direction-toggle">
                                <button
                                    type="button"
                                    className={`dir-btn ${form.type === 'Long' ? 'active-long' : ''}`}
                                    onClick={() => setForm({ ...form, type: 'Long' })}
                                >
                                    <ArrowUpRight size={14} /> Long
                                </button>
                                <button
                                    type="button"
                                    className={`dir-btn ${form.type === 'Short' ? 'active-short' : ''}`}
                                    onClick={() => setForm({ ...form, type: 'Short' })}
                                >
                                    <ArrowDownRight size={14} /> Short
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Entry Level</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="Entry"
                                value={form.entry}
                                onChange={e => setForm({ ...form, entry: e.target.value })}
                                id="input-trade-entry"
                            />
                        </div>

                        <div className="form-group">
                            <label>Exit Level</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="Exit"
                                value={form.exit}
                                onChange={e => setForm({ ...form, exit: e.target.value })}
                                id="input-trade-exit"
                            />
                        </div>

                        <div className="form-group">
                            <label>Baseline State</label>
                            <select
                                className="input-field select-field"
                                value={form.emotion}
                                onChange={e => setForm({ ...form, emotion: e.target.value })}
                                id="select-trade-baseline"
                            >
                                {baselineOptions.map(em => (
                                    <option key={em} value={em}>{em.charAt(0).toUpperCase() + em.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Rules Adherence</label>
                            <div className="direction-toggle">
                                <button
                                    type="button"
                                    className={`dir-btn ${form.followedRules ? 'active-long' : ''}`}
                                    onClick={() => setForm({ ...form, followedRules: true })}
                                >
                                    <CheckCircle2 size={14} /> Adhered
                                </button>
                                <button
                                    type="button"
                                    className={`dir-btn ${!form.followedRules ? 'active-deviation' : ''}`}
                                    onClick={() => setForm({ ...form, followedRules: false })}
                                >
                                    <AlertTriangle size={14} /> Deviated
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Behavioral Notes</label>
                        <textarea
                            className="textarea-field"
                            placeholder="Describe the observation. What triggered the entry? What was the behavioral state?"
                            value={form.notes}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                            id="input-trade-notes"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" id="btn-submit-trade">
                            <CheckCircle2 size={16} /> Record
                        </button>
                    </div>
                </form>
            )}

            {/* Trade List */}
            <div className="trade-list stagger-children">
                {Object.entries(grouped).map(([date, dateTrades]) => (
                    <div key={date} className="trade-date-group">
                        <h4 className="trade-date-label">{formatDate(date)}</h4>
                        {dateTrades.map(trade => (
                            <div key={trade.id} className="trade-entry card">
                                <div className="trade-entry-header">
                                    <div className="trade-pair-info">
                                        <span className="trade-pair">{trade.pair}</span>
                                        <span className={`trade-direction ${trade.type.toLowerCase()}`}>
                                            {trade.type === 'Long' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {trade.type}
                                        </span>
                                    </div>
                                    <div className="trade-meta">
                                        {trade.followedRules ? (
                                            <span className="badge badge-calm">
                                                <CheckCircle2 size={12} /> Adhered
                                            </span>
                                        ) : (
                                            <span className="badge badge-deviation">
                                                <AlertTriangle size={12} /> Deviated
                                            </span>
                                        )}
                                        <span className="badge badge-neutral">{trade.emotion}</span>
                                    </div>
                                </div>
                                <div className="trade-prices">
                                    <span>Entry: <strong>{trade.entry}</strong></span>
                                    <span>Exit: <strong>{trade.exit}</strong></span>
                                </div>
                                {trade.notes && (
                                    <p className="trade-notes">{trade.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    })
}
