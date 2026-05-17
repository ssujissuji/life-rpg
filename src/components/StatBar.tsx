interface StatBarProps {
  icon: string
  label: string
  value: number
}

export default function StatBar({ icon, label, value }: StatBarProps) {
  const filled = Math.round((value / 100) * 8)
  const color =
    value >= 70 ? 'bg-success' : value >= 40 ? 'bg-warning' : 'bg-danger'

  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <span className="w-4 text-center">{icon}</span>
      <span className="w-14 text-purple-light">{label}</span>
      <div className="flex gap-px">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-3 rounded-sm ${i < filled ? color : 'bg-bg-input'}`}
          />
        ))}
      </div>
      <span className="w-6 text-right text-white">{value}</span>
    </div>
  )
}
