import React from 'react';
import { motion } from 'framer-motion';
import type { Zhyrau } from '@/types/zhyrau';

export default function ZhyrauFactsTab({ zhyrau }: { zhyrau: Zhyrau }) {
  if (!zhyrau.interestingFacts || zhyrau.interestingFacts.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Қызықты деректер жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {zhyrau.interestingFacts.map((fact, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          className="glass-card p-6 rounded-xl flex gap-5"
        >
          <div className="text-5xl font-serif font-bold text-primary/30 leading-none shrink-0 select-none">
            {String(i + 1).padStart(2, '0')}
          </div>
          <p className="text-white/80 text-sm leading-relaxed pt-1">{fact}</p>
        </motion.div>
      ))}
    </div>
  );
}
