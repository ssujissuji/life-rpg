import { describe, it, expect } from 'vitest'
import { addDays, shiftMonth, formatWeekLabel, formatMonthLabel } from './date'

// ─── addDays ──────────────────────────────────────────────────────────────────

describe('addDays', () => {
  it('양수 days: 7일 후 날짜를 반환한다', () => {
    expect(addDays('2026-05-20', 7)).toBe('2026-05-27')
  })

  it('음수 days: 7일 전 날짜를 반환한다', () => {
    expect(addDays('2026-05-20', -7)).toBe('2026-05-13')
  })

  it('0 days: 동일 날짜를 반환한다', () => {
    expect(addDays('2026-05-20', 0)).toBe('2026-05-20')
  })

  it('월 경계 넘기 (5월 말 → 6월 초)', () => {
    expect(addDays('2026-05-28', 5)).toBe('2026-06-02')
  })

  it('역방향 월 경계 (6월 초 → 5월 말)', () => {
    expect(addDays('2026-06-02', -5)).toBe('2026-05-28')
  })

  it('연도 경계 넘기: 12월 말 → 1월 초', () => {
    expect(addDays('2025-12-30', 5)).toBe('2026-01-04')
  })

  it('역방향 연도 경계: 1월 초 → 12월 말', () => {
    expect(addDays('2026-01-03', -7)).toBe('2025-12-27')
  })

  it('윤년 2월 28일 + 1 → 2월 29일 반환한다', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
  })

  it('윤년 2월 29일 + 1 → 3월 1일 반환한다', () => {
    expect(addDays('2028-02-29', 1)).toBe('2028-03-01')
  })

  it('비윤년 2월 28일 + 1 → 3월 1일 반환한다', () => {
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01')
  })

  it('반환값이 YYYY-MM-DD 형식이다', () => {
    expect(addDays('2026-05-01', 1)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

// ─── shiftMonth ───────────────────────────────────────────────────────────────

describe('shiftMonth', () => {
  it('delta=1: 다음 달 1일을 반환한다', () => {
    expect(shiftMonth('2026-05-15', 1)).toBe('2026-06-01')
  })

  it('delta=-1: 이전 달 1일을 반환한다', () => {
    expect(shiftMonth('2026-05-15', -1)).toBe('2026-04-01')
  })

  it('delta=0: 같은 달 1일을 반환한다', () => {
    expect(shiftMonth('2026-05-15', 0)).toBe('2026-05-01')
  })

  it('입력이 1일이어도 결과가 1일이다', () => {
    expect(shiftMonth('2026-05-01', 1)).toBe('2026-06-01')
  })

  it('입력이 말일이어도 결과가 1일이다', () => {
    expect(shiftMonth('2026-05-31', 1)).toBe('2026-06-01')
  })

  it('연도 경계 순방향: 12월 → 1월 (연도 +1)', () => {
    expect(shiftMonth('2026-12-10', 1)).toBe('2027-01-01')
  })

  it('연도 경계 역방향: 1월 → 12월 (연도 -1)', () => {
    expect(shiftMonth('2026-01-10', -1)).toBe('2025-12-01')
  })

  it('delta=12: 정확히 1년 후 같은 달 1일이다', () => {
    expect(shiftMonth('2026-05-15', 12)).toBe('2027-05-01')
  })

  it('delta=-12: 정확히 1년 전 같은 달 1일이다', () => {
    expect(shiftMonth('2026-05-15', -12)).toBe('2025-05-01')
  })

  it('결과가 항상 1일(DD=01)이다', () => {
    const result = shiftMonth('2026-03-31', 1)
    expect(result.slice(-2)).toBe('01')
  })

  it('반환값이 YYYY-MM-DD 형식이다', () => {
    expect(shiftMonth('2026-05-15', 1)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

// ─── formatWeekLabel ──────────────────────────────────────────────────────────

describe('formatWeekLabel', () => {
  it('"MM/DD ~ MM/DD" 형식을 반환한다', () => {
    expect(formatWeekLabel('2026-05-25', '2026-05-31')).toBe('05/25 ~ 05/31')
  })

  it('같은 달 내 범위를 올바르게 포맷한다', () => {
    expect(formatWeekLabel('2026-01-05', '2026-01-11')).toBe('01/05 ~ 01/11')
  })

  it('월 경계를 넘는 범위를 올바르게 포맷한다', () => {
    expect(formatWeekLabel('2026-05-26', '2026-06-01')).toBe('05/26 ~ 06/01')
  })

  it('연도 경계를 넘는 범위를 올바르게 포맷한다', () => {
    expect(formatWeekLabel('2025-12-29', '2026-01-04')).toBe('12/29 ~ 01/04')
  })

  it('반환값이 "NN/NN ~ NN/NN" 패턴과 일치한다', () => {
    expect(formatWeekLabel('2026-05-25', '2026-05-31')).toMatch(/^\d{2}\/\d{2} ~ \d{2}\/\d{2}$/)
  })

  it('start와 end가 같은 날이면 "MM/DD ~ MM/DD" 로 동일 날짜를 반환한다', () => {
    expect(formatWeekLabel('2026-05-25', '2026-05-25')).toBe('05/25 ~ 05/25')
  })
})

// ─── formatMonthLabel ─────────────────────────────────────────────────────────

describe('formatMonthLabel', () => {
  it('"YYYY년 M월" 형식을 반환한다', () => {
    expect(formatMonthLabel('2026-05-01')).toBe('2026년 5월')
  })

  it('1월을 "1월"로 반환한다 (앞 0 없음)', () => {
    expect(formatMonthLabel('2026-01-01')).toBe('2026년 1월')
  })

  it('12월을 "12월"로 반환한다', () => {
    expect(formatMonthLabel('2026-12-01')).toBe('2026년 12월')
  })

  it('입력이 말일이어도 올바른 연/월을 반환한다', () => {
    expect(formatMonthLabel('2026-05-31')).toBe('2026년 5월')
  })

  it('연도 경계: 2025-12-01 → "2025년 12월"', () => {
    expect(formatMonthLabel('2025-12-01')).toBe('2025년 12월')
  })

  it('반환값이 "YYYY년 N월" 패턴과 일치한다', () => {
    expect(formatMonthLabel('2026-05-01')).toMatch(/^\d{4}년 \d{1,2}월$/)
  })
})
