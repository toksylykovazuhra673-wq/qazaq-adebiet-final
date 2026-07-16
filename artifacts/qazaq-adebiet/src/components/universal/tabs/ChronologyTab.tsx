import { motion } from 'framer-motion';
import { Baby, GraduationCap, Briefcase, Star, BookOpen, Heart } from 'lucide-react';
import type { UniversalAuthor, TimelineEvent } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

const typeIcons: Record<string, React.ReactNode> = {
  birth:      <Baby size={14} />,
  death:      <Heart size={14} />,
  education:  <GraduationCap size={14} />,
  work:       <BookOpen size={14} />,
  event:      <Star size={14} />,
  award:      <Star size={14} />,
};
const typeColors: Record<string, string> = {
  birth:      'bg-green-500',
  death:      'bg-gray-500',
  education:  'bg-blue-500',
  work:       'bg-violet-500',
  event:      'bg-amber-500',
  award:      'bg-yellow-500',
};

interface Props { author: UniversalAuthor }

export default function ChronologyTab({ author }: Props) {
  const accent = CATEGORY_ACCENT[author.category];
  const events: TimelineEvent[] = author.timeline ?? [];

  if (!events.length) return <EmptyState />;

  return (
    <div>
      <h2 className={`text-lg font-semibold ${accent} mb-6`}>Өмір хронологиясы</h2>
      <div className="relative">
        {/* Spine */}
        <div className="absolute left-[31px] top-0 bottom-0 w-px bg-white/10" />

        <div className="space-y-6">
          {events.map((ev, i) => {
            const color = typeColors[ev.type ?? 'event'] ?? 'bg-violet-500';
            const icon = typeIcons[ev.type ?? 'event'];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4"
              >
                {/* Dot */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-full ${color} flex flex-col items-center justify-center shadow-lg z-10`}>
                  {icon}
                  <span className="text-white text-[10px] font-bold mt-0.5">{ev.year}</span>
                </div>
                {/* Card */}
                <div className="flex-1 bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 transition-colors">
                  <h3 className="text-white font-semibold text-sm mb-1">{ev.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{ev.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
      <p>Хронология деректері жоқ</p>
    </div>
  );
}
