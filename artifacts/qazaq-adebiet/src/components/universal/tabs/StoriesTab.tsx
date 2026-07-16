import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlignLeft, ChevronDown, ChevronUp, Search } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function StoriesTab({ author }: Props) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const accent = CATEGORY_ACCENT[author.category];
  const items = (author.stories ?? []).filter(s =>
    !search || s.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!author.stories?.length) return <EmptyState />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className={`text-lg font-semibold ${accent}`}>Әңгімелері ({author.stories.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Іздеу..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>
      <div className="space-y-3">
        {items.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/3 border border-white/8 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === story.id ? null : story.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors text-left"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-gray-300 border border-white/10">{story.genre}</span>
                  <span className="text-gray-500 text-xs">{story.year}</span>
                </div>
                <h3 className="text-white font-medium text-sm">{story.title}</h3>
              </div>
              {expanded === story.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            <AnimatePresence>
              {expanded === story.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-3">
                    {story.description && <p className="text-gray-400 text-xs">{story.description}</p>}
                    {story.excerpt && (
                      <blockquote className="border-l-2 border-white/20 pl-3 text-gray-300 text-xs italic">
                        {story.excerpt}
                      </blockquote>
                    )}
                    {story.fullText && (
                      <pre className="text-gray-200 text-xs leading-relaxed whitespace-pre-wrap mt-2">
                        {story.fullText}
                      </pre>
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
      <AlignLeft size={40} className="mx-auto mb-3 opacity-30" />
      <p>Әңгіме деректері жоқ</p>
    </div>
  );
}
