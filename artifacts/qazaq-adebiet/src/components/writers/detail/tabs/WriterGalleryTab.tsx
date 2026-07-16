import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Play, Pause, Image } from 'lucide-react';
import type { Writer } from '@/types/writer';

interface Props { writer: Writer }

export default function WriterGalleryTab({ writer }: Props) {
  const gallery = writer.gallery ?? [];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [slideshow, setSlideshow] = useState(false);
  const slideshowRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const openLightbox = (i: number) => { setLightboxIdx(i); setZoom(1); };
  const closeLightbox = useCallback(() => { setLightboxIdx(null); setZoom(1); setSlideshow(false); }, []);

  const prev = useCallback(() => {
    setLightboxIdx((i) => i === null ? null : (i - 1 + gallery.length) % gallery.length);
    setZoom(1);
  }, [gallery.length]);

  const next = useCallback(() => {
    setLightboxIdx((i) => i === null ? null : (i + 1) % gallery.length);
    setZoom(1);
  }, [gallery.length]);

  // Slideshow
  useEffect(() => {
    if (slideshow && lightboxIdx !== null) {
      slideshowRef.current = setInterval(next, 3000);
      return () => { if (slideshowRef.current) clearInterval(slideshowRef.current); };
    } else {
      if (slideshowRef.current) clearInterval(slideshowRef.current);
    }
  }, [slideshow, lightboxIdx, next]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.5, 4));
      if (e.key === '-') setZoom((z) => Math.max(z - 0.5, 0.5));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIdx, closeLightbox, prev, next]);

  if (gallery.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Image size={40} className="text-white/15 mb-4" />
        <p className="text-white/30">Фотогалерея толықтырылуда</p>
      </div>
    );
  }

  const activeItem = lightboxIdx !== null ? gallery[lightboxIdx] : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-bold">Фотогалерея</h2>
          <p className="text-white/40 text-sm">{gallery.length} сурет</p>
        </div>
      </div>

      {/* Masonry-like grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {gallery.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => openLightbox(i)}
            className="group relative rounded-2xl overflow-hidden border border-white/8 bg-slate-800 cursor-pointer hover:border-violet-500/40 transition-all"
            style={{ aspectRatio: i % 5 === 0 ? '3/4' : '1/1' }}
          >
            <img
              src={item.url}
              alt={item.caption}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
              <p className="text-white text-xs font-medium line-clamp-2">{item.caption}</p>
              {item.year && <p className="text-white/50 text-xs mt-0.5">{item.year}</p>}
            </div>
            <div className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={13} className="text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeItem && lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
            onClick={(e) => e.target === e.currentTarget && closeLightbox()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
              <div>
                <p className="text-white/70 text-sm">{activeItem.caption}</p>
                {activeItem.year && <p className="text-white/35 text-xs">{activeItem.year}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-sm">{lightboxIdx + 1} / {gallery.length}</span>

                {/* Zoom out */}
                <button onClick={() => setZoom((z) => Math.max(z - 0.5, 0.5))}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all disabled:opacity-30" disabled={zoom <= 0.5}>
                  <ZoomOut size={16} />
                </button>
                <span className="text-white/40 text-xs w-8 text-center">{Math.round(zoom * 100)}%</span>
                {/* Zoom in */}
                <button onClick={() => setZoom((z) => Math.min(z + 0.5, 4))}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all disabled:opacity-30" disabled={zoom >= 4}>
                  <ZoomIn size={16} />
                </button>

                {/* Slideshow */}
                <button
                  onClick={() => setSlideshow((v) => !v)}
                  className={`p-2 rounded-xl transition-all ${slideshow ? 'bg-violet-600 text-white' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
                >
                  {slideshow ? <Pause size={16} /> : <Play size={16} />}
                </button>

                {/* Fullscreen */}
                <button onClick={() => document.documentElement.requestFullscreen?.().catch(() => {})}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all">
                  <Maximize2 size={16} />
                </button>

                <button onClick={closeLightbox}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all ml-2">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Image area */}
            <div className="flex-1 flex items-center justify-center overflow-hidden px-16 relative">
              <button onClick={prev}
                className="absolute left-4 p-3 rounded-2xl bg-white/8 hover:bg-white/15 text-white border border-white/12 transition-all z-10">
                <ChevronLeft size={22} />
              </button>

              <motion.div
                key={lightboxIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-h-full max-w-full flex items-center justify-center overflow-hidden"
              >
                <img
                  src={activeItem.url}
                  alt={activeItem.caption}
                  className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-200"
                  style={{ transform: `scale(${zoom})` }}
                />
              </motion.div>

              <button onClick={next}
                className="absolute right-4 p-3 rounded-2xl bg-white/8 hover:bg-white/15 text-white border border-white/12 transition-all z-10">
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="flex items-center gap-2 px-6 py-4 overflow-x-auto hide-scrollbar flex-shrink-0">
              {gallery.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => { setLightboxIdx(i); setZoom(1); }}
                  className={`w-16 h-12 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === lightboxIdx ? 'border-violet-500' : 'border-transparent opacity-50 hover:opacity-80'}`}
                >
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
