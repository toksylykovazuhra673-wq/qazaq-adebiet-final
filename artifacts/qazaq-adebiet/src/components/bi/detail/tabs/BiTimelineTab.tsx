import React from 'react';
import { motion } from 'framer-motion';
import type { BiSheshen } from '@/types/bi';

export default function BiTimelineTab({ bi }: { bi: BiSheshen }) {
  if (!bi.timeline || bi.timeline.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Өмір жолы деректері жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-4">
      {/* Vertical line */}
      <div className="absolute left-[28px] top-4 bottom-4 w-px bg-gradient-to-b from-teal-500/60 via-teal-500/20 to-transparent" />

      <div className="space-y-8">
        {bi.timeline.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="relative flex gap-6 items-start"
          >
            {/* Dot */}
            <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-[#0f0a22] border-2 border-teal-500/60 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            </div>

            {/* Content */}
            <div className="glass-panel rounded-xl p-5 flex-1 border border-white/5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-white font-semibold font-serif">{event.title}</h3>
                <span className="text-teal-400 text-sm font-medium shrink-0 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/25">
                  {event.year}
                </span>
              </div>
              <p className="text-white/65 text-sm leading-relaxed">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
