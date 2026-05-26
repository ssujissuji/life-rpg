import type { SidoName } from '../types'
import { SIDO_LIST } from '../lib/weather'

interface SidoPickerProps {
  value: SidoName | null
  onChange: (sido: SidoName) => void
}

export default function SidoPicker({ value, onChange }: SidoPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {SIDO_LIST.map((sido) => (
        <button
          key={sido}
          type="button"
          onClick={() => onChange(sido)}
          className={`rounded px-3 py-1.5 text-xs font-mono transition-colors ${
            value === sido
              ? 'bg-purple-primary text-white'
              : 'bg-bg-input text-text-sub hover:text-white hover:bg-border'
          }`}
        >
          {sido}
        </button>
      ))}
    </div>
  )
}
