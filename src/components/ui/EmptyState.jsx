import styles from './EmptyState.module.css';

export function EmptyState({ hasSearch, hasTag }) {
  if (hasSearch || hasTag) {
    return (
      <div className={styles.wrapper}>
        <span className={styles.icon}>🔍</span>
        <p className={styles.title}>No notes found</p>
        <p className={styles.sub}>Try a different search or clear the filter.</p>
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>📝</span>
      <p className={styles.title}>No notes yet</p>
      <p className={styles.sub}>Click &ldquo;New note&rdquo; or press Ctrl+N to get started.</p>
    </div>
  );
}
