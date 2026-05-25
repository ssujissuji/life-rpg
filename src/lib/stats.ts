import type { PatchFormData, Stats, Skills, PatchRecord, WeeklyReport, WeeklyVerdict, MonthlyReport, StatChartPoint, DayStat } from '../types'
import { isHoliday } from './holidays'

export function calcHP(sleep: number, meal: number, isWeekend: boolean): number {
  let hp = 100
  if (sleep < 5) hp -= 30
  else if (sleep < 6) hp -= 20
  else if (sleep < 7) hp -= 10
  if (meal === 0) hp -= 15
  if (isWeekend) hp += 15
  return Math.max(0, Math.min(100, hp))
}

export function calcFocus(sleep: number, cafeCount: number, isMonday: boolean): number {
  let focus = 100
  if (sleep < 5) focus -= 35
  else if (sleep < 7) focus -= 20
  if (cafeCount >= 2) focus += 10
  if (isMonday) focus -= 10
  return Math.max(0, Math.min(100, focus))
}

export function calcSocial(meal: number, isWeekend: boolean): number {
  let social = 70
  if (meal >= 2) social += 10
  if (isWeekend) social += 10
  return Math.max(0, Math.min(100, social))
}

export function calcWallet(spend: number, cafeCount: number, deliveryCount: number): number {
  let wallet = 100
  if (spend <= 0) wallet -= 0
  else if (spend < 10000) wallet -= 10
  else if (spend < 30000) wallet -= 20
  else if (spend < 50000) wallet -= 45
  else if (spend < 100000) wallet -= 60
  else wallet -= 80
  wallet -= cafeCount * 8
  wallet -= deliveryCount * 10
  return Math.max(0, Math.min(100, wallet))
}

export function calcOutdoor(deliveryCount: number, cafeCount: number): number {
  let outdoor = 70
  if (deliveryCount >= 1) outdoor -= 15
  if (cafeCount >= 1) outdoor += 10
  return Math.max(0, Math.min(100, outdoor))
}

export function calcSleepQ(sleep: number): number {
  if (sleep >= 8) return Math.min(100, 60 + (sleep - 8) * 10)
  if (sleep >= 7) return 55
  if (sleep >= 6) return 40
  if (sleep >= 5) return 25
  return 10
}

interface StatusTagsParams {
  sleep: number
  cafeCount: number
  spend: number
  deliveryCount: number
  isMonday: boolean
  isWeekend: boolean
}

export function getStatusTags({
  sleep,
  cafeCount,
  spend,
  deliveryCount,
  isMonday,
  isWeekend,
}: StatusTagsParams): string[] {
  const tags: string[] = []
  if (isMonday) tags.push('월요병')
  if (sleep < 6) tags.push('수면부족')
  if (cafeCount >= 2) tags.push('커피버프')
  if (spend >= 30000) tags.push('통장출혈')
  if (deliveryCount >= 1) tags.push('배달의민족')
  if (sleep >= 8) tags.push('꿀잠달성')
  if (spend === 0 && cafeCount === 0) tags.push('무지출')
  if (isWeekend) tags.push('주말달성')
  return tags
}

export function calcStats(entry: PatchFormData & { date: string }): Stats {
  const date = new Date(entry.date)
  const day = date.getDay()
  const isMonday = day === 1
  const isWeekend = day === 0 || day === 6 || isHoliday(entry.date)

  return {
    hp: calcHP(entry.sleep, entry.meal, isWeekend),
    focus: calcFocus(entry.sleep, entry.cafe, isMonday),
    social: calcSocial(entry.meal, isWeekend),
    wallet: calcWallet(entry.spend, entry.cafe, entry.delivery),
    outdoor: calcOutdoor(entry.delivery, entry.cafe),
    sleepQ: calcSleepQ(entry.sleep),
  }
}

export function formatSpend(amount: number): string {
  if (amount <= 0) return '0원'
  const man = Math.floor(amount / 10000)
  const rest = amount % 10000
  const chun = Math.floor(rest / 1000)
  if (man > 0 && chun > 0) return `${man}만 ${chun}천원`
  if (man > 0) return `${man}만원`
  return `${chun}천원`
}

