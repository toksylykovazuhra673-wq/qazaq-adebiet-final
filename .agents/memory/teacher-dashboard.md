---
name: teacher-dashboard
description: Teacher Dashboard architecture at /mugalim — where files live, how data flows, CSS quirks.
---

## Route
`/mugalim` → `src/pages/teacher/TeacherDashboardPage.tsx` (no AppShell, standalone dark page).

## Tab files (src/pages/teacher/tabs/)
- `TchClasses.tsx` — class management (CRUD)
- `TchStudents.tsx` — student roster, bulk-add
- `TchAssignments.tsx` — assign tasks/reading/analysis/essay/project
- `TchGrades.tsx` — grade book (БЖБ/ТЖБ/ҚМЖ/Тест/Жоба/Реферат)
- `TchAnalytics.tsx` — class/student statistics, top/bottom students
- `TchCertificates.tsx` — print certificates via window.open + window.print()
- `TchLessonPlans.tsx` — КМЖ/БЖБ/ТЖБ lesson plan CRUD + print

## Data
- Hook: `src/hooks/useTeacherDashboard.ts`
- localStorage key: `teacher_data` (full TeacherData object)
- Types: `src/types/teacher.ts`

## CSS quirk
- `src/pages/teacher/teacher.css` uses `@apply` — requires `@reference "../../index.css";` at top (Tailwind v4 rule)
- Classes: `.input-field`, `.btn-primary`, `.btn-ghost`

## Dark mode
- Page wrapper has `className="dark min-h-screen bg-gray-950 ..."` — forces dark mode regardless of app theme

**Why:** Teacher/student cabinet pages are immersive dark UIs; they pin the dark palette even when the main site is in light mode.
