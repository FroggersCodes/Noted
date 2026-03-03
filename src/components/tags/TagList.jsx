import { useNotes } from '../../context/NotesContext';
import { TagBadge } from './TagBadge';
import styles from './TagList.module.css';

export function TagList() {
  const { allTags, activeTag, setActiveTag } = useNotes();

  if (allTags.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Tags</p>
      <div className={styles.tags}>
        <TagBadge
          tag="All notes"
          active={activeTag === null}
          onClick={() => setActiveTag(null)}
        />
        {allTags.map(tag => (
          <TagBadge
            key={tag}
            tag={tag}
            active={activeTag === tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          />
        ))}
      </div>
    </div>
  );
}
