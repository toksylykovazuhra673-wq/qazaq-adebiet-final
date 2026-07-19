// ============================================================
// Poet type — mirrors the structure of src/data/poets.json
// To add a new poet, simply add an object to poets.json.
// No code changes are needed anywhere else.
// ============================================================

export interface PoetWork {
  id: number;
  title: string;
  year: string;
  genre: string;
  description: string;
  hasRead: boolean;
  hasPdf: boolean;
  hasAudio: boolean;
  /** Optional slug for digital reader navigation, e.g. "abai-qara-sozder" */
  readerSlug?: string;
}

export interface PoetPoem {
  id: number;
  title: string;
  year: string;
  content: string;
}

export interface PoetPoema {
  id: number;
  title: string;
  year: string;
  description: string;
}

export interface PoetTranslation {
  id: number;
  originalTitle: string;
  author: string;
  year: string;
}

export interface PoetQuote {
  id: number;
  text: string;
}

export interface PoetGalleryItem {
  id: number;
  url: string;
  caption: string;
}

export interface PoetVideo {
  id: number;
  title: string;
  url: string;
  duration: string;
  thumbnail: string;
}

export interface PoetAudio {
  id: number;
  title: string;
  url: string;
  duration: string;
}

export interface PoetPdf {
  id: number;
  title: string;
  url: string;
  pages: number;
  size: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Poet {
  id: number;
  /** URL-friendly identifier. Used in /poets/:slug routes. */
  slug: string;
  fullName: string;
  shortName: string;
  nickname: string;
  birthDate: string;
  /** null means the poet is still alive */
  deathDate: string | null;
  birthPlace: string;
  deathPlace: string | null;
  nationality: string;
  /** Human-readable era label, e.g. "XIX ғасыр" */
  era: string;
  /** Used for century filter: "XV" | "XVI" | "XVII" | "XVIII" | "XIX" | "XX" | "XXI" */
  century: string;
  /** Literary movement: "Алаш" | "Зар заман" | "Халық ақындары" | "Қазіргі поэзия" | "Балалар әдебиеті" | "Ағартушылық" */
  literaryMovement: string;
  profession: string[];
  photo: string;
  coverImage: string;
  description: string;
  biography: string;
  viewCount: number;
  popular: boolean;
  featured: boolean;
  addedDate: string;
  tags: string[];
  worksCount: number;
  quotesCount: number;
  timeline: TimelineEvent[];
  works: PoetWork[];
  poems: PoetPoem[];
  poemas: PoetPoema[];
  translations: PoetTranslation[];
  quotes: PoetQuote[];
  gallery: PoetGalleryItem[];
  videos: PoetVideo[];
  audio: PoetAudio[];
  pdf: PoetPdf[];
  interestingFacts: string[];
  /** Array of slugs referencing related poets */
  relatedPoets: string[];
}

// ============================================================
// Filter / sort types — used by usePoets hook
// ============================================================

export type CenturyFilter = 'all' | 'XV' | 'XVI' | 'XVII' | 'XVIII' | 'XIX' | 'XX' | 'XXI';
export type MovementFilter = 'all' | 'Алаш' | 'Зар заман' | 'Халық ақындары' | 'Қазіргі поэзия' | 'Балалар әдебиеті' | 'Ағартушылық';
export type SortOption = 'alpha' | 'birthYear' | 'popular' | 'viewCount' | 'addedDate';

export interface PoetsFilter {
  search: string;
  century: CenturyFilter;
  movement: MovementFilter;
  sort: SortOption;
}
