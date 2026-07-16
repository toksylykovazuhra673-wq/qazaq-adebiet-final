import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Upload, Search, Trash2, Download, Lock, Clock,
  FileType, User, Tag, ChevronRight, Plus, Layers, BookText,
} from 'lucide-react';
import { usePdfLibrary, type AnyBook } from '@/hooks/usePdfLibrary';
import PdfUploadModal from '@/components/reader/PdfUploadModal';
import type { StoredPdfBook } from '@/db/pdfStorage';
import booksJson from '@/data/books.json';

// Slugs that have fullText in books.json (digital reader)
const TEXT_READER_SLUGS = new Set((booksJson as { slug: string }[]).map(b => b.slug));

const GRADIENT_BY_CATEGORY: Record<string, string> = {
  'Классикалық әдебиет': 'from-violet-600 to-purple-800',
  'Роман-эпопея':        'from-blue-600 to-indigo-800',
  'Поэзия':              'from-rose-600 to-pink-800',
  'Оқулық':             'from-emerald-600 to-teal-800',
  'Шешендік өнер':       'from-amber-500 to-orange-700',
  'Ғылыми еңбек':        'from-cyan-600 to-blue-800',
  'Балалар әдебиеті':    'from-yellow-500 to-orange-600',
};
const defaultGrad = 'from-gray-600 to-gray-800';

function getGrad(cat: string) { return GRADIENT_BY_CATEGORY[cat] ?? defaultGrad; }

function isUploaded(b: AnyBook): b is StoredPdfBook {
  return 'userUploaded' in b && (b as any).userUploaded === true;
}

