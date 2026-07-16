// ============================================================
// Bi-Sheshender type — mirrors src/data/bi-sheshender.json
// To add a new bi-sheshen, simply add an object to bi-sheshender.json.
// No code changes anywhere else are required.
// ============================================================

export interface BiOratoryWord {
  id: number;
  title: string;
  theme: string;
  type: string;          // Шешендік сөз | Дау шешімі | Ел шешімі
  description: string;
  hasRead: boolean;
  hasPdf: boolean;
  hasAudio: boolean;
}

export interface BiAphorism {
  id: number;
  text: string;
}

export interface BiCourtCase {
  id: number;
  year: string;
  title: string;
  parties: string;
  verdict: string;
  description: string;
}

export interface BiDiplomaticMission {
  id: number;
  year: string;
  title: string;
  description: string;
  result: string;
}

export interface BiTimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface BiHistoricalEvent {
  id: number;
  year: string;
  title: string;
  description: string;
}

export interface BiGalleryItem {
  id: number;
  url: string;
  caption: string;
}

export interface BiVideo {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
}

export interface BiAudio {
  id: number;
  title: string;
  url: string;
  duration: string;
}

export interface BiPdf {
  id: number;
  title: string;
  url: string;
  pages: number;
  size: string;
}

export interface BiMapRegion {
  name: string;
  lat: number;
  lng: number;
}

export interface BiMapLocation {
  birthLabel: string;
  birthLat: number;
  birthLng: number;
  deathLabel: string;
  deathLat: number;
  deathLng: number;
  livedRegions: BiMapRegion[];
}

export interface BiSheshen {
  id: number;
  slug: string;
  fullName: string;
  nickname: string;
  birthDate: string;
  deathDate: string | null;
  birthPlace: string;
  deathPlace: string | null;
  tribe: string;
  region: string;
  century: string;
  era: string;
  historicalPeriod: string;
  profession: string[];
  photo: string;
  coverImage: string;
  description: string;
  biography: string;
  oratoryCount: number;
  aphorismCount: number;
  viewCount: number;
  popular: boolean;
  addedDate: string;
  timeline: BiTimelineEvent[];
  oratoryWords: BiOratoryWord[];
  aphorisms: BiAphorism[];
  courtCases: BiCourtCase[];
  diplomaticService: BiDiplomaticMission[];
  historicalEvents: BiHistoricalEvent[];
  gallery: BiGalleryItem[];
  videos: BiVideo[];
  audio: BiAudio[];
  pdf: BiPdf[];
  mapLocation: BiMapLocation;
  interestingFacts: string[];
  tags: string[];
  relatedPersons: string[];
}

// ── Filter & Sort types ──────────────────────────────────────

export type BiCenturyFilter = 'all' | 'XIII' | 'XIV' | 'XV' | 'XVI' | 'XVII' | 'XVIII' | 'XIX';

export type BiPeriodFilter =
  | 'all'
  | 'Үш би дәуірі'
  | 'Қазақ хандығы'
  | 'Жоңғар шапқыншылығы'
  | 'Аңырақай шайқасы'
  | 'Ресей отаршылдығы';

export type BiSortOption = 'birthYear' | 'alpha' | 'viewCount' | 'popular' | 'addedDate';

export interface BiFilter {
  search: string;
  century: BiCenturyFilter;
  period: BiPeriodFilter;
  sort: BiSortOption;
}
