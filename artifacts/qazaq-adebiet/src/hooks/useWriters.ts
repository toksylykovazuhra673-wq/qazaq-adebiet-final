/**
 * useWriters — the single source of truth for all writer data.
 *
 * All components that display writers read from this hook.
 * Adding a new writer to src/data/writers.json is all that is needed —
 * no code changes anywhere else are required.
 * Custom writers added via the UI are stored in localStorage.
 */
import { useMemo, useState, useEffect } from 'react';
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

const STATIC_WRITERS = rawWriters as Writer[];

// ── localStorage helpers ──────────────────────────────────────────────────────

const LS_KEY = 'qazaq_adebiet_custom_writers';
const CHANGE_EVENT = 'writers-data-changed';

export function loadCustomWriters(): Writer[] {
  try {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? (JSON.parse(stored) as Writer[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomWriter(writer: Writer): void {
  try {
    const existing = loadCustomWriters();
    const updated = [...existing.filter((w) => w.slug !== writer.slug), writer];
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

export function deleteCustomWriter(slug: string): void {
  try {
    const existing = loadCustomWriters();
    const updated = existing.filter((w) => w.slug !== slug);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

/** Returns merged list: static JSON + custom localStorage */
function useAllWriters(): Writer[] {
  const [custom, setCustom] = useState<Writer[]>(() => loadCustomWriters());

  useEffect(() => {
    const handler = () => setCustom(loadCustomWriters());
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  return useMemo(() => [...STATIC_WRITERS, ...custom], [custom]);
}

// ── Derived global stats (static only, for hero display) ─────────────────────
export const WRITERS_STATS: WritersStats = {
  totalWriters: STATIC_WRITERS.length,
  totalWorks:   STATIC_WRITERS.reduce((sum, w) => sum + (w.worksCount ?? 0), 0),
  totalPdf:     STATIC_WRITERS.reduce((sum, w) => sum + (w.pdf?.length ?? 0), 0),
  totalAudio:   STATIC_WRITERS.reduce((sum, w) => sum + (w.audio?.length ?? 0), 0),
  totalQuotes:  STATIC_WRITERS.reduce((sum, w) => sum + (w.quotesCount ?? 0), 0),
};

/** @deprecated use useAllWriters() inside components instead */
const ALL_WRITERS = STATIC_WRITERS;

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
  const allWriters = useAllWriters();
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
    let result = allWriters.filter((writer) => {
      if (!matchesSearch(writer, filter.search)) return false;
      if (filter.century !== 'all' && writer.century !== filter.century) return false;
      if (filter.movement !== 'all' && writer.literaryMovement !== filter.movement) return false;
      if (!matchesGenre(writer, filter.genre)) return false;
      if (!matchesAlphabet(writer, filter.alphabet)) return false;
      if (!matchesSpecial(writer, filter.specialFilter)) return false;
      return true;
    });
    return sortWriters(result, filter.sort);
  }, [filter, allWriters]);

  /** Autocomplete suggestions based on current search query */
  const suggestions = useMemo(() => {
    if (!filter.search || filter.search.length < 2) return [];
    const term = filter.search.toLowerCase();
    const matches: { slug: string; label: string; type: string }[] = [];

    allWriters.forEach((w) => {
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
  }, [filter.search, allWriters]);

  /** All unique first letters for alphabet filter */
  const alphabetLetters = useMemo(() => {
    const letters = new Set(allWriters.map((w) => w.fullName.charAt(0)));
    return [...letters].sort((a, b) => a.localeCompare(b, 'kk'));
  }, [allWriters]);

  const hasActiveFilters =
    filter.search !== '' ||
    filter.century !== 'all' ||
    filter.movement !== 'all' ||
    filter.genre !== 'all' ||
    filter.alphabet !== '' ||
    filter.specialFilter !== 'all';

  return {
    writers: filtered,
    total: allWriters.length,
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
  const allWriters = useAllWriters();
  return useMemo(
    () => (slug ? allWriters.find((w) => w.slug === slug) : undefined),
    [slug, allWriters],
  );
}

export function useRelatedWriters(slugs: string[]): Writer[] {
  const allWriters = useAllWriters();
  return useMemo(
    () =>
      slugs
        .map((s) => allWriters.find((w) => w.slug === s))
        .filter((w): w is Writer => Boolean(w)),
    [slugs, allWriters],
  );
}

export { ALL_WRITERS };
