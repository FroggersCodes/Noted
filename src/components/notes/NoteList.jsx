import { useNotes } from '../../context/NotesContext';
import { NoteCard } from './NoteCard';
import { EmptyState } from '../ui/EmptyState';
import styles from './NoteList.module.css';

export function NoteList() {
  const { filteredNotes, searchQuery, activeTag } = useNotes();

  if (filteredNotes.length === 0) {
    return <EmptyState hasSearch={!!searchQuery} hasTag={!!activeTag} />;
  }

  return (
    <div className={styles.list}>
      {filteredNotes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
