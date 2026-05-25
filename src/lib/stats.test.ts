import { describe, it, expect } from 'vitest'
import {
  calcHP,
  calcFocus,
  calcSocial,
  calcWallet,
  calcOutdoor,
  calcSleepQ,
  getStatusTags,
  formatSpend,
  calcStats,
} from './stats'

// ─── calcHP ───────────────────────────────────────────────────────────────────

describe('calcHP', () => {
  it('기본값(sleep=7, meal=2, 평일)은 100이다', () => {
    expect(calcHP(7, 2, false)).toBe(100)
  })

  it('sleep < 5 이면 hp가 30 감소한다', () => {
    expect(calcHP(4, 2, false)).toBe(70)
  })

  it('sleep < 6 이면 hp가 20 감소한다', () => {
    expect(calcHP(5, 2, false)).toBe(80)
  })

  it('sleep < 7 이면 hp가 10 감소한다', () => {
    expect(calcHP(6, 2, false)).toBe(90)
  })

  it('meal === 0 이면 hp가 15 감소한다', () => {
    expect(calcHP(7, 0, false)).toBe(85)
  })

  it('isWeekend 이면 hp가 15 증가한다', () => {
    expect(calcHP(7, 2, true)).toBe(100) // 100 + 15 → clamp 100
  })

  it('isWeekend 이고 sleep 7 미만일 때 hp에 +15가 반영된다', () => {
    // sleep=6 → -10, isWeekend → +15 = 105 → clamp 100
    expect(calcHP(6, 2, true)).toBe(100)
    // sleep=5 → -20, isWeekend → +15 = 95
    expect(calcHP(5, 2, true)).toBe(95)
  })

  it('sleep < 5 이고 meal === 0 이면 hp = 55', () => {
    expect(calcHP(4, 0, false)).toBe(55)
  })

  it('결과는 항상 0 이상이다', () => {
    expect(calcHP(0, 0, false)).toBeGreaterThanOrEqual(0)
  })

  it('결과는 항상 100 이하이다', () => {
    expect(calcHP(12, 3, true)).toBeLessThanOrEqual(100)
  })
})

// ─── calcFocus ────────────────────────────────────────────────────────────────

describe('calcFocus', () => {
  it('기본값(sleep=7, cafe=0, 월요일 아님)은 100이다', () => {
    expect(calcFocus(7, 0, false)).toBe(100)
  })

  it('sleep < 5 이면 focus가 35 감소한다', () => {
    expect(calcFocus(4, 0, false)).toBe(65)
  })

  it('sleep 5 이상 7 미만이면 focus가 20 감소한다', () => {
    expect(calcFocus(5, 0, false)).toBe(80)
    expect(calcFocus(6.5, 0, false)).toBe(80)
  })

  it('cafeCount >= 2 이면 focus가 10 증가한다', () => {
    expect(calcFocus(7, 2, false)).toBe(100) // 100 + 10 → clamp 100
    expect(calcFocus(5, 2, false)).toBe(90)  // 80 + 10
  })

  it('isMonday 이면 focus가 10 감소한다', () => {
    expect(calcFocus(7, 0, true)).toBe(90)
  })

  it('결과는 항상 0~100 사이다', () => {
    const val = calcFocus(0, 0, true)
    expect(val).toBeGreaterThanOrEqual(0)
    expect(val).toBeLessThanOrEqual(100)
  })
})

// ─── calcSocial ───────────────────────────────────────────────────────────────

describe('calcSocial', () => {
  it('기본값(meal=2, 평일)은 80이다', () => {
    expect(calcSocial(2, false)).toBe(80)
  })

  it('meal < 2 이면 social이 70이다', () => {
    expect(calcSocial(1, false)).toBe(70)
    expect(calcSocial(0, false)).toBe(70)
  })

  it('isWeekend 이면 social이 10 증가한다', () => {
    expect(calcSocial(1, true)).toBe(80)
    expect(calcSocial(2, true)).toBe(90)
  })

  it('결과는 항상 0~100 사이다', () => {
    const val = calcSocial(5, true)
    expect(val).toBeGreaterThanOrEqual(0)
    expect(val).toBeLessThanOrEqual(100)
  })
})

// ─── calcWallet ───────────────────────────────────────────────────────────────

