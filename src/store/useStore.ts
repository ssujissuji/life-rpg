import { create } from 'zustand'
import { loadCharacter, loadAllPatches, saveCharacter, savePatch } from '../lib/storage'
import { calcStats, calcSkills, getStatusTags } from '../lib/stats'
import { isHoliday } from '../lib/holidays'
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
    const d = new Date(date + 'T00:00:00')
    const day = d.getDay()
    const isMonday = day === 1
    const isWeekend = day === 0 || day === 6 || isHoliday(date)
    const tags = getStatusTags({
      sleep: formData.sleep,
      cafeCount: formData.cafe,
      spend: formData.spend,
      deliveryCount: formData.delivery,
      isMonday,
      isWeekend,
    })
    const entry: PatchEntry = {
      ...formData,
      date,
      stats: calcStats({ ...formData, date }),
      tags,
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
