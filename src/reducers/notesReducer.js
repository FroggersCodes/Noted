import { createNote } from '../utils/noteHelpers';

export const initialState = {
  notes: [],
  activeNote: null,
  searchQuery: '',
  activeTag: null,
  viewMode: 'list', // 'list' | 'editor' | 'viewer'
};

export function notesReducer(state, action) {
  switch (action.type) {
    case 'LOAD_NOTES':
      return { ...state, notes: action.payload };

    case 'CREATE_NOTE': {
      const note = createNote();
      return {
        ...state,
        notes: [note, ...state.notes],
        activeNote: note,
        viewMode: 'editor',
      };
    }

    case 'UPDATE_NOTE': {
      const updated = { ...action.payload, updatedAt: new Date().toISOString() };
      return {
        ...state,
        notes: state.notes.map(n => n.id === updated.id ? updated : n),
        activeNote: state.activeNote?.id === updated.id ? updated : state.activeNote,
      };
    }

    case 'DELETE_NOTE': {
      const remaining = state.notes.filter(n => n.id !== action.payload);
      return {
        ...state,
        notes: remaining,
        activeNote: state.activeNote?.id === action.payload ? null : state.activeNote,
        viewMode: state.activeNote?.id === action.payload ? 'list' : state.viewMode,
      };
    }

    case 'SELECT_NOTE':
      return {
        ...state,
        activeNote: state.notes.find(n => n.id === action.payload) || null,
        viewMode: 'viewer',
      };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'SET_ACTIVE_TAG':
      return { ...state, activeTag: action.payload };

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };

    default:
      return state;
  }
}
