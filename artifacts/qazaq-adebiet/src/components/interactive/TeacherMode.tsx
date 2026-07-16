import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Download, Upload, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, TaskDraft } from '@/types/task';

interface Props {
  customTasks: Task[];
  onAdd: (t: TaskDraft) => void;
  onUpdate: (t: Task) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: (f: File) => void;
}

const BLANK_DRAFT: TaskDraft = {
  title: '', author: '', work: '', grade: '10', century: 'XX', topic: '', genre: '',
  type: 'single_choice', question: '', options: ['', '', '', ''], correctAnswer: 0,
  hint: '', explanation: '', difficulty: 'medium', timeLimit: 60, points: 10,
  image: null, audio: null, pdf: null, tags: [],
};

export default function TeacherMode({ customTasks, onAdd, onUpdate, onDelete, onExport, onImport }: Props) {
  const [editing, setEditing] = useState<Task | TaskDraft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openNew = () => { setEditing({ ...BLANK_DRAFT }); setIsNew(true); };
  const openEdit = (t: Task) => { setEditing({ ...t }); setIsNew(false); };
  const close = () => { setEditing(null); setIsNew(false); };

  const save = () => {
    if (!editing || !editing.title || !editing.question) return;
    if (isNew) {
      onAdd(editing as TaskDraft);
    } else {
      onUpdate(editing as Task);
    }
    close();
  };

  const patch = <K extends keyof TaskDraft>(key: K, val: TaskDraft[K]) =>
    setEditing((prev) => prev ? { ...prev, [key]: val } : prev);

  return (
    <div>
      {/* toolbar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all">
          <Plus size={16} /> Жаңа тапсырма
        </button>
        <button onClick={onExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm transition-all">
          <Download size={16} /> JSON экспорт
        </button>
        <button onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm transition-all">
          <Upload size={16} /> JSON импорт
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden"
          onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
      </div>

      {customTasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
          <p className="text-white/30 mb-2">Өзіңіздің тапсырмаларыңыз жоқ</p>
          <p className="text-white/20 text-sm">«Жаңа тапсырма» батырмасын басыңыз немесе JSON импорт жасаңыз</p>
        </div>
      )}

      <div className="space-y-3">
        {customTasks.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{t.title}</p>
              <p className="text-white/40 text-xs">{t.author} · {t.type} · {t.points} XP</p>
            </div>
            <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all">
              <Pencil size={15} />
            </button>
            <button onClick={() => onDelete(t.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-slate-900 p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-lg">{isNew ? 'Жаңа тапсырма' : 'Тапсырманы өңдеу'}</h3>
                <button onClick={close} className="p-2 rounded-xl hover:bg-white/10 text-white/50"><X size={18} /></button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Атауы *', key: 'title', type: 'text' },
                  { label: 'Автор', key: 'author', type: 'text' },
                  { label: 'Шығарма', key: 'work', type: 'text' },
                  { label: 'Тақырып', key: 'topic', type: 'text' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-white/50 text-xs mb-1 block">{f.label}</label>
                    <input
                      type={f.type}
                      value={(editing as Record<string, unknown>)[f.key] as string ?? ''}
                      onChange={(e) => patch(f.key as keyof TaskDraft, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-sm outline-none focus:border-violet-500/50"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="text-white/50 text-xs mb-1 block">Сұрақ *</label>
                  <textarea
                    value={editing.question}
                    onChange={(e) => patch('question', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-sm outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>

                <div>
                  <label className="text-white/50 text-xs mb-1 block">Сынып</label>
                  <select value={editing.grade} onChange={(e) => patch('grade', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-slate-800 text-white text-sm outline-none">
                    {['7','8','9','10','11','all'].map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-white/50 text-xs mb-1 block">Қиындық</label>
                  <select value={editing.difficulty} onChange={(e) => patch('difficulty', e.target.value as Task['difficulty'])}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-slate-800 text-white text-sm outline-none">
                    <option value="easy">Оңай</option>
                    <option value="medium">Орта</option>
                    <option value="hard">Қиын</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/50 text-xs mb-1 block">XP ұпай</label>
                  <input type="number" min={1} max={100} value={editing.points}
                    onChange={(e) => patch('points', +e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-sm outline-none" />
                </div>

                <div>
                  <label className="text-white/50 text-xs mb-1 block">Таймер (секунд, 0=шексіз)</label>
                  <input type="number" min={0} max={600} value={editing.timeLimit}
                    onChange={(e) => patch('timeLimit', +e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-sm outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-white/50 text-xs mb-1 block">Түсіндірме</label>
                  <textarea value={editing.explanation ?? ''} onChange={(e) => patch('explanation', e.target.value)}
                    rows={2} className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-sm outline-none resize-none" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={close} className="flex-1 py-3 rounded-2xl border border-white/15 bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-all">
                  Бас тарту
                </button>
                <button onClick={save}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all">
                  <Save size={16} /> Сақтау
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
