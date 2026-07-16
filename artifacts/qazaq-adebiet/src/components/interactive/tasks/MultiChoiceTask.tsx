import { useState } from 'react';
import { CheckCircle, XCircle, Square, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Task } from '@/types/task';

interface Props { task: Task; onSubmit: (correct: boolean) => void }

export default function MultiChoiceTask({ task, onSubmit }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const options = task.options as string[];
  const correctSet = new Set(task.correctAnswer as number[]);

  const toggle = (i: number) => {
    if (submitted) return;
    setSelected((prev) => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });
  };

  const handleSubmit = () => {
    if (selected.size === 0) return;
    setSubmitted(true);
    const isCorrect = selected.size === correctSet.size && [...selected].every((i) => correctSet.has(i));
    setTimeout(() => onSubmit(isCorrect), 900);
  };

  return (
    <div>
      <p className="text-white/80 text-sm mb-2 text-center italic">Бірнешеуін таңдауға болады</p>
      <p className="text-white/80 text-base leading-relaxed mb-6">{task.question}</p>
      <div className="space-y-3">
        {options.map((opt, i) => {
          const isSelected = selected.has(i);
          const isCorrect = submitted && correctSet.has(i);
          const isWrong = submitted && isSelected && !correctSet.has(i);
          const missed = submitted && !isSelected && correctSet.has(i);
          return (
            <motion.button key={i} whileHover={!submitted ? { scale: 1.01 } : {}}
              onClick={() => toggle(i)}
              className={`w-full text-left flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-200 ${
                isCorrect || missed ? 'border-emerald-500/60 bg-emerald-500/15'
                : isWrong ? 'border-red-500/60 bg-red-500/15'
                : isSelected ? 'border-violet-500/60 bg-violet-500/15'
                : 'border-white/10 bg-white/5 hover:border-white/25'
              }`}
            >
              <span className="text-white/60">
                {isSelected ? <CheckSquare size={18} className="text-violet-400" /> : <Square size={18} />}
              </span>
              <span className="flex-1 text-sm text-white/80 leading-relaxed">{opt}</span>
              {submitted && (isCorrect || missed) && <CheckCircle size={16} className="text-emerald-400" />}
              {isWrong && <XCircle size={16} className="text-red-400" />}
            </motion.button>
          );
        })}
      </div>
      {!submitted && (
        <button onClick={handleSubmit} disabled={selected.size === 0}
          className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold disabled:opacity-40 transition-all">
          Жауап беру
        </button>
      )}
    </div>
  );
}
