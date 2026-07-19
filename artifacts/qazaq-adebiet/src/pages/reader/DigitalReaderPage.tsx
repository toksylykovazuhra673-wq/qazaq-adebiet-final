import { useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

import { useDigitalReader } from '@/hooks/useDigitalReader';
import type { DrBookmark, ReaderTab } from '@/types/book';

import DRHeader       from '@/components/digital-reader/DRHeader';
import DRTabBar       from '@/components/digital-reader/DRTabBar';
import TextReaderTab  from '@/components/digital-reader/tabs/TextReaderTab';
import PdfViewTab     from '@/components/digital-reader/tabs/PdfViewTab';
import AudioPlayerTab from '@/components/digital-reader/tabs/AudioPlayerTab';
import CharactersTab  from '@/components/digital-reader/tabs/CharactersTab';
import SummaryTab     from '@/components/digital-reader/tabs/SummaryTab';
import FactsTab       from '@/components/digital-reader/tabs/FactsTab';
import BookmarksTab   from '@/components/digital-reader/tabs/BookmarksTab';
import NotesTab       from '@/components/digital-reader/tabs/NotesTab';

export default function DigitalReaderPage() {
  const params = useParams<{ slug: string }>();
  const slug   = params.slug ?? '';
  const [, navigate] = useLocation();

  const {
    book, persist,
    setActiveTab, setTextProgress, setPdfPage, setAudioTime,
    setTextSettings, toggleFavorite, toggleNightMode,
    addBookmark, removeBookmark, isBookmarked,
    addHighlight, removeHighlight,
    addNote, updateNote, removeNote,
  } = useDigitalReader(slug);

  const handleNavigateBookmark = useCallback((bm: DrBookmark) => {
    if (bm.type === 'text')  { setActiveTab('text'); }
    if (bm.type === 'pdf')   { setActiveTab('pdf');  setPdfPage(Math.round(bm.value)); }
    if (bm.type === 'audio') { setActiveTab('audio'); setAudioTime(bm.value); }
  }, [setActiveTab, setPdfPage, setAudioTime]);

  const noteSource = (['text', 'pdf', 'audio'] as const).includes(persist.activeTab as 'text' | 'pdf' | 'audio')
    ? persist.activeTab as 'text' | 'pdf' | 'audio'
    : 'text';

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle size={48} className="text-orange-400" />
        <h1 className="text-2xl font-bold text-white">Кітап табылмады</h1>
        <p className="text-gray-400 text-sm">«{slug}» атты шығарма кітапханада жоқ.</p>
        <button onClick={() => navigate('/reader')}
          className="mt-2 px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-medium transition-colors">
          Кітапханаға оралу
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <DRHeader
        book={book}
        isFavorite={persist.isFavorite}
        onToggleFavorite={toggleFavorite}
        textProgress={persist.textProgress}
        audioTime={persist.audioTime}
        nightMode={persist.nightMode}
        onToggleNightMode={toggleNightMode}
        activeTab={persist.activeTab}
      />

      <DRTabBar
        active={persist.activeTab}
        onChange={setActiveTab}
        book={book}
        bookmarkCount={persist.bookmarks.length}
        noteCount={persist.notes.length}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={persist.activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {persist.activeTab === 'text' && (
            <TextReaderTab
              book={book}
              settings={persist.textSettings}
              onSettings={setTextSettings}
              textProgress={persist.textProgress}
              onProgress={setTextProgress}
              onAddBookmark={addBookmark}
              isBookmarked={isBookmarked}
              onRemoveBookmark={removeBookmark}
              bookmarks={persist.bookmarks.filter(b => b.type === 'text')}
              highlights={persist.highlights}
              onAddHighlight={addHighlight}
              onRemoveHighlight={removeHighlight}
            />
          )}

          {persist.activeTab === 'pdf' && (
            <PdfViewTab
              book={book}
              currentPage={persist.pdfPage}
              onPageChange={setPdfPage}
            />
          )}

          {persist.activeTab === 'audio' && (
            <AudioPlayerTab
              book={book}
              savedTime={persist.audioTime}
              onTimeUpdate={setAudioTime}
              onAddBookmark={addBookmark}
              isBookmarked={isBookmarked}
            />
          )}

          {persist.activeTab === 'characters' && <CharactersTab book={book} />}
          {persist.activeTab === 'summary'    && <SummaryTab    book={book} />}
          {persist.activeTab === 'facts'      && <FactsTab      book={book} />}

          {persist.activeTab === 'bookmarks' && (
            <BookmarksTab
              bookmarks={persist.bookmarks}
              onRemove={removeBookmark}
              onNavigate={handleNavigateBookmark}
            />
          )}

          {persist.activeTab === 'notes' && (
            <NotesTab
              notes={persist.notes}
              currentSource={noteSource}
              onAdd={addNote}
              onUpdate={updateNote}
              onRemove={removeNote}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
