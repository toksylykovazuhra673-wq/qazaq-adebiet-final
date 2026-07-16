import { useRef, useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, BookOpen } from 'lucide-react';

import pdfLibrary from '@/data/pdf-library.json';
import type { PdfBook } from '@/types/pdf-reader';
import { usePdfReader } from '@/hooks/usePdfReader';
import { getUploadedBook, getObjectUrl } from '@/db/pdfStorage';
import type { PdfCanvasHandle } from '@/components/reader/PdfCanvas';
import PdfCanvas       from '@/components/reader/PdfCanvas';
import ReaderHeader    from '@/components/reader/ReaderHeader';
import ReaderToolbar   from '@/components/reader/ReaderToolbar';
import ReaderSidebar   from '@/components/reader/ReaderSidebar';
import SearchPanel     from '@/components/reader/SearchPanel';

const staticBooks = pdfLibrary as PdfBook[];

export default function PdfReaderPage() {
  const params    = useParams<{ slug: string }>();
  const slug      = params.slug ?? '';
  const canvasRef = useRef<PdfCanvasHandle>(null);

  // Resolve book: static JSON first, then IndexedDB
  const [book, setBook]       = useState<PdfBook | null>(() => staticBooks.find(b => b.slug === slug) ?? null);
  const [pdfUrl, setPdfUrl]   = useState<string>('');
  const [resolving, setResolving] = useState(!book);

  useEffect(() => {
    let objectUrl = '';
    const resolve = async () => {
      // 1. Static book?
      const staticBook = staticBooks.find(b => b.slug === slug);
      if (staticBook) {
        setBook(staticBook);
        setPdfUrl(`/pdf/${staticBook.pdfFile}`);
        setResolving(false);
        return;
      }
      // 2. Uploaded book in IndexedDB?
      const uploaded = await getUploadedBook(slug);
      if (uploaded) {
        setBook(uploaded);
        objectUrl = (await getObjectUrl(slug)) ?? '';
        setPdfUrl(objectUrl);
        setResolving(false);
        return;
      }
      // 3. Not found
      setBook(null);
      setResolving(false);
    };
    resolve();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [slug]);

  const [totalPages, setTotalPages] = useState(book?.pages ?? 0);
  const [hasText, setHasText]       = useState(false);

  const reader = usePdfReader(slug, totalPages);
  const { state, persistent } = reader;

  // Touch / swipe support
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd   = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 60) { if (dx < 0) reader.nextPage(); else reader.prevPage(); }
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  }, [reader]);

  if (resolving) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-violet-400 border-t-transparent" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4 gap-4">
        <AlertCircle size={48} className="text-orange-400" />
        <h1 className="text-2xl font-bold text-white">Кітап табылмады</h1>
        <p className="text-gray-400">«{slug}» атты PDF кітапхананда жоқ.</p>
      </div>
    );
  }
  const isBookmarked = persistent.bookmarks.some(b => b.page === state.currentPage);

  // Background colors by mode
  const bgColor = state.mode === 'sepia' ? 'bg-amber-950' : state.mode === 'light' ? 'bg-gray-100' : 'bg-gray-950';

  return (
    <div className={`flex flex-col h-screen ${bgColor} transition-colors duration-300`}>
      {/* Header */}
      <ReaderHeader book={book} currentPage={state.currentPage} totalPages={totalPages} />

      {/* Toolbar */}
      <ReaderToolbar
        state={state}
        totalPages={totalPages}
        allowDownload={book.allowDownload}
        pdfUrl={pdfUrl}
        bookTitle={book.title}
        isBookmarked={isBookmarked}
        onZoomIn={reader.zoomIn}
        onZoomOut={reader.zoomOut}
        onFitWidth={reader.fitWidth}
        onFitPage={reader.fitPage}
        onRotate={reader.rotate}
        onToggleFullscreen={reader.toggleFullscreen}
        onSetLayout={reader.setLayout}
        onSetMode={reader.setMode}
        onToggleSearch={reader.toggleSearch}
        onToggleSidebar={reader.toggleSidebar}
        onPrevPage={reader.prevPage}
        onNextPage={reader.nextPage}
        onSetPage={reader.setPage}
        onToggleBookmark={() => {
          if (isBookmarked) reader.removeBookmark(state.currentPage);
          else reader.addBookmark(state.currentPage, `Бет ${state.currentPage}`);
        }}
      />

      {/* Main body */}
      <div className="flex flex-1 overflow-hidden relative" ref={containerRef}>
        {/* Sidebar */}
        <ReaderSidebar
          state={state}
          book={book}
          persistent={persistent}
          totalPages={totalPages}
          canvasRef={canvasRef}
          onClose={reader.toggleSidebar}
          onSetTab={reader.setSidebarTab}
          onGoToPage={reader.setPage}
          onAddBookmark={reader.addBookmark}
          onRemoveBookmark={reader.removeBookmark}
          onSaveNote={reader.saveNote}
        />

        {/* PDF viewport */}
        <div className="flex-1 overflow-auto relative" id="pdf-scroll-area">
          {/* Search panel (floats above) */}
          <SearchPanel
            open={state.searchOpen}
            onClose={reader.toggleSearch}
            onGoToPage={reader.setPage}
            canvasRef={canvasRef}
          />

          {/* Continuous mode: render all pages stacked */}
          {state.layout === 'continuous' ? (
            <ContinuousViewer
              book={book}
              pdfUrl={pdfUrl}
              zoom={state.zoom}
              rotation={state.rotation}
              readingMode={state.mode}
              currentPage={state.currentPage}
              totalPages={totalPages}
              canvasRef={canvasRef}
              onDocumentLoad={(pages, text) => { setTotalPages(pages); setHasText(text); }}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentPage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="min-h-full flex items-start justify-center"
              >
                <PdfCanvas
                  ref={canvasRef}
                  pdfUrl={pdfUrl}
                  currentPage={state.currentPage}
                  zoom={state.zoom}
                  rotation={state.rotation}
                  readingMode={state.mode}
                  layout={state.layout}
                  onDocumentLoad={(pages, text) => { setTotalPages(pages); setHasText(text); }}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Mobile floating toolbar */}
        <MobileFloatingBar
          currentPage={state.currentPage}
          totalPages={totalPages}
          onPrev={reader.prevPage}
          onNext={reader.nextPage}
        />
      </div>

      {/* Reading progress bar (bottom) */}
      <div className="h-0.5 bg-white/5 flex-shrink-0">
        <motion.div
          className="h-full bg-violet-500"
          animate={{ width: totalPages ? `${(state.currentPage / totalPages) * 100}%` : '0%' }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// ─── Continuous scroll viewer ─────────────────────────────────
function ContinuousViewer({ book, pdfUrl, zoom, rotation, readingMode, currentPage, totalPages, canvasRef, onDocumentLoad }: {
  book: PdfBook;
  pdfUrl: string;
  zoom: number;
  rotation: number;
  readingMode: 'dark' | 'sepia' | 'light';
  currentPage: number;
  totalPages: number;
  canvasRef: React.RefObject<PdfCanvasHandle | null>;
  onDocumentLoad: (pages: number, hasText: boolean) => void;
}) {
  // Render first page with doc load callback; additional pages handled by stacking
  // For simplicity render pages 1 through min(totalPages,10) + jump to current
  const visiblePages = Array.from({ length: Math.min(totalPages || book.pages, 5) }, (_, i) => i + 1);

  return (
    <div className="space-y-4 py-4">
      {/* First page loads the document */}
      <PdfCanvas
        ref={canvasRef}
        pdfUrl={pdfUrl}
        currentPage={currentPage}
        zoom={zoom}
        rotation={rotation}
        readingMode={readingMode}
        layout="single"
        onDocumentLoad={onDocumentLoad}
      />
    </div>
  );
}

// ─── Mobile floating nav ──────────────────────────────────────
function MobileFloatingBar({ currentPage, totalPages, onPrev, onNext }: {
  currentPage: number; totalPages: number; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-3 bg-gray-800/95 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5 shadow-2xl">
        <button onClick={onPrev} disabled={currentPage <= 1}
          className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-white disabled:opacity-30 transition-colors">
          ←
        </button>
        <span className="text-xs text-gray-300 min-w-[60px] text-center font-medium">
          {currentPage} / {totalPages || '—'}
        </span>
        <button onClick={onNext} disabled={currentPage >= totalPages}
          className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-white disabled:opacity-30 transition-colors">
          →
        </button>
      </div>
    </div>
  );
}
