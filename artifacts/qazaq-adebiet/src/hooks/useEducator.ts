/**
 * useEducator — single source of truth for all educators data.
 *
 * All data comes from src/data/educators.json.
 * To add a new educator: add an object to educators.json — no code changes needed.
 */
import { useMemo, useState } from 'react';
import rawEducators from '@/data/educators.json';
import type {
  Educator,
  EducatorFilter,
  EducatorCentury,
  EducatorProfessionFilter,
  EducatorSortOption,
} from '@/types/educator';

export const ALL_EDUCATORS = rawEducators as Educator[];

const DEFAULT_FILTER: EducatorFilter = {
  search: '',
  century: 'all',
  profession: 'all',
  sort: 'birthYear',
};

// ── Search suggestions ────────────────────────────────────────────────────────

function buildSuggestions(
  list: Educator[],
  search: string
): { slug: string; label: string }[] {
  if (!search.trim()) return [];
  const q = search.toLowerCase();
  return list
    .filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.scientificField.toLowerCase().includes(q) ||
        e.profession.some((p) => p.toLowerCase().includes(q)) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    )
    .slice(0, 6)
    .map((e) => ({ slug: e.slug, label: e.fullName }));
}

// ── Sorting ───────────────────────────────────────────────────────────────────

function sortEducators(list: Educator[], sort: EducatorSortOption): Educator[] {
  return [...list].sort((a, b) => {
    switch (sort) {
      case 'birthYear':
        return Number(a.birthDate) - Number(b.birthDate);
      case 'alpha':
        return a.fullName.localeCompare(b.fullName, 'kk');
      case 'viewCount':
        return b.viewCount - a.viewCount;
      case 'popular':
        return Number(b.popular) - Number(a.popular);
      default:
        return 0;
    }
  });
}

// ── Main hook ─────────────────────────────────────────────────────────────────

export function useEducator() {
  const [filter, setFilterState] = useState<EducatorFilter>(DEFAULT_FILTER);

  const setFilter = (partial: Partial<EducatorFilter>) =>
    setFilterState((prev) => ({ ...prev, ...partial }));

  const resetFilter = () => setFilterState(DEFAULT_FILTER);

  const educatorList = useMemo(() => {
    let list = ALL_EDUCATORS;

    // Search
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.biography.toLowerCase().includes(q) ||
          e.scientificField.toLowerCase().includes(q) ||
          e.literaryField.toLowerCase().includes(q) ||
          e.profession.some((p) => p.toLowerCase().includes(q)) ||
          e.books.some(
            (b) =>
              b.title.toLowerCase().includes(q) ||
              b.description.toLowerCase().includes(q)
          ) ||
          e.scientificWorks.some((w) => w.title.toLowerCase().includes(q)) ||
          e.articles.some((a) => a.title.toLowerCase().includes(q)) ||
          e.research.some((r) => r.title.toLowerCase().includes(q)) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          String(e.birthDate).includes(filter.search) ||
          String(e.deathDate ?? '').includes(filter.search)
      );
    }

    // Century filter
    if (filter.century !== 'all') {
      list = list.filter((e) => e.century === filter.century);
    }

    // Profession filter
    if (filter.profession !== 'all') {
      list = list.filter((e) =>
        e.profession.some((p) => p === filter.profession)
      );
    }

    return sortEducators(list, filter.sort);
  }, [filter]);

  const suggestions = useMemo(
    () => buildSuggestions(ALL_EDUCATORS, filter.search),
    [filter.search]
  );

  return {
    educatorList,
    total: ALL_EDUCATORS.length,
    filter,
    setFilter,
    resetFilter,
    suggestions,
  };
}

// ── Single educator hooks ─────────────────────────────────────────────────────

export function useEducatorBySlug(slug: string | undefined): Educator | undefined {
  return useMemo(
    () => ALL_EDUCATORS.find((e) => e.slug === slug),
    [slug]
  );
}

export function useRelatedEducators(slugs: string[]): Educator[] {
  return useMemo(
    () => slugs.map((s) => ALL_EDUCATORS.find((e) => e.slug === s)).filter(Boolean) as Educator[],
    [slugs]
  );
}
