import { motion } from 'framer-motion';
import { FileType, Download, ZoomIn, Printer } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function PdfTab({ author }: Props) {
  const accent = CATEGORY_ACCENT[author.category];
  const items = author.pdf ?? [];

  if (!items.length) return <EmptyState />;

  return (
    <div>
      <h2 className={`text-lg font-semibold ${accent} mb-6`}>PDF құжаттары ({items.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((pdf, i) => (
          <motion.div key={pdf.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 transition-all">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <FileType size={22} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{pdf.title}</h3>
                {pdf.year && <p className="text-gray-500 text-xs">{pdf.year}</p>}
                {pdf.pages && <p className="text-gray-400 text-xs">{pdf.pages} бет</p>}
              </div>
            </div>
            {pdf.description && <p className="text-gray-400 text-xs leading-relaxed mb-3">{pdf.description}</p>}
            <div className="flex gap-2">
              {pdf.url ? (
                <>
                  <a href={pdf.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 transition-colors">
                    <ZoomIn size={11} />Ашу
                  </a>
                  <a href={pdf.url} download
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors">
                    <Download size={11} />Жүктеу
                  </a>
                  <button onClick={() => window.print()}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-300 transition-colors">
                    <Printer size={11} />Басып шығару
                  </button>
                </>
              ) : (
                <span className="text-xs text-gray-500 italic">PDF қолжетімді емес</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <FileType size={40} className="mx-auto mb-3 opacity-30" />
      <p>PDF деректері жоқ</p>
    </div>
  );
}
