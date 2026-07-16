import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import type { Poet } from '@/types/poet';

export default function FactsTab({ poet }: { poet: Poet }) {
  if (!poet.interestingFacts || poet.interestingFacts.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <Lightbulb className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-2xl font-serif text-white mb-3">Қызықты деректер</h3>
        <p className="text-white/60">Бұл ақын туралы деректер қосылмаған.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Lightbulb className="w-6 h-6 text-accent" />
        <h3 className="text-2xl font-serif text-white">Қызықты деректер</h3>
      </div>

      {poet.interestingFacts.map((fact, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
          className="glass-card rounded-2xl p-6 flex gap-6 items-start"
        >
          <div className="text-4xl font-serif font-bold text-primary/30 leading-none mt-1">
            {(idx + 1).toString().padStart(2, '0')}
          </div>
          <p className="text-white/80 text-lg leading-relaxed pt-1">
            {fact}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
