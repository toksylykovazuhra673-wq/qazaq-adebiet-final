import { useState, useMemo } from 'react';
import quotesData from '@/data/quotes.json';

export interface Quote {
  id: number;
  biSlug: string;
  biName: string;
  quote: string;
  category: QuoteCategory;
  meaning: string;
  source: string;
  keywords: string[];
  context: string;
  currentUsage: string;
  educationalValue: string;
  similarQuotes: string[];
  relatedOratoryIds: number[];
}

export type QuoteCategory =
  | 'Барлығы'
  | 'Білім'
  | 'Адалдық'
  | 'Ел'
  | 'Жер'
  | 'Бірлік'
  | 'Достық'
  | 'Еңбек'
  | 'Отан'
  | 'Тәрбие'
  | 'Адамгершілік'
  | 'Әділдік'
  | 'Ақыл'
  | 'Ар'
  | 'Намыс'
  | 'Сабыр';

export const QUOTE_CATEGORIES: QuoteCategory[] = [
  'Барлығы',
  'Білім',
  'Адалдық',
  'Ел',
  'Жер',
  'Бірлік',
  'Достық',
  'Еңбек',
  'Отан',
  'Тәрбие',
  'Адамгершілік',
  'Әділдік',
  'Ақыл',
  'Ар',
  'Намыс',
  'Сабыр',
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Білім':          'bg-violet-500/15 border-violet-500/30 text-violet-400',
  'Адалдық':        'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  'Ел':             'bg-teal-500/15 border-teal-500/30 text-teal-400',
  'Жер':            'bg-lime-500/15 border-lime-500/30 text-lime-400',
  'Бірлік':         'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
  'Достық':         'bg-pink-500/15 border-pink-500/30 text-pink-400',
  'Еңбек':          'bg-orange-500/15 border-orange-500/30 text-orange-400',
  'Отан':           'bg-amber-500/15 border-amber-500/30 text-amber-400',
  'Тәрбие':         'bg-sky-500/15 border-sky-500/30 text-sky-400',
  'Адамгершілік':   'bg-rose-500/15 border-rose-500/30 text-rose-400',
  'Әділдік':        'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
  'Ақыл':           'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
  'Ар':             'bg-red-500/15 border-red-500/30 text-red-400',
  'Намыс':          'bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-400',
  'Сабыр':          'bg-slate-500/15 border-slate-500/30 text-slate-400',
};

const ALL_QUOTES: Quote[] = quotesData as Quote[];

/** Word count of the quote text */
export function quoteWordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

/** Estimated reading time (chars / 800 chars per minute for short quotes) */
export function quoteReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const secs = Math.ceil((words / 180) * 60);
  if (secs < 60) return `${secs} сек`;
  return `${Math.ceil(secs / 60)} мин`;
}

/** Returns all quotes for a given biSlug with search + category filter */
export function useQuotesBySlug(biSlug: string) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<QuoteCategory>('Барлығы');
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try {
      const raw = localStorage.getItem('qazaq_adebiet_quote_favorites');
      return raw ? new Set<number>(JSON.parse(raw)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  });

  const allForBi = useMemo(
    () => ALL_QUOTES.filter((q) => q.biSlug === biSlug),
    [biSlug]
  );

  const filtered = useMemo(() => {
    let list = allForBi;
    if (category !== 'Барлығы') {
      list = list.filter((q) => q.category === category);
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (q) =>
          q.quote.toLowerCase().includes(term) ||
          q.meaning.toLowerCase().includes(term) ||
          q.keywords.some((k) => k.toLowerCase().includes(term)) ||
          q.category.toLowerCase().includes(term)
      );
    }
    return list;
  }, [allForBi, search, category]);

  /** Autocomplete suggestions based on search input */
  const suggestions = useMemo(() => {
    if (search.trim().length < 2) return [];
    const term = search.toLowerCase();
    const matches: string[] = [];
    for (const q of allForBi) {
      if (q.quote.toLowerCase().includes(term) && !matches.includes(q.quote)) {
        matches.push(q.quote);
        if (matches.length >= 5) break;
      }
    }
    return matches;
  }, [allForBi, search]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(
          'qazaq_adebiet_quote_favorites',
          JSON.stringify([...next])
        );
      } catch {}
      return next;
    });
  };

  return {
    filtered,
    total: allForBi.length,
    search,
    setSearch,
    category,
    setCategory,
    suggestions,
    favorites,
    toggleFavorite,
  };
}

export function useQuoteById(id: number): Quote | undefined {
  return ALL_QUOTES.find((q) => q.id === id);
}

/** All unique categories present in a bi-sheshen's quotes */
export function usePresentCategories(biSlug: string): QuoteCategory[] {
  const all = ALL_QUOTES.filter((q) => q.biSlug === biSlug);
  const cats = new Set(all.map((q) => q.category));
  return QUOTE_CATEGORIES.filter(
    (c) => c === 'Барлығы' || cats.has(c)
  );
}
