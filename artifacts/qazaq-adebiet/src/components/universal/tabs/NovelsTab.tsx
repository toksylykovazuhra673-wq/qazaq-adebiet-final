import { motion } from 'framer-motion';
import { BookMarked, Download, Headphones, ExternalLink } from 'lucide-react';
import { useLocation } from 'wouter';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function NovelsTab({ author }: Props) {
  const accent = CATEGORY_ACCENT[author.category];
  const [, navigate] = useLocation();
  const items = author.novels ?? [];

  if (!items.length) return <EmptyState />;

  return (
    <div>
      <h2 className={`text-lg font-semibold ${accent} mb-6`}>Романдары ({items.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((novel, i) => (
          <motion.div
            key={novel.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white/3 border border-white/8 rounded-xl overflow-hidden hover:bg-white/5 hover:border-white/15 transition-all group"
          >
            {/* Cover */}
            <div className="h-36 bg-gradient-to-br from-blue-600/30 to-indigo-700/20 flex items-center justify-center border-b border-white/5">
              {novel.coverImage ? (
                <img src={novel.coverImage} alt={novel.title} className="h-full w-full object-cover" />
              ) : (
                <BookMarked size={40} className="text-blue-400/40" />
              )}
            </div>

            <div className="p-4">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {novel.genre}
              </span>
              <h3 className="text-white font-semibold text-sm mt-2 mb-1">{novel.title}</h3>
              <p className="text-gray-500 text-xs mb-2">{novel.year} {novel.pages ? `· ${novel.pages} бет` : ''}</p>
              {novel.description && (
                <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{novel.description}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/works/${novel.slug}`)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 transition-colors"
                >
                  <ExternalLink size={11} />
                  Толығырақ
                </button>
                {novel.hasPdf && (
                  <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors">
                    <Download size={11} />PDF
                  </button>
                )}
                {novel.hasAudio && (
                  <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors">
                    <Headphones size={11} />Аудио
                  </button>
                )}
              </div>
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
      <BookMarked size={40} className="mx-auto mb-3 opacity-30" />
      <p>Роман деректері жоқ</p>
    </div>
  );
}
