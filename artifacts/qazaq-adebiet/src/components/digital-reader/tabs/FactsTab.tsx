import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { Book } from '@/types/book';

interface Props { book: Book; }

const ACCENT_COLORS = [
  'border-l-violet-500 bg-violet-500/5',
  'border-l-blue-500 bg-blue-500/5',
  'border-l-rose-500 bg-rose-500/5',
  'border-l-amber-500 bg-amber-500/5',
  'border-l-emerald-500 bg-emerald-500/5',
  'border-l-cyan-500 bg-cyan-500/5',
  'border-l-purple-500 bg-purple-500/5',
  'border-l-orange-500 bg-orange-500/5',
];

export default function FactsTab({ book }: Props) {
  if (book.facts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Sparkles size={40} className="text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">Қызықты деректер қосылмаған</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-amber-400" />
        <h2 className="text-white font-bold text-lg">Қызықты деректер</h2>
        <span className="text-gray-500 text-sm">· {book.facts.length} дерек</span>
      </div>

      <div className="space-y-3">
        {book.facts.map((fact, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`border-l-4 rounded-r-2xl pl-4 pr-5 py-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]}`}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/8 flex items-center justify-center text-gray-400 text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <p className="text-gray-300 text-sm leading-relaxed">{fact}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
