import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import AccordionSection from './AccordionSection';
import type { AnalysisCharacter } from '@/types/analysis';

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  main: { label: 'Басты', color: 'bg-violet-500/20 border-violet-500/30 text-violet-300' },
  secondary: { label: 'Қосалқы', color: 'bg-blue-500/20 border-blue-500/30 text-blue-300' },
  episodic: { label: 'Эпизодтық', color: 'bg-slate-500/20 border-slate-500/30 text-slate-300' },
};

const AVATAR_GRADIENTS = [
  'from-violet-600 to-purple-700',
  'from-blue-600 to-cyan-700',
  'from-emerald-600 to-teal-700',
  'from-amber-600 to-orange-700',
  'from-rose-600 to-pink-700',
  'from-indigo-600 to-blue-700',
];

interface Props {
  characters: AnalysisCharacter[];
}

export default function CharactersSection({ characters }: Props) {
  const grouped = {
    main: characters.filter((c) => c.type === 'main'),
    secondary: characters.filter((c) => c.type === 'secondary'),
    episodic: characters.filter((c) => c.type === 'episodic'),
  };

  return (
    <AccordionSection
      id="characters"
      title="Кейіпкерлер"
      icon={<Users size={18} />}
      badge={characters.length}
      accentColor="from-amber-500 to-orange-600"
    >
      <div className="space-y-6">
        {(['main', 'secondary', 'episodic'] as const).map((type) => {
          const group = grouped[type];
          if (!group.length) return null;
          const { label } = TYPE_LABELS[type];
          return (
            <div key={type}>
              <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3 font-medium">
                {label} кейіпкерлер
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {group.map((char, idx) => {
                  const gradient = AVATAR_GRADIENTS[characters.indexOf(char) % AVATAR_GRADIENTS.length];
                  const initials = char.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
                  const { color } = TYPE_LABELS[char.type];

                  return (
                    <motion.div
                      key={char.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      className="rounded-xl border border-white/8 bg-white/5 p-4"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg`}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-white font-semibold text-sm leading-tight">
                              {char.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full border text-xs ${color}`}>
                              {TYPE_LABELS[char.type].label}
                            </span>
                          </div>
                          <p className="text-white/40 text-xs">{char.role}</p>
                        </div>
                      </div>

                      <p className="text-white/65 text-sm leading-relaxed mb-3">
                        {char.description}
                      </p>

                      {/* traits */}
                      {char.traits.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {char.traits.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/55 text-xs"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* relations */}
                      {char.relations.length > 0 && (
                        <div className="border-t border-white/8 pt-3 space-y-1">
                          <p className="text-white/30 text-xs uppercase tracking-wider mb-2">
                            Байланыстары
                          </p>
                          {char.relations.map((r, ri) => (
                            <div key={ri} className="flex items-center gap-2 text-xs text-white/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                              <span className="text-white/70 font-medium">{r.characterId}</span>
                              <span>—</span>
                              <span>{r.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AccordionSection>
  );
}
