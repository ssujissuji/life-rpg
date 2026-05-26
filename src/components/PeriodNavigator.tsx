interface PeriodNavigatorProps {
  label: string;
  // prevLabel?: string;
  // nextLabel?: string;
  onPrev: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}

export default function PeriodNavigator({
  label,
  // prevLabel,
  // nextLabel,
  onPrev,
  onNext,
  isNextDisabled,
}: PeriodNavigatorProps) {
  return (
    <div className="flex items-center justify-between w-full gap-2">
      <button
        onClick={onPrev}
        className="flex items-center gap-1.5 font-mono text-[13px] px-3 py-2.5 min-h-11  text-purple-light  hover:text-white transition-colors cursor-pointer">
        <span>◀</span>
        {/* <span>{prevLabel}</span> */}
      </button>

      <span className="font-mono text-sm font-bold text-center flex-1 text-white tracking-wide">
        {label}
      </span>

      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`flex items-center gap-1.5 font-mono text-[13px] px-3 py-2.5 min-h-11  text-purple-light transition-colors ${
          isNextDisabled
            ? 'opacity-30 cursor-not-allowed pointer-events-none'
            : ' hover:text-white cursor-pointer'
        }`}>
        {/* <span>{nextLabel}</span> */}
        <span>▶</span>
      </button>
    </div>
  );
}
