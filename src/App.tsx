import { useState, useEffect, useRef } from 'react';
import { type AuthUser, logoutUser } from './auth';
import Auth from './Auth';

export function App() {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const initialized               = useRef(false);

  function handleAuth(u: AuthUser) {
    setUser(u);
    setAuthReady(true);
  }

  useEffect(() => {
    if (!authReady || !user || initialized.current) return;
    initialized.current = true;
    setTimeout(() => initApp(user, () => { logoutUser(); window.location.reload(); }), 60);
  }, [authReady, user]);

  if (!authReady) return <Auth onAuth={handleAuth} />;

  return (
    <>
      <div id="toast"></div>
      <div id="ctx-backdrop"></div>
      <div id="context-menu"></div>

      <div id="vol-indicator">
        <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
        <div className="vol-bar-track"><div className="vol-bar-fill" id="vol-bar-fill" style={{width:'70%'}}></div></div>
      </div>

      {/* SPLASH */}
      <div id="splash">
        <div className="splash-logo">
          <div className="splash-logo-ring">
            <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          </div>
        </div>
        <div className="splash-title">Lips<span>&#8209;songs</span></div>
        <div className="splash-card">
          <h3>Возможности</h3>
          <ul>
            <li>Стриминг тегов без полной загрузки</li>
            <li>Визуализатор эквалайзера</li>
            <li>Свайпы и жесты управления</li>
            <li>Плейлисты и избранное</li>
            <li>Загрузка своих треков</li>
          </ul>
        </div>
        <button className="splash-btn" id="splash-enter-btn">Начать слушать</button>
      </div>

      {/* MAIN APP */}
      <div id="app">
        <div id="tabs-container">
          <div id="tabs-wrapper">

            {/* HOME */}
            <div className="tab-page" id="page-home">
              <div className="tab-header">
                <div className="home-header-art" id="home-now-playing-art" style={{display:'none'}}>
                  <div className="home-header-bg-img" id="home-bg-img"></div>
                  <div className="home-header-art-content">
                    <div className="home-header-album-img" id="home-album-img">
                      <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                    </div>
                    <div className="home-header-text">
                      <div className="home-header-label">Сейчас играет</div>
                      <div className="home-header-trackname" id="home-np-name">--</div>
                      <div className="home-header-artist" id="home-np-artist">--</div>
                    </div>
                    <button className="home-header-play" id="home-np-play">
                      <svg id="home-np-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                  </div>
                </div>
                <h1 className="page-title">Главная</h1>
                <div className="search-box">
                  <input type="text" placeholder="Треки, артисты..." id="search-home" autoComplete="off" />
                  <svg className="search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                </div>
              </div>
              <div className="tab-scroll">
                <div className="track-list" id="home-tracks">
                  <div className="loading"><div className="spinner"></div><span>Загрузка треков...</span></div>
                </div>
              </div>
            </div>

            {/* PLAYLISTS */}
            <div className="tab-page" id="page-playlists">
              <div className="tab-header">
                <h1 className="page-title">Плейлисты</h1>
              </div>
              <div className="tab-scroll">
                <div className="playlists-grid" id="playlists-grid"></div>
              </div>
            </div>

            {/* FAVORITES */}
            <div className="tab-page" id="page-favorites">
              <div className="tab-header">
                <h1 className="page-title">Избранное</h1>
                <div className="search-box">
                  <input type="text" placeholder="Поиск в избранном..." id="search-fav" autoComplete="off" />
                  <svg className="search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                </div>
              </div>
              <div className="tab-scroll">
                <div className="track-list" id="fav-tracks"></div>
              </div>
            </div>

            {/* МОЁ */}
            <div className="tab-page" id="page-mine">
              <div className="tab-header">
                <h1 className="page-title">Моё</h1>
              </div>
              <div className="tab-scroll">
                <div className="profile-section" id="profile-section"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Mini Player */}
        <div id="mini-player">
          <div className="mini-img" id="mini-img-wrap">
            <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          </div>
          <div className="mini-info">
            <div className="mini-name"   id="mini-name">--</div>
            <div className="mini-artist" id="mini-artist">--</div>
          </div>
          <div className="eq-bars paused" id="mini-eq">
            <div className="bar" style={{height:'3px'}}></div>
            <div className="bar" style={{height:'3px'}}></div>
            <div className="bar" style={{height:'3px'}}></div>
            <div className="bar" style={{height:'3px'}}></div>
          </div>
          <button className="mini-fav"      id="mini-fav-btn">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
          <button className="mini-play-btn" id="mini-play-btn">
            <svg id="mini-play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <div id="mini-progress-bg"><div id="mini-progress"></div></div>
        </div>

        {/* Bottom Nav */}
        <nav id="bottom-nav">
          <button className="nav-btn active" data-tab="0">
            <div className="nav-dot"></div>
            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span>Главная</span>
          </button>
          <button className="nav-btn" data-tab="1">
            <div className="nav-dot"></div>
            <svg viewBox="0 0 24 24"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></svg>
            <span>Плейлисты</span>
          </button>
          <button className="nav-btn" data-tab="2">
            <div className="nav-dot"></div>
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            <span>Избранное</span>
          </button>
          <button className="nav-btn" data-tab="3">
            <div className="nav-dot"></div>
            <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            <span>Моё</span>
          </button>
        </nav>
      </div>

      {/* Full Player */}
      <div id="full-player">
        <div className="fp-bg-blur" id="fp-bg-blur"></div>
        <div className="fp-handle-area">
          <div className="fp-handle" id="fp-handle"></div>
        </div>
        <div className="fp-img-wrap" id="fp-img-wrap">
          <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          <div className="fp-eq-overlay" id="fp-eq-overlay">
            {[...Array(12)].map((_, i) => <div key={i} className="bar" style={{height:'4px'}}></div>)}
          </div>
        </div>
        <div className="fp-meta">
          <div className="fp-meta-text">
            <div className="fp-name"   id="fp-name">--</div>
            <div className="fp-artist" id="fp-artist">--</div>
          </div>
          <button className="fp-like-btn" id="fp-like-btn">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
        </div>
        <div className="fp-progress">
          <div className="fp-progress-track" id="fp-progress-track">
            <div className="fp-progress-fill" id="fp-progress-fill">
              <div className="fp-progress-thumb"></div>
            </div>
          </div>
          <div className="fp-times">
            <span id="fp-cur">0:00</span>
            <span id="fp-dur">0:00</span>
          </div>
        </div>
        <div className="fp-controls">
          <button className="fp-ctrl ctrl-sm" id="fp-shuffle">
            <svg viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
            <div className="ctrl-indicator"></div>
          </button>
          <button className="fp-ctrl ctrl-md" id="fp-prev">
            <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          <button className="fp-ctrl ctrl-lg" id="fp-play-btn">
            <svg id="fp-play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button className="fp-ctrl ctrl-md" id="fp-next">
            <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
          <button className="fp-ctrl ctrl-sm" id="fp-repeat">
            <svg viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
            <div className="ctrl-indicator"></div>
          </button>
        </div>
        <div className="fp-bottom-actions">
          <button className="fp-action-pill" id="fp-dl-btn">
            <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            <span id="fp-dl-text">Скачать</span>
          </button>
          <button className="fp-action-pill" id="fp-add-pl-btn">
            <svg viewBox="0 0 24 24"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></svg>
            В плейлист
          </button>
        </div>
      </div>

      {/* Playlist View */}
      <div id="playlist-view">
        <div className="pv-header">
          <button className="pv-back"   id="pv-back">
            <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <div className="pv-title" id="pv-title">Плейлист</div>
          <button className="pv-delete" id="pv-delete">
            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
        <div className="pv-actions">
          <button className="pv-action-btn" id="pv-add-all">
            <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Добавить треки
          </button>
          <button className="pv-action-btn" id="pv-add-fav">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            Из избранного
          </button>
        </div>
        <div className="pv-content">
          <div className="track-list" id="pv-tracks"></div>
        </div>
      </div>

      {/* Add tracks modal */}
      <div id="add-tracks-modal">
        <div className="atm-header">
          <button className="atm-close" id="atm-close">
            <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <div className="atm-title" id="atm-title">Добавить треки</div>
          <button className="atm-done"  id="atm-done">Готово</button>
        </div>
        <div className="atm-search">
          <div className="search-box" style={{marginBottom:0}}>
            <input type="text" placeholder="Поиск..." id="search-atm" autoComplete="off" />
            <svg className="search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          </div>
        </div>
        <div className="atm-content" id="atm-list"></div>
      </div>

      {/* Create Playlist Modal */}
      <div id="create-playlist-modal">
        <div className="cpm-sheet">
          <div className="cpm-handle"></div>
          <div className="cpm-title">Новый плейлист</div>
          <input className="cpm-input" id="cpm-input" type="text" placeholder="Название плейлиста" maxLength={50} />
          <div className="cpm-btns">
            <button className="cpm-btn cpm-cancel" id="cpm-cancel">Отмена</button>
            <button className="cpm-btn cpm-create" id="cpm-create">Создать</button>
          </div>
        </div>
      </div>

      <audio id="audio" preload="auto" crossOrigin="anonymous"></audio>
      <input type="file" id="file-input" accept="audio/*" multiple style={{display:'none'}} />
    </>
  );
}

