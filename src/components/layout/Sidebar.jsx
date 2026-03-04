import { useNotes } from '../../context/NotesContext';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../search/SearchBar';
import { TagList } from '../tags/TagList';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const { filteredNotes, notes, createNote } = useNotes();
  const { session, signOut } = useAuth();

  const countLabel = filteredNotes.length === notes.length
    ? `${notes.length} note${notes.length !== 1 ? 's' : ''}`
    : `${filteredNotes.length} of ${notes.length} notes`;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>📝</span>
          <span className={styles.appName}>Noted</span>
        </div>
        <button className={styles.newBtn} onClick={createNote} title="New note (Ctrl+N)">
          + New
        </button>
      </div>

      <div className={styles.search}>
        <SearchBar />
      </div>

      <div className={styles.count}>{countLabel}</div>

      <div className={styles.tags}>
        <TagList />
      </div>

      <div className={styles.userRow}>
        <span className={styles.userEmail}>{session?.user?.email}</span>
        <button className={styles.signOut} onClick={signOut} title="Sign out">
          Sign out
        </button>
      </div>
    </aside>
  );
}
