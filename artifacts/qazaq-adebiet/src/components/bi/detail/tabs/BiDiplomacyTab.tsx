import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, Star } from 'lucide-react';
import type { BiSheshen } from '@/types/bi';

export default function BiDiplomacyTab({ bi }: { bi: BiSheshen }) {
  if (!bi.diplomaticService || bi.diplomaticService.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <div className="flex flex-col items-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-teal-400/50" />
          </div>
          <p className="text-white/60 text-lg">Елшілік қызмет деректері жақын арада қосылады.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {bi.diplomaticService.map((d, i) => (
        <motion.div
          key={d.id}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-teal-500/20 transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-teal-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-white font-semibold font-serif text-lg">{d.title}</h3>
                <span className="text-teal-400 text-xs font-medium bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full shrink-0">
                  {d.year}
                </span>
              </div>
              <p className="text-white/65 text-sm leading-relaxed mb-4">{d.description}</p>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
                <Star className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-xs">Нәтиже:</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-emerald-400/90 text-sm font-medium">{d.result}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
