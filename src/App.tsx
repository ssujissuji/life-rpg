import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import CharacterSheet from './pages/CharacterSheet'
import DailyLog from './pages/DailyLog'
import PatchResult from './pages/PatchResult'
import CalendarView from './pages/CalendarView'
import Analysis from './pages/Analysis'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-[430px] mx-auto min-h-svh bg-bg-root relative">
        <Routes>
          <Route path="/" element={<CharacterSheet />} />
          <Route path="/daily" element={<DailyLog />} />
          <Route path="/daily/:date" element={<DailyLog />} />
          <Route path="/result/:date" element={<PatchResult />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
