import { createContext, useContext, useReducer, useMemo, useEffect, useCallback, useRef } from 'react';
import { notesReducer, initialState } from '../reducers/notesReducer';
import { supabase } from '../lib/supabase';

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const previousNoteRef = useRef(null);

  // Fetch all notes for the current user on mount
  useEffect(() => {
    async function fetchNotes() {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } else {
        dispatch({ type: 'LOAD_NOTES', payload: data });
      }
    }
    fetchNotes();
  }, []);

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
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }, [state.notes, state.searchQuery, state.activeTag]);

  // Derived: all unique tags across all notes
  const allTags = useMemo(() => {
    const tagSet = new Set();
    state.notes.forEach(note => note.tags.forEach(t => tagSet.add(t)));
    return [...tagSet].sort();
  }, [state.notes]);

  const createNote = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('notes')
      .insert({ user_id: user.id, title: '', content: '', tags: [] })
      .select()
      .single();
    if (!error) {
      dispatch({ type: 'CREATE_NOTE', payload: data });
    }
  }, []);

  const updateNote = useCallback(async (note) => {
    previousNoteRef.current = state.notes.find(n => n.id === note.id) || null;
    // Optimistic update for instant UI response
    dispatch({ type: 'UPDATE_NOTE', payload: note });
    const { error } = await supabase
      .from('notes')
      .update({ title: note.title, content: note.content, tags: note.tags })
      .eq('id', note.id);
    if (error) {
      // Roll back on failure
      if (previousNoteRef.current) {
        dispatch({ type: 'UPDATE_NOTE', payload: previousNoteRef.current });
      }
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [state.notes]);

  const deleteNote = useCallback(async (id) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);
    if (!error) {
      dispatch({ type: 'DELETE_NOTE', payload: id });
    }
  }, []);

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
