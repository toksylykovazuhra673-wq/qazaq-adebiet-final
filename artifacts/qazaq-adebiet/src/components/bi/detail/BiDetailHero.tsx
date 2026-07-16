import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ScrollText, Eye, MapPin, Gavel, Users } from 'lucide-react';
import { Link } from 'wouter';
import type { BiSheshen } from '@/types/bi';

export default function BiDetailHero({ bi }: { bi: BiSheshen }) {
  return (
    <div className="relative w-full overflow-hidden border-b border-white/10 bg-black/20">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-teal-600/12 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-1/3 h-1/2 bg-amber-600/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-16 relative z-10">
        {/* Back link */}
        <Link
          href="/bi-sheshender"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Барлық би-шешендер</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-start"
          >
            <div className="relative w-[240px] h-[240px] lg:w-[280px] lg:h-[280px] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(20,184,166,0.15)] border-2 border-white/10 bg-gradient-to-br from-teal-600/25 to-amber-700/15 flex items-center justify-center">
              {bi.photo ? (
                <img src={bi.photo} alt={bi.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl font-serif text-white/90 drop-shadow-lg">
                  {bi.fullName.charAt(0)}
                </span>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            {/* Profession tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {bi.profession.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/80"
                >
                  {p}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-bold mb-2">
              {bi.fullName}
            </h1>

            {bi.nickname && (
              <p className="text-white/60 text-xl italic font-serif mb-4">«{bi.nickname}»</p>
            )}

            {/* Tribe & Region */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-400" />
                <span className="text-teal-300 text-sm font-medium">Руы: {bi.tribe}</span>
              </div>
              <span className="text-white/20">·</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300/80 text-sm">{bi.region}</span>
              </div>
            </div>

            {/* Era badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 bg-teal-500/20 border border-teal-500/40 text-teal-400 rounded-full text-sm font-medium">
                {bi.era}
              </span>
              <span className="px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400/90 rounded-full text-sm font-medium">
                {bi.historicalPeriod}
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 glass-panel p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-teal-400 mt-0.5" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Туылды</p>
                  <p className="text-sm text-white font-medium">{bi.birthDate}</p>
                  <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {bi.birthPlace}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 glass-panel p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Дүние салды</p>
                  <p className="text-sm text-white font-medium">{bi.deathDate ?? 'Белгісіз'}</p>
                  {bi.deathPlace && (
                    <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {bi.deathPlace}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 glass-panel p-4 rounded-xl">
                <Gavel className="w-5 h-5 text-teal-400" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Шығармашылығы</p>
                  <p className="text-sm text-white font-medium">
                    {bi.oratoryCount} шешендік сөз, {bi.aphorismCount} нақыл
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 glass-panel p-4 rounded-xl">
                <Eye className="w-5 h-5 text-teal-400/70" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Қаралым</p>
                  <p className="text-sm text-white font-medium">
                    {bi.viewCount.toLocaleString('kk-KZ')} рет қаралды
                  </p>
                </div>
              </div>
            </div>

            <p className="text-lg text-white/80 leading-relaxed">{bi.description}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
