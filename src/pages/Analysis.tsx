import { useState, useMemo } from 'react'
import useStore from '../store/useStore'
import { calcWeeklyReport, calcMonthlyReport, calcStatTrend, getWeekBounds } from '../lib/stats'
import { today, getWeekDateRange } from '../lib/date'
import AnalysisTabBar from '../components/AnalysisTabBar'
import WeeklyReportCard from '../components/WeeklyReportCard'
import MonthlyReportCard from '../components/MonthlyReportCard'
import StatTrendChart, { STAT_TREND_COLORS } from '../components/StatTrendChart'
import SkillBarChart from '../components/SkillBarChart'

export default function Analysis() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly')
  const patches = useStore((s) => s.patches)
  const skills = useStore((s) => s.skills)

  const todayStr = today()

  const hasAnyRecord = Object.keys(patches).length > 0

  const weeklyReport = useMemo(
    () => calcWeeklyReport(patches, todayStr),
    [patches, todayStr],
  )

  const monthlyReport = useMemo(
    () => calcMonthlyReport(patches, todayStr),
    [patches, todayStr],
  )

  const chartData = useMemo(() => {
    const { weekStart } = getWeekBounds(todayStr)
    const dateRange = getWeekDateRange(weekStart)
    return calcStatTrend(patches, dateRange)
  }, [patches, todayStr])

  if (!hasAnyRecord) {
    return (
      <div className="px-4 pt-6 pb-28 space-y-4">
        <div className="text-white font-mono font-bold text-xl">분석</div>
        <div className="bg-bg-card border border-border rounded-lg p-6 text-center space-y-3">
          <div className="text-3xl">📊</div>
          <div className="text-purple-light text-sm font-mono font-bold">아직 기록이 없어요</div>
          <div className="text-text-sub text-xs font-mono leading-relaxed">
            패치노트를 꾸준히 쌓으면<br />주간/월간 리포트가 잠금해제됩니다.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-28 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-white font-mono font-bold text-xl">분석</div>
        <AnalysisTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === 'weekly' && (
        <div className="space-y-3">
          <WeeklyReportCard report={weeklyReport} />

          {chartData.length > 0 && (
            <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="text-purple-light text-xs font-mono font-bold">이번 주 스탯 트렌드</div>
              <div className="flex gap-3 text-[10px] font-mono text-text-sub">
                <span><span style={{ color: STAT_TREND_COLORS.hp }}>━</span> 체력</span>
                <span><span style={{ color: STAT_TREND_COLORS.focus }}>━</span> 집중력</span>
                <span><span style={{ color: STAT_TREND_COLORS.wallet }}>━</span> 지갑</span>
              </div>
              <StatTrendChart data={chartData} />
            </div>
          )}

          <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="text-purple-light text-xs font-mono font-bold">스킬 레벨</div>
            <SkillBarChart skills={skills} />
          </div>
        </div>
      )}

      {activeTab === 'monthly' && (
        <div className="space-y-3">
          <MonthlyReportCard report={monthlyReport} />

          <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="text-purple-light text-xs font-mono font-bold">스킬 레벨</div>
            <SkillBarChart skills={monthlyReport.skillSnapshot} />
          </div>
        </div>
      )}
    </div>
  )
}
