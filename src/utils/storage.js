const STORAGE_KEY = 'noted_v1';

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { notes: [], version: 1 };
    const parsed = JSON.parse(raw);
    return migrate(parsed);
  } catch {
    console.warn('[Noted] Failed to parse localStorage. Starting fresh.');
    return { notes: [], version: 1 };
  }
}

export function saveToStorage(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes, version: 1 }));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('[Noted] Storage quota exceeded. Some notes may not be saved.');
    }
  }
}

function migrate(data) {
  // Placeholder for future schema migrations
  // if (data.version === 1) { ...transform...; data.version = 2; }
  return data;
}
