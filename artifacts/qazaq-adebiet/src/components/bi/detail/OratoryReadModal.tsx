import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, FileText, Headphones, Printer, Copy, Share2, Check,
  BookOpen, Clock, Hash, ChevronDown, ChevronUp, Lightbulb,
  Feather, Globe, Users, Calendar, MapPin
} from 'lucide-react';
import type { OratoryWord } from '@/hooks/useOratory';
import { readingTime, wordCount } from '@/hooks/useOratory';

interface Props {
  word: OratoryWord | null;
  biName: string;
  onClose: () => void;
}

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

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
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
        {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
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
            <div className="px-5 pb-4 pt-1 text-white/70 text-sm leading-relaxed border-t border-white/8">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OratoryReadModal({ word, biName, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (word) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [word]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const copy = () => {
    if (!word) return;
    navigator.clipboard.writeText(`${word.title}\n\n${word.fullText}\n\n— ${biName}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = () => {
    if (!word) return;
    if (navigator.share) {
      navigator.share({ title: word.title, text: word.description, url: window.location.href }).catch(() => {});
    } else {
      copy();
    }
  };

  const print = () => {
    if (!word) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html lang="kk">
      <head>
        <meta charset="UTF-8">
        <title>${word.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 40px auto; color: #1a1a1a; line-height: 1.8; font-size: 16pt; }
          h1 { font-size: 22pt; margin-bottom: 8px; }
          .meta { color: #666; font-size: 11pt; margin-bottom: 32px; }
          .text { font-size: 14pt; margin-bottom: 40px; }
          .section { margin-bottom: 24px; }
          .section h3 { font-size: 13pt; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; }
          .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 12px; font-size: 10pt; color: #999; }
        </style>
      </head>
      <body>
        <h1>${word.title}</h1>
        <div class="meta">${biName} · ${word.category} · ${word.period}</div>
        <div class="text">${word.fullText.replace(/\n/g, '<br>')}</div>
        <div class="section"><h3>Мазмұны</h3><p>${word.description}</p></div>
        <div class="section"><h3>Негізгі ойы</h3><p>${word.mainIdea}</p></div>
        <div class="section"><h3>Тәрбиелік мәні</h3><p>${word.educationalValue}</p></div>
        <div class="footer">Дереккөз: ${word.source}</div>
      </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const catColor = word ? (CATEGORY_COLORS[word.category] || 'bg-white/5 border-white/10 text-white/60') : '';

  return (
    <AnimatePresence>
      {word && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto py-8 px-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full max-w-3xl bg-[#0d0820] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header bar */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 bg-[#0d0820]/98 border-b border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${catColor}`}>
                    {word.category}
                  </span>
                  <p className="text-white/70 text-sm truncate">{biName}</p>
                </div>
                <div className="flex items-center gap-1">
                  {/* Font size */}
                  <button onClick={() => setFontSize(s => Math.max(14, s - 2))} className="px-2 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 text-xs transition-colors">A−</button>
                  <button onClick={() => setFontSize(s => Math.min(26, s + 2))} className="px-2 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 text-sm transition-colors">A+</button>
                  <div className="w-px h-4 bg-white/10 mx-1" />
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/8 text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-8" ref={contentRef}>
                {/* Title */}
                <h1 className="font-serif text-white font-bold mb-3 leading-tight" style={{ fontSize: fontSize + 6 }}>
                  {word.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex items-center gap-1.5 text-white/50 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    {word.period}
                  </div>
                  <div className="flex items-center gap-1.5 text-white/50 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {readingTime(word.fullText)} оқу уақыты
                  </div>
                  <div className="flex items-center gap-1.5 text-white/50 text-xs">
                    <Hash className="w-3.5 h-3.5" />
                    {wordCount(word.fullText)} сөз
                  </div>
                  {word.addressee && (
                    <div className="flex items-center gap-1.5 text-white/50 text-xs">
                      <Users className="w-3.5 h-3.5" />
                      {word.addressee}
                    </div>
                  )}
                </div>

                {/* Short description */}
                <p className="text-white/65 text-base leading-relaxed mb-8 pb-8 border-b border-white/8 italic">
                  {word.description}
                </p>

                {/* Full text */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-px flex-1 bg-white/8" />
                    <span className="text-xs text-white/30 uppercase tracking-widest px-3">Толық мәтін</span>
                    <div className="h-px flex-1 bg-white/8" />
                  </div>
                  <div
                    className="text-white/90 leading-[1.9] font-serif whitespace-pre-line"
                    style={{ fontSize: fontSize }}
                  >
                    {word.fullText}
                  </div>
                  <div className="mt-6 text-right text-white/40 text-sm italic">— {biName}</div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mb-10 pb-10 border-b border-white/8">
                  <button
                    onClick={copy}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Көшірілді' : 'Көшіру'}
                  </button>
                  <button
                    onClick={share}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Бөлісу
                  </button>
                  <button
                    onClick={print}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Басып шығару
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors opacity-50 cursor-not-allowed"
                    title="Жақын арада"
                  >
                    <FileText className="w-4 h-4" />
                    PDF оқу
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors opacity-50 cursor-not-allowed"
                    title="Жақын арада"
                  >
                    <Headphones className="w-4 h-4" />
                    Аудио тыңдау
                  </button>
                </div>

                {/* Sections */}
                <div className="space-y-3">
                  {word.context && (
                    <Section title="Айтылу тарихы мен жағдайы" icon={<Calendar className="w-4 h-4 text-teal-400" />}>
                      {word.context}
                    </Section>
                  )}
                  {word.mainIdea && (
                    <Section title="Негізгі ойы" icon={<Lightbulb className="w-4 h-4 text-amber-400" />}>
                      {word.mainIdea}
                    </Section>
                  )}
                  {word.educationalValue && (
                    <Section title="Тәрбиелік мәні" icon={<BookOpen className="w-4 h-4 text-emerald-400" />}>
                      {word.educationalValue}
                    </Section>
                  )}
                  {word.literaryFeatures && (
                    <Section title="Әдеби ерекшелігі" icon={<Feather className="w-4 h-4 text-violet-400" />}>
                      {word.literaryFeatures}
                    </Section>
                  )}
                  {word.artisticDevices && (
                    <Section title="Көркемдегіш тәсілдері" icon={<Feather className="w-4 h-4 text-rose-400" />}>
                      {word.artisticDevices}
                    </Section>
                  )}
                  {word.contemporaryRelevance && (
                    <Section title="Қазіргі маңызы" icon={<Globe className="w-4 h-4 text-sky-400" />}>
                      {word.contemporaryRelevance}
                    </Section>
                  )}

                  {/* Related */}
                  {(word.relatedPersons.length > 0 || word.relatedEvents.length > 0) && (
                    <Section title="Байланысты тұлғалар мен оқиғалар" icon={<Users className="w-4 h-4 text-white/50" />}>
                      <div className="space-y-2">
                        {word.relatedPersons.length > 0 && (
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1.5">Тұлғалар</p>
                            <div className="flex flex-wrap gap-2">
                              {word.relatedPersons.map((p) => (
                                <span key={p} className="px-2.5 py-0.5 rounded-full text-xs bg-teal-500/10 border border-teal-500/20 text-teal-400/80">{p}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {word.relatedEvents.length > 0 && (
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1.5">Оқиғалар</p>
                            <div className="flex flex-wrap gap-2">
                              {word.relatedEvents.map((e) => (
                                <span key={e} className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400/80">{e}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Section>
                  )}

                  {/* Keywords */}
                  {word.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {word.keywords.map((k) => (
                        <span key={k} className="px-2.5 py-0.5 rounded-full text-xs bg-white/5 border border-white/8 text-white/40">#{k}</span>
                      ))}
                    </div>
                  )}

                  {/* Source */}
                  <p className="text-white/30 text-xs pt-3">
                    Дереккөз: {word.source}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
