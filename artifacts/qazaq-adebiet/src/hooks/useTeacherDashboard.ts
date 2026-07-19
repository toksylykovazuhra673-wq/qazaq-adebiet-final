import { useState, useCallback } from 'react';
import type {
  TeacherData, TeacherProfile, ClassRecord, Student,
  Assignment, GradeRecord, LessonPlan,
} from '@/types/teacher';

// ── Storage ───────────────────────────────────────────────────────────────────
const KEY = 'teacher_data';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const CLASS_COLORS = [
  'from-violet-600 to-purple-500',
  'from-blue-600 to-indigo-500',
  'from-emerald-600 to-teal-500',
  'from-orange-500 to-amber-400',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-blue-500',
];

const SEED_DATA: TeacherData = {
  profile: { name: 'Мұғалім', school: 'Мектеп', subject: 'Қазақ Әдебиеті', experience: '5 жыл' },
  classes: [
    { id: 'cls1', name: '9-А сынып', subject: 'Қазақ Әдебиеті', grade: 9, year: '2025-2026', color: CLASS_COLORS[0], createdAt: Date.now() },
    { id: 'cls2', name: '10-Б сынып', subject: 'Қазақ Тілі мен Әдебиеті', grade: 10, year: '2025-2026', color: CLASS_COLORS[1], createdAt: Date.now() },
  ],
  students: [
    { id: 's1', name: 'Айгерім Бекова', classId: 'cls1', joinedAt: Date.now() },
    { id: 's2', name: 'Бекзат Нұрланов', classId: 'cls1', joinedAt: Date.now() },
    { id: 's3', name: 'Дана Мәдиева', classId: 'cls1', joinedAt: Date.now() },
    { id: 's4', name: 'Ерлан Сейтқалиев', classId: 'cls1', joinedAt: Date.now() },
    { id: 's5', name: 'Жанар Омарова', classId: 'cls2', joinedAt: Date.now() },
    { id: 's6', name: 'Зарина Қасымова', classId: 'cls2', joinedAt: Date.now() },
  ],
  assignments: [
    {
      id: 'a1', classId: 'cls1', title: 'Абай Қарасөздер — БЖБ', type: 'task',
      taskIds: ['t001', 't002', 't003'], dueDate: '2026-07-30', points: 20,
      instructions: 'Тесттерді 45 минут ішінде тапсырыңыз.', createdAt: Date.now(), status: 'active',
    },
    {
      id: 'a2', classId: 'cls1', title: 'Абай жолы — Мазмұны', type: 'reading',
      bookSlug: 'auezov-abai-zholy', dueDate: '2026-08-05', points: 15,
      instructions: 'Романның бірінші бөлімін оқып, конспект жазыңыз.', createdAt: Date.now(), status: 'active',
    },
  ],
  grades: [
    { id: 'g1', studentId: 's1', classId: 'cls1', assignmentId: 'a1', gradeType: 'БЖБ', score: 88, points: 18, comment: 'Жақсы', gradedAt: Date.now() },
    { id: 'g2', studentId: 's2', classId: 'cls1', assignmentId: 'a1', gradeType: 'БЖБ', score: 75, points: 15, comment: '', gradedAt: Date.now() },
    { id: 'g3', studentId: 's3', classId: 'cls1', assignmentId: 'a1', gradeType: 'БЖБ', score: 95, points: 19, comment: 'Өте жақсы!', gradedAt: Date.now() },
    { id: 'g4', studentId: 's4', classId: 'cls1', assignmentId: 'a1', gradeType: 'БЖБ', score: 62, points: 12, comment: 'Қосымша жаттығу керек', gradedAt: Date.now() },
  ],
  lessonPlans: [
    {
      id: 'lp1', title: 'Абай Құнанбайұлы — КМЖ', type: 'КМЖ', classId: 'cls1', grade: 9, quarter: 1,
      topic: 'Абай Құнанбайұлының өмірі мен шығармашылығы',
      objectives: 'Оқушылар Абайдың өмірін, поэзиясының ерекшеліктерін біледі',
      content: 'Абай Құнанбайұлы (1845-1904) — қазақ жазба поэзиясының негізін қалаушы',
      activities: '1. Өмірбаянын оқу\n2. Өлеңдерін талдау\n3. Топтық жұмыс',
      assessment: 'Тест: 10 сұрақ, ауызша жауап',
      duration: 45, createdAt: Date.now(), updatedAt: Date.now(),
    },
  ],
};

function load(): TeacherData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as TeacherData;
  } catch { /* ignore */ }
  // First run — seed with demo data
  localStorage.setItem(KEY, JSON.stringify(SEED_DATA));
  return SEED_DATA;
}

