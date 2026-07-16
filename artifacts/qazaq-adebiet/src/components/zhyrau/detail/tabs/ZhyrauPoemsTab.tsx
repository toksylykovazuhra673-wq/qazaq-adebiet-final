import React from 'react';
import { motion } from 'framer-motion';
import type { Zhyrau } from '@/types/zhyrau';

export default function ZhyrauPoemsTab({ zhyrau }: { zhyrau: Zhyrau }) {
  if (!zhyrau.poems || zhyrau.poems.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Жырлар жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {zhyrau.poems.map((poem, i) => (
        <motion.div
          key={poem.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="glass-card p-5 rounded-xl"
        >
          <h3 className="font-serif text-white font-semibold text-lg mb-1">{poem.title}</h3>
          <p className="text-accent text-sm mb-3">{poem.period}</p>
          <p className="text-white/70 text-sm leading-relaxed">{poem.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
