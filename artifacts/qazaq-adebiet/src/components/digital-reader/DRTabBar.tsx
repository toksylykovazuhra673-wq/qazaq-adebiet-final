import { motion } from 'framer-motion';
import { BookOpen, FileText, Headphones, Users, AlignLeft, Sparkles, Bookmark, NotebookPen } from 'lucide-react';
import type { ReaderTab } from '@/types/book';
import type { Book } from '@/types/book';

const TABS: { id: ReaderTab; label: string; icon: React.ReactNode; check?: (b: Book) => boolean }[] = [
  { id: 'text',       label: 'Мәтін',      icon: <BookOpen size={15} /> },
  { id: 'pdf',        label: 'PDF',         icon: <FileText size={15} /> },
  { id: 'audio',      label: 'Аудио',       icon: <Headphones size={15} /> },
  { id: 'characters', label: 'Кейіпкерлер', icon: <Users size={15} /> },
  { id: 'summary',    label: 'Мазмұны',     icon: <AlignLeft size={15} /> },
  { id: 'facts',      label: 'Деректер',    icon: <Sparkles size={15} /> },
  { id: 'bookmarks',  label: 'Белгілер',    icon: <Bookmark size={15} /> },
  { id: 'notes',      label: 'Жазбалар',    icon: <NotebookPen size={15} /> },
];

interface Props {
  active: ReaderTab;
  onChange: (tab: ReaderTab) => void;
  book: Book;
  bookmarkCount: number;
  noteCount: number;
}

export default function DRTabBar({ active, onChange, book, bookmarkCount, noteCount }: Props) {
  return (
    <div className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-md border-b border-white/8">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="flex overflow-x-auto scrollbar-hide gap-0.5 py-1">
          {TABS.map(tab => {
            const isActive = tab.id === active;
            const badge =
              tab.id === 'bookmarks' && bookmarkCount > 0 ? bookmarkCount :
              tab.id === 'notes'     && noteCount > 0     ? noteCount : 0;

            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="dr-tab-indicator"
                    className="absolute inset-0 bg-white/8 rounded-t-lg border-b-2 border-violet-400"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {badge > 0 && (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-violet-500 text-white text-[9px] font-bold">
                      {badge}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
