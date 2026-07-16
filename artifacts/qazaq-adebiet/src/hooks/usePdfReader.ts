import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  ReaderState, PersistentReaderData, Bookmark, PageNote, Highlight,
  ReadingMode, PageLayout, ScrollMode,
} from '@/types/pdf-reader';

const STORAGE_KEY = (slug: string) => `qazaq_pdf_reader_${slug}`;

const DEFAULT_PERSISTENT: PersistentReaderData = {
  bookmarks: [],
  notes: [],
  highlights: [],
  lastPage: 1,
};

function loadPersistent(slug: string): PersistentReaderData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(slug));
    if (raw) return { ...DEFAULT_PERSISTENT, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_PERSISTENT };
}

function savePersistent(slug: string, data: PersistentReaderData) {
  try {
    localStorage.setItem(STORAGE_KEY(slug), JSON.stringify(data));
  } catch { /* ignore */ }
}

export function usePdfReader(slug: string, totalPages: number) {
  // ─── Ephemeral UI state ─────────────────────────────────────
  const [state, setState] = useState<ReaderState>({
    currentPage: 1,
    zoom: 1.0,
    rotation: 0,
    mode: 'dark',
    layout: 'single',
    scrollMode: 'vertical',
    sidebarOpen: true,
    sidebarTab: 'thumbnails',
    searchOpen: false,
    fullscreen: false,
  });

  // ─── Persistent state (localStorage) ───────────────────────
  const [persistent, setPersistent] = useState<PersistentReaderData>(() =>
    loadPersistent(slug)
  );
  const persistentRef = useRef(persistent);
  persistentRef.current = persistent;

  // Restore last page
  useEffect(() => {
    const saved = loadPersistent(slug);
    if (saved.lastPage > 1 && saved.lastPage <= totalPages) {
      setState(s => ({ ...s, currentPage: saved.lastPage }));
    }
    setPersistent(saved);
  }, [slug, totalPages]);

  // Auto-save on page change
  useEffect(() => {
    const next = { ...persistentRef.current, lastPage: state.currentPage };
    setPersistent(next);
    savePersistent(slug, next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage, slug]);

  // ─── Setters ────────────────────────────────────────────────
  const setPage = useCallback((page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages || 1));
    setState(s => ({ ...s, currentPage: clamped }));
  }, [totalPages]);

  const nextPage = useCallback(() => setPage(state.currentPage + 1), [state.currentPage, setPage]);
  const prevPage = useCallback(() => setPage(state.currentPage - 1), [state.currentPage, setPage]);

  const setZoom = useCallback((z: number) =>
    setState(s => ({ ...s, zoom: Math.max(0.5, Math.min(3.0, z)) })), []);
  const zoomIn  = useCallback(() => setZoom(state.zoom + 0.15), [state.zoom, setZoom]);
  const zoomOut = useCallback(() => setZoom(state.zoom - 0.15), [state.zoom, setZoom]);
  const fitWidth = useCallback(() => setZoom(1.0), [setZoom]);
  const fitPage  = useCallback(() => setZoom(0.85), [setZoom]);

  const rotate = useCallback(() =>
    setState(s => ({ ...s, rotation: (s.rotation + 90) % 360 })), []);

  const setMode        = useCallback((mode: ReadingMode)  => setState(s => ({ ...s, mode })), []);
  const setLayout      = useCallback((layout: PageLayout) => setState(s => ({ ...s, layout })), []);
  const setScrollMode  = useCallback((scrollMode: ScrollMode) => setState(s => ({ ...s, scrollMode })), []);
  const toggleSidebar  = useCallback(() => setState(s => ({ ...s, sidebarOpen: !s.sidebarOpen })), []);
  const setSidebarTab  = useCallback((tab: ReaderState['sidebarTab']) =>
    setState(s => ({ ...s, sidebarTab: tab, sidebarOpen: true })), []);
  const toggleSearch   = useCallback(() => setState(s => ({ ...s, searchOpen: !s.searchOpen })), []);
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setState(s => ({ ...s, fullscreen: true }));
    } else {
      document.exitFullscreen?.();
      setState(s => ({ ...s, fullscreen: false }));
    }
  }, []);

  // ─── Bookmarks ──────────────────────────────────────────────
  const addBookmark = useCallback((page: number, label: string) => {
    const existing = persistentRef.current.bookmarks.find(b => b.page === page);
    if (existing) return; // already bookmarked
    const next = {
      ...persistentRef.current,
      bookmarks: [...persistentRef.current.bookmarks, { page, label, addedAt: new Date().toISOString() }],
    };
    setPersistent(next);
    savePersistent(slug, next);
  }, [slug]);

  const removeBookmark = useCallback((page: number) => {
    const next = {
      ...persistentRef.current,
      bookmarks: persistentRef.current.bookmarks.filter(b => b.page !== page),
    };
    setPersistent(next);
    savePersistent(slug, next);
  }, [slug]);

  const isBookmarked = useCallback((page: number) =>
    persistentRef.current.bookmarks.some(b => b.page === page), []);

  // ─── Notes ──────────────────────────────────────────────────
  const saveNote = useCallback((page: number, text: string) => {
    const notes = persistentRef.current.notes.filter(n => n.page !== page);
    if (text.trim()) notes.push({ page, text, updatedAt: new Date().toISOString() });
    const next = { ...persistentRef.current, notes };
    setPersistent(next);
    savePersistent(slug, next);
  }, [slug]);

  const getNoteForPage = useCallback((page: number) =>
    persistentRef.current.notes.find(n => n.page === page)?.text ?? '', []);

  // ─── Highlights (metadata only — canvas layer not possible without text layer) ──
  const addHighlight = useCallback((h: Omit<Highlight, 'id' | 'createdAt'>) => {
    const highlight: Highlight = { ...h, id: Date.now().toString(), createdAt: new Date().toISOString() };
    const next = { ...persistentRef.current, highlights: [...persistentRef.current.highlights, highlight] };
    setPersistent(next);
    savePersistent(slug, next);
  }, [slug]);

  const removeHighlight = useCallback((id: string) => {
    const next = {
      ...persistentRef.current,
      highlights: persistentRef.current.highlights.filter(h => h.id !== id),
    };
    setPersistent(next);
    savePersistent(slug, next);
  }, [slug]);

  // ─── Keyboard shortcuts ─────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': nextPage(); break;
        case 'ArrowLeft':  case 'ArrowUp':   prevPage(); break;
        case 'Home': setPage(1); break;
        case 'End':  setPage(totalPages); break;
        case '+': if (e.ctrlKey || e.metaKey) { e.preventDefault(); zoomIn(); } break;
        case '-': if (e.ctrlKey || e.metaKey) { e.preventDefault(); zoomOut(); } break;
        case 'f': if (e.ctrlKey || e.metaKey) { e.preventDefault(); toggleSearch(); } break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextPage, prevPage, setPage, totalPages, zoomIn, zoomOut, toggleSearch]);

  return {
    state, persistent,
    setPage, nextPage, prevPage,
    setZoom, zoomIn, zoomOut, fitWidth, fitPage,
    rotate,
    setMode, setLayout, setScrollMode,
    toggleSidebar, setSidebarTab, toggleSearch, toggleFullscreen,
    addBookmark, removeBookmark, isBookmarked,
    saveNote, getNoteForPage,
    addHighlight, removeHighlight,
  };
}
