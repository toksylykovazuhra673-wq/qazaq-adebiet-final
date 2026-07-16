import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2,
  BookOpen, Columns2, AlignJustify, ArrowLeft, ArrowRight,
  Search, Download, Printer, Heart, Sun, Moon, Coffee,
  SlidersHorizontal, ChevronLeft, ChevronRight,
} from 'lucide-react';
import type { ReaderState } from '@/types/pdf-reader';

interface Props {
  state: ReaderState;
  totalPages: number;
  allowDownload: boolean;
  pdfUrl: string;
  bookTitle: string;
  isBookmarked: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
  onFitPage: () => void;
  onRotate: () => void;
  onToggleFullscreen: () => void;
  onSetLayout: (l: ReaderState['layout']) => void;
  onSetMode: (m: ReaderState['mode']) => void;
  onToggleSearch: () => void;
  onToggleSidebar: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSetPage: (p: number) => void;
  onToggleBookmark: () => void;
}

export default function ReaderToolbar({
  state, totalPages, allowDownload, pdfUrl, bookTitle, isBookmarked,
  onZoomIn, onZoomOut, onFitWidth, onFitPage, onRotate, onToggleFullscreen,
  onSetLayout, onSetMode, onToggleSearch, onToggleSidebar,
  onPrevPage, onNextPage, onSetPage, onToggleBookmark,
}: Props) {
  const [pageInput, setPageInput] = useState('');
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(pageInput, 10);
    if (!isNaN(n)) { onSetPage(n); setPageInput(''); }
  };

  const ZOOM_PRESETS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border-b border-white/8 px-3 py-1.5 flex-shrink-0">
      <div className="flex items-center gap-1 flex-wrap">

        {/* Sidebar toggle */}
        <ToolBtn onClick={onToggleSidebar} title="Бүйірлік панель">
          <SlidersHorizontal size={15} />
        </ToolBtn>

        <Divider />

        {/* Page navigation */}
        <ToolBtn onClick={onPrevPage} disabled={state.currentPage <= 1} title="Алдыңғы бет">
          <ChevronLeft size={15} />
        </ToolBtn>

        <form onSubmit={handlePageSubmit} className="flex items-center gap-1">
          <input
            value={pageInput}
            onChange={e => setPageInput(e.target.value)}
            placeholder={String(state.currentPage)}
            className="w-10 text-center bg-white/8 border border-white/15 rounded-lg px-1 py-0.5 text-xs text-white focus:outline-none focus:border-white/30"
          />
          <span className="text-gray-500 text-xs">/ {totalPages || '—'}</span>
        </form>

        <ToolBtn onClick={onNextPage} disabled={state.currentPage >= totalPages} title="Келесі бет">
          <ChevronRight size={15} />
        </ToolBtn>

        <Divider />

        {/* Zoom */}
        <ToolBtn onClick={onZoomOut} title="Кішірейту (Ctrl+-)">
          <ZoomOut size={15} />
        </ToolBtn>

        <div className="relative">
          <button
            onClick={() => setShowZoomMenu(m => !m)}
            className="text-xs text-gray-300 bg-white/8 border border-white/10 rounded-lg px-2 py-1 hover:bg-white/15 transition-colors min-w-[48px]"
          >
            {Math.round(state.zoom * 100)}%
          </button>
          <AnimatePresence>
            {showZoomMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute top-full mt-1 left-0 z-50 bg-gray-800 border border-white/10 rounded-xl overflow-hidden shadow-xl"
              >
                {ZOOM_PRESETS.map(z => (
                  <button key={z}
                    onClick={() => { onZoomOut(); setShowZoomMenu(false); /* hack: set via preset */ }}
                    className="block w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/10 transition-colors"
                  >
                    {Math.round(z * 100)}%
                  </button>
                ))}
                <div className="border-t border-white/8">
                  <button onClick={() => { onFitWidth(); setShowZoomMenu(false); }}
                    className="block w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/10">Ені бойынша</button>
                  <button onClick={() => { onFitPage(); setShowZoomMenu(false); }}
                    className="block w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/10">Беті бойынша</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ToolBtn onClick={onZoomIn} title="Үлкейту (Ctrl++)">
          <ZoomIn size={15} />
        </ToolBtn>

        <Divider />

        {/* Layout */}
        <ToolBtn onClick={() => onSetLayout('single')} title="Бір бет" active={state.layout === 'single'}>
          <BookOpen size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => onSetLayout('double')} title="Екі бет" active={state.layout === 'double'}>
          <Columns2 size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => onSetLayout('continuous')} title="Үздіксіз" active={state.layout === 'continuous'}>
          <AlignJustify size={15} />
        </ToolBtn>

        <Divider />

        {/* Rotate / Fullscreen */}
        <ToolBtn onClick={onRotate} title="Айналдыру">
          <RotateCw size={15} />
        </ToolBtn>
        <ToolBtn onClick={onToggleFullscreen} title="Толық экран">
          {state.fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </ToolBtn>

        <Divider />

        {/* Reading mode */}
        <div className="relative">
          <ToolBtn onClick={() => setShowModeMenu(m => !m)} title="Оқу режимі"
            active={showModeMenu}>
            {state.mode === 'dark' ? <Moon size={15} /> : state.mode === 'sepia' ? <Coffee size={15} /> : <Sun size={15} />}
          </ToolBtn>
          <AnimatePresence>
            {showModeMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute top-full mt-1 right-0 z-50 bg-gray-800 border border-white/10 rounded-xl overflow-hidden shadow-xl"
              >
                {([['dark','Қараңғы', Moon], ['sepia','Сепия', Coffee], ['light','Жарық', Sun]] as const).map(([m, label, Icon]) => (
                  <button key={m} onClick={() => { onSetMode(m); setShowModeMenu(false); }}
                    className={`flex items-center gap-2 w-full px-4 py-2 text-xs transition-colors ${state.mode === m ? 'text-violet-300 bg-violet-500/10' : 'text-gray-300 hover:bg-white/10'}`}>
                    <Icon size={13} />{label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Divider />

        {/* Search */}
        <ToolBtn onClick={onToggleSearch} title="Іздеу (Ctrl+F)" active={state.searchOpen}>
          <Search size={15} />
        </ToolBtn>

        {/* Bookmark */}
        <ToolBtn onClick={onToggleBookmark} title="Бетбелгі" active={isBookmarked}>
          <Heart size={15} fill={isBookmarked ? 'currentColor' : 'none'}
            className={isBookmarked ? 'text-red-400' : ''} />
        </ToolBtn>

        {/* Download */}
        {allowDownload && (
          <a href={pdfUrl} download={bookTitle}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all" title="Жүктеу">
            <Download size={15} />
          </a>
        )}

        {/* Print */}
        <ToolBtn onClick={() => window.print()} title="Басып шығару">
          <Printer size={15} />
        </ToolBtn>
      </div>
    </div>
  );
}

function ToolBtn({ onClick, children, title, active, disabled }: {
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition-all ${
        active
          ? 'text-violet-300 bg-violet-500/20 border border-violet-500/30'
          : 'text-gray-400 hover:text-white hover:bg-white/8'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="h-4 w-px bg-white/10 mx-0.5 flex-shrink-0" />;
}
