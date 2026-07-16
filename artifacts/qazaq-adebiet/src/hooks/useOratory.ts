import { useState, useMemo } from 'react';
import oratoryData from '@/data/oratory.json';

export interface OratoryWord {
  id: number;
  biSlug: string;
  title: string;
  category: string;
  period: string;
  description: string;
  fullText: string;
  keywords: string[];
  source: string;
  relatedPersons: string[];
  relatedEvents: string[];
  context: string;
  addressee: string;
  mainIdea: string;
  educationalValue: string;
  literaryFeatures: string;
  artisticDevices: string;
  contemporaryRelevance: string;
}

export type OratoryCategory =
  | 'Барлығы'
  | 'Арнау'
  | 'Толғау'
  | 'Дау шешу'
  | 'Өсиет'
  | 'Бата'
  | 'Кеңес'
  | 'Тәрбие'
  | 'Билік сөзі'
  | 'Елшілік сөзі';

export const ORATORY_CATEGORIES: OratoryCategory[] = [
  'Барлығы',
  'Арнау',
  'Толғау',
  'Дау шешу',
  'Өсиет',
  'Бата',
  'Кеңес',
  'Тәрбие',
  'Билік сөзі',
  'Елшілік сөзі',
];

const ALL_ORATORY: OratoryWord[] = oratoryData as OratoryWord[];

// Estimate reading time (avg 200 words per minute for Kazakh)
export function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const mins = Math.ceil(words / 200);
  return mins <= 1 ? '1 мин' : `${mins} мин`;
}

// Estimate word count
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function useOratoryBySlug(biSlug: string) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<OratoryCategory>('Барлығы');

  const allForBi = useMemo(
    () => ALL_ORATORY.filter((o) => o.biSlug === biSlug),
    [biSlug]
  );

  const filtered = useMemo(() => {
    let list = allForBi;
    if (category !== 'Барлығы') {
      list = list.filter((o) => o.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          o.fullText.toLowerCase().includes(q) ||
          o.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allForBi, search, category]);

  return { filtered, total: allForBi.length, search, setSearch, category, setCategory };
}

export function useOratoryById(id: number): OratoryWord | undefined {
  return ALL_ORATORY.find((o) => o.id === id);
}
