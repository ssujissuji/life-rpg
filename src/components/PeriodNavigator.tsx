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
    <div className="flex items-center justify-between w-full">
      <button
        onClick={onPrev}
        className="font-mono text-xs px-3 py-1 bg-bg-input text-purple-light border border-border rounded hover:bg-border transition-colors"
      >
        {'< '}{prevLabel}
      </button>

      <span className="text-xs font-mono text-center flex-1 text-text-base px-2">
        {label}
      </span>

      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`font-mono text-xs px-3 py-1 bg-bg-input text-purple-light border border-border rounded transition-colors ${
          isNextDisabled
            ? 'opacity-30 cursor-not-allowed pointer-events-none'
            : 'hover:bg-border'
        }`}
      >
        {nextLabel}{' >'}
      </button>
    </div>
  )
}
