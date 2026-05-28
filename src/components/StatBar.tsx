interface StatBarProps {
  icon: string
  label: string
  value: number
  // non-zero 시 ▲/▼ 티커 박스 표시
  delta?: number
}

function statColor(v: number): string {
  if (v >= 70) return 'var(--color-success)'
  if (v >= 40) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

export default function StatBar({ icon, label, value, delta }: StatBarProps) {
  const filled = Math.round(value / 10)
  const color = statColor(value)
  const showDelta = typeof delta === 'number' && delta !== 0
  const deltaColor = delta && delta > 0 ? 'var(--color-success)' : 'var(--color-danger)'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-4 text-center">{icon}</span>
          <span className="text-text-base tracking-wide">{label}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="font-bold tracking-wide" style={{ color }}>
            {String(value).padStart(3, '0')}/100
          </span>
          {showDelta && (
            <span
              className="inline-flex items-center justify-center gap-1 text-[10px] tracking-wide"
              style={{
                color: deltaColor,
                padding: '1px 5px',
                minWidth: 40,
                border: `1px solid ${deltaColor}`,
                boxShadow: `0 0 6px ${deltaColor}33, 0 0 1px ${deltaColor} inset`,
              }}
            >
              <span style={{ fontSize: 8 }}>{delta! > 0 ? '▲' : '▼'}</span>
              <span>{Math.abs(delta!)}</span>
            </span>
          )}
        </span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-2.5"
            style={{
              background: i < filled ? color : 'rgba(255,255,255,0.04)',
              boxShadow: i < filled ? `0 0 6px ${color}, 0 0 1px ${color} inset` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}
