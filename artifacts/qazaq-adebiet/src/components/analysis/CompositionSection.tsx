import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import AccordionSection from './AccordionSection';
import type { CompositionPart } from '@/types/analysis';

const STEP_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-violet-600',
];

interface Props {
  composition: CompositionPart[];
}

export default function CompositionSection({ composition }: Props) {
  return (
    <AccordionSection
      id="composition"
      title="Композициялық құрылыс"
      icon={<Layers size={18} />}
      badge={composition.length}
      accentColor="from-blue-500 to-cyan-600"
      defaultOpen
    >
      {/* timeline track */}
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent" />

        <div className="space-y-6">
          {composition.map((part, idx) => (
            <motion.div
              key={part.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="flex gap-4"
            >
              {/* step dot */}
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${STEP_COLORS[idx % STEP_COLORS.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 z-10 shadow-lg`}
              >
                {idx + 1}
              </div>

              <div className="flex-1 pb-2">
                <h3 className="text-white font-semibold mb-1">{part.nameKaz}</h3>
                <p className="text-white/65 text-sm leading-relaxed mb-3">{part.description}</p>

                {part.excerpt && (
                  <blockquote className="border-l-2 border-white/20 pl-3 text-white/50 text-sm italic leading-relaxed">
                    «{part.excerpt}»
                  </blockquote>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AccordionSection>
  );
}
