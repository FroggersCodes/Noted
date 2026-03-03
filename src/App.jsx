import { useEffect } from 'react';
import { NotesProvider, useNotes } from './context/NotesContext';
import { Sidebar } from './components/layout/Sidebar';
import { MainPanel } from './components/layout/MainPanel';
import styles from './App.module.css';

function AppShell() {
  const { createNote, viewMode, setViewMode } = useNotes();

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'n') {
        e.preventDefault();
        createNote();
      }
      if (e.key === 'Escape' && viewMode === 'editor') {
        setViewMode('list');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [createNote, viewMode, setViewMode]);

  return (
    <div className={styles.app}>
      <Sidebar />
      <MainPanel />
    </div>
  );
}

export default function App() {
  return (
    <NotesProvider>
      <AppShell />
    </NotesProvider>
  );
}
