import { create } from 'zustand'
import { loadCharacter, loadAllPatches, saveCharacter, savePatch, loadMaxedSkills, saveMaxedSkills, loadBaseline, saveBaseline, isOnboardingDone, setOnboardingDone, loadUnlockedTitles, saveUnlockedTitles, loadActiveTitle, saveActiveTitle } from '../lib/storage'
import { calcStats, calcSkills, getStatusTags } from '../lib/stats'
import { isHoliday } from '../lib/holidays'
import { checkTitleUnlocks } from '../lib/titles'
import type { Character, PatchEntry, PatchFormData, PatchRecord, Skills, PersonalBaseline } from '../types'

interface StoreState {
  character: Character
  patches: PatchRecord
  skills: Skills
  maxedSkills: string[]
  baseline: PersonalBaseline
  onboardingDone: boolean
  unlockedTitles: string[]
  activeTitle: string | null
  setCharacter: (data: Character) => void
  savePatchEntry: (date: string, formData: PatchFormData) => void
  getPatch: (date: string) => PatchEntry | null
  markSkillsMaxed: (keys: string[]) => void
  setBaseline: (data: PersonalBaseline) => void
  completeOnboarding: () => void
  markTitlesUnlocked: (ids: string[]) => void
  setActiveTitle: (id: string | null) => void
}

const initialPatches = loadAllPatches()
const initialMaxedSkills = loadMaxedSkills()
const initialUnlockedTitles = loadUnlockedTitles()
const initialActiveTitle = loadActiveTitle()

const retroUnlocked = checkTitleUnlocks(initialPatches, initialMaxedSkills)
const mergedUnlocked = [...new Set([...initialUnlockedTitles, ...retroUnlocked])]
if (mergedUnlocked.length > initialUnlockedTitles.length) {
  saveUnlockedTitles(mergedUnlocked)
}

const useStore = create<StoreState>((set, get) => ({
  character: loadCharacter(),
  patches: initialPatches,
  skills: calcSkills(initialPatches),
  maxedSkills: initialMaxedSkills,
  baseline: loadBaseline(),
  onboardingDone: isOnboardingDone(),
  unlockedTitles: mergedUnlocked,
  activeTitle: initialActiveTitle,

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

  markSkillsMaxed(keys) {
    const merged = [...new Set([...get().maxedSkills, ...keys])]
    saveMaxedSkills(merged)
    set({ maxedSkills: merged })
  },

  completeOnboarding() {
    setOnboardingDone()
    set({ onboardingDone: true })
  },

  markTitlesUnlocked(ids) {
    const merged = [...new Set([...get().unlockedTitles, ...ids])]
    saveUnlockedTitles(merged)
    set({ unlockedTitles: merged })
  },

  setActiveTitle(id) {
    saveActiveTitle(id)
    set({ activeTitle: id })
  },
}))

export default useStore
