import { memo } from 'react';
import { motion } from 'framer-motion';

// ── Base shimmer atom ─────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  rounded?: string;
}

export const Skeleton = memo(function Skeleton({
  className = '',
  rounded = 'rounded-xl',
}: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-white/6 ${rounded} ${className}`}
      aria-hidden="true">
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r
          from-transparent via-white/8 to-transparent"
        animate={{ translateX: ['−100%', '200%'] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
});

// ── Card skeleton ─────────────────────────────────────────────────────────────
export const CardSkeleton = memo(function CardSkeleton() {
  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12" rounded="rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-8 w-full" rounded="rounded-lg" />
    </div>
  );
});

// ── List row skeleton ─────────────────────────────────────────────────────────
export const RowSkeleton = memo(function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-white/4">
      <Skeleton className="w-8 h-8" rounded="rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-48" />
        <Skeleton className="h-2.5 w-32" />
      </div>
      <Skeleton className="h-6 w-16" rounded="rounded-full" />
    </div>
  );
});

// ── Page-level skeletons ───────────────────────────────────────────────────────

/** Generic page with header + grid of cards */
export function GridPageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="min-h-screen p-6 space-y-8" aria-label="Жүктелуде…">
      {/* Hero */}
      <div className="space-y-3 max-w-2xl">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-72" />
      </div>
      {/* Filter bar */}
      <div className="flex gap-2">
        {[80, 100, 70, 90].map(w => (
          <Skeleton key={w} className={`h-9 w-${w / 4} min-w-[60px]`} rounded="rounded-xl" />
        ))}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: cards }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}

/** Dashboard-style page (sidebar + content) */
export function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen flex" aria-label="Жүктелуде…">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 p-4 space-y-3 border-r border-white/6">
        <div className="bg-white/4 border border-white/8 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12" rounded="rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-7 w-full" rounded="rounded-xl" />)}
        </div>
        <div className="space-y-1 mt-2">
          {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
        </div>
      </aside>
      {/* Content */}
      <main className="flex-1 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-9 w-28" rounded="rounded-xl" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/4 border border-white/8 rounded-2xl p-4 space-y-2">
              <Skeleton className="w-9 h-9" rounded="rounded-xl" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <RowSkeleton key={i} />)}
        </div>
      </main>
    </div>
  );
}

/** Reader page skeleton */
export function ReaderPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col" aria-label="Оқырман жүктелуде…">
      <div className="h-16 border-b border-white/8 flex items-center px-6 gap-4">
        <Skeleton className="w-8 h-8" rounded="rounded-lg" />
        <Skeleton className="h-5 w-48" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="w-8 h-8" rounded="rounded-lg" />
          <Skeleton className="w-8 h-8" rounded="rounded-lg" />
        </div>
      </div>
      <div className="flex flex-1">
        <aside className="hidden lg:block w-72 border-r border-white/8 p-4 space-y-2">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </aside>
        <div className="flex-1 p-8 max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-4/5" />
          <div className="h-4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-10/12" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
    </div>
  );
}

/** Minimal inline spinner */
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <motion.div
      className="rounded-full border-2 border-white/15 border-t-primary"
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

/** Full-screen route-level loading fallback */
export function RouteFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={32} />
        <p className="text-muted-foreground text-sm animate-pulse">Жүктелуде…</p>
      </div>
    </div>
  );
}
