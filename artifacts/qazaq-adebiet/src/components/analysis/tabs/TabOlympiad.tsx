import React, { useState } from 'react';
import { Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import type { Analysis, OlympiadQuestion } from '@/types/analysis';

const LEVELS = [
  { id: 'easy',       label: 'Жеңіл',         grade: '5–6 сынып',    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { id: 'medium',     label: 'Орта',           grade: '7–9 сынып',    color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'hard',       label: 'Күрделі',        grade: '10–11 сынып',  color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
  { id: 'republican', label: 'Республикалық', grade: '11 сынып',     color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20' },
];

function QuestionCard({ q, i }: { q: OlympiadQuestion; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 p-4 hover:bg-white/5 transition-colors text-left"
      >
        <span className="text-white/30 text-sm shrink-0">{i + 1}.</span>
        <p className="text-white/80 text-sm flex-1">{q.q}</p>
        {open ? <ChevronUp size={14} className="text-white/30 shrink-0 mt-0.5" /> : <ChevronDown size={14} className="text-white/30 shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-white/8">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1 mt-3">Үлгі жауап</p>
          <p className="text-emerald-300 text-sm leading-relaxed">{q.answer}</p>
          {q.hint && (
            <>
              <p className="text-white/30 text-xs mt-2 mb-1">Нұсқау</p>
              <p className="text-amber-300/70 text-xs">{q.hint}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function TabOlympiad({ analysis }: { analysis: Analysis }) {
  const [level, setLevel] = useState('easy');
  const olympiad = analysis.olympiad;

  if (!olympiad) {
    return (
      <div className="text-center py-16 text-white/40">
        <Trophy size={40} className="mx-auto mb-4 opacity-30" />
        <p>Олимпиада сұрақтары қол жетімсіз.</p>
      </div>
    );
  }

  const questions = olympiad[level as keyof typeof olympiad] ?? [];
  const current = LEVELS.find(l => l.id === level)!;

  return (
    <div className="space-y-6">
      {/* Level selector */}
      <div className="flex flex-wrap gap-2">
        {LEVELS.map(l => {
          const qs = olympiad[l.id as keyof typeof olympiad];
          if (!qs || qs.length === 0) return null;
          return (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                level === l.id ? `${l.bg} ${l.color}` : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/8'
              }`}
            >
              <Trophy size={13} />
              {l.label}
              <span className="text-xs opacity-60">({qs.length})</span>
            </button>
          );
        })}
      </div>

      {/* Header */}
      <div className={`rounded-2xl border p-4 ${current.bg}`}>
        <p className={`font-semibold ${current.color}`}>{current.label} деңгейі — {current.grade}</p>
        <p className="text-white/50 text-sm mt-0.5">{questions.length} сұрақ</p>
      </div>

      {/* Questions */}
      <div className="space-y-2">
        {questions.map((q, i) => (
          <QuestionCard key={i} q={q} i={i} />
        ))}
      </div>
    </div>
  );
}
