import { Routes, Route } from 'react-router-dom'
import { RuleSciProvider, useRuleSci } from './context/RuleSciContext'
import Sidebar from './components/Sidebar'
import Session from './pages/Session'
import TradeLog from './pages/TradeLog'
import Rules from './pages/Rules'
import Observe from './pages/Observe'
import Analytics from './pages/Analytics'
import SettingsPage from './pages/Settings'
import LabMode from './components/LabMode'

function AppContent() {
  const { sidebarCollapsed, labMode } = useRuleSci()

  return (
    <div className="app-layout">
      <Sidebar />
      <main
        className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${labMode ? 'focus-mode' : ''}`}
      >
        <Routes>
          <Route path="/" element={<Session />} />
          <Route path="/trades" element={<TradeLog />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/observe" element={<Observe />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      {labMode && <LabMode />}
    </div>
  )
}

export default function App() {
  return (
    <RuleSciProvider>
      <AppContent />
    </RuleSciProvider>
  )
}
