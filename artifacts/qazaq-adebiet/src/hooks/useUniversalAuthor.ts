import { useMemo } from 'react';
import authorsData from '@/data/universal-authors.json';
import type { UniversalAuthor, AuthorCategory, UniversalFilterState } from '@/types/universal-author';

const authors = authorsData as UniversalAuthor[];

// ─── Main hook: list + filter ───────────────────────────────
export function useUniversalAuthors(filters: UniversalFilterState) {
  return useMemo(() => {
    let result = [...authors];

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter((a) => a.category === filters.category);
    }

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.profession.some((p) => p.toLowerCase().includes(q)) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (filters.sort) {
      case 'name':
        result.sort((a, b) => a.fullName.localeCompare(b.fullName, 'kk'));
        break;
      case 'year':
        result.sort((a, b) => Number(a.birthDate) - Number(b.birthDate));
        break;
      case 'views':
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'works':
        result.sort((a, b) => b.worksCount - a.worksCount);
        break;
    }

    return result;
  }, [filters]);
}

// ─── Single author by category + slug ──────────────────────
export function useUniversalAuthorBySlug(
  category: string,
  slug: string
): UniversalAuthor | undefined {
  return useMemo(
    () => authors.find((a) => a.category === category && a.slug === slug),
    [category, slug]
  );
}

// ─── Related authors ────────────────────────────────────────
export function useRelatedUniversalAuthors(
  current: UniversalAuthor
): UniversalAuthor[] {
  return useMemo(() => {
    if (!current.relatedSlugs?.length) {
      // Fallback: same category, different author
      return authors
        .filter((a) => a.category === current.category && a.slug !== current.slug)
        .slice(0, 4);
    }
    const related = current.relatedSlugs
      .map((slug) => authors.find((a) => a.slug === slug))
      .filter(Boolean) as UniversalAuthor[];
    // Fill up to 4 from same category if needed
    if (related.length < 4) {
      const extras = authors.filter(
        (a) =>
          a.category === current.category &&
          a.slug !== current.slug &&
          !related.some((r) => r.slug === a.slug)
      );
      related.push(...extras.slice(0, 4 - related.length));
    }
    return related.slice(0, 4);
  }, [current]);
}

// ─── All authors (for search suggestions) ──────────────────
export function useAllUniversalAuthors(): UniversalAuthor[] {
  return authors;
}

// ─── Category label map ─────────────────────────────────────
export const CATEGORY_LABELS: Record<AuthorCategory | 'all', string> = {
  all: 'Барлығы',
  poets: 'Ақындар',
  writers: 'Жазушылар',
  zhyrau: 'Жыраулар',
  'bi-sheshender': 'Би-шешендер',
  educators: 'Ағартушылар',
};

export const CATEGORY_COLORS: Record<AuthorCategory, string> = {
  poets: 'from-violet-500 to-purple-600',
  writers: 'from-blue-500 to-indigo-600',
  zhyrau: 'from-amber-500 to-orange-600',
  'bi-sheshender': 'from-emerald-500 to-teal-600',
  educators: 'from-rose-500 to-pink-600',
};

export const CATEGORY_ACCENT: Record<AuthorCategory, string> = {
  poets: 'text-violet-400',
  writers: 'text-blue-400',
  zhyrau: 'text-amber-400',
  'bi-sheshender': 'text-emerald-400',
  educators: 'text-rose-400',
};

export const CATEGORY_BADGE: Record<AuthorCategory, string> = {
  poets: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
  writers: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  zhyrau: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  'bi-sheshender': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  educators: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
};
