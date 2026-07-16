import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT, CATEGORY_COLORS } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function FactsTab({ author }: Props) {
  const accent = CATEGORY_ACCENT[author.category];
  const gradient = CATEGORY_COLORS[author.category];
  const facts = author.interestingFacts ?? [];

  if (!facts.length) return <EmptyState />;

  return (
    <div>
      <h2 className={`text-lg font-semibold ${accent} mb-6`}>Қызықты деректер ({facts.length})</h2>
      <div className="space-y-4">
        {facts.map((fact, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="flex gap-4 bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 transition-colors">
            {/* Number bubble */}
            <div className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} opacity-80 flex items-center justify-center text-white font-bold text-sm`}>
              {i + 1}
            </div>
            <p className="text-gray-200 text-sm leading-relaxed pt-1">{fact}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <Lightbulb size={40} className="mx-auto mb-3 opacity-30" />
      <p>Қызықты деректер жоқ</p>
    </div>
  );
}
