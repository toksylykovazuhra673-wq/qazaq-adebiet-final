import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Users, BookOpen, Edit3, Trash2, X, Check,
  GraduationCap, Calendar, ChevronRight,
} from 'lucide-react';
import type { ClassRecord, Student } from '@/types/teacher';

interface Props {
  classes: ClassRecord[];
  students: Student[];
  onAdd: (c: Omit<ClassRecord, 'id' | 'createdAt' | 'color'>) => void;
  onUpdate: (c: ClassRecord) => void;
  onDelete: (id: string) => void;
  onSelectClass: (id: string) => void;
}

const GRADES = [5, 6, 7, 8, 9, 10, 11];
const SUBJECTS = ['Қазақ Әдебиеті', 'Қазақ Тілі мен Әдебиеті', 'Орыс Әдебиеті', 'Дүниежүзі Әдебиеті'];

interface FormState { name: string; subject: string; grade: number; year: string }
const EMPTY: FormState = { name: '', subject: SUBJECTS[0], grade: 9, year: '2025-2026' };

function ClassCard({
  cls, studentCount, onEdit, onDelete, onSelect,
}: {
  cls: ClassRecord; studentCount: number;
  onEdit: () => void; onDelete: () => void; onSelect: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white/4 border border-white/8 rounded-2xl overflow-hidden
        hover:border-white/15 hover:bg-white/6 transition-all">
      <div className={`h-1.5 bg-gradient-to-r ${cls.color}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cls.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <GraduationCap size={20} className="text-white" />
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-white/8 text-gray-500 hover:text-white transition-all">
              <Edit3 size={13} />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/15 text-gray-500 hover:text-red-400 transition-all">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <h3 className="text-white font-bold text-base mb-0.5">{cls.name}</h3>
        <p className="text-gray-400 text-sm mb-3">{cls.subject}</p>

        <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
          <span className="flex items-center gap-1"><Users size={11} />{studentCount} оқушы</span>
          <span className="flex items-center gap-1"><Calendar size={11} />{cls.year}</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/6 text-gray-500">{cls.grade}-сынып</span>
        </div>

        <button
          onClick={onSelect}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium
            bg-gradient-to-r ${cls.color} text-white opacity-80 hover:opacity-100 transition-all`}>
          Сыныпты ашу <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

function ClassForm({
  initial, onSave, onClose, title,
}: { initial: FormState; onSave: (f: FormState) => void; onClose: () => void; title: string }) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof FormState, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-gray-900 border border-white/12 rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-5">{title}</h2>
        <div className="space-y-3">
          <div>
            <label className="text-gray-500 text-xs block mb-1">Сынып атауы</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="9-А сынып" className="input-field" />
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">Пән</label>
            <select value={form.subject} onChange={e => set('subject', e.target.value)} className="input-field">
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs block mb-1">Сынып</label>
              <select value={form.grade} onChange={e => set('grade', Number(e.target.value))} className="input-field">
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs block mb-1">Оқу жылы</label>
              <input value={form.year} onChange={e => set('year', e.target.value)}
                placeholder="2025-2026" className="input-field" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 btn-ghost">
            <X size={14} /> Болдырмау
          </button>
          <button
            onClick={() => form.name.trim() && onSave(form)}
            disabled={!form.name.trim()}
            className="flex-1 btn-primary">
            <Check size={14} /> Сақтау
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TchClasses({ classes, students, onAdd, onUpdate, onDelete, onSelectClass }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ClassRecord | null>(null);

  const save = (form: FormState) => {
    if (editing) {
      onUpdate({ ...editing, ...form });
      setEditing(null);
    } else {
      onAdd(form);
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Сыныптар</h2>
          <p className="text-gray-500 text-sm">{classes.length} сынып тіркелген</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={15} /> Сынып қосу
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-20 bg-white/3 border border-white/6 rounded-2xl">
          <GraduationCap size={48} className="mx-auto mb-4 text-gray-700" />
          <p className="text-gray-400 font-medium mb-2">Сынып жоқ</p>
          <p className="text-gray-600 text-sm mb-4">Алғашқы сыныпты қосыңыз</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex">
            <Plus size={14} /> Сынып қосу
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(cls => (
            <ClassCard
              key={cls.id}
              cls={cls}
              studentCount={students.filter(s => s.classId === cls.id).length}
              onEdit={() => setEditing(cls)}
              onDelete={() => { if (confirm(`«${cls.name}» сыныбын жойғыңыз келе ме?`)) onDelete(cls.id); }}
              onSelect={() => onSelectClass(cls.id)}
            />
          ))}
          <motion.button
            onClick={() => setShowForm(true)}
            className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center
              justify-center gap-3 text-gray-600 hover:text-gray-400 hover:border-white/20 transition-all">
            <Plus size={24} />
            <span className="text-sm">Сынып қосу</span>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {(showForm || editing) && (
          <ClassForm
            title={editing ? 'Сыныпты өзгерту' : 'Жаңа сынып'}
            initial={editing ? { name: editing.name, subject: editing.subject, grade: editing.grade, year: editing.year } : EMPTY}
            onSave={save}
            onClose={() => { setShowForm(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
