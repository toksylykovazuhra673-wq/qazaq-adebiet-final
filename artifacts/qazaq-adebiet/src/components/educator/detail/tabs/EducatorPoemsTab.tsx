import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown } from 'lucide-react';
import type { Educator } from '@/types/educator';

function PoemCard({ poem }: { poem: Educator['poems'][number] }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl border border-white/8 hover:border-violet-500/20 transition-colors overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold font-serif">{poem.title}</p>
          <p className="text-white/40 text-xs mt-0.5">{poem.year} · {poem.description}</p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-white/40 shrink-0" />
        </motion.div>
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
            <div className="px-6 pb-6 border-t border-white/6">
              {poem.isPublicDomain && poem.fullText ? (
                <pre className="mt-4 text-white/80 text-base leading-8 font-serif whitespace-pre-wrap font-normal">
                  {poem.fullText}
                </pre>
              ) : (
                <p className="mt-4 text-white/40 text-sm italic">
                  Толық мəтін авторлық құқық бойынша қолжетімді емес
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function EducatorPoemsTab({ educator: e }: { educator: Educator }) {
  if (!e.poems?.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <BookOpen className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40">Өлеңдер туралы мəлімет жоқ</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {e.poems.map((poem) => (
        <PoemCard key={poem.id} poem={poem} />
      ))}
    </div>
  );
}
