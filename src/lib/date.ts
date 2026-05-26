export function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const version = dateStr.replace(/-/g, '.')
  return `v${version} (${days[d.getDay()]})`
}

export function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getWeekDateRange(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart + 'T00:00:00')
    d.setDate(d.getDate() + i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  })
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toDateStr(d)
}

export function shiftMonth(dateStr: string, delta: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(1)
  d.setMonth(d.getMonth() + delta)
  return toDateStr(d)
}

export function formatWeekLabel(weekStart: string, weekEnd: string): string {
  const s = weekStart.slice(5).replace('-', '/')
  const e = weekEnd.slice(5).replace('-', '/')
  return `${s} ~ ${e}`
}

export function formatMonthLabel(monthStart: string): string {
  const d = new Date(monthStart + 'T00:00:00')
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`
}
