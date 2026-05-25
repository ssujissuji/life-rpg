import type { PatchFormData, Stats, Skills, PatchRecord } from '../types'

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
  if (spend > 0 && spend < 10000) wallet -= 10
  else if (spend < 30000) wallet -= 20
  else if (spend < 50000) wallet -= 45
  else if (spend < 100000) wallet -= 60
  else if (spend >= 100000) wallet -= 80
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
  const isWeekend = day === 0 || day === 6

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
  if (!amount || amount === 0) return '0원'
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
