import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Printer, Download, Star, Check, Users } from 'lucide-react';
import type { Student, ClassRecord, GradeRecord, Assignment } from '@/types/teacher';

interface Props {
  students: Student[];
  classes: ClassRecord[];
  grades: GradeRecord[];
  assignments: Assignment[];
  teacherName: string;
  school: string;
}

type CertTemplate = 'excellence' | 'participation' | 'improvement' | 'reading' | 'custom';

const TEMPLATES: { id: CertTemplate; label: string; desc: string; color: string; minScore?: number }[] = [
  { id: 'excellence',    label: 'Үздік оқушы',           desc: 'Орт. балл 85%-дан жоғары',  color: 'from-amber-500 to-yellow-400',  minScore: 85 },
  { id: 'participation', label: 'Белсенді қатысу',        desc: 'Барлық тапсырманы орындады', color: 'from-violet-600 to-purple-500' },
  { id: 'improvement',   label: 'Прогресс жасады',        desc: 'Ерекше жетістік',            color: 'from-emerald-600 to-teal-500'  },
  { id: 'reading',       label: 'Кітап оқу бойынша',      desc: 'Оқу тапсырмасын орындады',   color: 'from-blue-600 to-indigo-500'   },
  { id: 'custom',        label: 'Еркін үлгі',             desc: 'Өзіңіз толтырыңыз',          color: 'from-rose-500 to-pink-500'     },
];

function printCertificate(
  studentName: string, templateLabel: string, school: string,
  teacherName: string, color: string, custom?: string,
) {
  const win = window.open('', '_blank');
  if (!win) return;
  const today = new Date().toLocaleDateString('kk-KZ', { year: 'numeric', month: 'long', day: 'numeric' });

  win.document.write(`<!DOCTYPE html><html lang="kk"><head>
<meta charset="utf-8">
<title>${templateLabel} — ${studentName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Inter, sans-serif; background:#fff; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:40px; }
  .page { width:750px; border:6px double #7c3aed; border-radius:28px; padding:56px 64px; text-align:center; background:linear-gradient(160deg,#fafafe 0%,#f5f3ff 100%); position:relative; }
  .corner { position:absolute; width:40px; height:40px; border:3px solid #7c3aed; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; background:#fff; }
  .tl { top:16px; left:16px; }
  .tr { top:16px; right:16px; }
  .bl { bottom:16px; left:16px; }
  .br { bottom:16px; right:16px; }
  .org { font-size:11px; text-transform:uppercase; letter-spacing:3px; color:#7c3aed; margin-bottom:28px; font-weight:600; }
  .seal { width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,#7c3aed,#a855f7); margin:0 auto 20px; display:flex; align-items:center; justify-content:center; font-size:30px; box-shadow:0 4px 24px rgba(139,92,246,0.4); }
  .cert-label { font-size:11px; text-transform:uppercase; letter-spacing:5px; color:#9ca3af; margin-bottom:10px; }
  h1 { font-size:30px; font-weight:900; color:#1f2937; margin-bottom:28px; line-height:1.2; }
  .presenter { font-size:13px; color:#9ca3af; margin-bottom:8px; }
  .name { font-size:32px; font-weight:700; color:#7c3aed; margin-bottom:6px; }
  .school { font-size:14px; color:#6b7280; margin-bottom:28px; }
  .reason-label { font-size:12px; color:#9ca3af; margin-bottom:6px; text-transform:uppercase; letter-spacing:2px; }
  .reason { font-size:17px; font-weight:600; color:#374151; margin-bottom:8px; }
  .custom { font-size:14px; color:#6b7280; margin-bottom:32px; font-style:italic; }
  hr { border:none; border-top:1px dashed #e5e7eb; margin:28px 0; }
  .footer { display:flex; justify-content:space-between; align-items:flex-end; }
  .sig { text-align:left; }
  .sig-name { font-size:15px; font-weight:700; color:#1f2937; border-top:1px solid #374151; padding-top:6px; margin-top:32px; min-width:180px; }
  .sig-role { font-size:11px; color:#9ca3af; }
  .date-block { text-align:right; }
  .date { font-size:12px; color:#9ca3af; }
  .stars { font-size:20px; letter-spacing:10px; color:#7c3aed; margin-top:10px; }
  @media print { body { padding:0; } .page { width:100%; border-width:4px; } }
</style>
</head><body>
<div class="page">
  <div class="corner tl">★</div><div class="corner tr">★</div>
  <div class="corner bl">★</div><div class="corner br">★</div>
  <div class="org">${school} · QazaqAdebiet</div>
  <div class="seal">🏆</div>
  <div class="cert-label">Мақтау қағазы</div>
  <h1>${templateLabel}</h1>
  <div class="presenter">Осы мақтау қағазы:</div>
  <div class="name">${studentName}</div>
  <div class="school">оқушысына тапсырылады</div>
  ${custom ? `<div class="reason-label">Жетістігі:</div><div class="custom">${custom}</div>` : ''}
  <div class="stars">★ ★ ★</div>
  <hr>
  <div class="footer">
    <div class="sig">
      <div class="sig-name">${teacherName}</div>
      <div class="sig-role">Мұғалім</div>
    </div>
    <div class="date-block">
      <div class="date">${today}</div>
    </div>
  </div>
</div>
<script>window.onload = () => window.print();<\/script>
</body></html>`);
  win.document.close();
}

