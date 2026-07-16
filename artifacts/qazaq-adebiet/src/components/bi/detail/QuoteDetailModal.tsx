import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Copy, Share2, Heart, Printer, FileText, Headphones,
  Check, BookOpen, Lightbulb, Globe, Feather, Hash,
  ChevronDown, ChevronUp, Quote as QuoteIcon,
} from 'lucide-react';
import type { Quote } from '@/hooks/useQuotes';
import { CATEGORY_COLORS, quoteWordCount } from '@/hooks/useQuotes';

interface Props {
  quote: Quote | null;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClose: () => void;
}

function Section({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-white/70 font-medium text-sm">
          {icon}
          <span>{title}</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-white/40" />
          : <ChevronDown className="w-4 h-4 text-white/40" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 text-white/70 text-sm leading-relaxed border-t border-white/8">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QuoteDetailModal({
  quote,
  isFavorite,
  onToggleFavorite,
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(22);

  /* Lock scroll */
  useEffect(() => {
    if (quote) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [quote]);

  /* Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!quote) return null;

  const catColor = CATEGORY_COLORS[quote.category] ?? 'bg-white/5 border-white/10 text-white/60';

  const copy = () => {
    navigator.clipboard.writeText(`«${quote.quote}»\n\n— ${quote.biName}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({
        title: `${quote.biName} — нақыл сөзі`,
        text: `«${quote.quote}» — ${quote.biName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      copy();
    }
  };

  const print = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html lang="kk">
      <head>
        <meta charset="UTF-8">
        <title>${quote.biName} — нақыл сөзі</title>
        <style>
          body { font-family: 'Times New Roman', serif; max-width: 700px; margin: 48px auto; color: #1a1a1a; line-height: 1.9; font-size: 15pt; }
          .quote { font-size: 20pt; font-style: italic; border-left: 4px solid #0d9488; padding-left: 24px; margin: 32px 0; }
          .author { text-align: right; color: #555; font-size: 12pt; }
          .meta { color: #666; font-size: 11pt; margin-bottom: 32px; }
          h2 { font-size: 14pt; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-top: 28px; color: #222; }
          p { margin: 8px 0; }
          .keywords { color: #888; font-size: 10pt; margin-top: 36px; }
          .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 9pt; color: #aaa; }
        </style>
      </head>
      <body>
        <div class="meta">${quote.biName} · ${quote.category}</div>
        <div class="quote">«${quote.quote}»</div>
        <div class="author">— ${quote.biName}</div>
        <h2>Мағынасы</h2>
        <p>${quote.meaning}</p>
        <h2>Айтылу жағдайы</h2>
        <p>${quote.context}</p>
        <h2>Қазіргі қолданысы</h2>
        <p>${quote.currentUsage}</p>
        <h2>Тәрбиелік мәні</h2>
        <p>${quote.educationalValue}</p>
        <div class="keywords">Кілт сөздер: ${quote.keywords.map(k => '#' + k).join(' ')}</div>
        <div class="footer">Дереккөз: ${quote.source}</div>
      </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const wc = quoteWordCount(quote.quote);

  return (
    <AnimatePresence>
      {quote && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto py-8 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl bg-[#0d0820] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 bg-[#0d0820]/98 border-b border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${catColor}`}>
                    {quote.category}
                  </span>
                  <span className="text-white/45 text-xs">{quote.biName}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => setFontSize(s => Math.max(16, s - 2))}
                    className="px-2 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 text-xs transition-colors">A−</button>
                  <button onClick={() => setFontSize(s => Math.min(32, s + 2))}
                    className="px-2 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 text-sm transition-colors">A+</button>
                  <div className="w-px h-4 bg-white/10 mx-1" />
                  <button onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-white/8 text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-8">

                {/* Large quote */}
                <div className="relative mb-8">
                  <QuoteIcon className="absolute -top-2 -left-2 w-10 h-10 text-teal-500/15" />
                  <blockquote
                    className="text-white font-serif leading-relaxed pl-4 border-l-2 border-teal-500/40"
                    style={{ fontSize: fontSize }}
                  >
                    {quote.quote}
                  </blockquote>
                  <p className="text-right text-white/40 text-sm mt-4 italic">— {quote.biName}</p>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-white/8">
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <Hash className="w-3.5 h-3.5" />
                    {wc} сөз
                  </div>
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <Feather className="w-3.5 h-3.5" />
                    {quote.category}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 mb-8">
                  <button onClick={copy}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Көшірілді' : 'Көшіру'}
                  </button>
                  <button onClick={share}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                    Бөлісу
                  </button>
                  <button
                    onClick={() => onToggleFavorite(quote.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border transition-colors ${
                      isFavorite
                        ? 'border-red-500/30 bg-red-500/15 text-red-400'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-400' : ''}`} />
                    {isFavorite ? 'Сақталды' : 'Сақтау'}
                  </button>
                  <button onClick={print}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                    <Printer className="w-4 h-4" />
                    Басып шығару
                  </button>
                  <button
                    disabled
                    title="Жақын арада"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-amber-500/20 bg-amber-500/8 text-amber-400/50 cursor-not-allowed">
                    <FileText className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    disabled
                    title="Жақын арада"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-emerald-500/20 bg-emerald-500/8 text-emerald-400/50 cursor-not-allowed">
                    <Headphones className="w-4 h-4" />
                    Аудио
                  </button>
                </div>

                {/* Detail sections */}
                <div className="space-y-3">
                  {quote.meaning && (
                    <Section title="Мағынасы" icon={<Lightbulb className="w-4 h-4 text-amber-400" />}>
                      {quote.meaning}
                    </Section>
                  )}
                  {quote.context && (
                    <Section title="Айтылу жағдайы" icon={<BookOpen className="w-4 h-4 text-teal-400" />}>
                      {quote.context}
                    </Section>
                  )}
                  {quote.currentUsage && (
                    <Section title="Қазіргі қолданысы" icon={<Globe className="w-4 h-4 text-sky-400" />}>
                      {quote.currentUsage}
                    </Section>
                  )}
                  {quote.educationalValue && (
                    <Section title="Тәрбиелік мәні" icon={<Feather className="w-4 h-4 text-emerald-400" />}>
                      {quote.educationalValue}
                    </Section>
                  )}

                  {/* Similar quotes */}
                  {quote.similarQuotes.length > 0 && (
                    <Section title="Ұқсас нақыл сөздер" icon={<QuoteIcon className="w-4 h-4 text-violet-400" />} defaultOpen={false}>
                      <ul className="space-y-2.5">
                        {quote.similarQuotes.map((sq, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-violet-400/60 mt-0.5">«</span>
                            <span className="italic">{sq}</span>
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}

                  {/* Keywords */}
                  {quote.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {quote.keywords.map((k) => (
                        <span key={k}
                          className="px-2.5 py-0.5 rounded-full text-xs bg-white/5 border border-white/8 text-white/40">
                          #{k}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-white/25 text-xs pt-2">Дереккөз: {quote.source}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
