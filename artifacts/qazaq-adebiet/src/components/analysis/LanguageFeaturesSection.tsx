import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import AccordionSection from './AccordionSection';
import type { LanguageFeature } from '@/types/analysis';

const TYPE_COLORS: Record<string, string> = {
  Proverb:        'bg-amber-500/15 border-amber-500/25 text-amber-300',
  Phraseologism:  'bg-violet-500/15 border-violet-500/25 text-violet-300',
  'Archaic Word': 'bg-slate-500/15 border-slate-500/25 text-slate-300',
  Loanword:       'bg-blue-500/15 border-blue-500/25 text-blue-300',
  Term:           'bg-emerald-500/15 border-emerald-500/25 text-emerald-300',
};

interface Props {
  features: LanguageFeature[];
}

export default function LanguageFeaturesSection({ features }: Props) {
  return (
    <AccordionSection
      id="language"
      title="Тіл ерекшелігі"
      icon={<MessageSquare size={18} />}
      badge={features.reduce((s, f) => s + f.items.length, 0)}
      accentColor="from-teal-500 to-cyan-600"
    >
      <div className="space-y-6">
        {features.map((feat, fi) => {
          const colorClass = TYPE_COLORS[feat.type] ?? 'bg-white/10 border-white/20 text-white/70';

          return (
            <div key={feat.type}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full border text-xs font-medium ${colorClass}`}>
                  {feat.typeKaz}
                </span>
                <span className="text-white/30 text-xs">({feat.items.length})</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {feat.items.map((item, ii) => (
                  <motion.div
                    key={ii}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (fi * feat.items.length + ii) * 0.04 }}
                    className="rounded-xl border border-white/8 bg-white/5 p-3"
                  >
                    <p className="text-white font-medium text-sm mb-1 italic">«{item.text}»</p>
                    {item.explanation && (
                      <p className="text-white/50 text-xs leading-relaxed">{item.explanation}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AccordionSection>
  );
}
