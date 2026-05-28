interface SkillBarProps {
  icon: string
  label: string
  level: number
  count: number
  max: number
  unit: string
}

export default function SkillBar({ icon, label, level, count, max, unit }: SkillBarProps) {
  const pct = Math.min(count / max, 1)
  const filled = Math.round(pct * 100)
  const isMax = level >= 10
  const color = isMax ? 'var(--color-gold)' : 'var(--color-purple-glow)'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span
            className={isMax ? 't-glow-gold tracking-wide' : 'tracking-wide'}
            style={{ color }}
          >
            {label}
          </span>
          <span className="text-white">Lv.{String(level).padStart(2, '0')}</span>
          {isMax && (
            <span
              className="t-glow-gold text-[9px] tracking-[0.2em]"
              style={{ color: 'var(--color-gold)' }}
            >
              [ MAX ]
            </span>
          )}
        </span>
        <span className="inline-flex items-baseline gap-1.5">
          <span className="font-bold tracking-wide text-[11px]" style={{ color }}>
            {filled}%
          </span>
          {!isMax && (
            <span className="text-text-sub text-[10px]">
              · {max - count}{unit} 남음
            </span>
          )}
        </span>
      </div>
      <div className="flex w-full" style={{ gap: 1.5 }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const on = i < filled
          return (
            <div
              key={i}
              className="flex-1 flex justify-center"
              style={{ height: 14 }}
            >
              <div
                style={{
                  width: '65%',
                  height: '100%',
                  background: color,
                  opacity: on ? 1 : 0.14,
                  boxShadow: on ? `0 0 6px ${color}` : 'none',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
