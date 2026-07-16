import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import type { Writer, WriterTranslation } from '@/types/writer';

const LANG_FLAGS: Record<string, string> = {
  'орысша': '🇷🇺', 'ағылшынша': '🇬🇧', 'неміс тілінде': '🇩🇪',
  'француз тілінде': '🇫🇷', 'қытайша': '🇨🇳', 'түрікше': '🇹🇷', 'арабша': '🇸🇦',
};

function TranslationCard({ t, index }: { t: WriterTranslation; index: number }) {
  const flag = LANG_FLAGS[t.originalLanguage.toLowerCase()] ?? '🌐';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{flag}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-white font-semibold text-sm leading-snug">{t.title}</h4>
            <span className="text-white/35 text-xs whitespace-nowrap">{t.year}</span>
          </div>
          <p className="text-white/50 text-xs mb-1">{t.originalLanguage} · {t.author}</p>
          {t.description && <p className="text-white/45 text-sm leading-relaxed">{t.description}</p>}
        </div>
      </div>
    </motion.div>
  );
}

export default function WriterTranslationsTab({ writer }: { writer: Writer }) {
  const items = writer.translations ?? [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Globe size={40} className="text-white/15 mb-4" />
        <p className="text-white/30">Аудармалар туралы мәлімет толықтырылуда</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-white text-xl font-bold mb-2">Аудармалары</h2>
      <p className="text-white/35 text-sm mb-6">{items.length} аударма</p>
      <div className="space-y-3">
        {items.map((t, i) => <TranslationCard key={t.id} t={t} index={i} />)}
      </div>
    </div>
  );
}
