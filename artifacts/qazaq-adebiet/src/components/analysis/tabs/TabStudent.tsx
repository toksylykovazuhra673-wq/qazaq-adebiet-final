import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';
import type { Analysis } from '@/types/analysis';
import type { GeneratedLesson } from '@/utils/lessonPlanGenerator';

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

// ── Generated task panel ──────────────────────────────────────
function GeneratedTaskPanel({ lesson }: { lesson: GeneratedLesson }) {
  const [cardIdx, setCardIdx] = useState(0);
  const [section, setSection] = useState<'flashcards' | 'keywords' | 'thoughts' | 'summary' | 'homework'>('flashcards');
  const { lessonPlan: lp, studentMaterials: sm } = lesson;

  const SECTIONS = [
    { id: 'flashcards', label: 'Флеш-карталар' },
    { id: 'keywords',   label: 'Кілт сөздер' },
    { id: 'thoughts',   label: 'Есте сақта' },
    { id: 'summary',    label: 'Қысқаша' },
    { id: 'homework',   label: 'Үй тапсырмасы' },
  ] as const;

  return (
    <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5 space-y-5">
      {/* Banner */}
      <div className="flex items-center gap-2">
        <Sparkles size={15} className="text-green-400" />
        <div>
          <p className="text-green-300 text-sm font-semibold">Жасалған тапсырма</p>
          <p className="text-white/40 text-xs">«{lp.topic}» тақырыбы бойынша · {lp.grade} сынып</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => { setSection(s.id); setCardIdx(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              section === s.id
                ? 'bg-green-500/25 text-green-300 border border-green-500/30'
                : 'bg-white/6 text-white/50 hover:bg-white/10 border border-white/8'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {/* Flashcards */}
          {section === 'flashcards' && sm.flashcards.length > 0 && (
            <div className="space-y-4">
              <p className="text-white/40 text-xs">Картаны басып аударыңыз → жауапты көресіз</p>
              <FlashCard
                front={sm.flashcards[cardIdx].front}
                back={sm.flashcards[cardIdx].back}
              />
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
              <div className="grid grid-cols-2 gap-2 mt-2">
                {sm.flashcards.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => setCardIdx(i)}
                    className={`text-left p-3 rounded-xl border text-xs transition-colors ${
                      i === cardIdx
                        ? 'border-green-500/40 bg-green-500/10 text-green-300'
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
            <div className="flex flex-wrap gap-2">
              {sm.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full bg-white/8 border border-white/10 text-white/80 text-sm hover:bg-green-500/15 hover:border-green-500/30 hover:text-green-300 transition-colors cursor-default"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Key thoughts */}
          {section === 'thoughts' && (
            <div className="space-y-3">
              {sm.keyThoughts.length > 0
                ? sm.keyThoughts.map((t, i) => (
                    <div key={i} className="bg-white/[0.03] border-l-2 border-green-500 rounded-r-xl pl-4 pr-4 py-3">
                      <p className="text-white/80 text-sm italic leading-relaxed">«{t}»</p>
                    </div>
                  ))
                : <p className="text-white/30 text-sm">Дәйексөздер жоқ.</p>
              }
            </div>
          )}

          {/* Summary */}
          {section === 'summary' && (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{sm.summary}</p>
            </div>
          )}

          {/* Homework */}
          {section === 'homework' && (
            <div className="space-y-3">
              <p className="text-white/50 text-xs mb-2">«{lp.topic}» тақырыбы бойынша үй тапсырмалары:</p>
              {[
                `«${lp.topic}» тақырыбын дәлелдейтін 3 дәйексөз немесе мысал табыңыз`,
                `${lp.topic} туралы 7–10 сөйлемнен тұратын шағын эссе жазыңыз`,
                `Тақырып бойынша 5 кілт сөз таңдап, әрқайсысына 1 сөйлеммен түсіндірме беріңіз`,
                `Достарыңызға «${lp.topic}» не екенін өз сөзіңізбен айтып беруге дайындалыңыз`,
              ].map((task, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/[0.03] border border-white/8 rounded-xl p-4">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-white/75 text-sm leading-relaxed">{task}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Static materials panel (original data) ────────────────────
function StaticMaterialsPanel({ analysis }: { analysis: Analysis }) {
  const [section, setSection] = useState('flashcards');
  const [cardIdx, setCardIdx] = useState(0);
  const sm = analysis.studentMaterials;

  if (!sm) return null;

  const SECTIONS = [
    { id: 'flashcards', label: 'Флеш-карталар' },
    { id: 'keywords',   label: 'Кілт сөздер' },
    { id: 'thoughts',   label: 'Есте сақта' },
    { id: 'summary',    label: 'Қысқаша' },
  ];

  return (
    <div className="space-y-5">
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
          {section === 'flashcards' && (
            <div className="space-y-4">
              <p className="text-white/40 text-xs">Картаны басып аударыңыз → жауапты көресіз</p>
              <FlashCard front={sm.flashcards[cardIdx].front} back={sm.flashcards[cardIdx].back} />
              <div className="flex items-center justify-between">
                <button onClick={() => setCardIdx(i => Math.max(0, i - 1))} disabled={cardIdx === 0}
                  className="p-2 rounded-xl bg-white/8 hover:bg-white/12 text-white/50 disabled:opacity-30 transition-colors">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <span className="text-white/30 text-sm">{cardIdx + 1} / {sm.flashcards.length}</span>
                <button onClick={() => setCardIdx(i => Math.min(sm.flashcards.length - 1, i + 1))} disabled={cardIdx === sm.flashcards.length - 1}
                  className="p-2 rounded-xl bg-white/8 hover:bg-white/12 text-white/50 disabled:opacity-30 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {sm.flashcards.map((card, i) => (
                  <button key={i} onClick={() => setCardIdx(i)}
                    className={`text-left p-3 rounded-xl border text-xs transition-colors ${
                      i === cardIdx
                        ? 'border-violet-500/40 bg-violet-500/10 text-violet-300'
                        : 'border-white/8 bg-white/[0.02] text-white/50 hover:bg-white/[0.04]'
                    }`}>
                    {card.front}
                  </button>
                ))}
              </div>
            </div>
          )}
          {section === 'keywords' && (
            <div>
              <p className="text-white/40 text-xs mb-4">Шығарманы оқу алдында немесе оқып болғаннан кейін меңгеріңіз</p>
              <div className="flex flex-wrap gap-2">
                {sm.keywords.map((kw, i) => (
                  <span key={i}
                    className="px-4 py-2 rounded-full bg-white/8 border border-white/10 text-white/80 text-sm hover:bg-violet-500/15 hover:border-violet-500/30 hover:text-violet-300 transition-colors cursor-default">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
          {section === 'thoughts' && (
            <div className="space-y-3">
              <p className="text-white/40 text-xs mb-4">Ең маңызды дәйексөздер</p>
              {sm.keyThoughts.map((thought, i) => (
                <div key={i} className="bg-white/[0.03] border-l-2 border-violet-500 rounded-r-xl pl-4 pr-4 py-3">
                  <p className="text-white/80 text-sm italic">«{thought}»</p>
                </div>
              ))}
            </div>
          )}
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

// ── Main component ────────────────────────────────────────────
export default function TabStudent({
  analysis,
  customLesson,
}: {
  analysis: Analysis;
  customLesson: GeneratedLesson | null;
}) {
  const hasStatic = !!analysis.studentMaterials;
  const hasGenerated = !!customLesson;

  if (!hasStatic && !hasGenerated) {
    return (
      <div className="text-center py-16 text-white/40">
        <BookMarked size={40} className="mx-auto mb-4 opacity-30" />
        <p>Оқушы материалдары қол жетімсіз.</p>
        <p className="text-white/30 text-xs mt-2">
          «Мұғалімге» бөліміне өтіп, тақырып жазып жоспар жасаңыз.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Generated task — shown at top when exists */}
      {hasGenerated && (
        <GeneratedTaskPanel lesson={customLesson!} />
      )}

      {/* Static materials */}
      {hasStatic && (
        <div>
          {hasGenerated && (
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-white/30 text-xs">Негізгі материалдар</span>
              <div className="h-px flex-1 bg-white/8" />
            </div>
          )}
          <StaticMaterialsPanel analysis={analysis} />
        </div>
      )}
    </div>
  );
}
