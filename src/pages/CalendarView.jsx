import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import useStore from '../store/useStore'
import 'react-calendar/dist/Calendar.css'

function toDateStr(d) {
  return d.toISOString().slice(0, 10)
}

export default function CalendarView() {
  const navigate = useNavigate()
  const { patches } = useStore()
  const [selected, setSelected] = useState(null)

  function handleDayClick(date) {
    const dateStr = toDateStr(date)
    const patch = patches[dateStr]
    if (patch) {
      navigate(`/result/${dateStr}`)
    } else {
      setSelected(dateStr)
    }
  }

  function tileContent({ date, view }) {
    if (view !== 'month') return null
    const dateStr = toDateStr(date)
    const patch = patches[dateStr]
    if (!patch) return null
    return (
      <div className="flex justify-center mt-0.5">
        <span className="text-base leading-none">{patch.emoji}</span>
      </div>
    )
  }

  function tileClassName({ date, view }) {
    if (view !== 'month') return ''
    const dateStr = toDateStr(date)
    return patches[dateStr] ? 'has-patch' : ''
  }

  const recordedDays = Object.keys(patches).length

  return (
    <div className="px-4 pt-6 pb-28 space-y-4">
      <div className="space-y-1">
        <div className="text-white font-mono font-bold text-base">캘린더</div>
        <div className="text-[#6b7280] text-xs font-mono">기록된 날짜: {recordedDays}일</div>
      </div>

      {/* 캘린더 */}
      <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg overflow-hidden">
        <style>{`
          .react-calendar {
            width: 100%;
            background: transparent;
            border: none;
            font-family: ui-monospace, Consolas, monospace;
            color: #e2e8f0;
          }
          .react-calendar__navigation {
            background: #12121a;
            margin-bottom: 0;
            border-bottom: 1px solid #2a2a3a;
          }
          .react-calendar__navigation button {
            color: #afa9ec;
            font-family: ui-monospace, Consolas, monospace;
            font-size: 13px;
            min-width: 36px;
            background: transparent;
          }
          .react-calendar__navigation button:hover,
          .react-calendar__navigation button:focus {
            background: #1e1e2e;
          }
          .react-calendar__navigation__label {
            color: #e2e8f0 !important;
            font-weight: bold;
          }
          .react-calendar__month-view__weekdays {
            background: #0f0f13;
            border-bottom: 1px solid #2a2a3a;
          }
          .react-calendar__month-view__weekdays__weekday {
            color: #6b7280;
            font-size: 11px;
            text-transform: none;
            padding: 6px 0;
          }
          .react-calendar__month-view__weekdays__weekday abbr {
            text-decoration: none;
          }
          .react-calendar__tile {
            background: transparent;
            color: #e2e8f0;
            font-family: ui-monospace, Consolas, monospace;
            font-size: 12px;
            padding: 6px 4px;
            height: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding-top: 8px;
            border-right: 1px solid #2a2a3a;
            border-bottom: 1px solid #2a2a3a;
          }
          .react-calendar__tile:hover {
            background: #1e1e2e;
          }
          .react-calendar__tile--active,
          .react-calendar__tile--now {
            background: #1e1e2e !important;
            color: #afa9ec !important;
          }
          .react-calendar__tile--now {
            color: #5dcaa5 !important;
          }
          .react-calendar__tile.has-patch {
            background: #12121a;
          }
          .react-calendar__month-view__days__day--neighboringMonth {
            color: #2a2a3a;
          }
        `}</style>
        <Calendar
          onClickDay={handleDayClick}
          tileContent={tileContent}
          tileClassName={tileClassName}
          locale="ko-KR"
          formatDay={(_, date) => date.getDate()}
        />
      </div>

      {/* 안내 */}
      {selected && !patches[selected] && (
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-4 space-y-3">
          <div className="text-[#6b7280] text-xs font-mono">{selected} — 기록 없음</div>
          {selected === toDateStr(new Date()) && (
            <button
              onClick={() => navigate('/daily')}
              className="w-full bg-[#534ab7] hover:bg-[#4340a0] text-white font-mono text-sm py-2.5 rounded-lg transition-colors"
            >
              오늘 패치노트 작성하기
            </button>
          )}
        </div>
      )}

      {/* 범례 */}
      <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-4">
        <div className="text-[#6b7280] text-xs font-mono">
          기록된 날짜를 클릭하면 패치노트를 확인할 수 있습니다.
        </div>
      </div>
    </div>
  )
}
