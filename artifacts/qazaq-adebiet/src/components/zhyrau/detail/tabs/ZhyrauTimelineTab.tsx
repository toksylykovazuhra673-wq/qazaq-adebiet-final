import React from 'react';
import { motion } from 'framer-motion';
import type { Zhyrau } from '@/types/zhyrau';

export default function ZhyrauTimelineTab({ zhyrau }: { zhyrau: Zhyrau }) {
  if (!zhyrau.timeline || zhyrau.timeline.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Өмір жолы деректері қосылуда.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/60 via-primary/40 to-transparent -translate-x-1/2 hidden md:block" />
      <div className="flex flex-col gap-8">
        {zhyrau.timeline.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
          >
            <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
              <div className="glass-card p-5 rounded-xl inline-block w-full">
                <h3 className="text-white font-semibold text-lg mb-1">{event.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{event.description}</p>
              </div>
            </div>

            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-primary/20 border-2 border-accent/50 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] z-10">
              <span className="text-accent font-bold text-xs text-center leading-tight px-1">{event.year}</span>
            </div>

            <div className="flex-1 hidden md:block" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
