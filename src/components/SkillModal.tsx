import type { SkillData } from '../types'

export interface SkillConfig {
  icon: string
  label: string
  key: 'pig' | 'poor' | 'cafe' | 'sleep'
  max: number
  unit: string
  description: string
  condition: string
}

interface SkillModalProps {
  skill: SkillConfig
  data: SkillData
  onClose: () => void
}

export default function SkillModal({ skill, data, onClose }: SkillModalProps) {
  const pct = Math.min(data.count / skill.max, 1)
  const filled = Math.round(pct * 10)
  const isMaxed = data.level >= 10
  const isNearMax = !isMaxed && pct >= 0.9
  const toMax = Math.max(0, skill.max - data.count)

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-bg-card border border-border border-b-0 rounded-t-xl p-5 w-full max-w-[430px] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-8 h-1 bg-border rounded-full mx-auto" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{skill.icon}</span>
            <div>
              <div className={`font-mono font-bold text-base ${isMaxed ? 'text-success' : 'text-white'}`}>
                {skill.label}
              </div>
              <div className="text-text-sub text-xs font-mono">{skill.description}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-sub hover:text-white font-mono text-lg leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-purple-light font-mono text-sm">Lv.</span>
          <span className={`font-mono font-bold text-2xl ${isMaxed ? 'text-success' : 'text-white'}`}>
            {data.level}
          </span>
          <span className="text-text-sub font-mono text-sm">/ 10</span>
          {isMaxed && <span className="text-success text-xs font-mono ml-1">MAX ✓</span>}
          {isNearMax && <span className="text-warning text-xs font-mono ml-1">⚠ 만렙 근접</span>}
        </div>

        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-3 rounded-sm ${
                i < filled
                  ? isMaxed
                    ? 'bg-success'
                    : 'bg-purple-primary'
                  : 'bg-bg-input'
              }`}
            />
          ))}
        </div>

        <div className="bg-bg-input border border-border rounded-lg p-3 space-y-2">
          <div className="text-text-sub text-[11px] font-mono uppercase tracking-wide">만렙 조건</div>
          <div className="text-purple-light text-xs font-mono">{skill.condition}</div>
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <span className="text-text-sub text-xs font-mono">현재 달성</span>
            <span className="font-mono text-xs">
              <span className="text-white font-bold">{data.count}</span>
              <span className="text-text-sub"> / {skill.max}{skill.unit}</span>
            </span>
          </div>
        </div>

        <div className="text-center pb-1">
          {isMaxed ? (
            <div className="space-y-1">
              <div className="text-success font-mono text-sm font-bold">🎉 만렙 달성!</div>
              <div className="text-text-sub text-xs font-mono">이미 마스터한 스킬입니다.</div>
            </div>
          ) : (
            <div>
              <span className="text-text-sub text-xs font-mono">만렙까지 </span>
              <span className={`font-mono text-sm font-bold ${isNearMax ? 'text-warning' : 'text-white'}`}>
                {toMax}{skill.unit}
              </span>
              <span className="text-text-sub text-xs font-mono"> 남음</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
