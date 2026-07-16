import { motion } from 'framer-motion';
import { Video, Play } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT, CATEGORY_COLORS } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function VideoTab({ author }: Props) {
  const accent = CATEGORY_ACCENT[author.category];
  const gradient = CATEGORY_COLORS[author.category];
  const items = author.videos ?? [];

  if (!items.length) return <EmptyState />;

  return (
    <div>
      <h2 className={`text-lg font-semibold ${accent} mb-6`}>Бейнематериалдар ({items.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((video, i) => (
          <motion.div key={video.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white/3 border border-white/8 rounded-xl overflow-hidden hover:bg-white/5 hover:border-white/15 transition-all group">
            {/* Thumbnail */}
            <div className="relative h-40 bg-gray-800">
              {video.thumbnail ? (
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-20 flex items-center justify-center`}>
                  <Video size={40} className="text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                {video.url ? (
                  <a href={video.url} target="_blank" rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all group-hover:scale-110">
                    <Play size={20} className="text-white" fill="white" />
                  </a>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center opacity-50">
                    <Play size={20} className="text-white" fill="white" />
                  </div>
                )}
              </div>
              {video.duration && (
                <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded">{video.duration}</span>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-white font-medium text-sm">{video.title}</h3>
              {video.description && <p className="text-gray-400 text-xs mt-1 line-clamp-2">{video.description}</p>}
              {!video.url && <p className="text-gray-600 text-xs mt-2 italic">Бейне қолжетімді емес</p>}
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
      <Video size={40} className="mx-auto mb-3 opacity-30" />
      <p>Бейне деректері жоқ</p>
    </div>
  );
}
