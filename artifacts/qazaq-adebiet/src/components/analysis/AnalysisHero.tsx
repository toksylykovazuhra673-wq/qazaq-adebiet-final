import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, BarChart2, Globe, Star, Eye, Download } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

function GradientCover({ colors, title, author }: { colors: string[]; title: string; author: string }) {
  const [c1 = '#6d28d9', c2 = '#1e1b4b', c3 = '#0f172a'] = colors;
  return (
    <div
      className="w-full h-full rounded-2xl flex flex-col items-center justify-center p-6 text-center select-none"
      style={{ background: `linear-gradient(145deg, ${c1}, ${c2}, ${c3})` }}
    >
      <div className="w-12 h-1 rounded-full bg-white/30 mb-6" />
      <p className="text-white font-serif text-lg font-bold leading-tight mb-3 line-clamp-4">
        {title}
      </p>
      <div className="w-8 h-px bg-white/30 my-3" />
      <p className="text-white/60 text-xs tracking-wide uppercase">{author}</p>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-violet-400 mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white/40 text-xs mb-0.5">{label}</p>
        <p className="text-white text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

export default function AnalysisHero({ analysis }: { analysis: Analysis }) {
  const stars = Math.round(analysis.rating ?? 0);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 print:pt-0">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:sticky md:top-20 self-start"
        >
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/40 border border-white/10">
            <GradientCover
              colors={analysis.coverGradient ?? ['#6d28d9', '#1e1b4b', '#0f172a']}
              title={analysis.title}
              author={analysis.author}
            />
          </div>
          {/* Rating */}
          {analysis.rating != null && (
            <div className="flex items-center justify-center gap-1 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < stars ? 'text-amber-400' : 'text-white/20'}
                  fill={i < stars ? 'currentColor' : 'none'}
                />
              ))}
              <span className="text-white/50 text-xs ml-1">{analysis.rating.toFixed(1)}</span>
            </div>
          )}
        </motion.div>

        {/* Metadata panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-1 leading-tight">
            {analysis.title}
          </h1>
          <p className="text-violet-300 text-lg mb-6">{analysis.author}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[analysis.genre, analysis.literaryMovement, analysis.period].filter(Boolean).map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 bg-white/[0.03] rounded-2xl border border-white/8 px-5 py-2">
            <MetaRow icon={<BookOpen size={14} />} label="Автор" value={analysis.author} />
            <MetaRow icon={<BookOpen size={14} />} label="Жанр" value={analysis.genre} />
            <MetaRow icon={<Clock size={14} />} label="Жазылған жылы" value={analysis.period} />
            <MetaRow icon={<BarChart2 size={14} />} label="Әдеби бағыт" value={analysis.direction} />
            <MetaRow icon={<BarChart2 size={14} />} label="Әдеби ағым" value={analysis.literaryMovement} />
            <MetaRow icon={<BookOpen size={14} />} label="Кезең" value={analysis.type} />
            {analysis.pageCount && (
              <MetaRow icon={<BookOpen size={14} />} label="Бет саны" value={`${analysis.pageCount} бет`} />
            )}
            {analysis.readingTime && (
              <MetaRow icon={<Clock size={14} />} label="Оқу уақыты" value={analysis.readingTime} />
            )}
            {analysis.readingLevel && (
              <MetaRow icon={<BarChart2 size={14} />} label="Оқу деңгейі" value={analysis.readingLevel} />
            )}
            {analysis.language && (
              <MetaRow icon={<Globe size={14} />} label="Тілі" value={analysis.language} />
            )}
            {analysis.viewCount != null && (
              <MetaRow icon={<Eye size={14} />} label="Қаралым" value={`${analysis.viewCount.toLocaleString()} рет`} />
            )}
            {analysis.downloadCount != null && (
              <MetaRow icon={<Download size={14} />} label="Жүктеу" value={`${analysis.downloadCount.toLocaleString()} рет`} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
