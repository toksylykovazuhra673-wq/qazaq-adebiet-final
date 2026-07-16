import { motion } from 'framer-motion';
import { List, ChevronRight } from 'lucide-react';
import type { TocEntry } from '@/types/pdf-reader';

interface Props {
  toc: TocEntry[];
  currentPage: number;
  onGoToPage: (page: number) => void;
}

export default function TocPanel({ toc, currentPage, onGoToPage }: Props) {
  if (!toc?.length) {
    return (
      <div className="text-center py-10 text-gray-500 p-4">
        <List size={28} className="mx-auto mb-2 opacity-30" />
        <p className="text-xs">Мазмұны жоқ</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2">
      <div className="space-y-0.5">
        {toc.map((entry, i) => (
          <TocItem
            key={i}
            entry={entry}
            currentPage={currentPage}
            onGoToPage={onGoToPage}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}

function TocItem({
  entry, currentPage, onGoToPage, depth,
}: {
  entry: TocEntry;
  currentPage: number;
  onGoToPage: (p: number) => void;
  depth: number;
}) {
  const isActive = currentPage === entry.page;
  const hasChildren = entry.children && entry.children.length > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button
        onClick={() => onGoToPage(entry.page)}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        className={`w-full text-left flex items-center gap-1.5 py-2 pr-2 rounded-lg transition-all group text-xs
          ${isActive
            ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
      >
        {depth > 0 && <ChevronRight size={10} className="flex-shrink-0 opacity-40" />}
        <span className="flex-1 truncate">{entry.title}</span>
        <span className={`flex-shrink-0 text-[10px] ${isActive ? 'text-violet-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
          {entry.page}
        </span>
      </button>

      {hasChildren && entry.children!.map((child, j) => (
        <TocItem
          key={j}
          entry={child}
          currentPage={currentPage}
          onGoToPage={onGoToPage}
          depth={depth + 1}
        />
      ))}
    </motion.div>
  );
}
