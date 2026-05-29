import type { TitleDef, TitleRarity } from '../types'

interface TitleBadgeProps {
  def: TitleDef
  unlocked: boolean
  isActive: boolean
  onSelect?: () => void
}

const RARITY_STYLE: Record<TitleRarity, { border: string; shadow: string }> = {
  legendary: {
    border: 'var(--color-gold)',
    shadow: '0 0 8px var(--color-gold-glow-soft)',
  },
  rare: {
    border: 'var(--color-purple-glow)',
    shadow: '0 0 8px var(--color-purple-glow-soft)',
  },
  common: {
    border: 'var(--color-border)',
    shadow: 'none',
  },
}

const RARITY_LABEL: Record<TitleRarity, string> = {
  legendary: 'LEGENDARY',
  rare: 'RARE',
  common: 'COMMON',
}

const RARITY_COLOR: Record<TitleRarity, string> = {
  legendary: 'var(--color-gold)',
  rare: 'var(--color-purple-glow)',
  common: 'var(--color-text-sub)',
}

const RARITY_LOCKED_BORDER: Record<TitleRarity, string> = {
  legendary: 'var(--color-gold-dim)',
  rare: 'var(--color-purple-dim)',
  common: 'var(--color-border)',
}

const RARITY_ACTIVE_BG: Record<TitleRarity, string> = {
  legendary: 'var(--color-gold-tint)',
  rare: 'var(--color-purple-tint)',
  common: 'rgba(42,42,58,0.4)',
}

export default function TitleBadge({ def, unlocked, isActive, onSelect }: TitleBadgeProps) {
  const style = RARITY_STYLE[def.rarity]

  if (!unlocked) {
    return (
      <div
        className="flex items-center gap-3 p-3 font-mono"
        style={{
          border: `1px solid ${RARITY_LOCKED_BORDER[def.rarity]}`,
          background: 'var(--color-bg-input)',
          opacity: 0.5,
        }}
      >
        <span className="text-base w-6 text-center flex-shrink-0 opacity-40">🔒</span>
        <div className="flex-1 min-w-0">
          <div className="text-[12px]" style={{ color: 'var(--color-text-dim)' }}>???</div>
          <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-dim)' }}>
            잠금됨
          </div>
        </div>
        <div className="flex-shrink-0">
          <span
            className="text-[10px] tracking-wider uppercase"
            style={{ color: RARITY_COLOR[def.rarity], opacity: 0.6 }}
          >
            {RARITY_LABEL[def.rarity]}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-3 p-3 font-mono transition-colors"
      style={{
        border: `1px solid ${isActive ? style.border : 'var(--color-border-strong)'}`,
        boxShadow: isActive ? style.shadow : 'none',
        background: isActive ? RARITY_ACTIVE_BG[def.rarity] : 'var(--color-bg-input)',
      }}
    >
      <span className="text-base w-6 text-center flex-shrink-0">{def.icon}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-[12px] font-mono"
            style={{
              color: def.rarity === 'legendary' ? 'var(--color-gold)' : 'var(--color-text-base)',
            }}
          >
            {def.label}
          </span>
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-sub)' }}>
          {def.description}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className="text-[10px] tracking-wider uppercase"
          style={{ color: RARITY_COLOR[def.rarity] }}
        >
          {RARITY_LABEL[def.rarity]}
        </span>
        {isActive ? (
          <span
            className="text-[10px] font-mono tracking-wider t-glow-gold"
            style={{ color: 'var(--color-gold)' }}
          >
            ★ 대표
          </span>
        ) : onSelect ? (
          <button
            onClick={onSelect}
            className="t-btn-ghost"
            style={{ padding: '2px 8px', fontSize: '10px', width: 'auto' }}
          >
            선택
          </button>
        ) : null}
      </div>
    </div>
  )
}
