import type { WeeklyReport } from '../types'

interface WeeklyReportCardProps {
  report: WeeklyReport
}

const VERDICT_CONFIG = {
  good: { icon: '🟢', label: '생존 성공', message: '이번 주도 살아냈다. 수고했어.', colorClass: 'text-success' },
  survival: { icon: '🟡', label: '생존', message: '힘들었지만 버텼다. 잘했어.', colorClass: 'text-warning' },
  struggle: { icon: '🔴', label: '고난의 주', message: '다음 주엔 좀 더 잘해보자.', colorClass: 'text-danger' },
}

function formatDateLabel(dateStr: string): string {
  const mm = dateStr.slice(5, 7)
  const dd = dateStr.slice(8, 10)
  return `${mm}/${dd}`
}

export default function WeeklyReportCard({ report }: WeeklyReportCardProps) {
  const verdict = VERDICT_CONFIG[report.verdict]

  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="text-purple-light font-mono font-bold text-xs">
        {formatDateLabel(report.weekStart)} ~ {formatDateLabel(report.weekEnd)}
      </div>

      <div className="text-text-base font-mono text-[13px]">{report.summaryMessage}</div>

      <div className="space-y-1.5 text-xs font-mono text-text-base">
        <div>✅ 출석: {report.attendanceCount}/7일 기록</div>

        {report.mvpStat !== null && (
          <div>
            🏆 MVP 스탯: {report.mvpStat.label}{' '}
            <span className="text-success">{report.mvpStat.avg}</span>
          </div>
        )}

        {report.dangerStat !== null && (
          <div>
            ⚠️ 위험 스탯: {report.dangerStat.label}{' '}
            <span className="text-danger">{report.dangerStat.avg}</span>
          </div>
        )}

        {report.skillGrowth.length > 0 && (
          <div className="space-y-0.5">
            {report.skillGrowth.map((g) => (
              <div key={g.skillKey}>
                🎉 스킬 성장: {g.label}{' '}
                <span className="text-text-sub">Lv.{g.before}</span>
                {' → '}
                <span className="text-purple-light">Lv.{g.after}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3 flex items-center gap-2 text-xs font-mono">
        <span className={`font-bold ${verdict.colorClass}`}>{verdict.icon} {verdict.label}</span>
        <span className="text-text-sub">— "{verdict.message}"</span>
      </div>
    </div>
  )
}
