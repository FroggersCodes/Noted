import styles from './Button.module.css';

export function Button({ children, variant = 'default', size = 'md', onClick, title, className = '', disabled = false }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
