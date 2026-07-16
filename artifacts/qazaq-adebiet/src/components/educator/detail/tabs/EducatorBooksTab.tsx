import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, FileText } from 'lucide-react';
import type { Educator } from '@/types/educator';

export default function EducatorBooksTab({ educator: e }: { educator: Educator }) {
  const [search, setSearch] = useState('');

  const books = e.books.filter(
    (b) =>
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase())
  );

  if (!e.books.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <BookOpen className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40">Кітаптар туралы мəлімет жоқ</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-violet-500/40 transition-colors">
        <Search className="w-4 h-4 text-white/40 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Кітап атауы немесе жанры бойынша іздеу..."
          className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
        />
        {search && <button onClick={() => setSearch('')} className="text-white/30 hover:text-white/60 text-xs">✕</button>}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {books.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl border border-white/8 hover:border-violet-500/25 transition-all p-5 flex gap-4"
          >
            {/* Book icon column */}
            <div className="shrink-0 w-14 h-20 rounded-xl bg-gradient-to-br from-violet-600/30 to-teal-600/20 border border-white/8 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-violet-300/70" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-white font-semibold font-serif leading-snug">{b.title}</h3>
                <span className="shrink-0 text-violet-400 font-bold text-sm tabular-nums">{b.year}</span>
              </div>
              <span className="inline-block px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs mb-2">
                {b.genre}
              </span>
              <p className="text-white/55 text-sm leading-relaxed">{b.description}</p>

              {b.hasPdf && (
                <a
                  href={b.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  PDF оқу
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12 text-white/30 text-sm">Іздеу нəтижесі табылмады</div>
      )}
    </div>
  );
}
