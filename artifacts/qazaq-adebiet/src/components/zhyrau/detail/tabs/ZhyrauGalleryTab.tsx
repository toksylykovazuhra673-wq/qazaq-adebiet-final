import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Zhyrau } from '@/types/zhyrau';

export default function ZhyrauGalleryTab({ zhyrau }: { zhyrau: Zhyrau }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!zhyrau.gallery || zhyrau.gallery.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Фотосуреттер жақын арада қосылады.</p>
      </div>
    );
  }

  const prev = () => setLightboxIndex(i => (i !== null ? (i - 1 + zhyrau.gallery.length) % zhyrau.gallery.length : null));
  const next = () => setLightboxIndex(i => (i !== null ? (i + 1) % zhyrau.gallery.length : null));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {zhyrau.gallery.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setLightboxIndex(i)}
            className="aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-accent/50 transition-colors group"
          >
            <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
              <img src={zhyrau.gallery[lightboxIndex].url} alt={zhyrau.gallery[lightboxIndex].caption} className="w-full max-h-[80vh] object-contain rounded-xl" />
              <p className="text-white/70 text-center mt-4">{zhyrau.gallery[lightboxIndex].caption}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
            <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
