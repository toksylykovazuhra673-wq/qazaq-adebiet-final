import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import type { BiSheshen } from '@/types/bi';

export default function BiFactsTab({ bi }: { bi: BiSheshen }) {
  if (!bi.interestingFacts || bi.interestingFacts.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Қызықты деректер жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bi.interestingFacts.map((fact, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="glass-card rounded-xl p-5 flex gap-4 border border-white/8 hover:border-teal-500/25 transition-colors"
        >
          <div className="shrink-0 w-10 h-10 rounded-full bg-teal-500/15 border border-teal-500/25 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <span className="text-teal-400/60 text-xs font-mono mb-1 block">{String(i + 1).padStart(2, '0')}</span>
            <p className="text-white/80 text-sm leading-relaxed">{fact}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
