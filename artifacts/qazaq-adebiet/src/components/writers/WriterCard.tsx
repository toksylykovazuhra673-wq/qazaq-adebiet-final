import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { BookOpen, Quote, Eye } from 'lucide-react';
import type { Writer } from '@/types/writer';

interface WriterCardProps {
  writer: Writer;
  index: number;
}

export default function WriterCard({ writer, index }: WriterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="glass-card rounded-2xl p-6 flex flex-col h-full group"
    >
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-xl group-hover:border-primary/50 transition-colors">
            {writer.photo ? (
              <img src={writer.photo} alt={writer.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-3xl font-serif text-white/90">
                {writer.fullName.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {writer.genre.slice(0, 2).map(g => (
            <span key={g} className="px-3 py-1 bg-white/5 border border-accent/30 rounded-full text-xs text-accent/90">
              {g}
            </span>
          ))}
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-primary mb-3">
            {writer.literaryMovement}
          </span>
        </div>

        <h3 className="font-serif text-white text-xl font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {writer.fullName}
        </h3>
        
        <p className="text-accent text-sm font-medium mb-3">
          {writer.era}
        </p>

        <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">
          {writer.description}
        </p>
      </div>

      <div className="border-t border-white/10 pt-4 mt-auto mb-5 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-1">
          <BookOpen className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/70">{writer.worksCount} шығарма</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-l border-r border-white/10">
          <Quote className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/70">{writer.quotesCount} нақыл</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Eye className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/70">
            {writer.viewCount > 999 ? `${(writer.viewCount / 1000).toFixed(1)}k` : writer.viewCount}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full">
        <Link 
          href={`/writers/${writer.slug}`}
          className="flex-1 bg-primary hover:bg-primary/90 text-white py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium transition-colors text-center shadow-[0_0_15px_rgba(139,92,246,0.3)] whitespace-nowrap"
        >
          Толығырақ
        </Link>
        <Link 
          href={`/writers/${writer.slug}?tab=works`}
          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium transition-colors text-center whitespace-nowrap"
        >
          Шығармалары
        </Link>
        <Link 
          href={`/writers/${writer.slug}?tab=quotes`}
          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium transition-colors text-center whitespace-nowrap"
        >
          Нақылдары
        </Link>
      </div>
    </motion.div>
  );
}