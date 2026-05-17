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
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#12121a] border-t border-[#2a2a3a] flex">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-mono transition-colors ${
              isActive ? 'text-[#afa9ec]' : 'text-[#6b7280]'
            }`
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
