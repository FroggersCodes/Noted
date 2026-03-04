import { useNotes } from '../../context/NotesContext';
import { NoteEditor } from '../notes/NoteEditor';
import { NoteViewer } from '../notes/NoteViewer';
import { EmptyState } from '../ui/EmptyState';
import styles from './MainPanel.module.css';

export function MainPanel() {
  const { viewMode, activeNote } = useNotes();

  if (!activeNote) {
    return <main className={styles.panel}><EmptyState /></main>;
  }

  return (
    <main className={styles.panel}>
      {viewMode === 'viewer' && <NoteViewer />}
      {viewMode === 'editor' && <NoteEditor />}
    </main>
  );
}
