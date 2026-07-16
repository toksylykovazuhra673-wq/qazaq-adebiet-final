import React from 'react';
import { motion } from 'framer-motion';
import type { Writer } from '@/types/writer';

export default function WriterFactsTab({ writer }: { writer: Writer }) {
  if (!writer.interestingFacts || writer.interestingFacts.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Қызықты деректер тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {writer.interestingFacts.map((fact, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="glass-card p-6 rounded-2xl border border-white/10 flex gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-primary font-serif text-xl font-bold">{idx + 1}</span>
          </div>
          <p className="text-white/80 text-lg leading-relaxed pt-1">
            {fact}
          </p>
        </motion.div>
      ))}
    </div>
  );
}