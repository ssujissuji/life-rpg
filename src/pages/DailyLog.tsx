import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { formatSpend } from '../lib/stats';
import { today } from '../lib/date';
import { useWeather } from '../hooks/useWeather';
import { isHoliday } from '../lib/holidays';
import type { PatchFormData } from '../types';

const EMOJIS = ['😊', '😐', '😴', '😤', '🥲', '🤯', '🔥', '💀'];
const MEAL_OPTIONS = ['0끼', '1끼', '2끼', '3끼', '3끼+'];
const SPEND_CHIPS = [
  { label: '1천', value: 1000 },
  { label: '5천', value: 5000 },
  { label: '1만', value: 10000 },
  { label: '3만', value: 30000 },
  { label: '5만', value: 50000 },
  { label: '10만', value: 100000 },
];

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  const version = dateStr.replace(/-/g, '.');
  return `v${version} (${days[d.getDay()]})`;
}

interface CounterProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

function Counter({ value, onChange, min = 0, max = 10 }: CounterProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="min-w-11 min-h-11 bg-bg-input text-white rounded font-mono text-lg leading-none hover:bg-border transition-colors">
        −
      </button>
      <span className="text-white w-6 text-center font-mono">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="min-w-11 min-h-11 bg-bg-input text-white rounded font-mono text-lg leading-none hover:bg-border transition-colors">
        +
      </button>
    </div>
  );
}

interface TabButtonsProps {
  options: string[];
  value: number;
  onChange: (i: number) => void;
}

