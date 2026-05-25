import { describe, it, expect } from 'vitest'
import {
  getWeekBounds,
  getMonthBounds,
  calcWeeklyReport,
  calcMonthlyReport,
  calcStatTrend,
  calcStats,
} from './stats'
import type { PatchEntry, PatchRecord } from '../types'

// ─── 테스트 헬퍼 ──────────────────────────────────────────────────────────────

/**
 * 오늘 기준 N일 전 날짜를 YYYY-MM-DD 로컬 형식으로 반환
 * (getWeekBounds / getMonthBounds가 로컬 날짜 기준이므로 일치시킴)
 */
function localDateStr(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * 특정 날짜 문자열로 PatchEntry를 생성하고 stats는 calcStats로 계산
 */
function makeEntry(
  date: string,
  overrides: Partial<Omit<PatchEntry, 'date' | 'stats' | 'tags'>> = {},
  tags: string[] = [],
): PatchEntry {
  const base = {
    sleep: 7,
    meal: 2,
    cafe: 0,
    delivery: 0,
    spend: 0,
    emoji: '😊',
    memo: '',
    ...overrides,
  }
  const stats = calcStats({ ...base, date })
  return { date, ...base, stats, tags }
}

// ─── getWeekBounds ────────────────────────────────────────────────────────────

describe('getWeekBounds', () => {
  it('월요일 입력 → weekStart가 같은 날(월요일)이다', () => {
    // 2026-05-25는 월요일
    const { weekStart } = getWeekBounds('2026-05-25')
    expect(weekStart).toBe('2026-05-25')
  })

  it('월요일 입력 → weekEnd가 6일 후 일요일이다', () => {
    const { weekEnd } = getWeekBounds('2026-05-25')
    expect(weekEnd).toBe('2026-05-31')
  })

  it('수요일 입력 → weekStart가 2일 전 월요일이다', () => {
    // 2026-05-27은 수요일
    const { weekStart } = getWeekBounds('2026-05-27')
    expect(weekStart).toBe('2026-05-25')
  })

  it('일요일 입력 → weekStart가 6일 전 월요일이다 (엣지 케이스)', () => {
    // 2026-05-31은 일요일
    const { weekStart } = getWeekBounds('2026-05-31')
    expect(weekStart).toBe('2026-05-25')
  })

  it('일요일 입력 → weekEnd가 같은 날 일요일이다', () => {
    const { weekEnd } = getWeekBounds('2026-05-31')
    expect(weekEnd).toBe('2026-05-31')
  })

  it('반환된 weekStart가 YYYY-MM-DD 형식이다', () => {
    const { weekStart } = getWeekBounds('2026-05-25')
    expect(weekStart).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('반환된 weekEnd가 YYYY-MM-DD 형식이다', () => {
    const { weekEnd } = getWeekBounds('2026-05-25')
    expect(weekEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('월초 월요일 입력 → weekStart가 해당 월요일, weekEnd가 6일 후이다', () => {
    // 2026-06-01은 월요일
    const { weekStart, weekEnd } = getWeekBounds('2026-06-01')
    expect(weekStart).toBe('2026-06-01')
    expect(weekEnd).toBe('2026-06-07')
  })
})

// ─── getMonthBounds ───────────────────────────────────────────────────────────

describe('getMonthBounds', () => {
  it('월 중간 날짜 → monthStart가 1일이다', () => {
    const { monthStart } = getMonthBounds('2026-05-15')
    expect(monthStart).toBe('2026-05-01')
  })

  it('월 중간 날짜 → monthEnd가 31일(5월)이다', () => {
    const { monthEnd } = getMonthBounds('2026-05-15')
    expect(monthEnd).toBe('2026-05-31')
  })

  it('2월(비윤년 2026) → monthEnd가 28일이다', () => {
    const { monthEnd } = getMonthBounds('2026-02-10')
    expect(monthEnd).toBe('2026-02-28')
  })

  it('2월(윤년 2028) → monthEnd가 29일이다', () => {
    const { monthEnd } = getMonthBounds('2028-02-15')
    expect(monthEnd).toBe('2028-02-29')
  })

  it('12월 → monthEnd가 31일이다', () => {
    const { monthEnd } = getMonthBounds('2026-12-01')
    expect(monthEnd).toBe('2026-12-31')
  })

  it('반환된 monthStart가 YYYY-MM-DD 형식이다', () => {
    const { monthStart } = getMonthBounds('2026-05-25')
    expect(monthStart).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('반환된 monthEnd가 YYYY-MM-DD 형식이다', () => {
    const { monthEnd } = getMonthBounds('2026-05-25')
    expect(monthEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

// ─── calcWeeklyReport ─────────────────────────────────────────────────────────

describe('calcWeeklyReport — 기록 없을 때', () => {
  it('attendanceCount가 0이다', () => {
    const report = calcWeeklyReport({}, localDateStr())
    expect(report.attendanceCount).toBe(0)
  })

  it('verdict가 "struggle"이다', () => {
    const report = calcWeeklyReport({}, localDateStr())
    expect(report.verdict).toBe('struggle')
  })

  it('mvpStat이 null이다', () => {
    const report = calcWeeklyReport({}, localDateStr())
    expect(report.mvpStat).toBeNull()
  })

  it('dangerStat이 null이다', () => {
    const report = calcWeeklyReport({}, localDateStr())
    expect(report.dangerStat).toBeNull()
  })

  it('skillGrowth가 빈 배열이다', () => {
    const report = calcWeeklyReport({}, localDateStr())
    expect(report.skillGrowth).toEqual([])
  })
})

describe('calcWeeklyReport — verdict 판정', () => {
  /**
   * 이번 주 월요일을 구해 5일치 기록을 동적으로 생성
   * hp >= 70 이 되도록 sleep=8 (isWeekend 아닌 날: hp=100, sleep=8 → hp=100)
   */
  function makeWeekPatches(count: number, sleepVal: number): PatchRecord {
    const today = localDateStr()
    const { weekStart } = getWeekBounds(today)
    const patches: PatchRecord = {}
    for (let i = 0; i < count; i++) {
      const d = new Date(weekStart + 'T00:00:00')
      d.setDate(d.getDate() + i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      patches[dateStr] = makeEntry(dateStr, { sleep: sleepVal })
    }
    return patches
  }

  it('기록 5일 이상 + avgHP >= 70 → verdict가 "good"이다', () => {
    // sleep=8 → hp=100, 5일 기록
    const patches = makeWeekPatches(5, 8)
    const report = calcWeeklyReport(patches, localDateStr())
    expect(report.attendanceCount).toBe(5)
    expect(report.verdict).toBe('good')
  })

  it('기록 3일 + avgHP >= 40 + 조건 미달 → verdict가 "survival"이다', () => {
    // sleep=5 → hp=80(isWeekend에 따라 다를 수 있으나 40 이상), 3일 기록
    const patches = makeWeekPatches(3, 7)
    const report = calcWeeklyReport(patches, localDateStr())
    expect(report.attendanceCount).toBe(3)
    expect(report.verdict).toBe('survival')
  })

  it('기록 2일 이하 → verdict가 "struggle"이다', () => {
    const patches = makeWeekPatches(2, 8)
    const report = calcWeeklyReport(patches, localDateStr())
    expect(report.attendanceCount).toBe(2)
    expect(report.verdict).toBe('struggle')
  })

  it('기록 5일 이상이지만 avgHP < 70 → verdict가 "survival" 또는 "struggle"이다', () => {
    // sleep=0, meal=0 → hp = 100 - 30(수면) - 15(식사) = 55 < 70
    // makeWeekPatches 대신 직접 구성하여 meal도 0으로 설정
    const today = localDateStr()
    const { weekStart } = getWeekBounds(today)
    const patches: PatchRecord = {}
    for (let i = 0; i < 5; i++) {
      const d = new Date(weekStart + 'T00:00:00')
      d.setDate(d.getDate() + i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      patches[dateStr] = makeEntry(dateStr, { sleep: 0, meal: 0 })
    }
    const report = calcWeeklyReport(patches, today)
    expect(report.attendanceCount).toBe(5)
    expect(['survival', 'struggle']).toContain(report.verdict)
  })
})

describe('calcWeeklyReport — summaryMessage', () => {
  function makeWeekPatchWithTags(tags: string[]): PatchRecord {
    const today = localDateStr()
    const { weekStart } = getWeekBounds(today)
    const patches: PatchRecord = {}
    // 3일치 동일 태그 기록 생성
    for (let i = 0; i < 3; i++) {
      const d = new Date(weekStart + 'T00:00:00')
      d.setDate(d.getDate() + i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      patches[dateStr] = { ...makeEntry(dateStr), tags }
    }
    return patches
  }

  it('태그 없음 → "이번 주도 잘 살아냈다!" 포함', () => {
    const patches = makeWeekPatchWithTags([])
    const report = calcWeeklyReport(patches, localDateStr())
    expect(report.summaryMessage).toContain('이번 주도 잘 살아냈다!')
  })

  it('수면부족 태그 최다 → 수면부족 관련 문구 포함', () => {
    const patches = makeWeekPatchWithTags(['수면부족'])
    const report = calcWeeklyReport(patches, localDateStr())
    expect(report.summaryMessage).toContain('수면부족')
  })

  it('통장출혈 태그 최다 → 통장출혈 관련 문구 포함', () => {
    const patches = makeWeekPatchWithTags(['통장출혈'])
    const report = calcWeeklyReport(patches, localDateStr())
    expect(report.summaryMessage).toContain('통장출혈')
  })

  it('무지출 태그 최다 → 무지출 관련 문구 포함', () => {
    const patches = makeWeekPatchWithTags(['무지출'])
    const report = calcWeeklyReport(patches, localDateStr())
    expect(report.summaryMessage).toContain('무지출')
  })

  it('꿀잠달성 태그 최다 → 꿀잠달성 관련 문구 포함', () => {
    const patches = makeWeekPatchWithTags(['꿀잠달성'])
    const report = calcWeeklyReport(patches, localDateStr())
    expect(report.summaryMessage).toContain('꿀잠달성')
  })
})

describe('calcWeeklyReport — skillGrowth', () => {
  it('이번 주 이전 기록 없고 이번 주에 스킬 성장 → skillGrowth에 감지된다', () => {
    const today = localDateStr()
    const { weekStart } = getWeekBounds(today)
    const patches: PatchRecord = {}

    // poor 스킬(거지력): spend=0, cafe=0 30일 → 만렙 달성
    // 이번 주 월요일~일요일(7일)이 기준이므로 7일치로는 level 변화가 작음
    // 대신 cafe 스킬: 이번 주에만 cafe 기록 추가 → level > 0 달성

    // 이번 주 월요일 하루 cafe=10 기록
    const d = new Date(weekStart + 'T00:00:00')
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    patches[dateStr] = makeEntry(dateStr, { cafe: 10 })

    const report = calcWeeklyReport(patches, today)
    // cafe(각성력) 스킬: 이전 0, 이후 1 → skillGrowth에 포함
    const cafeGrowth = report.skillGrowth.find((g) => g.skillKey === 'cafe')
    expect(cafeGrowth).toBeDefined()
    expect(cafeGrowth!.before).toBe(0)
    expect(cafeGrowth!.after).toBeGreaterThan(0)
  })

  it('레벨 변화 없으면 skillGrowth가 빈 배열이다', () => {
    const today = localDateStr()
    const { weekStart } = getWeekBounds(today)
    const patches: PatchRecord = {}

    // 이번 주 하루 기록 (cafe=0, delivery=0, spend=0 → 어떤 스킬도 level 0 유지)
    const d = new Date(weekStart + 'T00:00:00')
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    patches[dateStr] = makeEntry(dateStr, { cafe: 0, delivery: 0, spend: 0 })

    // 이전 기록도 없으므로 before=0, after=0 → 레벨 변화 없음
    const report = calcWeeklyReport(patches, today)
    expect(report.skillGrowth).toEqual([])
  })

  it('이번 주 이전 기록 있고 이번 주로 레벨이 오르면 skillGrowth에 포함된다', () => {
    const today = localDateStr()
    const { weekStart } = getWeekBounds(today)
    const patches: PatchRecord = {}

    // 이전 주 9일 전(이번 주 범위 밖)에 cafe=9 기록 → cafe level = floor(9/100*10) = 0
    const prevD = new Date(weekStart + 'T00:00:00')
    prevD.setDate(prevD.getDate() - 1)
    const prevDateStr = `${prevD.getFullYear()}-${String(prevD.getMonth() + 1).padStart(2, '0')}-${String(prevD.getDate()).padStart(2, '0')}`
    patches[prevDateStr] = makeEntry(prevDateStr, { cafe: 9 })

    // 이번 주 월요일에 cafe=1 추가 → 합계 10 → level = floor(10/100*10) = 1
    const d = new Date(weekStart + 'T00:00:00')
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    patches[dateStr] = makeEntry(dateStr, { cafe: 1 })

    const report = calcWeeklyReport(patches, today)
    const cafeGrowth = report.skillGrowth.find((g) => g.skillKey === 'cafe')
    expect(cafeGrowth).toBeDefined()
    expect(cafeGrowth!.before).toBe(0)
    expect(cafeGrowth!.after).toBe(1)
  })
})

describe('calcWeeklyReport — 반환 구조', () => {
  it('weekStart, weekEnd가 YYYY-MM-DD 형식이다', () => {
    const report = calcWeeklyReport({}, localDateStr())
    expect(report.weekStart).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(report.weekEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('totalDays가 7이다', () => {
    const report = calcWeeklyReport({}, localDateStr())
    expect(report.totalDays).toBe(7)
  })
})

// ─── calcMonthlyReport ────────────────────────────────────────────────────────

describe('calcMonthlyReport — 기록 없을 때', () => {
  it('attendanceCount가 0이다', () => {
    const report = calcMonthlyReport({}, localDateStr())
    expect(report.attendanceCount).toBe(0)
  })

  it('bestDay가 null이다', () => {
    const report = calcMonthlyReport({}, localDateStr())
    expect(report.bestDay).toBeNull()
  })

  it('worstDay가 null이다', () => {
    const report = calcMonthlyReport({}, localDateStr())
    expect(report.worstDay).toBeNull()
  })

  it('avgSleep이 0이다', () => {
    const report = calcMonthlyReport({}, localDateStr())
    expect(report.avgSleep).toBe(0)
  })

  it('predictionMessage가 기본값이다', () => {
    const report = calcMonthlyReport({}, localDateStr())
    expect(report.predictionMessage).toBe('다음 달도 현생 파이팅!')
  })
})

describe('calcMonthlyReport — bestDay / worstDay', () => {
  it('bestDay: 스탯 합산이 가장 높은 날 날짜를 반환한다', () => {
    const today = localDateStr()
    const { monthStart } = getMonthBounds(today)
    const patches: PatchRecord = {}

    // 1일: sleep=8(높은 스탯), 2일: sleep=3(낮은 스탯)
    const day1 = monthStart // YYYY-MM-01
    const day2Obj = new Date(monthStart + 'T00:00:00')
    day2Obj.setDate(day2Obj.getDate() + 1)
    const day2 = `${day2Obj.getFullYear()}-${String(day2Obj.getMonth() + 1).padStart(2, '0')}-${String(day2Obj.getDate()).padStart(2, '0')}`

    patches[day1] = makeEntry(day1, { sleep: 8, meal: 2, cafe: 1, spend: 0 })
    patches[day2] = makeEntry(day2, { sleep: 3, meal: 0, cafe: 0, spend: 100000 })

    const report = calcMonthlyReport(patches, today)
    expect(report.bestDay).not.toBeNull()
    expect(report.bestDay!.date).toBe(day1)
  })

  it('worstDay: 스탯 합산이 가장 낮은 날 날짜를 반환한다', () => {
    const today = localDateStr()
    const { monthStart } = getMonthBounds(today)
    const patches: PatchRecord = {}

    const day1 = monthStart
    const day2Obj = new Date(monthStart + 'T00:00:00')
    day2Obj.setDate(day2Obj.getDate() + 1)
    const day2 = `${day2Obj.getFullYear()}-${String(day2Obj.getMonth() + 1).padStart(2, '0')}-${String(day2Obj.getDate()).padStart(2, '0')}`

    patches[day1] = makeEntry(day1, { sleep: 8, meal: 2, cafe: 1, spend: 0 })
    patches[day2] = makeEntry(day2, { sleep: 3, meal: 0, cafe: 0, spend: 100000 })

    const report = calcMonthlyReport(patches, today)
    expect(report.worstDay).not.toBeNull()
    expect(report.worstDay!.date).toBe(day2)
  })

  it('기록이 1개뿐이면 bestDay와 worstDay가 같은 날짜이다', () => {
    const today = localDateStr()
    const { monthStart } = getMonthBounds(today)
    const patches: PatchRecord = {}

    patches[monthStart] = makeEntry(monthStart, { sleep: 7 })
    const report = calcMonthlyReport(patches, today)
    expect(report.bestDay!.date).toBe(monthStart)
    expect(report.worstDay!.date).toBe(monthStart)
  })
})

describe('calcMonthlyReport — avgSleep', () => {
  it('avgSleep이 소수점 1자리로 반환된다', () => {
    const today = localDateStr()
    const { monthStart } = getMonthBounds(today)
    const patches: PatchRecord = {}

    // sleep: 7, 8 → 평균 7.5
    const day1 = monthStart
    const day2Obj = new Date(monthStart + 'T00:00:00')
    day2Obj.setDate(day2Obj.getDate() + 1)
    const day2 = `${day2Obj.getFullYear()}-${String(day2Obj.getMonth() + 1).padStart(2, '0')}-${String(day2Obj.getDate()).padStart(2, '0')}`

    patches[day1] = makeEntry(day1, { sleep: 7 })
    patches[day2] = makeEntry(day2, { sleep: 8 })

    const report = calcMonthlyReport(patches, today)
    expect(report.avgSleep).toBe(7.5)
    // 소수점 1자리 형식 확인 (7.5는 문자열로 '7.5')
    expect(report.avgSleep.toFixed(1)).toBe('7.5')
  })

  it('정수 평균도 소수점 1자리로 표현 가능하다 (7.0)', () => {
    const today = localDateStr()
    const { monthStart } = getMonthBounds(today)
    const patches: PatchRecord = {}

    patches[monthStart] = makeEntry(monthStart, { sleep: 7 })
    const report = calcMonthlyReport(patches, today)
    expect(report.avgSleep).toBe(7)
  })
})

describe('calcMonthlyReport — predictionMessage', () => {
  function makeMonthPatchWithTags(tags: string[]): PatchRecord {
    const today = localDateStr()
    const { monthStart } = getMonthBounds(today)
    const patches: PatchRecord = {}

    for (let i = 0; i < 3; i++) {
      const d = new Date(monthStart + 'T00:00:00')
      d.setDate(d.getDate() + i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      patches[dateStr] = { ...makeEntry(dateStr), tags }
    }
    return patches
  }

  it('통장출혈 태그 최다 → 통장출혈 관련 predictionMessage 반환', () => {
    const patches = makeMonthPatchWithTags(['통장출혈'])
    const report = calcMonthlyReport(patches, localDateStr())
    expect(report.predictionMessage).toContain('지갑')
  })

  it('수면부족 태그 최다 → 수면부족 관련 predictionMessage 반환', () => {
    const patches = makeMonthPatchWithTags(['수면부족'])
    const report = calcMonthlyReport(patches, localDateStr())
    expect(report.predictionMessage).toContain('자')
  })

  it('무지출 태그 최다 → 절약 관련 predictionMessage 반환', () => {
    const patches = makeMonthPatchWithTags(['무지출'])
    const report = calcMonthlyReport(patches, localDateStr())
    expect(report.predictionMessage).toContain('절약')
  })

  it('꿀잠달성 태그 최다 → 꿀잠 관련 predictionMessage 반환', () => {
    const patches = makeMonthPatchWithTags(['꿀잠달성'])
    const report = calcMonthlyReport(patches, localDateStr())
    expect(report.predictionMessage).toContain('꿀잠')
  })
})

describe('calcMonthlyReport — 반환 구조', () => {
  it('year, month가 오늘 기준과 일치한다', () => {
    const today = localDateStr()
    const d = new Date(today + 'T00:00:00')
    const report = calcMonthlyReport({}, today)
    expect(report.year).toBe(d.getFullYear())
    expect(report.month).toBe(d.getMonth() + 1)
  })

  it('totalDays가 해당 월의 실제 날수와 일치한다', () => {
    // 5월 → 31일
    const report = calcMonthlyReport({}, '2026-05-25')
    expect(report.totalDays).toBe(31)
  })

  it('2월(비윤년) totalDays가 28이다', () => {
    const report = calcMonthlyReport({}, '2026-02-10')
    expect(report.totalDays).toBe(28)
  })
})

// ─── calcStatTrend ────────────────────────────────────────────────────────────

describe('calcStatTrend', () => {
  it('기록 있는 날만 결과에 포함된다', () => {
    const today = localDateStr()
    const { weekStart } = getWeekBounds(today)
    const patches: PatchRecord = {}

    // 이번 주 월요일 하루만 기록
    const d = new Date(weekStart + 'T00:00:00')
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    patches[dateStr] = makeEntry(dateStr)

    // dateRange: 이번 주 7일
    const dateRange = Array.from({ length: 7 }, (_, i) => {
      const nd = new Date(weekStart + 'T00:00:00')
      nd.setDate(nd.getDate() + i)
      return `${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}-${String(nd.getDate()).padStart(2, '0')}`
    })

    const result = calcStatTrend(patches, dateRange)
    // 기록이 1개뿐이므로 결과도 1개
    expect(result).toHaveLength(1)
  })

  it('기록 없는 날은 결과에서 제외된다', () => {
    const dateRange = ['2026-05-25', '2026-05-26', '2026-05-27']
    const patches: PatchRecord = {
      '2026-05-26': makeEntry('2026-05-26'),
    }
    const result = calcStatTrend(patches, dateRange)
    expect(result).toHaveLength(1)
    expect(result[0].date).toBe('05/26')
  })

  it('date 필드가 MM/DD 형식이다', () => {
    const patches: PatchRecord = {
      '2026-05-25': makeEntry('2026-05-25'),
    }
    const result = calcStatTrend(patches, ['2026-05-25'])
    expect(result[0].date).toBe('05/25')
    expect(result[0].date).toMatch(/^\d{2}\/\d{2}$/)
  })

  it('모든 스탯 필드(hp, focus, social, wallet, outdoor, sleepQ)가 포함된다', () => {
    const patches: PatchRecord = {
      '2026-05-25': makeEntry('2026-05-25'),
    }
    const result = calcStatTrend(patches, ['2026-05-25'])
    expect(result[0]).toHaveProperty('hp')
    expect(result[0]).toHaveProperty('focus')
    expect(result[0]).toHaveProperty('social')
    expect(result[0]).toHaveProperty('wallet')
    expect(result[0]).toHaveProperty('outdoor')
    expect(result[0]).toHaveProperty('sleepQ')
  })

  it('dateRange 순서를 유지한다 (기록 있는 날만 순서대로)', () => {
    const patches: PatchRecord = {
      '2026-05-25': makeEntry('2026-05-25'),
      '2026-05-27': makeEntry('2026-05-27'),
    }
    const dateRange = ['2026-05-25', '2026-05-26', '2026-05-27']
    const result = calcStatTrend(patches, dateRange)
    expect(result).toHaveLength(2)
    expect(result[0].date).toBe('05/25')
    expect(result[1].date).toBe('05/27')
  })

  it('빈 dateRange 이면 빈 배열을 반환한다', () => {
    const result = calcStatTrend({}, [])
    expect(result).toEqual([])
  })

  it('patches가 비어있으면 빈 배열을 반환한다', () => {
    const result = calcStatTrend({}, ['2026-05-25', '2026-05-26'])
    expect(result).toEqual([])
  })
})
