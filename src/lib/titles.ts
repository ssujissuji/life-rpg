import type { PatchRecord, TitleDef } from '../types'
import { SKILL_COLORS } from './skills'

export const TITLE_DEFS: TitleDef[] = [
  { id: 'pig_max',        label: '진정한 돼지왕',   icon: '🐷', description: '돼지력 만렙 달성',           rarity: 'legendary', accentColor: SKILL_COLORS.pig  },
  { id: 'poor_max',       label: '절약의 신',        icon: '🪙', description: '거지력 만렙 달성',           rarity: 'legendary', accentColor: SKILL_COLORS.poor },
  { id: 'cafe_max',       label: '카페인 마스터',    icon: '☕', description: '각성력 만렙 달성',           rarity: 'legendary', accentColor: SKILL_COLORS.cafe },
  { id: 'sleep_max',      label: '꿀잠의 전설',      icon: '🛌', description: '숙면력 만렙 달성',           rarity: 'legendary', accentColor: SKILL_COLORS.sleep },
  { id: 'survivor_30',    label: '한 달 생존자',     icon: '🗓', description: '패치노트 30일 누적',         rarity: 'rare' },
  { id: 'survivor_100',   label: '백일의 전사',      icon: '🏆', description: '패치노트 100일 누적',        rarity: 'legendary' },
  { id: 'streak_7',       label: '주간 완주자',      icon: '🔥', description: '7일 연속 기록',              rarity: 'common' },
  { id: 'zero_spend_7',   label: '이번 주 무일푼',   icon: '💀', description: '7일 연속 무지출',            rarity: 'rare' },
  { id: 'sleep_master_5', label: '숙면 연속 5일',    icon: '😴', description: '5일 연속 꿀잠달성 태그',     rarity: 'common' },
  { id: 'all_max',        label: '현생 완전정복',    icon: '👑', description: '스킬 4개 모두 만렙',         rarity: 'legendary' },
]

function dateDiffDays(a: string, b: string): number {
  return (new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) / 86400000
}

export function calcMaxStreak(patches: PatchRecord): number {
  const dates = Object.keys(patches).sort()
  if (dates.length === 0) return 0
  let max = 1, cur = 1
  for (let i = 1; i < dates.length; i++) {
    if (dateDiffDays(dates[i - 1], dates[i]) === 1) { cur++; if (cur > max) max = cur }
    else cur = 1
  }
  return max
}

export function calcMaxZeroSpendStreak(patches: PatchRecord): number {
  const dates = Object.keys(patches).sort()
  let max = 0, cur = 0
  for (let i = 0; i < dates.length; i++) {
    if (patches[dates[i]].spend === 0) {
      cur = i > 0 && dateDiffDays(dates[i - 1], dates[i]) === 1 ? cur + 1 : 1
      if (cur > max) max = cur
    } else {
      cur = 0
    }
  }
  return max
}

export function calcMaxSleepTagStreak(patches: PatchRecord): number {
  const dates = Object.keys(patches).sort()
  let max = 0, cur = 0
  for (let i = 0; i < dates.length; i++) {
    if (patches[dates[i]].tags?.includes('꿀잠달성')) {
      cur = i > 0 && dateDiffDays(dates[i - 1], dates[i]) === 1 ? cur + 1 : 1
      if (cur > max) max = cur
    } else {
      cur = 0
    }
  }
  return max
}

export function checkTitleUnlocks(patches: PatchRecord, maxedSkillKeys: string[]): string[] {
  const maxed = new Set(maxedSkillKeys)
  const patchCount = Object.keys(patches).length
  const unlocked: string[] = []

  if (maxed.has('pig'))  unlocked.push('pig_max')
  if (maxed.has('poor')) unlocked.push('poor_max')
  if (maxed.has('cafe')) unlocked.push('cafe_max')
  if (maxed.has('sleep')) unlocked.push('sleep_max')
  if (maxed.has('pig') && maxed.has('poor') && maxed.has('cafe') && maxed.has('sleep')) unlocked.push('all_max')
  if (patchCount >= 30)  unlocked.push('survivor_30')
  if (patchCount >= 100) unlocked.push('survivor_100')
  if (calcMaxStreak(patches) >= 7)           unlocked.push('streak_7')
  if (calcMaxZeroSpendStreak(patches) >= 7)  unlocked.push('zero_spend_7')
  if (calcMaxSleepTagStreak(patches) >= 5)   unlocked.push('sleep_master_5')

  return unlocked
}
