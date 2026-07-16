import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Educator } from '@/types/educator';

export default function EducatorGalleryTab({ educator: e }: { educator: Educator }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i! > 0 ? i! - 1 : e.gallery.length - 1));
  const next = () => setLightboxIndex((i) => (i! < e.gallery.length - 1 ? i! + 1 : 0));

  if (!e.gallery.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <Image className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40">Фотогалерея мəліметтері жоқ</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {e.gallery.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => openLightbox(i)}
            className="group relative aspect-square rounded-xl overflow-hidden border border-white/8 hover:border-violet-500/30 transition-colors bg-gradient-to-br from-violet-600/20 to-teal-600/10"
          >
            {item.url ? (
              <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                <Image className="w-8 h-8 text-white/20" />
                <span className="text-white/20 text-xs px-2 text-center line-clamp-2">{item.caption}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-3 opacity-0 group-hover:opacity-100">
              <p className="text-white text-xs leading-snug">{item.caption}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={(ev) => { ev.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full"
              onClick={(ev) => ev.stopPropagation()}
            >
              {e.gallery[lightboxIndex].url ? (
                <img
                  src={e.gallery[lightboxIndex].url}
                  alt={e.gallery[lightboxIndex].caption}
                  className="w-full max-h-[75vh] object-contain rounded-2xl"
                />
              ) : (
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-violet-600/20 to-teal-600/10 flex items-center justify-center">
                  <Image className="w-16 h-16 text-white/20" />
                </div>
              )}
              <p className="text-white/60 text-sm text-center mt-3">{e.gallery[lightboxIndex].caption}</p>
              <p className="text-white/30 text-xs text-center mt-1">{lightboxIndex + 1} / {e.gallery.length}</p>
            </motion.div>

            <button
              onClick={(ev) => { ev.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
