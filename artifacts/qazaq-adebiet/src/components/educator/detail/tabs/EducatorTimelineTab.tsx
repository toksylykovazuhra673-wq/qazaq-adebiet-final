import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import type { Educator } from '@/types/educator';

export default function EducatorTimelineTab({ educator: e }: { educator: Educator }) {
  if (!e.timeline?.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <Calendar className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40">Өмір жолы туралы мəлімет жоқ</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* vertical spine */}
      <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-500/60 via-violet-500/20 to-transparent" />

      <div className="space-y-6 pl-12 relative">
        {e.timeline.map((ev, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative"
          >
            {/* dot */}
            <div className="absolute -left-[calc(3rem-6px)] top-1 w-4 h-4 rounded-full bg-violet-500/80 border-2 border-[#0a0618] shadow-lg shadow-violet-500/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            <div className="glass-panel rounded-xl p-5 border border-white/6 hover:border-violet-500/20 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-white font-semibold font-serif text-lg leading-snug">{ev.title}</h3>
                <span className="shrink-0 px-3 py-1 bg-violet-500/20 border border-violet-500/40 text-violet-400 rounded-full text-sm font-bold tabular-nums">
                  {ev.year}
                </span>
              </div>
              <p className="text-white/65 text-sm leading-relaxed">{ev.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