describe('calcWallet', () => {
  it('spend=0이면 spend 패널티 없이 wallet이 100이다', () => {
    expect(calcWallet(0, 0, 0)).toBe(100)
  })

  it('spend 1 이상 10000 미만이면 wallet이 10 감소한다', () => {
    expect(calcWallet(5000, 0, 0)).toBe(90)
  })

  it('spend 10000 이상 30000 미만이면 wallet이 20 감소한다', () => {
    expect(calcWallet(10000, 0, 0)).toBe(80)
    expect(calcWallet(15000, 0, 0)).toBe(80)
  })

  it('spend 30000 이상 50000 미만이면 wallet이 45 감소한다', () => {
    expect(calcWallet(30000, 0, 0)).toBe(55)
  })

  it('spend 50000 이상 100000 미만이면 wallet이 60 감소한다', () => {
    expect(calcWallet(50000, 0, 0)).toBe(40)
  })

  it('spend >= 100000 이면 wallet이 80 감소한다', () => {
    expect(calcWallet(100000, 0, 0)).toBe(20)
    expect(calcWallet(200000, 0, 0)).toBe(20)
  })

  it('spend > 0 일 때 cafeCount 1회당 wallet이 8 감소한다', () => {
    // spend=5000(-10) + cafe=1(-8) → 82
    expect(calcWallet(5000, 1, 0)).toBe(82)
    // spend=5000(-10) + cafe=2(-16) → 74
    expect(calcWallet(5000, 2, 0)).toBe(74)
  })

  it('spend > 0 일 때 deliveryCount 1회당 wallet이 10 감소한다', () => {
    // spend=5000(-10) + delivery=1(-10) → 80
    expect(calcWallet(5000, 0, 1)).toBe(80)
    // spend=5000(-10) + delivery=2(-20) → 70
    expect(calcWallet(5000, 0, 2)).toBe(70)
  })

  it('결과는 항상 0 이상이다 (spend 과다 + cafe + delivery 복합)', () => {
    expect(calcWallet(100000, 10, 10)).toBeGreaterThanOrEqual(0)
  })

  it('결과는 항상 100 이하이다', () => {
    expect(calcWallet(0, 0, 0)).toBeLessThanOrEqual(100)
  })
})

// ─── calcOutdoor ──────────────────────────────────────────────────────────────

describe('calcOutdoor', () => {
  it('기본값(delivery=0, cafe=0)은 70이다', () => {
    expect(calcOutdoor(0, 0)).toBe(70)
  })

  it('delivery >= 1 이면 outdoor가 15 감소한다', () => {
    expect(calcOutdoor(1, 0)).toBe(55)
    expect(calcOutdoor(3, 0)).toBe(55)
  })

  it('cafe >= 1 이면 outdoor가 10 증가한다', () => {
    expect(calcOutdoor(0, 1)).toBe(80)
  })

  it('delivery와 cafe 동시에 있으면 -15+10 = -5가 반영된다', () => {
    expect(calcOutdoor(1, 1)).toBe(65)
  })

  it('결과는 항상 0~100 사이다', () => {
    const val = calcOutdoor(10, 10)
    expect(val).toBeGreaterThanOrEqual(0)
    expect(val).toBeLessThanOrEqual(100)
  })
})

// ─── calcSleepQ ───────────────────────────────────────────────────────────────

describe('calcSleepQ', () => {
  it('sleep >= 8 이면 sleepQ가 60 이상이다', () => {
    expect(calcSleepQ(8)).toBeGreaterThanOrEqual(60)
  })

  it('sleep=8 이면 sleepQ=60이다', () => {
    expect(calcSleepQ(8)).toBe(60)
  })

  it('sleep=9 이면 sleepQ=70이다', () => {
    expect(calcSleepQ(9)).toBe(70)
  })

  it('sleep=7 이상 8 미만이면 sleepQ=55이다', () => {
    expect(calcSleepQ(7)).toBe(55)
    expect(calcSleepQ(7.5)).toBe(55)
  })

  it('sleep=6 이상 7 미만이면 sleepQ=40이다', () => {
    expect(calcSleepQ(6)).toBe(40)
  })

  it('sleep=5 이상 6 미만이면 sleepQ=25이다', () => {
    expect(calcSleepQ(5)).toBe(25)
  })

  it('sleep < 5 이면 sleepQ=10이다', () => {
    expect(calcSleepQ(4)).toBe(10)
    expect(calcSleepQ(0)).toBe(10)
  })

  it('결과는 항상 100 이하이다 (과도한 수면)', () => {
    expect(calcSleepQ(20)).toBeLessThanOrEqual(100)
  })
})

// ─── getStatusTags ────────────────────────────────────────────────────────────

