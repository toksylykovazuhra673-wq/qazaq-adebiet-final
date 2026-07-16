import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ScrollText, Quote, Eye } from 'lucide-react';
import type { Zhyrau } from '@/types/zhyrau';

interface ZhyrauCardProps {
  zhyrau: Zhyrau;
  index: number;
}

export default function ZhyrauCard({ zhyrau, index }: ZhyrauCardProps) {
  const viewCountFormatted = zhyrau.viewCount > 999
    ? `${(zhyrau.viewCount / 1000).toFixed(1)}k`
    : String(zhyrau.viewCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="glass-card rounded-2xl p-6 flex flex-col h-full group hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-xl group-hover:border-accent/50 transition-colors">
            {zhyrau.photo ? (
              <img src={zhyrau.photo} alt={zhyrau.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-600/40 to-violet-700/30 flex items-center justify-center text-3xl font-serif text-white/90">
                {zhyrau.fullName.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-3">
          <span className="px-3 py-1 bg-white/5 border border-accent/30 rounded-full text-xs text-accent/90">
            {zhyrau.era}
          </span>
          <span className="px-3 py-1 bg-white/5 border border-primary/30 rounded-full text-xs text-primary/90">
            {zhyrau.historicalPeriod}
          </span>
        </div>

        <h3 className="font-serif text-white text-xl font-semibold mb-1 group-hover:text-accent transition-colors line-clamp-1">
          {zhyrau.fullName}
        </h3>

        <p className="text-white/50 text-sm mb-3">
          {zhyrau.birthDate} — {zhyrau.deathDate ?? 'Белгісіз'}
        </p>

        <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">
          {zhyrau.description}
        </p>
      </div>

      <div className="border-t border-white/10 pt-4 mt-auto mb-5 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-1">
          <ScrollText className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/70">{zhyrau.tolgauCount} толғау</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-l border-r border-white/10">
          <Quote className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/70">{zhyrau.quotesCount} нақыл</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Eye className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/70">{viewCountFormatted}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full">
        <Link
          href={`/zhyrau/${zhyrau.slug}`}
          className="flex-1 bg-primary hover:bg-primary/90 text-white py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium transition-colors text-center shadow-[0_0_15px_rgba(139,92,246,0.3)] whitespace-nowrap"
        >
          Толығырақ
        </Link>
        <Link
          href={`/zhyrau/${zhyrau.slug}?tab=tolgau`}
          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium transition-colors text-center whitespace-nowrap"
        >
          Толғаулары
        </Link>
        <Link
          href={`/zhyrau/${zhyrau.slug}?tab=quotes`}
          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium transition-colors text-center whitespace-nowrap"
        >
          Нақылдары
        </Link>
      </div>
    </motion.div>
  );
}
