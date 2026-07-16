import { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Quote, Eye, MapPin, FileText, Headphones, Star, Share2, ChevronRight } from 'lucide-react';
import type { Writer } from '@/types/writer';

interface Props {
  writer: Writer;
  index: number;
}

const GRADIENT_FALLBACKS = [
  'from-violet-800 to-indigo-900',
  'from-blue-800 to-slate-900',
  'from-emerald-800 to-teal-900',
  'from-rose-800 to-pink-900',
  'from-amber-800 to-orange-900',
  'from-purple-800 to-violet-900',
];

function formatYears(birthDate: string, deathDate: string | null): string {
  const birth = birthDate.split('-')[0];
  const death = deathDate ? deathDate.split('-')[0] : 'б.з.';
  return `${birth} – ${death}`;
}

export default function WriterCard({ writer, index }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const grad = GRADIENT_FALLBACKS[index % GRADIENT_FALLBACKS.length];

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${location.origin}/writers/${writer.slug}`).catch(() => {});
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited((v) => !v);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group relative flex flex-col rounded-3xl overflow-hidden border border-white/8 bg-slate-900/60 backdrop-blur-sm shadow-xl hover:shadow-[0_16px_48px_rgba(139,92,246,0.22)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
    >
      {/* ── Portrait ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-800">
        {/* Skeleton */}
        {!imgLoaded && !imgError && writer.photo && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-700 to-slate-800" />
        )}

        {/* Photo */}
        {writer.photo && !imgError ? (
          <img
            src={writer.photo}
            alt={writer.fullName}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
            <span className="text-7xl font-serif text-white/60 drop-shadow-lg select-none">
              {writer.fullName.charAt(0)}
            </span>
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

        {/* Top-right actions (always visible) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={toggleFavorite}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all ${
              favorited
                ? 'bg-amber-500 border-amber-400 text-white'
                : 'bg-black/40 border-white/20 text-white/70 hover:bg-amber-500/20 hover:text-amber-400'
            }`}
          >
            <Star size={14} fill={favorited ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={copyLink}
            className="w-8 h-8 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-all"
          >
            <Share2 size={14} />
          </button>
        </div>

        {/* Popular badge */}
        {writer.featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-violet-600/80 border border-violet-400/40 backdrop-blur-sm text-white text-xs font-semibold">
            ⭐ Таңдаулы
          </div>
        )}

        {/* Profession badge — bottom-left of photo area */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
          {writer.profession.slice(0, 2).map((p) => (
            <span key={p} className="px-2.5 py-0.5 rounded-full bg-black/50 border border-white/15 text-white/80 text-xs backdrop-blur-sm">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* ── Info ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Name + years */}
        <h3 className="font-serif text-white text-lg font-semibold leading-snug mb-1 group-hover:text-violet-300 transition-colors">
          {writer.fullName}
        </h3>
        <p className="text-violet-400 text-sm font-medium mb-2">{formatYears(writer.birthDate, writer.deathDate)}</p>

        {/* Birthplace */}
        <div className="flex items-center gap-1.5 text-white/40 text-xs mb-3">
          <MapPin size={12} />
          <span className="line-clamp-1">{writer.birthPlace}</span>
        </div>

        {/* Genre tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {writer.genre.slice(0, 2).map((g) => (
            <span key={g} className="px-2.5 py-0.5 rounded-full bg-violet-500/12 border border-violet-500/25 text-violet-300 text-xs">
              {g}
            </span>
          ))}
          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/45 text-xs">
            {writer.era}
          </span>
        </div>

        {/* Description */}
        <p className="text-white/55 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">{writer.description}</p>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-1.5 mb-4 py-3 border-t border-white/8">
          {[
            { icon: <BookOpen size={13} />, val: writer.worksCount, label: 'шығарма' },
            { icon: <FileText size={13} />, val: writer.pdf?.length ?? 0, label: 'PDF' },
            { icon: <Headphones size={13} />, val: writer.audio?.length ?? 0, label: 'аудио' },
            { icon: <Quote size={13} />, val: writer.quotesCount, label: 'нақыл' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="text-white/30">{s.icon}</span>
              <span className="text-white/80 text-xs font-semibold">{s.val}</span>
              <span className="text-white/30 text-[10px]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* View count */}
        <div className="flex items-center gap-1.5 text-white/25 text-xs mb-4">
          <Eye size={12} />
          <span>{writer.viewCount.toLocaleString('kk-KZ')} рет қаралды</span>
        </div>

        {/* CTA button */}
        <Link
          href={`/writers/${writer.slug}`}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-semibold transition-all shadow-[0_4px_16px_rgba(139,92,246,0.3)]"
        >
          Толық профиль
          <ChevronRight size={15} />
        </Link>
      </div>

      {/* ── Hover Quick Actions overlay ───────────────────────────────────────── */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none group-hover:pointer-events-auto"
        >
          {/* transparent — clicks pass to child links */}
        </motion.div>
      </AnimatePresence>

      {/* Quick action bar — slides up on hover */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 bg-slate-900/95 border-t border-white/10 backdrop-blur-lg"
        style={{ pointerEvents: 'none' }}
        onHoverStart={(e) => e.stopPropagation()}
      >
        <div className="flex" style={{ pointerEvents: 'auto' }}>
          {[
            { label: '📖 Оқу',    href: `/writers/${writer.slug}?tab=biography` },
            { label: '📚 Шығармалар', href: `/writers/${writer.slug}?tab=works` },
            { label: '📄 PDF',    href: `/writers/${writer.slug}?tab=pdf` },
            { label: '🎧 Аудио',  href: `/writers/${writer.slug}?tab=audio` },
            { label: '✍️ Нақыл', href: `/writers/${writer.slug}?tab=quotes` },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex-1 text-center py-3 text-white/60 hover:text-white hover:bg-white/8 text-xs font-medium transition-all border-r border-white/8 last:border-0"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
