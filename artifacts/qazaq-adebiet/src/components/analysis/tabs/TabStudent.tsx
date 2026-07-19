import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, RotateCcw, ChevronRight } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

// ── Flashcard component ───────────────────────────────────────
function FlashCard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="relative h-36 cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-full h-full"
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center p-4 text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-white/80 text-sm">{front}</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl border border-violet-500/30 bg-violet-500/10 flex items-center justify-center p-4 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-violet-200 text-sm font-medium">{back}</p>
        </div>
      </motion.div>
      <div className="absolute bottom-2 right-2 text-white/20 text-xs">
        {flipped ? '↩' : '→'}
      </div>
    </div>
  );
}

export default function TabStudent({ analysis }: { analysis: Analysis }) {
  const [section, setSection] = useState('flashcards');
  const [cardIdx, setCardIdx] = useState(0);
  const sm = analysis.studentMaterials;

  if (!sm) {
    return (
      <div className="text-center py-16 text-white/40">
        <BookMarked size={40} className="mx-auto mb-4 opacity-30" />
        <p>Оқушы материалдары қол жетімсіз.</p>
      </div>
    );
  }

  const SECTIONS = [
    { id: 'flashcards', label: 'Флеш-карталар' },
    { id: 'keywords',   label: 'Кілт сөздер' },
    { id: 'thoughts',   label: 'Есте сақта' },
    { id: 'summary',    label: 'Қысқаша' },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              section === s.id
                ? 'bg-violet-500 text-white'
                : 'bg-white/8 text-white/60 hover:bg-white/12'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Flashcards */}
          {section === 'flashcards' && (
            <div className="space-y-4">
              <p className="text-white/40 text-xs">Картаны басып аударыңыз → жауапты көресіз</p>
              {/* Single card navigation */}
              <div className="relative">
                <FlashCard
                  front={sm.flashcards[cardIdx].front}
                  back={sm.flashcards[cardIdx].back}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCardIdx(i => Math.max(0, i - 1))}
                  disabled={cardIdx === 0}
                  className="p-2 rounded-xl bg-white/8 hover:bg-white/12 text-white/50 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <span className="text-white/30 text-sm">{cardIdx + 1} / {sm.flashcards.length}</span>
                <button
                  onClick={() => setCardIdx(i => Math.min(sm.flashcards.length - 1, i + 1))}
                  disabled={cardIdx === sm.flashcards.length - 1}
                  className="p-2 rounded-xl bg-white/8 hover:bg-white/12 text-white/50 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              {/* All cards grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {sm.flashcards.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => setCardIdx(i)}
                    className={`text-left p-3 rounded-xl border text-xs transition-colors ${
                      i === cardIdx
                        ? 'border-violet-500/40 bg-violet-500/10 text-violet-300'
                        : 'border-white/8 bg-white/[0.02] text-white/50 hover:bg-white/[0.04]'
                    }`}
                  >
                    {card.front}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {section === 'keywords' && (
            <div>
              <p className="text-white/40 text-xs mb-4">Шығарманы оқу алдында немесе оқып болғаннан кейін меңгеріңіз</p>
              <div className="flex flex-wrap gap-2">
                {sm.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-white/8 border border-white/10 text-white/80 text-sm hover:bg-violet-500/15 hover:border-violet-500/30 hover:text-violet-300 transition-colors cursor-default"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key thoughts */}
          {section === 'thoughts' && (
            <div className="space-y-3">
              <p className="text-white/40 text-xs mb-4">Абайдың ең маңызды дәйексөздері</p>
              {sm.keyThoughts.map((thought, i) => (
                <div key={i} className="bg-white/[0.03] border-l-2 border-violet-500 rounded-r-xl pl-4 pr-4 py-3">
                  <p className="text-white/80 text-sm italic">«{thought}»</p>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {section === 'summary' && (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <p className="text-white/80 text-sm leading-relaxed">{sm.summary}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