export function calcSkills(allEntries: PatchRecord): Skills {
  const entries = Object.values(allEntries)

  const pigCount = entries.reduce((acc, e) => acc + (e.cafe || 0) + (e.delivery || 0), 0)
  const poorCount = entries.filter((e) => e.spend === 0 && e.cafe === 0).length
  const cafeCount = entries.reduce((acc, e) => acc + (e.cafe || 0), 0)
  const sleepCount = entries.filter((e) => e.sleep >= 8).length

  return {
    pig: { count: pigCount, max: 50, level: Math.min(Math.floor((pigCount / 50) * 10), 10) },
    poor: { count: poorCount, max: 30, level: Math.min(Math.floor((poorCount / 30) * 10), 10) },
    cafe: { count: cafeCount, max: 100, level: Math.min(Math.floor((cafeCount / 100) * 10), 10) },
    sleep: { count: sleepCount, max: 30, level: Math.min(Math.floor((sleepCount / 30) * 10), 10) },
  }
}

const STAT_LABELS: Record<keyof Stats, string> = {
  hp: '체력',
  focus: '집중력',
  social: '사회성',
  wallet: '지갑',
  outdoor: '외출의지',
  sleepQ: '수면질',
}

const SKILL_LABELS: Record<keyof Skills, string> = {
  pig: '돼지력',
  poor: '거지력',
  cafe: '각성력',
  sleep: '숙면력',
}

function dateToStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getWeekBounds(today: string): { weekStart: string; weekEnd: string } {
  const d = new Date(today + 'T00:00:00')
  const day = d.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diffToMonday)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { weekStart: dateToStr(monday), weekEnd: dateToStr(sunday) }
}

export function getMonthBounds(today: string): { monthStart: string; monthEnd: string } {
  const d = new Date(today + 'T00:00:00')
  const year = d.getFullYear()
  const month = d.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  return { monthStart: dateToStr(firstDay), monthEnd: dateToStr(lastDay) }
}

function filterEntriesByRange(patches: PatchRecord, from: string, to: string): PatchRecord {
  const result: PatchRecord = {}
  for (const [date, entry] of Object.entries(patches)) {
    if (date >= from && date <= to) {
      result[date] = entry
    }
  }
  return result
}

function filterEntriesBefore(patches: PatchRecord, before: string): PatchRecord {
  const result: PatchRecord = {}
  for (const [date, entry] of Object.entries(patches)) {
    if (date < before) {
      result[date] = entry
    }
  }
  return result
}

function topTagByFrequency(entries: PatchRecord): { tag: string; count: number } | null {
  const freq: Record<string, number> = {}
  for (const entry of Object.values(entries)) {
    for (const tag of entry.tags) {
      freq[tag] = (freq[tag] ?? 0) + 1
    }
  }
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
  if (sorted.length === 0) return null
  return { tag: sorted[0][0], count: sorted[0][1] }
}

export function calcWeeklyReport(patches: PatchRecord, today: string): WeeklyReport {
  const { weekStart, weekEnd } = getWeekBounds(today)
  const weekEntries = filterEntriesByRange(patches, weekStart, weekEnd)
  const weekValues = Object.values(weekEntries)
  const attendanceCount = weekValues.length
  const totalDays = 7

  if (attendanceCount === 0) {
    return {
      weekStart,
      weekEnd,
      attendanceCount: 0,
      totalDays,
      mvpStat: null,
      dangerStat: null,
      skillGrowth: [],
      verdict: 'struggle',
      summaryMessage: '이번 주 기록이 없다.',
    }
  }

  const statKeys: (keyof Stats)[] = ['hp', 'focus', 'social', 'wallet', 'outdoor', 'sleepQ']
  const statAvgs = statKeys.map((key) => ({
    key,
    label: STAT_LABELS[key],
    avg: Math.round(weekValues.reduce((sum, e) => sum + (e.stats?.[key] ?? 0), 0) / attendanceCount),
  }))

  const sorted = [...statAvgs].sort((a, b) => b.avg - a.avg)
  const mvpStat = sorted[0]
  const lastStat = sorted[sorted.length - 1]
  const finalDangerStat = lastStat.key === mvpStat.key ? null : lastStat

  const beforeEntries = filterEntriesBefore(patches, weekStart)
  const skillsBefore = calcSkills(beforeEntries)
  const skillsAfter = calcSkills({ ...beforeEntries, ...weekEntries })
  const skillKeys: (keyof Skills)[] = ['pig', 'poor', 'cafe', 'sleep']
  const skillGrowth = skillKeys
    .filter((k) => skillsAfter[k].level > skillsBefore[k].level)
    .map((k) => ({
      skillKey: k,
      label: SKILL_LABELS[k],
      before: skillsBefore[k].level,
      after: skillsAfter[k].level,
    }))

  const topTag = topTagByFrequency(weekEntries)
  let summaryMessage = '이번 주도 잘 살아냈다!'
  if (topTag) {
    const { tag, count: n } = topTag
    if (tag === '수면부족') summaryMessage = `이번 주 너는 수면부족 상태로 ${n}일을 버텼다.`
    else if (tag === '통장출혈') summaryMessage = `이번 주 지갑이 많이 힘들었다. ${n}일이나 통장출혈이었어.`
    else if (tag === '무지출') summaryMessage = `이번 주는 절약의 왕! ${n}일이나 무지출이었다.`
    else if (tag === '꿀잠달성') summaryMessage = `이번 주 수면 상태 최고. ${n}일이나 꿀잠달성!`
    else if (tag === '월요병') summaryMessage = '월요병으로 시작했지만 어떻게든 버텼다.'
  }

  const avgHP = statAvgs.find((s) => s.key === 'hp')?.avg ?? 0
  let verdict: WeeklyVerdict = 'struggle'
  if (attendanceCount >= 5 && avgHP >= 70) verdict = 'good'
  else if (attendanceCount >= 3 && avgHP >= 40) verdict = 'survival'

  return {
    weekStart,
    weekEnd,
    attendanceCount,
    totalDays,
    mvpStat,
    dangerStat: finalDangerStat,
    skillGrowth,
    verdict,
    summaryMessage,
  }
}

