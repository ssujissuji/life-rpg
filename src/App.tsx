import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import CharacterSheet from './pages/CharacterSheet'
import DailyLog from './pages/DailyLog'
import PatchResult from './pages/PatchResult'
import CalendarView from './pages/CalendarView'
import Analysis from './pages/Analysis'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'
import Landing from './pages/Landing'
import useStore from './store/useStore'

function AppShell() {
  const location = useLocation()
  const { pathname } = location
  const onboardingPath = pathname === '/onboarding'
  const landingPath = pathname === '/landing'
  const onboarded = useStore(s => s.onboardingDone)
  const hasLanded = sessionStorage.getItem('has_landed') === '1'

  if (!onboarded && !onboardingPath) {
    return <Navigate to="/onboarding" replace />
  }

  if (onboarded && !hasLanded && pathname === '/') {
    return <Navigate to="/landing" replace />
  }

  const hideBottomNav = onboardingPath || landingPath

  return (
    <div className="min-h-svh bg-bg-root sm:py-6">
      <div className="max-w-[430px] mx-auto min-h-svh sm:min-h-0 bg-bg-root relative">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/" element={<CharacterSheet />} />
          <Route path="/daily" element={<DailyLog />} />
          <Route path="/daily/:date" element={<DailyLog />} />
          <Route path="/result/:date" element={<PatchResult />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!hideBottomNav && <BottomNav />}
      </div>
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
