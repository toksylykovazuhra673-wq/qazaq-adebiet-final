import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Search } from 'lucide-react';
import type { Educator } from '@/types/educator';

export default function EducatorArticlesTab({ educator: e }: { educator: Educator }) {
  const [search, setSearch] = useState('');

  const articles = e.articles.filter(
    (a) =>
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.publication.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );

  if (!e.articles.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <Newspaper className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40">Мақалалар туралы мəлімет жоқ</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-violet-500/40 transition-colors">
        <Search className="w-4 h-4 text-white/40 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
          placeholder="Мақала немесе басылым бойынша іздеу..."
          className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
        />
        {search && <button onClick={() => setSearch('')} className="text-white/30 hover:text-white/60 text-xs">✕</button>}
      </div>

      <div className="space-y-3">
        {articles.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-panel rounded-xl border border-white/6 hover:border-violet-500/20 transition-colors p-5 flex gap-4"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-white font-medium">{a.title}</h3>
                <span className="shrink-0 text-violet-400 font-bold text-sm tabular-nums">{a.year}</span>
              </div>
              <p className="text-teal-400 text-xs mt-0.5 mb-2">📰 {a.publication}</p>
              <p className="text-white/55 text-sm leading-relaxed">{a.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12 text-white/30 text-sm">Іздеу нəтижесі табылмады</div>
      )}
    </div>
  );
}
