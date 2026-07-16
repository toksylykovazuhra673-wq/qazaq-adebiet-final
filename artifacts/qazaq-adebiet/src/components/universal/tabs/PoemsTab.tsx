import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, ChevronUp, Search, Lock } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function PoemsTab({ author }: Props) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const accent = CATEGORY_ACCENT[author.category];
  const poems = (author.poems ?? []).filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!author.poems?.length) return <EmptyState />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className={`text-lg font-semibold ${accent}`}>Өлеңдері ({author.poems.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Өлең іздеу..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      <div className="space-y-3">
        {poems.map((poem, i) => (
          <motion.div
            key={poem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/3 border border-white/8 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === poem.id ? null : poem.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium text-sm">{poem.title}</h3>
                  {poem.isPublicDomain ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      Ашық
                    </span>
                  ) : (
                    <Lock size={12} className="text-gray-500" />
                  )}
                </div>
                {poem.year && <p className="text-gray-500 text-xs">{poem.year}</p>}
              </div>
              {expanded === poem.id ? (
                <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
              )}
            </button>

            <AnimatePresence>
              {expanded === poem.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-white/5 pt-4">
                    {poem.description && (
                      <p className="text-gray-400 text-xs mb-4">{poem.description}</p>
                    )}
                    {poem.fullText ? (
                      <pre className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-serif">
                        {poem.fullText}
                      </pre>
                    ) : (
                      <p className="text-gray-500 text-sm italic">Толық мәтін қолжетімді емес</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <FileText size={40} className="mx-auto mb-3 opacity-30" />
      <p>Өлеңдер деректері жоқ</p>
    </div>
  );
}
