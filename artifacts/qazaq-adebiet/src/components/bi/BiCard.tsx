import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Eye, MessageSquare, BookOpen, ArrowRight, Gavel } from 'lucide-react';
import type { BiSheshen } from '@/types/bi';

interface Props {
  bi: BiSheshen;
  index?: number;
}

export default function BiCard({ bi, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-teal-500/40 transition-all duration-300 flex flex-col bg-[#111c35] hover:bg-[#132038] shadow-xl shadow-black/30"
    >
      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500/0 via-teal-500/60 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Portrait area */}
      <div className="relative p-6 pb-4 flex flex-col items-center">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-teal-500/40 transition-colors duration-300 bg-gradient-to-br from-teal-600/30 to-amber-700/20 flex items-center justify-center shadow-lg">
          {bi.photo ? (
            <img src={bi.photo} alt={bi.fullName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-serif text-white/90 select-none">
              {bi.fullName.charAt(0)}
            </span>
          )}
          {bi.popular && (
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
              <span className="text-[10px]">⭐</span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-500/15 border border-teal-500/25 text-teal-400">
            {bi.era}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400/80">
            {bi.tribe.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-4 flex-1 flex flex-col">
        <h3 className="text-white font-serif text-xl font-semibold text-center mb-0.5 group-hover:text-teal-200 transition-colors">
          {bi.fullName}
        </h3>
        <p className="text-white/45 text-xs text-center mb-1 italic">«{bi.nickname}»</p>
        <p className="text-white/50 text-xs text-center mb-3">
          {bi.birthDate}
          {bi.deathDate ? ` — ${bi.deathDate}` : ''}
        </p>

        {/* Tribe & Region */}
        <div className="flex justify-center gap-2 flex-wrap mb-3">
          {bi.profession.slice(0, 2).map((p) => (
            <span
              key={p}
              className="px-2 py-0.5 rounded-full text-[11px] bg-white/5 border border-white/8 text-white/50"
            >
              {p}
            </span>
          ))}
        </div>

        <p className="text-white/55 text-sm leading-relaxed text-center line-clamp-2 mb-4 flex-1">
          {bi.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 py-3 border-y border-white/6 mb-4">
          <div className="flex items-center gap-1.5 text-white/50">
            <BookOpen className="w-3.5 h-3.5 text-teal-400/70" />
            <span className="text-xs">{bi.oratoryCount} сөз</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5 text-white/50">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400/70" />
            <span className="text-xs">{bi.aphorismCount} нақыл</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5 text-white/50">
            <Eye className="w-3.5 h-3.5 text-white/40" />
            <span className="text-xs">{bi.viewCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/bi-sheshender/${bi.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/20 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Толығырақ
          </Link>
          <Link
            href={`/bi-sheshender/${bi.slug}?tab=oratory`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white/60 border border-white/8 transition-colors"
            title="Шешендік сөздері"
          >
            <Gavel className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/bi-sheshender/${bi.slug}?tab=aphorisms`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white/60 border border-white/8 transition-colors"
            title="Нақыл сөздері"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
