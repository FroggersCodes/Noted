import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotesProvider, useNotes } from './context/NotesContext';
import { Sidebar } from './components/layout/Sidebar';
import { MainPanel } from './components/layout/MainPanel';
import { AuthPage } from './pages/AuthPage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
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

function AppRouter() {
  const { session, authLoading } = useAuth();

  if (authLoading) return <LoadingSpinner fullPage />;
  if (!session) return <AuthPage />;

  return (
    <NotesProvider>
      <AppShell />
    </NotesProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
