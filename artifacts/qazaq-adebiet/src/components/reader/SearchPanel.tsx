import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import type { PdfCanvasHandle } from './PdfCanvas';

interface Props {
  open: boolean;
  onClose: () => void;
  onGoToPage: (page: number) => void;
  canvasRef: React.RefObject<PdfCanvasHandle | null>;
}

export default function SearchPanel({ open, onClose, onGoToPage, canvasRef }: Props) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = async () => {
    if (!query.trim() || !canvasRef.current) return;
    setLoading(true);
    const pages = await canvasRef.current.search(query);
    setResults(pages);
    setCurrent(0);
    if (pages.length > 0) onGoToPage(pages[0]);
    setLoading(false);
  };

  const goNext = () => {
    if (!results.length) return;
    const next = (current + 1) % results.length;
    setCurrent(next);
    onGoToPage(results[next]);
  };

  const goPrev = () => {
    if (!results.length) return;
    const prev = (current - 1 + results.length) % results.length;
    setCurrent(prev);
    onGoToPage(results[prev]);
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setCurrent(0);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-40 mt-2"
        >
          <div className="bg-gray-800/95 backdrop-blur-sm border border-white/15 rounded-2xl shadow-2xl p-3 flex items-center gap-2 min-w-[320px]">
            <Search size={15} className="text-gray-400 flex-shrink-0" />

            <input
              ref={inputRef}
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') doSearch();
                if (e.key === 'Escape') onClose();
              }}
              placeholder="PDF ішінде іздеу..."
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
            />

            {query && (
              <button onClick={clear} className="text-gray-500 hover:text-gray-300 transition-colors">
                <X size={13} />
              </button>
            )}

            <button
              onClick={doSearch}
              disabled={loading}
              className="px-3 py-1 rounded-lg bg-violet-500 hover:bg-violet-400 text-white text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : null}
              Іздеу
            </button>

            {results.length > 0 && (
              <>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {current + 1}/{results.length}
                </span>
                <button onClick={goPrev} className="p-1 hover:text-white text-gray-400 transition-colors">
                  <ChevronUp size={14} />
                </button>
                <button onClick={goNext} className="p-1 hover:text-white text-gray-400 transition-colors">
                  <ChevronDown size={14} />
                </button>
              </>
            )}

            {results.length === 0 && query && !loading && (
              <span className="text-xs text-gray-500 whitespace-nowrap">Табылмады</span>
            )}

            <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-300 transition-colors">
              <X size={14} />
            </button>
          </div>

          {/* Results list */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 bg-gray-800/95 border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-48 overflow-y-auto"
            >
              {results.map((page, i) => (
                <button
                  key={page}
                  onClick={() => { setCurrent(i); onGoToPage(page); }}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center gap-2
                    ${i === current ? 'bg-violet-500/20 text-violet-300' : 'text-gray-300 hover:bg-white/8'}`}
                >
                  <span className="text-gray-500">Бет</span>
                  <strong>{page}</strong>
                  {i === current && <span className="text-violet-400 ml-auto">← ағымдағы</span>}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