function persist(data: TeacherData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useTeacherDashboard() {
  const [data, setData] = useState<TeacherData>(load);

  const update = useCallback((fn: (d: TeacherData) => TeacherData) => {
    setData(prev => {
      const next = fn(prev);
      persist(next);
      return next;
    });
  }, []);

  // ── Profile ──────────────────────────────────────────────────────────────
  const saveProfile = useCallback((p: TeacherProfile) =>
    update(d => ({ ...d, profile: p })), [update]);

  // ── Classes ──────────────────────────────────────────────────────────────
  const addClass = useCallback((c: Omit<ClassRecord, 'id' | 'createdAt' | 'color'>) => {
    const idx = data.classes.length % CLASS_COLORS.length;
    update(d => ({
      ...d,
      classes: [...d.classes, { ...c, id: uid(), createdAt: Date.now(), color: CLASS_COLORS[idx] }],
    }));
  }, [update, data.classes.length]);

  const updateClass = useCallback((cls: ClassRecord) =>
    update(d => ({ ...d, classes: d.classes.map(c => c.id === cls.id ? cls : c) })), [update]);

  const deleteClass = useCallback((id: string) =>
    update(d => ({
      ...d,
      classes: d.classes.filter(c => c.id !== id),
      students: d.students.filter(s => s.classId !== id),
      assignments: d.assignments.filter(a => a.classId !== id),
    })), [update]);

  // ── Students ─────────────────────────────────────────────────────────────
  const addStudent = useCallback((s: Omit<Student, 'id' | 'joinedAt'>) =>
    update(d => ({ ...d, students: [...d.students, { ...s, id: uid(), joinedAt: Date.now() }] })),
  [update]);

  const updateStudent = useCallback((s: Student) =>
    update(d => ({ ...d, students: d.students.map(x => x.id === s.id ? s : x) })), [update]);

  const deleteStudent = useCallback((id: string) =>
    update(d => ({ ...d, students: d.students.filter(s => s.id !== id) })), [update]);

  // ── Assignments ───────────────────────────────────────────────────────────
  const addAssignment = useCallback((a: Omit<Assignment, 'id' | 'createdAt'>) =>
    update(d => ({ ...d, assignments: [...d.assignments, { ...a, id: uid(), createdAt: Date.now() }] })),
  [update]);

  const updateAssignment = useCallback((a: Assignment) =>
    update(d => ({ ...d, assignments: d.assignments.map(x => x.id === a.id ? a : x) })), [update]);

  const deleteAssignment = useCallback((id: string) =>
    update(d => ({ ...d, assignments: d.assignments.filter(a => a.id !== id) })), [update]);

  // ── Grades ────────────────────────────────────────────────────────────────
  const addGrade = useCallback((g: Omit<GradeRecord, 'id' | 'gradedAt'>) =>
    update(d => ({ ...d, grades: [...d.grades, { ...g, id: uid(), gradedAt: Date.now() }] })),
  [update]);

  const updateGrade = useCallback((g: GradeRecord) =>
    update(d => ({ ...d, grades: d.grades.map(x => x.id === g.id ? g : x) })), [update]);

  const deleteGrade = useCallback((id: string) =>
    update(d => ({ ...d, grades: d.grades.filter(g => g.id !== id) })), [update]);

  // ── Lesson Plans ──────────────────────────────────────────────────────────
  const addLessonPlan = useCallback((lp: Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'>) =>
    update(d => ({
      ...d,
      lessonPlans: [...d.lessonPlans, { ...lp, id: uid(), createdAt: Date.now(), updatedAt: Date.now() }],
    })), [update]);

  const updateLessonPlan = useCallback((lp: LessonPlan) =>
    update(d => ({
      ...d,
      lessonPlans: d.lessonPlans.map(x => x.id === lp.id ? { ...lp, updatedAt: Date.now() } : x),
    })), [update]);

  const deleteLessonPlan = useCallback((id: string) =>
    update(d => ({ ...d, lessonPlans: d.lessonPlans.filter(lp => lp.id !== id) })), [update]);

  return {
    data,
    // Profile
    saveProfile,
    // Classes
    addClass, updateClass, deleteClass,
    // Students
    addStudent, updateStudent, deleteStudent,
    // Assignments
    addAssignment, updateAssignment, deleteAssignment,
    // Grades
    addGrade, updateGrade, deleteGrade,
    // Lesson Plans
    addLessonPlan, updateLessonPlan, deleteLessonPlan,
  };
}
