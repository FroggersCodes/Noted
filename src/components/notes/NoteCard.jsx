import { useState } from 'react';
import { useNotes } from '../../context/NotesContext';
import { TagBadge } from '../tags/TagBadge';
import { Modal } from '../ui/Modal';
import { formatRelativeDate } from '../../utils/dateHelpers';
import styles from './NoteCard.module.css';

export function NoteCard({ note }) {
  const { selectNote, deleteNote, updateNote, activeNote, setActiveTag, activeTag } = useNotes();
  const [showDelete, setShowDelete] = useState(false);
  const isActive = activeNote?.id === note.id;

  const preview = note.content
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .slice(0, 120);

  return (
    <>
      <div
        className={`${styles.card} ${isActive ? styles.active : ''}`}
        onClick={() => selectNote(note.id)}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{note.title || 'Untitled'}</h3>
          <div className={styles.actions} onClick={e => e.stopPropagation()}>
            <button
              className={styles.actionBtn}
              title="Edit note"
              onClick={() => { selectNote(note.id); updateNote(note); }}
            >
              ✏️
            </button>
            <button
              className={styles.actionBtn}
              title="Delete note"
              onClick={() => setShowDelete(true)}
            >
              🗑️
            </button>
          </div>
        </div>
        {preview && <p className={styles.preview}>{preview}</p>}
        <div className={styles.footer}>
          <span className={styles.date}>{formatRelativeDate(note.updated_at)}</span>
          <div className={styles.tags}>
            {note.tags.slice(0, 3).map(tag => (
              <TagBadge
                key={tag}
                tag={tag}
                active={activeTag === tag}
                onClick={e => { e.stopPropagation(); setActiveTag(activeTag === tag ? null : tag); }}
              />
            ))}
            {note.tags.length > 3 && <TagBadge tag={`+${note.tags.length - 3}`} />}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDelete}
        message={`Delete "${note.title || 'Untitled'}"? This cannot be undone.`}
        onConfirm={() => { deleteNote(note.id); setShowDelete(false); }}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}
