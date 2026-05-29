import { NavLink } from 'react-router-dom'

interface Tab {
  to: string
  label: string
  icon: string
}

const tabs: Tab[] = [
  { to: '/', label: '캐릭터', icon: '⚔️' },
  { to: '/daily', label: '패치노트', icon: '📋' },
  { to: '/calendar', label: '캘린더', icon: '📅' },
  { to: '/analysis', label: '분석', icon: '📊' },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-bg-card border-t border-border flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-mono transition-colors relative ${
              isActive ? 'text-purple-light' : 'text-text-sub'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 22,
                    height: 2,
                    background: 'var(--color-purple-glow)',
                    boxShadow: '0 0 10px var(--color-purple-glow)',
                  }}
                />
              )}
              <span
                className="text-lg leading-none"
                style={{ textShadow: isActive ? '0 0 8px var(--color-purple-light)' : 'none' }}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