describe('getStatusTags', () => {
  // spend=0, cafeCount=0 이면 "무지출" 태그가 붙으므로 base는 spend=1로 설정
  const base = { sleep: 7, cafeCount: 0, spend: 1, deliveryCount: 0, isMonday: false, isWeekend: false }

  it('어떤 특수 조건도 없으면 빈 배열을 반환한다 (spend=1로 무지출 제외)', () => {
    expect(getStatusTags(base)).toEqual([])
  })

  it('isMonday=true 이면 "월요병" 태그가 생성된다', () => {
    expect(getStatusTags({ ...base, isMonday: true })).toContain('월요병')
  })

  it('sleep < 6 이면 "수면부족" 태그가 생성된다', () => {
    expect(getStatusTags({ ...base, sleep: 5 })).toContain('수면부족')
    expect(getStatusTags({ ...base, sleep: 5.9 })).toContain('수면부족')
  })

  it('sleep = 6 이면 "수면부족" 태그가 생성되지 않는다', () => {
    expect(getStatusTags({ ...base, sleep: 6 })).not.toContain('수면부족')
  })

  it('cafeCount >= 2 이면 "커피버프" 태그가 생성된다', () => {
    expect(getStatusTags({ ...base, cafeCount: 2 })).toContain('커피버프')
    expect(getStatusTags({ ...base, cafeCount: 3 })).toContain('커피버프')
  })

  it('cafeCount = 1 이면 "커피버프" 태그가 생성되지 않는다', () => {
    expect(getStatusTags({ ...base, cafeCount: 1 })).not.toContain('커피버프')
  })

  it('spend >= 30000 이면 "통장출혈" 태그가 생성된다', () => {
    expect(getStatusTags({ ...base, spend: 30000 })).toContain('통장출혈')
  })

  it('delivery >= 1 이면 "배달의민족" 태그가 생성된다', () => {
    expect(getStatusTags({ ...base, deliveryCount: 1 })).toContain('배달의민족')
  })

  it('sleep >= 8 이면 "꿀잠달성" 태그가 생성된다', () => {
    expect(getStatusTags({ ...base, sleep: 8 })).toContain('꿀잠달성')
    expect(getStatusTags({ ...base, sleep: 9 })).toContain('꿀잠달성')
  })

  it('sleep < 8 이면 "꿀잠달성" 태그가 생성되지 않는다', () => {
    expect(getStatusTags({ ...base, sleep: 7.9 })).not.toContain('꿀잠달성')
  })

  it('spend === 0 && cafeCount === 0 이면 "무지출" 태그가 생성된다', () => {
    expect(getStatusTags({ ...base, spend: 0, cafeCount: 0 })).toContain('무지출')
  })

  it('spend > 0 이면 "무지출" 태그가 생성되지 않는다', () => {
    expect(getStatusTags({ ...base, spend: 1 })).not.toContain('무지출')
  })

  it('isWeekend=true 이면 "주말달성" 태그가 생성된다', () => {
    expect(getStatusTags({ ...base, isWeekend: true })).toContain('주말달성')
  })
})

// ─── formatSpend (WARN-1) ─────────────────────────────────────────────────────

describe('formatSpend', () => {
  it('0 → "0원"', () => {
    expect(formatSpend(0)).toBe('0원')
  })

  it('음수 → "0원" (음수 방어)', () => {
    expect(formatSpend(-100)).toBe('0원')
    expect(formatSpend(-1)).toBe('0원')
  })

  it('5000 → "5천원"', () => {
    expect(formatSpend(5000)).toBe('5천원')
  })

  it('1000 → "1천원"', () => {
    expect(formatSpend(1000)).toBe('1천원')
  })

  it('10000 → "1만원"', () => {
    expect(formatSpend(10000)).toBe('1만원')
  })

  it('15000 → "1만 5천원"', () => {
    expect(formatSpend(15000)).toBe('1만 5천원')
  })

  it('20000 → "2만원"', () => {
    expect(formatSpend(20000)).toBe('2만원')
  })

  it('100000 → "10만원"', () => {
    expect(formatSpend(100000)).toBe('10만원')
  })
})

// ─── calcStats (날짜 기반 요일 판단 통합) ────────────────────────────────────

