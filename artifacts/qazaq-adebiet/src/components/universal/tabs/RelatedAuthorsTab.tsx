import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { UserCheck, ArrowRight } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { useRelatedUniversalAuthors, CATEGORY_COLORS, CATEGORY_BADGE } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function RelatedAuthorsTab({ author }: Props) {
  const [, navigate] = useLocation();
  const related = useRelatedUniversalAuthors(author);

  if (!related.length) return <EmptyState />;

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6">Ұқсас авторлар</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((a, i) => {
          const gradient = CATEGORY_COLORS[a.category];
          const badge = CATEGORY_BADGE[a.category];
          const initials = a.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
          return (
            <motion.button key={a.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => navigate(`/authors/${a.category}/${a.slug}`)}
              className="group bg-white/3 border border-white/8 rounded-2xl p-5 hover:bg-white/7 hover:border-white/15 transition-all text-left">
              {/* Portrait */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 mx-auto">
                {a.photo ? (
                  <img src={a.photo} alt={a.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <span className="text-xl font-bold text-white">{initials}</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge}`}>{a.categoryLabel}</span>
                <h3 className="text-white font-semibold text-sm mt-2 mb-1 group-hover:text-white transition-colors">{a.fullName}</h3>
                <p className="text-gray-500 text-xs">{a.birthDate} — {a.deathDate}</p>
              </div>
              <div className="flex justify-center mt-3">
                <span className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                  Толығырақ <ArrowRight size={11} />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <UserCheck size={40} className="mx-auto mb-3 opacity-30" />
      <p>Ұқсас авторлар табылмады</p>
    </div>
  );
}
