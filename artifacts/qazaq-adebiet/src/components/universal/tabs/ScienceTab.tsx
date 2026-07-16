import { useState } from 'react';
import { motion } from 'framer-motion';
import { Microscope, Search, Download } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function ScienceTab({ author }: Props) {
  const [search, setSearch] = useState('');
  const accent = CATEGORY_ACCENT[author.category];
  const items = (author.scientificWorks ?? []).filter(w =>
    !search || w.title.toLowerCase().includes(search.toLowerCase()) || w.field.toLowerCase().includes(search.toLowerCase())
  );

  if (!author.scientificWorks?.length) return <EmptyState />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className={`text-lg font-semibold ${accent}`}>Ғылыми еңбектері ({author.scientificWorks.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Іздеу..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" />
        </div>
      </div>

      {/* Table md+ */}
      <div className="hidden md:block bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/8">
            <tr className="text-left text-gray-400 text-xs">
              <th className="px-5 py-3 font-medium">Атауы</th>
              <th className="px-5 py-3 font-medium">Жылы</th>
              <th className="px-5 py-3 font-medium">Саласы</th>
              <th className="px-5 py-3 font-medium">Сипаттама</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((w, i) => (
              <tr key={w.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 ? 'bg-white/2' : ''}`}>
                <td className="px-5 py-3 text-white font-medium">{w.title}</td>
                <td className="px-5 py-3 text-gray-300 whitespace-nowrap">{w.year}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">{w.field}</span>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs max-w-xs">{w.description}</td>
                <td className="px-5 py-3">
                  {w.hasPdf && (
                    <button className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300">
                      <Download size={11} />PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="md:hidden space-y-3">
        {items.map((w, i) => (
          <motion.div key={w.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white/3 border border-white/8 rounded-xl p-4">
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">{w.field}</span>
            <h3 className="text-white font-medium text-sm mt-2 mb-1">{w.title}</h3>
            <p className="text-gray-500 text-xs mb-2">{w.year}</p>
            {w.description && <p className="text-gray-400 text-xs">{w.description}</p>}
            {w.bibliography && <p className="text-gray-500 text-xs mt-2 italic">{w.bibliography}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <Microscope size={40} className="mx-auto mb-3 opacity-30" />
      <p>Ғылыми еңбек деректері жоқ</p>
    </div>
  );
}
