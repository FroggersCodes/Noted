import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useNotes } from '../../context/NotesContext';
import { TagBadge } from '../tags/TagBadge';
import { Modal } from '../ui/Modal';
import { formatRelativeDate } from '../../utils/dateHelpers';
import styles from './NoteViewer.module.css';

export function NoteViewer() {
  const { activeNote, deleteNote, setViewMode } = useNotes();
  const [showDelete, setShowDelete] = useState(false);

  if (!activeNote) return null;

  return (
    <div className={styles.viewer}>
      <div className={styles.toolbar}>
        <button className={styles.back} onClick={() => setViewMode('list')}>← Back</button>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => setViewMode('editor')}>✏️ Edit</button>
          <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => setShowDelete(true)}>🗑️ Delete</button>
        </div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{activeNote.title || 'Untitled'}</h1>

        <div className={styles.meta}>
          <span className={styles.date}>
            Updated {formatRelativeDate(activeNote.updatedAt)} · Created {formatRelativeDate(activeNote.createdAt)}
          </span>
          {activeNote.tags.length > 0 && (
            <div className={styles.tags}>
              {activeNote.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
            </div>
          )}
        </div>

        <div className={styles.markdown}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {activeNote.content || '*This note is empty. Click Edit to start writing.*'}
          </ReactMarkdown>
        </div>
      </div>

      <Modal
        isOpen={showDelete}
        message={`Delete "${activeNote.title || 'Untitled'}"? This cannot be undone.`}
        onConfirm={() => { deleteNote(activeNote.id); setShowDelete(false); }}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
