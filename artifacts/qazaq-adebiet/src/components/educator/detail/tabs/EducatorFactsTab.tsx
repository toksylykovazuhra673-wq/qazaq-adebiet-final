import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import type { Educator } from '@/types/educator';

export default function EducatorFactsTab({ educator: e }: { educator: Educator }) {
  if (!e.interestingFacts?.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <Lightbulb className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40">Қызықты деректер жоқ</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-white/40 text-sm mb-6">
        {e.fullName} туралы {e.interestingFacts.length} қызықты дерек
      </p>
      {e.interestingFacts.map((fact, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          className="flex gap-4 glass-panel rounded-xl px-5 py-4 border border-white/6 hover:border-amber-500/20 transition-colors"
        >
          <div className="shrink-0 w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <span className="text-amber-400 text-sm font-bold">{i + 1}</span>
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-base leading-relaxed">{fact}</p>
          </div>
          <Lightbulb className="shrink-0 w-4 h-4 text-amber-400/50 mt-1" />
        </motion.div>
      ))}
    </div>
  );
}
