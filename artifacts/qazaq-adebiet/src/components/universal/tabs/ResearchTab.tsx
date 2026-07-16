import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function ResearchTab({ author }: Props) {
  const [search, setSearch] = useState('');
  const accent = CATEGORY_ACCENT[author.category];
  const items = (author.research ?? []).filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.field.toLowerCase().includes(search.toLowerCase())
  );

  if (!author.research?.length) return <EmptyState />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className={`text-lg font-semibold ${accent}`}>Зерттеулері ({author.research.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Іздеу..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">{r.field}</span>
              <span className="text-gray-500 text-xs">{r.year}</span>
            </div>
            <h3 className="text-white font-semibold text-sm mb-2">{r.title}</h3>
            {r.summary && <p className="text-gray-400 text-xs leading-relaxed mb-3">{r.summary}</p>}
            {r.bibliography && <p className="text-gray-500 text-xs italic border-t border-white/5 pt-2">{r.bibliography}</p>}
            {r.hasPdf && (
              <button className="mt-3 flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors">
                <Download size={11} />PDF жүктеу
              </button>
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
      <Search size={40} className="mx-auto mb-3 opacity-30" />
      <p>Зерттеу деректері жоқ</p>
    </div>
  );
}
