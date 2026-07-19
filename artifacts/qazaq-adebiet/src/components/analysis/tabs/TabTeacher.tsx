import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Presentation, BookOpen, CheckSquare, BarChart2,
  Download, Sparkles, Loader2, ChevronRight, GraduationCap,
} from 'lucide-react';
import type { Analysis } from '@/types/analysis';
import type { GeneratedLesson } from '@/utils/lessonPlanGenerator';
import { generateLesson } from '@/utils/lessonPlanGenerator';

interface Props {
  analysis: Analysis;
  customLesson: GeneratedLesson | null;
  onGenerate: (lesson: GeneratedLesson) => void;
  onGoToStudent: () => void;
}

// ── Suggestions for topic input ──────────────────────────────
function topicSuggestions(analysis: Analysis): string[] {
  return [
    `${analysis.author} шығармашылығы`,
    `«${analysis.title}» шығармасының идеясы`,
    `${analysis.genre} жанрының ерекшеліктері`,
    `${analysis.author} өмірі мен шығармалары`,
    `${analysis.theme.split(',')[0].trim()} тақырыбы`,
  ];
}

// ── Download helper ───────────────────────────────────────────
function downloadPlan(lesson: GeneratedLesson, workSlug: string) {
  const lp = lesson.lessonPlan;
  const lines = [
    `ҚМЖ — ${lp.topic}`,
    `Пән: ${lp.subject} · ${lp.grade} сынып · ${lp.duration}`,
    '', '=== МАҚСАТТАР ===',
    ...lp.objectives.map((o, i) => `${i + 1}. ${o}`),
    '', '=== САБАҚ БАРЫСЫ ===',
    ...lp.activities.map(a => `${a.step}. ${a.name}\n   ${a.description}`),
    '', '=== БАҒАЛАУ ===', lp.assessment,
    '', '=== ДЕСКРИПТОРЛАР ===',
    ...lp.descriptors.map((d, i) => `${i + 1}. ${d}`),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'), { href: url, download: `sabaq-${workSlug}.txt` }).click();
  URL.revokeObjectURL(url);
}

// ── Plan view (shared for both static & generated) ────────────
function PlanView({
  lesson,
  workSlug,
  onGoToStudent,
}: {
  lesson: GeneratedLesson;
  workSlug: string;
  onGoToStudent: () => void;
}) {
  const [section, setSection] = useState('plan');
  const lp = lesson.lessonPlan;

  const SECTIONS = [
    { id: 'plan',   label: 'Сабақ жоспары', icon: <BookOpen size={13} /> },
    { id: 'assess', label: 'Бағалау',         icon: <CheckSquare size={13} /> },
    { id: 'rubric', label: 'Рубрика',          icon: <BarChart2 size={13} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white text-xl font-bold">{lp.topic}</h2>
          <p className="text-white/50 text-sm">{lp.subject} · {lp.grade} сынып · {lp.duration}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onGoToStudent}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/30 text-sm font-medium transition-colors"
          >
            <GraduationCap size={14} /> Оқушы тапсырмасы
          </button>
          <button
            onClick={() => downloadPlan(lesson, workSlug)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 text-sm font-medium transition-colors"
          >
            <Download size={14} /> Жүктеу
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 flex-wrap">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              section === s.id
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/8 border border-white/8'
            }`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Lesson Plan */}
      {section === 'plan' && (
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Оқу мақсаттары</p>
            <ul className="space-y-2">
              {lp.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                  <span className="text-green-400 shrink-0">✦</span> {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Сабақ барысы</p>
            <div className="space-y-3">
              {lp.activities.map(a => (
                <div key={a.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                    <span className="text-green-400 text-xs font-bold">{a.step}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{a.name}</p>
                    <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assessment */}
      {section === 'assess' && (
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Бағалау критерийі</p>
            <p className="text-white/80 text-sm leading-relaxed">{lp.assessment}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Дескрипторлар</p>
            <ul className="space-y-2">
              {lp.descriptors.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                  <span className="text-amber-400 shrink-0">D{i + 1}</span> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Rubric */}
      {section === 'rubric' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left p-3 text-white/50 font-medium">Критерий</th>
                {['4', '3', '2', '1'].map(n => (
                  <th key={n} className="text-center p-3 text-white/50 font-medium w-32">{n} ұпай</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {lp.rubric.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="p-3 text-white font-medium">{row.criterion}</td>
                  {(['4', '3', '2', '1'] as const).map(n => (
                    <td key={n} className="p-3 text-white/60 text-xs text-center">{row[n]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function TabTeacher({ analysis, customLesson, onGenerate, onGoToStudent }: Props) {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState<'input' | 'generated' | 'static'>(() =>
    analysis.lessonPlan ? 'static' : 'input'
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = topicSuggestions(analysis);

  const handleGenerate = () => {
    const trimmed = topic.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    setGenerating(true);
    // Simulate brief generation delay for UX
    setTimeout(() => {
      const lesson = generateLesson(trimmed, analysis);
      onGenerate(lesson);
      setMode('generated');
      setGenerating(false);
    }, 600);
  };

  const handleSuggestion = (s: string) => {
    setTopic(s);
    inputRef.current?.focus();
  };

  const activeLesson: GeneratedLesson | null =
    mode === 'generated'
      ? customLesson
      : mode === 'static' && analysis.lessonPlan
      ? {
          lessonPlan: analysis.lessonPlan,
          studentMaterials: analysis.studentMaterials ?? {
            summary: analysis.summary ?? '',
            keywords: (analysis.keyWords ?? []).slice(0, 8).map(w => w.word),
            flashcards: [],
            keyThoughts: [],
          },
        }
      : null;

  return (
    <div className="space-y-6">

      {/* ── Topic generator panel ─────────────────────────────── */}
      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-green-400" />
          <h3 className="text-white font-semibold text-sm">Сабақ жоспарын автоматты жасау</h3>
        </div>

        {/* Input row */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="Тақырып жазыңыз… мысалы: Абайдың ақындығы"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/8 border border-white/12 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all"
          />
          <button
            onClick={handleGenerate}
            disabled={generating || !topic.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
          >
            {generating
              ? <><Loader2 size={14} className="animate-spin" /> Жасалуда…</>
              : <><Sparkles size={14} /> Жасау</>
            }
          </button>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-white/30 text-xs self-center">Мысалдар:</span>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/55 hover:text-white hover:bg-white/10 text-xs transition-colors"
            >
              {s} <ChevronRight size={10} />
            </button>
          ))}
        </div>

        {/* Mode switcher if static plan also exists */}
        {analysis.lessonPlan && customLesson && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-white/8">
            <button
              onClick={() => setMode('static')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                mode === 'static'
                  ? 'bg-white/15 text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/8'
              }`}
            >
              Негізгі жоспар
            </button>
            <button
              onClick={() => setMode('generated')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                mode === 'generated'
                  ? 'bg-green-500/20 text-green-300'
                  : 'text-white/40 hover:text-white hover:bg-white/8'
              }`}
            >
              <Sparkles size={10} /> Жасалған жоспар
            </button>
          </div>
        )}
      </div>

      {/* ── Plan display ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeLesson ? (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <PlanView
              lesson={activeLesson}
              workSlug={analysis.workSlug}
              onGoToStudent={onGoToStudent}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-white/30"
          >
            <Presentation size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Жоғарыдан тақырып жазып, «Жасау» батырмасын басыңыз</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
