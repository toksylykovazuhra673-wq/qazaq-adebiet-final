// ── Teacher Dashboard Types ───────────────────────────────────────────────

export type TeachTab =
  | 'classes'
  | 'students'
  | 'assignments'
  | 'grades'
  | 'analytics'
  | 'certificates'
  | 'lessonplans'
  | 'uploads';

export interface TeacherProfile {
  name: string;
  school: string;
  subject: string;
  experience: string;
}

// ── Class ────────────────────────────────────────────────────────────────────
export interface ClassRecord {
  id: string;
  name: string;        // "9-А сынып"
  subject: string;     // "Қазақ Әдебиеті"
  grade: number;       // 9
  year: string;        // "2025-2026"
  color: string;       // tailwind gradient
  createdAt: number;
}

// ── Student ──────────────────────────────────────────────────────────────────
export interface Student {
  id: string;
  name: string;
  classId: string;
  email?: string;
  joinedAt: number;
}

// ── Assignment ───────────────────────────────────────────────────────────────
export type AssignmentType = 'task' | 'analysis' | 'reading' | 'essay' | 'project';

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  type: AssignmentType;
  taskIds?: string[];
  bookSlug?: string;
  analysisSlug?: string;
  dueDate: string;       // ISO date string
  points: number;
  instructions: string;
  createdAt: number;
  status: 'draft' | 'active' | 'closed';
}

// ── Grade ────────────────────────────────────────────────────────────────────
export type GradeType = 'БЖБ' | 'ТЖБ' | 'ҚМЖ' | 'Тест' | 'Жоба' | 'Реферат';

export interface GradeRecord {
  id: string;
  studentId: string;
  classId: string;
  assignmentId: string;
  gradeType: GradeType;
  score: number;     // 0-100
  points: number;
  comment?: string;
  gradedAt: number;
}

// ── Lesson Plan ──────────────────────────────────────────────────────────────
export type PlanType = 'КМЖ' | 'БЖБ' | 'ТЖБ';

export interface LessonPlan {
  id: string;
  title: string;
  type: PlanType;
  classId?: string;
  grade: number;
  quarter: number;     // 1-4
  topic: string;
  objectives: string;
  content: string;
  activities: string;
  assessment: string;
  duration: number;    // minutes
  createdAt: number;
  updatedAt: number;
}

// ── Full teacher state stored in localStorage ─────────────────────────────
export interface TeacherData {
  profile: TeacherProfile;
  classes: ClassRecord[];
  students: Student[];
  assignments: Assignment[];
  grades: GradeRecord[];
  lessonPlans: LessonPlan[];
}
