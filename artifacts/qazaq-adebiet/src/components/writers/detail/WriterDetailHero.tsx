import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen, Eye, MapPin, Award } from 'lucide-react';
import { Link } from 'wouter';
import type { Writer } from '@/types/writer';

export default function WriterDetailHero({ writer }: { writer: Writer }) {
  return (
    <div className="relative w-full overflow-hidden border-b border-white/10 bg-black/20">
      {/* Decorative background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-16 relative z-10">
        <Link 
          href="/writers" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Барлық жазушылар</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Portrait Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-start"
          >
            <div className="relative w-[240px] h-[240px] lg:w-[280px] lg:h-[280px] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.3)] border-2 border-white/10 bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
              {writer.photo ? (
                <img src={writer.photo} alt={writer.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl font-serif text-white/90 drop-shadow-lg">
                  {writer.fullName.charAt(0)}
                </span>
              )}
            </div>
          </motion.div>

          {/* Info Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {writer.profession.map((prof) => (
                <span key={prof} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/80">
                  {prof}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-bold mb-2">
              {writer.fullName}
            </h1>
            
            {writer.nickname && (
              <p className="text-white/60 text-xl italic font-serif mb-6">
                «{writer.nickname}»
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-4 py-1.5 bg-primary/20 border border-primary/50 text-primary rounded-full text-sm font-medium">
                {writer.era}
              </span>
              <span className="px-4 py-1.5 bg-accent/20 border border-accent/50 text-accent rounded-full text-sm font-medium">
                {writer.literaryMovement}
              </span>
            </div>

            {writer.genre.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {writer.genre.map((g) => (
                  <span key={g} className="px-3 py-1 bg-white/5 border border-accent/30 rounded-full text-xs text-accent/90">
                    {g}
                  </span>
                ))}
              </div>
            )}

            {writer.awards && writer.awards.length > 0 && (
              <div className="flex items-start gap-3 mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
                <Award className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-2">
                  {writer.awards.map((award, i) => (
                    <span key={i} className="text-sm text-white/80 flex items-center">
                      {award}
                      {i < writer.awards.length - 1 && <span className="mx-2 text-white/30">•</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 glass-panel p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Туылды</p>
                  <p className="text-sm text-white font-medium">{writer.birthDate}</p>
                  <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {writer.birthPlace}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 glass-panel p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Қайтыс болды</p>
                  <p className="text-sm text-white font-medium">{writer.deathDate ?? 'Тіршілікте'}</p>
                  {writer.deathPlace && (
                    <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {writer.deathPlace}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 glass-panel p-4 rounded-xl">
                <BookOpen className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Шығармашылығы</p>
                  <p className="text-sm text-white font-medium">{writer.worksCount} шығарма, {writer.quotesCount} нақыл</p>
                </div>
              </div>

              <div className="flex items-center gap-3 glass-panel p-4 rounded-xl">
                <Eye className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Қаралым</p>
                  <p className="text-sm text-white font-medium">{writer.viewCount.toLocaleString('kk-KZ')} рет қаралды</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-white/80 leading-relaxed">
              {writer.description}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}