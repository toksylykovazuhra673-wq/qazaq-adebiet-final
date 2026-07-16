import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotebookPen, Plus, Trash2, Check, X, BookOpen, FileText, Headphones, Clock } from 'lucide-react';
import type { DrNote } from '@/types/book';

interface Props {
  notes: DrNote[];
  currentSource: 'text' | 'pdf' | 'audio';
  onAdd: (note: Omit<DrNote, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, content: string) => void;
  onRemove: (id: string) => void;
}

const SOURCE_META = {
  text:  { icon: <BookOpen  size={12} />, label: 'Мәтін', color: 'text-violet-400' },
  pdf:   { icon: <FileText  size={12} />, label: 'PDF',   color: 'text-blue-400'   },
  audio: { icon: <Headphones size={12} />, label: 'Аудио', color: 'text-rose-400'   },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('kk-KZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function NotesTab({ notes, currentSource, onAdd, onUpdate, onRemove }: Props) {
  const [draft, setDraft]     = useState('');
  const [editing, setEditing] = useState<{ id: string; content: string } | null>(null);

  const handleAdd = () => {
    if (!draft.trim()) return;
    onAdd({ source: currentSource, content: draft.trim() });
    setDraft('');
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    onUpdate(editing.id, editing.content);
    setEditing(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <NotebookPen size={18} className="text-emerald-400" />
        <h2 className="text-white font-bold text-lg">Жазбаларым</h2>
        <span className="text-gray-500 text-sm">· {notes.length}</span>
      </div>

      {/* New note input */}
      <div className="bg-white/4 border border-white/10 rounded-2xl p-4 mb-6 focus-within:border-white/20 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <span className={`flex items-center gap-1 text-xs ${SOURCE_META[currentSource].color}`}>
            {SOURCE_META[currentSource].icon}
            {SOURCE_META[currentSource].label} бойынша жазба
          </span>
        </div>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleAdd(); }}
          placeholder="Жазбаңызды енгізіңіз... (⌘+Enter — сақтау)"
          rows={3}
          className="w-full bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none resize-none leading-relaxed"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleAdd}
            disabled={!draft.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} />Қосу
          </button>
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="text-center py-10">
          <NotebookPen size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Жазба жоқ. Жоғарыдан жаңа жазба қосыңыз.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {notes.map((note, i) => {
              const meta = SOURCE_META[note.source];
              const isEditing = editing?.id === note.id;

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                  className="group bg-white/4 border border-white/8 rounded-2xl p-4 hover:bg-white/6 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`flex items-center gap-1 text-xs ${meta.color}`}>
                      {meta.icon}{meta.label}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!isEditing && (
                        <button
                          onClick={() => setEditing({ id: note.id, content: note.content })}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors text-xs"
                        >
                          Өзгерту
                        </button>
                      )}
                      <button
                        onClick={() => onRemove(note.id)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div>
                      <textarea
                        autoFocus
                        value={editing.content}
                        onChange={e => setEditing({ ...editing, content: e.target.value })}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                      />
                      <div className="flex gap-2 mt-2 justify-end">
                        <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg text-gray-500 hover:text-white">
                          <X size={14} />
                        </button>
                        <button onClick={handleSaveEdit} className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10">
                          <Check size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  )}

                  <p className="text-gray-600 text-xs flex items-center gap-1 mt-2">
                    <Clock size={9} />{fmtDate(note.createdAt)}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