export function calcMonthlyReport(patches: PatchRecord, today: string): MonthlyReport {
  const { monthStart, monthEnd } = getMonthBounds(today)
  const d = new Date(today + 'T00:00:00')
  const year = d.getFullYear()
  const month = d.getMonth() + 1

  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  const totalDays = lastDay.getDate()

  const monthEntries = filterEntriesByRange(patches, monthStart, monthEnd)
  const monthValues = Object.values(monthEntries)
  const attendanceCount = monthValues.length

  if (attendanceCount === 0) {
    return {
      year,
      month,
      attendanceCount: 0,
      totalDays,
      avgSleep: 0,
      totalSpend: 0,
      bestDay: null,
      worstDay: null,
      skillSnapshot: calcSkills(patches),
      predictionMessage: '다음 달도 현생 파이팅!',
    }
  }

  const avgSleep =
    Math.round((monthValues.reduce((sum, e) => sum + e.sleep, 0) / attendanceCount) * 10) / 10
  const totalSpend = monthValues.reduce((sum, e) => sum + e.spend, 0)

  const dayStats: DayStat[] = Object.entries(monthEntries)
    .map(([date, entry]) => ({
      date,
      totalStat: Object.values(entry.stats).reduce((sum, v) => sum + v, 0),
    }))

  const bestDay = dayStats.reduce((best, cur) => (cur.totalStat > best.totalStat ? cur : best), dayStats[0])
  const worstDay = dayStats.reduce((worst, cur) => (cur.totalStat < worst.totalStat ? cur : worst), dayStats[0])

  const topTag = topTagByFrequency(monthEntries)
  let predictionMessage = '다음 달도 현생 파이팅!'
  if (topTag) {
    const { tag } = topTag
    if (tag === '수면부족') predictionMessage = '다음 달엔 좀 더 자봐요.'
    else if (tag === '통장출혈') predictionMessage = '다음 달 지갑이 걱정됩니다.'
    else if (tag === '무지출') predictionMessage = '다음 달도 절약 기대해봐요!'
    else if (tag === '꿀잠달성') predictionMessage = '다음 달도 꿀잠 유지해봐요!'
  }

  return {
    year,
    month,
    attendanceCount,
    totalDays,
    avgSleep,
    totalSpend,
    bestDay,
    worstDay,
    skillSnapshot: calcSkills(patches),
    predictionMessage,
  }
}

export function calcStatTrend(patches: PatchRecord, dateRange: string[]): StatChartPoint[] {
  return dateRange
    .filter((date) => patches[date] !== undefined)
    .map((date) => {
      const entry = patches[date]
      const mm = date.slice(5, 7)
      const dd = date.slice(8, 10)
      return {
        date: `${mm}/${dd}`,
        hp: entry.stats.hp,
        focus: entry.stats.focus,
        social: entry.stats.social,
        wallet: entry.stats.wallet,
        outdoor: entry.stats.outdoor,
        sleepQ: entry.stats.sleepQ,
      }
    })
}
