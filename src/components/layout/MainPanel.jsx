import { useNotes } from '../../context/NotesContext';
import { NoteList } from '../notes/NoteList';
import { NoteEditor } from '../notes/NoteEditor';
import { NoteViewer } from '../notes/NoteViewer';
import styles from './MainPanel.module.css';

export function MainPanel() {
  const { viewMode } = useNotes();

  return (
    <main className={styles.panel}>
      {viewMode === 'list' && <NoteList />}
      {viewMode === 'viewer' && <NoteViewer />}
      {viewMode === 'editor' && <NoteEditor />}
    </main>
  );
}
