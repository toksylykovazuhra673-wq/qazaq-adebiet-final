import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { Poet } from '@/types/poet';

export default function GalleryTab({ poet }: { poet: Poet }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!poet.gallery || poet.gallery.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <ImageIcon className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-2xl font-serif text-white mb-3">Фотогалерея</h3>
        <p className="text-white/60">Фотосуреттер жақын арада қосылады.</p>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : poet.gallery.length - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex < poet.gallery.length - 1 ? selectedIndex + 1 : 0);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {poet.gallery.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative cursor-pointer aspect-square rounded-2xl overflow-hidden glass-card"
            onClick={() => setSelectedIndex(idx)}
          >
            <img 
              src={item.url} 
              alt={item.caption} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {item.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
            >
              <X className="w-6 h-6" />
            </button>

            {poet.gallery.length > 1 && (
              <>
                <button 
                  className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/20 text-white rounded-full transition-colors z-50 backdrop-blur-md border border-white/10"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button 
                  className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/20 text-white rounded-full transition-colors z-50 backdrop-blur-md border border-white/10"
                  onClick={handleNext}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <motion.div 
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={poet.gallery[selectedIndex].url} 
                alt={poet.gallery[selectedIndex].caption}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-6 text-center">
                <p className="text-white text-lg font-medium">
                  {poet.gallery[selectedIndex].caption}
                </p>
                <p className="text-white/50 text-sm mt-1">
                  {selectedIndex + 1} / {poet.gallery.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