function printBulk(
  students: Student[], template: typeof TEMPLATES[0],
  school: string, teacherName: string, custom: string,
) {
  for (const s of students) {
    printCertificate(s.name, template.label, school, teacherName, template.color, custom || undefined);
  }
}

export default function TchCertificates({
  students, classes, grades, assignments, teacherName, school,
}: Props) {
  const [selTemplate, setSelTemplate] = useState<CertTemplate>('excellence');
  const [selClass, setSelClass]       = useState('all');
  const [custom, setCustom]           = useState('');
  const [selected, setSelected]       = useState<Set<string>>(new Set());

  const template = TEMPLATES.find(t => t.id === selTemplate)!;

  // Eligible students for selected template
  const pool = students.filter(s => selClass === 'all' || s.classId === selClass);

  const eligible = template.minScore
    ? pool.filter(s => {
        const sg = grades.filter(g => g.studentId === s.id);
        if (!sg.length) return false;
        const avg = sg.reduce((sum, g) => sum + g.score, 0) / sg.length;
        return avg >= template.minScore!;
      })
    : pool;

  const toggleAll = () => {
    if (selected.size === eligible.length) setSelected(new Set());
    else setSelected(new Set(eligible.map(s => s.id)));
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const selectedStudents = students.filter(s => selected.has(s.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white font-bold text-lg">Сертификаттар</h2>
        <p className="text-gray-500 text-sm">Мақтау қағаздарын басып шығару</p>
      </div>

      {/* Template picker */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Үлгі таңдаңыз</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setSelTemplate(t.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                selTemplate === t.id
                  ? 'bg-violet-500/15 border-violet-500/40'
                  : 'bg-white/4 border-white/8 hover:border-white/15'
              }`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color}
                flex items-center justify-center flex-shrink-0`}>
                <Award size={18} className="text-white" />
              </div>
              <div>
                <div className={`text-sm font-semibold ${selTemplate === t.id ? 'text-violet-300' : 'text-white'}`}>
                  {t.label}
                </div>
                <div className="text-gray-600 text-xs mt-0.5">{t.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom text */}
      {selTemplate === 'custom' && (
        <div>
          <label className="text-gray-500 text-xs block mb-1">Мақтау мәтіні</label>
          <input value={custom} onChange={e => setCustom(e.target.value)}
            placeholder="Мысалы: Олимпиадада 1-орын алғаны үшін"
            className="input-field w-full" />
        </div>
      )}

      {/* Class filter */}
      <div className="flex items-center gap-3">
        <label className="text-gray-500 text-xs whitespace-nowrap">Сынып:</label>
        <select value={selClass} onChange={e => { setSelClass(e.target.value); setSelected(new Set()); }}
          className="input-field text-sm">
          <option value="all">Барлығы</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span className="text-gray-600 text-xs whitespace-nowrap">{eligible.length} оқушы сәйкес</span>
      </div>

      {/* Student list */}
      <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
        {/* Select all row */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/6">
          <button onClick={toggleAll} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center ${
              selected.size === eligible.length && eligible.length > 0
                ? 'bg-violet-500 border-violet-500' : 'border-white/20'
            }`}>
              {selected.size === eligible.length && eligible.length > 0 && <Check size={11} className="text-white" />}
            </div>
            Барлығын таңдау ({eligible.length})
          </button>
          {selected.size > 0 && (
            <span className="text-violet-400 text-xs font-medium">{selected.size} таңдалды</span>
          )}
        </div>

        {eligible.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-sm">
            <Users size={28} className="mx-auto mb-2 opacity-40" />
            Сәйкес оқушы жоқ
          </div>
        ) : (
          <div className="divide-y divide-white/4 max-h-72 overflow-y-auto">
            {eligible.map((s, i) => {
              const sg  = grades.filter(g => g.studentId === s.id);
              const avg = sg.length ? Math.round(sg.reduce((sum, g) => sum + g.score, 0) / sg.length) : null;
              const cls = classes.find(c => c.id === s.classId);
              return (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.03 * i }}
                  onClick={() => toggle(s.id)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors text-left">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                    selected.has(s.id) ? 'bg-violet-500 border-violet-500' : 'border-white/20'
                  }`}>
                    {selected.has(s.id) && <Check size={11} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white text-sm">{s.name}</span>
                    {cls && <span className="text-gray-600 text-xs ml-2">{cls.name}</span>}
                  </div>
                  {avg !== null && (
                    <span className={`text-xs font-bold ${avg >= 85 ? 'text-emerald-400' : avg >= 65 ? 'text-amber-400' : 'text-red-400'}`}>
                      {avg}%
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          disabled={selected.size === 0}
          onClick={() => {
            for (const s of selectedStudents) {
              printCertificate(s.name, template.label, school, teacherName, template.color,
                selTemplate === 'custom' ? custom : undefined);
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm
            bg-gradient-to-r from-violet-600 to-purple-600 text-white
            disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-500 hover:to-purple-500
            transition-all shadow-lg shadow-violet-500/20">
          <Printer size={16} />
          {selected.size > 0 ? `${selected.size} сертификат басып шығару` : 'Оқушыларды таңдаңыз'}
        </button>
        {selected.size === 1 && (
          <button
            onClick={() => {
              const s = selectedStudents[0];
              printCertificate(s.name, template.label, school, teacherName, template.color,
                selTemplate === 'custom' ? custom : undefined);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-white/15
              text-gray-400 hover:text-white hover:bg-white/8 transition-all text-sm font-medium">
            <Download size={14} /> Жүктеу
          </button>
        )}
      </div>

      {/* Preview */}
      {selected.size > 0 && (
        <div className={`bg-gradient-to-br ${template.color} bg-opacity-10 border border-white/10 rounded-2xl p-6 text-center`}>
          <Award size={28} className="text-white/60 mx-auto mb-2" />
          <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Алдын ала қарау</div>
          <div className="text-white font-bold text-lg">{template.label}</div>
          <div className="text-white/60 text-sm mt-1">
            {selectedStudents.slice(0, 3).map(s => s.name).join(', ')}
            {selectedStudents.length > 3 && ` және тағы ${selectedStudents.length - 3}`}
          </div>
          <div className="flex justify-center gap-1 mt-3">
            {[...Array(3)].map((_, i) => <Star key={i} size={12} className="text-white/40 fill-current" />)}
          </div>
        </div>
      )}
    </div>
  );
}
