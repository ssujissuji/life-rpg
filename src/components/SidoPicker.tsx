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
              ? 'bg-[#534ab7] text-white'
              : 'bg-[#1e1e2e] text-[#6b7280] hover:text-white hover:bg-[#2a2a3a]'
          }`}
        >
          {sido}
        </button>
      ))}
    </div>
  )
}
