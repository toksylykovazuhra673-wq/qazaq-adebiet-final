import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT, CATEGORY_COLORS } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function GalleryTab({ author }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const accent = CATEGORY_ACCENT[author.category];
  const gradient = CATEGORY_COLORS[author.category];
  const items = author.gallery ?? [];

  const prev = () => setLightbox(l => l === null ? null : (l - 1 + items.length) % items.length);
  const next = () => setLightbox(l => l === null ? null : (l + 1) % items.length);

  if (!items.length) return <EmptyState />;

  return (
    <div>
      <h2 className={`text-lg font-semibold ${accent} mb-6`}>Фотогалерея ({items.length})</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <motion.button key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
            onClick={() => setLightbox(i)}
            className="group relative aspect-square rounded-xl overflow-hidden border border-white/8 hover:border-white/20 transition-all">
            {item.url ? (
              <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-30 flex items-center justify-center`}>
                <Image size={28} className="text-white/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <p className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
              {item.caption}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <button onClick={e => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <X size={20} />
            </button>
            <button onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <ChevronRight size={20} />
            </button>
            <motion.div key={lightbox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
              {items[lightbox].url ? (
                <img src={items[lightbox].url} alt={items[lightbox].caption} className="w-full max-h-[70vh] object-contain rounded-xl" />
              ) : (
                <div className={`w-full h-64 bg-gradient-to-br ${gradient} opacity-30 rounded-xl flex items-center justify-center`}>
                  <Image size={60} className="text-white/40" />
                </div>
              )}
              <p className="text-center text-gray-300 text-sm mt-4">{items[lightbox].caption}</p>
              {items[lightbox].year && <p className="text-center text-gray-500 text-xs">{items[lightbox].year}</p>}
              <p className="text-center text-gray-600 text-xs mt-2">{lightbox + 1} / {items.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <Image size={40} className="mx-auto mb-3 opacity-30" />
      <p>Фото деректері жоқ</p>
    </div>
  );
}
