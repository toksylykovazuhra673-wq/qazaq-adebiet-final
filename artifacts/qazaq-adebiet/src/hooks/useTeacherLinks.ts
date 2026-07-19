import { useState, useEffect, useCallback } from 'react';

export type LinkCategory = 'pdf' | 'audio' | 'video';

export interface TeacherLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  addedAt: string;
}

function key(biSlug: string, cat: LinkCategory) {
  return `teacher-links:${biSlug}:${cat}`;
}
function load(biSlug: string, cat: LinkCategory): TeacherLink[] {
  try { return JSON.parse(localStorage.getItem(key(biSlug, cat)) ?? '[]'); }
  catch { return []; }
}
function save(biSlug: string, cat: LinkCategory, list: TeacherLink[]) {
  try { localStorage.setItem(key(biSlug, cat), JSON.stringify(list)); } catch {}
}

export function useTeacherLinks(biSlug: string, category: LinkCategory) {
  const [links, setLinks] = useState<TeacherLink[]>(() => load(biSlug, category));

  useEffect(() => { setLinks(load(biSlug, category)); }, [biSlug, category]);

  const addLink = useCallback((title: string, url: string, description?: string) => {
    const entry: TeacherLink = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: title.trim(),
      url: url.trim(),
      description: description?.trim(),
      addedAt: new Date().toISOString(),
    };
    const next = [entry, ...load(biSlug, category)];
    save(biSlug, category, next);
    setLinks(next);
  }, [biSlug, category]);

  const removeLink = useCallback((id: string) => {
    const next = load(biSlug, category).filter(l => l.id !== id);
    save(biSlug, category, next);
    setLinks(next);
  }, [biSlug, category]);

  const updateLink = useCallback((id: string, patch: Partial<Pick<TeacherLink, 'title' | 'description'>>) => {
    const next = load(biSlug, category).map(l => l.id === id ? { ...l, ...patch } : l);
    save(biSlug, category, next);
    setLinks(next);
  }, [biSlug, category]);

  return { links, addLink, removeLink, updateLink };
}

// ── helpers ─────────────────────────────────────────────────
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

export function youtubeThumbnail(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
