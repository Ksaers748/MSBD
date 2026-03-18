// ─────────────────────────────────────────────
// Простая локальная аутентификация — IndexedDB
// Только логин + пароль, без email-верификации
// ─────────────────────────────────────────────

export interface AuthUser {
  uid:         string;
  login:       string;   // имя пользователя
  email:       string;   // опционально
  displayName: string;
  photoURL:    string;
  createdAt:   number;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

const DB_NAME     = 'LipsAuthDB';
const DB_VERSION  = 2;
const SESSION_KEY = 'lips_session_uid';

let authDB: IDBDatabase | null = null;

function openAuthDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, DB_VERSION);
    r.onupgradeneeded = (e: any) => {
      const d = e.target.result as IDBDatabase;
      if (!d.objectStoreNames.contains('users'))   d.createObjectStore('users',   { keyPath: 'uid' });
      if (!d.objectStoreNames.contains('byLogin')) d.createObjectStore('byLogin', { keyPath: 'login' });
    };
    r.onsuccess = (e: any) => { authDB = e.target.result; res(authDB!); };
    r.onerror   = rej;
  });
}

function put(store: string, data: any): Promise<void> {
  return new Promise((res, rej) => {
    const tx = authDB!.transaction(store, 'readwrite');
    tx.objectStore(store).put(data);
    tx.oncomplete = () => res();
    tx.onerror    = rej;
  });
}

function get(store: string, key: string): Promise<any> {
  return new Promise((res, rej) => {
    const tx = authDB!.transaction(store, 'readonly');
    const rq = tx.objectStore(store).get(key);
    rq.onsuccess = () => res(rq.result);
    rq.onerror   = rej;
  });
}

async function hash(password: string): Promise<string> {
  const buf = new TextEncoder().encode(password + 'lips_v2_salt');
  const h   = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function uid(): string {
  return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

export async function initAuth(): Promise<void> {
  await openAuthDB();
}

// ── Регистрация ──
export async function registerUser(
  login:    string,
  password: string,
  name:     string,
): Promise<AuthUser> {
  login = login.toLowerCase().trim();
  if (!login || !password) throw new Error('Заполните все поля');
  if (login.length < 3)    throw new Error('Логин минимум 3 символа');
  if (password.length < 4) throw new Error('Пароль минимум 4 символа');
  if (!/^[a-z0-9_.]+$/.test(login)) throw new Error('Логин: только a-z, 0-9, _ .');

  const exists = await get('byLogin', login);
  if (exists) throw new Error('Этот логин уже занят');

  const passwordHash = await hash(password);
  const u: StoredUser = {
    uid:          uid(),
    login,
    email:        '',
    displayName:  name.trim() || login,
    photoURL:     '',
    createdAt:    Date.now(),
    passwordHash,
  };

  await put('users',   u);
  await put('byLogin', { login, uid: u.uid });

  localStorage.setItem(SESSION_KEY, u.uid);
  return toPublic(u);
}

// ── Вход ──
export async function loginUser(login: string, password: string): Promise<AuthUser> {
  login = login.toLowerCase().trim();
  if (!login || !password) throw new Error('Заполните все поля');

  const ref: { login: string; uid: string } | undefined = await get('byLogin', login);
  if (!ref) throw new Error('Пользователь не найден');

  const user: StoredUser = await get('users', ref.uid);
  if (!user) throw new Error('Пользователь не найден');

  const h = await hash(password);
  if (h !== user.passwordHash) throw new Error('Неверный пароль');

  localStorage.setItem(SESSION_KEY, user.uid);
  return toPublic(user);
}

// ── Сессия ──
export async function getSessionUser(): Promise<AuthUser | null> {
  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  try {
    const user: StoredUser = await get('users', id);
    return user ? toPublic(user) : null;
  } catch { return null; }
}

// ── Выход ──
export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

function toPublic(u: StoredUser): AuthUser {
  return {
    uid:         u.uid,
    login:       u.login,
    email:       u.email,
    displayName: u.displayName,
    photoURL:    u.photoURL,
    createdAt:   u.createdAt,
  };
}
