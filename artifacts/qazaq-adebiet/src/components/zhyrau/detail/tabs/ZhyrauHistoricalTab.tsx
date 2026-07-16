import React from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import type { Zhyrau } from '@/types/zhyrau';

export default function ZhyrauHistoricalTab({ zhyrau }: { zhyrau: Zhyrau }) {
  if (!zhyrau.historicalEvents || zhyrau.historicalEvents.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Тарихи оқиғалар деректері жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <History className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-serif text-white">Тарихи оқиғалар</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zhyrau.historicalEvents.map((ev, i) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-6 rounded-xl relative overflow-hidden"
          >
            <div className="absolute top-3 right-4 text-5xl font-serif text-accent/10 font-bold leading-none select-none">{ev.year}</div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-accent/20 border border-accent/40 text-accent text-sm font-bold rounded-full mb-3">
                {ev.year}
              </span>
              <h3 className="text-white font-semibold text-xl mb-2">{ev.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{ev.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
