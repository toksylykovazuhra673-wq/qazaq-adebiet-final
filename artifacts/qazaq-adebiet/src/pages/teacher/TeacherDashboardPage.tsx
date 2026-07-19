import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  GraduationCap, Users, Target, BookOpen, BarChart3,
  Award, FileText, ChevronLeft, Edit3, Check, X,
  Zap, TrendingUp, AlertCircle,
} from 'lucide-react';

import { useTeacherDashboard } from '@/hooks/useTeacherDashboard';
import type { TeachTab, TeacherProfile } from '@/types/teacher';

import TchClasses     from './tabs/TchClasses';
import TchStudents    from './tabs/TchStudents';
import TchAssignments from './tabs/TchAssignments';
import TchGrades      from './tabs/TchGrades';
import TchAnalytics   from './tabs/TchAnalytics';
import TchCertificates from './tabs/TchCertificates';
import TchLessonPlans from './tabs/TchLessonPlans';

// ── Global button / input styles injected via a style tag ─────────────────
import './teacher.css';

// ── Tab config ──────────────────────────────────────────────────────────────
const TABS: { id: TeachTab; label: string; short: string; Icon: React.ElementType }[] = [
  { id: 'classes',     label: 'Сыныптар',       short: 'Сынып',   Icon: GraduationCap },
  { id: 'students',    label: 'Оқушылар',        short: 'Оқушы',   Icon: Users         },
  { id: 'assignments', label: 'Тапсырмалар',     short: 'Тапсырма',Icon: Target        },
  { id: 'grades',      label: 'Бағалар',         short: 'Баға',    Icon: BookOpen      },
  { id: 'analytics',   label: 'Статистика',      short: 'Стат.',   Icon: BarChart3     },
  { id: 'certificates',label: 'Сертификаттар',   short: 'Серт.',   Icon: Award         },
  { id: 'lessonplans', label: 'ҚМЖ / БЖБ / ТЖБ', short: 'Жоспар', Icon: FileText      },
];

