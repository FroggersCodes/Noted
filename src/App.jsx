import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotesProvider, useNotes } from './context/NotesContext';
import { Sidebar } from './components/layout/Sidebar';
import { MainPanel } from './components/layout/MainPanel';
import { NoteList } from './components/notes/NoteList';
import { AuthPage } from './pages/AuthPage';
import styles from './App.module.css';

function AppShell() {
  const { createNote, viewMode, setViewMode } = useNotes();

  useEffect(() => {
    const handler = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'n') {
        e.preventDefault();
        createNote();
      }
      if (e.key === 'Escape' && viewMode === 'editor') {
        setViewMode('viewer');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [createNote, viewMode, setViewMode]);

  return (
    <div className={styles.app}>
      <Sidebar />
      <div className={styles.noteListPane}>
        <NoteList />
      </div>
      <MainPanel />
    </div>
  );
}

function AppRouter() {
  const { session, authLoading } = useAuth();

  if (!authLoading && session) {
    return (
      <NotesProvider>
        <AppShell />
      </NotesProvider>
    );
  }

  return <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
