import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import type { Writer } from '@/types/writer';

export default function WriterGalleryTab({ writer }: { writer: Writer }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!writer.gallery || writer.gallery.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Фотосуреттер жақын арада қосылады</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {writer.gallery.map((item, idx) => (
          <div 
            key={item.id} 
            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-white/10"
            onClick={() => setSelectedIndex(idx)}
          >
            <img 
              src={item.url} 
              alt={item.caption} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
              <Maximize2 className="w-6 h-6 text-white mb-2" />
              <p className="text-white text-sm text-center line-clamp-2">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative w-full max-w-5xl flex items-center justify-center">
              <button 
                className="absolute left-0 md:-left-12 p-2 text-white/50 hover:text-white transition-colors bg-black/50 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : writer.gallery.length - 1));
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <div className="flex flex-col items-center max-h-[80vh]">
                <img 
                  src={writer.gallery[selectedIndex].url} 
                  alt={writer.gallery[selectedIndex].caption}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg border border-white/20"
                />
                <p className="text-white mt-6 text-lg text-center max-w-2xl">
                  {writer.gallery[selectedIndex].caption}
                </p>
              </div>

              <button 
                className="absolute right-0 md:-right-12 p-2 text-white/50 hover:text-white transition-colors bg-black/50 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev !== null && prev < writer.gallery.length - 1 ? prev + 1 : 0));
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}