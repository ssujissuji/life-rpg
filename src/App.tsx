import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import CharacterSheet from './pages/CharacterSheet'
import DailyLog from './pages/DailyLog'
import PatchResult from './pages/PatchResult'
import CalendarView from './pages/CalendarView'
import Analysis from './pages/Analysis'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'
import useStore from './store/useStore'

function AppShell() {
  const location = useLocation()
  const onboardingPath = location.pathname === '/onboarding'
  const onboarded = useStore(s => s.onboardingDone)

  if (!onboarded && !onboardingPath) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-svh bg-bg-root relative">
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<CharacterSheet />} />
        <Route path="/daily" element={<DailyLog />} />
        <Route path="/daily/:date" element={<DailyLog />} />
        <Route path="/result/:date" element={<PatchResult />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!onboardingPath && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
