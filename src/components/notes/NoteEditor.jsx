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
  const textareaRef = useRef(null);

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
    setViewMode('viewer');
  };

  function formatText(syntax) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end);

    const wrappers = { bold: '**', italic: '*', strike: '~~', code: '`' };
    const prefixes = { h1: '# ', quote: '> ', ul: '- ' };

    let newContent;
    if (wrappers[syntax]) {
      const w = wrappers[syntax];
      newContent = content.slice(0, start) + w + selected + w + content.slice(end);
    } else if (prefixes[syntax]) {
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      newContent = content.slice(0, lineStart) + prefixes[syntax] + content.slice(lineStart);
    }
    if (newContent !== undefined) {
      setContent(newContent);
      setTimeout(() => el.focus(), 0);
    }
  }

  if (!activeNote) return null;

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <button className={styles.back} onClick={handleBack} title="Back to note">
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

      <div className={styles.formatBar}>
        <button onMouseDown={e => { e.preventDefault(); formatText('bold'); }} title="Bold"><b>B</b></button>
        <button onMouseDown={e => { e.preventDefault(); formatText('italic'); }} title="Italic"><i>I</i></button>
        <button onMouseDown={e => { e.preventDefault(); formatText('strike'); }} title="Strikethrough"><s>S</s></button>
        <button onMouseDown={e => { e.preventDefault(); formatText('code'); }} title="Inline code">`</button>
        <div className={styles.fmtDivider} />
        <button onMouseDown={e => { e.preventDefault(); formatText('h1'); }} title="Heading">H</button>
        <button onMouseDown={e => { e.preventDefault(); formatText('quote'); }} title="Blockquote">"</button>
        <button onMouseDown={e => { e.preventDefault(); formatText('ul'); }} title="Bullet list">•</button>
      </div>

      <div className={`${styles.panes} ${preview ? styles.previewOnly : ''}`}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing…"
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
