import { useState, useEffect, useRef } from 'react';
import { useNotes } from '../../context/NotesContext';
import styles from './SearchBar.module.css';

export function SearchBar() {
  const { setSearchQuery } = useNotes();
  const [value, setValue] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSearchQuery(value), 200);
    return () => clearTimeout(timer.current);
  }, [value, setSearchQuery]);

  return (
    <div className={styles.wrapper}>
      <svg className={styles.icon} viewBox="0 0 20 20" fill="none">
        <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        className={styles.input}
        type="text"
        placeholder="Search notes…"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {value && (
        <button className={styles.clear} onClick={() => setValue('')} aria-label="Clear search">✕</button>
      )}
    </div>
  );
}
