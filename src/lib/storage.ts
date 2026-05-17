import type { PatchEntry, Character, PatchRecord } from '../types'

const PATCH_PREFIX = 'patch_'
const CHARACTER_KEY = 'character'

export function savePatch(date: string, data: PatchEntry): void {
  localStorage.setItem(`${PATCH_PREFIX}${date}`, JSON.stringify(data))
}

export function loadPatch(date: string): PatchEntry | null {
  const raw = localStorage.getItem(`${PATCH_PREFIX}${date}`)
  return raw ? (JSON.parse(raw) as PatchEntry) : null
}

export function loadAllPatches(): PatchRecord {
  const result: PatchRecord = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!
    if (key.startsWith(PATCH_PREFIX)) {
      const date = key.replace(PATCH_PREFIX, '')
      result[date] = JSON.parse(localStorage.getItem(key)!) as PatchEntry
    }
  }
  return result
}

export function saveCharacter(data: Character): void {
  localStorage.setItem(CHARACTER_KEY, JSON.stringify(data))
}

export function loadCharacter(): Character {
  const raw = localStorage.getItem(CHARACTER_KEY)
  return raw
    ? (JSON.parse(raw) as Character)
    : { name: '모험가', class: '사회인', birthYear: 2000 }
}

export function clearAll(): void {
  localStorage.clear()
}
