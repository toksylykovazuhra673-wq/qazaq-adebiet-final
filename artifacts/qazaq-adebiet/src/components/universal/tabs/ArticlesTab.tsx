import { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Search, ExternalLink } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function ArticlesTab({ author }: Props) {
  const [search, setSearch] = useState('');
  const accent = CATEGORY_ACCENT[author.category];
  const items = (author.articles ?? []).filter(a =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.publication.toLowerCase().includes(search.toLowerCase())
  );

  if (!author.articles?.length) return <EmptyState />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className={`text-lg font-semibold ${accent}`}>Мақалалары ({author.articles.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Іздеу..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" />
        </div>
      </div>
      <div className="space-y-3">
        {items.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
              <Newspaper size={16} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white font-medium text-sm">{a.title}</h3>
                {a.url && (
                  <a href={a.url} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 p-1 hover:text-white text-gray-500 transition-colors">
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
              <div className="flex gap-3 text-xs text-gray-400 mt-1">
                <span>{a.publication}</span>
                <span>·</span>
                <span>{a.year}</span>
              </div>
              {a.description && <p className="text-gray-400 text-xs mt-2 leading-relaxed">{a.description}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
      <p>Мақала деректері жоқ</p>
    </div>
  );
}
