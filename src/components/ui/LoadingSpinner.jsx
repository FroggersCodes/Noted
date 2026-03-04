import styles from './LoadingSpinner.module.css';

export function LoadingSpinner({ fullPage = false }) {
  return (
    <div className={`${styles.wrapper} ${fullPage ? styles.fullPage : ''}`}>
      <div className={styles.spinner} />
    </div>
  );
}