export default function PdfLibraryPage() {
  const [, navigate]   = useLocation();
  const lib            = usePdfLibrary();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'uploaded' | 'static'>('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleting, setDeleting]     = useState<string | null>(null);

  const filtered = lib.all.filter(b => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q);
    const matchesFilter =
      filter === 'all' ||
      (filter === 'uploaded' && isUploaded(b)) ||
      (filter === 'static'   && !isUploaded(b));
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (slug: string) => {
    setDeleting(slug);
    await lib.removeBook(slug);
    setDeleting(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-white/6">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <span>Кітапхана</span>
                <ChevronRight size={14} />
                <span className="text-gray-300">PDF оқырман</span>
              </div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
                  <BookOpen size={20} className="text-violet-400" />
                </div>
                PDF Кітапхана
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                {lib.all.length} кітап · {lib.uploaded.length} жүктелген
              </p>
            </div>

            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-semibold transition-colors shadow-lg shadow-violet-500/20"
            >
              <Plus size={18} />
              PDF қосу
            </button>
          </div>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Кітап атауы, автор немесе санат..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'static', 'uploaded'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    filter === f ? 'bg-white/15 text-white border border-white/20' : 'text-gray-400 hover:text-white border border-white/8 hover:border-white/15'
                  }`}>
                  {f === 'all' ? 'Барлығы' : f === 'static' ? 'Жүйелік' : 'Менің кітаптарым'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Grid ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {lib.loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-white/5 rounded-xl mb-3" />
                <div className="h-3 bg-white/5 rounded mb-2" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState search={search} onUpload={() => setUploadOpen(true)} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {filtered.map((book, i) => (
                <BookCard
                  key={book.slug}
                  book={book}
                  index={i}
                  onOpen={() => {
                    // If digital text available, prefer text reader
                    if (TEXT_READER_SLUGS.has(book.slug)) {
                      navigate(`/reader/${book.slug}`);
                    } else {
                      navigate(`/reader/pdf/${book.slug}`);
                    }
                  }}
                  onOpenPdf={TEXT_READER_SLUGS.has(book.slug) ? () => navigate(`/reader/pdf/${book.slug}`) : undefined}
                  onDelete={isUploaded(book) ? () => handleDelete(book.slug) : undefined}
                  deleting={deleting === book.slug}
                  hasText={TEXT_READER_SLUGS.has(book.slug)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Upload CTA at bottom */}
        {!lib.loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 border border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-colors cursor-pointer group"
            onClick={() => setUploadOpen(true)}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-violet-500/10 flex items-center justify-center mx-auto mb-3 transition-colors">
              <Upload size={22} className="text-gray-500 group-hover:text-violet-400 transition-colors" />
            </div>
            <p className="text-gray-400 group-hover:text-gray-300 font-medium transition-colors">Жаңа PDF қосу</p>
            <p className="text-gray-600 text-sm mt-1">Файлды сүйреп немесе басып таңдаңыз</p>
          </motion.div>
        )}
      </div>

      <PdfUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={lib.reload}
      />
    </div>
  );
}

// ─── Book Card ────────────────────────────────────────────────
function BookCard({ book, index, onOpen, onOpenPdf, onDelete, deleting, hasText }: {
  book: AnyBook;
  index: number;
  onOpen: () => void;
  onOpenPdf?: () => void;
  onDelete?: () => void;
  deleting: boolean;
  hasText?: boolean;
}) {
  const grad = getGrad(book.category);
  const initials = book.title.slice(0, 2).toUpperCase();
  const uploaded = isUploaded(book);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="group relative"
    >
      {/* Cover */}
      <button
        onClick={onOpen}
        className="block w-full aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 relative"
      >
        <div className={`w-full h-full bg-gradient-to-br ${grad} flex flex-col items-center justify-center p-4`}>
          <FileType size={28} className="text-white/30 mb-2" />
          <span className="text-2xl font-bold text-white/40">{initials}</span>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
          <div className="opacity-0 group-hover:opacity-100 transition-all bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-white text-xs font-medium">
            {hasText ? <BookText size={13} /> : <BookOpen size={13} />}
            {hasText ? 'Мәтін оқу' : 'Ашу'}
          </div>
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {uploaded && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/80 text-white font-medium">
              Менің
            </span>
          )}
          {book.allowDownload
            ? <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/70 text-white"><Download size={8} className="inline" /></span>
            : <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/70 text-white"><Lock size={8} className="inline" /></span>
          }
        </div>
      </button>

      {/* Info */}
      <div>
        <h3
          onClick={onOpen}
          className="text-white text-sm font-semibold line-clamp-2 leading-snug cursor-pointer hover:text-violet-300 transition-colors mb-1"
        >
          {book.title}
        </h3>
        <p className="text-gray-500 text-xs flex items-center gap-1 mb-0.5">
          <User size={10} />{book.author}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-xs flex items-center gap-1">
            <Tag size={10} />{book.category}
          </p>
          {book.pages > 0 && (
            <p className="text-gray-600 text-xs flex items-center gap-1">
              <Layers size={10} />{book.pages}
            </p>
          )}
        </div>
        {book.year && (
          <p className="text-gray-600 text-xs flex items-center gap-1 mt-0.5">
            <Clock size={10} />{book.year}
          </p>
        )}

        {/* Quick action buttons */}
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={onOpen}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/35 text-violet-300 text-[10px] font-medium transition-colors border border-violet-500/25"
          >
            {hasText ? <BookText size={10} /> : <BookOpen size={10} />}
            {hasText ? 'Мәтін' : 'Ашу'}
          </button>
          {onOpenPdf && (
            <button
              onClick={e => { e.stopPropagation(); onOpenPdf(); }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-blue-300 text-[10px] font-medium transition-colors border border-blue-500/20"
            >
              <FileType size={10} />PDF
            </button>
          )}
        </div>
      </div>

      {/* Delete button (uploaded only) */}
      {onDelete && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          disabled={deleting}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white"
          title="Жою"
        >
          {deleting ? <Loader size={12} /> : <Trash2 size={12} />}
        </button>
      )}
    </motion.div>
  );
}

function Loader({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" opacity={0.25} />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

function EmptyState({ search, onUpload }: { search: string; onUpload: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        {search ? <Search size={28} className="text-gray-600" /> : <BookOpen size={28} className="text-gray-600" />}
      </div>
      <p className="text-white font-semibold text-lg mb-2">
        {search ? 'Кітап табылмады' : 'Кітапхана бос'}
      </p>
      <p className="text-gray-500 text-sm mb-6">
        {search ? `«${search}» бойынша нәтиже жоқ` : 'Бірінші PDF кітабыңызды қосыңыз'}
      </p>
      {!search && (
        <button onClick={onUpload}
          className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-medium transition-colors">
          <Upload size={16} />PDF қосу
        </button>
      )}
    </div>
  );
}
