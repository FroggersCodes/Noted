import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

export function AuthPage({ initialMode = 'login', onBack }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSignedUp(true);
      }
    }

    setLoading(false);
  }

  if (signedUp) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.logo}>📝</div>
          <h1 className={styles.appName}>Noted</h1>
          <p className={styles.confirm}>
            Check your email to confirm your account, then sign in.
          </p>
          <button className={styles.link} onClick={() => { setSignedUp(false); setMode('login'); }}>
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>← Back</button>
        )}
        <div className={styles.logo}>📝</div>
        <h1 className={styles.appName}>Noted</h1>
        <h2 className={styles.heading}>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              className={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className={styles.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className={styles.link}
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
