import styles from './TagBadge.module.css';

export function TagBadge({ tag, active, onClick }) {
  return (
    <span
      className={`${styles.badge} ${active ? styles.active : ''} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      {tag}
    </span>
  );
}
