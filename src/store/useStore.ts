import { create } from 'zustand'
import { loadCharacter, loadAllPatches, saveCharacter, savePatch, loadMaxedSkills, saveMaxedSkills, loadBaseline, saveBaseline, loadRegion, saveRegion } from '../lib/storage'
import { calcStats, calcSkills, getStatusTags } from '../lib/stats'
import { isHoliday } from '../lib/holidays'
import type { Character, PatchEntry, PatchFormData, PatchRecord, Skills, PersonalBaseline, SidoName } from '../types'

interface StoreState {
  character: Character
  patches: PatchRecord
  skills: Skills
  baseline: PersonalBaseline
  region: SidoName | null
  setCharacter: (data: Character) => void
  savePatchEntry: (date: string, formData: PatchFormData) => void
  getPatch: (date: string) => PatchEntry | null
  getMaxedSkills: () => string[]
  markSkillsMaxed: (keys: string[]) => void
  setBaseline: (data: PersonalBaseline) => void
  setRegion: (sido: SidoName | null) => void
}

const initialPatches = loadAllPatches()

const useStore = create<StoreState>((set, get) => ({
  character: loadCharacter(),
  patches: initialPatches,
  skills: calcSkills(initialPatches),
  baseline: loadBaseline(),
  region: loadRegion(),

  setCharacter(data) {
    saveCharacter(data)
    set({ character: data })
  },

  setBaseline(data) {
    saveBaseline(data)
    set({ baseline: data })
  },

  savePatchEntry(date, formData) {
    const baseline = get().baseline
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
      baseline,
    })
    const entry: PatchEntry = {
      ...formData,
      date,
      stats: calcStats({ ...formData, date }, baseline),
      tags,
    }
    savePatch(date, entry)
    const patches = { ...get().patches, [date]: entry }
    set({ patches, skills: calcSkills(patches) })
  },

  getPatch(date) {
    return get().patches[date] ?? null
  },

  getMaxedSkills() {
    return loadMaxedSkills()
  },

  markSkillsMaxed(keys) {
    const merged = [...new Set([...loadMaxedSkills(), ...keys])]
    saveMaxedSkills(merged)
  },

  setRegion(sido) {
    if (sido) {
      saveRegion(sido)
    } else {
      localStorage.removeItem('region')
    }
    set({ region: sido })
  },
}))

export default useStore
