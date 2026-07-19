import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, FileText, Edit3, Trash2, X, Check, Download,
  Printer, ChevronDown, Clock, BookOpen,
} from 'lucide-react';
import type { LessonPlan, ClassRecord, PlanType } from '@/types/teacher';

interface Props {
  plans: LessonPlan[];
  classes: ClassRecord[];
  onAdd: (p: Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (p: LessonPlan) => void;
  onDelete: (id: string) => void;
}

const PLAN_TYPES: PlanType[] = ['КМЖ', 'БЖБ', 'ТЖБ'];
const PLAN_COLORS: Record<PlanType, string> = {
  'КМЖ': 'from-violet-600 to-purple-500',
  'БЖБ': 'from-blue-600 to-indigo-500',
  'ТЖБ': 'from-emerald-600 to-teal-500',
};
const PLAN_DESCS: Record<PlanType, string> = {
  'КМЖ': 'Күнтізбелік-мерзімдік жоспар',
  'БЖБ': 'Бағалаудың жиынтық жұмысы',
  'ТЖБ': 'Тоқсандық жиынтық бағалау',
};

const QUARTERS = [1, 2, 3, 4];
const GRADES   = [5, 6, 7, 8, 9, 10, 11];

interface FormState {
  title: string; type: PlanType; classId: string; grade: number; quarter: number;
  topic: string; objectives: string; content: string; activities: string;
  assessment: string; duration: number;
}
const EMPTY_FORM: FormState = {
  title: '', type: 'КМЖ', classId: '', grade: 9, quarter: 1,
  topic: '', objectives: '', content: '', activities: '', assessment: '', duration: 45,
};

function PlanForm({
  initial, classes, onSave, onClose, title: formTitle,
}: {
  initial: FormState; classes: ClassRecord[];
  onSave: (f: FormState) => void; onClose: () => void; title: string;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(p => ({ ...p, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-gray-900 border border-white/12 rounded-3xl p-6 w-full max-w-2xl shadow-2xl
          max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-xl mb-6">{formTitle}</h2>

        {/* Type selector */}
        <div className="mb-5">
          <label className="text-gray-500 text-xs block mb-2 uppercase tracking-wider">Жоспар түрі</label>
          <div className="flex gap-3">
            {PLAN_TYPES.map(t => (
              <button key={t} onClick={() => set('type', t)}
                className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                  form.type === t
                    ? `bg-gradient-to-r ${PLAN_COLORS[t]} border-transparent text-white shadow-lg`
                    : 'bg-white/4 border-white/10 text-gray-500 hover:text-gray-300'
                }`}>
                <div>{t}</div>
                <div className="text-[10px] font-normal opacity-70 mt-0.5">{PLAN_DESCS[t]}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="sm:col-span-2">
            <label className="text-gray-500 text-xs block mb-1">Жоспар атауы</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="Мысалы: Абай Құнанбайұлы — КМЖ" className="input-field" />
          </div>

          <div>
            <label className="text-gray-500 text-xs block mb-1">Сынып</label>
            <select value={form.classId} onChange={e => set('classId', e.target.value)} className="input-field">
              <option value="">— Таңдамасаңыз болады —</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs block mb-1">Сынып (деңгей)</label>
              <select value={form.grade} onChange={e => set('grade', Number(e.target.value))} className="input-field">
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs block mb-1">Тоқсан</label>
              <select value={form.quarter} onChange={e => set('quarter', Number(e.target.value))} className="input-field">
                {QUARTERS.map(q => <option key={q} value={q}>{q}-тоқсан</option>)}
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-gray-500 text-xs block mb-1">Тақырып</label>
            <input value={form.topic} onChange={e => set('topic', e.target.value)}
              placeholder="Сабақтың тақырыбы" className="input-field" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-gray-500 text-xs block mb-1">Мақсаттар мен міндеттер</label>
            <textarea value={form.objectives} onChange={e => set('objectives', e.target.value)}
              rows={2} placeholder="Оқушылар нені біледі, нені меңгереді…" className="input-field resize-none" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-gray-500 text-xs block mb-1">Сабақтың мазмұны</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)}
              rows={3} placeholder="Негізгі тақырып мазмұны…" className="input-field resize-none" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-gray-500 text-xs block mb-1">Сабақ барысы / Тапсырмалар</label>
            <textarea value={form.activities} onChange={e => set('activities', e.target.value)}
              rows={3} placeholder="1. Кіріспе бөлім (5 мин)&#10;2. Негізгі бөлім (30 мин)&#10;3. Қорытынды (10 мин)" className="input-field resize-none" />
          </div>

          <div>
            <label className="text-gray-500 text-xs block mb-1">Бағалау / Рефлексия</label>
            <textarea value={form.assessment} onChange={e => set('assessment', e.target.value)}
              rows={2} placeholder="Тест, ауызша сұрақ…" className="input-field resize-none" />
          </div>

          <div>
            <label className="text-gray-500 text-xs block mb-1">Ұзақтығы (мин)</label>
            <input type="number" value={form.duration} onChange={e => set('duration', Number(e.target.value))}
              min={10} max={180} step={5} className="input-field" />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 btn-ghost"><X size={14} /> Болдырмау</button>
          <button onClick={() => form.title.trim() && onSave(form)} disabled={!form.title.trim()} className="flex-1 btn-primary">
            <Check size={14} /> Сақтау
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function printPlan(plan: LessonPlan, clsName?: string) {
  const win = window.open('', '_blank');
  if (!win) return;
  const today = new Date().toLocaleDateString('kk-KZ');
  win.document.write(`<!DOCTYPE html><html lang="kk"><head>
<meta charset="utf-8">
<title>${plan.type}: ${plan.title}</title>
<style>
  body { font-family: Arial, sans-serif; max-width:800px; margin:40px auto; padding:0 24px; color:#1f2937; line-height:1.7; }
  h1 { font-size:22px; border-bottom:2px solid #7c3aed; padding-bottom:8px; margin-bottom:24px; color:#7c3aed; }
  .meta { display:flex; gap:24px; flex-wrap:wrap; font-size:13px; color:#6b7280; margin-bottom:24px; background:#f9fafb; padding:12px 16px; border-radius:8px; }
  .meta span b { color:#374151; }
  h2 { font-size:15px; font-weight:700; color:#374151; margin:20px 0 8px; text-transform:uppercase; letter-spacing:0.5px; }
  p { font-size:14px; color:#4b5563; white-space:pre-wrap; }
  .footer { margin-top:40px; display:flex; justify-content:space-between; font-size:13px; color:#9ca3af; border-top:1px dashed #e5e7eb; padding-top:16px; }
  @media print { body { margin:20px; } }
</style>
</head><body>
<h1>${plan.type} — ${plan.title}</h1>
<div class="meta">
  <span><b>Тақырып:</b> ${plan.topic}</span>
  <span><b>Сынып:</b> ${plan.grade}${clsName ? ` (${clsName})` : ''}</span>
  <span><b>${plan.quarter}-тоқсан</b></span>
  <span><b>Ұзақтығы:</b> ${plan.duration} мин</span>
</div>
${plan.objectives ? `<h2>Мақсаттар мен міндеттер</h2><p>${plan.objectives}</p>` : ''}
${plan.content ? `<h2>Мазмұн</h2><p>${plan.content}</p>` : ''}
${plan.activities ? `<h2>Сабақ барысы</h2><p>${plan.activities}</p>` : ''}
${plan.assessment ? `<h2>Бағалау</h2><p>${plan.assessment}</p>` : ''}
<div class="footer"><span>Күні: ${today}</span><span>QazaqAdebiet платформасы</span></div>
<script>window.onload = () => window.print();<\/script>
</body></html>`);
  win.document.close();
}

export default function TchLessonPlans({ plans, classes, onAdd, onUpdate, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<LessonPlan | null>(null);
  const [filterType, setFilterType] = useState<PlanType | 'all'>('all');

  const clsMap = Object.fromEntries(classes.map(c => [c.id, c]));

  const filtered = plans.filter(p => filterType === 'all' || p.type === filterType)
    .sort((a, b) => b.updatedAt - a.updatedAt);

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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white font-bold text-lg">ҚМЖ / БЖБ / ТЖБ</h2>
          <p className="text-gray-500 text-sm">{plans.length} жоспар сақталған</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={15} /> Жоспар жасау
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
            filterType === 'all' ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-white/4 border-white/8 text-gray-500'
          }`}>Барлығы</button>
        {PLAN_TYPES.map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
              filterType === t ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-white/4 border-white/8 text-gray-500'
            }`}>
            {t} — {PLAN_DESCS[t].slice(0, 20)}…
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white/3 border border-white/6 rounded-2xl">
          <FileText size={40} className="mx-auto mb-4 text-gray-700" />
          <p className="text-gray-400 font-medium mb-1">Жоспар жоқ</p>
          <p className="text-gray-600 text-sm mb-4">КМЖ, БЖБ немесе ТЖБ жасаңыз</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex">
            <Plus size={14} /> Жоспар жасау
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((plan, i) => {
            const cls = plan.classId ? clsMap[plan.classId] : null;
            const color = PLAN_COLORS[plan.type];
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}
                className="group bg-white/4 border border-white/8 rounded-2xl overflow-hidden
                  hover:border-white/15 transition-all">
                <div className={`h-1 bg-gradient-to-r ${color}`} />
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color}
                      flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <span className="text-white text-xs font-bold">{plan.type}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="text-white font-semibold text-sm">{plan.title}</h3>
                          <p className="text-gray-500 text-xs mt-0.5">{plan.topic}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => printPlan(plan, cls?.name)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                            <Printer size={13} />
                          </button>
                          <button onClick={() => setEditing(plan)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-all">
                            <Edit3 size={13} />
                          </button>
                          <button onClick={() => { if (confirm('Жоспарды жойғыңыз келе ме?')) onDelete(plan.id); }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {cls && (
                          <span className="flex items-center gap-1 text-gray-600 text-xs">
                            <BookOpen size={10} />{cls.name}
                          </span>
                        )}
                        <span className="text-gray-600 text-xs">{plan.grade}-сынып</span>
                        <span className="text-gray-600 text-xs">{plan.quarter}-тоқсан</span>
                        <span className="flex items-center gap-1 text-gray-600 text-xs">
                          <Clock size={10} />{plan.duration} мин
                        </span>
                        <span className="text-gray-700 text-[10px]">
                          {new Date(plan.updatedAt).toLocaleDateString('kk-KZ')}
                        </span>
                      </div>

                      {plan.objectives && (
                        <p className="text-gray-600 text-xs mt-2 line-clamp-2 leading-relaxed">
                          {plan.objectives}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {(showForm || editing) && (
          <PlanForm
            title={editing ? 'Жоспарды өзгерту' : 'Жаңа жоспар'}
            initial={editing ? {
              title: editing.title, type: editing.type, classId: editing.classId ?? '',
              grade: editing.grade, quarter: editing.quarter, topic: editing.topic,
              objectives: editing.objectives, content: editing.content,
              activities: editing.activities, assessment: editing.assessment,
              duration: editing.duration,
            } : EMPTY_FORM}
            classes={classes}
            onSave={save}
            onClose={() => { setShowForm(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
