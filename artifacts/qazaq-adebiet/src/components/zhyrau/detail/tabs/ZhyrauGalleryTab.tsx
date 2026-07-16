import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image, Upload } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Zhyrau } from '@/types/zhyrau';

export default function ZhyrauGalleryTab({ zhyrau }: { zhyrau: Zhyrau }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!zhyrau.gallery || zhyrau.gallery.length === 0) {
    return (
      <div className="space-y-6">
        {/* Info panel */}
        <div className="glass-panel rounded-2xl p-8 border border-white/5">
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-white/10 flex items-center justify-center mb-5">
              <Image className="w-9 h-9 text-white/40" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">Фотосуреттер жоқ</h3>
            <p className="text-white/50 text-sm max-w-sm">
              {zhyrau.fullName} жырауға қатысты тарихи суреттер мен бейнелеулер жақын арада қосылады.
            </p>
          </div>
        </div>

        {/* Placeholder skeleton grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl border border-white/5 bg-white/3 flex items-center justify-center overflow-hidden relative"
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(135deg,
                    hsl(${260 + i * 15}, 40%, 15%) 0%,
                    hsl(${280 + i * 10}, 50%, 10%) 100%)`,
                }}
              />
              <div className="relative z-10 text-4xl font-serif text-white/10 select-none">
                {zhyrau.fullName.charAt(0)}
              </div>
              <div className="absolute bottom-2 right-2">
                <Upload className="w-3.5 h-3.5 text-white/15" />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-white/30 text-xs">
          Суреттер қосылғаннан кейін Lightbox режимінде қарауға болады
        </p>
      </div>
    );
  }

  const prev = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + zhyrau.gallery.length) % zhyrau.gallery.length : null,
    );
  const next = () =>
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % zhyrau.gallery.length : null,
    );

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {zhyrau.gallery.map((item, i) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setLightboxIndex(i)}
            className="aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-accent/50 transition-colors group"
          >
            <img
              src={item.url}
              alt={item.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full">
              <img
                src={zhyrau.gallery[lightboxIndex].url}
                alt={zhyrau.gallery[lightboxIndex].caption}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
              <p className="text-white/70 text-center mt-4">
                {zhyrau.gallery[lightboxIndex].caption}
              </p>
              <p className="text-white/30 text-center text-xs mt-1">
                {lightboxIndex + 1} / {zhyrau.gallery.length}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => setLightboxIndex(null)}
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