describe('calcStats', () => {
  it('2026-05-25 (월요일) 기준으로 isMonday 가 적용된다', () => {
    // 2026-05-25는 월요일
    const entry = { date: '2026-05-25', sleep: 7, meal: 2, cafe: 0, delivery: 0, spend: 0, emoji: '😊', memo: '' }
    const stats = calcStats(entry)
    // 월요일이면 focus -10 → 90
    expect(stats.focus).toBe(90)
  })

  it('2026-05-24 (일요일) 기준으로 isWeekend 가 적용된다', () => {
    // 2026-05-24는 일요일
    const entry = { date: '2026-05-24', sleep: 7, meal: 2, cafe: 0, delivery: 0, spend: 0, emoji: '😊', memo: '' }
    const stats = calcStats(entry)
    // isWeekend 이면 hp 100+15 → 100(clamp), social 80+10 → 90
    expect(stats.hp).toBe(100)
    expect(stats.social).toBe(90)
  })

  it('모든 stats 값이 0~100 사이다', () => {
    const entry = { date: '2026-05-25', sleep: 0, meal: 0, cafe: 10, delivery: 10, spend: 999999, emoji: '💀', memo: '' }
    const stats = calcStats(entry)
    for (const val of Object.values(stats)) {
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThanOrEqual(100)
    }
  })
})

// ─── calcStats — 공휴일 통합 ──────────────────────────────────────────────────

describe('calcStats — 공휴일 통합', () => {
  it('2026-05-25 (부처님오신날 대체공휴일, 월요일)은 isWeekend=true로 HP +15 적용된다', () => {
    // 2026-05-25는 월요일이지만 대체공휴일 → isWeekend=true
    // sleep=7, meal=2, 평일 기준 hp=100, isWeekend=true → 100+15 → clamp 100
    const entry = { date: '2026-05-25', sleep: 7, meal: 2, cafe: 0, delivery: 0, spend: 0, emoji: '😊', memo: '' }
    const stats = calcStats(entry)
    expect(stats.hp).toBe(100)
  })

  it('2026-05-25 (부처님오신날 대체공휴일)은 isWeekend=true로 social +10 적용된다', () => {
    // isWeekend=true → social = 70(base) + 10(meal>=2) + 10(isWeekend) = 90
    const entry = { date: '2026-05-25', sleep: 7, meal: 2, cafe: 0, delivery: 0, spend: 0, emoji: '😊', memo: '' }
    const stats = calcStats(entry)
    expect(stats.social).toBe(90)
  })

  it('2026-05-25는 월요일(day=1)이므로 isMonday=true → focus에 월요병(-10) 적용된다', () => {
    // 공휴일 여부는 isMonday 판단에 영향 없음 — 요일(day===1)만으로 판단
    // sleep=7, isMonday=true → focus = 100 - 10 = 90
    const entry = { date: '2026-05-25', sleep: 7, meal: 2, cafe: 0, delivery: 0, spend: 0, emoji: '😊', memo: '' }
    const stats = calcStats(entry)
    expect(stats.focus).toBe(90)
  })

  it('2025-10-08 (추석 대체공휴일, 수요일)은 isWeekend=true로 HP +15 적용된다', () => {
    // 2025-10-08은 수요일이지만 공휴일 → isWeekend=true
    // sleep=7, meal=2 → hp = 100 + 15 → clamp 100
    const entry = { date: '2025-10-08', sleep: 7, meal: 2, cafe: 0, delivery: 0, spend: 0, emoji: '😊', memo: '' }
    const stats = calcStats(entry)
    expect(stats.hp).toBe(100)
  })

  it('2025-10-08 (추석 대체공휴일, 수요일)은 isWeekend=true로 social +10 적용된다', () => {
    // social = 70 + 10(meal>=2) + 10(isWeekend) = 90
    const entry = { date: '2025-10-08', sleep: 7, meal: 2, cafe: 0, delivery: 0, spend: 0, emoji: '😊', memo: '' }
    const stats = calcStats(entry)
    expect(stats.social).toBe(90)
  })

  it('2025-10-08 (수요일, 공휴일)은 isMonday=false → focus에 월요병 미적용', () => {
    // 수요일(day=3)이면 isMonday=false → 월요병 없음
    // sleep=7, isMonday=false → focus = 100
    const entry = { date: '2025-10-08', sleep: 7, meal: 2, cafe: 0, delivery: 0, spend: 0, emoji: '😊', memo: '' }
    const stats = calcStats(entry)
    expect(stats.focus).toBe(100)
  })

  it('공휴일(isWeekend=true)인 날 수면 부족 시 isWeekend 보정이 적용된다', () => {
    // 2026-05-25, sleep=5(→ hp -20), isWeekend=true(+15) → hp = 100 - 20 + 15 = 95
    const entry = { date: '2026-05-25', sleep: 5, meal: 2, cafe: 0, delivery: 0, spend: 0, emoji: '😊', memo: '' }
    const stats = calcStats(entry)
    expect(stats.hp).toBe(95)
  })
})
