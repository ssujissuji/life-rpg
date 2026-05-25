import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import useStore from '../store/useStore';
import { today } from '../lib/date';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.css';

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function CalendarView() {
  const navigate = useNavigate();
  const { patches } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const todayStr = today();

  function handleDayClick(date: Date) {
    const dateStr = toDateStr(date);
    if (patches[dateStr]) {
      navigate(`/result/${dateStr}`);
    } else {
      setSelected(dateStr);
    }
  }

  function tileContent({ date, view }: { date: Date; view: string }) {
    if (view !== 'month') return null;
    const dateStr = toDateStr(date);
    const patch = patches[dateStr];
    if (!patch) return null;
    return (
      <div className="flex justify-center mt-0.5">
        <span className="text-base leading-none">{patch.emoji}</span>
      </div>
    );
  }

  function tileClassName({ date, view }: { date: Date; view: string }) {
    if (view !== 'month') return '';
    return patches[toDateStr(date)] ? 'has-patch' : '';
  }

  const recordedDays = Object.keys(patches).length;

  return (
    <div className="px-4 pt-6 pb-28 space-y-4">
      <div className="space-y-1">
        <div className="text-white font-mono font-bold text-base">캘린더</div>
        <div className="text-text-sub text-xs font-mono">
          기록된 날짜: {recordedDays}일
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
        <Calendar
          onClickDay={handleDayClick}
          tileContent={tileContent}
          tileClassName={tileClassName}
          locale="ko-KR"
          formatDay={(_locale, date) => String(date.getDate())}
        />
      </div>

      {selected && !patches[selected] && (
        <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="text-text-sub text-xs font-mono">
            {selected} — 기록 없음
          </div>
          {selected <= todayStr ? (
            <button
              onClick={() =>
                selected === todayStr
                  ? navigate('/daily')
                  : navigate(`/daily/${selected}`)
              }
              className="w-full bg-purple-primary hover:bg-purple-dark text-white font-mono text-sm py-2.5 rounded-lg transition-colors"
            >
              {selected === todayStr ? '오늘 패치노트 작성하기' : '패치노트 작성하기'}
            </button>
          ) : (
            <div className="text-text-sub text-xs font-mono">
              미래 날짜는 기록할 수 없습니다
            </div>
          )}
        </div>
      )}

      <div className="bg-bg-card border border-border rounded-lg p-4">
        <div className="text-text-sub text-xs font-mono">
          기록된 날짜를 클릭하면 패치노트를 확인할 수 있습니다.
        </div>
      </div>
    </div>
  );
}
