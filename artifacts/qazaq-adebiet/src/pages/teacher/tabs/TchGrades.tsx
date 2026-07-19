import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Check, X, Trash2, ChevronDown, Star,
  TrendingUp, Award, BookOpen,
} from 'lucide-react';
import type { GradeRecord, Student, ClassRecord, Assignment, GradeType } from '@/types/teacher';

interface Props {
  grades: GradeRecord[];
  students: Student[];
  classes: ClassRecord[];
  assignments: Assignment[];
  onAdd: (g: Omit<GradeRecord, 'id' | 'gradedAt'>) => void;
  onUpdate: (g: GradeRecord) => void;
  onDelete: (id: string) => void;
}

const GRADE_TYPES: GradeType[] = ['БЖБ', 'ТЖБ', 'ҚМЖ', 'Тест', 'Жоба', 'Реферат'];

const GRADE_TYPE_COLORS: Record<GradeType, string> = {
  'БЖБ':     'bg-violet-500/15 border-violet-500/25 text-violet-400',
  'ТЖБ':     'bg-blue-500/15 border-blue-500/25 text-blue-400',
  'ҚМЖ':     'bg-emerald-500/15 border-emerald-500/25 text-emerald-400',
  'Тест':    'bg-amber-500/15 border-amber-500/25 text-amber-400',
  'Жоба':    'bg-rose-500/15 border-rose-500/25 text-rose-400',
  'Реферат': 'bg-cyan-500/15 border-cyan-500/25 text-cyan-400',
};

function scoreColor(score: number) {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 65) return 'text-amber-400';
  return 'text-red-400';
}

