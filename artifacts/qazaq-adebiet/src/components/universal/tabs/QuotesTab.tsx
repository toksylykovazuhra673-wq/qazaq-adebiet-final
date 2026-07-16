import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Copy, Share2, Heart, Printer, Search } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

const FAV_KEY = 'qazaq_adebiet_universal_quote_favorites';

interface Props { author: UniversalAuthor }

export default function QuotesTab({ author }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [favorites, setFavorites] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]'); } catch { return []; }
  });
  const [copied, setCopied] = useState<number | null>(null);
  const accent = CATEGORY_ACCENT[author.category];

  const categories = Array.from(new Set((author.quotes ?? []).map(q => q.category).filter(Boolean)));
  const items = (author.quotes ?? []).filter(q =>
    (filter === 'all' || q.category === filter) &&
    (!search || q.text.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleFav = (id: number) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
  };

  const copy = (q: { id: number; text: string }) => {
    navigator.clipboard?.writeText(`"${q.text}" — ${author.fullName}`);
    setCopied(q.id);
    setTimeout(() => setCopied(null), 1500);
  };

  const share = (text: string) => {
    if (navigator.share) navigator.share({ text: `"${text}" — ${author.fullName}` });
    else navigator.clipboard?.writeText(`"${text}" — ${author.fullName}`);
  };

  if (!author.quotes?.length) return <EmptyState />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className={`text-lg font-semibold ${accent}`}>Қанатты сөздері ({author.quotes.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Іздеу..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === 'all' ? 'bg-white/15 text-white border-white/20' : 'border-white/10 text-gray-400 hover:text-white'}`}>
            Барлығы
          </button>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c!)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === c ? 'bg-white/15 text-white border-white/20' : 'border-white/10 text-gray-400 hover:text-white'}`}>
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.4) }}
            className="bg-white/3 border border-white/8 rounded-xl p-5 hover:bg-white/5 transition-all group">
            {/* Quote mark */}
            <div className="text-4xl text-gray-600 font-serif leading-none mb-2">"</div>
            <p className="text-gray-100 text-sm leading-relaxed mb-3 font-medium">{q.text}</p>
            {q.category && <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-gray-400 border border-white/10">{q.category}</span>}
            {q.source && <p className="text-gray-500 text-xs mt-2 italic">— {q.source}</p>}
            {q.meaning && <p className="text-gray-400 text-xs mt-2 leading-relaxed">{q.meaning}</p>}

            {/* Actions */}
            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => copy(q)} title="Көшіру"
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors">
                <Copy size={11} />{copied === q.id ? 'Көшірілді!' : 'Көшіру'}
              </button>
              <button onClick={() => share(q.text)} title="Бөлісу"
                className="p-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors">
                <Share2 size={13} />
              </button>
              <button onClick={() => toggleFav(q.id)} title="Таңдаулы"
                className={`p-1.5 rounded-lg bg-white/8 hover:bg-white/15 transition-colors ${favorites.includes(q.id) ? 'text-red-400' : 'text-gray-300'}`}>
                <Heart size={13} fill={favorites.includes(q.id) ? 'currentColor' : 'none'} />
              </button>
              <button onClick={() => window.print()} title="Басып шығару"
                className="p-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors">
                <Printer size={13} />
              </button>
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
      <Star size={40} className="mx-auto mb-3 opacity-30" />
      <p>Дәйексөз деректері жоқ</p>
    </div>
  );
}
