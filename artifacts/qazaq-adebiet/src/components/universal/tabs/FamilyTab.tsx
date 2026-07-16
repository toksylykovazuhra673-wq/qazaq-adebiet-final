import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT, CATEGORY_COLORS } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

const relationOrder = ['Атасы', 'Әкесі', 'Шешесі', 'Жұбайы', 'Ағасы', 'Інісі', 'Ұлы', 'Қызы', 'Туысы', 'Ұстазы'];

export default function FamilyTab({ author }: Props) {
  const accent = CATEGORY_ACCENT[author.category];
  const gradient = CATEGORY_COLORS[author.category];
  const members = author.family ?? [];

  if (!members.length) return <EmptyState />;

  const sorted = [...members].sort((a, b) => {
    const ai = relationOrder.indexOf(a.relation);
    const bi = relationOrder.indexOf(b.relation);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div>
      <h2 className={`text-lg font-semibold ${accent} mb-6`}>Отбасы ағашы</h2>

      {/* Author center node */}
      <div className="flex justify-center mb-8">
        <div className={`bg-gradient-to-br ${gradient} rounded-2xl px-6 py-4 text-center shadow-xl`}>
          <p className="text-white/60 text-xs mb-1">Негізгі тұлға</p>
          <p className="text-white font-bold text-base">{author.fullName}</p>
          <p className="text-white/70 text-xs">{author.birthDate} — {author.deathDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((m, i) => {
          const initials = m.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                  {initials}
                </div>
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/8 ${accent}`}>
                    {m.relation}
                  </span>
                </div>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{m.name}</h3>
              {m.years && <p className="text-gray-400 text-xs mb-2">{m.years}</p>}
              {m.description && <p className="text-gray-400 text-xs leading-relaxed">{m.description}</p>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <Users size={40} className="mx-auto mb-3 opacity-30" />
      <p>Отбасы деректері жоқ</p>
    </div>
  );
}
