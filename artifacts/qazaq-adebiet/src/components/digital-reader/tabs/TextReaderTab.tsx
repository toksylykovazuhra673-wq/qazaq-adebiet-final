import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ChevronUp, ChevronDown, Type, Sun, Moon,
  BookOpen, Bookmark, BookmarkCheck, Settings2, List,
  Printer, Download, Maximize2, Minimize2, Highlighter,
  Trash2, AlignLeft, ChevronRight, Tag,
} from 'lucide-react';
import type { Book, TextSettings, DrBookmark, DrHighlight, HighlightColor, TocEntry } from '@/types/book';

// ─── Types ──────────────────────────────────────────────────
interface Props {
  book: Book;
  settings: TextSettings;
  onSettings: (s: Partial<TextSettings>) => void;
  textProgress: number;
  onProgress: (pct: number) => void;
  onAddBookmark: (bm: Omit<DrBookmark, 'id' | 'createdAt'>) => void;
  isBookmarked: (type: DrBookmark['type'], value: number) => boolean;
  onRemoveBookmark: (id: string) => void;
  bookmarks: DrBookmark[];
  highlights: DrHighlight[];
  onAddHighlight: (h: { paragraphIndex: number; text: string; color: HighlightColor }) => void;
  onRemoveHighlight: (id: string) => void;
}

interface SelectionInfo {
  text: string;
  paraIdx: number;
  x: number;
  y: number;
}

// ─── Constants ───────────────────────────────────────────────
const HIGHLIGHT_BG: Record<HighlightColor, string> = {
  yellow: 'rgba(250,204,21,0.5)',
  green:  'rgba(74,222,128,0.45)',
  blue:   'rgba(96,165,250,0.45)',
  pink:   'rgba(244,114,182,0.45)',
  orange: 'rgba(251,146,60,0.5)',
};
const HIGHLIGHT_COLORS: { id: HighlightColor; label: string }[] = [
  { id: 'yellow', label: 'Сары' },
  { id: 'green',  label: 'Жасыл' },
  { id: 'blue',   label: 'Көк' },
  { id: 'pink',   label: 'Қызғылт' },
  { id: 'orange', label: 'Қызыл сары' },
];

const FONT_SIZES   = [14, 16, 18, 20, 22, 24, 26, 28];
const LINE_HEIGHTS = [1.5, 1.75, 2.0, 2.5];
const THEMES = [
  { id: 'dark',  label: 'Күңгірт',   bg: 'bg-gray-950',   text: 'text-gray-100',  icon: <Moon size={12} /> },
  { id: 'sepia', label: 'Сепия',     bg: 'bg-amber-950',  text: 'text-amber-100', icon: <BookOpen size={12} /> },
  { id: 'light', label: 'Ашық',      bg: 'bg-slate-50',   text: 'text-slate-900', icon: <Sun size={12} /> },
  { id: 'paper', label: 'Қағаз',     bg: 'bg-stone-100',  text: 'text-stone-800', icon: <AlignLeft size={12} /> },
] as const;
const FONTS = [
  { id: 'sans',  label: 'Заманауи', cls: 'font-sans' },
  { id: 'serif', label: 'Классик',  cls: 'font-serif' },
  { id: 'mono',  label: 'Кеңістік', cls: 'font-mono' },
] as const;
const COL_WIDTHS = [
  { id: 'narrow', label: 'Тар',    maxW: 'max-w-lg' },
  { id: 'medium', label: 'Орта',   maxW: 'max-w-2xl' },
  { id: 'wide',   label: 'Кең',    maxW: 'max-w-4xl' },
] as const;

// ─── Helpers ─────────────────────────────────────────────────
const CHAPTER_STARTS = [
  'БІРІНШІ', 'ЕКІНШІ', 'ҮШІНШІ', 'ТӨРТІНШІ', 'БЕСІНШІ', 'АЛТЫНШЫ',
  'ЖЕТІНШІ', 'СЕГІЗІНШІ', 'ТОҒЫЗЫНШЫ', 'ОНЫНШЫ', 'БӨЛІМ', 'ТАРАУ', 'СӨЗ',
];

