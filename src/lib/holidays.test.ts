import { describe, it, expect } from 'vitest'
import { isHoliday } from './holidays'

describe('isHoliday — 2026년 공휴일', () => {
  it('2026-01-01 (신정)은 공휴일이다', () => {
    expect(isHoliday('2026-01-01')).toBe(true)
  })

  it('2026-02-17 (설날)은 공휴일이다', () => {
    expect(isHoliday('2026-02-17')).toBe(true)
  })

  it('2026-05-24 (부처님오신날, 일요일)은 공휴일이다', () => {
    expect(isHoliday('2026-05-24')).toBe(true)
  })

  it('2026-05-25 (부처님오신날 대체공휴일, 월요일)은 공휴일이다', () => {
    expect(isHoliday('2026-05-25')).toBe(true)
  })

  it('2026-12-25 (크리스마스)는 공휴일이다', () => {
    expect(isHoliday('2026-12-25')).toBe(true)
  })

  it('2026-05-26 (평일 화요일)은 공휴일이 아니다', () => {
    expect(isHoliday('2026-05-26')).toBe(false)
  })
})

describe('isHoliday — 2025년 공휴일', () => {
  it('2025-01-01 (신정)은 공휴일이다', () => {
    expect(isHoliday('2025-01-01')).toBe(true)
  })

  it('2025-10-08 (추석 대체공휴일, 수요일)은 공휴일이다', () => {
    expect(isHoliday('2025-10-08')).toBe(true)
  })

  it('2025-01-15 (평일 수요일)은 공휴일이 아니다', () => {
    expect(isHoliday('2025-01-15')).toBe(false)
  })
})

describe('isHoliday — 경계 케이스', () => {
  it('2024-01-01 (2024년은 데이터 없음)은 공휴일이 아니다', () => {
    expect(isHoliday('2024-01-01')).toBe(false)
  })

  it('빈 문자열은 공휴일이 아니다', () => {
    expect(isHoliday('')).toBe(false)
  })
})
