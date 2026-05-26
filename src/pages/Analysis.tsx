import { useState, useMemo } from 'react'
import useStore from '../store/useStore'
import { calcWeeklyReport, calcMonthlyReport, calcStatTrend, getWeekBounds, getMonthBounds } from '../lib/stats'
import { today, getWeekDateRange, addDays, shiftMonth, formatWeekLabel, formatMonthLabel } from '../lib/date'
import AnalysisTabBar from '../components/AnalysisTabBar'
import WeeklyReportCard from '../components/WeeklyReportCard'
import MonthlyReportCard from '../components/MonthlyReportCard'
import StatTrendChart, { STAT_TREND_COLORS } from '../components/StatTrendChart'
import SkillBarChart from '../components/SkillBarChart'
import PeriodNavigator from '../components/PeriodNavigator'

export default function Analysis() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly')
  const patches = useStore((s) => s.patches)
  const skills = useStore((s) => s.skills)

  const todayStr = today()

  const [weekBaseDate, setWeekBaseDate] = useState<string>(todayStr)
  const [monthBaseDate, setMonthBaseDate] = useState<string>(todayStr)

  const hasAnyRecord = Object.keys(patches).length > 0

  const weeklyReport = useMemo(
    () => calcWeeklyReport(patches, weekBaseDate),
    [patches, weekBaseDate],
  )

  const monthlyReport = useMemo(
    () => calcMonthlyReport(patches, monthBaseDate),
    [patches, monthBaseDate],
  )

  const chartData = useMemo(() => {
    const { weekStart } = getWeekBounds(weekBaseDate)
    const dateRange = getWeekDateRange(weekStart)
    return calcStatTrend(patches, dateRange)
  }, [patches, weekBaseDate])

  const { weekStart, weekEnd } = getWeekBounds(weekBaseDate)
  const { weekStart: todayWeekStart } = getWeekBounds(todayStr)
  const { monthStart } = getMonthBounds(monthBaseDate)
  const { monthStart: todayMonthStart } = getMonthBounds(todayStr)

  const isWeekNextDisabled = weekStart >= todayWeekStart
  const isMonthNextDisabled = monthStart >= todayMonthStart

  const weekLabel = formatWeekLabel(weekStart, weekEnd)
  const monthLabel = formatMonthLabel(monthStart)

  function handleWeekPrev() {
    setWeekBaseDate((prev) => addDays(prev, -7))
  }

  function handleWeekNext() {
    setWeekBaseDate((prev) => addDays(prev, 7))
  }

  function handleMonthPrev() {
    setMonthBaseDate((prev) => shiftMonth(prev, -1))
  }

  function handleMonthNext() {
    setMonthBaseDate((prev) => shiftMonth(prev, 1))
  }

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
          <PeriodNavigator
            label={weekLabel}
            prevLabel="이전 주"
            nextLabel="다음 주"
            onPrev={handleWeekPrev}
            onNext={handleWeekNext}
            isNextDisabled={isWeekNextDisabled}
          />

          <WeeklyReportCard report={weeklyReport} />

          {chartData.length > 0 && (
            <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="text-purple-light text-xs font-mono font-bold">스탯 트렌드 — {weekLabel}</div>
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
          <PeriodNavigator
            label={monthLabel}
            prevLabel="이전 달"
            nextLabel="다음 달"
            onPrev={handleMonthPrev}
            onNext={handleMonthNext}
            isNextDisabled={isMonthNextDisabled}
          />

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
