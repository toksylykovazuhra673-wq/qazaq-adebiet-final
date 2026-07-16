import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Microscope, Search, FileText } from 'lucide-react';
import type { Educator } from '@/types/educator';

export default function EducatorResearchTab({ educator: e }: { educator: Educator }) {
  const [search, setSearch] = useState('');

  const items = e.research.filter(
    (r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.field.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase())
  );

  if (!e.research.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <Microscope className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40">Зерттеулер туралы мəлімет жоқ</p>
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
          placeholder="Зерттеу немесе сала бойынша іздеу..."
          className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
        />
        {search && <button onClick={() => setSearch('')} className="text-white/30 hover:text-white/60 text-xs">✕</button>}
      </div>

      <div className="space-y-4">
        {items.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-panel rounded-2xl border border-white/6 hover:border-teal-500/20 transition-colors p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-white font-semibold font-serif text-lg">{r.title}</h3>
              <span className="shrink-0 text-violet-400 font-bold tabular-nums">{r.year}</span>
            </div>
            <span className="inline-block px-2.5 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs mb-3">
              {r.field}
            </span>
            <p className="text-white/65 text-sm leading-relaxed mb-3">{r.summary}</p>
            {r.bibliography && (
              <p className="text-white/30 text-xs flex items-center gap-1.5">
                <FileText className="w-3 h-3 shrink-0" />
                {r.bibliography}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-white/30 text-sm">Іздеу нəтижесі табылмады</div>
      )}
    </div>
  );
}
