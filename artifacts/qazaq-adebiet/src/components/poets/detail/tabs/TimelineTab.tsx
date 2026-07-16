import React from 'react';
import { motion } from 'framer-motion';
import type { Poet } from '@/types/poet';

export default function TimelineTab({ poet }: { poet: Poet }) {
  if (!poet.timeline || poet.timeline.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Өмір жолы туралы мәлімет қосылмаған.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      {/* Vertical Line */}
      <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-primary/30 md:-translate-x-1/2" />

      <div className="space-y-12">
        {poet.timeline.map((event, idx) => {
          const isLeft = idx % 2 === 0;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative flex items-start md:items-center w-full ${
                isLeft ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              {/* Center Dot */}
              <div className="absolute left-[28px] md:left-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-black -translate-x-1/2 mt-1.5 md:mt-0 z-10" />

              {/* Content Panel */}
              <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${
                isLeft ? 'md:pr-12 lg:pr-16 md:text-right' : 'md:pl-12 lg:pl-16 md:text-left'
              }`}>
                <div className="glass-card rounded-2xl p-6 relative group hover:border-primary/50 transition-colors">
                  <div className={`inline-block px-3 py-1 bg-primary/20 text-primary font-bold rounded-lg text-sm mb-3 ${
                    isLeft ? 'md:float-right md:mb-4' : 'md:float-left md:mb-4'
                  } float-left`}>
                    {event.year}
                  </div>
                  <div className="clear-both" />
                  <h4 className="text-xl font-semibold text-white mb-2 font-serif">{event.title}</h4>
                  <p className="text-white/70 leading-relaxed">{event.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
