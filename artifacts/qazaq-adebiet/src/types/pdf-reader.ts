// ============================================================
// Professional PDF Reader — shared types
// ============================================================

export type ReadingMode = 'dark' | 'sepia' | 'light';
export type PageLayout = 'single' | 'double' | 'continuous';
export type ScrollMode = 'vertical' | 'horizontal';

export interface TocEntry {
  title: string;
  page: number;
  level?: number;
  children?: TocEntry[];
}

export interface PdfBook {
  id: number;
  slug: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  year: string;
  cover: string;
  pdfFile: string;        // path inside public/pdf/
  description: string;
  grade?: string;
  language: string;
  allowDownload: boolean;
  tableOfContents: TocEntry[];
  tags: string[];
  readingTimeMin?: number; // auto-calculated if not given
}

// ─── Reader state ────────────────────────────────────────────
export interface Bookmark {
  page: number;
  label: string;
  addedAt: string;
}

export interface PageNote {
  page: number;
  text: string;
  updatedAt: string;
}

export interface Highlight {
  id: string;
  page: number;
  color: string;
  text: string;
  createdAt: string;
}

export interface ReaderState {
  currentPage: number;
  zoom: number;
  rotation: number;
  mode: ReadingMode;
  layout: PageLayout;
  scrollMode: ScrollMode;
  sidebarOpen: boolean;
  sidebarTab: 'thumbnails' | 'bookmarks' | 'notes' | 'toc';
  searchOpen: boolean;
  fullscreen: boolean;
}

export interface PersistentReaderData {
  bookmarks: Bookmark[];
  notes: PageNote[];
  highlights: Highlight[];
  lastPage: number;
}
