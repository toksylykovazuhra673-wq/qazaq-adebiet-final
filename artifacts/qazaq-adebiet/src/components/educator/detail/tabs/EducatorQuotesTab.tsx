import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Copy, Share2, Heart, Search } from 'lucide-react';
import type { Educator } from '@/types/educator';

const STORAGE_KEY = 'qazaq_adebiet_educator_favorites';

function getFavorites(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

function saveFavorites(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

interface QuoteCardProps {
  quote: Educator['quotes'][number];
  educatorSlug: string;
  onCopy: (text: string) => void;
}

function QuoteCard({ quote, educatorSlug, onCopy }: QuoteCardProps) {
  const key = `${educatorSlug}-q-${quote.id}`;
  const [isFav, setIsFav] = useState(() => getFavorites().has(key));
  const [copied, setCopied] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const toggleFav = () => {
    const favs = getFavorites();
    if (favs.has(key)) favs.delete(key); else favs.add(key);
    saveFavorites(favs);
    setIsFav(!isFav);
  };

  const handleCopy = () => {
    onCopy(quote.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Дəйексөз', text: quote.text }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl border border-white/8 hover:border-violet-500/25 transition-all p-6 flex flex-col gap-4"
    >
      {/* Category badge */}
      <span className="inline-block self-start px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-violet-500/15 border border-violet-500/25 text-violet-400">
        {quote.category}
      </span>

      {/* Quote text */}
      <blockquote className="text-white font-serif text-xl leading-relaxed">
        «{quote.text}»
      </blockquote>

      {/* Source */}
      {quote.source && (
        <p className="text-white/35 text-xs italic">— {quote.source}</p>
      )}

      {/* Meaning toggle */}
      {quote.meaning && (
        <div>
          <button
            onClick={() => setDetailOpen(!detailOpen)}
            className="text-xs text-teal-400/80 hover:text-teal-400 transition-colors"
          >
            {detailOpen ? '▲ Жасыру' : '▼ Мағынасы'}
          </button>
          <AnimatePresence>
            {detailOpen && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden text-white/60 text-sm mt-2 leading-relaxed"
              >
                {quote.meaning}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/6 mt-auto">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/8 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? 'Көшірілді!' : 'Көшіру'}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/8 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Бөлісу
        </button>
        <button
          onClick={toggleFav}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
            isFav
              ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/15'
              : 'text-white/40 hover:text-rose-400 hover:bg-white/5'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-400' : ''}`} />
          {isFav ? 'Таңдаулы' : 'Таңдаулыға'}
        </button>
      </div>
    </motion.div>
  );
}

export default function EducatorQuotesTab({ educator: e }: { educator: Educator }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [toast, setToast] = useState('');

  const categories = ['all', ...Array.from(new Set(e.quotes.map((q) => q.category)))];

  const filtered = e.quotes.filter((q) => {
    const matchesCategory = activeCategory === 'all' || q.category === activeCategory;
    const matchesSearch =
      !search ||
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.meaning.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setToast('Дəйексөз буферге көшірілді!');
    setTimeout(() => setToast(''), 2000);
  }, []);

  if (!e.quotes.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <MessageSquare className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40">Дəйексөздер жоқ</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search + Category filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-violet-500/40 transition-colors flex-1">
          <Search className="w-4 h-4 text-white/40 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
            placeholder="Дəйексөз іздеу..."
            className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
          />
          {search && <button onClick={() => setSearch('')} className="text-white/30 hover:text-white/60 text-xs">✕</button>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              activeCategory === c
                ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                : 'border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {c === 'all' ? 'Барлығы' : c}
          </button>
        ))}
      </div>

      {/* Quotes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((q) => (
          <QuoteCard key={q.id} quote={q} educatorSlug={e.slug} onCopy={handleCopy} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-white/30 text-sm">Іздеу нəтижесі табылмады</div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-violet-600 text-white text-sm rounded-xl shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
