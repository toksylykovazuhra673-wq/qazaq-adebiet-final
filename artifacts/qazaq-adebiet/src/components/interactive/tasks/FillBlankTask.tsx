import { useState, useRef } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '@/types/task';

interface Props { task: Task; onSubmit: (correct: boolean) => void }

export default function FillBlankTask({ task, onSubmit }: Props) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accepted = Array.isArray(task.correctAnswer)
    ? (task.correctAnswer as string[]).map((s) => s.toLowerCase().trim())
    : [(task.correctAnswer as string).toLowerCase().trim()];

  const displayQuestion = task.question.replace('___', '______');

  const handleSubmit = () => {
    if (!value.trim()) return;
    const isCorrect = accepted.includes(value.toLowerCase().trim());
    setCorrect(isCorrect);
    setSubmitted(true);
    setTimeout(() => onSubmit(isCorrect), 1200);
  };

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
        <p className="text-white text-lg leading-relaxed font-medium italic text-center">
          «{displayQuestion}»
        </p>
      </div>

      <div className="max-w-xs mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => !submitted && setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !submitted && handleSubmit()}
          placeholder="Жауабыңызды жазыңыз..."
          disabled={submitted}
          className={`w-full text-center text-lg font-semibold px-5 py-4 rounded-2xl border bg-white/5 text-white placeholder:text-white/25 outline-none transition-all ${
            submitted
              ? correct ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-red-500/60 bg-red-500/10'
              : 'border-white/20 focus:border-violet-500/60'
          }`}
          autoFocus
        />

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 flex items-center justify-center gap-2 text-sm font-semibold ${correct ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {correct ? <CheckCircle size={16} /> : <XCircle size={16} />}
              {correct ? 'Дұрыс!' : `Дұрыс жауап: «${accepted[0]}»`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold disabled:opacity-40 transition-all"
        >
          Тексеру
        </button>
      )}
    </div>
  );
}
