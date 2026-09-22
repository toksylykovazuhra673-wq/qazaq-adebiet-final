import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  Plus, Target, BookOpen, FileText, Edit3, Trash2, X, Check,
  Calendar, Clock, Users, ChevronRight, Send, Eye,
} from 'lucide-react';
import type { Assignment, ClassRecord, AssignmentType } from '@/types/teacher';
import booksData from '@/data/books.json';
import { supabase } from '@/lib/supabase';

interface Props {
  assignments: Assignment[];
  classes: ClassRecord[];
  studentCounts: Record<string, number>;
  onAdd: (a: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onUpdate: (a: Assignment) => void;
  onDelete: (id: string) => void;
}

const TYPE_META: Record<AssignmentType, { label: string; color: string; Icon: React.ElementType }> = {
  task:     { label: 'Тест',      color: 'from-violet-600 to-purple-500', Icon: Target    },
  reading:  { label: 'Оқу',       color: 'from-blue-600 to-indigo-500',   Icon: BookOpen  },
  analysis: { label: 'Талдау',    color: 'from-emerald-600 to-teal-500',  Icon: Eye       },
  essay:    { label: 'Шығарма',   color: 'from-orange-500 to-amber-400',  Icon: FileText  },
  project:  { label: 'Жоба',      color: 'from-rose-500 to-pink-500',     Icon: Send      },
};

const STATUS_META = {
  draft:  { label: 'Жоба',     cls: 'bg-gray-500/15 border-gray-500/25 text-gray-400'     },
  active: { label: '🟢 Белсенді', cls: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400' },
  closed: { label: '🔴 Жабық',    cls: 'bg-red-500/15 border-red-500/25 text-red-400'       },
};

const BOOKS = booksData as Array<{ id: string; title: string; authorName: string }>;
const ANALYSIS_SLUGS = BOOKS.map(b => ({ slug: b.id, title: b.title }));

interface FormState {
  classId: string; title: string; type: AssignmentType;
  bookSlug: string; analysisSlug: string; dueDate: string;
  points: number; instructions: string; status: Assignment['status'];
}

function AssignModal({
  classes, onSave, onClose, initial,
}: {
  classes: ClassRecord[];
  onSave: (f: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  initial?: Partial<FormState>;
}) {
  const [form, setForm] = useState<FormState>({
    classId: classes[0]?.id ?? '', title: '', type: 'task',
    bookSlug: '', analysisSlug: '', dueDate: '', points: 20,
    instructions: '', status: 'active', ...initial,
  });
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(p => ({ ...p, [k]: v }));

  const save = () => {
    if (!form.title.trim() || !form.classId || !form.dueDate) return;
    onSave({
      classId: form.classId, title: form.title, type: form.type,
      bookSlug: form.bookSlug || undefined,
      analysisSlug: form.analysisSlug || undefined,
      dueDate: form.dueDate, points: form.points,
      instructions: form.instructions, status: form.status,
    });
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
        className="bg-gray-900 border border-white/12 rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-lg mb-5">Тапсырма беру</h2>

        <div className="space-y-3">
          {/* Class */}
          <div>
            <label className="text-gray-500 text-xs block mb-1">Сынып</label>
            <select value={form.classId} onChange={e => set('classId', e.target.value)} className="input-field">
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="text-gray-500 text-xs block mb-1.5">Тапсырма түрі</label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(TYPE_META) as [AssignmentType, typeof TYPE_META[AssignmentType]][]).map(([type, meta]) => (
                <button key={type} onClick={() => set('type', type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    form.type === type
                      ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                      : 'bg-white/4 border-white/8 text-gray-500 hover:text-gray-300'
                  }`}>
                  <meta.Icon size={12} /> {meta.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-gray-500 text-xs block mb-1">Тапсырма атауы</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="Мысалы: Абай Қарасөздер — БЖБ" className="input-field" />
          </div>

          {/* Book (for reading/analysis) */}
          {(form.type === 'reading' || form.type === 'analysis') && (
            <div>
              <label className="text-gray-500 text-xs block mb-1">Кітап</label>
              <select value={form.bookSlug} onChange={e => set('bookSlug', e.target.value)} className="input-field">
                <option value="">— Таңдаңыз —</option>
                {BOOKS.map(b => <option key={b.id} value={b.id}>{b.title} — {b.authorName}</option>)}
              </select>
            </div>
          )}
          {form.type === 'analysis' && (
            <div>
              <label className="text-gray-500 text-xs block mb-1">Талдау сілтемесі</label>
              <select value={form.analysisSlug} onChange={e => set('analysisSlug', e.target.value)} className="input-field">
                <option value="">— Таңдаңыз —</option>
                {ANALYSIS_SLUGS.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              </select>
            </div>
          )}

          {/* Deadline + points */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs block mb-1">Мерзімі</label>
              <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-gray-500 text-xs block mb-1">Ұпай</label>
              <input type="number" value={form.points} onChange={e => set('points', Number(e.target.value))}
                min={1} max={100} className="input-field" />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="text-gray-500 text-xs block mb-1">Нұсқаулық</label>
            <textarea value={form.instructions} onChange={e => set('instructions', e.target.value)}
              rows={3} placeholder="Оқушыларға нұсқаулық…" className="input-field resize-none" />
          </div>

          {/* Status */}
          <div>
            <label className="text-gray-500 text-xs block mb-1.5">Күйі</label>
            <div className="flex gap-2">
              {(['draft', 'active', 'closed'] as Assignment['status'][]).map(st => (
                <button key={st} onClick={() => set('status', st)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    form.status === st
                      ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                      : 'bg-white/4 border-white/8 text-gray-500'
                  }`}>
                  {STATUS_META[st].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 btn-ghost"><X size={14} /> Болдырмау</button>
          <button onClick={save} disabled={!form.title || !form.classId || !form.dueDate} className="flex-1 btn-primary">
            <Send size={14} /> Жіберу
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TchAssignments({ assignments, classes, studentCounts, onAdd, onUpdate, onDelete }: Props) {
  

  function getGrade(score: number): number {
    if (score >= 9) return 5;
    if (score >= 7) return 4;
    if (score >= 5) return 3;
    return 2;
  }


  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [filterCls, setFilterCls] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
const [submissions, setSubmissions] = useState<any[]>([]);
const [loadingSubmissions, setLoadingSubmissions] = useState(false);

const openSubmissions = async (assignment: Assignment) => {
  setSelectedAssignment(assignment);
  setLoadingSubmissions(true);

  const { data, error } = await supabase
    .from('assignment_submissions')
    .select('*')
    .eq('assignment_id', assignment.id)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Submissions load error:', error);
    setSubmissions([]);
  } else {
    setSubmissions(data ?? []);
  }

  setLoadingSubmissions(false);
};

  const clsMap = Object.fromEntries(classes.map(c => [c.id, c]));

  const filtered = assignments
    .filter(a => filterCls === 'all' || a.classId === filterCls)
    .sort((a, b) => b.createdAt - a.createdAt);

  const save = (f: Omit<Assignment, 'id' | 'createdAt'>) => {
    if (editing) { onUpdate({ ...editing, ...f }); setEditing(null); }
    else { onAdd(f); setShowForm(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white font-bold text-lg">Тапсырмалар</h2>
          <p className="text-gray-500 text-sm">{assignments.length} тапсырма берілген</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={filterCls} onChange={e => setFilterCls(e.target.value)} className="input-field text-sm">
            <option value="all">Барлық сыныптар</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={15} /> Тапсырма беру
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white/3 border border-white/6 rounded-2xl">
          <Target size={36} className="mx-auto mb-3 text-gray-700" />
          <p className="text-gray-400 text-sm">Тапсырма жоқ</p>
          <button onClick={() => setShowForm(true)} className="mt-4 btn-primary inline-flex text-sm">
            <Plus size={14} /> Тапсырма беру
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a, i) => {
            const meta = TYPE_META[a.type];
            const sm = STATUS_META[a.status];
            const cls = clsMap[a.classId];
            const Icon = meta.Icon;
            const overdue = new Date(a.dueDate) < new Date() && a.status === 'active';

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}
                className="group bg-white/4 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color}
                    flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="text-white font-semibold text-sm">{a.title}</h3>
                        {cls && <p className="text-gray-500 text-xs mt-0.5">{cls.name}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${sm.cls}`}>
                          {sm.label}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20
                          text-violet-400 text-[11px] font-medium">
                          {a.points} ұпай
                        </span>
                      </div>
                    </div>

                    {a.instructions && (
                      <p className="text-gray-600 text-xs mt-1.5 line-clamp-1">{a.instructions}</p>
                    )}

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : 'text-gray-600'}`}>
                        <Calendar size={10} />
                        {overdue ? '⚠️ ' : ''}Мерзім: {a.dueDate}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 text-xs">
                        <Users size={10} />
                        {studentCounts[a.classId] ?? 0} оқушы
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-md bg-white/6 text-gray-500 text-[10px]`}>
                        {meta.label}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
  onClick={() => openSubmissions(a)}
  className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
  title="Оқушы жауаптары"
>
  <Users size={13} />
</button>
                    {a.type === 'analysis' && a.analysisSlug && (
                      <button onClick={() => navigate(`/analysis/${a.analysisSlug}`)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <Eye size={13} />
                      </button>
                    )}
                    <button onClick={() => setEditing(a)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-all">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => { if (confirm('Тапсырманы жойғыңыз келе ме?')) onDelete(a.id); }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {(showForm || editing) && (
          <AssignModal
            classes={classes}
            onSave={save}
            onClose={() => { setShowForm(false); setEditing(null); }}
            initial={editing ? {
              classId: editing.classId, title: editing.title, type: editing.type,
              bookSlug: editing.bookSlug ?? '', analysisSlug: editing.analysisSlug ?? '',
              dueDate: editing.dueDate, points: editing.points,
              instructions: editing.instructions, status: editing.status,
            } : undefined}
          />
        )}
              <AnimatePresence>
        {selectedAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedAssignment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-white font-bold text-lg">
                    Оқушы жауаптары
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {selectedAssignment.title}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              {loadingSubmissions ? (
                <div className="text-center py-10 text-gray-500">
                  Жауаптар жүктелуде...
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-10">
                  <Users size={35} className="mx-auto mb-3 text-gray-600" />
                  <p className="text-gray-400">
                    Әзірге оқушы жауабы жоқ
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="text-white font-semibold">
                            {submission.student_name}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            {submission.submitted_at
                              ? new Date(
                                  submission.submitted_at
                                ).toLocaleString('kk-KZ')
                              : ''}
                          </p>
                        </div>

                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {submission.status === 'graded'
                            ? 'Бағаланған'
                            : 'Жіберілді'}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-500 text-xs mb-2">
                          Оқушының жауабы:
                        </p>

                        <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-gray-300 text-sm whitespace-pre-wrap">
                          {submission.answer_text || 'Жауап мәтіні жоқ'}
                        </div>
                      </div>

                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label className="text-gray-500 text-xs block mb-1">
                            Баға / ұпай
                          </label>

                          <input
                            type="number"
                            min={0}
                            max={selectedAssignment.points}
                            defaultValue={submission.score ?? ''}
                            id={`score-${submission.id}`}
                            placeholder={`0–${selectedAssignment.points}`}
                            className="input-field"
                          />
                        </div>

                        <button
                          onClick={async () => {
                            const input = document.getElementById(
                              `score-${submission.id}`
                            ) as HTMLInputElement | null;

                            const score = Number(input?.value);

                            if (
                              Number.isNaN(score) ||
                              score < 0 ||
                              score > selectedAssignment.points
                            ) {
                              alert(
                                `0 мен ${selectedAssignment.points} аралығында ұпай енгізіңіз.`
                              );
                              return;
                            }

                            const grade = getGrade(score);

const { error } = await supabase
  .from('assignment_submissions')
  .update({
    score,
    grade,
    status: 'graded',
    graded_at: new Date().toISOString(),
  })
  .eq('id', submission.id);

if (error) {
  console.error('Grade save error:', error);

  alert(
    `Бағаны сақтау кезінде қате шықты:\n\n${error.message}`
  );

  return;
}

setSubmissions(prev =>
  prev.map(item =>
    item.id === submission.id
      ? {
          ...item,
          score,
          grade,
          status: 'graded',
        }
      : item
  )
);

alert(`${score}/10 ұпай, ${grade} бағасы сақталды! ✅`);

                            if (error) {
                              console.error(error);
                              alert('Бағаны сақтау кезінде қате шықты.');
                              return;
                            }

                            setSubmissions(prev =>
                              prev.map(item =>
                                item.id === submission.id
                                  ? {
                                      ...item,
                                      score,
                                      status: 'graded',
                                    }
                                  : item
                              )
                            );

                            alert('Баға сақталды! ✅');
                          }}
                          className="btn-primary"
                        >
                          <Check size={14} />
                          Бағаны сақтау
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}
