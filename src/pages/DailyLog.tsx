import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import useStore from '../store/useStore';
import { formatSpend } from '../lib/stats';
import { today, formatDateLabel } from '../lib/date';
import { useWeather } from '../hooks/useWeather';
import { isHoliday } from '../lib/holidays';
import type { PatchFormData } from '../types';
import Panel from '../components/Panel';

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
        className="min-w-11 min-h-11 bg-bg-input border border-border text-white font-mono text-lg leading-none hover:border-purple-light hover:text-purple-light transition-colors">
        −
      </button>
      <span className="text-white w-6 text-center font-mono text-base">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="min-w-11 min-h-11 bg-bg-input border border-border text-white font-mono text-lg leading-none hover:border-purple-light hover:text-purple-light transition-colors">
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
      {options.map((opt, i) => {
        const active = value === i;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(i)}
            className="px-3 py-1.5 text-xs font-mono transition-all"
            style={{
              background: active
                ? 'var(--color-purple-primary)'
                : 'var(--color-bg-input)',
              color: active ? '#fff' : 'var(--color-text-sub)',
              border: `1px solid ${active ? 'var(--color-purple-primary)' : 'var(--color-border)'}`,
              boxShadow: active ? '0 0 12px rgba(122, 111, 255, 0.45)' : 'none',
            }}>
            {opt}
          </button>
        );
      })}
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
      <div className="t-label">◢ {label}</div>
      {children}
    </div>
  );
}

