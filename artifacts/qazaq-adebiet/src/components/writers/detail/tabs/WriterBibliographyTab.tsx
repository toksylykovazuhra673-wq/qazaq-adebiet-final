import { motion } from 'framer-motion';
import { BookMarked, ExternalLink } from 'lucide-react';
import type { Writer, WriterBibliographyItem } from '@/types/writer';

const TYPE_ICONS: Record<string, string> = {
  book: '📕', article: '📄', dissertation: '🎓', online: '🌐', other: '📋',
};
const TYPE_LABELS: Record<string, string> = {
  book: 'Кітап', article: 'Мақала', dissertation: 'Диссертация', online: 'Онлайн', other: 'Басқа',
};
const TYPE_COLOR: Record<string, string> = {
  book: 'text-violet-300 bg-violet-500/12 border-violet-500/25',
  article: 'text-blue-300 bg-blue-500/12 border-blue-500/25',
  dissertation: 'text-amber-300 bg-amber-500/12 border-amber-500/25',
  online: 'text-emerald-300 bg-emerald-500/12 border-emerald-500/25',
  other: 'text-white/50 bg-white/6 border-white/12',
};

const FALLBACK_BIBLIOGRAPHY: WriterBibliographyItem[] = [
  { id: 1, title: 'Мұхтар Әуезов. Шығармалар жинағы (толық)', author: 'М. Әуезов', year: '1967', publisher: 'Жазушы баспасы', type: 'book' },
  { id: 2, title: 'Қазақ совет энциклопедиясы', year: '1980', publisher: 'ҚСЭ Бас редакциясы', type: 'book' },
  { id: 3, title: 'Қазақ әдебиетінің тарихы (6 томдық)', year: '1961', publisher: 'ҚазССР Ғылым академиясы', type: 'book' },
];

function BibItem({ item, index }: { item: WriterBibliographyItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-4 p-4 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/6 transition-colors"
    >
      <span className="text-2xl flex-shrink-0 mt-0.5">{TYPE_ICONS[item.type]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-white text-sm font-medium leading-snug">{item.title}</h4>
          <span className={`px-2 py-0.5 rounded-full border text-xs whitespace-nowrap flex-shrink-0 ${TYPE_COLOR[item.type]}`}>
            {TYPE_LABELS[item.type]}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-white/40 text-xs">
          {item.author && <span>{item.author}</span>}
          {item.year && <span>· {item.year}</span>}
          {item.publisher && <span>· {item.publisher}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export default function WriterBibliographyTab({ writer }: { writer: Writer }) {
  const items = (writer.bibliography && writer.bibliography.length > 0)
    ? writer.bibliography
    : FALLBACK_BIBLIOGRAPHY;

  const isArray = Array.isArray(items);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <BookMarked size={20} className="text-violet-400" />
        <h2 className="text-white text-xl font-bold">Пайдаланылған әдебиеттер</h2>
      </div>
      <p className="text-white/40 text-sm mb-6">
        {writer.shortName} туралы ғылыми және деректі басылымдар
      </p>

      <div className="space-y-2">
        {(items as WriterBibliographyItem[]).map((item, i) => (
          <BibItem key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
