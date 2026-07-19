/**
 * usePoets — the single source of truth for all poet data.
 *
 * All components that display poets read from this hook.
 * Adding a new poet to src/data/poets.json is all that is needed —
 * no code changes anywhere else are required.
 * Custom poets added via the UI are stored in localStorage.
 */
import { useMemo, useState, useEffect } from 'react';
import rawPoets from '@/data/poets.json';
import type { Poet, PoetsFilter, CenturyFilter, MovementFilter, SortOption } from '@/types/poet';

const STATIC_POETS = rawPoets as Poet[];

// ── localStorage helpers ──────────────────────────────────────────────────────

const LS_KEY = 'qazaq_adebiet_custom_poets';
const CHANGE_EVENT = 'poets-data-changed';

export function loadCustomPoets(): Poet[] {
  try {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? (JSON.parse(stored) as Poet[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomPoet(poet: Poet): void {
  try {
    const existing = loadCustomPoets();
    const updated = [...existing.filter((p) => p.slug !== poet.slug), poet];
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

export function deleteCustomPoet(slug: string): void {
  try {
    const existing = loadCustomPoets();
    const updated = existing.filter((p) => p.slug !== slug);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

/** Returns merged list: static JSON + custom localStorage */
function useAllPoets(): Poet[] {
  const [custom, setCustom] = useState<Poet[]>(() => loadCustomPoets());

  useEffect(() => {
    const handler = () => setCustom(loadCustomPoets());
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  return useMemo(() => [...STATIC_POETS, ...custom], [custom]);
}

/** @deprecated use useAllPoets() inside components instead */
const ALL_POETS = STATIC_POETS;

// ── helpers ──────────────────────────────────────────────────────────────────

function matchesSearch(poet: Poet, q: string): boolean {
  if (!q) return true;
  const term = q.toLowerCase();
  return (
    poet.fullName.toLowerCase().includes(term) ||
    poet.shortName.toLowerCase().includes(term) ||
    poet.nickname.toLowerCase().includes(term) ||
    poet.birthDate.includes(term) ||
    (poet.deathDate?.includes(term) ?? false) ||
    poet.era.toLowerCase().includes(term) ||
    poet.literaryMovement.toLowerCase().includes(term) ||
    poet.tags.some((t) => t.toLowerCase().includes(term)) ||
    poet.description.toLowerCase().includes(term)
  );
}

function sortPoets(poets: Poet[], sort: SortOption): Poet[] {
  const copy = [...poets];
  switch (sort) {
    case 'alpha':
      return copy.sort((a, b) => a.fullName.localeCompare(b.fullName, 'kk'));
    case 'birthYear':
      return copy.sort((a, b) => {
        const ay = parseInt(a.birthDate);
        const by = parseInt(b.birthDate);
        return ay - by;
      });
    case 'popular':
      return copy.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    case 'viewCount':
      return copy.sort((a, b) => b.viewCount - a.viewCount);
    case 'addedDate':
      return copy.sort(
        (a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime(),
      );
    default:
      return copy;
  }
}

// ── hook ─────────────────────────────────────────────────────────────────────

export function usePoets() {
  const allPoets = useAllPoets();
  const [filter, setFilter] = useState<PoetsFilter>({
    search: '',
    century: 'all',
    movement: 'all',
    sort: 'alpha',
  });

  const filtered = useMemo(() => {
    let result = allPoets.filter((poet) => {
      if (!matchesSearch(poet, filter.search)) return false;
      if (filter.century !== 'all' && poet.century !== filter.century) return false;
      if (filter.movement !== 'all' && poet.literaryMovement !== filter.movement) return false;
      return true;
    });
    return sortPoets(result, filter.sort);
  }, [filter, allPoets]);

  /** Autocomplete suggestions based on current search query */
  const suggestions = useMemo(() => {
    if (!filter.search || filter.search.length < 2) return [];
    const term = filter.search.toLowerCase();
    return allPoets
      .filter(
        (p) =>
          p.fullName.toLowerCase().includes(term) ||
          p.shortName.toLowerCase().includes(term),
      )
      .slice(0, 6)
      .map((p) => ({ slug: p.slug, label: p.fullName }));
  }, [filter.search, allPoets]);

  return {
    /** Filtered + sorted list — merged from poets.json + localStorage */
    poets: filtered,
    /** Total number of poets (static + custom) */
    total: allPoets.length,
    /** Current filter state */
    filter,
    /** Autocomplete suggestions */
    suggestions,
    /** Update one or more filter fields */
    setFilter: (partial: Partial<PoetsFilter>) =>
      setFilter((prev) => ({ ...prev, ...partial })),
    /** Reset all filters */
    resetFilter: () =>
      setFilter({ search: '', century: 'all', movement: 'all', sort: 'alpha' }),
  };
}

/**
 * Get a single poet by slug — checks both static JSON and localStorage.
 * Returns undefined if the slug doesn't exist.
 */
export function usePoetBySlug(slug: string | undefined): Poet | undefined {
  const allPoets = useAllPoets();
  return useMemo(
    () => (slug ? allPoets.find((p) => p.slug === slug) : undefined),
    [slug, allPoets],
  );
}

/**
 * Get related poets for a given poet (by relatedPoets slug array).
 */
export function useRelatedPoets(slugs: string[]): Poet[] {
  const allPoets = useAllPoets();
  return useMemo(
    () =>
      slugs
        .map((s) => allPoets.find((p) => p.slug === s))
        .filter((p): p is Poet => Boolean(p)),
    [slugs, allPoets],
  );
}

/** Expose the static list for use outside of components (e.g. stats). */
export { ALL_POETS };
