import type { PatchEntry, Character, PatchRecord } from '../types'

const PATCH_PREFIX = 'patch_'
const CHARACTER_KEY = 'character'
const SKILL_MAXED_KEY = 'skill_maxed'

export function savePatch(date: string, data: PatchEntry): void {
  localStorage.setItem(`${PATCH_PREFIX}${date}`, JSON.stringify(data))
}

export function loadPatch(date: string): PatchEntry | null {
  const raw = localStorage.getItem(`${PATCH_PREFIX}${date}`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PatchEntry
  } catch {
    return null
  }
}

export function loadAllPatches(): PatchRecord {
  const result: PatchRecord = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!
    if (key.startsWith(PATCH_PREFIX)) {
      const date = key.replace(PATCH_PREFIX, '')
      const raw = localStorage.getItem(key)
      if (!raw) continue
      try {
        result[date] = JSON.parse(raw) as PatchEntry
      } catch {
        continue
      }
    }
  }
  return result
}

export function saveCharacter(data: Character): void {
  localStorage.setItem(CHARACTER_KEY, JSON.stringify(data))
}

export function loadCharacter(): Character {
  const raw = localStorage.getItem(CHARACTER_KEY)
  if (!raw) return { name: '모험가', class: '사회인', birthYear: 2000 }
  try {
    return JSON.parse(raw) as Character
  } catch {
    return { name: '모험가', class: '사회인', birthYear: 2000 }
  }
}

export function loadMaxedSkills(): string[] {
  const raw = localStorage.getItem(SKILL_MAXED_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function saveMaxedSkills(skills: string[]): void {
  localStorage.setItem(SKILL_MAXED_KEY, JSON.stringify(skills))
}

export function clearAll(): void {
  localStorage.clear()
}
