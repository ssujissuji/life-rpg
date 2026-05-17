import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

const EMOJIS = ['😊', '😐', '😴', '😤', '🥲', '🤯', '🔥', '💀']
const MEAL_OPTIONS = ['0끼', '1끼', '2끼', '3끼', '3끼+']
const SPEND_CHIPS = [
  { label: '1천', value: 1000 },
  { label: '5천', value: 5000 },
  { label: '1만', value: 10000 },
  { label: '3만', value: 30000 },
  { label: '5만', value: 50000 },
  { label: '10만', value: 100000 },
]

function formatSpend(amount) {
  if (amount === 0) return '0원'
  const man = Math.floor(amount / 10000)
  const rest = amount % 10000
  const chun = Math.floor(rest / 1000)
  if (man > 0 && chun > 0) return `${man}만 ${chun}천원`
  if (man > 0) return `${man}만원`
  return `${chun}천원`
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr)
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const version = dateStr.replace(/-/g, '.')
  return `v${version} (${days[d.getDay()]})`
}

function Counter({ value, onChange, min = 0, max = 10 }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 bg-[#1e1e2e] text-white rounded font-mono text-lg leading-none hover:bg-[#2a2a3a] transition-colors"
      >
        −
      </button>
      <span className="text-white w-6 text-center font-mono">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 bg-[#1e1e2e] text-white rounded font-mono text-lg leading-none hover:bg-[#2a2a3a] transition-colors"
      >
        +
      </button>
    </div>
  )
}

function TabButtons({ options, value, onChange }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(i)}
          className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
            value === i
              ? 'bg-[#534ab7] text-white'
              : 'bg-[#1e1e2e] text-[#6b7280] hover:text-white'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function Section({ label, children }) {
  return (
    <div className="space-y-2">
      <div className="text-[#afa9ec] text-xs font-mono font-bold">{label}</div>
      {children}
    </div>
  )
}

export default function DailyLog() {
  const navigate = useNavigate()
  const { savePatchEntry, getPatch } = useStore()

  const date = today()
  const existing = getPatch(date)

  const [form, setForm] = useState({
    sleep: existing?.sleep ?? 7,
    meal: existing?.meal ?? 2,
    cafe: existing?.cafe ?? 0,
    delivery: existing?.delivery ?? 0,
    spend: existing?.spend ?? 0,
    emoji: existing?.emoji ?? '😊',
    memo: existing?.memo ?? '',
  })
  const [customInput, setCustomInput] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  function handleSubmit(e) {
    e.preventDefault()
    savePatchEntry(date, form)
    navigate(`/result/${date}`)
  }

  return (
    <div className="px-4 pt-6 pb-28 space-y-6">
      {/* 헤더 */}
      <div className="space-y-1">
        <button
          onClick={() => navigate('/')}
          className="text-[#6b7280] text-xs font-mono hover:text-[#afa9ec] transition-colors"
        >
          ← 뒤로
        </button>
        <div className="text-white font-mono font-bold text-base">오늘의 패치노트</div>
        <div className="text-[#afa9ec] text-xs font-mono">{formatDateLabel(date)}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 수면 시간 */}
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-4 space-y-4">
          <Section label={`😴 수면 시간 — ${form.sleep}시간`}>
            <input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={form.sleep}
              onChange={(e) => set('sleep')(parseFloat(e.target.value))}
              className="w-full accent-[#534ab7] cursor-pointer"
            />
            <div className="flex justify-between text-[#6b7280] text-[11px] font-mono">
              <span>0h</span>
              <span>6h</span>
              <span>12h</span>
            </div>
          </Section>
        </div>

        {/* 식사 + 카페 + 배달 */}
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-4 space-y-4">
          <Section label="🍚 식사 횟수">
            <TabButtons options={MEAL_OPTIONS} value={form.meal} onChange={set('meal')} />
          </Section>

          <div className="border-t border-[#2a2a3a]" />

          <Section label="☕ 카페 방문">
            <Counter value={form.cafe} onChange={set('cafe')} />
          </Section>

          <div className="border-t border-[#2a2a3a]" />

          <Section label="🛵 배달 주문">
            <Counter value={form.delivery} onChange={set('delivery')} />
          </Section>
        </div>

        {/* 지출 규모 */}
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-4 space-y-4">
          <Section label={`💸 지출 규모 — 합계: ${formatSpend(form.spend)}`}>
            <div className="flex gap-1.5 flex-wrap">
              {SPEND_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => set('spend')(form.spend + chip.value)}
                  className="px-3 py-1.5 rounded text-xs font-mono bg-[#1e1e2e] text-[#6b7280] hover:text-white hover:bg-[#2a2a3a] transition-colors"
                >
                  +{chip.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowCustom((v) => !v)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  showCustom
                    ? 'bg-[#534ab7] text-white'
                    : 'bg-[#1e1e2e] text-[#6b7280] hover:text-white'
                }`}
              >
                +직접입력
              </button>
              {form.spend > 0 && (
                <button
                  type="button"
                  onClick={() => set('spend')(0)}
                  className="px-3 py-1.5 rounded text-xs font-mono bg-[#1e1e2e] text-[#f0997b] hover:bg-[#2a2a3a] transition-colors"
                >
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
                  className="flex-1 bg-[#1e1e2e] text-white text-sm font-mono rounded-lg px-3 py-2 placeholder-[#6b7280] outline-none focus:ring-1 focus:ring-[#534ab7] transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = parseInt(customInput, 10)
                    if (!isNaN(val) && val > 0) {
                      set('spend')(form.spend + val)
                    }
                    setCustomInput('')
                    setShowCustom(false)
                  }}
                  className="px-3 py-2 bg-[#534ab7] text-white text-xs font-mono rounded-lg hover:bg-[#4340a0] transition-colors"
                >
                  추가
                </button>
              </div>
            )}
          </Section>
        </div>

        {/* 오늘의 감정 */}
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-4 space-y-4">
          <Section label="오늘의 감정">
            <div className="grid grid-cols-4 gap-2">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => set('emoji')(em)}
                  className={`text-2xl py-2 rounded-lg transition-all ${
                    form.emoji === em
                      ? 'bg-[#1e1e2e] ring-2 ring-[#534ab7]'
                      : 'bg-[#1e1e2e] opacity-40 hover:opacity-70'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </Section>
        </div>

        {/* 한 줄 메모 */}
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-4 space-y-4">
          <Section label="📝 한 줄 메모 (선택)">
            <input
              type="text"
              value={form.memo}
              onChange={(e) => set('memo')(e.target.value)}
              placeholder="오늘의 특이사항..."
              maxLength={60}
              className="w-full bg-[#1e1e2e] text-white text-sm font-mono rounded-lg px-3 py-2.5 placeholder-[#6b7280] outline-none focus:ring-1 focus:ring-[#534ab7] transition-all"
            />
          </Section>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full bg-[#534ab7] hover:bg-[#4340a0] text-white font-mono text-sm py-3 rounded-lg transition-colors"
        >
          패치노트 저장 →
        </button>
      </form>
    </div>
  )
}
