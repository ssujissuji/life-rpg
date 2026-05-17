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
