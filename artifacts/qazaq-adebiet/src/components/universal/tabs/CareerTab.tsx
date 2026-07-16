import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function CareerTab({ author }: Props) {
  const accent = CATEGORY_ACCENT[author.category];
  const entries = author.career ?? [];

  if (!entries.length) return <EmptyState />;

  return (
    <div>
      <h2 className={`text-lg font-semibold ${accent} mb-6`}>Қызметтері</h2>

      {/* Table (md+) */}
      <div className="hidden md:block bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/8">
            <tr className="text-left text-gray-400 text-xs">
              <th className="px-5 py-3 font-medium">Қызметі</th>
              <th className="px-5 py-3 font-medium">Жылдары</th>
              <th className="px-5 py-3 font-medium">Орны</th>
              <th className="px-5 py-3 font-medium">Түсіндірме</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={e.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? '' : 'bg-white/2'}`}>
                <td className="px-5 py-3 text-white font-medium">{e.role}</td>
                <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                  <span className="flex items-center gap-1"><Calendar size={12} />{e.period}</span>
                </td>
                <td className="px-5 py-3 text-gray-300">
                  <span className="flex items-center gap-1"><MapPin size={12} />{e.place}</span>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs">{e.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden space-y-4">
        {entries.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white/3 border border-white/8 rounded-xl p-4"
          >
            <h3 className="text-white font-semibold text-sm mb-2">{e.role}</h3>
            <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-2">
              <span className="flex items-center gap-1"><Calendar size={11} />{e.period}</span>
              <span className="flex items-center gap-1"><MapPin size={11} />{e.place}</span>
            </div>
            {e.description && <p className="text-gray-400 text-xs">{e.description}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
      <p>Қызмет деректері жоқ</p>
    </div>
  );
}
