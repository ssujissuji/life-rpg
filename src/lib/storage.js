// localStorage 헬퍼 (PRD 6장 기반)

const PATCH_PREFIX = 'patch_';
const CHARACTER_KEY = 'character';

export function savePatch(date, data) {
  localStorage.setItem(`${PATCH_PREFIX}${date}`, JSON.stringify(data));
}

export function loadPatch(date) {
  const raw = localStorage.getItem(`${PATCH_PREFIX}${date}`);
  return raw ? JSON.parse(raw) : null;
}

export function loadAllPatches() {
  const result = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(PATCH_PREFIX)) {
      const date = key.replace(PATCH_PREFIX, '');
      result[date] = JSON.parse(localStorage.getItem(key));
    }
  }
  return result;
}

export function saveCharacter(data) {
  localStorage.setItem(CHARACTER_KEY, JSON.stringify(data));
}

export function loadCharacter() {
  const raw = localStorage.getItem(CHARACTER_KEY);
  return raw
    ? JSON.parse(raw)
    : { name: '모험가', class: '사회인', birthYear: 2000 };
}

export function clearAll() {
  localStorage.clear();
}
