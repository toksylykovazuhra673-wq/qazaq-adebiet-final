// ============================================================
// Universal Author — shared types for /authors/:category/:slug
// ============================================================

export type AuthorCategory = 'poets' | 'writers' | 'zhyrau' | 'bi-sheshender' | 'educators';

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type?: 'birth' | 'death' | 'education' | 'work' | 'event' | 'award';
}

export interface FamilyMember {
  id: number;
  relation: string; // Әкесі, Шешесі, Жұбайы, Ұлы, Қызы, Ағасы, etc.
  name: string;
  years?: string;
  description?: string;
  photo?: string;
}

export interface EducationEntry {
  id: number;
  institution: string;
  period: string;
  subject: string;
  description?: string;
  city?: string;
}

export interface CareerEntry {
  id: number;
  role: string;
  period: string;
  place: string;
  description?: string;
}

export interface Poem {
  id: number;
  title: string;
  year: string;
  description?: string;
  fullText?: string;
  isPublicDomain: boolean;
  category?: string;
}

export interface LongPoem {
  id: number;
  title: string;
  year: string;
  description?: string;
  excerpt?: string;
  pages?: number;
  isPublicDomain: boolean;
}

export interface Novel {
  id: number;
  title: string;
  slug: string;
  year: string;
  genre: string;
  description?: string;
  pages?: number;
  isPublicDomain: boolean;
  hasPdf: boolean;
  pdfUrl?: string;
  hasAudio: boolean;
  audioUrl?: string;
  coverImage?: string;
}

export interface Story {
  id: number;
  title: string;
  year: string;
  genre: string;
  description?: string;
  excerpt?: string;
  isPublicDomain: boolean;
  fullText?: string;
}

export interface ScientificWork {
  id: number;
  title: string;
  year: string;
  field: string;
  description?: string;
  bibliography?: string;
  hasPdf: boolean;
  pdfUrl?: string;
}

export interface Article {
  id: number;
  title: string;
  year: string;
  publication: string;
  description?: string;
  url?: string;
}

export interface ResearchWork {
  id: number;
  title: string;
  year: string;
  field: string;
  summary?: string;
  bibliography?: string;
  hasPdf: boolean;
  pdfUrl?: string;
}

export interface OratoryEntry {
  id: number;
  title: string;
  category?: string;
  occasion?: string;
  fullText: string;
  year?: string;
}

export interface Proverb {
  id: number;
  text: string;
  topic?: string;
  meaning?: string;
  explanation?: string;
}

export interface Quote {
  id: number;
  text: string;
  category?: string;
  source?: string;
  meaning?: string;
}

export interface GalleryItem {
  id: number;
  url: string;
  caption: string;
  year?: string;
  type?: 'portrait' | 'place' | 'document' | 'artwork';
}

export interface VideoItem {
  id: number;
  title: string;
  url?: string;
  thumbnail?: string;
  duration?: string;
  description?: string;
}

export interface AudioItem {
  id: number;
  title: string;
  url?: string;
  duration?: string;
  type?: 'reading' | 'music' | 'documentary' | 'lecture';
  description?: string;
}

export interface PdfItem {
  id: number;
  title: string;
  url?: string;
  pages?: number;
  description?: string;
  year?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface UniversalAuthor {
  id: number;
  slug: string;
  category: AuthorCategory;
  categoryLabel: string;
  fullName: string;
  birthDate: string;
  deathDate: string;
  birthPlace: string;
  deathPlace: string;
  profession: string[];
  literaryMovement: string;
  photo: string;
  coverImage: string;
  description: string;
  biography: string;

  timeline: TimelineEvent[];
  family: FamilyMember[];
  education: EducationEntry[];
  career: CareerEntry[];

  poems: Poem[];
  longPoems: LongPoem[];
  novels: Novel[];
  stories: Story[];
  scientificWorks: ScientificWork[];
  articles: Article[];
  research: ResearchWork[];
  oratories: OratoryEntry[];
  proverbs: Proverb[];
  quotes: Quote[];

  gallery: GalleryItem[];
  videos: VideoItem[];
  audio: AudioItem[];
  pdf: PdfItem[];

  interestingFacts: string[];
  relatedSlugs: string[];

  tags: string[];
  worksCount: number;
  quotesCount: number;
  viewCount: number;
  popular: boolean;
  featured: boolean;
}

// ─── Filter & sort ─────────────────────────────────────────
export type UniversalSortKey = 'name' | 'year' | 'views' | 'works';

export interface UniversalFilterState {
  search: string;
  category: AuthorCategory | 'all';
  sort: UniversalSortKey;
}