function GradeModal({
  students, assignments, classes, onSave, onClose,
}: {
  students: Student[]; assignments: Assignment[]; classes: ClassRecord[];
  onSave: (g: Omit<GradeRecord, 'id' | 'gradedAt'>) => void; onClose: () => void;
}) {
  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [studentId, setStudentId] = useState('');
  const [assignmentId, setAssignmentId] = useState('');
  const [gradeType, setGradeType] = useState<GradeType>('Тест');
  const [score, setScore] = useState(80);
  const [points, setPoints] = useState(0);
  const [comment, setComment] = useState('');

  const clsStudents = students.filter(s => s.classId === classId);
  const clsAssignments = assignments.filter(a => a.classId === classId);

  const save = () => {
    if (!studentId || !assignmentId) return;
    onSave({ studentId, classId, assignmentId, gradeType, score, points, comment: comment || undefined });
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
        <h2 className="text-white font-bold text-lg mb-5">Баға қою</h2>
        <div className="space-y-3">
          <div>
            <label className="text-gray-500 text-xs block mb-1">Сынып</label>
            <select value={classId} onChange={e => { setClassId(e.target.value); setStudentId(''); setAssignmentId(''); }} className="input-field">
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">Оқушы</label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} className="input-field">
              <option value="">— Таңдаңыз —</option>
              {clsStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">Тапсырма</label>
            <select value={assignmentId} onChange={e => {
              setAssignmentId(e.target.value);
              const a = assignments.find(x => x.id === e.target.value);
              if (a) { setPoints(a.points); }
            }} className="input-field">
              <option value="">— Таңдаңыз —</option>
              {clsAssignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1.5">Баға түрі</label>
            <div className="flex flex-wrap gap-2">
              {GRADE_TYPES.map(t => (
                <button key={t} onClick={() => setGradeType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    gradeType === t
                      ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                      : 'bg-white/4 border-white/8 text-gray-500 hover:text-gray-300'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs block mb-1">Балл (%)</label>
              <input type="number" value={score} onChange={e => setScore(Number(e.target.value))}
                min={0} max={100} className="input-field" />
            </div>
            <div>
              <label className="text-gray-500 text-xs block mb-1">Ұпай</label>
              <input type="number" value={points} onChange={e => setPoints(Number(e.target.value))}
                min={0} className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">Пікір (міндетті емес)</label>
            <input value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Жақсы жұмыс!" className="input-field" />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 btn-ghost"><X size={14} /> Болдырмау</button>
          <button onClick={save} disabled={!studentId || !assignmentId} className="flex-1 btn-primary">
            <Check size={14} /> Қою
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TchGrades({ grades, students, classes, assignments, onAdd, onUpdate, onDelete }: Props) {
  const [showForm, setShowForm]   = useState(false);
  const [filterCls, setFilterCls] = useState('all');
  const [filterType, setFilterType] = useState<GradeType | 'all'>('all');

  const stuMap = Object.fromEntries(students.map(s => [s.id, s]));
  const asnMap = Object.fromEntries(assignments.map(a => [a.id, a]));
  const clsMap = Object.fromEntries(classes.map(c => [c.id, c]));

  const filtered = grades.filter(g => {
    const cls  = filterCls  === 'all' || g.classId   === filterCls;
    const type = filterType === 'all' || g.gradeType === filterType;
    return cls && type;
  }).sort((a, b) => b.gradedAt - a.gradedAt);

  // Stats
  const avg = grades.length
    ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length)
    : 0;
  const passed = grades.filter(g => g.score >= 70).length;
  const byType = GRADE_TYPES.reduce((acc, t) => {
    const tg = grades.filter(g => g.gradeType === t);
    if (tg.length) acc[t] = Math.round(tg.reduce((s, g) => s + g.score, 0) / tg.length);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white font-bold text-lg">Бағалар журналы</h2>
          <p className="text-gray-500 text-sm">{grades.length} баға қойылған</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={15} /> Баға қою
        </button>
      </div>

      {/* Stats row */}
      {grades.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Орт. балл', value: `${avg}%`, Icon: TrendingUp, color: avg >= 70 ? 'text-emerald-400' : 'text-amber-400' },
            { label: 'Өткен (≥70%)', value: passed, Icon: Check, color: 'text-emerald-400' },
            { label: 'Жалпы баға', value: grades.length, Icon: Star, color: 'text-violet-400' },
            { label: 'БЖБ орт.', value: byType['БЖБ'] ? `${byType['БЖБ']}%` : '—', Icon: Award, color: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/4 border border-white/8 rounded-2xl p-4 text-center">
              <s.Icon size={18} className={`${s.color} mx-auto mb-2`} />
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[11px] text-gray-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select value={filterCls} onChange={e => setFilterCls(e.target.value)} className="input-field text-sm">
          <option value="all">Барлық сыныптар</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setFilterType('all')}
            className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
              filterType === 'all' ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-white/4 border-white/8 text-gray-500'
            }`}>Барлығы</button>
          {GRADE_TYPES.map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                filterType === t ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-white/4 border-white/8 text-gray-500'
              }`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Grade table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white/3 border border-white/6 rounded-2xl">
          <BookOpen size={36} className="mx-auto mb-3 text-gray-700" />
          <p className="text-gray-500 text-sm">Баға жоқ</p>
          <button onClick={() => setShowForm(true)} className="mt-4 btn-primary inline-flex">
            <Plus size={14} /> Баға қою
          </button>
        </div>
      ) : (
        <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  {['Оқушы', 'Тапсырма', 'Түрі', 'Балл', 'Ұпай', 'Пікір', ''].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((g, i) => {
                  const student = stuMap[g.studentId];
                  const asn     = asnMap[g.assignmentId];
                  return (
                    <motion.tr
                      key={g.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.03 * i }}
                      className="hover:bg-white/3 transition-colors group">
                      <td className="px-4 py-3 text-white text-sm">
                        {student?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm max-w-[180px] truncate">
                        {asn?.title ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${GRADE_TYPE_COLORS[g.gradeType]}`}>
                          {g.gradeType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-base font-bold ${scoreColor(g.score)}`}>
                          {g.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{g.points}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-[140px] truncate">
                        {g.comment || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => { if (confirm('Бағаны жойғыңыз келе ме?')) onDelete(g.id); }}
                          className="p-1.5 rounded-lg text-gray-700 hover:text-red-400 hover:bg-red-500/10
                            transition-all opacity-0 group-hover:opacity-100">
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
          <GradeModal
            students={students} assignments={assignments} classes={classes}
            onSave={onAdd} onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
