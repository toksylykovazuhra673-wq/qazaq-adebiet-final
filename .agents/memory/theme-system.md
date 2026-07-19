---
name: theme-system
description: How light/dark mode is implemented across the app.
---

## Architecture
- `src/components/ThemeProvider.tsx` — React context + localStorage (`qa-theme` key)
- `src/main.tsx` — applies theme class immediately before first render to avoid flash
- Toggle button: `<ThemeToggle />` component from `ThemeProvider.tsx`, used in `Header.tsx`

## CSS variables
- `:root` = light mode variables (background 250 30% 97%, etc.)
- `.dark` = dark mode variables (background 250 33% 8%, etc.)
- Body background uses `var(--body-bg-start/mid/end)` CSS vars (defined in both `:root` and `.dark`)
- `transition: background 0.3s ease` on body for smooth switching

## glass-panel / glass-card in light mode
- Extra rule: `:root:not(.dark) .glass-panel { background: rgba(255,255,255,0.65); border-color: rgba(139,92,246,0.15); }`

## Immersive pages (always dark)
- `StudentCabinetPage` and `TeacherDashboardPage` outermost div has `className="dark min-h-screen bg-gray-950 ..."`
- This pins them to dark palette regardless of app theme

**Why:** Cabinet/teacher are immersive dark-themed UIs (like Discord's server panel); forcing dark on them preserves design intent while allowing the main literary site to have a proper light mode.

**How to apply:** Any new full-screen immersive dark page should add `dark` as the first class on its outermost wrapper div.
