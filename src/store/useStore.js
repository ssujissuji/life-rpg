import { create } from 'zustand';
import { loadCharacter, loadAllPatches, saveCharacter, savePatch } from '../lib/storage';
import { calcStats, calcSkills } from '../lib/stats';

const useStore = create((set, get) => ({
  character: loadCharacter(),
  patches: loadAllPatches(),
  skills: calcSkills(loadAllPatches()),

  setCharacter(data) {
    saveCharacter(data);
    set({ character: data });
  },

  savePatchEntry(date, formData) {
    const stats = calcStats({ ...formData, date });
    const tags = [];
    const entry = { ...formData, date, stats, tags };
    savePatch(date, entry);
    const patches = { ...get().patches, [date]: entry };
    set({ patches, skills: calcSkills(patches) });
  },

  getPatch(date) {
    return get().patches[date] || null;
  },
}));

export default useStore;
