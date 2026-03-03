import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useNotes } from '../../context/NotesContext';
import { Button } from '../ui/Button';
import styles from './NoteEditor.module.css';

export function NoteEditor() {
  const { activeNote, updateNote, setViewMode } = useNotes();

  const [title, setTitle] = useState(activeNote?.title ?? '');
  const [content, setContent] = useState(activeNote?.content ?? '');
  const [tagInput, setTagInput] = useState(activeNote?.tags.join(', ') ?? '');
  const [preview, setPreview] = useState(false);

  const saveTimer = useRef(null);
  const titleRef = useRef(null);

  // Focus title on mount
  useEffect(() => { titleRef.current?.focus(); }, []);

  // Sync from activeNote if it changes externally
  useEffect(() => {
    if (!activeNote) return;
    setTitle(activeNote.title);
    setContent(activeNote.content);
    setTagInput(activeNote.tags.join(', '));
  }, [activeNote?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced auto-save
  useEffect(() => {
    if (!activeNote) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const tags = tagInput
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);
      updateNote({ ...activeNote, title, content, tags });
    }, 300);
    return () => clearTimeout(saveTimer.current);
  }, [title, content, tagInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = () => {
    // Flush save before navigating
    if (activeNote) {
      const tags = tagInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      updateNote({ ...activeNote, title, content, tags });
    }
    setViewMode('list');
  };

  if (!activeNote) return null;

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <button className={styles.back} onClick={handleBack} title="Back to list">
          ← Back
        </button>
        <div className={styles.toolbarRight}>
          <button
            className={`${styles.previewToggle} ${preview ? styles.active : ''}`}
            onClick={() => setPreview(!preview)}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
          <span className={styles.saved}>Auto-saving…</span>
        </div>
      </div>

      <div className={styles.titleRow}>
        <input
          ref={titleRef}
          className={styles.titleInput}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title"
        />
      </div>

      <div className={styles.tagRow}>
        <input
          className={styles.tagInput}
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          placeholder="Tags (comma-separated): work, react, todo"
        />
      </div>

      <div className={`${styles.panes} ${preview ? styles.previewOnly : ''}`}>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing in Markdown…&#10;&#10;# Heading&#10;**bold**, *italic*, `code`&#10;- list items&#10;&#10;```js&#10;const hello = 'world';&#10;```"
          spellCheck
        />
        <div className={`${styles.markdownPreview} markdown-body`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {content || '*Nothing to preview yet.*'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
