import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Task } from '@/types/task';

interface Props { task: Task; onSubmit: (correct: boolean) => void }

export default function TrueFalseTask({ task, onSubmit }: Props) {
  const [selected, setSelected] = useState<0 | 1 | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = task.correctAnswer as number; // 0=Дұрыс, 1=Бұрыс

  const choose = (v: 0 | 1) => {
    if (submitted) return;
    setSelected(v);
    setSubmitted(true);
    setTimeout(() => onSubmit(v === correct), 800);
  };

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8 text-center">
        <p className="text-white text-lg font-medium leading-relaxed">{task.question}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { val: 0 as const, label: '✅ Дұрыс', base: 'from-emerald-600 to-teal-600', hover: 'hover:from-emerald-500 hover:to-teal-500' },
          { val: 1 as const, label: '❌ Бұрыс', base: 'from-rose-600 to-red-600', hover: 'hover:from-rose-500 hover:to-red-500' },
        ].map((btn) => {
          const isSelected = selected === btn.val;
          const isCorrect = submitted && btn.val === correct;
          const isWrong = submitted && isSelected && btn.val !== correct;
          return (
            <motion.button
              key={btn.val}
              whileHover={!submitted ? { scale: 1.03 } : {}}
              whileTap={!submitted ? { scale: 0.97 } : {}}
              onClick={() => choose(btn.val)}
              className={`py-8 rounded-2xl font-bold text-xl text-white transition-all shadow-lg bg-gradient-to-br ${btn.base} ${!submitted ? btn.hover : ''} ${submitted && !isSelected ? 'opacity-40' : ''}`}
            >
              {btn.label}
              {isCorrect && <div className="mt-2"><CheckCircle size={20} className="mx-auto" /></div>}
              {isWrong  && <div className="mt-2"><XCircle size={20} className="mx-auto" /></div>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
