import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Poet, PoetPoem } from '@/types/poet';

function PoemCard({ poem }: { poem: PoetPoem }) {
  const [expanded, setExpanded] = useState(false);

  const lines = poem.content.split('\n');
  const previewLines = lines.slice(0, 4);
  const hasMore = lines.length > 4;

  return (
    <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col transition-all">
      <div className="flex justify-between items-start mb-6">
        <h4 className="text-2xl font-serif text-white">{poem.title}</h4>
        <span className="text-accent font-medium bg-accent/10 px-3 py-1 rounded-full text-sm">
          {poem.year}
        </span>
      </div>

      <div className="font-mono text-[0.95rem] leading-loose text-white/80 whitespace-pre-wrap flex-1 bg-black/20 p-5 rounded-xl border border-white/5">
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="full"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {poem.content}
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {previewLines.join('\n')}
              {hasMore && <span className="text-white/40 block mt-2">...</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors text-sm font-medium"
        >
          {expanded ? (
            <>Жасыру <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Толығырақ оқу <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  );
}

export default function PoemsTab({ poet }: { poet: Poet }) {
  if (!poet.poems || poet.poems.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Өлеңдер тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {poet.poems.map((poem) => (
        <PoemCard key={poem.id} poem={poem} />
      ))}
    </div>
  );
}
