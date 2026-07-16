import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, FileText, Search } from 'lucide-react';
import type { Educator } from '@/types/educator';

export default function EducatorScienceTab({ educator: e }: { educator: Educator }) {
  const [search, setSearch] = useState('');

  const works = e.scientificWorks.filter(
    (w) =>
      !search ||
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.field.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase())
  );

  if (!e.scientificWorks.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <FlaskConical className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40">Ғылыми еңбектер туралы мəлімет жоқ</p>
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
          placeholder="Еңбек бойынша іздеу..."
          className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-white/30 hover:text-white/60 text-xs">✕</button>
        )}
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-4 text-white/40 text-xs uppercase tracking-wider font-medium">№</th>
                <th className="text-left px-5 py-4 text-white/40 text-xs uppercase tracking-wider font-medium">Еңбек атауы</th>
                <th className="text-left px-5 py-4 text-white/40 text-xs uppercase tracking-wider font-medium">Жыл</th>
                <th className="text-left px-5 py-4 text-white/40 text-xs uppercase tracking-wider font-medium">Сала</th>
                <th className="text-left px-5 py-4 text-white/40 text-xs uppercase tracking-wider font-medium hidden lg:table-cell">Сипаттама</th>
              </tr>
            </thead>
            <tbody>
              {works.map((w, i) => (
                <motion.tr
                  key={w.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors group"
                >
                  <td className="px-5 py-4 text-white/30 text-xs">{i + 1}</td>
                  <td className="px-5 py-4">
                    <span className="text-white font-medium group-hover:text-violet-200 transition-colors">
                      {w.title}
                    </span>
                    <div className="text-white/30 text-xs mt-0.5 lg:hidden">{w.description}</div>
                    {w.bibliography && (
                      <div className="text-white/25 text-xs mt-1 flex items-center gap-1">
                        <FileText className="w-3 h-3 shrink-0" />
                        {w.bibliography}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-violet-400 font-medium tabular-nums">{w.year}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs">
                      {w.field}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/55 text-sm hidden lg:table-cell max-w-xs">
                    {w.description}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {works.length === 0 && (
          <div className="text-center py-12 text-white/30 text-sm">
            Іздеу нəтижесі табылмады
          </div>
        )}
      </div>
    </div>
  );
}
