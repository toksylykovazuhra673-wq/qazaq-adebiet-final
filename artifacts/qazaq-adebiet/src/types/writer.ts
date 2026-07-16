// ============================================================
// Writer type — mirrors the structure of src/data/writers.json
// To add a new writer, simply add an object to writers.json.
// No code changes are needed anywhere else.
// ============================================================

export interface WriterWork {
  id: number;
  title: string;
  year: string;
  genre: string;
  description: string;
  hasRead: boolean;
  hasPdf: boolean;
  hasAudio: boolean;
}

export interface WriterNovel {
  id: number;
  title: string;
  year: string;
  description: string;
}

export interface WriterStory {
  id: number;
  title: string;
  year: string;
  description: string;
}

export interface WriterPlay {
  id: number;
  title: string;
  year: string;
  description: string;
}

export interface WriterArticle {
  id: number;
  title: string;
  year: string;
  description: string;
}

export interface WriterTranslation {
  id: number;
  title: string;
  originalLanguage: string;
  year: string;
  author: string;
  description?: string;
}

export interface WriterQuote {
  id: number;
  text: string;
  source?: string;
}

export interface WriterGalleryItem {
  id: number;
  url: string;
  caption: string;
  year?: string;
}

export interface WriterVideo {
  id: number;
  title: string;
  url: string;
  duration: string;
  thumbnail: string;
}

export interface WriterAudio {
  id: number;
  title: string;
  url: string;
  duration: string;
  coverImage?: string;
  narrator?: string;
}

export interface WriterPdf {
  id: number;
  title: string;
  url: string;
  pages: number;
  size: string;
  coverImage?: string;
}

export interface WriterTimelineEvent {
  year: string;
  title: string;
  description: string;
  category?: 'birth' | 'education' | 'work' | 'award' | 'death' | 'travel' | 'other';
}

export interface WriterFamilyMember {
  name: string;
  relation: string;
  years?: string;
  note?: string;
  photo?: string;
}

export interface WriterEducationItem {
  institution: string;
  degree: string;
  years: string;
  city?: string;
  note?: string;
}

export interface WriterCareerItem {
  position: string;
  organization: string;
  years: string;
  city?: string;
  note?: string;
}

export interface WriterBibliographyItem {
  id: number;
  title: string;
  author?: string;
  year?: string;
  publisher?: string;
  type: 'book' | 'article' | 'dissertation' | 'online' | 'other';
}

export interface Writer {
  id: number;
  /** URL-friendly identifier. Used in /writers/:slug routes. */
  slug: string;
  fullName: string;
  shortName: string;
  nickname: string;
  birthDate: string;
  /** null means the writer is still alive */
  deathDate: string | null;
  birthPlace: string;
  deathPlace: string | null;
  nationality: string;
  /** Human-readable era label, e.g. "XX ғасыр" */
  era: string;
  /** Used for century filter: "XIX" | "XX" | "XXI" */
  century: string;
  /** Literary movement: "Алаш" | "Классикалық әдебиет" | "Кеңес дәуірі" | "Тәуелсіздік кезеңі" */
  literaryMovement: string;
  /** Primary genres this writer worked in */
  genre: string[];
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
  awards: string[];
  timeline: WriterTimelineEvent[];
  works: WriterWork[];
  novels: WriterNovel[];
  stories: WriterStory[];
  plays: WriterPlay[];
  articles: WriterArticle[];
  translations?: WriterTranslation[];
  quotes: WriterQuote[];
  gallery: WriterGalleryItem[];
  videos: WriterVideo[];
  audio: WriterAudio[];
  pdf: WriterPdf[];
  family?: WriterFamilyMember[];
  education?: WriterEducationItem[];
  career?: WriterCareerItem[];
  bibliography?: WriterBibliographyItem[];
  interestingFacts: string[];
  /** Olympiad-style questions about this writer */
  olympiadQuestions?: { id: number; question: string; answer: string; difficulty: 'easy' | 'medium' | 'hard' }[];
  /** Array of slugs referencing related writers */
  relatedWriters: string[];
}

// ============================================================
// Filter / sort types — used by useWriters hook
// ============================================================

export type WriterCenturyFilter = 'all' | 'XIX' | 'XX' | 'XXI';
export type WriterMovementFilter =
  | 'all'
  | 'Алаш'
  | 'Классикалық әдебиет'
  | 'Кеңес дәуірі'
  | 'Тәуелсіздік кезеңі';
export type WriterGenreFilter =
  | 'all'
  | 'Роман'
  | 'Повесть'
  | 'Әңгіме'
  | 'Пьеса'
  | 'Эссе'
  | 'Балалар әдебиеті'
  | 'Тарихи шығарма';
export type WriterSortOption = 'alpha' | 'birthYear' | 'viewCount' | 'popular' | 'addedDate';
export type WriterSpecialFilter = 'all' | 'alash' | 'soviet' | 'children' | 'drama' | 'poet-writer' | 'featured';

export interface WritersFilter {
  search: string;
  century: WriterCenturyFilter;
  movement: WriterMovementFilter;
  genre: WriterGenreFilter;
  sort: WriterSortOption;
  alphabet: string;
  specialFilter: WriterSpecialFilter;
}

export interface WritersStats {
  totalWriters: number;
  totalWorks: number;
  totalPdf: number;
  totalAudio: number;
  totalQuotes: number;
}
