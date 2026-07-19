import { useState, useEffect, useCallback } from 'react';

// ── Section PDFs (family / education) ─────────────────────────
export type WriterSection = 'family' | 'education';

export interface WriterSectionPdf {
  id: string;
  title: string;
  url: string;
  description?: string;
  addedAt: string;
}

function sectionKey(writerSlug: string, section: WriterSection) {
  return `writer-pdf:${writerSlug}:${section}`;
}
function loadSection(writerSlug: string, section: WriterSection): WriterSectionPdf[] {
  try { return JSON.parse(localStorage.getItem(sectionKey(writerSlug, section)) ?? '[]'); }
  catch { return []; }
}
function saveSection(writerSlug: string, section: WriterSection, list: WriterSectionPdf[]) {
  try { localStorage.setItem(sectionKey(writerSlug, section), JSON.stringify(list)); } catch {}
}

export function useWriterSectionPdfs(writerSlug: string, section: WriterSection) {
  const [pdfs, setPdfs] = useState<WriterSectionPdf[]>(() => loadSection(writerSlug, section));

  useEffect(() => setPdfs(loadSection(writerSlug, section)), [writerSlug, section]);

  const addPdf = useCallback((title: string, url: string, description?: string) => {
    const entry: WriterSectionPdf = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: title.trim(), url: url.trim(),
      description: description?.trim(),
      addedAt: new Date().toISOString(),
    };
    const next = [entry, ...loadSection(writerSlug, section)];
    saveSection(writerSlug, section, next);
    setPdfs(next);
  }, [writerSlug, section]);

  const removePdf = useCallback((id: string) => {
    const next = loadSection(writerSlug, section).filter(p => p.id !== id);
    saveSection(writerSlug, section, next);
    setPdfs(next);
  }, [writerSlug, section]);

  return { pdfs, addPdf, removePdf };
}

// ── Per-work PDF URL ───────────────────────────────────────────
export interface WorkPdfEntry {
  url: string;
  title: string;
  addedAt: string;
}

function workKey(writerSlug: string, workId: string) {
  return `writer-work-pdf:${writerSlug}:${workId}`;
}
function loadWork(writerSlug: string, workId: string): WorkPdfEntry | null {
  try { return JSON.parse(localStorage.getItem(workKey(writerSlug, workId)) ?? 'null'); }
  catch { return null; }
}

export function useWorkPdf(writerSlug: string, workId: string) {
  const [entry, setEntry] = useState<WorkPdfEntry | null>(() => loadWork(writerSlug, workId));

  useEffect(() => setEntry(loadWork(writerSlug, workId)), [writerSlug, workId]);

  const setPdf = useCallback((url: string, title: string) => {
    const e: WorkPdfEntry = { url: url.trim(), title: title.trim(), addedAt: new Date().toISOString() };
    try { localStorage.setItem(workKey(writerSlug, workId), JSON.stringify(e)); } catch {}
    setEntry(e);
  }, [writerSlug, workId]);

  const removePdf = useCallback(() => {
    try { localStorage.removeItem(workKey(writerSlug, workId)); } catch {}
    setEntry(null);
  }, [writerSlug, workId]);

  return { entry, setPdf, removePdf };
}
