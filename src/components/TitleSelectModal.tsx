import { TITLE_DEFS } from '../lib/titles'
import TitleBadge from './TitleBadge'
import type { TitleRarity } from '../types'

interface TitleSelectModalProps {
  unlockedTitles: string[]
  activeTitle: string | null
  onSelect: (id: string) => void
  onClose: () => void
}

const RARITY_COLOR: Record<TitleRarity, string> = {
  legendary: 'var(--color-gold)',
  rare: 'var(--color-purple-glow)',
  common: 'var(--color-text-sub)',
}

const RARITY_LABEL: Record<TitleRarity, string> = {
  legendary: 'LEGENDARY',
  rare: 'RARE',
  common: 'COMMON',
}

const RARITY_ACTIVE_BG: Record<TitleRarity, string> = {
  legendary: 'var(--color-gold-tint)',
  rare: 'var(--color-purple-tint)',
  common: 'rgba(42,42,58,0.4)',
}

const RARITY_ACTIVE_SHADOW: Record<TitleRarity, string> = {
  legendary: '0 0 8px var(--color-gold-glow-soft)',
  rare: '0 0 8px var(--color-purple-glow-soft)',
  common: 'none',
}

const RARITY_ORDER: Record<TitleRarity, number> = { legendary: 0, rare: 1, common: 2 }

export default function TitleSelectModal({
  unlockedTitles,
  activeTitle,
  onSelect,
  onClose,
}: TitleSelectModalProps) {
  const unlockedDefs = TITLE_DEFS
    .filter((def) => unlockedTitles.includes(def.id))
    .sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity])
  const lockedDefs = TITLE_DEFS
    .filter((def) => !unlockedTitles.includes(def.id))
    .sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity])
  const activeDef = activeTitle ? TITLE_DEFS.find((d) => d.id === activeTitle) : null

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 space-y-3"
        style={{
          background: 'var(--color-bg-card)',
          borderTop: '1px solid var(--color-purple-glow)',
          boxShadow: '0 -4px 24px rgba(122,111,255,0.12)',
        }}
      >
        <div className="flex items-center justify-between">
          <div
            className="text-[11px] font-mono tracking-[0.18em] uppercase"
            style={{ color: 'var(--color-purple-light)' }}
          >
            [ TITLE SELECT ]
          </div>
          {activeDef && (
            <div
              className="text-[10px] font-mono"
              style={{ color: 'var(--color-text-sub)' }}
            >
              현재 대표:{' '}
              <span
                style={{
                  color:
                    activeDef.rarity === 'legendary'
                      ? 'var(--color-gold)'
                      : 'var(--color-text-base)',
                }}
              >
                ★ {activeDef.label}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {unlockedDefs.length === 0 ? (
            <div
              className="text-xs font-mono py-4 text-center"
              style={{ color: 'var(--color-text-sub)' }}
            >
              보유한 칭호가 없습니다.
            </div>
          ) : (
            unlockedDefs.map((def) => {
              const isActive = activeTitle === def.id
              return (
                <div
                  key={def.id}
                  className="flex items-center gap-3 p-3 font-mono transition-colors"
                  style={{
                    border: `1px solid ${isActive ? RARITY_COLOR[def.rarity] : 'var(--color-border)'}`,
                    background: isActive ? RARITY_ACTIVE_BG[def.rarity] : 'var(--color-bg-input)',
                    boxShadow: isActive ? RARITY_ACTIVE_SHADOW[def.rarity] : 'none',
                  }}
                >
                  <span className="text-base w-6 text-center flex-shrink-0">{def.icon}</span>

                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[12px]"
                      style={{
                        color:
                          def.rarity === 'legendary'
                            ? 'var(--color-gold)'
                            : 'var(--color-text-base)',
                      }}
                    >
                      {def.label}
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
                    ) : (
                      <button
                        onClick={() => onSelect(def.id)}
                        className="t-btn-ghost"
                        style={{ padding: '2px 8px', fontSize: '10px', width: 'auto' }}
                      >
                        선택
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {lockedDefs.length > 0 && (
            <>
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <span
                  className="text-[10px] font-mono tracking-[0.14em] uppercase"
                  style={{ color: 'var(--color-text-dim)' }}
                >
                  LOCKED
                </span>
              </div>
              {lockedDefs.map((def) => (
                <TitleBadge
                  key={def.id}
                  def={def}
                  unlocked={false}
                  isActive={false}
                />
              ))}
            </>
          )}
        </div>

        <button onClick={onClose} className="t-btn-ghost w-full">
          [ ESC ] 닫기
        </button>
      </div>
    </>
  )
}
