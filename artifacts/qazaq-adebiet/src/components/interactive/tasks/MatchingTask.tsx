import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Task, MatchingOptions } from '@/types/task';

interface Props { task: Task; onSubmit: (correct: boolean) => void }

export default function MatchingTask({ task, onSubmit }: Props) {
  const opts = task.options as MatchingOptions;
  const correctMap = task.correctAnswer as number[]; // right[i] → left[correctMap[i]]

  // userMap[leftIdx] = rightIdx the user chose
  const [userMap, setUserMap] = useState<Record<number, number>>({});
  const [activeLeft, setActiveLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectLeft = (i: number) => {
    if (submitted) return;
    setActiveLeft((prev) => (prev === i ? null : i));
  };

  const selectRight = (j: number) => {
    if (submitted || activeLeft === null) return;
    setUserMap((prev) => {
      const next = { ...prev };
      // remove any existing assignment to j
      Object.keys(next).forEach((k) => { if (next[+k] === j) delete next[+k]; });
      next[activeLeft] = j;
      return next;
    });
    setActiveLeft(null);
  };

  const handleSubmit = () => {
    if (Object.keys(userMap).length < opts.left.length) return;
    setSubmitted(true);

    // correctMap[rightIdx] = leftIdx
    const correct = opts.left.every((_, li) => {
      const ri = userMap[li];
      return correctMap[ri] === li;
    });
    setTimeout(() => onSubmit(correct), 900);
  };

  const getRightForLeft = (li: number) => userMap[li] ?? null;
  const isLeftCorrect = (li: number) => {
    if (!submitted) return null;
    const ri = userMap[li];
    return ri !== undefined && correctMap[ri] === li;
  };
  const getCorrectRightForLeft = (li: number) => {
    if (!submitted) return null;
    return correctMap.indexOf(li);
  };

  return (
    <div>
      <p className="text-white/80 text-base leading-relaxed mb-6">{task.question}</p>
      <p className="text-white/40 text-xs text-center mb-4">Сол жақтан таңдап, оң жақтан сәйкесін таңдаңыз</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-2">
          {opts.left.map((item, li) => {
            const corr = isLeftCorrect(li);
            return (
              <motion.button
                key={li}
                onClick={() => selectLeft(li)}
                whileHover={!submitted ? { scale: 1.02 } : {}}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  submitted
                    ? corr ? 'border-emerald-500/50 bg-emerald-500/15 text-white' : 'border-red-500/50 bg-red-500/15 text-white'
                    : activeLeft === li ? 'border-violet-500/60 bg-violet-500/20 text-white'
                    : userMap[li] !== undefined ? 'border-blue-500/40 bg-blue-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="leading-tight">{item}</span>
                  {submitted && (corr ? <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" /> : <XCircle size={14} className="text-red-400 flex-shrink-0" />)}
                </div>
                {submitted && !corr && (
                  <div className="text-emerald-400 text-xs mt-1">✓ {opts.right[getCorrectRightForLeft(li)!]}</div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {opts.right.map((item, ri) => {
            const usedByLeft = Object.entries(userMap).find(([, v]) => v === ri)?.[0];
            const isAssigned = usedByLeft !== undefined;
            return (
              <motion.button
                key={ri}
                onClick={() => selectRight(ri)}
                whileHover={!submitted ? { scale: 1.02 } : {}}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  submitted
                    ? 'border-white/10 bg-white/5 text-white/50 cursor-default'
                    : activeLeft !== null
                      ? 'border-violet-300/40 bg-violet-500/10 text-white cursor-pointer hover:border-violet-400/60'
                      : isAssigned ? 'border-blue-500/40 bg-blue-500/10 text-white' : 'border-white/10 bg-white/5 text-white/70'
                }`}
              >
                {item}
              </motion.button>
            );
          })}
        </div>
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(userMap).length < opts.left.length}
          className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold disabled:opacity-40 transition-all"
        >
          Тексеру
        </button>
      )}
    </div>
  );
}
