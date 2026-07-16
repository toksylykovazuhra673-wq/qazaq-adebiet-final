import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { PdfCanvasHandle } from '../PdfCanvas';

interface Props {
  totalPages: number;
  currentPage: number;
  onGoToPage: (page: number) => void;
  canvasRef: React.RefObject<PdfCanvasHandle | null>;
}

interface Thumbnail {
  page: number;
  dataUrl: string | null;
  loading: boolean;
}

export default function ThumbnailsPanel({ totalPages, currentPage, onGoToPage, canvasRef }: Props) {
  const [thumbs, setThumbs] = useState<Thumbnail[]>([]);
  const renderQueue = useRef<number[]>([]);
  const rendering = useRef(false);

  // Init thumbnail slots
  useEffect(() => {
    if (!totalPages) return;
    setThumbs(
      Array.from({ length: totalPages }, (_, i) => ({
        page: i + 1,
        dataUrl: null,
        loading: false,
      }))
    );
    renderQueue.current = Array.from({ length: Math.min(totalPages, 20) }, (_, i) => i + 1);
    rendering.current = false;
    processQueue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const processQueue = async () => {
    if (rendering.current) return;
    rendering.current = true;

    while (renderQueue.current.length > 0) {
      const page = renderQueue.current.shift()!;
      if (!canvasRef.current) break;

      setThumbs(prev => prev.map(t => t.page === page ? { ...t, loading: true } : t));

      try {
        const canvas = document.createElement('canvas');
        await canvasRef.current.renderThumbnail(page, canvas);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setThumbs(prev => prev.map(t =>
          t.page === page ? { ...t, dataUrl, loading: false } : t
        ));
      } catch {
        setThumbs(prev => prev.map(t =>
          t.page === page ? { ...t, loading: false } : t
        ));
      }

      await new Promise(r => setTimeout(r, 50)); // throttle
    }

    rendering.current = false;
  };

  if (!totalPages) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500 text-xs">
        PDF жүктелуде...
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2 overflow-y-auto flex-1">
      {thumbs.map((thumb) => (
        <motion.button
          key={thumb.page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: Math.min(thumb.page * 0.02, 0.5) }}
          onClick={() => onGoToPage(thumb.page)}
          className={`w-full flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all group
            ${currentPage === thumb.page
              ? 'bg-violet-500/20 border border-violet-500/40'
              : 'hover:bg-white/5 border border-transparent'
            }`}
        >
          {/* Thumbnail image */}
          <div className="w-full aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-white/5">
            {thumb.loading ? (
              <Loader2 size={14} className="animate-spin text-gray-600" />
            ) : thumb.dataUrl ? (
              <img src={thumb.dataUrl} alt={`Бет ${thumb.page}`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 text-[10px]">{thumb.page}</span>
            )}
          </div>
          {/* Page number */}
          <span className={`text-[10px] font-medium ${currentPage === thumb.page ? 'text-violet-300' : 'text-gray-500'}`}>
            {thumb.page}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
