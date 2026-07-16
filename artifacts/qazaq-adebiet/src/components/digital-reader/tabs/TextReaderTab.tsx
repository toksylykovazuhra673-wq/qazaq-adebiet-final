import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ChevronUp, ChevronDown, Type, AlignLeft,
  Sun, Moon, BookOpen, Bookmark, BookmarkCheck, Settings2,
} from 'lucide-react';
import type { Book, TextSettings, DrBookmark } from '@/types/book';

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
}

const FONT_SIZES   = [14, 16, 18, 20, 22, 24, 26];
const LINE_HEIGHTS = [1.5, 1.75, 2.0, 2.5];
const THEMES = [
  { id: 'dark',  label: 'Күңгірт', bg: 'bg-gray-950', text: 'text-gray-100',  border: 'border-white/5',  icon: <Moon size={13} /> },
  { id: 'sepia', label: 'Сепия',   bg: 'bg-amber-950', text: 'text-amber-100', border: 'border-amber-800/30', icon: <BookOpen size={13} /> },
  { id: 'light', label: 'Ашық',    bg: 'bg-gray-50',  text: 'text-gray-900',  border: 'border-gray-200', icon: <Sun size={13} /> },
  { id: 'paper', label: 'Қағаз',   bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-300', icon: <AlignLeft size={13} /> },
] as const;

const FONTS = [
  { id: 'sans',  label: 'Заманауи', class: 'font-sans' },
  { id: 'serif', label: 'Классик',  class: 'font-serif' },
  { id: 'mono',  label: 'Кеңістік', class: 'font-mono' },
] as const;

export default function TextReaderTab({ book, settings, onSettings, textProgress, onProgress, onAddBookmark, isBookmarked, bookmarks }: Props) {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const [search,   setSearch]    = useState('');
  const [searchIdx, setSearchIdx] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [showPanel, setShowPanel]   = useState(false);
  const [matches,  setMatches]   = useState<number[]>([]);

  const theme = THEMES.find(t => t.id === settings.theme) ?? THEMES[0];
  const font  = FONTS.find(f => f.id === settings.fontFamily) ?? FONTS[1];

  // Track scroll progress
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

  // Restore scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || textProgress <= 0) return;
    const { scrollHeight, clientHeight } = el;
    el.scrollTop = ((textProgress / 100) * (scrollHeight - clientHeight));
  }, []); // eslint-disable-line

  // Search
  useEffect(() => {
    if (!search.trim()) { setMatches([]); return; }
    const q = search.toLowerCase();
    const found: number[] = [];
    book.fullText.forEach((p, i) => { if (p.toLowerCase().includes(q)) found.push(i); });
    setMatches(found);
    setSearchIdx(0);
  }, [search, book.fullText]);

  const scrollToMatch = useCallback((idx: number) => {
    const el = document.getElementById(`para-${matches[idx]}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [matches]);

  const prevMatch = () => { const i = (searchIdx - 1 + matches.length) % matches.length; setSearchIdx(i); scrollToMatch(i); };
  const nextMatch = () => { const i = (searchIdx + 1) % matches.length; setSearchIdx(i); scrollToMatch(i); };

  const handleBookmarkHere = () => {
    const pct = Math.round(textProgress);
    if (isBookmarked('text', pct)) return;
    onAddBookmark({ type: 'text', label: `${Math.round(pct)}% · ${book.title}`, value: pct });
  };

  const highlight = (text: string) => {
    if (!search.trim()) return text;
    const re = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.split(re).map((part, i) =>
      re.test(part)
        ? <mark key={i} className="bg-yellow-400/40 text-inherit rounded px-0.5">{part}</mark>
        : part
    );
  };

  if (!book.isPublicDomain || book.fullText.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
          <BookOpen size={28} className="text-orange-400" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">Толық мәтін қол жетімді емес</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Бұл шығарма авторлық құқықпен қорғалған. Заңды түрде PDF немесе аудио нұсқасын пайдаланыңыз.
        </p>
        <div className="bg-white/4 border border-white/8 rounded-2xl p-5 text-left">
          <p className="text-gray-300 text-sm font-medium mb-2">Қысқаша мазмұны:</p>
          <p className="text-gray-400 text-sm leading-relaxed">{book.summary}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* Floating toolbar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 border-b border-white/8 bg-gray-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <ToolBtn onClick={() => onSettings({ fontSize: Math.max(14, settings.fontSize - 2) })} title="Кіші қаріп">
            <span className="text-xs font-bold">A</span>
          </ToolBtn>
          <span className="text-gray-500 text-xs w-8 text-center">{settings.fontSize}</span>
          <ToolBtn onClick={() => onSettings({ fontSize: Math.min(26, settings.fontSize + 2) })} title="Үлкен қаріп">
            <span className="text-sm font-bold">A</span>
          </ToolBtn>
        </div>

        <div className="flex items-center gap-1.5">
          <ToolBtn onClick={() => setShowSearch(v => !v)} active={showSearch} title="Іздеу">
            <Search size={14} />
          </ToolBtn>
          <ToolBtn onClick={handleBookmarkHere} title="Белгі қою">
            {isBookmarked('text', Math.round(textProgress))
              ? <BookmarkCheck size={14} className="text-violet-400" />
              : <Bookmark size={14} />}
          </ToolBtn>
          <ToolBtn onClick={() => setShowPanel(v => !v)} active={showPanel} title="Оқу параметрлері">
            <Settings2 size={14} />
          </ToolBtn>
        </div>

        <div className="text-gray-500 text-xs">{Math.round(textProgress)}%</div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/8 bg-gray-900/80">
            <div className="flex items-center gap-2 px-4 py-2">
              <Search size={14} className="text-gray-500 flex-shrink-0" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Мәтіннен іздеу..."
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none"
              />
              {matches.length > 0 && (
                <span className="text-gray-500 text-xs whitespace-nowrap">{searchIdx + 1}/{matches.length}</span>
              )}
              <div className="flex gap-1">
                <ToolBtn onClick={prevMatch} disabled={matches.length === 0}><ChevronUp size={13} /></ToolBtn>
                <ToolBtn onClick={nextMatch} disabled={matches.length === 0}><ChevronDown size={13} /></ToolBtn>
              </div>
              <ToolBtn onClick={() => { setShowSearch(false); setSearch(''); }}><X size={13} /></ToolBtn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/8 bg-gray-900/90 backdrop-blur-sm">
            <div className="px-4 sm:px-8 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Themes */}
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Тақта түсі</p>
                <div className="flex gap-1.5 flex-wrap">
                  {THEMES.map(t => (
                    <button key={t.id} onClick={() => onSettings({ theme: t.id })}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
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
                <div className="flex gap-1.5">
                  {FONTS.map(f => (
                    <button key={f.id} onClick={() => onSettings({ fontFamily: f.id })}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
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
                <div className="flex gap-1.5">
                  {LINE_HEIGHTS.map(lh => (
                    <button key={lh} onClick={() => onSettings({ lineHeight: lh })}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                        settings.lineHeight === lh
                          ? 'border-violet-400 bg-violet-500/15 text-violet-300'
                          : 'border-white/10 text-gray-400 hover:border-white/20'
                      }`}>{lh}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text content */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto ${theme.bg} transition-colors duration-300`}
        style={{ maxHeight: 'calc(100vh - 280px)' }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          {book.fullText.map((para, i) => {
            if (!para.trim()) return <div key={i} className="h-3" />;
            const isHeading = para === para.toUpperCase() && para.length < 60 && !para.includes(' ') || /^[IVXЛМ]+ /.test(para) || para.endsWith('СӨЗ') || para.startsWith('БІРІНШІ') || para.startsWith('ЕКІНШІ') || para.startsWith('ҮШІНШІ') || para.startsWith('ТӨРТІНШІ') || para.startsWith('БЕСІНШІ') || para.startsWith('АЛТЫНШЫ') || para.startsWith('ЖЕТІНШІ') || para.startsWith('СЕГІЗІНШІ') || para.startsWith('ТОҒЫЗЫНШЫ') || para.startsWith('ОНЫНШЫ') || /^[А-ЯӘІҢҒҮҰҚӨҺ\s]+$/.test(para) && para.length < 50;
            const isSearchMatch = search && matches.includes(i);

            return (
              <p
                key={i}
                id={`para-${i}`}
                className={`${theme.text} ${font.class} transition-all duration-200 ${
                  isHeading
                    ? 'text-base font-bold uppercase tracking-widest mt-8 mb-4 opacity-60'
                    : 'mb-5'
                } ${isSearchMatch ? 'bg-yellow-400/10 rounded-lg px-2 -mx-2 py-1' : ''}`}
                style={{
                  fontSize:   isHeading ? 13 : settings.fontSize,
                  lineHeight: settings.lineHeight,
                }}
              >
                {highlight(para)}
              </p>
            );
          })}
          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ children, onClick, active, disabled, title }: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors text-sm ${
        active ? 'bg-white/12 text-white' : 'text-gray-400 hover:text-white hover:bg-white/8'
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
