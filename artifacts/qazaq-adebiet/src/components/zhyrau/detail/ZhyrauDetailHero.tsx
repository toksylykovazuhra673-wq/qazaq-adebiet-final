import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ScrollText, Eye, MapPin, Crown } from 'lucide-react';
import { Link } from 'wouter';
import type { Zhyrau } from '@/types/zhyrau';

export default function ZhyrauDetailHero({ zhyrau }: { zhyrau: Zhyrau }) {
  return (
    <div className="relative w-full overflow-hidden border-b border-white/10 bg-black/20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-amber-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-16 relative z-10">
        <Link
          href="/zhyrau"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Барлық жыраулар</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-start"
          >
            <div className="relative w-[240px] h-[240px] lg:w-[280px] lg:h-[280px] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.2)] border-2 border-white/10 bg-gradient-to-br from-amber-600/30 to-violet-700/20 flex items-center justify-center">
              {zhyrau.photo ? (
                <img src={zhyrau.photo} alt={zhyrau.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl font-serif text-white/90 drop-shadow-lg">
                  {zhyrau.fullName.charAt(0)}
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
            <div className="flex flex-wrap gap-2 mb-4">
              {zhyrau.profession.map((p) => (
                <span key={p} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/80">
                  {p}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-bold mb-2">
              {zhyrau.fullName}
            </h1>

            {zhyrau.nickname && (
              <p className="text-white/60 text-xl italic font-serif mb-4">«{zhyrau.nickname}»</p>
            )}

            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-medium">Хан дәуірі: {zhyrau.khanPeriod}</span>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 bg-accent/20 border border-accent/50 text-accent rounded-full text-sm font-medium">
                {zhyrau.era}
              </span>
              <span className="px-4 py-1.5 bg-primary/20 border border-primary/50 text-primary rounded-full text-sm font-medium">
                {zhyrau.historicalPeriod}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 glass-panel p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Туылды</p>
                  <p className="text-sm text-white font-medium">{zhyrau.birthDate}</p>
                  <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {zhyrau.birthPlace}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 glass-panel p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Дүние салды</p>
                  <p className="text-sm text-white font-medium">{zhyrau.deathDate ?? 'Белгісіз'}</p>
                  {zhyrau.deathPlace && (
                    <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {zhyrau.deathPlace}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 glass-panel p-4 rounded-xl">
                <ScrollText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Шығармашылығы</p>
                  <p className="text-sm text-white font-medium">{zhyrau.tolgauCount} толғау, {zhyrau.quotesCount} нақыл</p>
                </div>
              </div>

              <div className="flex items-center gap-3 glass-panel p-4 rounded-xl">
                <Eye className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Қаралым</p>
                  <p className="text-sm text-white font-medium">{zhyrau.viewCount.toLocaleString('kk-KZ')} рет қаралды</p>
                </div>
              </div>
            </div>

            {zhyrau.khanConnection && (
              <div className="flex items-start gap-3 glass-panel p-4 rounded-xl mb-6 border border-accent/20">
                <Crown className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 italic">{zhyrau.khanConnection}</p>
              </div>
            )}

            <p className="text-lg text-white/80 leading-relaxed">{zhyrau.description}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
