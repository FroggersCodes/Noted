import { createContext, useContext, useReducer, useMemo, useEffect, useCallback } from 'react';
import { notesReducer, initialState } from '../reducers/notesReducer';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState, () => {
    const { notes } = loadFromStorage();
    return { ...initialState, notes };
  });

  // Persist notes to localStorage whenever notes array changes
  useEffect(() => {
    saveToStorage(state.notes);
  }, [state.notes]);

  // Derived: filtered + sorted notes
  const filteredNotes = useMemo(() => {
    return state.notes
      .filter(note => !state.activeTag || note.tags.includes(state.activeTag))
      .filter(note => {
        if (!state.searchQuery) return true;
        const q = state.searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [state.notes, state.searchQuery, state.activeTag]);

  // Derived: all unique tags across all notes
  const allTags = useMemo(() => {
    const tagSet = new Set();
    state.notes.forEach(note => note.tags.forEach(t => tagSet.add(t)));
    return [...tagSet].sort();
  }, [state.notes]);

  const createNote = useCallback(() => dispatch({ type: 'CREATE_NOTE' }), []);
  const updateNote = useCallback((note) => dispatch({ type: 'UPDATE_NOTE', payload: note }), []);
  const deleteNote = useCallback((id) => dispatch({ type: 'DELETE_NOTE', payload: id }), []);
  const selectNote = useCallback((id) => dispatch({ type: 'SELECT_NOTE', payload: id }), []);
  const setSearchQuery = useCallback((q) => dispatch({ type: 'SET_SEARCH_QUERY', payload: q }), []);
  const setActiveTag = useCallback((tag) => dispatch({ type: 'SET_ACTIVE_TAG', payload: tag }), []);
  const setViewMode = useCallback((mode) => dispatch({ type: 'SET_VIEW_MODE', payload: mode }), []);

  const value = {
    ...state,
    filteredNotes,
    allTags,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    setSearchQuery,
    setActiveTag,
    setViewMode,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
