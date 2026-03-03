export function createNote(overrides = {}) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    tags: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
