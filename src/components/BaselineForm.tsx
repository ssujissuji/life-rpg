import type { PersonalBaseline } from '../types'

interface BaselineFormProps {
  value: PersonalBaseline
  onChange: (v: PersonalBaseline) => void
}

const SPEND_OPTIONS = [10000, 20000, 30000, 50000, 100000]

export default function BaselineForm({ value, onChange }: BaselineFormProps) {
  function handleSleepChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, sleepGoal: Number(e.target.value) })
  }

  function handleCafeDecrement() {
    if (value.cafeMax <= 1) return
    onChange({ ...value, cafeMax: value.cafeMax - 1 })
  }

  function handleCafeIncrement() {
    if (value.cafeMax >= 5) return
    onChange({ ...value, cafeMax: value.cafeMax + 1 })
  }

  return (
    <div className="space-y-6">
      {/* 수면 목표 */}
      <div className="space-y-3">
        <label className="text-[#6b7280] text-xs font-mono uppercase tracking-widest">수면 목표</label>
        <div className="flex items-baseline gap-1">
          <span className="text-white text-2xl font-bold font-mono">{value.sleepGoal}</span>
          <span className="text-[#afa9ec] text-sm font-mono">h</span>
        </div>
        <input
          type="range"
          min={4}
          max={10}
          step={0.5}
          value={value.sleepGoal}
          onChange={handleSleepChange}
          className="w-full accent-[#534ab7] cursor-pointer"
        />
        <div className="flex justify-between text-[#6b7280] text-[11px] font-mono">
          <span>4h</span>
          <span>7h</span>
          <span>10h</span>
        </div>
        <div className="text-[#6b7280] text-[11px] font-mono">
          꿀잠 기준: {value.sleepGoal + 1}h 자동 적용
        </div>
      </div>

      <div className="border-t border-[#2a2a3a]" />

      {/* 카페인 max */}
      <div className="space-y-3">
        <label className="text-[#6b7280] text-xs font-mono uppercase tracking-widest">카페인 max (잔/일)</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCafeDecrement}
            disabled={value.cafeMax <= 1}
            className="min-w-11 min-h-11 bg-[#1e1e2e] border border-[#2a2a3a] text-white rounded font-mono text-lg leading-none disabled:opacity-40 hover:bg-[#2a2a3a] transition-colors"
          >
            −
          </button>
          <span className="text-white w-8 text-center font-mono font-bold text-lg">{value.cafeMax}</span>
          <button
            type="button"
            onClick={handleCafeIncrement}
            disabled={value.cafeMax >= 5}
            className="min-w-11 min-h-11 bg-[#1e1e2e] border border-[#2a2a3a] text-white rounded font-mono text-lg leading-none disabled:opacity-40 hover:bg-[#2a2a3a] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="border-t border-[#2a2a3a]" />

      {/* 지출 기준 */}
      <div className="space-y-3">
        <label className="text-[#6b7280] text-xs font-mono uppercase tracking-widest">지출 기준</label>
        <div className="flex gap-1.5 flex-wrap">
          {SPEND_OPTIONS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => onChange({ ...value, spendThreshold: amount })}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors border ${
                value.spendThreshold === amount
                  ? 'bg-[#534ab7] border-[#534ab7] text-white'
                  : 'bg-transparent border-[#2a2a3a] text-[#6b7280] hover:text-white hover:border-[#afa9ec]'
              }`}
            >
              {`${amount / 10000}만`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
