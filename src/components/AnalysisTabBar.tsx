interface AnalysisTabBarProps {
  activeTab: 'weekly' | 'monthly'
  onTabChange: (tab: 'weekly' | 'monthly') => void
}

export default function AnalysisTabBar({ activeTab, onTabChange }: AnalysisTabBarProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onTabChange('weekly')}
        className={`px-4 py-1.5 rounded text-xs font-mono transition-colors ${
          activeTab === 'weekly'
            ? 'bg-purple-primary text-white'
            : 'bg-bg-input text-text-sub hover:text-white'
        }`}
      >
        주간
      </button>
      <button
        onClick={() => onTabChange('monthly')}
        className={`px-4 py-1.5 rounded text-xs font-mono transition-colors ${
          activeTab === 'monthly'
            ? 'bg-purple-primary text-white'
            : 'bg-bg-input text-text-sub hover:text-white'
        }`}
      >
        월간
      </button>
    </div>
  )
}
