import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, CheckCircle, XCircle } from 'lucide-react';
import type { Task } from '@/types/task';

interface Props { task: Task; onSubmit: (correct: boolean) => void }

export default function OrderingTask({ task, onSubmit }: Props) {
  const origOptions = task.options as string[];
  const correctOrder = task.correctAnswer as number[]; // correctOrder[position] = originalIndex

  // Start with shuffled order — store as originalIndex array
  const [order, setOrder] = useState<number[]>(() =>
    [...origOptions.keys()].sort(() => Math.random() - 0.5)
  );
  const [dragFrom, setDragFrom] = useState<number | null>(null); // index in `order`
  const [submitted, setSubmitted] = useState(false);

  const moveItem = (from: number, to: number) => {
    if (submitted) return;
    setOrder((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // correctOrder[position] = originalIndex → compare with our order array
    const isCorrect = order.every((origIdx, pos) => correctOrder[pos] === origIdx);
    setTimeout(() => onSubmit(isCorrect), 900);
  };

  const isCorrectAtPosition = (pos: number) => submitted && correctOrder[pos] === order[pos];

  return (
    <div>
      <p className="text-white/80 text-base leading-relaxed mb-6">{task.question}</p>
      <p className="text-white/40 text-xs text-center mb-4">↑ ↓ батырмалар арқылы ретін өзгертіңіз</p>

      <div className="space-y-2">
        <AnimatePresence>
          {order.map((origIdx, pos) => {
            const corr = isCorrectAtPosition(pos);
            const wrong = submitted && !corr;
            return (
              <motion.div
                key={origIdx}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${
                  submitted ? corr ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-red-500/40 bg-red-500/10'
                  : dragFrom === pos ? 'border-violet-500/60 bg-violet-500/15'
                  : 'border-white/10 bg-white/5'
                }`}
              >
                <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/50 text-xs font-bold flex-shrink-0">
                  {pos + 1}
                </span>
                <GripVertical size={14} className="text-white/20 flex-shrink-0" />
                <span className="flex-1 text-white/80 text-sm">{origOptions[origIdx]}</span>
                {!submitted && (
                  <div className="flex flex-col gap-1">
                    <button onClick={() => pos > 0 && moveItem(pos, pos - 1)}
                      disabled={pos === 0}
                      className="w-6 h-5 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20 text-xs">▲</button>
                    <button onClick={() => pos < order.length - 1 && moveItem(pos, pos + 1)}
                      disabled={pos === order.length - 1}
                      className="w-6 h-5 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20 text-xs">▼</button>
                  </div>
                )}
                {submitted && (corr ? <CheckCircle size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />)}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {submitted && (
        <div className="mt-4 p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10">
          <p className="text-emerald-300 text-sm font-semibold mb-1">Дұрыс рет:</p>
          <ol className="space-y-1">
            {correctOrder.map((origIdx, pos) => (
              <li key={pos} className="text-white/70 text-sm">{pos + 1}. {origOptions[origIdx]}</li>
            ))}
          </ol>
        </div>
      )}

      {!submitted && (
        <button onClick={handleSubmit}
          className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold transition-all">
          Тексеру
        </button>
      )}
    </div>
  );
}
