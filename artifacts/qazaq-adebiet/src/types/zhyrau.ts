// ============================================================
// Zhyrau type — mirrors the structure of src/data/zhyrau.json
// To add a new zhyrau, simply add an object to zhyrau.json.
// No code changes anywhere else are required.
// ============================================================

export interface ZhyrauTolgau {
  id: number;
  title: string;
  period: string;
  theme: string;
  genre: string;
  description: string;
  hasRead: boolean;
  hasPdf: boolean;
  hasAudio: boolean;
}

export interface ZhyrauPoem {
  id: number;
  title: string;
  period: string;
  description: string;
}

export interface ZhyrauQuote {
  id: number;
  text: string;
}

export interface ZhyrauTimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface ZhyrauHistoricalEvent {
  id: number;
  year: string;
  title: string;
  description: string;
}

export interface ZhyrauGalleryItem {
  id: number;
  url: string;
  caption: string;
}

export interface ZhyrauVideo {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
}

export interface ZhyrauAudio {
  id: number;
  title: string;
  url: string;
  duration: string;
}

export interface ZhyrauPdf {
  id: number;
  title: string;
  url: string;
  pages: number;
  size: string;
}

export interface ZhyrauMapRegion {
  name: string;
  lat: number;
  lng: number;
}

export interface ZhyrauMapLocation {
  birthLabel: string;
  birthLat: number;
  birthLng: number;
  deathLabel: string;
  deathLat: number;
  deathLng: number;
  livedRegions: ZhyrauMapRegion[];
}

export interface Zhyrau {
  id: number;
  slug: string;
  fullName: string;
  nickname: string;
  birthDate: string;
  deathDate: string | null;
  birthPlace: string;
  deathPlace: string | null;
  century: string;
  era: string;
  historicalPeriod: string;
  khanPeriod: string;
  khanConnection: string;
  profession: string[];
  photo: string;
  coverImage: string;
  description: string;
  biography: string;
  tolgauCount: number;
  quotesCount: number;
  viewCount: number;
  popular: boolean;
  addedDate: string;
  timeline: ZhyrauTimelineEvent[];
  tolgau: ZhyrauTolgau[];
  poems: ZhyrauPoem[];
  quotes: ZhyrauQuote[];
  historicalEvents: ZhyrauHistoricalEvent[];
  gallery: ZhyrauGalleryItem[];
  videos: ZhyrauVideo[];
  audio: ZhyrauAudio[];
  pdf: ZhyrauPdf[];
  mapLocation: ZhyrauMapLocation;
  interestingFacts: string[];
  tags: string[];
  relatedZhyrau: string[];
}

// ── Filter & Sort types ──────────────────────────────────────

export type ZhyrauCenturyFilter = 'all' | 'XV' | 'XVI' | 'XVII' | 'XVIII' | 'XIX';

export type ZhyrauPeriodFilter =
  | 'all'
  | 'Ноғайлы дәуірі'
  | 'Қазақ хандығы'
  | 'Жоңғар шапқыншылығы'
  | 'Абылай хан дәуірі'
  | 'Тәуелсіздікке дейінгі зерттеулер';

export type ZhyrauSortOption = 'birthYear' | 'alpha' | 'viewCount' | 'popular' | 'addedDate';

export interface ZhyrauFilter {
  search: string;
  century: ZhyrauCenturyFilter;
  period: ZhyrauPeriodFilter;
  sort: ZhyrauSortOption;
}
