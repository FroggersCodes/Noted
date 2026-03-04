import styles from './LandingPage.module.css';

export function LandingPage({ onSignIn, onSignUp }) {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>📝</span>
          <span className={styles.logoName}>Noted</span>
        </div>
        <div className={styles.navActions}>
          <button className={styles.signInBtn} onClick={onSignIn}>Sign in</button>
          <button className={styles.signUpBtn} onClick={onSignUp}>Sign up</button>
        </div>
      </nav>

      <main className={styles.hero}>
        <h1 className={styles.headline}>
          Your thoughts,<br />beautifully organized.
        </h1>
        <p className={styles.subheadline}>
          Noted is a fast, minimal note-taking app with Markdown support,
          tag filtering, and instant search — everything you need, nothing you don't.
        </p>
        <div className={styles.ctaRow}>
          <button className={styles.ctaPrimary} onClick={onSignUp}>Get started free</button>
          <button className={styles.ctaSecondary} onClick={onSignIn}>Sign in</button>
        </div>
      </main>

      <section className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>✍️</span>
          <h3>Markdown editing</h3>
          <p>Write in plain text with full Markdown support and live preview.</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🏷️</span>
          <h3>Tags & filtering</h3>
          <p>Organize notes with tags and filter them instantly from the sidebar.</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🔍</span>
          <h3>Instant search</h3>
          <p>Search across all your notes by title or content in real time.</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>☁️</span>
          <h3>Synced everywhere</h3>
          <p>Your notes are saved to the cloud and available on any device.</p>
        </div>
      </section>
    </div>
  );
}