function TabButtons({ options, value, onChange }: TabButtonsProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(i)}
          className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
            value === i
              ? 'bg-purple-primary text-white'
              : 'bg-bg-input text-text-sub hover:text-white'
          }`}>
          {opt}
        </button>
      ))}
    </div>
  );
}

interface SectionProps {
  label: string;
  children: ReactNode;
}

function Section({ label, children }: SectionProps) {
  return (
    <div className="space-y-2">
      <div className="text-purple-light text-xs font-mono font-bold">
        {label}
      </div>
      {children}
    </div>
  );
}

export default function DailyLog() {
  const navigate = useNavigate();
  const { savePatchEntry, getPatch } = useStore();
  const { weatherLabel, aqiLabel, isLoading } = useWeather();

  const date = today();
  const existing = getPatch(date);
  const isTodayHoliday = isHoliday(date);

  const [form, setForm] = useState<PatchFormData>({
    sleep: existing?.sleep ?? 7,
    meal: existing?.meal ?? 2,
    cafe: existing?.cafe ?? 0,
    delivery: existing?.delivery ?? 0,
    spend: existing?.spend ?? 0,
    emoji: existing?.emoji ?? '😊',
    memo: existing?.memo ?? '',
  });
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const set =
    <K extends keyof PatchFormData>(key: K) =>
    (val: PatchFormData[K]) =>
      setForm((f) => ({ ...f, [key]: val }));

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    savePatchEntry(date, {
      ...form,
      weather: weatherLabel ?? undefined,
      aqi: aqiLabel ?? undefined,
    });
    navigate(`/result/${date}`, { state: { fromSave: true } });
  }

  return (
    <div className="px-4 pt-6 pb-28 space-y-6">
      {/* 헤더 */}
      <div className="space-y-1">
        <button
          onClick={() => navigate('/')}
          className="text-text-sub text-xs font-mono hover:text-purple-light transition-colors">
          ← 뒤로
        </button>
        <div className="text-white font-mono font-bold text-base">
          오늘의 패치노트
        </div>
        <div className="text-purple-light text-xs font-mono">
          {formatDateLabel(date)}
        </div>
        {isLoading && (
          <div className="text-text-sub text-xs font-mono">날씨 확인 중...</div>
        )}
        {!isLoading && (weatherLabel || aqiLabel || isTodayHoliday) && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {weatherLabel && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-bg-input border border-border font-mono text-purple-light">
                {weatherLabel}
              </span>
            )}
            {aqiLabel && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-bg-input border border-border font-mono text-purple-light">
                {aqiLabel}
              </span>
            )}
            {isTodayHoliday && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-bg-input border border-border font-mono text-success">
                🎌 공휴일
              </span>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 수면 시간 */}
        <div className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
          <Section label={`😴 수면 시간 — ${form.sleep}시간`}>
            <input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={form.sleep}
              onChange={(e) => set('sleep')(parseFloat(e.target.value))}
              className="w-full accent-purple-primary cursor-pointer"
            />
            <div className="flex justify-between text-text-sub text-[11px] font-mono">
              <span>0h</span>
              <span>6h</span>
              <span>12h</span>
            </div>
          </Section>
        </div>
        {/* 식사 + 카페 + 배달 */}
        <div className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
          <Section label="🍚 식사 횟수">
            <TabButtons
              options={MEAL_OPTIONS}
              value={form.meal}
              onChange={set('meal')}
            />
          </Section>

          <div className="border-t border-border" />

          <Section label="☕ 카페 방문">
            <Counter value={form.cafe} onChange={set('cafe')} />
          </Section>

          <div className="border-t border-border" />

          <Section label="🛵 배달 주문">
            <Counter value={form.delivery} onChange={set('delivery')} />
          </Section>
        </div>
        {/* 지출 규모 */}
        <div className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
          <Section label={`💸 지출 규모 — 합계: ${formatSpend(form.spend)}`}>
            <div className="flex gap-1.5 flex-wrap">
              {SPEND_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => set('spend')(form.spend + chip.value)}
                  className="px-3 py-1.5 rounded text-xs font-mono bg-bg-input text-text-sub hover:text-white hover:bg-border transition-colors">
                  +{chip.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowCustom((v) => !v)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  showCustom
                    ? 'bg-purple-primary text-white'
                    : 'bg-bg-input text-text-sub hover:text-white'
                }`}>
                +직접입력
              </button>
              {form.spend > 0 && (
                <button
                  type="button"
                  onClick={() => set('spend')(0)}
                  className="px-3 py-1.5 rounded text-xs font-mono bg-bg-input text-danger hover:bg-border transition-colors">
                  초기화
                </button>
              )}
            </div>
            {showCustom && (
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="금액 (원)"
                  className="flex-1 bg-bg-input text-white text-sm font-mono rounded-lg px-3 py-2 placeholder-text-sub outline-none focus:ring-1 focus:ring-purple-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = parseInt(customInput, 10);
                    if (!isNaN(val) && val > 0) {
                      set('spend')(form.spend + val);
                    }
                    setCustomInput('');
                    setShowCustom(false);
                  }}
                  className="px-3 py-2 bg-purple-primary text-white text-xs font-mono rounded-lg hover:bg-purple-dark transition-colors">
                  추가
                </button>
              </div>
            )}
          </Section>
        </div>
        {/* 오늘의 감정 */}
        <div className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
          <Section label="오늘의 감정">
            <div className="grid grid-cols-4 gap-2">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => set('emoji')(em)}
                  className={`text-2xl py-2 rounded-lg transition-all ${
                    form.emoji === em
                      ? 'bg-bg-input ring-2 ring-purple-primary'
                      : 'bg-bg-input opacity-40 hover:opacity-70'
                  }`}>
                  {em}
                </button>
              ))}
            </div>
          </Section>
        </div>
        {/* 한 줄 메모 */}
        <div className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
          <Section label="📝 한 줄 메모 (선택)">
            <input
              type="text"
              value={form.memo}
              onChange={(e) => set('memo')(e.target.value)}
              placeholder="오늘의 특이사항..."
              maxLength={60}
              className="w-full bg-bg-input text-white text-sm font-mono rounded-lg px-3 py-2.5 placeholder-text-sub outline-none focus:ring-1 focus:ring-purple-primary transition-all"
            />
          </Section>
        </div>
        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full bg-purple-primary hover:bg-purple-dark text-white font-mono text-sm py-3 rounded-lg transition-colors">
          패치노트 저장 →
        </button>
      </form>
    </div>
  );
}
