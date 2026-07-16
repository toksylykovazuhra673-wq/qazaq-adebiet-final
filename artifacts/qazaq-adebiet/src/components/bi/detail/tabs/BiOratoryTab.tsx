import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, BookOpen, Clock, Hash, Filter, X, ExternalLink,
  FileText, Headphones, Printer, Copy, Share2
} from 'lucide-react';
import type { BiSheshen } from '@/types/bi';
import { useOratoryBySlug, ORATORY_CATEGORIES, readingTime, wordCount } from '@/hooks/useOratory';
import type { OratoryWord, OratoryCategory } from '@/hooks/useOratory';
import OratoryReadModal from '../OratoryReadModal';

const CATEGORY_COLORS: Record<string, string> = {
  'Арнау':       'bg-teal-500/15 border-teal-500/30 text-teal-400',
  'Толғау':      'bg-violet-500/15 border-violet-500/30 text-violet-400',
  'Дау шешу':    'bg-amber-500/15 border-amber-500/30 text-amber-400',
  'Өсиет':       'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  'Бата':        'bg-sky-500/15 border-sky-500/30 text-sky-400',
  'Кеңес':       'bg-orange-500/15 border-orange-500/30 text-orange-400',
  'Тәрбие':      'bg-rose-500/15 border-rose-500/30 text-rose-400',
  'Билік сөзі':  'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
  'Елшілік сөзі':'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
};

function OratoryCard({
  word,
  biName,
  index,
  onOpen,
}: {
  word: OratoryWord;
  biName: string;
  index: number;
  onOpen: (w: OratoryWord) => void;
}) {
  const catColor = CATEGORY_COLORS[word.category] || 'bg-white/5 border-white/10 text-white/60';
  const rt = readingTime(word.fullText);
  const wc = wordCount(word.fullText);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${word.title}\n\n${word.fullText}\n\n— ${biName}`).catch(() => {});
  };
  const share = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: word.title, text: word.description, url: window.location.href }).catch(() => {});
    } else {
      copy(e);
    }
  };
  const print = (e: React.MouseEvent) => {
    e.stopPropagation();
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html lang="kk"><head><meta charset="UTF-8"><title>${word.title}</title><style>body{font-family:'Times New Roman',serif;max-width:800px;margin:40px auto;line-height:1.8;font-size:14pt}h1{font-size:20pt}.meta{color:#666;font-size:11pt;margin-bottom:28px}</style></head><body><h1>${word.title}</h1><div class="meta">${biName} · ${word.category} · ${word.period}</div><p>${word.fullText.replace(/\n/g,'<br>')}</p></body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="group glass-card rounded-2xl border border-white/8 hover:border-teal-500/30 transition-all duration-300 overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-0.5 bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6">
        {/* Category + period */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${catColor}`}>
            {word.category}
          </span>
          <span className="text-white/40 text-xs shrink-0">{word.period}</span>
        </div>

        {/* Title */}
        <h3 className="text-white font-serif text-xl font-semibold mb-2 leading-tight group-hover:text-teal-200 transition-colors">
          {word.title}
        </h3>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">
          {word.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-5 py-3 border-y border-white/6">
          <div className="flex items-center gap-1.5 text-white/45 text-xs">
            <Clock className="w-3.5 h-3.5 text-teal-400/60" />
            {rt} оқу
          </div>
          <div className="flex items-center gap-1.5 text-white/45 text-xs">
            <Hash className="w-3.5 h-3.5 text-white/30" />
            {wc} сөз
          </div>
          {word.addressee && (
            <div className="flex items-center gap-1.5 text-white/45 text-xs truncate">
              <BookOpen className="w-3.5 h-3.5 text-amber-400/60 shrink-0" />
              <span className="truncate">{word.addressee}</span>
            </div>
          )}
        </div>

        {/* Preview snippet */}
        <p className="text-white/50 text-sm leading-relaxed mb-5 italic line-clamp-3 font-serif border-l-2 border-teal-500/25 pl-3">
          {word.fullText.split('\n')[0]}...
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpen(word)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/25 transition-colors flex-1 justify-center"
          >
            <ExternalLink className="w-4 h-4" />
            Толық оқу
          </button>
          <button
            onClick={copy}
            title="Көшіру"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/8 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={share}
            title="Бөлісу"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/8 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={print}
            title="Басып шығару"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/8 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            title="PDF оқу (жақын арада)"
            className="p-2 rounded-xl bg-amber-500/8 text-amber-400/40 border border-amber-500/10 cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            title="Аудио тыңдау (жақын арада)"
            className="p-2 rounded-xl bg-emerald-500/8 text-emerald-400/40 border border-emerald-500/10 cursor-not-allowed"
          >
            <Headphones className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BiOratoryTab({ bi }: { bi: BiSheshen }) {
  const { filtered, total, search, setSearch, category, setCategory } = useOratoryBySlug(bi.slug);
  const [selectedWord, setSelectedWord] = useState<OratoryWord | null>(null);

  return (
    <div>
      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Шешендік сөз іздеу..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as OratoryCategory)}
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white/80 focus:outline-none focus:border-teal-500/50 appearance-none cursor-pointer min-w-[170px]"
          >
            {ORATORY_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0f0a22]">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ORATORY_CATEGORIES.filter(c => c !== 'Барлығы').map((c) => (
          <button
            key={c}
            onClick={() => setCategory(category === c ? 'Барлығы' : c)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              category === c
                ? (CATEGORY_COLORS[c] || 'bg-white/10 border-white/20 text-white')
                : 'bg-transparent border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/50 text-sm">
          <span className="text-white font-semibold">{filtered.length}</span> шешендік сөз табылды
          {total > 0 && category === 'Барлығы' && !search && (
            <span className="text-white/30"> / барлығы {total}</span>
          )}
        </p>
        {(search || category !== 'Барлығы') && (
          <button
            onClick={() => { setSearch(''); setCategory('Барлығы'); }}
            className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
          >
            Тазалау ✕
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <BookOpen className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg">Табылмады</p>
          <p className="text-white/30 text-sm mt-1">Сүзгіні өзгертіп немесе іздеуді тазалаңыз</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((word, i) => (
            <OratoryCard
              key={word.id}
              word={word}
              biName={bi.fullName}
              index={i}
              onOpen={setSelectedWord}
            />
          ))}
        </div>
      )}

      {/* Read Modal */}
      <OratoryReadModal
        word={selectedWord}
        biName={bi.fullName}
        onClose={() => setSelectedWord(null)}
      />
    </div>
  );
}
