interface PeriodNavigatorProps {
  label: string
  prevLabel: string
  nextLabel: string
  onPrev: () => void
  onNext: () => void
  isNextDisabled: boolean
}

export default function PeriodNavigator({
  label,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  isNextDisabled,
}: PeriodNavigatorProps) {
  return (
    <div className="flex items-center justify-between w-full gap-2">
      <button
        onClick={onPrev}
        className="flex items-center gap-1.5 font-mono text-[13px] px-3 py-2.5 min-h-11 bg-bg-input text-purple-light border border-border hover:bg-border hover:text-white transition-colors"
      >
        <span className="text-purple-light">◀</span>
        <span>{prevLabel}</span>
      </button>

      <span className="font-mono text-sm font-bold text-center flex-1 text-white tracking-wide">
        {label}
      </span>

      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`flex items-center gap-1.5 font-mono text-[13px] px-3 py-2.5 min-h-11 bg-bg-input text-purple-light border border-border transition-colors ${
          isNextDisabled
            ? 'opacity-30 cursor-not-allowed pointer-events-none'
            : 'hover:bg-border hover:text-white'
        }`}
      >
        <span>{nextLabel}</span>
        <span className="text-purple-light">▶</span>
      </button>
    </div>
  )
}
