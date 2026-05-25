import { describe, it, expect, beforeEach } from 'vitest'
import {
  savePatch,
  loadPatch,
  loadAllPatches,
  saveCharacter,
  loadCharacter,
  clearAll,
} from './storage'
import type { PatchEntry, Character } from '../types'

const SAMPLE_ENTRY: PatchEntry = {
  date: '2026-05-25',
  sleep: 7,
  meal: 2,
  cafe: 1,
  delivery: 0,
  spend: 15000,
  emoji: '😊',
  memo: '테스트',
  stats: { hp: 80, focus: 70, social: 60, wallet: 75, outdoor: 70, sleepQ: 55 },
  tags: [],
}

beforeEach(() => {
  clearAll()
})

// ─── savePatch / loadPatch ────────────────────────────────────────────────────

describe('savePatch / loadPatch', () => {
  it('저장 후 동일한 데이터를 반환한다', () => {
    savePatch('2026-05-25', SAMPLE_ENTRY)
    const loaded = loadPatch('2026-05-25')
    expect(loaded).toEqual(SAMPLE_ENTRY)
  })

  it('존재하지 않는 날짜는 null을 반환한다', () => {
    expect(loadPatch('1999-01-01')).toBeNull()
  })

  it('같은 날짜에 재저장하면 기존 기록이 덮어써진다 (중복 생성 없음)', () => {
    savePatch('2026-05-25', SAMPLE_ENTRY)
    const updated: PatchEntry = { ...SAMPLE_ENTRY, sleep: 9, memo: '업데이트됨' }
    savePatch('2026-05-25', updated)
    const loaded = loadPatch('2026-05-25')
    expect(loaded?.sleep).toBe(9)
    expect(loaded?.memo).toBe('업데이트됨')
  })

  it('patch_YYYY-MM-DD 형식 키로 저장된다', () => {
    savePatch('2026-05-25', SAMPLE_ENTRY)
    const raw = localStorage.getItem('patch_2026-05-25')
    expect(raw).not.toBeNull()
  })
})

// ─── BLOCK-1: 손상된 JSON 방어 ────────────────────────────────────────────────

describe('loadPatch — 손상된 JSON 방어 (BLOCK-1)', () => {
  it('손상된 JSON이 있으면 null을 반환한다 (throw 없음)', () => {
    localStorage.setItem('patch_2026-01-01', '{invalid json}')
    expect(() => loadPatch('2026-01-01')).not.toThrow()
    expect(loadPatch('2026-01-01')).toBeNull()
  })
})

describe('loadAllPatches — 손상된 JSON 방어 (BLOCK-1)', () => {
  it('일부 키가 손상됐을 때 앱 크래시 없이 정상 키만 반환한다', () => {
    savePatch('2026-05-25', SAMPLE_ENTRY)
    localStorage.setItem('patch_2026-05-01', '!broken!json!')

    expect(() => loadAllPatches()).not.toThrow()
    const result = loadAllPatches()

    expect(result['2026-05-25']).toEqual(SAMPLE_ENTRY)
    expect(result['2026-05-01']).toBeUndefined()
  })

  it('patch_ prefix가 아닌 키는 포함하지 않는다', () => {
    savePatch('2026-05-25', SAMPLE_ENTRY)
    localStorage.setItem('character', JSON.stringify({ name: '모험가', class: '사회인', birthYear: 2000 }))
    localStorage.setItem('skill_maxed', JSON.stringify([]))
    localStorage.setItem('other_key', 'something')

    const result = loadAllPatches()
    expect(Object.keys(result)).toHaveLength(1)
    expect(Object.keys(result)[0]).toBe('2026-05-25')
  })

  it('빈 localStorage에서 빈 객체를 반환한다', () => {
    expect(loadAllPatches()).toEqual({})
  })
})

// ─── saveCharacter / loadCharacter ────────────────────────────────────────────

describe('saveCharacter / loadCharacter', () => {
  it('저장 후 동일한 데이터를 반환한다', () => {
    const char: Character = { name: '수지', class: '개발자', birthYear: 2003 }
    saveCharacter(char)
    expect(loadCharacter()).toEqual(char)
  })

  it('character 키가 없으면 기본값을 반환한다', () => {
    const defaultChar = loadCharacter()
    expect(defaultChar).toEqual({ name: '모험가', class: '사회인', birthYear: 2000 })
  })

  it('저장한 Character 정보가 loadCharacter에서 정확히 반영된다', () => {
    const char: Character = { name: '최강자', class: '전사', birthYear: 1995 }
    saveCharacter(char)
    const loaded = loadCharacter()
    expect(loaded.name).toBe('최강자')
    expect(loaded.class).toBe('전사')
    expect(loaded.birthYear).toBe(1995)
  })
})

// ─── loadCharacter — 손상된 JSON 방어 ────────────────────────────────────────

describe('loadCharacter — 손상된 JSON 방어', () => {
  it('손상된 JSON이 있을 때 기본값을 반환한다', () => {
    localStorage.setItem('character', '{invalid json}')
    expect(() => loadCharacter()).not.toThrow()
    expect(loadCharacter()).toEqual({ name: '모험가', class: '사회인', birthYear: 2000 })
  })

  it('localStorage가 비어있을 때 기본값을 반환한다', () => {
    expect(loadCharacter()).toEqual({ name: '모험가', class: '사회인', birthYear: 2000 })
  })
})

// ─── 빈 상태 안전성 ───────────────────────────────────────────────────────────

describe('빈 localStorage 상태에서 기본 동작', () => {
  it('loadPatch — null 반환, 예외 없음', () => {
    expect(() => loadPatch('2026-05-25')).not.toThrow()
    expect(loadPatch('2026-05-25')).toBeNull()
  })

  it('loadAllPatches — 빈 객체 반환, 예외 없음', () => {
    expect(() => loadAllPatches()).not.toThrow()
    expect(loadAllPatches()).toEqual({})
  })

  it('loadCharacter — 기본값 반환, 예외 없음', () => {
    expect(() => loadCharacter()).not.toThrow()
    const char = loadCharacter()
    expect(char.name).toBe('모험가')
  })
})