function buildTOC(paragraphs: string[] | undefined): TocEntry[] {
  if (!paragraphs || !Array.isArray(paragraphs)) return [];
  const toc: TocEntry[] = [];
  paragraphs.forEach((para, i) => {
    const t = para.trim();
    if (!t || t.length > 80) return;
    const isAllCaps = /^[А-ЯӘІҢҒҮҰҚӨҺA-Z\s\d«»"'—–]+$/.test(t) && t.length > 2;
    const hasPrefix = CHAPTER_STARTS.some(p => t.startsWith(p));
    const hasRoman  = /^(I{1,3}|IV|V|VI{0,3}|IX|X)[\.\s]/.test(t);
    const hasNum    = /^\d{1,2}[\.\)]\s/.test(t);
    if (isAllCaps || hasPrefix || hasRoman || hasNum) {
      toc.push({ title: t.slice(0, 60), paraIndex: i, level: isAllCaps || hasPrefix ? 1 : 2 });
    }
  });
  return toc;
}

function isHeading(para: string): boolean {
  const t = para.trim();
  if (!t || t.length > 80) return false;
  const isAllCaps = /^[А-ЯӘІҢҒҮҰҚӨҺA-Z\s\d«»"'—–]+$/.test(t) && t.length > 2;
  const hasPrefix = CHAPTER_STARTS.some(p => t.startsWith(p));
  return isAllCaps || hasPrefix || /^(I{1,3}|IV|V|VI{0,3}|IX|X)[\.\s]/.test(t);
}

function searchTokenize(text: string, query: string, key: string): React.ReactNode[] {
  if (!query.trim()) return [<React.Fragment key={key}>{text}</React.Fragment>];
  const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re  = new RegExp(`(${esc})`, 'gi');
  return text.split(re).map((part, i) =>
    re.test(part)
      ? <mark key={`${key}-${i}`} className="bg-yellow-400/45 text-inherit rounded px-0.5">{part}</mark>
      : <React.Fragment key={`${key}-${i}`}>{part}</React.Fragment>
  );
}

function buildParaContent(
  text: string,
  paraIdx: number,
  highlights: DrHighlight[],
  query: string,
): React.ReactNode {
  const myHL = highlights.filter(h => h.paragraphIndex === paraIdx);
  const intervals: { start: number; end: number; color: HighlightColor; id: string }[] = [];
  for (const h of myHL) {
    const pos = text.toLowerCase().indexOf(h.text.toLowerCase());
    if (pos !== -1) intervals.push({ start: pos, end: pos + h.text.length, color: h.color, id: h.id });
  }
  intervals.sort((a, b) => a.start - b.start);

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  for (const iv of intervals) {
    if (iv.start < cursor) continue;
    if (iv.start > cursor) nodes.push(...searchTokenize(text.slice(cursor, iv.start), query, `pre-${iv.id}`));
    nodes.push(
      <mark key={iv.id} data-hid={iv.id}
        style={{ background: HIGHLIGHT_BG[iv.color], borderRadius: 3, padding: '0 2px' }}>
        {text.slice(iv.start, iv.end)}
      </mark>
    );
    cursor = iv.end;
  }
  if (cursor < text.length) nodes.push(...searchTokenize(text.slice(cursor), query, 'tail'));
  return nodes.length ? nodes : searchTokenize(text, query, 'all');
}

// ─── Print ───────────────────────────────────────────────────
function printBook(book: Book) {
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) return;
  const html = `<!DOCTYPE html><html lang="kk"><head>
<meta charset="UTF-8"><title>${book.title}</title>
<style>
  body { font-family: 'Georgia', serif; max-width: 640px; margin: 40px auto; line-height: 1.9;
         font-size: 16px; color: #1a1a1a; }
  h1 { text-align: center; font-size: 24px; margin-bottom: 4px; }
  .author { text-align: center; color: #555; margin-bottom: 32px; font-style: italic; }
  .heading { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em;
             color: #666; margin: 32px 0 12px; }
  p { margin-bottom: 16px; }
  @media print { body { margin: 20px; } }
</style></head><body>
<h1>${book.title}</h1>
<p class="author">${book.author} · ${book.year}</p>
<hr style="border:none;border-top:1px solid #ddd;margin:24px 0">
${(book.fullText ?? []).map(p => {
    if (!p.trim()) return '<br>';
    return isHeading(p)
      ? `<p class="heading">${p.trim()}</p>`
      : `<p>${p.trim()}</p>`;
  }).join('\n')}
</body></html>`;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}

