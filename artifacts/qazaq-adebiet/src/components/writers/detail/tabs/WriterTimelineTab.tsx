import React from 'react';
import { motion } from 'framer-motion';
import type { Writer } from '@/types/writer';

export default function WriterTimelineTab({ writer }: { writer: Writer }) {
  if (!writer.timeline || writer.timeline.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Өмір жолы мәліметтері әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto py-8">
      {/* Center Line */}
      <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-primary/30 md:-translate-x-1/2" />

      <div className="space-y-12">
        {writer.timeline.map((event, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`relative flex items-center ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-black -translate-x-1/2 z-10" />

              <div className="w-10 md:w-1/2 shrink-0" />
              
              <div className={`w-full md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 text-left'} pl-12 md:pl-12`}>
                <div className="glass-card p-6 rounded-2xl inline-block w-full">
                  <div className="text-accent font-bold text-xl mb-2">{event.year}</div>
                  <h4 className="text-white font-serif text-xl mb-2">{event.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed">{event.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}