import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  BookOpen, Headphones, FileText, Heart, ChevronRight,
  Search, Filter,
} from 'lucide-react';
import type { ReadingRecord } from '@/types/student';
import rawBooks from '@/data/books.json';

interface BookEntry {
  id: string;
  slug: string;
  title: string;
  authorName: string;
  genre: string;
  year: number | string;
  description: string;
  cover: string;
  pdfAvailable: boolean;
  audioAvailable: boolean;
  gradeLevel?: number;
}

const BOOKS = rawBooks as unknown as BookEntry[];

const COVERS = [
  'from-violet-600 to-purple-700',
  'from-blue-600 to-indigo-700',
  'from-emerald-600 to-teal-700',
  'from-orange-500 to-red-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-purple-500 to-indigo-600',
];

type LibFilter = 'all' | 'reading' | 'finished' | 'favorites' | 'pdf' | 'audio';

interface Props {
  readingRecords: ReadingRecord[];
}

function ProgressRing({ pct, size = 40 }: { pct: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#pg)" strokeWidth={3}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" className="transition-all duration-700" />
      <defs>
        <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function CabLibrary({ readingRecords }: Props) {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<LibFilter>('all');
  const [search, setSearch] = useState('');

  const recMap = Object.fromEntries(readingRecords.map(r => [r.bookSlug, r]));

  const filtered = BOOKS.filter(book => {
    const rec = recMap[book.id];
    const q = search.toLowerCase();
    const matchSearch = !q ||
      book.title.toLowerCase().includes(q) ||
      (book.authorName ?? '').toLowerCase().includes(q) ||
      (book.genre ?? '').toLowerCase().includes(q);
    if (!matchSearch) return false;
    switch (filter) {
      case 'reading':   return rec && rec.textProgress > 0 && rec.textProgress < 90;
      case 'finished':  return rec && rec.textProgress >= 90;
      case 'favorites': return rec?.isFavorite;
      case 'pdf':       return book.pdfAvailable;
      case 'audio':     return book.audioAvailable;
      default:          return true;
    }
  });

  const FILTERS: { id: LibFilter; label: string }[] = [
    { id: 'all',       label: 'Барлығы' },
    { id: 'reading',   label: 'Оқылуда' },
    { id: 'finished',  label: 'Аяқталды' },
    { id: 'favorites', label: '❤️ Таңдаулы' },
    { id: 'pdf',       label: 'PDF' },
    { id: 'audio',     label: 'Аудио' },
  ];

  return (
    <div className="space-y-6">
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Кітап атауы, автор…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5
              text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50" />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter size={13} className="text-gray-600 flex-shrink-0" />
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.id
                  ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                  : 'bg-white/4 border border-white/8 text-gray-500 hover:text-gray-300'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span>{BOOKS.length} кітап жалпы</span>
        <span>·</span>
        <span className="text-violet-400">{readingRecords.filter(r => r.textProgress >= 90).length} оқылды</span>
        <span>·</span>
        <span className="text-indigo-400">{readingRecords.filter(r => r.isFavorite).length} таңдаулы</span>
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((book, idx) => {
          const rec = recMap[book.id];
          const pct = rec?.textProgress ?? 0;
          const finished = pct >= 90;
          const inProgress = pct > 0 && !finished;
          const coverGrad = COVERS[idx % COVERS.length];

          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * idx }}
              className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:border-white/15
                hover:bg-white/6 transition-all group">
              {/* Cover strip */}
              <div className={`h-2 bg-gradient-to-r ${coverGrad}`} />

              <div className="p-4">
                <div className="flex gap-3 items-start">
                  {/* Mini cover */}
                  <div className={`flex-shrink-0 w-12 h-16 rounded-lg bg-gradient-to-br ${coverGrad}
                    flex items-center justify-center relative overflow-hidden shadow-lg`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="relative text-white/60 font-bold text-lg">
                      {book.title.slice(0, 1).toUpperCase()}
                    </span>
                    {rec?.isFavorite && (
                      <div className="absolute top-0.5 right-0.5">
                        <Heart size={10} className="text-rose-400 fill-current" />
                      </div>
                    )}
                    {finished && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-lg">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-sm font-semibold leading-tight mb-0.5 truncate">
                      {book.title}
                    </h3>
                    <p className="text-gray-500 text-xs truncate">{book.authorName}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="px-1.5 py-0.5 rounded-md bg-white/6 text-gray-500 text-[10px]">{book.genre}</span>
                      {book.pdfAvailable && <FileText size={10} className="text-blue-400/70" />}
                      {book.audioAvailable && <Headphones size={10} className="text-indigo-400/70" />}
                    </div>
                  </div>

                  {/* Progress ring */}
                  {pct > 0 && (
                    <div className="relative flex-shrink-0">
                      <ProgressRing pct={pct} size={38} />
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-bold">
                        {Math.round(pct)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status badges */}
                <div className="flex items-center gap-2 mt-3">
                  {finished && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20
                      text-emerald-400 text-[10px] font-medium">✓ Оқылды</span>
                  )}
                  {inProgress && (
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20
                      text-violet-400 text-[10px] font-medium">Оқылуда {Math.round(pct)}%</span>
                  )}
                  {rec?.lastActiveTab === 'audio' && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20
                      text-indigo-400 text-[10px]">🎧 Аудио</span>
                  )}
                </div>

                {/* Progress bar */}
                {pct > 0 && (
                  <div className="mt-2 h-1 bg-white/6 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${finished ? 'bg-emerald-500' : 'bg-violet-500'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/reader/${book.id}`)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium
                      transition-all ${pct > 0
                        ? 'bg-violet-500/15 border border-violet-500/30 text-violet-400 hover:bg-violet-500/25'
                        : 'bg-white/6 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
                    <BookOpen size={12} />
                    {pct > 0 ? 'Жалғастыру' : 'Ашу'}
                    <ChevronRight size={11} className="ml-auto" />
                  </button>
                  {book.pdfAvailable && (
                    <button
                      onClick={() => navigate(`/reader/${book.id}`)}
                      className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400
                        hover:bg-blue-500/20 transition-all">
                      <FileText size={13} />
                    </button>
                  )}
                  {book.audioAvailable && (
                    <button
                      onClick={() => navigate(`/reader/${book.id}`)}
                      className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400
                        hover:bg-indigo-500/20 transition-all">
                      <Headphones size={13} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Кітаптар табылмады</p>
        </div>
      )}
    </div>
  );
}
