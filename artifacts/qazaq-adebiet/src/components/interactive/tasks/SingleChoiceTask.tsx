import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Task } from '@/types/task';

interface Props { task: Task; onSubmit: (correct: boolean) => void }

export default function SingleChoiceTask({ task, onSubmit }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = task.options as string[];
  const correct = task.correctAnswer as number;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    setTimeout(() => onSubmit(selected === correct), 900);
  };

  return (
    <div>
      <p className="text-white/80 text-base leading-relaxed mb-6">{task.question}</p>
      <div className="space-y-3">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = submitted && i === correct;
          const isWrong = submitted && isSelected && i !== correct;
          return (
            <motion.button
              key={i}
              whileHover={!submitted ? { scale: 1.01 } : {}}
              onClick={() => !submitted && setSelected(i)}
              className={`w-full text-left flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-200 ${
                isCorrect ? 'border-emerald-500/60 bg-emerald-500/15 text-white'
                : isWrong  ? 'border-red-500/60 bg-red-500/15 text-white'
                : isSelected ? 'border-violet-500/60 bg-violet-500/15 text-white'
                : 'border-white/10 bg-white/5 text-white/75 hover:border-white/25'
              }`}
            >
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                isCorrect ? 'bg-emerald-500 text-white'
                : isWrong  ? 'bg-red-500 text-white'
                : isSelected ? 'bg-violet-500 text-white'
                : 'bg-white/10 text-white/50'
              }`}>
                {isCorrect ? <CheckCircle size={16} /> : isWrong ? <XCircle size={16} /> : String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-sm leading-relaxed">{opt}</span>
            </motion.button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Жауап беру
        </button>
      )}
    </div>
  );
}
