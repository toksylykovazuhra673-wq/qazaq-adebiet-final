import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen, MapPin, GraduationCap, FlaskConical } from 'lucide-react';
import { Link } from 'wouter';
import type { Educator } from '@/types/educator';

export default function EducatorDetailHero({ educator: e }: { educator: Educator }) {
  return (
    <div className="relative w-full overflow-hidden border-b border-white/10 bg-black/20">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-violet-600/12 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-1/3 h-1/2 bg-teal-600/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-16 relative z-10">
        {/* Back link */}
        <Link
          href="/educators"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Барлық ағартушылар</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-start"
          >
            <div className="relative w-[240px] h-[240px] lg:w-[280px] lg:h-[280px] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.15)] border-2 border-white/10 bg-gradient-to-br from-violet-600/25 to-teal-700/15 flex items-center justify-center">
              {e.photo ? (
                <img src={e.photo} alt={e.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl font-serif text-white/90 drop-shadow-lg">
                  {e.fullName.charAt(0)}
                </span>
              )}
              {e.popular && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500/90 rounded-full text-xs font-medium text-white shadow">
                  ⭐ Танымал
                </div>
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
              {e.profession.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/80"
                >
                  {p}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-bold mb-2">
              {e.fullName}
            </h1>

            {/* Fields */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-violet-400" />
                <span className="text-violet-300 text-sm font-medium">{e.scientificField}</span>
              </div>
              {e.literaryField && (
                <>
                  <span className="text-white/20">·</span>
                  <div className="flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-teal-400" />
                    <span className="text-teal-300/80 text-sm">{e.literaryField}</span>
                  </div>
                </>
              )}
            </div>

            {/* Century badge */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 bg-violet-500/20 border border-violet-500/40 text-violet-400 rounded-full text-sm font-medium">
                {e.century} ғасыр
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 glass-panel p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Туылды</p>
                  <p className="text-sm text-white font-medium">{e.birthDate}</p>
                  <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" /> {e.birthPlace}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 glass-panel p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Дүние салды</p>
                  <p className="text-sm text-white font-medium">{e.deathDate ?? 'Белгісіз'}</p>
                  {e.deathPlace && (
                    <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" /> {e.deathPlace}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 glass-panel p-4 rounded-xl">
                <BookOpen className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Ғылыми мұрасы</p>
                  <p className="text-sm text-white font-medium">
                    {e.worksCount} еңбек · {e.quotesCount} дəйексөз
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 glass-panel p-4 rounded-xl">
                <GraduationCap className="w-5 h-5 text-violet-400 shrink-0" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Ғылым саласы</p>
                  <p className="text-sm text-white font-medium">{e.scientificField}</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-white/80 leading-relaxed">{e.description}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
