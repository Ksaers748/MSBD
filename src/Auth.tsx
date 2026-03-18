import { useState, useEffect } from 'react';
import { initAuth, loginUser, registerUser, getSessionUser, type AuthUser } from './auth';

type Screen = 'login' | 'register';

interface Props {
  onAuth: (user: AuthUser) => void;
}

const MUSIC_PATH = 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z';
const EYE_ON  = 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z';
const EYE_OFF = 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z';

/* ── Floating-label input ── */
interface FInputProps {
  label:       string;
  type?:       string;
  value:       string;
  onChange:    (v: string) => void;
  disabled?:   boolean;
  autoComplete?: string;
  hint?:       string;
  rightEl?:    React.ReactNode;
  autoFocus?:  boolean;
}

function FInput({ label, type = 'text', value, onChange, disabled, autoComplete, hint, rightEl, autoFocus }: FInputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="fi-wrap">
      <div className={`fi-box${focused ? ' fi-focused' : ''}${lifted ? ' fi-lifted' : ''}`}>
        <label className={`fi-label${lifted ? ' fi-label-up' : ''}`}>{label}</label>
        <input
          className="fi-input"
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
        />
        {rightEl && <div className="fi-right">{rightEl}</div>}
      </div>
      {hint && <div className="fi-hint">{hint}</div>}
    </div>
  );
}

export default function Auth({ onAuth }: Props) {
  const [screen,   setScreen]   = useState<Screen>('login');
  const [login,    setLogin]    = useState('');
  const [name,     setName]     = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [shake,    setShake]    = useState(false);
  const [checking, setChecking] = useState(true);

  /* Auto-login if session exists */
  useEffect(() => {
    (async () => {
      try {
        await initAuth();
        const u = await getSessionUser();
        if (u) { onAuth(u); return; }
      } catch {}
      setChecking(false);
    })();
  }, []);

  function triggerShake(msg: string) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 580);
  }

  function switchScreen(s: Screen) {
    setScreen(s);
    setError('');
    setPassword('');
    setShowPass(false);
  }

  /* ── LOGIN ── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!login.trim() || !password) { triggerShake('Заполните все поля'); return; }
    setLoading(true); setError('');
    try {
      const u = await loginUser(login, password);
      onAuth(u);
    } catch (err: any) {
      triggerShake(err.message || 'Ошибка входа');
    }
    setLoading(false);
  }

  /* ── REGISTER ── */
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!login.trim() || !password) { triggerShake('Заполните все поля'); return; }
    setLoading(true); setError('');
    try {
      const u = await registerUser(login, password, name);
      onAuth(u);
    } catch (err: any) {
      triggerShake(err.message || 'Ошибка регистрации');
    }
    setLoading(false);
  }

  const eyeBtn = (
    <button
      type="button"
      className="fi-eye"
      onClick={() => setShowPass(v => !v)}
      tabIndex={-1}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d={showPass ? EYE_OFF : EYE_ON} />
      </svg>
    </button>
  );

  if (checking) {
    return (
      <div id="auth-root">
        <div className="auth-checking">
          <div className="auth-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div id="auth-root">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className={`auth-card${shake ? ' auth-shake' : ''}`}>

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-ring">
            <svg viewBox="0 0 24 24"><path d={MUSIC_PATH} /></svg>
          </div>
          <div className="auth-app-name">Lips<span>&#8209;songs</span></div>
        </div>

        {/* ── TABS ── */}
        <div className="auth-tabs">
          <button
            className={`auth-tab${screen === 'login' ? ' active' : ''}`}
            onClick={() => switchScreen('login')}
            type="button"
          >
            Войти
          </button>
          <button
            className={`auth-tab${screen === 'register' ? ' active' : ''}`}
            onClick={() => switchScreen('register')}
            type="button"
          >
            Регистрация
          </button>
          <div className={`auth-tab-indicator${screen === 'register' ? ' right' : ''}`} />
        </div>

        {/* ── LOGIN FORM ── */}
        {screen === 'login' && (
          <form className="auth-form" onSubmit={handleLogin} autoComplete="on" key="login">
            {error && <div className="auth-error">{error}</div>}

            <FInput
              label="Логин"
              value={login}
              onChange={setLogin}
              disabled={loading}
              autoComplete="username"
              autoFocus
            />

            <FInput
              label="Пароль"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              disabled={loading}
              autoComplete="current-password"
              rightEl={eyeBtn}
            />

            <button type="submit" className="auth-btn-main" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Войти'}
            </button>

            <div className="auth-switch-hint">
              Нет аккаунта?{' '}
              <button type="button" onClick={() => switchScreen('register')}>
                Зарегистрироваться
              </button>
            </div>
          </form>
        )}

        {/* ── REGISTER FORM ── */}
        {screen === 'register' && (
          <form className="auth-form" onSubmit={handleRegister} autoComplete="on" key="register">
            {error && <div className="auth-error">{error}</div>}

            <FInput
              label="Имя (необязательно)"
              value={name}
              onChange={setName}
              disabled={loading}
              autoComplete="name"
              autoFocus
            />

            <FInput
              label="Логин"
              value={login}
              onChange={setLogin}
              disabled={loading}
              autoComplete="username"
              hint="a–z, 0–9, _ . · минимум 3 символа"
            />

            <FInput
              label="Пароль"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              disabled={loading}
              autoComplete="new-password"
              hint="Минимум 4 символа"
              rightEl={eyeBtn}
            />

            <button type="submit" className="auth-btn-main" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Создать аккаунт'}
            </button>

            <div className="auth-switch-hint">
              Уже есть аккаунт?{' '}
              <button type="button" onClick={() => switchScreen('login')}>
                Войти
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
