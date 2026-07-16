import { motion } from 'framer-motion';
import { Users, Star } from 'lucide-react';
import type { Book } from '@/types/book';

const AVATAR_COLORS = [
  'from-violet-600 to-purple-800',
  'from-blue-600 to-indigo-800',
  'from-rose-600 to-pink-800',
  'from-emerald-600 to-teal-800',
  'from-amber-500 to-orange-700',
  'from-cyan-600 to-blue-700',
];

interface Props { book: Book; }

export default function CharactersTab({ book }: Props) {
  if (book.characters.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Users size={40} className="text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">Кейіпкерлер тізімі қосылмаған</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {book.characters.map((char, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white/4 border border-white/8 rounded-2xl p-5 hover:bg-white/6 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg`}>
                {char.name.slice(0, 1)}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base leading-tight mb-0.5">{char.name}</h3>
                <p className="text-violet-400 text-xs font-medium mb-2">{char.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{char.description}</p>

                {char.traits && char.traits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {char.traits.map(trait => (
                      <span key={trait} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-gray-400 text-[11px]">
                        <Star size={9} className="text-yellow-500" />
                        {trait}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
