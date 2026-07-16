import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ChevronDown, ChevronUp, Search, Download } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function OratoryTab({ author }: Props) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const accent = CATEGORY_ACCENT[author.category];
  const items = (author.oratories ?? []).filter(o =>
    !search || o.title.toLowerCase().includes(search.toLowerCase()) || (o.category ?? '').toLowerCase().includes(search.toLowerCase())
  );

  if (!author.oratories?.length) return <EmptyState />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className={`text-lg font-semibold ${accent}`}>Шешендік сөздері ({author.oratories.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Іздеу..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" />
        </div>
      </div>
      <div className="space-y-3">
        {items.map((o, i) => (
          <motion.div key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
            <button onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors text-left">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {o.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{o.category}</span>
                  )}
                  {o.year && <span className="text-gray-500 text-xs">{o.year}</span>}
                </div>
                <h3 className="text-white font-medium text-sm">{o.title}</h3>
                {o.occasion && <p className="text-gray-500 text-xs mt-0.5">{o.occasion}</p>}
              </div>
              {expanded === o.id ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
            </button>
            <AnimatePresence>
              {expanded === o.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 border-t border-white/5 pt-4">
                    <p className="text-gray-200 text-sm leading-relaxed italic">"{o.fullText}"</p>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => navigator.clipboard?.writeText(o.fullText)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors">Көшіру</button>
                      <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors">
                        <Download size={11} />PDF
                      </button>
                    </div>
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
      <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
      <p>Шешендік сөз деректері жоқ</p>
    </div>
  );
}
