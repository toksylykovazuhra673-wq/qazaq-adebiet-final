import { useState } from 'react';
import { motion } from 'framer-motion';
import { StickyNote, Check, Trash2 } from 'lucide-react';
import type { PageNote } from '@/types/pdf-reader';

interface Props {
  notes: PageNote[];
  currentPage: number;
  onSave: (page: number, text: string) => void;
  onGoToPage: (page: number) => void;
}

export default function NotesPanel({ notes, currentPage, onSave, onGoToPage }: Props) {
  const currentNote = notes.find(n => n.page === currentPage)?.text ?? '';
  const [draft, setDraft] = useState(currentNote);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(currentPage, draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleDelete = () => {
    setDraft('');
    onSave(currentPage, '');
  };

  const otherNotes = notes.filter(n => n.page !== currentPage).sort((a, b) => a.page - b.page);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Current page note editor */}
      <div className="p-3 border-b border-white/8">
        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
          <StickyNote size={12} />Бет {currentPage} — жазба
        </p>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Осы бетке жазба қалдырыңыз..."
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-white/20 resize-none"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 text-xs transition-colors border border-violet-500/20"
          >
            <Check size={11} />
            {saved ? 'Сақталды!' : 'Сақтау'}
          </button>
          {draft && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
            >
              <Trash2 size={11} />Жою
            </button>
          )}
        </div>
      </div>

      {/* Other notes */}
      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-[10px] text-gray-600 uppercase tracking-wider px-2 mb-2">Барлық жазбалар</p>
        {otherNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <StickyNote size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs">Жазбалар жоқ</p>
          </div>
        ) : (
          <div className="space-y-2">
            {otherNotes.map(note => (
              <motion.button
                key={note.page}
                onClick={() => onGoToPage(note.page)}
                className="w-full text-left p-2.5 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 transition-colors"
              >
                <p className="text-[10px] text-gray-500 mb-1">Бет {note.page}</p>
                <p className="text-xs text-gray-300 line-clamp-2">{note.text}</p>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
