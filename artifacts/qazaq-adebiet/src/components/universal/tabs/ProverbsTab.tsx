import { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Search, ChevronDown, ChevronUp } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function ProverbsTab({ author }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<number | null>(null);
  const accent = CATEGORY_ACCENT[author.category];

  const topics = Array.from(new Set((author.proverbs ?? []).map(p => p.topic).filter(Boolean)));
  const items = (author.proverbs ?? []).filter(p =>
    (filter === 'all' || p.topic === filter) &&
    (!search || p.text.toLowerCase().includes(search.toLowerCase()))
  );

  if (!author.proverbs?.length) return <EmptyState />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className={`text-lg font-semibold ${accent}`}>Нақыл сөздері ({author.proverbs.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Іздеу..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" />
        </div>
      </div>

      {/* Topic filter */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === 'all' ? 'bg-white/15 text-white border-white/20' : 'border-white/10 text-gray-400 hover:text-white'}`}>
            Барлығы
          </button>
          {topics.map(t => (
            <button key={t} onClick={() => setFilter(t!)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === t ? 'bg-white/15 text-white border-white/20' : 'border-white/10 text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {items.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
            <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              className="w-full flex items-start gap-3 p-4 hover:bg-white/3 transition-colors text-left">
              <Quote size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium leading-relaxed">{p.text}</p>
                {p.topic && <span className="text-xs text-gray-500 mt-1 block">{p.topic}</span>}
              </div>
              {expanded === p.id ? <ChevronUp size={14} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />}
            </button>
            {expanded === p.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2">
                  {p.meaning && <div><span className="text-gray-500 text-xs font-medium">Мағынасы: </span><span className="text-gray-300 text-xs">{p.meaning}</span></div>}
                  {p.explanation && <div><span className="text-gray-500 text-xs font-medium">Түсіндірмесі: </span><span className="text-gray-300 text-xs">{p.explanation}</span></div>}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <Quote size={40} className="mx-auto mb-3 opacity-30" />
      <p>Нақыл сөз деректері жоқ</p>
    </div>
  );
}
