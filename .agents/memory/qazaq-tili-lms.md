---
name: Qazaq Tili LMS
description: Architecture and quirks of the Қазақ Тілі LMS artifact at /qazaq-tili/
---

## Structure
- Frontend: `artifacts/qazaq-tili/` — Vite + React + Wouter + TailwindCSS + Framer Motion
- Backend routes: `artifacts/api-server/src/routes/lms/` — courses, lessons, exercises, progress, vocabulary, grammar, dashboard, achievements, users
- DB schema: `lib/db/src/schema/lms.ts` — all LMS tables; exported via `schema/index.ts`
- Seed script: `lib/db/src/seed/lms-seed.ts` — run with `scripts/node_modules/.bin/tsx` from lib/db dir

## API route paths (registered under /api)
- GET/POST /courses, /courses/featured, /courses/by-level, /courses/:courseId
- GET /courses/:courseId/lessons, POST /lessons, GET /lessons/:lessonId
- POST /exercises/:exerciseId/submit
- GET/POST /progress, GET /progress/streak
- GET/POST /vocabulary, GET /vocabulary/categories
- GET/POST /grammar, GET /grammar/:ruleId
- GET /dashboard/summary, /dashboard/recommended, /dashboard/activity, /dashboard/platform-stats
- GET /achievements, /achievements/user
- GET /leaderboard, GET/PATCH /users/profile

## Frontend hook params — important corrections
- `useGetLeaderboard({ period })` — NOT `{ query: { period } }`
- `useListVocabulary({ search, category })` — NOT `{ query: { ... } }`
- `buttonVariants` must be explicitly exported from button.tsx (design subagent didn't add it)

## Default user
- Seeded as userId=1 (Айдана Бекова), 1240 XP, streak 7, level grade9

**Why:** Single-user demo; all progress/streak/dashboard routes hardcode userId=1 until auth is added.

## Seed
Run from `/home/runner/workspace/lib/db`:
`DATABASE_URL=postgresql://... /home/runner/workspace/scripts/node_modules/.bin/tsx src/seed/lms-seed.ts`
