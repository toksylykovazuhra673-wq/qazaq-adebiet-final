import { motion } from 'framer-motion';
import {
  ArrowLeft, ChevronRight, BookOpen, User, Tag, Clock, FileText,
} from 'lucide-react';
import type { PdfBook } from '@/types/pdf-reader';

interface Props {
  book: PdfBook;
  currentPage: number;
  totalPages: number;
}

export default function ReaderHeader({ book, currentPage, totalPages }: Props) {
  const progress = totalPages ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/95 backdrop-blur-sm border-b border-white/8 px-4 py-2 flex-shrink-0"
    >
      <div className="flex items-center gap-4">
        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm flex-shrink-0"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Артқа</span>
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-white/15 flex-shrink-0" />

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
          <span>Кітапхана</span>
          <ChevronRight size={12} />
          <span className="text-gray-300 truncate max-w-[120px]">{book.title}</span>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-4 w-px bg-white/15 flex-shrink-0" />

        {/* Book info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-white font-semibold text-sm truncate max-w-[200px] sm:max-w-[300px]">
              {book.title}
            </h1>
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <User size={11} />{book.author}
              </span>
              <span className="flex items-center gap-1">
                <Tag size={11} />{book.category}
              </span>
              <span className="flex items-center gap-1">
                <FileText size={11} />{book.pages} бет
              </span>
              {book.readingTimeMin && (
                <span className="flex items-center gap-1">
                  <Clock size={11} />~{Math.round(book.readingTimeMin / 60)} сағ
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reading progress */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-violet-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs text-gray-400">{progress}%</span>
          </div>
          <span className="text-xs text-gray-300 bg-white/8 px-2 py-1 rounded-lg border border-white/10">
            {currentPage} / {totalPages || '—'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
