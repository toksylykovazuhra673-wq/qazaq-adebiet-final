import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, User, Trash2, X, Check, Search, Users,
  GraduationCap, Mail, ChevronDown,
} from 'lucide-react';
import type { Student, ClassRecord, GradeRecord } from '@/types/teacher';

interface Props {
  students: Student[];
  classes: ClassRecord[];
  grades: GradeRecord[];
  onAdd: (s: Omit<Student, 'id' | 'joinedAt'>) => void;
  onUpdate: (s: Student) => void;
  onDelete: (id: string) => void;
  selectedClassId?: string;
}

const AVATAR_COLORS = [
  'from-violet-500 to-purple-600', 'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600', 'from-orange-500 to-red-500',
  'from-rose-500 to-pink-600', 'from-amber-500 to-orange-500',
];

function avg(grades: GradeRecord[]) {
  if (!grades.length) return null;
  return Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length);
}

function ScorePill({ score }: { score: number | null }) {
  if (score === null) return <span className="text-gray-700 text-xs">—</span>;
  const cls = score >= 85 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' :
              score >= 65 ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' :
                            'bg-red-500/15 text-red-400 border-red-500/25';
  return (
    <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${cls}`}>
      {score}%
    </span>
  );
}

function AddStudentModal({
  classes, onSave, onClose,
}: { classes: ClassRecord[]; onSave: (s: Omit<Student, 'id' | 'joinedAt'>) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [email, setEmail] = useState('');

  const bulkNames = name.split('\n').map(n => n.trim()).filter(Boolean);

  const save = () => {
    if (!classId || bulkNames.length === 0) return;
    for (const n of bulkNames) onSave({ name: n, classId, email });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-gray-900 border border-white/12 rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-1">Оқушы қосу</h2>
        <p className="text-gray-500 text-xs mb-5">Бірнеше оқушыны қатарынан жол арқылы қосуға болады</p>

        <div className="space-y-3">
          <div>
            <label className="text-gray-500 text-xs block mb-1">Сынып</label>
            <select value={classId} onChange={e => setClassId(e.target.value)} className="input-field">
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">
              Аты-жөні <span className="text-gray-700">(бір жолда — бір оқушы)</span>
            </label>
            <textarea
              value={name} onChange={e => setName(e.target.value)} rows={5}
              placeholder="Айгерім Бекова&#10;Бекзат Нұрланов&#10;Дана Мәдиева"
              className="input-field resize-none" />
          </div>
          {bulkNames.length > 1 && (
            <p className="text-violet-400 text-xs">{bulkNames.length} оқушы қосылады</p>
          )}
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 btn-ghost"><X size={14} /> Болдырмау</button>
          <button onClick={save} disabled={!name.trim() || !classId} className="flex-1 btn-primary">
            <Check size={14} /> Қосу
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TchStudents({ students, classes, grades, onAdd, onUpdate, onDelete, selectedClassId }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]     = useState('');
  const [filterCls, setFilterCls] = useState(selectedClassId ?? 'all');

  const filtered = students.filter(s => {
    const matchCls = filterCls === 'all' || s.classId === filterCls;
    const matchQ   = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchCls && matchQ;
  });

  const clsMap = Object.fromEntries(classes.map(c => [c.id, c]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Оқушылар</h2>
          <p className="text-gray-500 text-sm">{students.length} оқушы тіркелген</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={15} /> Оқушы қосу
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Оқушы іздеу…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5
              text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50" />
        </div>
        <div className="relative">
          <select value={filterCls} onChange={e => setFilterCls(e.target.value)}
            className="input-field pr-8 appearance-none cursor-pointer min-w-[160px]">
            <option value="all">Барлық сыныптар</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white/3 border border-white/6 rounded-2xl">
          <Users size={36} className="mx-auto mb-3 text-gray-700" />
          <p className="text-gray-500 text-sm">Оқушы табылмады</p>
        </div>
      ) : (
        <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Оқушы
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                    Сынып
                  </th>
                  <th className="text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                    Орт. балл
                  </th>
                  <th className="text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                    Тапсырма
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((s, i) => {
                  const studentGrades = grades.filter(g => g.studentId === s.id);
                  const score = avg(studentGrades);
                  const cls = clsMap[s.classId];
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * i }}
                      className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]}
                            flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {s.name.slice(0, 1)}
                          </div>
                          <span className="text-white text-sm font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {cls && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg
                            bg-gradient-to-r ${cls.color} bg-opacity-15 text-xs text-gray-300`}>
                            {cls.name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <ScorePill score={score} />
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span className="text-gray-500 text-xs">{studentGrades.length} баға</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => { if (confirm(`«${s.name}» оқушысын жойғыңыз келе ме?`)) onDelete(s.id); }}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <AddStudentModal
            classes={classes}
            onSave={onAdd}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
