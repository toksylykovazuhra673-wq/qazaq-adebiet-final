import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import type { Writer } from '@/types/writer';

const FALLBACK_QUESTIONS = [
  { id: 1, question: 'Жазушы қай жылы туылған?', answer: '', difficulty: 'easy' as const },
  { id: 2, question: 'Жазушының ең атақты шығармасы қандай?', answer: '', difficulty: 'medium' as const },
  { id: 3, question: 'Жазушы қай ғасырда өмір сүрді?', answer: '', difficulty: 'easy' as const },
];

const DIFF_LABEL: Record<string, string> = { easy: 'Оңай', medium: 'Орта', hard: 'Қиын' };
const DIFF_COLOR: Record<string, string> = {
  easy: 'text-emerald-400 bg-emerald-500/12 border-emerald-500/25',
  medium: 'text-amber-400 bg-amber-500/12 border-amber-500/25',
  hard: 'text-rose-400 bg-rose-500/12 border-rose-500/25',
};

function QuestionCard({ q, index, writer }: { q: NonNullable<Writer['olympiadQuestions']>[number]; index: number; writer: Writer }) {
  const [showAnswer, setShowAnswer] = useState(false);

  // Fill in dynamic answers for fallback questions
  const answer = q.answer || (
    q.id === 1 ? writer.birthDate.split('-')[0] :
    q.id === 2 ? writer.works[0]?.title ?? '—' :
    q.id === 3 ? writer.era : '—'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-white/50 text-xs font-bold">{index + 1}</span>
            <span className={`px-2.5 py-0.5 rounded-full border text-xs font-medium ${DIFF_COLOR[q.difficulty]}`}>
              {DIFF_LABEL[q.difficulty]}
            </span>
          </div>
        </div>
        <p className="text-white text-sm font-medium leading-relaxed">{q.question}</p>
      </div>

      <div className="border-t border-white/6">
        <button
          onClick={() => setShowAnswer((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-white/45 hover:text-white/70 hover:bg-white/4 transition-all"
        >
          <span className="flex items-center gap-1.5">
            {showAnswer ? <EyeOff size={13} /> : <Eye size={13} />}
            {showAnswer ? 'Жауапты жасыру' : 'Жауапты көру'}
          </span>
          {showAnswer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 pt-1 border-t border-white/6 bg-emerald-500/6">
                <p className="text-emerald-300 text-sm font-medium leading-relaxed">✓ {answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function WriterOlympiadTab({ writer }: { writer: Writer }) {
  const questions = writer.olympiadQuestions ?? FALLBACK_QUESTIONS;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <Trophy size={22} className="text-amber-400" />
        <h2 className="text-white text-xl font-bold">Олимпиада сұрақтары</h2>
      </div>
      <p className="text-white/40 text-sm mb-6">{writer.shortName} туралы {questions.length} сұрақ</p>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} writer={writer} />
        ))}
      </div>
    </div>
  );
}
