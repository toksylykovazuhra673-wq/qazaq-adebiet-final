/**
 * useZhyrau — single source of truth for all zhyrau data.
 *
 * Supports both static JSON data and custom zhyrau added via the UI (stored in localStorage).
 * To add a permanent zhyrau: add an object to src/data/zhyrau.json.
 * To add a temporary zhyrau: use saveCustomZhyrau() — it persists in localStorage.
 */
import { useMemo, useState, useEffect } from 'react';
import rawZhyrau from '@/data/zhyrau.json';
import type {
  Zhyrau,
  ZhyrauFilter,
  ZhyrauCenturyFilter,
  ZhyrauPeriodFilter,
  ZhyrauSortOption,
} from '@/types/zhyrau';

export const ALL_ZHYRAU = rawZhyrau as Zhyrau[];

const LS_KEY = 'qazaq_adebiet_custom_zhyrau';
const CHANGE_EVENT = 'zhyrau-data-changed';

// ── localStorage helpers ───────────────────────────────────────────────────────

export function loadCustomZhyrau(): Zhyrau[] {
  try {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? (JSON.parse(stored) as Zhyrau[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomZhyrau(zhyrau: Zhyrau): void {
  try {
    const existing = loadCustomZhyrau();
    const updated = [...existing.filter((z) => z.slug !== zhyrau.slug), zhyrau];
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

export function deleteCustomZhyrau(slug: string): void {
  try {
    const existing = loadCustomZhyrau();
    const updated = existing.filter((z) => z.slug !== slug);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

/** Returns a merged list: static JSON + custom localStorage */
function useAllZhyrau(): Zhyrau[] {
  const [custom, setCustom] = useState<Zhyrau[]>(() => loadCustomZhyrau());

  useEffect(() => {
    const handler = () => setCustom(loadCustomZhyrau());
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  return useMemo(() => [...ALL_ZHYRAU, ...custom], [custom]);
}

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
  const allZhyrau = useAllZhyrau();

  const [filter, setFilter] = useState<ZhyrauFilter>({
    search: '',
    century: 'all',
    period: 'all',
    sort: 'birthYear',
  });

  const filtered = useMemo(() => {
    let result = allZhyrau.filter((z) => {
      if (!matchesSearch(z, filter.search)) return false;
      if (filter.century !== 'all' && z.century !== filter.century) return false;
      if (filter.period !== 'all' && z.historicalPeriod !== filter.period) return false;
      return true;
    });
    return sortZhyrau(result, filter.sort);
  }, [allZhyrau, filter]);

  const suggestions = useMemo(() => {
    if (!filter.search || filter.search.length < 2) return [];
    const term = filter.search.toLowerCase();
    return allZhyrau
      .filter(
        (z) =>
          z.fullName.toLowerCase().includes(term) ||
          z.nickname.toLowerCase().includes(term),
      )
      .slice(0, 6)
      .map((z) => ({ slug: z.slug, label: z.fullName }));
  }, [allZhyrau, filter.search]);

  return {
    zhyrauList: filtered,
    total: allZhyrau.length,
    filter,
    suggestions,
    setFilter: (partial: Partial<ZhyrauFilter>) =>
      setFilter((prev) => ({ ...prev, ...partial })),
    resetFilter: () =>
      setFilter({ search: '', century: 'all', period: 'all', sort: 'birthYear' }),
  };
}

export function useZhyrauBySlug(slug: string | undefined): Zhyrau | undefined {
  const allZhyrau = useAllZhyrau();
  return useMemo(
    () => (slug ? allZhyrau.find((z) => z.slug === slug) : undefined),
    [allZhyrau, slug],
  );
}

export function useRelatedZhyrau(slugs: string[]): Zhyrau[] {
  const allZhyrau = useAllZhyrau();
  return useMemo(
    () =>
      slugs
        .map((s) => allZhyrau.find((z) => z.slug === s))
        .filter((z): z is Zhyrau => Boolean(z)),
    [allZhyrau, slugs],
  );
}