function downloadText(book: Book) {
  const content = [book.title, book.author, book.year, '', ...(book.fullText ?? [])].join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${book.slug}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ─── Sub-components ──────────────────────────────────────────
function ToolBtn({
  children, onClick, active, disabled, title, danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  danger?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      className={`p-2 rounded-lg transition-colors text-sm ${
        danger   ? 'text-red-400 hover:bg-red-500/10' :
        active   ? 'bg-white/12 text-white' :
                   'text-gray-400 hover:text-white hover:bg-white/8'
      } disabled:opacity-30 disabled:cursor-not-allowed`}>
      {children}
    </button>
  );
}

// ─── Main component ──────────────────────────────────────────
export default function TextReaderTab({
  book, settings, onSettings,
  textProgress, onProgress,
  onAddBookmark, isBookmarked, onRemoveBookmark, bookmarks,
  highlights, onAddHighlight, onRemoveHighlight,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);

  // UI state
  const [showSearch,  setShowSearch]  = useState(false);
  const [searchQ,     setSearchQ]     = useState('');
  const [searchIdx,   setSearchIdx]   = useState(0);
  const [matches,     setMatches]     = useState<number[]>([]);
  const [showPanel,   setShowPanel]   = useState(false);
  const [showToc,     setShowToc]     = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selInfo,     setSelInfo]     = useState<SelectionInfo | null>(null);
  const [showHlPanel, setShowHlPanel] = useState(false);  // highlights sidebar

  const theme = THEMES.find(t => t.id === settings.theme) ?? THEMES[0];
  const font  = FONTS.find(f => f.id === settings.fontFamily) ?? FONTS[1];
  const col   = COL_WIDTHS.find(c => c.id === (settings.columnWidth ?? 'medium')) ?? COL_WIDTHS[1];

  const toc = useMemo(() => buildTOC(book.fullText), [book.fullText]);

  // ── Scroll progress ────────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight <= clientHeight ? 0 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      onProgress(Math.round(pct));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [onProgress]);

  // Restore scroll position on mount
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || textProgress <= 0) return;
    const { scrollHeight, clientHeight } = el;
    el.scrollTop = (textProgress / 100) * (scrollHeight - clientHeight);
  }, []); // eslint-disable-line

  // ── Search ─────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQ.trim()) { setMatches([]); return; }
    const q = searchQ.toLowerCase();
    const found: number[] = [];
    (book.fullText ?? []).forEach((p, i) => { if (p.toLowerCase().includes(q)) found.push(i); });
    setMatches(found);
    setSearchIdx(0);
  }, [searchQ, book.fullText]);

  const scrollToPara = useCallback((paraIdx: number) => {
    document.getElementById(`para-${paraIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const prevMatch = () => { const i = (searchIdx - 1 + matches.length) % matches.length; setSearchIdx(i); scrollToPara(matches[i]); };
  const nextMatch = () => { const i = (searchIdx + 1) % matches.length; setSearchIdx(i); scrollToPara(matches[i]); };

  // ── Fullscreen ─────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // ── Text selection → highlight toolbar ────────────────────
  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) { setSelInfo(null); return; }
    const selText = sel.toString().trim();
    if (!selText || selText.length < 2) { setSelInfo(null); return; }
    const range = sel.getRangeAt(0);
    let node: Node | null = range.commonAncestorContainer;
    let paraEl: Element | null = null;
    while (node) {
      if (node instanceof Element) {
        const attr = node.getAttribute('data-para');
        if (attr !== null) { paraEl = node; break; }
      }
      node = node.parentNode;
    }
    if (!paraEl) { setSelInfo(null); return; }
    const paraIdx = parseInt(paraEl.getAttribute('data-para') ?? '-1', 10);
    if (paraIdx === -1) { setSelInfo(null); return; }
    const rect = range.getBoundingClientRect();
    setSelInfo({ text: selText, paraIdx, x: rect.left + rect.width / 2, y: rect.top - 8 });
  }, []);

  const addHL = (color: HighlightColor) => {
    if (!selInfo) return;
    onAddHighlight({ paragraphIndex: selInfo.paraIdx, text: selInfo.text, color });
    setSelInfo(null);
    window.getSelection()?.removeAllRanges();
  };

  // ── Bookmark ───────────────────────────────────────────────
  const handleBookmark = () => {
    const pct = Math.round(textProgress);
    if (isBookmarked('text', pct)) return;
    onAddBookmark({ type: 'text', label: `${pct}% · ${book.title}`, value: pct });
  };

  // ── Empty state ────────────────────────────────────────────
  if (!book.isPublicDomain || (book.fullText ?? []).length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
          <BookOpen size={28} className="text-orange-400" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">Толық мәтін қол жетімді емес</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Бұл шығарма авторлық құқықпен қорғалған. PDF немесе аудио нұсқасын пайдаланыңыз.
        </p>
        <div className="bg-white/4 border border-white/8 rounded-2xl p-5 text-left">
          <p className="text-gray-300 text-sm font-medium mb-2">Қысқаша мазмұны:</p>
          <p className="text-gray-400 text-sm leading-relaxed">{book.summary}</p>
        </div>
      </div>
    );
  }

  const bgClass = theme.bg;
  const textClass = theme.text;

  return (
    <div ref={containerRef} className={`relative flex h-full ${bgClass} transition-colors duration-300`}
      style={{ minHeight: 'calc(100vh - 240px)' }}>

      {/* ── TOC Drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {showToc && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="flex-shrink-0 bg-gray-900/95 border-r border-white/8 flex flex-col overflow-hidden z-20">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <List size={14} className="text-violet-400" />
                <span className="text-white text-sm font-semibold">Мазмұны</span>
                <span className="text-gray-500 text-xs">({toc.length})</span>
              </div>
              <button onClick={() => setShowToc(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
                <X size={13} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {toc.length === 0 ? (
                <div className="text-center py-8 text-gray-600 text-xs px-4">
                  Тарау тақырыптары табылмады
                </div>
              ) : (
                toc.map((entry, i) => (
                  <button key={i} onClick={() => { scrollToPara(entry.paraIndex); }}
                    className={`w-full text-left px-4 py-2.5 transition-colors hover:bg-white/6 flex items-start gap-2 ${
                      entry.level === 1 ? '' : 'pl-7'
                    }`}>
                    {entry.level === 1 && <ChevronRight size={12} className="text-violet-400 mt-0.5 flex-shrink-0" />}
                    <span className={`text-xs leading-relaxed ${entry.level === 1 ? 'text-gray-200 font-medium' : 'text-gray-400'}`}>
                      {entry.title}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Highlights Sidebar ──────────────────────────────── */}
      <AnimatePresence>
        {showHlPanel && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="flex-shrink-0 bg-gray-900/95 border-l border-white/8 flex flex-col overflow-hidden z-20 order-last">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <Highlighter size={14} className="text-amber-400" />
                <span className="text-white text-sm font-semibold">Белгілеулер</span>
                <span className="text-gray-500 text-xs">({highlights.length})</span>
              </div>
              <button onClick={() => setShowHlPanel(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
                <X size={13} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2 space-y-1.5 px-3">
              {highlights.length === 0 ? (
                <div className="text-center py-8 text-gray-600 text-xs">
                  Мәтін таңдап белгілеңіз
                </div>
              ) : (
                highlights.map(h => (
                  <div key={h.id} className="group flex items-start gap-2 bg-white/4 border border-white/8 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-white/6 transition-colors"
                    onClick={() => scrollToPara(h.paragraphIndex)}>
                    <span className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                      style={{ background: HIGHLIGHT_BG[h.color] }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">«{h.text}»</p>
                      <p className="text-gray-600 text-[10px] mt-0.5">
                        {new Date(h.createdAt).toLocaleDateString('kk-KZ')}
                      </p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); onRemoveHighlight(h.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-600 hover:text-red-400 transition-all">
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Center column ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 border-b border-white/8 bg-gray-950/70 backdrop-blur-sm flex-shrink-0 gap-2">
          {/* Left: font size */}
          <div className="flex items-center gap-0.5">
            <ToolBtn onClick={() => onSettings({ fontSize: Math.max(14, settings.fontSize - 2) })} title="Кіші қаріп">
              <span className="text-[11px] font-bold">A</span>
            </ToolBtn>
            <span className="text-gray-500 text-[11px] w-7 text-center">{settings.fontSize}</span>
            <ToolBtn onClick={() => onSettings({ fontSize: Math.min(28, settings.fontSize + 2) })} title="Үлкен қаріп">
              <span className="text-[13px] font-bold">A</span>
            </ToolBtn>
          </div>

          {/* Center: main actions */}
          <div className="flex items-center gap-0.5">
            <ToolBtn onClick={() => { setShowToc(v => !v); setShowHlPanel(false); }} active={showToc} title="Мазмұны">
              <List size={14} />
            </ToolBtn>
            <ToolBtn onClick={() => setShowSearch(v => !v)} active={showSearch} title="Іздеу">
              <Search size={14} />
            </ToolBtn>
            <ToolBtn onClick={handleBookmark} title="Бетбелгі қою">
              {isBookmarked('text', Math.round(textProgress))
                ? <BookmarkCheck size={14} className="text-violet-400" />
                : <Bookmark size={14} />}
            </ToolBtn>
            <ToolBtn onClick={() => { setShowHlPanel(v => !v); setShowToc(false); }} active={showHlPanel} title="Белгілеулер">
              <Highlighter size={14} className={highlights.length > 0 ? 'text-amber-400' : ''} />
            </ToolBtn>
            <ToolBtn onClick={() => setShowPanel(v => !v)} active={showPanel} title="Параметрлер">
              <Settings2 size={14} />
            </ToolBtn>
          </div>

          {/* Right: utility */}
          <div className="flex items-center gap-0.5">
            <ToolBtn onClick={() => printBook(book)} title="Басып шығару">
              <Printer size={14} />
            </ToolBtn>
            <ToolBtn onClick={() => downloadText(book)} title="Жүктеп алу (.txt)">
              <Download size={14} />
            </ToolBtn>
            <ToolBtn onClick={toggleFullscreen} title={isFullscreen ? 'Кері шығу' : 'Толық экран'}>
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </ToolBtn>
          </div>
        </div>

        {/* Reading progress bar */}
        <div className="h-0.5 bg-white/5 flex-shrink-0">
          <motion.div className="h-full bg-gradient-to-r from-violet-500 to-purple-400"
            style={{ width: `${textProgress}%` }} transition={{ duration: 0.1 }} />
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-white/8 bg-gray-900/80 flex-shrink-0">
              <div className="flex items-center gap-2 px-4 py-2">
                <Search size={13} className="text-gray-500 flex-shrink-0" />
                <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') nextMatch(); if (e.key === 'Escape') { setShowSearch(false); setSearchQ(''); } }}
                  placeholder="Мәтіннен іздеу..."
                  className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none" />
                {matches.length > 0 && (
                  <span className="text-gray-500 text-xs whitespace-nowrap">{searchIdx + 1}/{matches.length}</span>
                )}
                <div className="flex gap-0.5">
                  <ToolBtn onClick={prevMatch} disabled={matches.length === 0}><ChevronUp size={12} /></ToolBtn>
                  <ToolBtn onClick={nextMatch} disabled={matches.length === 0}><ChevronDown size={12} /></ToolBtn>
                </div>
                <ToolBtn onClick={() => { setShowSearch(false); setSearchQ(''); }}><X size={12} /></ToolBtn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-white/8 bg-gray-900/90 backdrop-blur-sm flex-shrink-0">
              <div className="px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Themes */}
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Тақта</p>
                  <div className="flex flex-wrap gap-1">
                    {THEMES.map(t => (
                      <button key={t.id} onClick={() => onSettings({ theme: t.id })}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs transition-all ${
                          settings.theme === t.id
                            ? 'border-violet-400 bg-violet-500/15 text-violet-300'
                            : 'border-white/10 text-gray-400 hover:border-white/20'
                        }`}>
                        {t.icon}{t.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Font */}
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Қаріп</p>
                  <div className="flex gap-1">
                    {FONTS.map(f => (
                      <button key={f.id} onClick={() => onSettings({ fontFamily: f.id })}
                        className={`px-2 py-1.5 rounded-lg border text-xs transition-all ${
                          settings.fontFamily === f.id
                            ? 'border-violet-400 bg-violet-500/15 text-violet-300'
                            : 'border-white/10 text-gray-400 hover:border-white/20'
                        }`}>{f.label}</button>
                    ))}
                  </div>
                </div>
                {/* Line height */}
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Жол аралығы</p>
                  <div className="flex gap-1">
                    {LINE_HEIGHTS.map(lh => (
                      <button key={lh} onClick={() => onSettings({ lineHeight: lh })}
                        className={`px-2 py-1.5 rounded-lg border text-xs transition-all ${
                          settings.lineHeight === lh
                            ? 'border-violet-400 bg-violet-500/15 text-violet-300'
                            : 'border-white/10 text-gray-400 hover:border-white/20'
                        }`}>{lh}</button>
                    ))}
                  </div>
                </div>
                {/* Column width */}
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Баған ені</p>
                  <div className="flex gap-1">
                    {COL_WIDTHS.map(c => (
                      <button key={c.id} onClick={() => onSettings({ columnWidth: c.id })}
                        className={`px-2 py-1.5 rounded-lg border text-xs transition-all ${
                          (settings.columnWidth ?? 'medium') === c.id
                            ? 'border-violet-400 bg-violet-500/15 text-violet-300'
                            : 'border-white/10 text-gray-400 hover:border-white/20'
                        }`}>{c.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text content */}
        <div ref={scrollRef} className={`flex-1 overflow-y-auto ${bgClass} transition-colors duration-300`}
          onMouseUp={handleMouseUp}>
          <div className={`${col.maxW} mx-auto px-4 sm:px-8 py-8 sm:py-12`}>
            {(book.fullText ?? []).map((para, i) => {
              if (!para.trim()) return <div key={i} className="h-4" />;
              const heading    = isHeading(para);
              const isMatch    = searchQ && matches.includes(i);
              const content    = buildParaContent(para, i, highlights, searchQ);

              return (
                <p key={i} id={`para-${i}`} data-para={i}
                  className={`${textClass} ${font.cls} transition-all duration-200 select-text ${
                    heading
                      ? 'text-xs font-bold uppercase tracking-widest mt-10 mb-4 opacity-50'
                      : 'mb-5'
                  } ${isMatch ? 'bg-yellow-400/10 rounded-lg px-2 -mx-2 py-1' : ''}`}
                  style={{ fontSize: heading ? 12 : settings.fontSize, lineHeight: settings.lineHeight }}>
                  {content}
                </p>
              );
            })}
            <div className="h-20" />
          </div>
        </div>

        {/* Bottom status bar */}
        <div className={`flex items-center justify-between px-4 sm:px-8 py-2 border-t border-white/8 ${bgClass} bg-opacity-80 flex-shrink-0`}>
          <span className="text-gray-600 text-[11px]">
            {(book.fullText ?? []).filter(p => p.trim()).length} абзац
          </span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-[11px]">{Math.round(textProgress)}% оқылды</span>
            {highlights.length > 0 && (
              <span className="flex items-center gap-1 text-amber-500/70 text-[11px]">
                <Highlighter size={10} /> {highlights.length}
              </span>
            )}
            {bookmarks.length > 0 && (
              <span className="flex items-center gap-1 text-violet-500/70 text-[11px]">
                <Bookmark size={10} /> {bookmarks.length}
              </span>
            )}
          </div>
          <span className="text-gray-600 text-[11px]">
            ~{Math.round((book.readingTimeMin ?? 0) * (1 - textProgress / 100))} мин қалды
          </span>
        </div>
      </div>

      {/* ── Floating highlight toolbar ───────────────────────── */}
      <AnimatePresence>
        {selInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{ position: 'fixed', left: selInfo.x, top: selInfo.y, transform: 'translateX(-50%) translateY(-100%)' }}
            className="z-50 flex items-center gap-1 px-2 py-1.5 bg-gray-900 border border-white/15 rounded-xl shadow-2xl shadow-black/60 backdrop-blur-sm"
          >
            <Highlighter size={12} className="text-gray-400 mr-1" />
            {HIGHLIGHT_COLORS.map(c => (
              <button key={c.id} onClick={() => addHL(c.id)} title={c.label}
                className="w-6 h-6 rounded-full border-2 border-white/20 hover:scale-125 transition-transform"
                style={{ background: HIGHLIGHT_BG[c.id] }} />
            ))}
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button onClick={() => setSelInfo(null)}
              className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
              <X size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
