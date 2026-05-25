export interface Stats {
  hp: number
  focus: number
  social: number
  wallet: number
  outdoor: number
  sleepQ: number
}

export interface PatchEntry {
  date: string
  sleep: number
  meal: number
  cafe: number
  delivery: number
  spend: number
  emoji: string
  memo: string
  stats: Stats
  tags: string[]
}

export type PatchFormData = Omit<PatchEntry, 'date' | 'stats' | 'tags'>

export interface Character {
  name: string
  class: string
  birthYear: number
}

export interface SkillData {
  count: number
  max: number
  level: number
}

export interface Skills {
  pig: SkillData
  poor: SkillData
  cafe: SkillData
  sleep: SkillData
}

export type PatchRecord = Record<string, PatchEntry>

export type DayStat = { date: string; totalStat: number }

export interface SkillConfig {
  icon: string
  label: string
  key: keyof Skills
  max: number
  unit: string
  description: string
  condition: string
}

export type WeeklyVerdict = 'good' | 'survival' | 'struggle'

export interface WeeklyReport {
  weekStart: string
  weekEnd: string
  attendanceCount: number
  totalDays: number
  mvpStat: { key: keyof Stats; label: string; avg: number } | null
  dangerStat: { key: keyof Stats; label: string; avg: number } | null
  skillGrowth: { skillKey: keyof Skills; label: string; before: number; after: number }[]
  verdict: WeeklyVerdict
  summaryMessage: string
}

export interface MonthlyReport {
  year: number
  month: number
  attendanceCount: number
  totalDays: number
  avgSleep: number
  totalSpend: number
  bestDay: DayStat | null
  worstDay: DayStat | null
  skillSnapshot: Skills
  predictionMessage: string
}

export interface StatChartPoint {
  date: string
  hp: number
  focus: number
  social: number
  wallet: number
  outdoor: number
  sleepQ: number
}
