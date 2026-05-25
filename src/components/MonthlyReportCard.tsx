import type { MonthlyReport } from '../types'
import { formatSpend } from '../lib/stats'

interface MonthlyReportCardProps {
  report: MonthlyReport
}

function formatDateShort(dateStr: string): string {
  const mm = dateStr.slice(5, 7)
  const dd = dateStr.slice(8, 10)
  return `${mm}/${dd}`
}

export default function MonthlyReportCard({ report }: MonthlyReportCardProps) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="text-purple-light font-mono font-bold text-xs">
        {report.year}년 {report.month}월
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-xs font-mono">
        <span className="text-text-sub">출석</span>
        <span>
          <span className="text-success font-bold">{report.attendanceCount}일</span>
          <span className="text-text-sub"> / {report.totalDays}일</span>
        </span>

        <span className="text-text-sub">평균 수면</span>
        <span className="text-purple-light font-bold">{report.avgSleep}h</span>

        <span className="text-text-sub">총 지출</span>
        <span className="text-danger font-bold">{formatSpend(report.totalSpend)}</span>

        {report.bestDay !== null && (
          <>
            <span className="text-text-sub">🏆 최고의 날</span>
            <span className="text-white font-bold">{formatDateShort(report.bestDay.date)}</span>
          </>
        )}

        {report.worstDay !== null && (
          <>
            <span className="text-text-sub">💀 최악의 날</span>
            <span className="text-white font-bold">{formatDateShort(report.worstDay.date)}</span>
          </>
        )}
      </div>

      <div className="border-t border-border pt-3 text-xs font-mono text-text-sub italic">
        {report.predictionMessage}
      </div>
    </div>
  )
}
