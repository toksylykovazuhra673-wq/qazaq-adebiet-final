import { motion } from 'framer-motion';
import { Heart, Clock, Headphones, Eye, BookOpen, Calendar, Tag, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';
import type { Book } from '@/types/book';

interface Props {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  textProgress: number;
  audioTime: number;
}

function fmtTime(min: number) {
  if (min < 60) return `${min} мин`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} сағ ${m} мин` : `${h} сағ`;
}

function fmtViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

export default function DRHeader({ book, isFavorite, onToggleFavorite, textProgress, audioTime }: Props) {
  const [, navigate] = useLocation();

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${book.cover} opacity-30`} />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-6 pb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-6">
          <span className="hover:text-gray-300 cursor-pointer transition-colors" onClick={() => navigate('/reader')}>
            Кітапхана
          </span>
          <ChevronRight size={12} />
          <span className="text-gray-300 truncate max-w-[160px]">{book.title}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0"
          >
            <div className={`w-28 h-40 sm:w-36 sm:h-52 rounded-2xl bg-gradient-to-br ${book.cover} shadow-2xl flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative text-center px-3">
                <BookOpen size={28} className="text-white/40 mx-auto mb-2" />
                <span className="text-white/50 font-bold text-xl">{book.title.slice(0, 2).toUpperCase()}</span>
              </div>
              {/* Spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20 rounded-l-2xl" />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="flex-1 min-w-0"
          >
            {/* Genre badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 border border-white/10 text-gray-300 text-xs mb-3">
              <Tag size={10} />
              {book.genre}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-1.5">
              {book.title}
            </h1>
            <p className="text-gray-300 text-base mb-4">{book.author}</p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              <MetaCard icon={<Calendar size={13} />} label="Жылы" value={book.year} />
              <MetaCard icon={<Clock size={13} />} label="Оқу" value={fmtTime(book.readingTimeMin)} />
              <MetaCard icon={<Headphones size={13} />} label="Аудио" value={fmtTime(book.listeningTimeMin)} />
              <MetaCard icon={<Eye size={13} />} label="Оқыған" value={fmtViews(book.views)} />
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2">
              {book.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  isFavorite
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 hover:bg-rose-500/20'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Heart size={15} className={isFavorite ? 'fill-current' : ''} />
                {isFavorite ? 'Таңдаулыда' : 'Таңдаулы'}
              </button>

              {/* Public domain badge */}
              {book.isPublicDomain && (
                <span className="px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                  Ашық қол жеткізу
                </span>
              )}
            </div>

            {/* Progress indicators */}
            {(textProgress > 0 || audioTime > 0) && (
              <div className="mt-4 flex gap-3">
                {textProgress > 0 && (
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Мәтін</span>
                      <span>{Math.round(textProgress)}%</span>
                    </div>
                    <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${textProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MetaCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/8 rounded-xl px-3 py-2">
      <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase tracking-wide mb-0.5">
        {icon}{label}
      </div>
      <div className="text-white text-xs font-semibold">{value}</div>
    </div>
  );
}
