import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import AccordionSection from './AccordionSection';

interface Props {
  facts: string[];
}

const FACT_COLORS = [
  'from-violet-500/20 to-purple-500/20 border-violet-500/20',
  'from-blue-500/20 to-cyan-500/20 border-blue-500/20',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/20',
  'from-amber-500/20 to-orange-500/20 border-amber-500/20',
  'from-rose-500/20 to-pink-500/20 border-rose-500/20',
  'from-indigo-500/20 to-violet-500/20 border-indigo-500/20',
  'from-cyan-500/20 to-blue-500/20 border-cyan-500/20',
  'from-teal-500/20 to-emerald-500/20 border-teal-500/20',
];

export default function FactsSection({ facts }: Props) {
  return (
    <AccordionSection
      id="facts"
      title="Қызықты деректер"
      icon={<Zap size={18} />}
      badge={facts.length}
      accentColor="from-yellow-500 to-amber-600"
    >
      <div className="grid md:grid-cols-2 gap-4">
        {facts.map((fact, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.06 }}
            className={`rounded-xl bg-gradient-to-br ${FACT_COLORS[idx % FACT_COLORS.length]} border p-4`}
          >
            <div className="flex gap-3 items-start">
              <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/70 text-xs font-bold flex-shrink-0">
                {idx + 1}
              </span>
              <p className="text-white/80 text-sm leading-relaxed">{fact}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </AccordionSection>
  );
}
