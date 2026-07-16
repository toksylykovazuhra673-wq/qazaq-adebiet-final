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
  WriterSpecialFilter,
  WritersStats,
} from '@/types/writer';

const ALL_WRITERS = rawWriters as Writer[];

// ── Derived global stats ──────────────────────────────────────────────────────
export const WRITERS_STATS: WritersStats = {
  totalWriters: ALL_WRITERS.length,
  totalWorks:   ALL_WRITERS.reduce((sum, w) => sum + (w.worksCount ?? 0), 0),
  totalPdf:     ALL_WRITERS.reduce((sum, w) => sum + (w.pdf?.length ?? 0), 0),
  totalAudio:   ALL_WRITERS.reduce((sum, w) => sum + (w.audio?.length ?? 0), 0),
  totalQuotes:  ALL_WRITERS.reduce((sum, w) => sum + (w.quotesCount ?? 0), 0),
};

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
    writer.description.toLowerCase().includes(term) ||
    writer.birthPlace.toLowerCase().includes(term) ||
    writer.works.some((wk) => wk.title.toLowerCase().includes(term))
  );
}

function matchesAlphabet(writer: Writer, letter: string): boolean {
  if (!letter) return true;
  return writer.fullName.startsWith(letter);
}

function matchesSpecial(writer: Writer, special: WriterSpecialFilter): boolean {
  switch (special) {
    case 'all':         return true;
    case 'alash':       return writer.literaryMovement === 'Алаш';
    case 'soviet':      return writer.literaryMovement === 'Кеңес дәуірі';
    case 'children':    return writer.genre.includes('Балалар әдебиеті');
    case 'drama':       return writer.genre.includes('Пьеса') || writer.profession.includes('Драматург');
    case 'poet-writer': return writer.profession.includes('Ақын') || writer.profession.includes('Жазушы');
    case 'featured':    return writer.featured;
    default:            return true;
  }
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
    alphabet: '',
    specialFilter: 'all',
  });

  const filtered = useMemo(() => {
    let result = ALL_WRITERS.filter((writer) => {
      if (!matchesSearch(writer, filter.search)) return false;
      if (filter.century !== 'all' && writer.century !== filter.century) return false;
      if (filter.movement !== 'all' && writer.literaryMovement !== filter.movement) return false;
      if (!matchesGenre(writer, filter.genre)) return false;
      if (!matchesAlphabet(writer, filter.alphabet)) return false;
      if (!matchesSpecial(writer, filter.specialFilter)) return false;
      return true;
    });
    return sortWriters(result, filter.sort);
  }, [filter]);

  /** Autocomplete suggestions based on current search query */
  const suggestions = useMemo(() => {
    if (!filter.search || filter.search.length < 2) return [];
    const term = filter.search.toLowerCase();
    const matches: { slug: string; label: string; type: string }[] = [];

    ALL_WRITERS.forEach((w) => {
      if (w.fullName.toLowerCase().includes(term) || w.shortName.toLowerCase().includes(term)) {
        matches.push({ slug: w.slug, label: w.fullName, type: 'Жазушы' });
      }
      // Also suggest matching works
      w.works.forEach((wk) => {
        if (wk.title.toLowerCase().includes(term)) {
          matches.push({ slug: w.slug, label: `${wk.title} — ${w.shortName}`, type: 'Шығарма' });
        }
      });
    });

    return matches.slice(0, 8);
  }, [filter.search]);

  /** All unique first letters for alphabet filter */
  const alphabetLetters = useMemo(() => {
    const letters = new Set(ALL_WRITERS.map((w) => w.fullName.charAt(0)));
    return [...letters].sort((a, b) => a.localeCompare(b, 'kk'));
  }, []);

  const hasActiveFilters =
    filter.search !== '' ||
    filter.century !== 'all' ||
    filter.movement !== 'all' ||
    filter.genre !== 'all' ||
    filter.alphabet !== '' ||
    filter.specialFilter !== 'all';

  return {
    writers: filtered,
    total: ALL_WRITERS.length,
    filter,
    suggestions,
    alphabetLetters,
    hasActiveFilters,
    stats: WRITERS_STATS,
    setFilter: (partial: Partial<WritersFilter>) =>
      setFilter((prev) => ({ ...prev, ...partial })),
    resetFilter: () =>
      setFilter({ search: '', century: 'all', movement: 'all', genre: 'all', sort: 'alpha', alphabet: '', specialFilter: 'all' }),
  };
}

export function useWriterBySlug(slug: string | undefined): Writer | undefined {
  return useMemo(
    () => (slug ? ALL_WRITERS.find((w) => w.slug === slug) : undefined),
    [slug],
  );
}

export function useRelatedWriters(slugs: string[]): Writer[] {
  return useMemo(
    () =>
      slugs
        .map((s) => ALL_WRITERS.find((w) => w.slug === s))
        .filter((w): w is Writer => Boolean(w)),
    [slugs],
  );
}

export { ALL_WRITERS };
