import { create } from 'zustand'
import { loadCharacter, loadAllPatches, saveCharacter, savePatch } from '../lib/storage'
import { calcStats, calcSkills } from '../lib/stats'
import type { Character, PatchEntry, PatchFormData, PatchRecord, Skills } from '../types'

interface StoreState {
  character: Character
  patches: PatchRecord
  skills: Skills
  setCharacter: (data: Character) => void
  savePatchEntry: (date: string, formData: PatchFormData) => void
  getPatch: (date: string) => PatchEntry | null
}

const useStore = create<StoreState>((set, get) => ({
  character: loadCharacter(),
  patches: loadAllPatches(),
  skills: calcSkills(loadAllPatches()),

  setCharacter(data) {
    saveCharacter(data)
    set({ character: data })
  },

  savePatchEntry(date, formData) {
    const entry: PatchEntry = {
      ...formData,
      date,
      stats: calcStats({ ...formData, date }),
      tags: [],
    }
    savePatch(date, entry)
    const patches = { ...get().patches, [date]: entry }
    set({ patches, skills: calcSkills(patches) })
  },

  getPatch(date) {
    return get().patches[date] ?? null
  },
}))

export default useStore
