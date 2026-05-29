type BuffType = 'buff' | 'debuff' | 'rare'

interface BuffTagProps {
  label: string
  /** Optional small emoji/icon shown before label. */
  icon?: string
  type?: BuffType
}

const COLOR: Record<BuffType, string> = {
  buff: 'var(--color-purple-light)',
  debuff: 'var(--color-danger)',
  rare: 'var(--color-gold)',
}

const ARROW: Record<BuffType, string> = {
  buff: '▲',
  debuff: '▼',
  rare: '★',
}

export default function BuffTag({ label, icon, type = 'buff' }: BuffTagProps) {
  const color = COLOR[type]
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-mono"
      style={{
        padding: '3px 7px',
        background: 'var(--color-bg-input)',
        border: `1px solid ${color}`,
        color,
        boxShadow: `0 0 8px ${color}33`,
      }}
    >
      <span style={{ opacity: 0.85 }}>{ARROW[type]}</span>
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </span>
  )
}

/** Tag → type classifier. Edit this list as buff vocabulary evolves. */
const BUFF_LIST = ['커피버프', '꿀잠달성', '무지출', '주말달성']
const RARE_LIST: string[] = []

export function classifyTag(tag: string): BuffType {
  if (BUFF_LIST.includes(tag)) return 'buff'
  if (RARE_LIST.includes(tag)) return 'rare'
  return 'debuff'
}
