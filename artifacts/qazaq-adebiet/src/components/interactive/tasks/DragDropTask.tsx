import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Task, DragDropOptions } from '@/types/task';

interface Props { task: Task; onSubmit: (correct: boolean) => void }

export default function DragDropTask({ task, onSubmit }: Props) {
  const opts = task.options as DragDropOptions;
  const [selected, setSelected] = useState<string | null>(null);
  const [placement, setPlacement] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const unplaced = opts.items.filter((item) => !Object.keys(placement).includes(item));

  const pickItem = (item: string) => {
    if (submitted) return;
    setSelected((prev) => (prev === item ? null : item));
  };

  const dropToBucket = (bucket: string) => {
    if (submitted || !selected) return;
    setPlacement((prev) => ({ ...prev, [selected]: bucket }));
    setSelected(null);
  };

  const removeFromBucket = (item: string) => {
    if (submitted) return;
    setPlacement((prev) => { const n = { ...prev }; delete n[item]; return n; });
  };

  const handleSubmit = () => {
    if (Object.keys(placement).length < opts.items.length) return;
    setSubmitted(true);
    const correct = opts.items.every((item) => placement[item] === opts.correctMapping[item]);
    setTimeout(() => onSubmit(correct), 900);
  };

  const itemsInBucket = (bucket: string) => Object.entries(placement).filter(([, b]) => b === bucket).map(([item]) => item);

  return (
    <div>
      <p className="text-white/80 text-base leading-relaxed mb-4">{task.question}</p>
      <p className="text-white/40 text-xs text-center mb-5">
        {selected ? `«${selected}» таңдалды — бір санатты басыңыз` : 'Элементті таңдап, санатқа қойыңыз'}
      </p>

      {/* unplaced items */}
      <div className="flex flex-wrap gap-2 mb-6 min-h-[48px] p-3 rounded-xl border border-dashed border-white/15 bg-white/3">
        {unplaced.length === 0 && (
          <span className="text-white/20 text-sm m-auto">Барлығы орналастырылды</span>
        )}
        {unplaced.map((item) => (
          <motion.button
            key={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => pickItem(item)}
            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
              selected === item
                ? 'border-violet-400 bg-violet-500/30 text-white shadow-lg shadow-violet-900/30'
                : 'border-white/20 bg-white/8 text-white/75 hover:border-white/40'
            }`}
          >
            {item}
          </motion.button>
        ))}
      </div>

      {/* buckets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {opts.buckets.map((bucket) => {
          const items = itemsInBucket(bucket);
          return (
            <div
              key={bucket}
              onClick={() => dropToBucket(bucket)}
              className={`min-h-[100px] rounded-xl border p-3 transition-all cursor-pointer ${
                selected
                  ? 'border-violet-400/50 bg-violet-500/10 hover:bg-violet-500/20'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 text-center">{bucket}</div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {items.map((item) => {
                  const correct = submitted && opts.correctMapping[item] === bucket;
                  const wrong = submitted && opts.correctMapping[item] !== bucket;
                  return (
                    <span
                      key={item}
                      onClick={(e) => { e.stopPropagation(); removeFromBucket(item); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                        submitted
                          ? correct ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                            : 'bg-red-500/20 border border-red-500/40 text-red-300'
                          : 'bg-white/10 border border-white/15 text-white/80 hover:bg-white/15 cursor-pointer'
                      }`}
                    >
                      {item}
                      {submitted && (correct ? <CheckCircle size={11} /> : <XCircle size={11} />)}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(placement).length < opts.items.length}
          className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold disabled:opacity-40 transition-all"
        >
          Тексеру ({Object.keys(placement).length}/{opts.items.length})
        </button>
      )}
    </div>
  );
}
