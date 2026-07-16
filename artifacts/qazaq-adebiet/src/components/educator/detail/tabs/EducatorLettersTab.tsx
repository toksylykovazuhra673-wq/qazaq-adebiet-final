import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ChevronDown } from 'lucide-react';
import type { Educator } from '@/types/educator';

function LetterCard({ letter }: { letter: Educator['letters'][number] }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl border border-white/8 hover:border-violet-500/20 transition-colors overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 px-6 py-5 text-left"
      >
        <div className="shrink-0 w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mt-0.5">
          <Mail className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="text-white font-semibold">{letter.title}</p>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-violet-400 font-bold text-sm tabular-nums">{letter.year}</span>
              <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-white/40" />
              </motion.div>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-0.5">Кімге: {letter.recipient}</p>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/6 space-y-3">
              <blockquote className="mt-4 border-l-2 border-violet-500/50 pl-4 text-white/75 italic text-base leading-relaxed font-serif">
                {letter.excerpt}
              </blockquote>
              <p className="text-white/50 text-sm leading-relaxed">{letter.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function EducatorLettersTab({ educator: e }: { educator: Educator }) {
  if (!e.letters?.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <Mail className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40">Хаттар туралы мəлімет жоқ</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {e.letters.map((letter) => (
        <LetterCard key={letter.id} letter={letter} />
      ))}
    </div>
  );
}
