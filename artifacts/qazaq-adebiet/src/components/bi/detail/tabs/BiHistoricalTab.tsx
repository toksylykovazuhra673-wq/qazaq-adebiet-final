import React from 'react';
import { motion } from 'framer-motion';
import type { BiSheshen } from '@/types/bi';

export default function BiHistoricalTab({ bi }: { bi: BiSheshen }) {
  if (!bi.historicalEvents || bi.historicalEvents.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Тарихи оқиғалар жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bi.historicalEvents.map((e, i) => (
        <motion.div
          key={e.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="glass-panel rounded-2xl p-5 border border-white/5 flex gap-4 items-start"
        >
          <span className="px-3 py-1.5 rounded-xl bg-teal-500/15 border border-teal-500/25 text-teal-400 text-sm font-bold font-serif shrink-0">
            {e.year}
          </span>
          <div>
            <h3 className="text-white font-semibold mb-1 font-serif">{e.title}</h3>
            <p className="text-white/65 text-sm leading-relaxed">{e.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
