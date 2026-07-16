import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookOpen, FileText, Headphones, Trash2, Clock } from 'lucide-react';
import type { DrBookmark } from '@/types/book';

interface Props {
  bookmarks: DrBookmark[];
  onRemove: (id: string) => void;
  onNavigate: (bm: DrBookmark) => void;
}

const TYPE_META = {
  text:  { icon: <BookOpen  size={14} />, label: 'Мәтін', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  pdf:   { icon: <FileText  size={14} />, label: 'PDF',   color: 'text-blue-400   bg-blue-500/10   border-blue-500/20'   },
  audio: { icon: <Headphones size={14} />, label: 'Аудио', color: 'text-rose-400   bg-rose-500/10   border-rose-500/20'   },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('kk-KZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function BookmarksTab({ bookmarks, onRemove, onNavigate }: Props) {
  if (bookmarks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
          <Bookmark size={28} className="text-gray-600" />
        </div>
        <p className="text-white font-medium mb-1">Белгі жоқ</p>
        <p className="text-gray-500 text-sm">Мәтін, PDF немесе аудио оқыған кезде белгі қойыңыз</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark size={18} className="text-violet-400" />
        <h2 className="text-white font-bold text-lg">Белгілер</h2>
        <span className="text-gray-500 text-sm">· {bookmarks.length}</span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {bookmarks.map(bm => {
            const meta = TYPE_META[bm.type];
            return (
              <motion.div
                key={bm.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="group flex items-center gap-4 bg-white/4 border border-white/8 rounded-2xl px-4 py-3.5 hover:bg-white/6 transition-colors"
              >
                <button
                  onClick={() => onNavigate(bm)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium flex-shrink-0 ${meta.color}`}
                >
                  {meta.icon}{meta.label}
                </button>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onNavigate(bm)}>
                  <p className="text-white text-sm font-medium truncate">{bm.label}</p>
                  {bm.note && <p className="text-gray-400 text-xs truncate">{bm.note}</p>}
                  <p className="text-gray-600 text-xs flex items-center gap-1 mt-0.5">
                    <Clock size={10} />{fmtDate(bm.createdAt)}
                  </p>
                </div>

                <button
                  onClick={() => onRemove(bm.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
