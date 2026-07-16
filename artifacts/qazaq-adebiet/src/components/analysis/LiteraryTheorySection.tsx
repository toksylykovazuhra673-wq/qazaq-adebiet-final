import { motion } from 'framer-motion';
import { BookMarked } from 'lucide-react';
import AccordionSection from './AccordionSection';
import type { LiteraryTheory } from '@/types/analysis';

const THEORY_ITEMS = (t: LiteraryTheory) => [
  { key: 'Тақырып', value: t.theme, icon: '📌' },
  { key: 'Идея', value: t.idea, icon: '💡' },
  { key: 'Образ', value: t.image, icon: '🎭' },
  { key: 'Портрет', value: t.portrait, icon: '👤' },
  { key: 'Пейзаж', value: t.landscape, icon: '🌄' },
  { key: 'Диалог', value: t.dialogue, icon: '💬' },
  { key: 'Монолог', value: t.monologue, icon: '🗣️' },
  { key: 'Психологизм', value: t.psychology, icon: '🧠' },
  { key: 'Авторлық баяндау', value: t.narration, icon: '✍️' },
];

interface Props {
  theory: LiteraryTheory;
}

export default function LiteraryTheorySection({ theory }: Props) {
  return (
    <AccordionSection
      id="literary-theory"
      title="Әдеби теория"
      icon={<BookMarked size={18} />}
      badge={9}
      accentColor="from-indigo-500 to-violet-600"
    >
      <div className="grid md:grid-cols-2 gap-4">
        {THEORY_ITEMS(theory).map((item, idx) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="rounded-xl border border-white/8 bg-white/5 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{item.icon}</span>
              <span className="text-white font-semibold text-sm">{item.key}</span>
            </div>
            <p className="text-white/65 text-sm leading-relaxed">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </AccordionSection>
  );
}
