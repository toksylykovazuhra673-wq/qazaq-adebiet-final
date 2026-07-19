import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight,
  RotateCw, Maximize2, Minimize2, Printer, Download,
  List, X, Sun, Moon, ChevronRight as ChevRight,
  Search, BookOpen,
} from 'lucide-react';
import PdfCanvas, { type PdfCanvasHandle } from '@/components/reader/PdfCanvas';
import type { Book } from '@/types/book';

interface Props {
  book: Book;
  currentPage: number;
  onPageChange: (p: number) => void;
}

const MODE_OPTIONS = [
  { id: 'dark',  icon: <Moon size={13} />,    label: 'Күңгірт' },
  { id: 'sepia', icon: <BookOpen size={13} />, label: 'Сепия'  },
  { id: 'light', icon: <Sun size={13} />,     label: 'Ашық'    },
] as const;

function NavBtn({ children, onClick, disabled, title, active }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; title?: string; active?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? 'bg-white/12 text-white' : 'text-gray-400 hover:text-white hover:bg-white/8'
      }`}>
      {children}
    </button>
  );
}

export default function PdfViewTab({ book, currentPage, onPageChange }: Props) {
  const canvasRef  = useRef<PdfCanvasHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageInputRef = useRef<HTMLInputElement>(null);

  const [zoom,        setZoom]       = useState(1.0);
  const [rotation,    setRotation]   = useState(0);
  const [total,       setTotal]      = useState(0);
  const [mode,        setMode]       = useState<'dark' | 'sepia' | 'light'>('dark');
  const [showToc,     setShowToc]    = useState(false);
  const [showSearch,  setShowSearch] = useState(false);
  const [searchQ,     setSearchQ]    = useState('');
  const [searching,   setSearching]  = useState(false);
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [searchIdx,   setSearchIdx]  = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [pageInput,   setPageInput]  = useState('');
  const [editingPage, setEditingPage] = useState(false);

  const pdfUrl = book.pdf ? `/pdf/${book.pdf}` : '';

  // Fullscreen
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

  // PDF search
  const handleSearch = useCallback(async () => {
    if (!searchQ.trim() || !canvasRef.current) return;
    setSearching(true);
    try {
      const pages = await canvasRef.current.search(searchQ);
      setSearchResults(pages);
      setSearchIdx(0);
      if (pages.length > 0) onPageChange(pages[0]);
    } finally { setSearching(false); }
  }, [searchQ, onPageChange]);

  const prevResult = () => {
    const i = (searchIdx - 1 + searchResults.length) % searchResults.length;
    setSearchIdx(i);
    onPageChange(searchResults[i]);
  };
  const nextResult = () => {
    const i = (searchIdx + 1) % searchResults.length;
    setSearchIdx(i);
    onPageChange(searchResults[i]);
  };

  // Print PDF
  const handlePrint = () => {
    if (!book.pdf) return;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 2000);
    };
  };

  // Page jump
  const commitPageInput = () => {
    const n = parseInt(pageInput, 10);
    if (!isNaN(n) && n >= 1 && n <= total) onPageChange(n);
    setEditingPage(false);
    setPageInput('');
  };

  const toc = book.tableOfContents ?? [];

  if (!book.pdf) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
          <FileText size={28} className="text-blue-400" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">PDF нұсқасы жоқ</h3>
        <p className="text-gray-400 text-sm">
          Бұл шығарманың PDF файлы қосылмаған.
        </p>
        <p className="text-gray-600 text-xs mt-3 font-mono">
          books.json ішіне <span className="text-gray-400">«pdf»</span> өрісін қосып,
          <br />файлды <span className="text-gray-400">public/pdf/</span> папкасына салыңыз
        </p>
      </div>
    );
  }

  const progress = total > 0 ? (currentPage / total) * 100 : 0;

  return (
    <div ref={containerRef} className="flex flex-col bg-gray-950"
      style={{ height: 'calc(100vh - 240px)', minHeight: 480 }}>

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/8 bg-gray-950/80 backdrop-blur-sm flex-shrink-0 gap-2">
        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <NavBtn onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} title="Алдыңғы бет">
            <ChevronLeft size={15} />
          </NavBtn>
          {editingPage ? (
            <input ref={pageInputRef} type="number" min={1} max={total}
              value={pageInput}
              onChange={e => setPageInput(e.target.value)}
              onBlur={commitPageInput}
              onKeyDown={e => { if (e.key === 'Enter') commitPageInput(); if (e.key === 'Escape') { setEditingPage(false); setPageInput(''); } }}
              className="w-12 bg-white/10 border border-white/20 rounded-lg text-white text-xs text-center px-1 py-0.5 focus:outline-none focus:border-violet-400"
              autoFocus
            />
          ) : (
            <button onClick={() => { setEditingPage(true); setPageInput(currentPage.toString()); }}
              className="text-white text-xs px-2 hover:bg-white/8 rounded-lg py-1 transition-colors min-w-[60px] text-center">
              {currentPage} / {total || '—'}
            </button>
          )}
          <NavBtn onClick={() => onPageChange(Math.min(total || 9999, currentPage + 1))} disabled={total > 0 && currentPage >= total} title="Келесі бет">
            <ChevronRight size={15} />
          </NavBtn>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <NavBtn onClick={() => setZoom(z => Math.max(0.4, z - 0.25))} title="Кішірейту"><ZoomOut size={14} /></NavBtn>
          <button onClick={() => setZoom(1)} title="100%"
            className="text-gray-400 text-xs w-12 text-center hover:text-white hover:bg-white/8 rounded-lg py-1 transition-colors">
            {Math.round(zoom * 100)}%
          </button>
          <NavBtn onClick={() => setZoom(z => Math.min(4, z + 0.25))} title="Үлкейту"><ZoomIn size={14} /></NavBtn>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-0.5">
          {/* TOC */}
          {toc.length > 0 && (
            <NavBtn onClick={() => setShowToc(v => !v)} active={showToc} title="Мазмұны">
              <List size={14} />
            </NavBtn>
          )}
          {/* Search */}
          <NavBtn onClick={() => setShowSearch(v => !v)} active={showSearch} title="Іздеу">
            <Search size={14} />
          </NavBtn>
          {/* Rotate */}
          <NavBtn onClick={() => setRotation(r => (r + 90) % 360)} title="Бұру">
            <RotateCw size={14} />
          </NavBtn>
          {/* Night mode */}
          <div className="relative">
            <NavBtn onClick={() => setShowModeMenu(v => !v)} active={showModeMenu} title="Түс режимі">
              {mode === 'dark' ? <Moon size={14} /> : mode === 'sepia' ? <BookOpen size={14} /> : <Sun size={14} />}
            </NavBtn>
            <AnimatePresence>
              {showModeMenu && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  className="absolute top-full right-0 mt-1 bg-gray-900 border border-white/10 rounded-xl p-1.5 z-30 flex flex-col gap-0.5 min-w-[100px]">
                  {MODE_OPTIONS.map(m => (
                    <button key={m.id} onClick={() => { setMode(m.id); setShowModeMenu(false); }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        mode === m.id ? 'bg-violet-500/20 text-violet-300' : 'text-gray-300 hover:bg-white/8'
                      }`}>
                      {m.icon}{m.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Print */}
          <NavBtn onClick={handlePrint} title="Басып шығару"><Printer size={14} /></NavBtn>
          {/* Download */}
          <a href={pdfUrl} download={book.pdf} title="Жүктеп алу"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-colors">
            <Download size={14} />
          </a>
          {/* Fullscreen */}
          <NavBtn onClick={toggleFullscreen} title={isFullscreen ? 'Кері шығу' : 'Толық экран'}>
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </NavBtn>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/5 flex-shrink-0">
        <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-200" style={{ width: `${progress}%` }} />
      </div>

      {/* PDF Search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/8 bg-gray-900/80 flex-shrink-0">
            <div className="flex items-center gap-2 px-4 py-2">
              <Search size={13} className="text-gray-500" />
              <input autoFocus value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); if (e.key === 'Escape') { setShowSearch(false); setSearchQ(''); setSearchResults([]); } }}
                placeholder="PDF-тен іздеу..."
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none" />
              {searchResults.length > 0 && (
                <span className="text-gray-500 text-xs whitespace-nowrap">{searchIdx + 1}/{searchResults.length} бет</span>
              )}
              <button onClick={handleSearch} disabled={searching}
                className="px-2.5 py-1 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs hover:bg-violet-500/30 transition-colors disabled:opacity-50">
                {searching ? '...' : 'Іздеу'}
              </button>
              {searchResults.length > 0 && <>
                <NavBtn onClick={prevResult}><ChevronLeft size={13} /></NavBtn>
                <NavBtn onClick={nextResult}><ChevronRight size={13} /></NavBtn>
              </>}
              <NavBtn onClick={() => { setShowSearch(false); setSearchQ(''); setSearchResults([]); }}><X size={12} /></NavBtn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content: TOC + Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* TOC Drawer */}
        <AnimatePresence>
          {showToc && toc.length > 0 && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25 }}
              className="flex-shrink-0 bg-gray-900/95 border-r border-white/8 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <List size={14} className="text-blue-400" />
                  <span className="text-white text-sm font-semibold">Мазмұны</span>
                </div>
                <button onClick={() => setShowToc(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
                  <X size={13} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {toc.map((entry, i) => (
                  <button key={i}
                    onClick={() => { if (entry.page) onPageChange(entry.page); }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-white/6 transition-colors flex items-center gap-2 ${
                      entry.page && Math.abs(currentPage - entry.page) < 2 ? 'text-blue-300' : ''
                    } ${entry.level === 2 ? 'pl-7' : ''}`}>
                    <ChevRight size={10} className="text-blue-400/50 flex-shrink-0" />
                    <span className={`text-xs leading-relaxed ${entry.level === 1 ? 'text-gray-200 font-medium' : 'text-gray-400'}`}>
                      {entry.title}
                    </span>
                    {entry.page && <span className="ml-auto text-[10px] text-gray-600">{entry.page}</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF Canvas */}
        <div className="flex-1 overflow-auto bg-gray-900">
          <PdfCanvas
            ref={canvasRef}
            pdfUrl={pdfUrl}
            currentPage={currentPage}
            zoom={zoom}
            rotation={rotation}
            readingMode={mode}
            onDocumentLoad={(pages) => setTotal(pages)}
            textSlug={book.isPublicDomain ? book.slug : undefined}
          />
        </div>
      </div>

      {/* Bottom status */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-white/8 bg-gray-950/80 flex-shrink-0">
        <span className="text-gray-600 text-[11px]">{book.title} · PDF</span>
        <div className="flex items-center gap-3">
          <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage <= 1}
            className="text-gray-600 hover:text-gray-300 transition-colors disabled:opacity-30">
            <ChevronLeft size={13} />
          </button>
          <span className="text-gray-500 text-[11px]">{currentPage} / {total || '?'}</span>
          <button onClick={() => onPageChange(Math.min(total, currentPage + 1))} disabled={currentPage >= total}
            className="text-gray-600 hover:text-gray-300 transition-colors disabled:opacity-30">
            <ChevronRight size={13} />
          </button>
        </div>
        <span className="text-gray-600 text-[11px]">{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
