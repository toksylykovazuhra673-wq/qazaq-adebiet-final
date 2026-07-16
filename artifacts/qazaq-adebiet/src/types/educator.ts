// ============================================================
// Educator type — mirrors src/data/educators.json
// To add a new educator, simply add an object to educators.json.
// No code changes anywhere else are required.
// ============================================================

export interface EducatorTimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface EducatorBook {
  id: number;
  title: string;
  year: string;
  genre: string;
  description: string;
  hasPdf: boolean;
  pdfUrl: string;
}

export interface EducatorScientificWork {
  id: number;
  title: string;
  year: string;
  field: string;
  description: string;
  bibliography: string;
  hasPdf: boolean;
  pdfUrl: string;
}

export interface EducatorPoem {
  id: number;
  title: string;
  year: string;
  description: string;
  fullText: string;      // populated if public domain
  isPublicDomain: boolean;
  sourceUrl: string;
}

export interface EducatorArticle {
  id: number;
  title: string;
  year: string;
  publication: string;
  description: string;
}

export interface EducatorResearch {
  id: number;
  title: string;
  year: string;
  field: string;
  summary: string;
  bibliography: string;
  hasPdf: boolean;
  pdfUrl: string;
}

export interface EducatorLetter {
  id: number;
  title: string;
  year: string;
  recipient: string;
  excerpt: string;
  description: string;
}

export interface EducatorQuote {
  id: number;
  text: string;
  category: string;
  meaning: string;
  source: string;
}

export interface EducatorGalleryItem {
  id: number;
  url: string;
  caption: string;
}

export interface EducatorVideo {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
}

export interface EducatorAudio {
  id: number;
  title: string;
  url: string;
  duration: string;
}

export interface EducatorPdf {
  id: number;
  title: string;
  url: string;
  pages: number;
  size: string;
}

export interface Educator {
  id: number;
  slug: string;
  fullName: string;
  birthDate: string;
  deathDate: string | null;
  birthPlace: string;
  deathPlace: string | null;
  profession: string[];
  scientificField: string;
  literaryField: string;
  century: EducatorCentury;
  photo: string;
  coverImage: string;
  description: string;
  biography: string;
  worksCount: number;
  quotesCount: number;
  viewCount: number;
  popular: boolean;
  timeline: EducatorTimelineEvent[];
  books: EducatorBook[];
  scientificWorks: EducatorScientificWork[];
  poems: EducatorPoem[];
  articles: EducatorArticle[];
  research: EducatorResearch[];
  letters: EducatorLetter[];
  quotes: EducatorQuote[];
  gallery: EducatorGalleryItem[];
  videos: EducatorVideo[];
  audio: EducatorAudio[];
  pdf: EducatorPdf[];
  interestingFacts: string[];
  tags: string[];
  relatedPersons: string[];
}

// ── Filter & Sort types ──────────────────────────────────────

export type EducatorCentury = 'XIX' | 'XX' | 'XXI';

export type EducatorProfessionFilter =
  | 'all'
  | 'Педагог'
  | 'Ғалым'
  | 'Лингвист'
  | 'Тарихшы'
  | 'Фольклортанушы'
  | 'Ақын'
  | 'Жазушы'
  | 'Қоғам қайраткері';

export type EducatorSortOption = 'birthYear' | 'alpha' | 'viewCount' | 'popular';

export interface EducatorFilter {
  search: string;
  century: 'all' | EducatorCentury;
  profession: EducatorProfessionFilter;
  sort: EducatorSortOption;
}
