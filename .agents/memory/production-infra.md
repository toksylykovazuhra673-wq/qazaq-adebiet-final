---
name: production-infra
description: Production-readiness infrastructure — lazy loading, error boundaries, skeletons, image optimization.
---

## Lazy loading (App.tsx)
- `HomePage` and `NotFound` are eager (tiny, needed immediately)
- ALL other pages use `React.lazy()` + `Suspense`
- Grouped by bundle purpose: literature pages, reader pages, analysis, interactive, user modules
- Four Suspense wrappers: `<Page>` (RouteFallback), `<GridPage>` (GridPageSkeleton), `<ReaderPage>` (ReaderPageSkeleton), `<DashPage>` (DashboardPageSkeleton)
- Each wrapper also wraps an `<ErrorBoundary>`

## QueryClient config (App.tsx)
```ts
new QueryClient({
  defaultOptions: { queries: { staleTime: 5*60*1000, gcTime: 15*60*1000, retry: 1, refetchOnWindowFocus: false } }
})
```

## Error Boundary
- `src/components/ErrorBoundary.tsx` — class component
- Shows error message + Retry + Home button fallback UI
- Dev mode: shows error.message in pre block
- Exports: `ErrorBoundary` (class), `RouteErrorBoundary` (convenience wrapper)
- Reset: via `resetKey` prop or clicking "Қайталау" button

## Skeleton components (src/components/PageSkeleton.tsx)
- `Skeleton` — base shimmer atom (framer-motion translateX animation)
- `CardSkeleton`, `RowSkeleton` — reusable atoms
- `GridPageSkeleton` — hero + filter bar + grid of cards
- `DashboardPageSkeleton` — sidebar + stat cards + list rows
- `ReaderPageSkeleton` — header bar + sidebar + text lines
- `RouteFallback` — centered spinner (used for generic pages)
- `Spinner` — inline spinner

## LazyImage (src/components/ui/LazyImage.tsx)
- IntersectionObserver with 200px rootMargin
- Shows Skeleton shimmer until image enters viewport + loads
- Handles error → falls back to `fallback` prop (default: /placeholder.svg)
- Supports `aspectRatio` prop for stable layout

**Why:** These were all missing; adding them moves the app from demo quality to production quality without changing any existing feature behavior.
