import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Heart, StickyNote, List, X } from 'lucide-react';
import type { PdfBook, PersistentReaderData } from '@/types/pdf-reader';
import type { ReaderState } from '@/types/pdf-reader';
import type { PdfCanvasHandle } from './PdfCanvas';
import ThumbnailsPanel from './sidebar/ThumbnailsPanel';
import BookmarksPanel  from './sidebar/BookmarksPanel';
import NotesPanel      from './sidebar/NotesPanel';
import TocPanel        from './sidebar/TocPanel';

const TABS = [
  { id: 'thumbnails', label: 'Нобайлар',  icon: LayoutGrid },
  { id: 'bookmarks',  label: 'Бетбелгі',  icon: Heart },
  { id: 'notes',      label: 'Жазбалар',  icon: StickyNote },
  { id: 'toc',        label: 'Мазмұны',   icon: List },
] as const;

interface Props {
  state: ReaderState;
  book: PdfBook;
  persistent: PersistentReaderData;
  totalPages: number;
  canvasRef: React.RefObject<PdfCanvasHandle | null>;
  onClose: () => void;
  onSetTab: (tab: ReaderState['sidebarTab']) => void;
  onGoToPage: (page: number) => void;
  onAddBookmark: (page: number, label: string) => void;
  onRemoveBookmark: (page: number) => void;
  onSaveNote: (page: number, text: string) => void;
}

export default function ReaderSidebar({
  state, book, persistent, totalPages, canvasRef,
  onClose, onSetTab, onGoToPage,
  onAddBookmark, onRemoveBookmark, onSaveNote,
}: Props) {
  return (
    <AnimatePresence>
      {state.sidebarOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-r border-white/8 flex flex-col overflow-hidden"
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/8 flex-shrink-0">
            <span className="text-xs font-medium text-gray-300">Панель</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/8 transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          {/* Tab nav */}
          <div className="flex border-b border-white/8 flex-shrink-0">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = state.sidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSetTab(tab.id)}
                  title={tab.label}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[9px] transition-colors
                    ${active
                      ? 'text-violet-300 border-b-2 border-violet-400'
                      : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                  <Icon size={13} />
                  {tab.label.slice(0, 5)}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.sidebarTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                {state.sidebarTab === 'thumbnails' && (
                  <ThumbnailsPanel
                    totalPages={totalPages}
                    currentPage={state.currentPage}
                    onGoToPage={onGoToPage}
                    canvasRef={canvasRef}
                  />
                )}
                {state.sidebarTab === 'bookmarks' && (
                  <BookmarksPanel
                    bookmarks={persistent.bookmarks}
                    currentPage={state.currentPage}
                    onGoToPage={onGoToPage}
                    onRemove={onRemoveBookmark}
                    onAdd={() => onAddBookmark(state.currentPage, `Бет ${state.currentPage}`)}
                  />
                )}
                {state.sidebarTab === 'notes' && (
                  <NotesPanel
                    notes={persistent.notes}
                    currentPage={state.currentPage}
                    onSave={onSaveNote}
                    onGoToPage={onGoToPage}
                  />
                )}
                {state.sidebarTab === 'toc' && (
                  <TocPanel
                    toc={book.tableOfContents}
                    currentPage={state.currentPage}
                    onGoToPage={onGoToPage}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
