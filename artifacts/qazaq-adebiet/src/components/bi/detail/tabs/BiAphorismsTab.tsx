import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Copy, Share2, Heart, Printer,
  FileText, Headphones, Check, Hash, ChevronRight,
  Quote as QuoteIcon, X,
} from 'lucide-react';
import type { BiSheshen } from '@/types/bi';
import type { Quote, QuoteCategory } from '@/hooks/useQuotes';
import {
  useQuotesBySlug,
  usePresentCategories,
  CATEGORY_COLORS,
  quoteWordCount,
} from '@/hooks/useQuotes';
import QuoteDetailModal from '@/components/bi/detail/QuoteDetailModal';
import TeacherPdfUploader from '@/components/bi/detail/TeacherPdfUploader';

/* ─── Individual Quote Card ──────────────────────────────────────────────── */
function QuoteCard({
  quote,
  isFavorite,
  onToggleFavorite,
  onReadMore,
}: {
  quote: Quote;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onReadMore: (q: Quote) => void;
}) {
  const [copied, setCopied] = useState(false);

  const catColor = CATEGORY_COLORS[quote.category] ?? 'bg-white/5 border-white/10 text-white/60';
  const wc = quoteWordCount(quote.quote);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`«${quote.quote}»\n— ${quote.biName}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ text: `«${quote.quote}» — ${quote.biName}`, url: window.location.href }).catch(() => {});
    } else {
      copy(e);
    }
  };

  const print = (e: React.MouseEvent) => {
    e.stopPropagation();
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html lang="kk"><head><meta charset="UTF-8"><title>Нақыл сөз</title>
      <style>body{font-family:'Times New Roman',serif;max-width:600px;margin:48px auto;color:#1a1a1a;line-height:1.9;font-size:15pt;}
      .quote{font-size:20pt;font-style:italic;border-left:4px solid #0d9488;padding-left:20px;margin:24px 0;}
      .author{text-align:right;color:#555;font-size:12pt;}
      .meaning{color:#444;margin-top:24px;font-size:12pt;}
      .footer{margin-top:32px;border-top:1px solid #ddd;padding-top:8px;font-size:9pt;color:#aaa;}
      </style></head><body>
      <div class="quote">«${quote.quote}»</div>
      <div class="author">— ${quote.biName}</div>
      <div class="meaning">${quote.meaning}</div>
      <div class="footer">Дереккөз: ${quote.source}</div>
      </body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      className="glass-card rounded-2xl border border-white/8 hover:border-teal-500/20 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Top strip */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/6">
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${catColor}`}>
          {quote.category}
        </span>
        <div className="flex items-center gap-1.5 text-white/30 text-[11px]">
          <Hash className="w-3 h-3" />
          {wc} сөз
        </div>
      </div>

      {/* Quote body */}
      <div className="px-5 py-5 flex-1 relative">
        <QuoteIcon className="absolute top-4 left-3 w-8 h-8 text-teal-500/10 pointer-events-none" />
        <p
          className="text-white/90 font-serif leading-relaxed text-lg relative z-10"
        >
          {quote.quote}
        </p>
        <p className="text-right text-white/30 text-xs mt-3 italic">— {quote.biName}</p>
      </div>

      {/* Meaning preview */}
      <div className="px-5 pb-4">
        <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{quote.meaning}</p>
      </div>

      {/* Actions */}
      <div className="px-5 pb-4 pt-1 border-t border-white/6 flex flex-col gap-3">
        {/* Primary button */}
        <button
          onClick={() => onReadMore(quote)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/25 text-teal-400 text-sm font-medium transition-colors"
        >
          <QuoteIcon className="w-4 h-4" />
          Толық түсіндірме
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>

        {/* Secondary buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={copy}
            title="Көшіру"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
              copied
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-white/8 bg-white/4 hover:bg-white/8 text-white/50 hover:text-white'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Көшірілді' : 'Көшіру'}
          </button>
          <button
            onClick={share}
            title="Бөлісу"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-white/8 bg-white/4 hover:bg-white/8 text-white/50 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Бөлісу
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(quote.id); }}
            title="Сақтау"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
              isFavorite
                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                : 'border-white/8 bg-white/4 hover:bg-white/8 text-white/50 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-400' : ''}`} />
            {isFavorite ? 'Сақталды' : 'Сақтау'}
          </button>
          <button
            onClick={print}
            title="Басып шығару"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-white/8 bg-white/4 hover:bg-white/8 text-white/50 hover:text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Басып шығару
          </button>
          <button
            disabled
            title="Жақын арада"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-amber-500/15 bg-amber-500/5 text-amber-400/40 cursor-not-allowed"
          >
            <FileText className="w-3.5 h-3.5" />
            PDF
          </button>
          <button
            disabled
            title="Жақын арада"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-emerald-500/15 bg-emerald-500/5 text-emerald-400/40 cursor-not-allowed"
          >
            <Headphones className="w-3.5 h-3.5" />
            Аудио
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton Card ──────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl border border-white/6 p-5 animate-pulse space-y-3">
      <div className="h-3 w-24 bg-white/8 rounded-full" />
      <div className="h-6 w-full bg-white/6 rounded" />
      <div className="h-6 w-4/5 bg-white/6 rounded" />
      <div className="h-4 w-3/5 bg-white/5 rounded mt-2" />
      <div className="h-8 w-full bg-white/5 rounded-xl mt-3" />
    </div>
  );
}

/* ─── Main Tab ───────────────────────────────────────────────────────────── */
export default function BiAphorismsTab({ bi }: { bi: BiSheshen }) {
  const {
    filtered,
    total,
    search,
    setSearch,
    category,
    setCategory,
    suggestions,
    favorites,
    toggleFavorite,
  } = useQuotesBySlug(bi.slug);

  const presentCategories = usePresentCategories(bi.slug);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestRef = useRef<HTMLDivElement>(null);

  /* Close suggestions on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestRef.current && !suggestRef.current.contains(e.target as Node) &&
        searchRef.current && !searchRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (total === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <QuoteIcon className="w-10 h-10 text-white/20 mx-auto mb-3" />
        <p className="text-white/60 text-lg">Нақыл сөздер жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search + filter header */}
      <div className="glass-panel rounded-2xl p-4 border border-white/8 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Нақыл сөздерден іздеу..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white/80 placeholder-white/30 text-sm outline-none focus:border-teal-500/40 focus:bg-white/8 transition-colors"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setShowSuggestions(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Autocomplete suggestions */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                ref={suggestRef}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1 bg-[#0d0820] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setSearch(s); setShowSuggestions(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/6 hover:text-white transition-colors border-b border-white/5 last:border-0 line-clamp-1"
                  >
                    <span className="text-teal-400/60 mr-2">«</span>{s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-white/30 shrink-0" />
          {presentCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat as QuoteCategory)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                category === cat
                  ? (cat === 'Барлығы'
                    ? 'bg-teal-600/25 border-teal-500/40 text-teal-300'
                    : (CATEGORY_COLORS[cat] ?? 'bg-white/10 border-white/20 text-white'))
                  : 'bg-white/4 border-white/8 text-white/50 hover:border-white/15 hover:text-white/75'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-white/40 text-sm">
          <span className="text-white/70 font-medium">{filtered.length}</span> нақыл сөз табылды
          {category !== 'Барлығы' && (
            <span className="ml-1">· <span className="text-white/55">{category}</span></span>
          )}
          <span className="text-white/30"> / барлығы {total}</span>
        </p>
        {(search || category !== 'Барлығы') && (
          <button
            onClick={() => { setSearch(''); setCategory('Барлығы'); }}
            className="text-xs text-white/35 hover:text-white/60 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Сүзгіні тазалау
          </button>
        )}
      </div>

      {/* Card grid */}
      <AnimatePresence mode="popLayout">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass-panel p-12 rounded-2xl text-center"
          >
            <QuoteIcon className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <p className="text-white/50 text-base">Нақыл сөз табылмады</p>
            <p className="text-white/30 text-sm mt-1">Іздеу немесе сүзгіні өзгертіп көріңіз</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filtered.map((q) => (
              <QuoteCard
                key={q.id}
                quote={q}
                isFavorite={favorites.has(q.id)}
                onToggleFavorite={toggleFavorite}
                onReadMore={setSelectedQuote}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail modal */}
      <QuoteDetailModal
        quote={selectedQuote}
        isFavorite={selectedQuote ? favorites.has(selectedQuote.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedQuote(null)}
      />

      {/* Teacher PDF uploader */}
      <TeacherPdfUploader biSlug={bi.slug} category="nakyl" />
    </div>
  );
}
