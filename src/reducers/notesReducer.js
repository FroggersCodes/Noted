export const initialState = {
  notes: [],
  activeNote: null,
  searchQuery: '',
  activeTag: null,
  viewMode: 'list', // 'list' | 'editor' | 'viewer'
  loading: false,
  error: null,
};

export function notesReducer(state, action) {
  switch (action.type) {
    case 'LOAD_NOTES':
      return { ...state, notes: action.payload, loading: false };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'CREATE_NOTE': {
      // action.payload is the server-returned row with real UUID and timestamps
      const note = action.payload;
      return {
        ...state,
        notes: [note, ...state.notes],
        activeNote: note,
        viewMode: 'editor',
      };
    }

    case 'UPDATE_NOTE': {
      const updated = action.payload;
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
        viewMode: state.viewMode,
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