/* ============================================================
   CORE APP LOGIC — runs after React renders the DOM
   ============================================================ */
function initApp(authUser: AuthUser, doLogout: () => void) {
  const MUSIC_PATH = 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z';
  const HEART_PATH = 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z';

  // ── STATE ──
  let allTracks:    any[]    = [];
  let localTracks:  any[]    = [];
  let favorites:    string[] = [];
  let playlists:    any[]    = [];
  let downloaded:   string[] = [];
  let queue:        any[]    = [];
  let queueIdx                = -1;
  let currentTrack: any      = null;
  let isPlaying               = false;
  let isShuffle               = false;
  let repeatMode              = 0;
  let currentTab              = 0;
  let currentPlaylistId: string | null = null;
  let addTracksMode           = 'all';
  let selectedTracks          = new Set<string>();
  let ctxTrack: any           = null;
  let isDraggingProgress      = false;
  let volTimer: any           = null;
  const coverCache: Record<string, string> = {};
  let audioCtx: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let eqData: Uint8Array<ArrayBuffer> | null = null;
  let eqRAF                         = 0;
  let db: IDBDatabase | null        = null;

  const $ = (id: string) => document.getElementById(id);
  const aud = $('audio') as HTMLAudioElement;

  function esc(s: string) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }
  function fmt(s: number) {
    if (!s || isNaN(s)) return '0:00';
    return Math.floor(s / 60) + ':' + ('0' + Math.floor(s % 60)).slice(-2);
  }
  function plural(n: number) {
    const a = Math.abs(n) % 100, n1 = a % 10;
    if (a > 10 && a < 20) return 'ов';
    if (n1 > 1 && n1 < 5) return 'а';
    if (n1 === 1) return '';
    return 'ов';
  }
  function toast(msg: string) {
    const t = $('toast')!;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout((t as any)._t);
    (t as any)._t = setTimeout(() => t.classList.remove('show'), 2200);
  }
  function allList() { return [...allTracks, ...localTracks]; }

  // ── SVG HEART PARTICLES (no emoji) ──
  function spawnHearts(x: number, y: number, count = 6) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'heart-particle';
      el.style.left              = (x + (Math.random() - 0.5) * 64) + 'px';
      el.style.top               = (y + (Math.random() - 0.5) * 44) + 'px';
      el.style.animationDuration = (0.65 + Math.random() * 0.4) + 's';
      el.style.animationDelay    = (Math.random() * 0.18) + 's';
      el.innerHTML               = '<svg viewBox="0 0 24 24"><path d="' + HEART_PATH + '"/></svg>';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  }

  // ── AUDIO CONTEXT ──
  function initAudioCtx() {
    if (audioCtx) return;
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      audioCtx  = new AC() as AudioContext;
      analyser  = audioCtx.createAnalyser();
      analyser.fftSize               = 128;
      analyser.smoothingTimeConstant = 0.78;
      const src = audioCtx.createMediaElementSource(aud);
      src.connect(analyser);
      analyser.connect(audioCtx.destination);
      eqData = new Uint8Array(analyser.frequencyBinCount as number) as unknown as Uint8Array<ArrayBuffer>;
    } catch (e) {}
  }

  function startEq() {
    if (!analyser || !eqData) return;
    $('mini-eq')!.classList.remove('paused');
    function tick() {
      analyser!.getByteFrequencyData(eqData!);
      const step = Math.floor(eqData!.length / 4);
      $('mini-eq')!.querySelectorAll('.bar').forEach((b: any, i) => {
        b.style.height = Math.max(3, (eqData![i * step] / 255) * 18) + 'px';
      });
      const fp = $('fp-eq-overlay');
      if (fp) {
        const fs = Math.floor(eqData!.length / 12);
        fp.querySelectorAll('.bar').forEach((b: any, i) => {
          b.style.height = Math.max(4, (eqData![Math.min(i * fs, eqData!.length - 1)] / 255) * 34) + 'px';
        });
      }
      eqRAF = requestAnimationFrame(tick);
    }
    cancelAnimationFrame(eqRAF);
    tick();
  }

  function stopEq() {
    cancelAnimationFrame(eqRAF);
    $('mini-eq')!.classList.add('paused');
    $('fp-eq-overlay')?.querySelectorAll('.bar').forEach((b: any) => { b.style.height = '4px'; });
  }

  // ── INDEXEDDB (per-user) ──
  const USER_DB = 'LipsSongsDB_' + authUser.uid;

  function openDB(): Promise<IDBDatabase> {
    return new Promise((res, rej) => {
      const r = indexedDB.open(USER_DB, 8);
      r.onupgradeneeded = (e: any) => {
        const d = e.target.result as IDBDatabase;
        ['audioCache', 'coverCache', 'state'].forEach(s => {
          if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, { keyPath: 'id' });
        });
      };
      r.onsuccess = (e: any) => { db = e.target.result; res(db!); };
      r.onerror   = rej;
    });
  }

  function dbPut(store: string, data: any): Promise<void> {
    return new Promise((res, rej) => {
      if (!db) return rej('no db');
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(data);
      tx.oncomplete = () => res();
      tx.onerror    = rej;
    });
  }

  function dbGet(store: string, key: string): Promise<any> {
    return new Promise((res, rej) => {
      if (!db) return rej('no db');
      const tx = db.transaction(store, 'readonly');
      const rq = tx.objectStore(store).get(key);
      rq.onsuccess = () => res(rq.result);
      rq.onerror   = rej;
    });
  }

  async function saveState() {
    try {
      if (!db) return;
      await dbPut('state', { id: 'tab',         v: currentTab });
      await dbPut('state', { id: 'favorites',   v: favorites });
      await dbPut('state', { id: 'playlists',   v: playlists });
      await dbPut('state', { id: 'downloaded',  v: downloaded });
      await dbPut('state', { id: 'localTracks', v: localTracks.map(t => ({
        ...t,
        src: t.src?.startsWith('blob:') ? '' : t.src,
        img: t.img?.startsWith('blob:') ? '' : t.img,
      }))});
    } catch (e) {}
  }

  async function loadState() {
    try {
      if (!db) return;
      const fav = await dbGet('state', 'favorites');  if (fav) favorites  = fav.v || [];
      const pl  = await dbGet('state', 'playlists');  if (pl)  playlists  = pl.v  || [];
      const dl  = await dbGet('state', 'downloaded'); if (dl)  downloaded = dl.v  || [];
      const tab = await dbGet('state', 'tab');        if (tab) currentTab = tab.v || 0;
      const lt  = await dbGet('state', 'localTracks');
      if (lt?.v) {
        localTracks = lt.v;
        for (const t of localTracks) {
          const c  = await dbGet('audioCache', t.id);
          if (c?.blob) t.src = URL.createObjectURL(c.blob);
          const cv = await dbGet('coverCache', t.id);
          if (cv?.blob) { const u = URL.createObjectURL(cv.blob); t.img = u; coverCache[t.id] = u; }
        }
      }
    } catch (e) {}
  }

  // ── ID3 PARSER ──
  function parseID3(buf: ArrayBuffer): any {
    const v = new DataView(buf);
    if (v.getUint8(0) !== 0x49 || v.getUint8(1) !== 0x44 || v.getUint8(2) !== 0x33) return null;
    const ver  = v.getUint8(3);
    const size = ((v.getUint8(6) & 0x7f) << 21) | ((v.getUint8(7) & 0x7f) << 14) |
                 ((v.getUint8(8) & 0x7f) << 7)  |  (v.getUint8(9) & 0x7f);
    const end  = Math.min(10 + size, buf.byteLength);
    let   off  = 10;
    const tags: any = {};
    const TM: any   = { TIT2:'title', TPE1:'artist', TALB:'album', TT2:'title', TP1:'artist', TAL:'album' };

    while (off < end - 10) {
      let id: string, fsz: number, hs: number;
      if (ver >= 3) {
        if (off + 10 > end) break;
        id  = String.fromCharCode(v.getUint8(off), v.getUint8(off+1), v.getUint8(off+2), v.getUint8(off+3));
        fsz = ver === 4
          ? (((v.getUint8(off+4)&0x7f)<<21)|((v.getUint8(off+5)&0x7f)<<14)|((v.getUint8(off+6)&0x7f)<<7)|(v.getUint8(off+7)&0x7f))
          : ((v.getUint8(off+4)<<24)|(v.getUint8(off+5)<<16)|(v.getUint8(off+6)<<8)|v.getUint8(off+7));
        hs = 10;
      } else {
        if (off + 6 > end) break;
        id  = String.fromCharCode(v.getUint8(off), v.getUint8(off+1), v.getUint8(off+2));
        fsz = (v.getUint8(off+3)<<16)|(v.getUint8(off+4)<<8)|v.getUint8(off+5);
        hs  = 6;
      }
      if (fsz <= 0 || fsz > end - off - hs || !id.match(/^[A-Z0-9]+$/)) break;
      const doff = off + hs;
      if (TM[id]) {
        try {
          const enc = v.getUint8(doff);
          let   txt = '';
          if (enc === 0 || enc === 3) {
            txt = new TextDecoder(enc === 3 ? 'utf-8' : 'iso-8859-1').decode(new Uint8Array(buf, doff+1, fsz-1));
          } else {
            const bytes = new Uint8Array(buf, doff+1, fsz-1);
            let   dec   = 'utf-16be';
            if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) dec = 'utf-16le';
            txt = new TextDecoder(dec).decode(bytes);
            if (txt.charCodeAt(0) === 0xFEFF || txt.charCodeAt(0) === 0xFFFE) txt = txt.substring(1);
          }
          txt = txt.replace(/\0/g, '').trim();
          if (txt) tags[TM[id]] = txt;
        } catch (e) {}
      }
      if (id === 'APIC' || id === 'PIC') {
        try {
          let pos = doff;
          const enc = v.getUint8(pos); pos++;
          if (id === 'APIC') {
            let mime = '';
            while (pos < doff + fsz && v.getUint8(pos) !== 0) { mime += String.fromCharCode(v.getUint8(pos)); pos++; }
            pos++; pos++;
            if (enc === 0 || enc === 3) { while (pos < doff+fsz && v.getUint8(pos) !== 0) pos++; pos++; }
            else { while (pos < doff+fsz-1) { if (v.getUint8(pos)===0&&v.getUint8(pos+1)===0){pos+=2;break;} pos+=2; } }
            if (!mime || mime === 'image/') mime = 'image/jpeg';
            const img = new Uint8Array(buf, pos, doff+fsz-pos);
            if (img.length > 100) tags.coverBlob = new Blob([img], { type: mime });
          } else {
            const fmt2 = String.fromCharCode(v.getUint8(pos), v.getUint8(pos+1), v.getUint8(pos+2));
            pos += 3; pos++;
            while (pos < doff+fsz && v.getUint8(pos) !== 0) pos++; pos++;
            const m2   = fmt2.toLowerCase() === 'png' ? 'image/png' : 'image/jpeg';
            const img2 = new Uint8Array(buf, pos, doff+fsz-pos);
            if (img2.length > 100) tags.coverBlob = new Blob([img2], { type: m2 });
          }
        } catch (e) {}
      }
      off = doff + fsz;
    }
    return (tags.title || tags.artist || tags.coverBlob) ? tags : null;
  }

  async function readTagsUrl(url: string): Promise<any> {
    try {
      const r = await fetch(url, { headers: { Range: 'bytes=0-524288' } });
      return parseID3(await r.arrayBuffer());
    } catch { return null; }
  }

  async function readTagsBlob(blob: Blob): Promise<any> {
    try { return parseID3(await blob.slice(0, Math.min(blob.size, 524288)).arrayBuffer()); }
    catch { return null; }
  }

  // ── GITHUB ──
  const GH_API = 'https://api.github.com/repos/Ksaers748/MSBD/contents/track';
  const GH_RAW = 'https://raw.githubusercontent.com/Ksaers748/MSBD/main/track/';

  function parseName(name: string) {
    const noExt = name.replace(/\.[^.]+$/, '');
    const parts = noExt.split(' - ');
    return parts.length >= 2
      ? { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() }
      : { artist: 'Неизвестный', title: noExt };
  }

  async function loadTracks() {
    const ctr = $('home-tracks')!;
    try {
      const resp = await fetch(GH_API, { headers: { Accept: 'application/vnd.github.v3+json' } });
      if (!resp.ok) throw new Error('API ' + resp.status);
      const files: any[] = await resp.json();
      const audioFiles   = files.filter((f: any) => /\.(mp3|wav|ogg|m4a|flac|aac|webm)$/i.test(f.name));

      if (!audioFiles.length) {
        ctr.innerHTML = emptyHTML('Треки не найдены', 'Добавьте аудио в папку track/ репозитория');
        return;
      }

      const tracks = audioFiles.map((f: any) => {
        const { artist, title } = parseName(f.name);
        return {
          id: 'gh_' + f.sha,
          name: title, artist, album: '',
          src: GH_RAW + encodeURIComponent(f.name),
          img: '', isLocal: false, fileName: f.name,
        };
      });

      allTracks = tracks;
      renderAll();

      // Background ID3 reading in batches
      const BATCH = 3;
      for (let i = 0; i < tracks.length; i += BATCH) {
        const batch = tracks.slice(i, i + BATCH);
        await Promise.allSettled(batch.map(async (t: any) => {
          let changed = false;
          // Try cached cover first
          try {
            const cv = await dbGet('coverCache', t.id);
            if (cv?.blob) {
              t.img = URL.createObjectURL(cv.blob);
              coverCache[t.id] = t.img;
              changed = true;
              const tc = await dbGet('state', 'tags_' + t.id);
              if (tc?.v) {
                if (tc.v.title)  t.name   = tc.v.title;
                if (tc.v.artist) t.artist = tc.v.artist;
              }
              if (changed) patchTrackDOM(t);
              return;
            }
          } catch {}

          const tags = await readTagsUrl(t.src);
          if (tags) {
            if (tags.title)  { t.name   = tags.title;  changed = true; }
            if (tags.artist) { t.artist = tags.artist; changed = true; }
            if (tags.album)    t.album  = tags.album;
            if (tags.coverBlob) {
              t.img = URL.createObjectURL(tags.coverBlob);
              coverCache[t.id] = t.img;
              changed = true;
              try { await dbPut('coverCache', { id: t.id, blob: tags.coverBlob }); } catch {}
            }
            try { await dbPut('state', { id: 'tags_' + t.id, v: { title: t.name, artist: t.artist, album: t.album } }); } catch {}
          }
          if (changed) patchTrackDOM(t);
        }));
        updateMiniPlayer();
        updateFullPlayer();
        updateHomeNowPlaying();
      }
    } catch (err) {
      console.error('GitHub load error:', err);
      ctr.innerHTML = emptyHTML('Нет подключения', 'Проверьте интернет и обновите страницу');
    }
  }

  function patchTrackDOM(track: any) {
    document.querySelectorAll('.track-item').forEach(el => {
      const btn = el.querySelector('.track-fav') as HTMLElement | null;
      if (!btn || btn.dataset.trackId !== track.id) return;
      const nm = el.querySelector('.track-name')   as HTMLElement | null;
      const ar = el.querySelector('.track-artist') as HTMLElement | null;
      if (nm) nm.textContent = track.name;
      if (ar) ar.textContent = track.artist;
      if (track.img) {
        const iw = el.querySelector('.track-img') as HTMLElement | null;
        if (iw) {
          const ex = iw.querySelector('img');
          if (ex) ex.src = track.img;
          else iw.innerHTML = '<img src="' + esc(track.img) + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block">';
        }
      }
    });
  }

  // ── SEARCH ──
  const ru2en: Record<string,string> = {'й':'q','ц':'w','у':'e','к':'r','е':'t','н':'y','г':'u','ш':'i','щ':'o','з':'p','ф':'a','ы':'s','в':'d','а':'f','п':'g','р':'h','о':'j','л':'k','д':'l','я':'z','ч':'x','с':'c','м':'v','и':'b','т':'n','ь':'m'};
  const en2ru: Record<string,string> = Object.fromEntries(Object.entries(ru2en).map(([k, v]) => [v, k]));

  function filterTracks(list: any[], q: string) {
    if (!q || !q.trim()) return list;
    const lq = q.toLowerCase().trim();
    let r1 = '', r2 = '';
    for (const c of lq) { r1 += ru2en[c] || c; r2 += en2ru[c] || c; }
    return list.map(t => {
      const full  = (t.artist + ' ' + t.name).toLowerCase();
      let   score = 0;
      if (full === lq) score = 200;
      else if (t.name.toLowerCase().startsWith(lq) || t.artist.toLowerCase().startsWith(lq)) score = 150;
      else if (full.includes(lq) || full.includes(r1) || full.includes(r2)) score = 100;
      else {
        const words = lq.split(/\s+/);
        let   m     = 0;
        words.forEach((w: string) => { if (full.includes(w)) m++; });
        score = (m / words.length) * 60;
      }
      return { t, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).map(r => r.t);
  }

  function getList(ctx: string) {
    const all = allList();
    const q   = ctx === 'home' ? (($('search-home') as HTMLInputElement)?.value || '')
              : ctx === 'fav'  ? (($('search-fav')  as HTMLInputElement)?.value || '')
              : ctx === 'lib'  ? (($('search-lib')  as HTMLInputElement)?.value || '') : '';
    if (ctx === 'home') return filterTracks(all, q);
    if (ctx === 'fav')  return filterTracks(all.filter(t => favorites.includes(t.id)), q);
    if (ctx === 'lib')  return filterTracks(localTracks, q);
    return all;
  }

  // ── HELPERS ──
  function emptyHTML(msg: string, sub = '') {
    return '<div class="empty-state"><svg viewBox="0 0 24 24"><path d="' + MUSIC_PATH + '"/></svg><p>' + msg + '</p>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>';
  }

  function imgHtml(src: string, size = 50) {
    return src
      ? '<img src="' + esc(src) + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block">'
      : '<svg class="ph-icon" viewBox="0 0 24 24" style="width:' + (size > 40 ? 24 : 18) + 'px;height:' + (size > 40 ? 24 : 18) + 'px"><path d="' + MUSIC_PATH + '"/></svg>';
  }

  // ── BUILD TRACK ITEM ──
  function buildTrackItem(track: any, idx: number, ctx: string, isPlCtx = false) {
    const isFav  = favorites.includes(track.id);
    const isCur  = currentTrack && currentTrack.id === track.id;
    const src    = track.img || coverCache[track.id] || '';
    const THRESH = 80;

    const wrap  = document.createElement('div');
    wrap.className = 'track-item-swipe-container';

    const hintL = document.createElement('div');
    hintL.className = 'swipe-hint-left';
    hintL.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + HEART_PATH + '"/></svg>';

    const hintR = document.createElement('div');
    hintR.className = 'swipe-hint-right';
    hintR.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>';

    wrap.appendChild(hintL);
    wrap.appendChild(hintR);

    const el = document.createElement('div');
    el.className = 'track-item' + (isCur ? ' playing' : '');
    el.style.animationDelay = Math.min(idx * 0.03, 0.45) + 's';

    const overlay = isCur
      ? '<div class="track-img-playing-overlay"><svg style="width:17px;height:17px;fill:white" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg></div>'
      : '';

    el.innerHTML =
      '<div class="track-img">' + imgHtml(src) + overlay + '</div>' +
      '<div class="track-info"><div class="track-name">'   + esc(track.name)   + '</div>' +
                              '<div class="track-artist">' + esc(track.artist) + '</div></div>' +
      '<button class="track-fav' + (isFav ? ' liked' : '') + '" data-track-id="' + track.id + '">' +
        '<svg viewBox="0 0 24 24"><path d="' + HEART_PATH + '"/></svg></button>';

    // Swipe gesture
    let sx = 0, sy = 0, swiping = false, curX = 0, swipeLocked = false;
    el.addEventListener('touchstart', (e: TouchEvent) => {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
      swiping = false; curX = 0; swipeLocked = false;
      el.style.transition = 'none';
    }, { passive: true });
    el.addEventListener('touchmove', (e: TouchEvent) => {
      if (swipeLocked) return;
      const dx = e.touches[0].clientX - sx;
      const dy = e.touches[0].clientY - sy;
      if (!swiping && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) swiping = true;
      if (swiping) {
        curX = dx;
        const cl = Math.max(-THRESH * 1.4, Math.min(THRESH * 1.4, dx));
        el.style.transform = 'translateX(' + cl + 'px)';
        const p = Math.min(Math.abs(dx) / THRESH, 1);
        hintL.style.opacity = dx > 0 ? String(p) : '0';
        hintR.style.opacity = dx < 0 ? String(p) : '0';
      }
    }, { passive: true });
    el.addEventListener('touchend', (e: TouchEvent) => {
      el.style.transition = 'transform 0.28s cubic-bezier(0.22,0.68,0.32,1),background 0.25s';
      el.style.transform  = '';
      hintL.style.opacity = '0';
      hintR.style.opacity = '0';
      if (swiping && Math.abs(curX) > THRESH) {
        swipeLocked = true;
        if (curX > 0) {
          const wasFav = favorites.includes(track.id);
          toggleFavorite(track.id);
          if (!wasFav) spawnHearts(e.changedTouches[0].clientX, e.changedTouches[0].clientY, 7);
        } else {
          addToQueue(track);
          toast('Добавлено в очередь');
        }
      }
      swiping = false;
    }, { passive: true });

    // Click → play (whole item)
    el.addEventListener('click', (e: Event) => {
      if ((e.target as Element).closest('.track-fav')) return;
      const list = getList(ctx);
      const i    = list.findIndex((t: any) => t.id === track.id);
      playFromList(list, i >= 0 ? i : 0);
    });

    // Fav button
    const favBtn = el.querySelector('.track-fav') as HTMLElement;
    favBtn.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      const rect    = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const wasFav  = favorites.includes(track.id);
      toggleFavorite(track.id);
      if (!wasFav) spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 5);
    });

    // Long press → context menu
    let lt: any;
    el.addEventListener('touchstart', (e: TouchEvent) => {
      lt = setTimeout(() => showCtxMenu(e.touches[0] as any, track, isPlCtx), 560);
    }, { passive: true });
    el.addEventListener('touchend',  () => clearTimeout(lt));
    el.addEventListener('touchmove', () => clearTimeout(lt), { passive: true });
    el.addEventListener('contextmenu', (e: MouseEvent) => { e.preventDefault(); showCtxMenu(e, track, isPlCtx); });

    wrap.appendChild(el);
    return wrap;
  }

  // ── RENDER ──
  function renderList(ctx: string) {
    const idMap: Record<string, string> = { home: 'home-tracks', fav: 'fav-tracks', lib: 'lib-tracks' };
    const ctr = $(idMap[ctx]);
    if (!ctr) return;
    ctr.innerHTML = '';
    const tracks  = getList(ctx);
    if (!tracks.length) {
      const msgs: Record<string, string> = {
        home: 'Треки не найдены',
        fav:  'Нет избранных треков',
        lib:  'Нет загруженных треков',
      };
      ctr.innerHTML = emptyHTML(msgs[ctx], ctx === 'lib' ? 'Нажмите «Загрузить треки» выше' : '');
      return;
    }
    tracks.forEach((t: any, i: number) => ctr.appendChild(buildTrackItem(t, i, ctx, false)));
  }

  function renderPlaylists() {
    const grid = $('playlists-grid')!;
    grid.innerHTML = '';
    const all = allList();

    // Favorites card
    const favTrack  = all.find((t: any) => favorites.includes(t.id) && (t.img || coverCache[t.id]));
    const favImgSrc = favTrack ? (favTrack.img || coverCache[favTrack.id]) : '';
    const favCard   = document.createElement('div');
    favCard.className = 'playlist-card';
    favCard.innerHTML =
      '<div class="playlist-card-img" style="background:#1a0808">' +
        imgHtml(favImgSrc, 100) +
        '<div class="playlist-card-gradient"></div>' +
      '</div>' +
      '<div class="playlist-card-info">' +
        '<div class="playlist-card-name">Избранное</div>' +
        '<div class="playlist-card-count">' + favorites.length + ' трек' + plural(favorites.length) + '</div>' +
      '</div>';
    favCard.addEventListener('click', () => switchTab(2));
    grid.appendChild(favCard);

    // User playlists
    playlists.forEach((pl: any, i: number) => {
      const card    = document.createElement('div');
      card.className = 'playlist-card';
      card.style.animationDelay = ((i + 1) * 0.07) + 's';

      const plTrack  = pl.trackIds.map((id: string) => all.find((t: any) => t.id === id)).find((t: any) => t && (t.img || coverCache[t.id]));
      const plImgSrc = plTrack ? (plTrack.img || coverCache[plTrack.id]) : '';
      const lum      = 12 + (i * 8) % 14;

      card.innerHTML =
        '<div class="playlist-card-img" style="background:hsl(0,0%,' + lum + '%)">' +
          imgHtml(plImgSrc, 100) +
          '<div class="playlist-card-gradient"></div>' +
        '</div>' +
        '<div class="playlist-card-info">' +
          '<div class="playlist-card-name">' + esc(pl.name) + '</div>' +
          '<div class="playlist-card-count">' + pl.trackIds.length + ' трек' + plural(pl.trackIds.length) + '</div>' +
        '</div>';

      card.addEventListener('click', () => openPlaylistView(pl.id));
      grid.appendChild(card);
    });

    // Create new playlist card
    const cc = document.createElement('div');
    cc.className = 'playlist-card playlist-create';
    cc.innerHTML =
      '<div class="playlist-card-img"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></div>' +
      '<div class="playlist-card-info"><div class="playlist-card-name">Создать</div><div class="playlist-card-count">Новый плейлист</div></div>';
    cc.addEventListener('click', openCreatePlaylist);
    grid.appendChild(cc);
  }

  function renderProfileTab() {
    const sec         = $('profile-section')!;
    const displayName = authUser.displayName || authUser.login || 'Пользователь';
    const photoURL    = authUser.photoURL || '';
    const email       = authUser.login || authUser.email || '';

    sec.innerHTML =
      '<div class="profile-header-card">' +
        '<div class="profile-avatar">' +
          (photoURL
            ? '<img src="' + esc(photoURL) + '" alt="">'
            : '<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>') +
        '</div>' +
        '<div class="profile-info">' +
          '<div class="profile-name">'  + esc(displayName) + '</div>' +
          '<div class="profile-email">' + esc(email) + '</div>' +
          '<div class="profile-badge">Аккаунт активен</div>' +
        '</div>' +
      '</div>' +

      '<div class="profile-stats">' +
        '<div class="stat-card"><div class="stat-number">' + allTracks.length + '</div><div class="stat-label">Треков</div></div>' +
        '<div class="stat-card"><div class="stat-number">' + favorites.length + '</div><div class="stat-label">Любимых</div></div>' +
        '<div class="stat-card"><div class="stat-number">' + playlists.length + '</div><div class="stat-label">Плейлистов</div></div>' +
      '</div>' +

      '<div class="profile-section-title">Музыка</div>' +
      '<div class="profile-menu">' +
        '<button class="profile-menu-item" id="profile-upload-btn">' +
          '<div class="profile-menu-icon" style="background:rgba(255,64,129,0.1)">' +
            '<svg viewBox="0 0 24 24" style="fill:var(--accent);width:18px;height:18px"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>' +
          '</div>' +
          '<div class="profile-menu-text">' +
            '<div class="profile-menu-label">Загрузить треки</div>' +
            '<div class="profile-menu-sub">' + (localTracks.length > 0 ? localTracks.length + ' трек' + plural(localTracks.length) + ' загружено' : 'Добавьте свои аудиофайлы') + '</div>' +
          '</div>' +
          '<svg class="profile-menu-arrow" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>' +
        '</button>' +
        (localTracks.length > 0
          ? '<button class="profile-menu-item" id="profile-mymusic-btn">' +
              '<div class="profile-menu-icon" style="background:rgba(255,107,53,0.1)">' +
                '<svg viewBox="0 0 24 24" style="fill:var(--accent2);width:18px;height:18px"><path d="' + MUSIC_PATH + '"/></svg>' +
              '</div>' +
              '<div class="profile-menu-text">' +
                '<div class="profile-menu-label">Моя музыка</div>' +
                '<div class="profile-menu-sub">' + localTracks.length + ' трек' + plural(localTracks.length) + '</div>' +
              '</div>' +
              '<svg class="profile-menu-arrow" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>' +
            '</button>'
          : '') +
      '</div>' +

      '<div class="profile-section-title">Аккаунт</div>' +
      '<div class="profile-menu">' +
        '<button class="profile-menu-item" id="profile-fav-btn">' +
          '<div class="profile-menu-icon" style="background:rgba(255,64,129,0.1)">' +
            '<svg viewBox="0 0 24 24" style="fill:var(--accent);width:18px;height:18px"><path d="' + HEART_PATH + '"/></svg>' +
          '</div>' +
          '<div class="profile-menu-text"><div class="profile-menu-label">Избранное</div><div class="profile-menu-sub">' + favorites.length + ' трек' + plural(favorites.length) + '</div></div>' +
          '<svg class="profile-menu-arrow" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>' +
        '</button>' +
        '<button class="profile-menu-item" id="profile-pl-btn">' +
          '<div class="profile-menu-icon" style="background:rgba(100,100,100,0.1)">' +
            '<svg viewBox="0 0 24 24" style="fill:var(--text2);width:18px;height:18px"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></svg>' +
          '</div>' +
          '<div class="profile-menu-text"><div class="profile-menu-label">Плейлисты</div><div class="profile-menu-sub">' + playlists.length + ' плейлист' + plural(playlists.length) + '</div></div>' +
          '<svg class="profile-menu-arrow" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>' +
        '</button>' +
      '</div>' +

      '<button class="profile-logout-btn" id="profile-logout-btn">' +
        '<svg viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>' +
        'Выйти из аккаунта' +
      '</button>' +
      '<div class="profile-version">Lips-songs v2.0 · ' + esc(email) + '</div>' +

      // Hidden library search + list (shown when "Моя музыка" tapped)
      '<div class="search-box" style="display:none;margin-top:16px" id="lib-search-box">' +
        '<input type="text" placeholder="Поиск в моей музыке..." id="search-lib" autocomplete="off"/>' +
        '<svg class="search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>' +
      '</div>' +
      '<div class="track-list" id="lib-tracks" style="padding-bottom:0"></div>';

    $('profile-upload-btn')!.addEventListener('click', () => ($('file-input') as HTMLInputElement).click());
    $('profile-fav-btn')!.addEventListener('click',   () => switchTab(2));
    $('profile-pl-btn')!.addEventListener('click',    () => switchTab(1));
    $('profile-logout-btn')!.addEventListener('click', () => {
      if (confirm('Выйти из аккаунта?')) doLogout();
    });

    const mm = $('profile-mymusic-btn');
    if (mm) {
      mm.addEventListener('click', () => {
        const box = $('lib-search-box')!;
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
        renderList('lib');
      });
    }

    if (localTracks.length > 0) {
      $('lib-search-box')!.style.display = 'block';
      renderList('lib');
    }

    $('search-lib')?.addEventListener('input', () => renderList('lib'));
  }

  function renderAll() {
    renderList('home');
    renderList('fav');
    renderPlaylists();
    updateFavUI();
    if (currentTab === 3) renderProfileTab();
  }

  // ── HOME BANNER ──
  function updateHomeNowPlaying() {
    const art = $('home-now-playing-art')!;
    if (!currentTrack) { art.style.display = 'none'; return; }
    art.style.display = 'block';
    $('home-np-name')!.textContent   = currentTrack.name;
    $('home-np-artist')!.textContent = currentTrack.artist;
    const src = currentTrack.img || coverCache[currentTrack.id] || '';
    $('home-album-img')!.innerHTML = imgHtml(src, 66);
    $('home-bg-img')!.innerHTML    = src ? '<img src="' + esc(src) + '">' : '';
    $('home-np-icon')!.innerHTML   = isPlaying
      ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
      : '<path d="M8 5v14l11-7z"/>';
  }

  // ── PLAYER ──
  async function playFromList(list: any[], idx: number) {
    if (!list.length) return;
    queue    = [...list];
    queueIdx = idx;
    await loadAndPlay(queue[queueIdx]);
  }

  async function loadAndPlay(track: any) {
    if (!track) return;
    currentTrack = track;
    initAudioCtx();
    if (audioCtx?.state === 'suspended') audioCtx.resume();
    aud.src = track.src;
    aud.load();
    aud.play().then(() => { isPlaying = true; updatePlayBtns(); startEq(); }).catch(() => {});
    isPlaying = true;
    updatePlayBtns();
    updateMiniPlayer();
    updateFullPlayer();
    updateFavUI();
    updateHomeNowPlaying();
    $('mini-player')!.classList.add('show');
  }

  function addToQueue(track: any) {
    if (!queue.find((t: any) => t.id === track.id)) queue.push(track);
  }

  function togglePlay() {
    if (!currentTrack) return;
    if (isPlaying) { aud.pause(); isPlaying = false; stopEq(); }
    else { if (audioCtx?.state === 'suspended') audioCtx.resume(); aud.play().catch(() => {}); isPlaying = true; startEq(); }
    updatePlayBtns();
    updateHomeNowPlaying();
  }

  function nextTrack() {
    if (!queue.length) return;
    queueIdx = isShuffle ? Math.floor(Math.random() * queue.length) : (queueIdx + 1) % queue.length;
    loadAndPlay(queue[queueIdx]);
  }

  function prevTrack() {
    if (!queue.length) return;
    if (aud.currentTime > 3) { aud.currentTime = 0; return; }
    queueIdx = isShuffle ? Math.floor(Math.random() * queue.length) : (queueIdx - 1 + queue.length) % queue.length;
    loadAndPlay(queue[queueIdx]);
  }

  function toggleShuffle() {
    isShuffle = !isShuffle;
    $('fp-shuffle')!.classList.toggle('active', isShuffle);
    toast(isShuffle ? 'Перемешивание включено' : 'Перемешивание выключено');
  }

  function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    $('fp-repeat')!.classList.toggle('active', repeatMode > 0);
    toast(['Повтор выключен', 'Повтор всех', 'Повтор одного'][repeatMode]);
  }

  aud.addEventListener('ended', () => {
    if (repeatMode === 2) { aud.currentTime = 0; aud.play(); }
    else if (repeatMode === 1 || queueIdx < queue.length - 1) nextTrack();
    else { isPlaying = false; updatePlayBtns(); stopEq(); }
  });

  aud.addEventListener('timeupdate', () => {
    if (!aud.duration) return;
    const pct = (aud.currentTime / aud.duration) * 100;
    $('mini-progress')!.style.width = pct + '%';
    if (!isDraggingProgress) $('fp-progress-fill')!.style.width = pct + '%';
    $('fp-cur')!.textContent = fmt(aud.currentTime);
    $('fp-dur')!.textContent = fmt(aud.duration);
  });

  aud.addEventListener('volumechange', () => {
    ($('vol-bar-fill') as HTMLElement).style.width = (aud.volume * 100) + '%';
    const vi = $('vol-indicator')!;
    vi.classList.add('show');
    clearTimeout(volTimer);
    volTimer = setTimeout(() => vi.classList.remove('show'), 1600);
  });

  // Progress bar
  const progressTrack = $('fp-progress-track')!;
  function seekTo(cx: number) {
    const rect = progressTrack.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (cx - rect.left) / rect.width));
    if (aud.duration) { aud.currentTime = pct * aud.duration; $('fp-progress-fill')!.style.width = (pct * 100) + '%'; }
  }
  progressTrack.addEventListener('click', (e: MouseEvent) => seekTo(e.clientX));
  progressTrack.addEventListener('touchstart', (e: TouchEvent) => {
    isDraggingProgress = true; progressTrack.classList.add('dragging'); seekTo(e.touches[0].clientX);
  }, { passive: true });
  progressTrack.addEventListener('touchmove', (e: TouchEvent) => {
    if (isDraggingProgress) seekTo(e.touches[0].clientX);
  }, { passive: true });
  progressTrack.addEventListener('touchend', () => { isDraggingProgress = false; progressTrack.classList.remove('dragging'); });

  function updatePlayBtns() {
    const play  = '<path d="M8 5v14l11-7z"/>';
    const pause = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    $('mini-play-icon')!.innerHTML = isPlaying ? pause : play;
    $('fp-play-icon')!.innerHTML   = isPlaying ? pause : play;
    const hnp = $('home-np-icon'); if (hnp) hnp.innerHTML = isPlaying ? pause : play;
  }

  function updateMiniPlayer() {
    if (!currentTrack) return;
    $('mini-name')!.textContent   = currentTrack.name;
    $('mini-artist')!.textContent = currentTrack.artist;
    const src = currentTrack.img || coverCache[currentTrack.id] || '';
    $('mini-img-wrap')!.innerHTML = imgHtml(src, 42);
  }

  function updateFullPlayer() {
    if (!currentTrack) return;
    $('fp-name')!.textContent   = currentTrack.name;
    $('fp-artist')!.textContent = currentTrack.artist;
    const src    = currentTrack.img || coverCache[currentTrack.id] || '';
    const eqOvr  = $('fp-eq-overlay');
    const eqStr  = eqOvr ? eqOvr.outerHTML : '';
    $('fp-img-wrap')!.innerHTML  = imgHtml(src, 310) + eqStr;
    const bg = $('fp-bg-blur') as HTMLElement;
    if (src) { bg.style.backgroundImage = 'url(' + src + ')'; bg.style.backgroundSize = 'cover'; bg.style.backgroundPosition = 'center'; }
    else bg.style.backgroundImage = 'none';
    const isDl = downloaded.includes(currentTrack.id) || currentTrack.isLocal;
    $('fp-dl-btn')!.classList.toggle('active', isDl);
    $('fp-dl-text')!.textContent = isDl ? 'Скачано' : 'Скачать';
  }

  function updateFavUI() {
    if (!currentTrack) return;
    const isFav = favorites.includes(currentTrack.id);
    $('mini-fav-btn')!.classList.toggle('liked', isFav);
    $('fp-like-btn')!.classList.toggle('liked', isFav);
  }

  // ── FULL PLAYER ──
  const fullPlayer = $('full-player')!;
  const miniPlayer = $('mini-player')!;

  function openFullPlayer()  { fullPlayer.classList.add('show'); updateFullPlayer(); updateFavUI(); }
  function closeFullPlayer() { fullPlayer.classList.remove('show'); }

  miniPlayer.addEventListener('click', (e: MouseEvent) => {
    if ((e.target as Element).closest('.mini-play-btn') || (e.target as Element).closest('.mini-fav')) return;
    openFullPlayer();
  });
  $('mini-play-btn')!.addEventListener('click', (e: Event) => { e.stopPropagation(); togglePlay(); });
  $('mini-fav-btn')!.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    if (!currentTrack) return;
    const btn  = $('mini-fav-btn')!;
    const rect = btn.getBoundingClientRect();
    const wasFav = favorites.includes(currentTrack.id);
    toggleFavorite(currentTrack.id);
    if (!wasFav) spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 5);
  });

  $('fp-handle')!.addEventListener('click', closeFullPlayer);
  $('fp-play-btn')!.addEventListener('click', togglePlay);
  $('fp-prev')!.addEventListener('click', prevTrack);
  $('fp-next')!.addEventListener('click', nextTrack);
  $('fp-shuffle')!.addEventListener('click', toggleShuffle);
  $('fp-repeat')!.addEventListener('click', toggleRepeat);
  $('fp-like-btn')!.addEventListener('click', () => {
    if (!currentTrack) return;
    const btn  = $('fp-like-btn')!;
    const rect = btn.getBoundingClientRect();
    const wasFav = favorites.includes(currentTrack.id);
    toggleFavorite(currentTrack.id);
    if (!wasFav) spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
  });
  $('home-np-play')!.addEventListener('click', togglePlay);
  $('home-now-playing-art')!.addEventListener('click', (e: MouseEvent) => {
    if (!(e.target as Element).closest('.home-header-play')) openFullPlayer();
  });

  // Swipe down to close full player
  let fpTY = 0;
  fullPlayer.addEventListener('touchstart', (e: TouchEvent) => { fpTY = e.touches[0].clientY; }, { passive: true });
  fullPlayer.addEventListener('touchend', (e: TouchEvent) => {
    if (e.changedTouches[0].clientY - fpTY > 95) closeFullPlayer();
  });

  // Swipe cover L/R → prev/next
  const fpImgWrap = $('fp-img-wrap')!;
  let fpImgX = 0;
  fpImgWrap.addEventListener('touchstart', (e: TouchEvent) => { fpImgX = e.touches[0].clientX; }, { passive: true });
  fpImgWrap.addEventListener('touchend', (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - fpImgX;
    if (Math.abs(dx) > 65) {
      fpImgWrap.style.transition = 'transform 0.14s ease,opacity 0.14s';
      fpImgWrap.style.transform  = dx < 0 ? 'translateX(-36px) scale(0.94)' : 'translateX(36px) scale(0.94)';
      fpImgWrap.style.opacity    = '0.45';
      setTimeout(() => {
        fpImgWrap.style.transition = 'none';
        fpImgWrap.style.transform  = dx < 0 ? 'translateX(30px)' : 'translateX(-30px)';
        dx < 0 ? nextTrack() : prevTrack();
        setTimeout(() => {
          fpImgWrap.style.transition = 'transform 0.38s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s';
          fpImgWrap.style.transform  = '';
          fpImgWrap.style.opacity    = '';
        }, 40);
      }, 140);
    }
  });

  // Swipe mini player L/R
  let mpX = 0;
  miniPlayer.addEventListener('touchstart', (e: TouchEvent) => { mpX = e.touches[0].clientX; }, { passive: true });
  miniPlayer.addEventListener('touchend', (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - mpX;
    if (Math.abs(dx) > 75) { dx < 0 ? nextTrack() : prevTrack(); }
  });

  // ── FAVORITES ──
  function toggleFavorite(id: string) {
    const idx    = favorites.indexOf(id);
    const adding = idx < 0;
    if (idx >= 0) favorites.splice(idx, 1); else favorites.push(id);
    toast(adding ? 'Добавлено в избранное' : 'Убрано из избранного');
    saveState();

    // Surgical DOM update — no full re-render
    document.querySelectorAll('.track-item').forEach(el => {
      const btn = el.querySelector('.track-fav') as HTMLElement | null;
      if (!btn || btn.dataset.trackId !== id) return;
      btn.classList.toggle('liked', adding);
      btn.classList.remove('heart-pop');
      void (btn as any).offsetWidth;
      if (adding) btn.classList.add('heart-pop');
    });

    const fc = $('fav-tracks');
    if (fc) {
      if (!adding) {
        fc.querySelectorAll('.track-item').forEach(el => {
          const btn = el.querySelector('.track-fav') as HTMLElement | null;
          if (btn && btn.dataset.trackId === id) {
            const w = (el.closest('.track-item-swipe-container') || el) as HTMLElement;
            w.style.transition = 'opacity 0.22s,transform 0.22s';
            w.style.opacity    = '0';
            w.style.transform  = 'scaleY(0.7)';
            setTimeout(() => { w.remove(); checkFavEmpty(); }, 230);
          }
        });
      } else {
        const track = allList().find((t: any) => t.id === id);
        if (track) {
          const newItem = buildTrackItem(track, fc.children.length, 'fav', false) as HTMLElement;
          newItem.style.opacity   = '0';
          newItem.style.transform = 'translateY(12px)';
          fc.querySelector('.empty-state')?.remove();
          fc.appendChild(newItem);
          requestAnimationFrame(() => {
            newItem.style.transition = 'opacity 0.28s,transform 0.28s';
            newItem.style.opacity    = '1';
            newItem.style.transform  = '';
          });
        }
      }
    }

    updateFavUI();
    renderPlaylists();
    if (currentPlaylistId) renderPlaylistTracks();
    if (currentTab === 3) renderProfileTab();
  }

  function checkFavEmpty() {
    const fc = $('fav-tracks');
    if (!fc) return;
    if (!fc.querySelectorAll('.track-item-swipe-container').length)
      fc.innerHTML = emptyHTML('Нет избранных треков');
  }

  // ── DOWNLOAD ──
  $('fp-dl-btn')!.addEventListener('click', async () => {
    if (!currentTrack) return;
    if (downloaded.includes(currentTrack.id) || currentTrack.isLocal) { toast('Уже скачано'); return; }
    toast('Скачивание...');
    try {
      const r    = await fetch(currentTrack.src);
      const blob = await r.blob();
      await dbPut('audioCache', { id: currentTrack.id, blob });
      downloaded.push(currentTrack.id);
      await saveState();
      updateFullPlayer();
      toast('Трек скачан');
    } catch { toast('Ошибка скачивания'); }
  });

  // ── PLAYLISTS ──
  function openCreatePlaylist() {
    const m = $('create-playlist-modal')!;
    m.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('show')));
    setTimeout(() => ($('cpm-input') as HTMLInputElement).focus(), 220);
  }

  function closeCreatePlaylist() {
    $('create-playlist-modal')!.classList.remove('show');
    setTimeout(() => { $('create-playlist-modal')!.style.display = 'none'; }, 380);
    ($('cpm-input') as HTMLInputElement).value = '';
  }

  function createPlaylist() {
    const name = ($('cpm-input') as HTMLInputElement).value.trim();
    if (!name) { toast('Введите название'); return; }
    playlists.push({ id: 'pl_' + Date.now(), name, trackIds: [] });
    saveState(); closeCreatePlaylist(); renderPlaylists(); toast('Плейлист создан');
  }

  $('cpm-cancel')!.addEventListener('click', closeCreatePlaylist);
  $('cpm-create')!.addEventListener('click', createPlaylist);
  ($('cpm-input') as HTMLInputElement).addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Enter') createPlaylist(); });
  $('create-playlist-modal')!.addEventListener('click', (e: MouseEvent) => { if (e.target === $('create-playlist-modal')) closeCreatePlaylist(); });

  function openPlaylistView(id: string) {
    currentPlaylistId = id;
    const pl = playlists.find((p: any) => p.id === id);
    if (!pl) return;
    $('pv-title')!.textContent = pl.name;
    renderPlaylistTracks();
    $('playlist-view')!.classList.add('show');
  }

  function closePlaylistView() {
    $('playlist-view')!.classList.remove('show');
    currentPlaylistId = null;
  }

  $('pv-back')!.addEventListener('click', closePlaylistView);

  function renderPlaylistTracks() {
    const pl  = playlists.find((p: any) => p.id === currentPlaylistId);
    const ctr = $('pv-tracks')!;
    ctr.innerHTML = '';
    if (!pl) return;
    const all    = allList();
    const tracks = pl.trackIds.map((id: string) => all.find((t: any) => t.id === id)).filter(Boolean);
    if (!tracks.length) { ctr.innerHTML = emptyHTML('Нет треков', 'Добавьте треки кнопками выше'); return; }
    tracks.forEach((t: any, i: number) => {
      const item = buildTrackItem(t, i, 'playlist', true);
      const el   = item.querySelector('.track-item')!;
      el.addEventListener('click', (e: Event) => {
        if (!(e.target as Element).closest('.track-fav')) playFromList(tracks, i);
      });
      ctr.appendChild(item);
    });
  }

  $('pv-delete')!.addEventListener('click', () => {
    if (!currentPlaylistId) return;
    playlists = playlists.filter((p: any) => p.id !== currentPlaylistId);
    saveState(); closePlaylistView(); renderPlaylists(); toast('Плейлист удалён');
  });
  $('pv-add-all')!.addEventListener('click', () => openAddTracks('all'));
  $('pv-add-fav')!.addEventListener('click', () => openAddTracks('fav'));

  $('fp-add-pl-btn')!.addEventListener('click', () => {
    if (!currentTrack) return;
    ctxTrack = currentTrack;
    closeFullPlayer();
    setTimeout(() => {
      if (!playlists.length) { openCreatePlaylist(); return; }
      showPlaylistPicker(ctxTrack);
    }, 360);
  });

  function showPlaylistPicker(track: any) {
    const menu = $('context-menu')!;
    menu.innerHTML = '<div class="ctx-item" style="font-weight:700;color:var(--accent);cursor:default;pointer-events:none">Выберите плейлист</div>';
    playlists.forEach((pl: any) => {
      const div = document.createElement('div');
      div.className = 'ctx-item';
      div.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></svg><span>' + esc(pl.name) + '</span>';
      div.addEventListener('click', () => {
        if (!pl.trackIds.includes(track.id)) pl.trackIds.push(track.id);
        saveState(); renderPlaylists(); hideCtxMenu();
        toast('Добавлено в «' + pl.name + '»');
      });
      menu.appendChild(div);
    });
    const bd = $('ctx-backdrop')!;
    bd.style.display = 'block';
    bd.classList.add('show');
    menu.classList.add('show');
    menu.style.cssText = 'bottom:130px;left:50%;right:auto;top:auto;transform:translateX(-50%)';
  }

  // ── ADD TRACKS MODAL ──
  function openAddTracks(mode: string) {
    addTracksMode  = mode;
    selectedTracks = new Set();
    $('atm-title')!.textContent = mode === 'fav' ? 'Из избранного' : 'Добавить треки';
    ($('search-atm') as HTMLInputElement).value = '';
    renderAddTracksList();
    $('add-tracks-modal')!.classList.add('show');
  }

  function closeAddTracks() { $('add-tracks-modal')!.classList.remove('show'); }

  function renderAddTracksList() {
    const pl  = playlists.find((p: any) => p.id === currentPlaylistId);
    const ctr = $('atm-list')!;
    ctr.innerHTML = '';
    if (!pl) return;
    const all = allList();
    let tracks = addTracksMode === 'fav'
      ? all.filter((t: any) => favorites.includes(t.id) && !pl.trackIds.includes(t.id))
      : all.filter((t: any) => !pl.trackIds.includes(t.id));
    tracks = filterTracks(tracks, ($('search-atm') as HTMLInputElement).value);
    if (!tracks.length) { ctr.innerHTML = '<div class="empty-state"><p>Нет доступных треков</p></div>'; return; }
    tracks.forEach((t: any) => {
      const src = t.img || coverCache[t.id] || '';
      const div = document.createElement('div');
      div.className = 'track-item-sel';
      div.innerHTML =
        '<div class="sel-check' + (selectedTracks.has(t.id) ? ' on' : '') + '">' +
          '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>' +
        '</div>' +
        '<div class="track-img">' + imgHtml(src) + '</div>' +
        '<div class="track-info"><div class="track-name">' + esc(t.name) + '</div><div class="track-artist">' + esc(t.artist) + '</div></div>';
      div.addEventListener('click', () => {
        if (selectedTracks.has(t.id)) selectedTracks.delete(t.id); else selectedTracks.add(t.id);
        div.querySelector('.sel-check')!.classList.toggle('on');
      });
      ctr.appendChild(div);
    });
  }

  $('atm-close')!.addEventListener('click', closeAddTracks);
  $('search-atm')!.addEventListener('input', renderAddTracksList);
  $('atm-done')!.addEventListener('click', () => {
    const pl = playlists.find((p: any) => p.id === currentPlaylistId);
    if (!pl) return;
    let added = 0;
    selectedTracks.forEach((id: string) => { if (!pl.trackIds.includes(id)) { pl.trackIds.push(id); added++; } });
    saveState(); closeAddTracks(); renderPlaylistTracks(); renderPlaylists();
    toast('Добавлено ' + added + ' трек' + plural(added));
  });

  // ── CONTEXT MENU ──
  function showCtxMenu(e: MouseEvent | Touch, track: any, isPlCtx: boolean) {
    ctxTrack       = track;
    const isFav    = favorites.includes(track.id);
    const menu     = $('context-menu')!;
    menu.innerHTML =
      '<div class="ctx-item" id="cm-fav"><svg viewBox="0 0 24 24"><path d="' + HEART_PATH + '"/></svg><span>' + (isFav ? 'Убрать из избранного' : 'В избранное') + '</span></div>' +
      '<div class="ctx-item" id="cm-queue"><svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg><span>В очередь</span></div>' +
      '<div class="ctx-item" id="cm-pl"><svg viewBox="0 0 24 24"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></svg><span>В плейлист</span></div>' +
      (isPlCtx ? '<div class="ctx-item danger" id="cm-remove"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg><span>Убрать из плейлиста</span></div>' : '');

    $('cm-fav')!.addEventListener('click', () => {
      const r = $('cm-fav')!.getBoundingClientRect();
      const wasAdding = !favorites.includes(track.id);
      toggleFavorite(track.id);
      if (wasAdding) spawnHearts(r.left + r.width / 2, r.top, 4);
      hideCtxMenu();
    });
    $('cm-queue')!.addEventListener('click', () => { addToQueue(track); toast('Добавлено в очередь'); hideCtxMenu(); });
    $('cm-pl')!.addEventListener('click', () => { hideCtxMenu(); if (!playlists.length) { openCreatePlaylist(); return; } showPlaylistPicker(track); });

    if (isPlCtx) {
      $('cm-remove')!.addEventListener('click', () => {
        const pl = playlists.find((p: any) => p.id === currentPlaylistId);
        if (pl) { pl.trackIds = pl.trackIds.filter((id: string) => id !== track.id); saveState(); renderPlaylistTracks(); renderPlaylists(); }
        hideCtxMenu(); toast('Удалено из плейлиста');
      });
    }

    const ex = (e as MouseEvent).clientX ?? window.innerWidth  / 2;
    const ey = (e as MouseEvent).clientY ?? window.innerHeight / 2;
    menu.style.left      = Math.min(ex, window.innerWidth  - 220) + 'px';
    menu.style.top       = Math.min(ey, window.innerHeight - 200) + 'px';
    menu.style.right     = 'auto';
    menu.style.bottom    = 'auto';
    menu.style.transform = '';

    const bd = $('ctx-backdrop')!;
    bd.style.display = 'block';
    bd.classList.add('show');
    menu.classList.add('show');
  }

  function hideCtxMenu() {
    $('context-menu')!.classList.remove('show');
    const b = $('ctx-backdrop')!;
    b.classList.remove('show');
    setTimeout(() => { if (!b.classList.contains('show')) b.style.display = 'none'; }, 280);
  }

  $('ctx-backdrop')!.addEventListener('click', hideCtxMenu);

  // ── FILE UPLOAD ──
  $('file-input')!.addEventListener('change', async (e: Event) => {
    const files = Array.from((e.target as HTMLInputElement).files || []);
    if (!files.length) return;
    toast('Обработка файлов...');
    for (const file of files) {
      const id = 'local_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      let { artist, title: name } = parseName(file.name);
      let img = '';
      try {
        const tags = await readTagsBlob(file);
        if (tags) {
          if (tags.title)     name   = tags.title;
          if (tags.artist)    artist = tags.artist;
          if (tags.coverBlob) {
            img = URL.createObjectURL(tags.coverBlob);
            coverCache[id] = img;
            try { await dbPut('coverCache', { id, blob: tags.coverBlob }); } catch {}
          }
        }
      } catch {}
      await dbPut('audioCache', { id, blob: file });
      localTracks.push({ id, name, artist, album: '', src: URL.createObjectURL(file), img, isLocal: true });
      downloaded.push(id);
    }
    await saveState();
    renderAll();
    if (currentTab === 3) renderProfileTab();
    toast('Добавлено ' + files.length + ' трек' + plural(files.length));
    (e.target as HTMLInputElement).value = '';
  });

  // ── TABS ──
  const tabsWrapper   = $('tabs-wrapper')!;
  const tabsContainer = $('tabs-container')!;

  function switchTab(idx: number) {
    currentTab = idx;
    tabsWrapper.style.transform = 'translateX(-' + (idx * 25) + '%)';
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt((btn as HTMLElement).dataset.tab!) === idx);
    });
    if      (idx === 0) renderList('home');
    else if (idx === 1) renderPlaylists();
    else if (idx === 2) renderList('fav');
    else if (idx === 3) renderProfileTab();
    saveState();
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(parseInt((btn as HTMLElement).dataset.tab!)));
  });

  // Tab swipe
  let tsX = 0, tsY = 0, tsSw = false, tsDx = 0;
  tabsContainer.addEventListener('touchstart', (e: TouchEvent) => {
    tsX = e.touches[0].clientX; tsY = e.touches[0].clientY; tsSw = false; tsDx = 0;
  }, { passive: true });
  tabsContainer.addEventListener('touchmove', (e: TouchEvent) => {
    const dx = e.touches[0].clientX - tsX;
    const dy = e.touches[0].clientY - tsY;
    if (!tsSw && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) { tsSw = true; tabsWrapper.style.transition = 'none'; }
    if (tsSw) {
      tsDx = dx;
      const base = -currentTab * 25;
      const off  = (dx / tabsContainer.offsetWidth) * 25;
      let   t    = base + off;
      if (t > 0)   t = t * 0.22;
      if (t < -75) t = -75 + (t + 75) * 0.22;
      tabsWrapper.style.transform = 'translateX(' + t + '%)';
    }
  }, { passive: true });
  tabsContainer.addEventListener('touchend', () => {
    tabsWrapper.style.transition = '';
    if (!tsSw) return;
    if (tsDx < -50 && currentTab < 3) switchTab(currentTab + 1);
    else if (tsDx > 50 && currentTab > 0) switchTab(currentTab - 1);
    else switchTab(currentTab);
  });

  $('search-home')!.addEventListener('input', () => renderList('home'));
  $('search-fav')!.addEventListener('input',  () => renderList('fav'));

  // ── SPLASH ──
  function enterApp() {
    const s = $('splash')!;
    s.classList.add('hide');
    setTimeout(() => {
      s.style.display = 'none';
      $('app')!.classList.add('show');
      switchTab(currentTab);
    }, 680);
  }
  $('splash-enter-btn')!.addEventListener('click', enterApp);

  // ── MAIN INIT ──
  (async () => {
    try { await openDB(); await loadState(); } catch {}
    renderAll();
    await loadTracks();
  })();
}
