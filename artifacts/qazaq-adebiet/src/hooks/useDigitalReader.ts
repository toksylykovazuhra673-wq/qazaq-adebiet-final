import { useState, useEffect, useCallback } from 'react';
import type {
  Book, ReaderTab, TextSettings, DrBookmark, DrHighlight, DrNote, DrPersist, HighlightColor,
} from '@/types/book';
import booksData from '@/data/books.json';

const books = booksData as unknown as Book[];

const DEFAULT_TEXT_SETTINGS: TextSettings = {
  fontSize:    18,
  lineHeight:  1.75,
  theme:       'dark',
  fontFamily:  'serif',
  columnWidth: 'medium',
};

const DEFAULT_PERSIST: DrPersist = {
  activeTab:    'text',
  textProgress: 0,
  pdfPage:      1,
  audioTime:    0,
  textSettings: DEFAULT_TEXT_SETTINGS,
  bookmarks:    [],
  highlights:   [],
  notes:        [],
  isFavorite:   false,
  nightMode:    true,
};

function storageKey(slug: string) { return `dr_${slug}`; }

function loadPersist(slug: string): DrPersist {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return { ...DEFAULT_PERSIST, textSettings: { ...DEFAULT_TEXT_SETTINGS } };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PERSIST,
      ...parsed,
      textSettings: { ...DEFAULT_TEXT_SETTINGS, ...(parsed.textSettings ?? {}) },
      highlights: parsed.highlights ?? [],
    };
  } catch {
    return { ...DEFAULT_PERSIST, textSettings: { ...DEFAULT_TEXT_SETTINGS } };
  }
}

function savePersist(slug: string, data: DrPersist) {
  try { localStorage.setItem(storageKey(slug), JSON.stringify(data)); } catch {}
}

export function useAllBooks() { return books; }
export function useBook(slug: string) {
  return books.find(b => b.slug === slug) ?? null;
}

export function useDigitalReader(slug: string) {
  const book = useBook(slug);
  const [persist, setPersist] = useState<DrPersist>(() => loadPersist(slug));

  useEffect(() => { savePersist(slug, persist); }, [slug, persist]);

  const patch = useCallback((partial: Partial<DrPersist>) => {
    setPersist(p => ({ ...p, ...partial }));
  }, []);

  const setActiveTab     = useCallback((tab: ReaderTab)   => patch({ activeTab: tab }), [patch]);
  const setTextProgress  = useCallback((pct: number)      => patch({ textProgress: pct }), [patch]);
  const setPdfPage       = useCallback((page: number)     => patch({ pdfPage: page }), [patch]);
  const setAudioTime     = useCallback((t: number)        => patch({ audioTime: t }), [patch]);
  const toggleFavorite   = useCallback(()                 => setPersist(p => ({ ...p, isFavorite: !p.isFavorite })), []);
  const toggleNightMode  = useCallback(()                 => setPersist(p => ({ ...p, nightMode: !p.nightMode })), []);

  const setTextSettings = useCallback((s: Partial<TextSettings>) => {
    setPersist(p => ({ ...p, textSettings: { ...p.textSettings, ...s } }));
  }, []);

  // ── Bookmarks ──────────────────────────────────────────────
  const addBookmark = useCallback((bm: Omit<DrBookmark, 'id' | 'createdAt'>) => {
    setPersist(p => ({
      ...p,
      bookmarks: [...p.bookmarks, { ...bm, id: Date.now().toString(), createdAt: new Date().toISOString() }],
    }));
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setPersist(p => ({ ...p, bookmarks: p.bookmarks.filter(b => b.id !== id) }));
  }, []);

  const isBookmarked = useCallback((type: DrBookmark['type'], value: number) =>
    persist.bookmarks.some(b => b.type === type && Math.abs(b.value - value) < 1),
  [persist.bookmarks]);

  // ── Highlights ─────────────────────────────────────────────
  const addHighlight = useCallback((h: { paragraphIndex: number; text: string; color: HighlightColor; note?: string }) => {
    setPersist(p => ({
      ...p,
      highlights: [...p.highlights, { ...h, id: `hl_${Date.now()}`, createdAt: new Date().toISOString() }],
    }));
  }, []);

  const removeHighlight = useCallback((id: string) => {
    setPersist(p => ({ ...p, highlights: p.highlights.filter(h => h.id !== id) }));
  }, []);

  const updateHighlightNote = useCallback((id: string, note: string) => {
    setPersist(p => ({
      ...p,
      highlights: p.highlights.map(h => h.id === id ? { ...h, note } : h),
    }));
  }, []);

  // ── Notes ──────────────────────────────────────────────────
  const addNote = useCallback((note: Omit<DrNote, 'id' | 'createdAt'>) => {
    setPersist(p => ({
      ...p,
      notes: [...p.notes, { ...note, id: Date.now().toString(), createdAt: new Date().toISOString() }],
    }));
  }, []);

  const updateNote = useCallback((id: string, content: string) => {
    setPersist(p => ({ ...p, notes: p.notes.map(n => n.id === id ? { ...n, content } : n) }));
  }, []);

  const removeNote = useCallback((id: string) => {
    setPersist(p => ({ ...p, notes: p.notes.filter(n => n.id !== id) }));
  }, []);

  return {
    book,
    persist,
    setActiveTab,
    setTextProgress,
    setPdfPage,
    setAudioTime,
    setTextSettings,
    toggleFavorite,
    toggleNightMode,
    addBookmark,
    removeBookmark,
    isBookmarked,
    addHighlight,
    removeHighlight,
    updateHighlightNote,
    addNote,
    updateNote,
    removeNote,
  };
}
