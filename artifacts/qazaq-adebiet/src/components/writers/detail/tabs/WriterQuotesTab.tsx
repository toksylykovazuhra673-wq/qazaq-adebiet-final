import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Copy, Share2, Star, Shuffle, Check } from 'lucide-react';
import type { Writer } from '@/types/writer';

interface Props { writer: Writer }

export default function WriterQuotesTab({ writer }: Props) {
  const quotes = writer.quotes ?? [];
  const [savedIds, setSavedIds] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(`saved_quotes_${writer.slug}`) ?? '[]')); }
    catch { return new Set(); }
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [randomIdx, setRandomIdx] = useState<number | null>(null);

  const copyQuote = useCallback((q: Writer['quotes'][number]) => {
    const text = `«${q.text}»\n— ${writer.fullName}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, [writer.fullName]);

  const shareQuote = useCallback((q: Writer['quotes'][number]) => {
    const text = `«${q.text}» — ${writer.fullName}`;
    if (navigator.share) {
      navigator.share({ title: writer.fullName, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }, [writer.fullName]);

  const toggleSave = useCallback((id: number) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem(`saved_quotes_${writer.slug}`, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, [writer.slug]);

  const showRandom = useCallback(() => {
    if (!quotes.length) return;
    const idx = Math.floor(Math.random() * quotes.length);
    setRandomIdx(idx);
    setTimeout(() => setRandomIdx(null), 4000);
  }, [quotes.length]);

  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Quote size={40} className="text-white/15 mb-4" />
        <p className="text-white/30">Қанатты сөздер толықтырылуда</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-bold">Қанатты сөздері</h2>
          <p className="text-white/40 text-sm">{quotes.length} нақыл сөз</p>
        </div>
        <button
          onClick={showRandom}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600/20 border border-violet-500/30 hover:bg-violet-600/30 text-violet-300 text-sm font-medium transition-all"
        >
          <Shuffle size={15} />
          Кездейсоқ
        </button>
      </div>

      {/* Random quote overlay */}
      <AnimatePresence>
        {randomIdx !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="mb-6 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-900/40 to-indigo-900/30 p-8 text-center shadow-[0_0_40px_rgba(139,92,246,0.2)]"
          >
            <Quote size={32} className="text-violet-400/50 mx-auto mb-4" />
            <p className="text-white text-lg font-serif leading-relaxed italic">«{quotes[randomIdx].text}»</p>
            <p className="text-violet-300 text-sm mt-4">— {writer.shortName}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote grid */}
      <div className="columns-1 md:columns-2 gap-4 space-y-0">
        {quotes.map((q, i) => {
          const isSaved = savedIds.has(q.id);
          const isCopied = copiedId === q.id;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="break-inside-avoid mb-4 group rounded-2xl border border-white/8 bg-white/4 hover:bg-white/6 hover:border-white/12 transition-all p-5"
            >
              {/* Quote text */}
              <div className="flex gap-3 mb-4">
                <Quote size={18} className="text-violet-400/60 flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-sm leading-relaxed font-serif italic">{q.text}</p>
              </div>

              {q.source && (
                <p className="text-white/30 text-xs mb-3 ml-6">— {q.source}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2 ml-6">
                <button
                  onClick={() => copyQuote(q)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isCopied
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                      : 'bg-white/6 border border-white/10 text-white/45 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isCopied ? <Check size={12} /> : <Copy size={12} />}
                  {isCopied ? 'Көшірілді' : 'Көшіру'}
                </button>
                <button
                  onClick={() => shareQuote(q)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/10 text-white/45 hover:text-white hover:bg-white/10 text-xs font-medium transition-all"
                >
                  <Share2 size={12} />
                  Бөлісу
                </button>
                <button
                  onClick={() => toggleSave(q.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSaved
                      ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                      : 'bg-white/6 border border-white/10 text-white/45 hover:text-amber-300 hover:bg-amber-500/10'
                  }`}
                >
                  <Star size={12} fill={isSaved ? 'currentColor' : 'none'} />
                  {isSaved ? 'Сақталды' : 'Сақтау'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
