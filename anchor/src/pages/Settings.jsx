import { useState } from 'react'
import {
    User,
    Bell,
    Shield,
    Palette,
    Moon,
    Sun,
    Save,
} from 'lucide-react'
import './Settings.css'

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        name: 'Trader',
        maxTrades: 3,
        sessionStart: '09:30',
        sessionEnd: '16:00',
        reminders: true,
        preSessionCheck: true,
        darkMode: true,
    })

    return (
        <div className="settings-page animate-fade-in-up">
            <div className="page-header">
                <div>
                    <h1>Configuration</h1>
                    <p className="text-muted">Behavioral parameters and environment settings.</p>
                </div>
            </div>

            <div className="settings-sections stagger-children">
                {/* Profile */}
                <div className="settings-section card">
                    <div className="section-header">
                        <User size={20} strokeWidth={1.4} />
                        <h3>Profile</h3>
                    </div>
                    <div className="settings-group">
                        <div className="setting-item">
                            <label>Identifier</label>
                            <input
                                className="input-field"
                                type="text"
                                value={settings.name}
                                onChange={e => setSettings({ ...settings, name: e.target.value })}
                                id="input-settings-name"
                            />
                        </div>
                    </div>
                </div>

                {/* Session Parameters */}
                <div className="settings-section card">
                    <div className="section-header">
                        <Shield size={20} strokeWidth={1.4} />
                        <h3>Session Parameters</h3>
                    </div>
                    <div className="settings-group">
                        <div className="setting-item">
                            <label>Max Executions Per Session</label>
                            <input
                                className="input-field small-input"
                                type="number"
                                min="1"
                                max="20"
                                value={settings.maxTrades}
                                onChange={e => setSettings({ ...settings, maxTrades: Number(e.target.value) })}
                                id="input-settings-max-trades"
                            />
                        </div>
                        <div className="setting-item">
                            <label>Session Start</label>
                            <input
                                className="input-field small-input"
                                type="time"
                                value={settings.sessionStart}
                                onChange={e => setSettings({ ...settings, sessionStart: e.target.value })}
                                id="input-settings-start"
                            />
                        </div>
                        <div className="setting-item">
                            <label>Session End</label>
                            <input
                                className="input-field small-input"
                                type="time"
                                value={settings.sessionEnd}
                                onChange={e => setSettings({ ...settings, sessionEnd: e.target.value })}
                                id="input-settings-end"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="settings-section card">
                    <div className="section-header">
                        <Bell size={20} strokeWidth={1.4} />
                        <h3>Notifications</h3>
                    </div>
                    <div className="settings-group">
                        <div className="setting-toggle">
                            <div>
                                <span className="setting-toggle-label">Session Reminders</span>
                                <span className="setting-toggle-desc">Notify before session window opens</span>
                            </div>
                            <button
                                className={`toggle-switch ${settings.reminders ? 'active' : ''}`}
                                onClick={() => setSettings({ ...settings, reminders: !settings.reminders })}
                                id="btn-toggle-reminders"
                            >
                                <span className="toggle-knob" />
                            </button>
                        </div>
                        <div className="setting-toggle">
                            <div>
                                <span className="setting-toggle-label">Pre-Session Check</span>
                                <span className="setting-toggle-desc">Require behavioral check-in before execution</span>
                            </div>
                            <button
                                className={`toggle-switch ${settings.preSessionCheck ? 'active' : ''}`}
                                onClick={() => setSettings({ ...settings, preSessionCheck: !settings.preSessionCheck })}
                                id="btn-toggle-presession"
                            >
                                <span className="toggle-knob" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="settings-section card">
                    <div className="section-header">
                        <Palette size={20} strokeWidth={1.4} />
                        <h3>Environment</h3>
                    </div>
                    <div className="settings-group">
                        <div className="setting-toggle">
                            <div>
                                <span className="setting-toggle-label">
                                    {settings.darkMode ? 'Dark Environment' : 'Light Environment'}
                                </span>
                                <span className="setting-toggle-desc">
                                    {settings.darkMode
                                        ? 'Reduced visual stimulation for controlled observation'
                                        : 'Soft light environment for daytime sessions'
                                    }
                                </span>
                            </div>
                            <button
                                className={`toggle-switch ${settings.darkMode ? 'active' : ''}`}
                                onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                                id="btn-toggle-dark-mode"
                            >
                                <span className="toggle-knob">
                                    {settings.darkMode ? <Moon size={12} /> : <Sun size={12} />}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-footer">
                <button className="btn btn-primary" id="btn-save-settings">
                    <Save size={16} /> Save Configuration
                </button>
            </div>
        </div>
    )
}
