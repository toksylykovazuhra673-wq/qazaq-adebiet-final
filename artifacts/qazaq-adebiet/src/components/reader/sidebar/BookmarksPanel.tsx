import { motion } from 'framer-motion';
import { Heart, Trash2, BookOpen } from 'lucide-react';
import type { Bookmark } from '@/types/pdf-reader';

interface Props {
  bookmarks: Bookmark[];
  currentPage: number;
  onGoToPage: (page: number) => void;
  onRemove: (page: number) => void;
  onAdd: () => void;
}

export default function BookmarksPanel({ bookmarks, currentPage, onGoToPage, onRemove, onAdd }: Props) {
  const sorted = [...bookmarks].sort((a, b) => a.page - b.page);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Add bookmark button */}
      <div className="p-3 border-b border-white/8">
        <button
          onClick={onAdd}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-300 border border-red-500/20 text-xs font-medium transition-colors"
        >
          <Heart size={13} />
          Бет {currentPage}-ге бетбелгі қой
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sorted.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs">Бетбелгілер жоқ</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {sorted.map((bm) => (
              <motion.div
                key={bm.page}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer group transition-all
                  ${currentPage === bm.page ? 'bg-red-500/10 border border-red-500/20' : 'hover:bg-white/5 border border-transparent'}`}
              >
                <button
                  onClick={() => onGoToPage(bm.page)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left"
                >
                  <BookOpen size={13} className={currentPage === bm.page ? 'text-red-400' : 'text-gray-500'} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${currentPage === bm.page ? 'text-red-300' : 'text-gray-300'}`}>
                      {bm.label}
                    </p>
                    <p className="text-[10px] text-gray-500">Бет {bm.page}</p>
                  </div>
                </button>
                <button
                  onClick={() => onRemove(bm.page)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
