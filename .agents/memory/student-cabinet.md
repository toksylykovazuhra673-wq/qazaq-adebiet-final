---
name: student-cabinet
description: Student cabinet architecture at /cabinet — where files live, how data flows.
---

## Route
`/cabinet` → `src/pages/cabinet/StudentCabinetPage.tsx` (no AppShell, standalone page).

## Tab files
- `tabs/CabDashboard.tsx` — overview, XP banner, stats, quick actions
- `tabs/CabLibrary.tsx` — book grid with reading progress
- `tabs/CabTests.tsx` — test results + upcoming tasks
- `tabs/CabProgress.tsx` — XP ring, achievements, streak calendar
- `tabs/CabCertificates.tsx` — auto-generated certs + print/download
- `tabs/CabOlympiada.tsx` — olympiad rounds + leaderboard

## Data hooks
- `useProgress()` — from `src/hooks/useProgress.ts`, localStorage key `ill_progress`. Returns `progress`, `level`, `xpInLevel`, `xpPerLevel`, `completedCount`, `getAchievements()`.
- `useStudentCabinet()` — from `src/hooks/useStudentCabinet.ts`, returns `profile`, `readingRecords`, `testRecords`.
- `loadReadingRecords()` — reads `dr_${slug}` localStorage keys for all 8 known book slugs.
- `buildCertificates()` — pure function combining achievements + reading + tests into `Certificate[]`.

## Types
`src/types/student.ts` — `CabTab`, `StudentProfile`, `ReadingRecord`, `TestRecord`, `Certificate`, `CertType`.

**Why:** Kept all state in localStorage (no backend); student profile saved to `student_profile` key.
