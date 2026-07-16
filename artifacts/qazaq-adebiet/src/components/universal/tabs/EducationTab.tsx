import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function EducationTab({ author }: Props) {
  const accent = CATEGORY_ACCENT[author.category];
  const entries = author.education ?? [];

  if (!entries.length) return <EmptyState />;

  return (
    <div>
      <h2 className={`text-lg font-semibold ${accent} mb-6`}>Білімі</h2>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-5">
          {entries.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center z-10">
                <GraduationCap size={16} className="text-blue-400" />
              </div>
              <div className="flex-1 bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 transition-colors">
                <h3 className="text-white font-semibold text-sm mb-1">{e.institution}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1"><Calendar size={11} />{e.period}</span>
                  {e.city && <span className="flex items-center gap-1"><MapPin size={11} />{e.city}</span>}
                </div>
                <p className="text-blue-300 text-xs font-medium mb-1">{e.subject}</p>
                {e.description && <p className="text-gray-400 text-xs leading-relaxed">{e.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
      <p>Білім деректері жоқ</p>
    </div>
  );
}
