/**
 * useBi — single source of truth for all bi-sheshender data.
 *
 * Supports static JSON + custom entries added via UI (localStorage).
 * To add a permanent bi-sheshen: add an object to src/data/bi-sheshender.json.
 * To add temporarily: use saveCustomBi() — persists in localStorage.
 */
import { useMemo, useState, useEffect } from 'react';
import rawBi from '@/data/bi-sheshender.json';
import type {
  BiSheshen,
  BiFilter,
  BiCenturyFilter,
  BiPeriodFilter,
  BiSortOption,
} from '@/types/bi';

export const ALL_BI = rawBi as BiSheshen[];

const LS_KEY = 'qazaq_adebiet_custom_bi';
const CHANGE_EVENT = 'bi-data-changed';

// ── localStorage helpers ───────────────────────────────────────────────────────

export function loadCustomBi(): BiSheshen[] {
  try {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? (JSON.parse(stored) as BiSheshen[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomBi(bi: BiSheshen): void {
  try {
    const existing = loadCustomBi();
    const updated = [...existing.filter((b) => b.slug !== bi.slug), bi];
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

export function deleteCustomBi(slug: string): void {
  try {
    const existing = loadCustomBi();
    const updated = existing.filter((b) => b.slug !== slug);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

function useAllBi(): BiSheshen[] {
  const [custom, setCustom] = useState<BiSheshen[]>(() => loadCustomBi());

  useEffect(() => {
    const handler = () => setCustom(loadCustomBi());
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  return useMemo(() => [...ALL_BI, ...custom], [custom]);
}

// ── helpers ───────────────────────────────────────────────────────────────────

function matchesSearch(b: BiSheshen, q: string): boolean {
  if (!q) return true;
  const term = q.toLowerCase();
  return (
    b.fullName.toLowerCase().includes(term) ||
    b.nickname.toLowerCase().includes(term) ||
    b.birthDate.includes(term) ||
    (b.deathDate?.includes(term) ?? false) ||
    b.century.toLowerCase().includes(term) ||
    b.era.toLowerCase().includes(term) ||
    b.tribe.toLowerCase().includes(term) ||
    b.region.toLowerCase().includes(term) ||
    b.historicalPeriod.toLowerCase().includes(term) ||
    b.profession.some((p) => p.toLowerCase().includes(term)) ||
    b.tags.some((t) => t.toLowerCase().includes(term)) ||
    b.description.toLowerCase().includes(term)
  );
}

function sortBi(list: BiSheshen[], sort: BiSortOption): BiSheshen[] {
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

// ── hooks ─────────────────────────────────────────────────────────────────────

export function useBi() {
  const allBi = useAllBi();

  const [filter, setFilter] = useState<BiFilter>({
    search: '',
    century: 'all',
    period: 'all',
    sort: 'birthYear',
  });

  const filtered = useMemo(() => {
    let result = allBi.filter((b) => {
      if (!matchesSearch(b, filter.search)) return false;
      if (filter.century !== 'all') {
        // century field may be 'XVII-XVIII' so check contains
        if (!b.century.includes(filter.century)) return false;
      }
      if (filter.period !== 'all' && b.historicalPeriod !== filter.period) return false;
      return true;
    });
    return sortBi(result, filter.sort);
  }, [allBi, filter]);

  const suggestions = useMemo(() => {
    if (!filter.search || filter.search.length < 2) return [];
    const term = filter.search.toLowerCase();
    return allBi
      .filter(
        (b) =>
          b.fullName.toLowerCase().includes(term) ||
          b.nickname.toLowerCase().includes(term),
      )
      .slice(0, 6)
      .map((b) => ({ slug: b.slug, label: b.fullName }));
  }, [allBi, filter.search]);

  return {
    biList: filtered,
    total: allBi.length,
    filter,
    suggestions,
    setFilter: (partial: Partial<BiFilter>) =>
      setFilter((prev) => ({ ...prev, ...partial })),
    resetFilter: () =>
      setFilter({ search: '', century: 'all', period: 'all', sort: 'birthYear' }),
  };
}

export function useBiBySlug(slug: string | undefined): BiSheshen | undefined {
  const allBi = useAllBi();
  return useMemo(
    () => (slug ? allBi.find((b) => b.slug === slug) : undefined),
    [allBi, slug],
  );
}

export function useRelatedBi(slugs: string[]): BiSheshen[] {
  const allBi = useAllBi();
  return useMemo(
    () =>
      slugs
        .map((s) => allBi.find((b) => b.slug === s))
        .filter((b): b is BiSheshen => Boolean(b)),
    [allBi, slugs],
  );
}