// ── Profile Modal ───────────────────────────────────────────────────────────
function ProfileModal({
  profile, onSave, onClose,
}: { profile: TeacherProfile; onSave: (p: TeacherProfile) => void; onClose: () => void }) {
  const [form, setForm] = useState(profile);
  const set = (k: keyof TeacherProfile, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-gray-900 border border-white/12 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <GraduationCap size={18} className="text-violet-400" /> Мұғалім профилі
        </h2>
        <div className="space-y-3">
          {([
            { k: 'name',       label: 'Аты-жөні',    ph: 'Мысалы: Айнур Сейткали'         },
            { k: 'school',     label: 'Мектеп',       ph: 'Мектеп атауы'                    },
            { k: 'subject',    label: 'Пән',          ph: 'Қазақ Әдебиеті'                  },
            { k: 'experience', label: 'Тәжірибе',     ph: '5 жыл'                            },
          ] as { k: keyof TeacherProfile; label: string; ph: string }[]).map(f => (
            <div key={f.k}>
              <label className="text-gray-500 text-xs block mb-1">{f.label}</label>
              <input
                value={form[f.k]}
                onChange={e => set(f.k, e.target.value)}
                placeholder={f.ph}
                className="input-field" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 btn-ghost"><X size={14} /> Болдырмау</button>
          <button onClick={() => onSave(form)} className="flex-1 btn-primary"><Check size={14} /> Сақтау</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Dashboard overview widget (shown in sidebar) ──────────────────────────
function SidebarStats({ data }: { data: ReturnType<typeof useTeacherDashboard>['data'] }) {
  const totalStudents = data.students.length;
  const totalGrades   = data.grades.length;
  const avgScore      = totalGrades
    ? Math.round(data.grades.reduce((s, g) => s + g.score, 0) / totalGrades)
    : 0;
  const activeAssign  = data.assignments.filter(a => a.status === 'active').length;

  return (
    <div className="mt-4 space-y-2">
      {[
        { label: 'Оқушы',      value: totalStudents, color: 'text-violet-400' },
        { label: 'Баға',       value: totalGrades,   color: 'text-blue-400'   },
        { label: 'Орт. балл',  value: avgScore ? `${avgScore}%` : '—', color: avgScore >= 70 ? 'text-emerald-400' : 'text-amber-400' },
        { label: 'Тапсырма',   value: activeAssign,  color: 'text-orange-400' },
      ].map(s => (
        <div key={s.label} className="flex items-center justify-between px-3 py-1.5 bg-white/4 rounded-xl">
          <span className="text-gray-600 text-xs">{s.label}</span>
          <span className={`text-xs font-bold ${s.color}`}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function TeacherDashboardPage() {
  const [activeTab, setActiveTab] = useState<TeachTab>('classes');
  const [editProfile, setEditProfile] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
  const [, navigate] = useLocation();

  const {
    data, saveProfile,
    addClass, updateClass, deleteClass,
    addStudent, updateStudent, deleteStudent,
    addAssignment, updateAssignment, deleteAssignment,
    addGrade, updateGrade, deleteGrade,
    addLessonPlan, updateLessonPlan, deleteLessonPlan,
  } = useTeacherDashboard();

  const handleSelectClass = useCallback((id: string) => {
    setSelectedClassId(id);
    setActiveTab('students');
  }, []);

  // student counts per class
  const studentCounts = Object.fromEntries(
    data.classes.map(c => [c.id, data.students.filter(s => s.classId === c.id).length])
  );

  const activeTabMeta = TABS.find(t => t.id === activeTab) ?? TABS[0];

  // Low-scoring alert
  const lowStudents = data.grades.length > 0
    ? [...new Set(data.grades.filter(g => g.score < 60).map(g => g.studentId))].length
    : 0;

  return (
    <div className="dark min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-xl border-b border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gray-600 text-sm">QazaqAdebiet</span>
              <span className="text-gray-700">·</span>
              <span className="text-white text-sm font-medium">Мұғалім кабинеті</span>
            </div>
            <span className="sm:hidden text-white text-sm font-medium">Мұғалім</span>
          </div>

          {/* Profile chip */}
          <button
            onClick={() => setEditProfile(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10
              hover:bg-white/8 transition-all group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600
              flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {data.profile.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-white text-xs font-medium leading-none">{data.profile.name}</div>
              <div className="text-gray-600 text-[10px] mt-0.5">{data.profile.subject}</div>
            </div>
            {lowStudents > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/25">
                <AlertCircle size={9} className="text-orange-400" />
                <span className="text-orange-300 text-[10px] font-bold">{lowStudents}</span>
              </div>
            )}
            <Edit3 size={11} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 pt-6 pr-4
          sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* Teacher card */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-4 mb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600
                flex items-center justify-center text-xl font-bold text-white shadow-lg flex-shrink-0">
                {data.profile.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-white font-semibold text-sm truncate">{data.profile.name}</div>
                <div className="text-gray-500 text-xs truncate">{data.profile.subject}</div>
                <div className="text-gray-700 text-[11px] truncate">{data.profile.school}</div>
              </div>
            </div>
            <SidebarStats data={data} />
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {TABS.map(tab => {
              const active = tab.id === activeTab;
              const hasBadge = tab.id === 'students' && lowStudents > 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
                    transition-all text-left ${
                    active
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}>
                  <tab.Icon size={16} className={active ? 'text-emerald-400' : ''} />
                  <span className="flex-1">{tab.label}</span>
                  {hasBadge && (
                    <span className="text-[10px] bg-orange-500/20 border border-orange-500/30
                      text-orange-400 px-1.5 py-0.5 rounded-full">{lowStudents}⚠</span>
                  )}
                  {tab.id === 'lessonplans' && data.lessonPlans.length > 0 && (
                    <span className="text-[10px] bg-white/8 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {data.lessonPlans.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick links */}
          <div className="mt-auto pb-6 pt-4 space-y-1">
            <button onClick={() => navigate('/interactive')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-600
                hover:text-gray-400 hover:bg-white/4 transition-all">
              <Zap size={12} /> Тапсырмалар зертханасы
            </button>
            <button onClick={() => navigate('/analysis')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-600
                hover:text-gray-400 hover:bg-white/4 transition-all">
              <TrendingUp size={12} /> Талдау беті
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 py-6 lg:pl-6">
          {/* Page title (desktop) */}
          <div className="hidden lg:flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center">
              <activeTabMeta.Icon size={17} className="text-gray-400" />
            </div>
            <h1 className="text-xl font-bold text-white">{activeTabMeta.label}</h1>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}>

              {activeTab === 'classes' && (
                <TchClasses
                  classes={data.classes}
                  students={data.students}
                  onAdd={addClass}
                  onUpdate={updateClass}
                  onDelete={deleteClass}
                  onSelectClass={handleSelectClass}
                />
              )}

              {activeTab === 'students' && (
                <TchStudents
                  students={data.students}
                  classes={data.classes}
                  grades={data.grades}
                  onAdd={addStudent}
                  onUpdate={updateStudent}
                  onDelete={deleteStudent}
                  selectedClassId={selectedClassId}
                />
              )}

              {activeTab === 'assignments' && (
                <TchAssignments
                  assignments={data.assignments}
                  classes={data.classes}
                  studentCounts={studentCounts}
                  onAdd={addAssignment}
                  onUpdate={updateAssignment}
                  onDelete={deleteAssignment}
                />
              )}

              {activeTab === 'grades' && (
                <TchGrades
                  grades={data.grades}
                  students={data.students}
                  classes={data.classes}
                  assignments={data.assignments}
                  onAdd={addGrade}
                  onUpdate={updateGrade}
                  onDelete={deleteGrade}
                />
              )}

              {activeTab === 'analytics' && (
                <TchAnalytics
                  grades={data.grades}
                  students={data.students}
                  classes={data.classes}
                  assignments={data.assignments}
                />
              )}

              {activeTab === 'certificates' && (
                <TchCertificates
                  students={data.students}
                  classes={data.classes}
                  grades={data.grades}
                  assignments={data.assignments}
                  teacherName={data.profile.name}
                  school={data.profile.school}
                />
              )}

              {activeTab === 'lessonplans' && (
                <TchLessonPlans
                  plans={data.lessonPlans}
                  classes={data.classes}
                  onAdd={addLessonPlan}
                  onUpdate={updateLessonPlan}
                  onDelete={deleteLessonPlan}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden sticky bottom-0 z-30 bg-gray-950/95 backdrop-blur-xl
        border-t border-white/8 flex items-stretch safe-area-pb">
        {TABS.map(tab => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5
                transition-all relative ${active ? 'text-emerald-400' : 'text-gray-600 hover:text-gray-400'}`}>
              {active && (
                <motion.div
                  layoutId="teach-tab-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full"
                />
              )}
              <tab.Icon size={18} />
              <span className="text-[9px] font-medium leading-none">{tab.short}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile modal */}
      <AnimatePresence>
        {editProfile && (
          <ProfileModal
            profile={data.profile}
            onSave={p => { saveProfile(p); setEditProfile(false); }}
            onClose={() => setEditProfile(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