export default function DailyLog() {
  const navigate = useNavigate();
  const params = useParams<{ date?: string }>();
  const { savePatchEntry, getPatch } = useStore();
  const { weatherLabel, aqiLabel, isLoading, error } = useWeather();

  const todayStr = today();
  const date = params.date ?? todayStr;
  const isToday = date === todayStr;
  const isFuture = date > todayStr;
  const existing = getPatch(date);
  const isDateHoliday = isHoliday(date);

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
      weather: isToday ? (weatherLabel ?? undefined) : undefined,
      aqi: isToday ? (aqiLabel ?? undefined) : undefined,
    });
    navigate(`/result/${date}`, { state: { fromSave: true } });
  }

  return (
    <div className="px-4 pt-6 pb-28 space-y-5">
      {/* 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-text-sub hover:text-purple-light transition-colors"
            aria-label="뒤로">
            <ArrowLeft size={16} />
          </button>
          <div className="text-text-sub text-[10px] font-mono tracking-[0.18em] uppercase">
            {'> 패치노트 작성 중'}
          </div>
        </div>
        <div className="t-h1 t-glow-soft text-white text-[18px]">
          {isToday ? '오늘의 패치노트' : '패치노트'}
        </div>
        <div className="text-purple-light text-xs font-mono">
          {formatDateLabel(date)}
        </div>
        {isToday && isLoading && (
          <div className="text-text-sub text-xs font-mono">날씨 확인 중...</div>
        )}
        {isToday && !isLoading && error && !weatherLabel && !aqiLabel && (
          <div className="text-text-sub text-xs font-mono">
            날씨 정보를 불러오지 못했습니다
          </div>
        )}
        {isToday &&
          !isLoading &&
          (weatherLabel || aqiLabel || isDateHoliday) && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {weatherLabel && (
                <span className="text-xs px-2 py-0.5 bg-bg-input border border-border font-mono text-purple-light">
                  {weatherLabel}
                </span>
              )}
              {aqiLabel && (
                <span className="text-xs px-2 py-0.5 bg-bg-input border border-border font-mono text-purple-light">
                  {aqiLabel}
                </span>
              )}
              {isDateHoliday && (
                <span className="text-xs px-2 py-0.5 bg-bg-input border border-border font-mono text-success">
                  🎌 공휴일
                </span>
              )}
            </div>
          )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 수면 시간 */}
        <Panel className="p-4 space-y-4">
          <Section label={`수면 시간 — ${form.sleep}시간`}>
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
        </Panel>

        {/* 식사 + 카페 + 배달 */}
        <Panel className="p-4 space-y-4">
          <Section label="식사 횟수">
            <TabButtons
              options={MEAL_OPTIONS}
              value={form.meal}
              onChange={set('meal')}
            />
          </Section>

          <hr className="t-divider" />

          <Section label="카페 방문">
            <Counter value={form.cafe} onChange={set('cafe')} />
          </Section>

          <hr className="t-divider" />

          <Section label="배달 주문">
            <Counter value={form.delivery} onChange={set('delivery')} />
          </Section>
        </Panel>

        {/* 지출 규모 */}
        <Panel className="p-4 space-y-4">
          <Section label={`지출 규모 — 합계: ${formatSpend(form.spend)}`}>
            <div className="flex gap-1.5 flex-wrap">
              {SPEND_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => set('spend')(form.spend + chip.value)}
                  className="px-3 py-1.5 text-xs font-mono bg-bg-input border border-border text-text-sub hover:text-white hover:border-purple-light transition-colors">
                  +{chip.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowCustom((v) => !v)}
                className="px-3 py-1.5 text-xs font-mono transition-all"
                style={{
                  background: showCustom
                    ? 'var(--color-purple-primary)'
                    : 'var(--color-bg-input)',
                  color: showCustom ? '#fff' : 'var(--color-text-sub)',
                  border: `1px solid ${showCustom ? 'var(--color-purple-primary)' : 'var(--color-border)'}`,
                  boxShadow: showCustom
                    ? '0 0 12px rgba(122,111,255,0.45)'
                    : 'none',
                }}>
                +직접입력
              </button>
              {form.spend > 0 && (
                <button
                  type="button"
                  onClick={() => set('spend')(0)}
                  className="px-3 py-1.5 text-xs font-mono bg-bg-input border border-border text-danger hover:border-danger transition-colors">
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
                  className="flex-1 bg-bg-input border border-border text-white text-sm font-mono px-3 py-2 placeholder-text-sub outline-none focus:border-purple-primary transition-all"
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
                  className="px-3 py-2 bg-purple-primary text-white text-xs font-mono hover:bg-purple-dark transition-colors"
                  style={{ boxShadow: '0 0 12px rgba(122,111,255,0.45)' }}>
                  추가
                </button>
              </div>
            )}
          </Section>
        </Panel>

        {/* 오늘의 감정 */}
        <Panel className="p-4 space-y-4">
          <Section label="오늘의 감정">
            <div className="grid grid-cols-4 gap-2">
              {EMOJIS.map((em) => {
                const active = form.emoji === em;
                return (
                  <button
                    key={em}
                    type="button"
                    onClick={() => set('emoji')(em)}
                    className="text-2xl py-2 transition-all"
                    style={{
                      background: 'var(--color-bg-input)',
                      border: `1px solid ${active ? 'var(--color-purple-glow)' : 'var(--color-border)'}`,
                      opacity: active ? 1 : 0.45,
                      boxShadow: active
                        ? '0 0 0 1px var(--color-purple-glow) inset, 0 0 12px rgba(122,111,255,0.4)'
                        : 'none',
                    }}>
                    {em}
                  </button>
                );
              })}
            </div>
          </Section>
        </Panel>

        {/* 한 줄 메모 */}
        <Panel className="p-4 space-y-4">
          <Section label="한 줄 메모 (선택)">
            <input
              type="text"
              value={form.memo}
              onChange={(e) => set('memo')(e.target.value)}
              placeholder="오늘의 특이사항..."
              maxLength={60}
              className="w-full bg-bg-input border border-border text-white text-sm font-mono px-3 py-2.5 placeholder-text-sub outline-none focus:border-purple-primary transition-all"
            />
          </Section>
        </Panel>

        {/* 제출 버튼 */}
        {isFuture && (
          <div className="text-danger text-xs font-mono text-center">
            미래 날짜는 기록할 수 없습니다
          </div>
        )}
        <button type="submit" disabled={isFuture} className="t-btn-primary">
          <span className="flex items-center justify-center gap-2">
            ▶ 패치노트 저장 <Save size={14} />
          </span>
        </button>
      </form>
    </div>
  );
}
