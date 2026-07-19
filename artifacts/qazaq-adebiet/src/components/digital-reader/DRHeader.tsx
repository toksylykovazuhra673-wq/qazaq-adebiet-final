import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Clock, Headphones, Eye, BookOpen, Calendar, Tag,
  ChevronRight, Moon, Sun, Printer, Download, Maximize2,
  FileText, Volume2,
} from 'lucide-react';
import { useLocation } from 'wouter';
import type { Book } from '@/types/book';

interface Props {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  textProgress: number;
  audioTime: number;
  nightMode: boolean;
  onToggleNightMode: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onFullscreen?: () => void;
  activeTab: string;
}

function fmtTime(min: number | undefined | null) {
  if (!min || !isFinite(min)) return '—';
  if (min < 60) return `${min} мин`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} сағ ${m} мин` : `${h} сағ`;
}

function fmtViews(n: number | undefined | null) {
  if (!n || !isFinite(n)) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

export default function DRHeader({
  book, isFavorite, onToggleFavorite,
  textProgress, audioTime,
  nightMode, onToggleNightMode,
  onPrint, onDownload, onFullscreen,
  activeTab,
}: Props) {
  const [, navigate] = useLocation();
  const [showMeta, setShowMeta] = useState(false);

  const audioPct = book.listeningTimeMin > 0
    ? Math.min(100, Math.round((audioTime / (book.listeningTimeMin * 60)) * 100))
    : 0;

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${book.cover} opacity-25`} />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-5 pb-6">
        {/* Breadcrumb + quick actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <span className="hover:text-gray-300 cursor-pointer transition-colors" onClick={() => navigate('/reader')}>
              Кітапхана
            </span>
            <ChevronRight size={11} />
            <span className="text-gray-400 truncate max-w-[140px]">{book.title}</span>
          </div>

          {/* Quick action buttons */}
          <div className="flex items-center gap-1">
            <button onClick={onToggleNightMode} title={nightMode ? 'Ашық режим' : 'Түнгі режим'}
              className={`p-1.5 rounded-lg transition-colors text-xs ${
                nightMode ? 'text-violet-400 bg-violet-500/10' : 'text-amber-400 bg-amber-500/10'
              }`}>
              {nightMode ? <Moon size={14} /> : <Sun size={14} />}
            </button>
            {onPrint && (
              <button onClick={onPrint} title="Басып шығару"
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
                <Printer size={14} />
              </button>
            )}
            {onDownload && (
              <button onClick={onDownload} title="Жүктеп алу"
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
                <Download size={14} />
              </button>
            )}
            {onFullscreen && (
              <button onClick={onFullscreen} title="Толық экран"
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
                <Maximize2 size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Cover */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0">
            <div className={`w-24 h-36 sm:w-32 sm:h-48 rounded-2xl bg-gradient-to-br ${book.cover} shadow-2xl flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/20 rounded-l-2xl" />
              <div className="relative text-center px-2">
                <BookOpen size={24} className="text-white/40 mx-auto mb-1.5" />
                <span className="text-white/50 font-bold text-lg leading-tight block">
                  {book.title.slice(0, 2).toUpperCase()}
                </span>
              </div>
              {/* Reading progress overlay */}
              {textProgress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30">
                  <div className="h-full bg-violet-400 transition-all duration-500" style={{ width: `${textProgress}%` }} />
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="flex-1 min-w-0">
            {/* Genre + tags */}
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-gray-300 text-xs">
                <Tag size={9} />{book.genre}
              </span>
              {book.isPublicDomain && (
                <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                  Ашық қол жеткізу
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-1">{book.title}</h1>
            <p className="text-gray-300 text-sm mb-3">{book.author}</p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Calendar size={11} />{book.year}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{fmtTime(book.readingTimeMin)} оқу</span>
              <span className="flex items-center gap-1"><Headphones size={11} />{fmtTime(book.listeningTimeMin)} аудио</span>
              <span className="flex items-center gap-1"><Eye size={11} />{fmtViews(book.views)} оқыған</span>
              {book.pdf && <span className="flex items-center gap-1 text-blue-400/70"><FileText size={11} />PDF</span>}
              {book.audio && <span className="flex items-center gap-1 text-indigo-400/70"><Volume2 size={11} />Аудио</span>}
            </div>

            {/* Description (toggleable) */}
            <div className="mb-4">
              <p className={`text-gray-400 text-sm leading-relaxed ${showMeta ? '' : 'line-clamp-2'}`}>
                {book.description}
              </p>
              {book.description.length > 100 && (
                <button onClick={() => setShowMeta(v => !v)}
                  className="text-gray-600 hover:text-gray-400 text-xs mt-1 transition-colors">
                  {showMeta ? 'Жию ↑' : 'Толығырақ ↓'}
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={onToggleFavorite}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                  isFavorite
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 hover:bg-rose-500/20'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}>
                <Heart size={14} className={isFavorite ? 'fill-current' : ''} />
                {isFavorite ? 'Таңдаулыда' : 'Таңдаулы'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Reading progress bars */}
        <AnimatePresence>
          {(textProgress > 0 || audioPct > 0) && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {textProgress > 0 && (
                <div className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <BookOpen size={11} />
                      <span>Мәтін оқу</span>
                    </div>
                    <span className="text-violet-400 text-xs font-semibold">{Math.round(textProgress)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${textProgress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                  </div>
                </div>
              )}
              {audioPct > 0 && (
                <div className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <Headphones size={11} />
                      <span>Аудио тыңдау</span>
                    </div>
                    <span className="text-indigo-400 text-xs font-semibold">{audioPct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${audioPct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
