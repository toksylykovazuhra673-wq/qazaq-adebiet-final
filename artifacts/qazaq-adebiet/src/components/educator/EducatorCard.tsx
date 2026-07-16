import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { BookOpen, MessageSquare, ArrowRight, GraduationCap } from 'lucide-react';
import type { Educator } from '@/types/educator';

interface Props {
  educator: Educator;
  index?: number;
}

const CENTURY_COLOR: Record<string, string> = {
  'XIX': 'bg-amber-500/15 border-amber-500/25 text-amber-400',
  'XX':  'bg-violet-500/15 border-violet-500/25 text-violet-400',
  'XXI': 'bg-teal-500/15 border-teal-500/25 text-teal-400',
};

export default function EducatorCard({ educator: e, index = 0 }: Props) {
  const centuryClass = CENTURY_COLOR[e.century] ?? 'bg-white/8 border-white/15 text-white/60';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group relative glass-card rounded-2xl overflow-hidden border border-white/8 hover:border-violet-500/30 transition-all duration-300 flex flex-col"
    >
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Portrait area */}
      <div className="relative p-6 pb-4 flex flex-col items-center">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-violet-500/40 transition-colors duration-300 bg-gradient-to-br from-violet-600/30 to-teal-700/20 flex items-center justify-center shadow-lg">
          {e.photo ? (
            <img src={e.photo} alt={e.fullName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-serif text-white/90 select-none">
              {e.fullName.charAt(0)}
            </span>
          )}
          {e.popular && (
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
              <span className="text-[10px]">⭐</span>
            </div>
          )}
        </div>

        {/* Century + primary profession badges */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${centuryClass}`}>
            {e.century} ғасыр
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-500/10 border border-teal-500/20 text-teal-400/80">
            {e.profession[0]}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-4 flex-1 flex flex-col">
        <h3 className="text-white font-serif text-xl font-semibold text-center mb-0.5 group-hover:text-violet-200 transition-colors">
          {e.fullName}
        </h3>
        <p className="text-white/50 text-xs text-center mb-3">
          {e.birthDate}
          {e.deathDate ? ` — ${e.deathDate}` : ''}
        </p>

        {/* Professions */}
        <div className="flex justify-center gap-1.5 flex-wrap mb-3">
          {e.profession.slice(1, 3).map((p) => (
            <span
              key={p}
              className="px-2 py-0.5 rounded-full text-[11px] bg-white/5 border border-white/8 text-white/50"
            >
              {p}
            </span>
          ))}
        </div>

        <p className="text-white/55 text-sm leading-relaxed text-center line-clamp-2 mb-4 flex-1">
          {e.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 py-3 border-y border-white/6 mb-4">
          <div className="flex items-center gap-1.5 text-white/50">
            <BookOpen className="w-3.5 h-3.5 text-violet-400/70" />
            <span className="text-xs">{e.worksCount} еңбек</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5 text-white/50">
            <MessageSquare className="w-3.5 h-3.5 text-teal-400/70" />
            <span className="text-xs">{e.quotesCount} дəйексөз</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/educators/${e.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/20 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Толығырақ
          </Link>
          <Link
            href={`/educators/${e.slug}?tab=works`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white/60 border border-white/8 transition-colors"
            title="Еңбектері"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/educators/${e.slug}?tab=quotes`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white/60 border border-white/8 transition-colors"
            title="Дəйексөздері"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
