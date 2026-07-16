import { motion } from 'framer-motion';
import { ScrollText, BookOpen } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function LongPoemsTab({ author }: Props) {
  const accent = CATEGORY_ACCENT[author.category];
  const items = author.longPoems ?? [];

  if (!items.length) return <EmptyState />;

  return (
    <div>
      <h2 className={`text-lg font-semibold ${accent} mb-6`}>Поэмалары ({items.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((poem, i) => (
          <motion.div
            key={poem.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white/3 border border-white/8 rounded-xl p-5 hover:bg-white/5 transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <ScrollText size={18} className="text-violet-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{poem.title}</h3>
                <p className="text-gray-500 text-xs">{poem.year}</p>
              </div>
            </div>
            {poem.description && (
              <p className="text-gray-400 text-xs leading-relaxed mb-3">{poem.description}</p>
            )}
            {poem.excerpt && (
              <blockquote className="border-l-2 border-violet-500/40 pl-3 text-gray-300 text-xs italic leading-relaxed">
                {poem.excerpt}
              </blockquote>
            )}
            <div className="flex items-center justify-between mt-3">
              {poem.pages && (
                <span className="text-gray-500 text-xs">{poem.pages} бет</span>
              )}
              {poem.isPublicDomain && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  Ашық мәтін
                </span>
              )}
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
      <ScrollText size={40} className="mx-auto mb-3 opacity-30" />
      <p>Поэма деректері жоқ</p>
    </div>
  );
}
