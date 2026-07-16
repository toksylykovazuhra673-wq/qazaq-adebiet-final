/**
 * useWriters — the single source of truth for all writer data.
 *
 * All components that display writers read from this hook.
 * Adding a new writer to src/data/writers.json is all that is needed —
 * no code changes anywhere else are required.
 */
import { useMemo, useState } from 'react';
import rawWriters from '@/data/writers.json';
import type {
  Writer,
  WritersFilter,
  WriterCenturyFilter,
  WriterMovementFilter,
  WriterGenreFilter,
  WriterSortOption,
} from '@/types/writer';

const ALL_WRITERS = rawWriters as Writer[];

// ── helpers ──────────────────────────────────────────────────────────────────

function matchesSearch(writer: Writer, q: string): boolean {
  if (!q) return true;
  const term = q.toLowerCase();
  return (
    writer.fullName.toLowerCase().includes(term) ||
    writer.shortName.toLowerCase().includes(term) ||
    writer.nickname.toLowerCase().includes(term) ||
    writer.birthDate.includes(term) ||
    (writer.deathDate?.includes(term) ?? false) ||
    writer.era.toLowerCase().includes(term) ||
    writer.literaryMovement.toLowerCase().includes(term) ||
    writer.genre.some((g) => g.toLowerCase().includes(term)) ||
    writer.tags.some((t) => t.toLowerCase().includes(term)) ||
    writer.description.toLowerCase().includes(term)
  );
}

function matchesGenre(writer: Writer, genre: WriterGenreFilter): boolean {
  if (genre === 'all') return true;
  return writer.genre.includes(genre);
}

function sortWriters(writers: Writer[], sort: WriterSortOption): Writer[] {
  const copy = [...writers];
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

// ── hook ─────────────────────────────────────────────────────────────────────

export function useWriters() {
  const [filter, setFilter] = useState<WritersFilter>({
    search: '',
    century: 'all',
    movement: 'all',
    genre: 'all',
    sort: 'alpha',
  });

  const filtered = useMemo(() => {
    let result = ALL_WRITERS.filter((writer) => {
      if (!matchesSearch(writer, filter.search)) return false;
      if (filter.century !== 'all' && writer.century !== filter.century) return false;
      if (filter.movement !== 'all' && writer.literaryMovement !== filter.movement) return false;
      if (!matchesGenre(writer, filter.genre)) return false;
      return true;
    });
    return sortWriters(result, filter.sort);
  }, [filter]);

  /** Autocomplete suggestions based on current search query */
  const suggestions = useMemo(() => {
    if (!filter.search || filter.search.length < 2) return [];
    const term = filter.search.toLowerCase();
    return ALL_WRITERS.filter(
      (w) =>
        w.fullName.toLowerCase().includes(term) ||
        w.shortName.toLowerCase().includes(term),
    )
      .slice(0, 6)
      .map((w) => ({ slug: w.slug, label: w.fullName }));
  }, [filter.search]);

  return {
    /** Filtered + sorted list — derived entirely from writers.json */
    writers: filtered,
    /** Total number of writers in the JSON */
    total: ALL_WRITERS.length,
    /** Current filter state */
    filter,
    /** Autocomplete suggestions */
    suggestions,
    /** Update one or more filter fields */
    setFilter: (partial: Partial<WritersFilter>) =>
      setFilter((prev) => ({ ...prev, ...partial })),
    /** Reset all filters */
    resetFilter: () =>
      setFilter({ search: '', century: 'all', movement: 'all', genre: 'all', sort: 'alpha' }),
  };
}

/**
 * Get a single writer by slug — reads directly from writers.json.
 * Returns undefined if the slug doesn't exist.
 */
export function useWriterBySlug(slug: string | undefined): Writer | undefined {
  return useMemo(
    () => (slug ? ALL_WRITERS.find((w) => w.slug === slug) : undefined),
    [slug],
  );
}

/**
 * Get related writers for a given writer (by relatedWriters slug array).
 */
export function useRelatedWriters(slugs: string[]): Writer[] {
  return useMemo(
    () =>
      slugs
        .map((s) => ALL_WRITERS.find((w) => w.slug === s))
        .filter((w): w is Writer => Boolean(w)),
    [slugs],
  );
}

/** Expose the raw list for use outside components (e.g. stats). */
export { ALL_WRITERS };
