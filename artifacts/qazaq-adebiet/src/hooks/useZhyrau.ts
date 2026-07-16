/**
 * useZhyrau — single source of truth for all zhyrau data.
 *
 * Adding a new zhyrau to src/data/zhyrau.json is all that is needed —
 * no code changes anywhere else are required.
 */
import { useMemo, useState } from 'react';
import rawZhyrau from '@/data/zhyrau.json';
import type {
  Zhyrau,
  ZhyrauFilter,
  ZhyrauCenturyFilter,
  ZhyrauPeriodFilter,
  ZhyrauSortOption,
} from '@/types/zhyrau';

export const ALL_ZHYRAU = rawZhyrau as Zhyrau[];

// ── helpers ───────────────────────────────────────────────────────────────────

function matchesSearch(z: Zhyrau, q: string): boolean {
  if (!q) return true;
  const term = q.toLowerCase();
  return (
    z.fullName.toLowerCase().includes(term) ||
    z.nickname.toLowerCase().includes(term) ||
    z.birthDate.includes(term) ||
    (z.deathDate?.includes(term) ?? false) ||
    z.century.toLowerCase().includes(term) ||
    z.era.toLowerCase().includes(term) ||
    z.historicalPeriod.toLowerCase().includes(term) ||
    z.khanPeriod.toLowerCase().includes(term) ||
    z.tags.some((t) => t.toLowerCase().includes(term)) ||
    z.description.toLowerCase().includes(term)
  );
}

function sortZhyrau(list: Zhyrau[], sort: ZhyrauSortOption): Zhyrau[] {
  const copy = [...list];
  switch (sort) {
    case 'alpha':
      return copy.sort((a, b) => a.fullName.localeCompare(b.fullName, 'kk'));
    case 'birthYear':
      return copy.sort((a, b) => parseInt(a.birthDate) - parseInt(b.birthDate));
    case 'viewCount':
      return copy.sort((a, b) => b.viewCount - a.viewCount);
    case 'popular':
      return copy.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    case 'addedDate':
      return copy.sort(
        (a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime(),
      );
    default:
      return copy;
  }
}

// ── hook ──────────────────────────────────────────────────────────────────────

export function useZhyrau() {
  const [filter, setFilter] = useState<ZhyrauFilter>({
    search: '',
    century: 'all',
    period: 'all',
    sort: 'birthYear',
  });

  const filtered = useMemo(() => {
    let result = ALL_ZHYRAU.filter((z) => {
      if (!matchesSearch(z, filter.search)) return false;
      if (filter.century !== 'all' && z.century !== filter.century) return false;
      if (filter.period !== 'all' && z.historicalPeriod !== filter.period) return false;
      return true;
    });
    return sortZhyrau(result, filter.sort);
  }, [filter]);

  const suggestions = useMemo(() => {
    if (!filter.search || filter.search.length < 2) return [];
    const term = filter.search.toLowerCase();
    return ALL_ZHYRAU.filter(
      (z) =>
        z.fullName.toLowerCase().includes(term) ||
        z.nickname.toLowerCase().includes(term),
    )
      .slice(0, 6)
      .map((z) => ({ slug: z.slug, label: z.fullName }));
  }, [filter.search]);

  return {
    zhyrauList: filtered,
    total: ALL_ZHYRAU.length,
    filter,
    suggestions,
    setFilter: (partial: Partial<ZhyrauFilter>) =>
      setFilter((prev) => ({ ...prev, ...partial })),
    resetFilter: () =>
      setFilter({ search: '', century: 'all', period: 'all', sort: 'birthYear' }),
  };
}

export function useZhyrauBySlug(slug: string | undefined): Zhyrau | undefined {
  return useMemo(
    () => (slug ? ALL_ZHYRAU.find((z) => z.slug === slug) : undefined),
    [slug],
  );
}

export function useRelatedZhyrau(slugs: string[]): Zhyrau[] {
  return useMemo(
    () =>
      slugs
        .map((s) => ALL_ZHYRAU.find((z) => z.slug === s))
        .filter((z): z is Zhyrau => Boolean(z)),
    [slugs],
  );
}
