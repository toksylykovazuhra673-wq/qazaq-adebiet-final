import { useState } from 'react';
import { motion } from 'framer-motion';
import { Library, Search, Headphones, ExternalLink } from 'lucide-react';
import { useLocation } from 'wouter';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';
import ItemPdfButton from '@/components/shared/ItemPdfButton';

interface Props { author: UniversalAuthor }

export default function WorksTab({ author }: Props) {
  const [search, setSearch] = useState('');
  const [, navigate] = useLocation();
  const accent = CATEGORY_ACCENT[author.category];

  const allWorks = [
    ...(author.poems ?? []).map(w => ({ ...w, type: 'Өлең', slug: `poem-${w.id}`, pfxId: `poem-${w.id}` })),
    ...(author.longPoems ?? []).map(w => ({ ...w, type: 'Поэма', slug: `longpoem-${w.id}`, pfxId: `longpoem-${w.id}` })),
    ...(author.novels ?? []).map(w => ({ ...w, type: 'Роман', pfxId: `novel-${w.id}` })),
    ...(author.stories ?? []).map(w => ({ ...w, type: 'Әңгіме', slug: `story-${w.id}`, pfxId: `story-${w.id}` })),
    ...(author.scientificWorks ?? []).map(w => ({ ...w, type: 'Ғылыми еңбек', slug: `science-${w.id}`, pfxId: `sci-${w.id}` })),
    ...(author.articles ?? []).map(w => ({ ...w, type: 'Мақала', slug: `article-${w.id}`, pfxId: `article-${w.id}` })),
    ...(author.oratories ?? []).map(w => ({ ...w, type: 'Шешендік сөз', slug: `oratory-${w.id}`, pfxId: `oratory-${w.id}` })),
  ];

  const filtered = allWorks.filter(w =>
    !search || w.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className={`text-lg font-semibold ${accent}`}>
          Барлық шығармалар ({allWorks.length})
        </h2>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Шығарма іздеу..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Library size={40} className="mx-auto mb-3 opacity-30" />
          <p>Шығарма табылмады</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((work, i) => (
          <motion.div
            key={`${work.type}-${work.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.5) }}
            className="bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 hover:border-white/15 transition-all group flex flex-col"
          >
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/8 text-gray-300 border border-white/10 self-start">
              {work.type}
            </span>

            <h3 className="text-white font-semibold text-sm mt-2 mb-1 group-hover:text-white transition-colors">
              {work.title}
            </h3>

            {work.year && <p className="text-gray-500 text-xs mb-2">{work.year}</p>}

            {('description' in work) && (work as any).description && (
              <p className="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2 flex-1">
                {(work as any).description}
              </p>
            )}

            {/* Existing action buttons */}
            <div className="flex gap-2 flex-wrap">
              {(work as any).slug && (
                <button
                  onClick={() => navigate(`/works/${(work as any).slug}`)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors"
                >
                  <ExternalLink size={11} /> Оқу
                </button>
              )}
              {(work as any).hasAudio && (
                <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors">
                  <Headphones size={11} /> Аудио
                </button>
              )}
            </div>

            {/* PDF button */}
            <ItemPdfButton
              ownerSlug={author.slug}
              itemId={work.pfxId}
              itemTitle={work.title}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
