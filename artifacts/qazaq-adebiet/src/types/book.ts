export interface BookCharacter {
  name: string;
  role: string;
  description: string;
  traits?: string[];
}

export interface Book {
  id: number;
  slug: string;
  title: string;
  author: string;
  authorSlug?: string;
  cover: string;           // gradient CSS or image path
  genre: string;
  year: string;
  description: string;
  summary: string;
  readingTimeMin: number;
  listeningTimeMin: number;
  views: number;
  fullText: string[];      // paragraphs; empty if not public domain
  pdf: string;             // filename under /pdf/ or ''
  audio: string;           // filename under /audio/ or ''
  characters: BookCharacter[];
  theme: string;
  idea: string;
  composition: string;
  literaryDevices: string[];
  gallery: string[];
  video: string;
  tags: string[];
  isPublicDomain: boolean;
  relatedWorks: string[];  // slugs
  facts: string[];
}

// ─── Reader state ───────────────────────────────────────────
export type ReaderTab =
  | 'text' | 'pdf' | 'audio'
  | 'characters' | 'summary' | 'facts'
  | 'bookmarks' | 'notes';

export type ReadingTheme = 'dark' | 'sepia' | 'light' | 'paper';
export type RepeatMode  = 'none' | 'one' | 'all';

export interface TextSettings {
  fontSize: number;       // 14–26
  lineHeight: number;     // 1.5 | 1.75 | 2.0 | 2.5
  theme: ReadingTheme;
  fontFamily: 'sans' | 'serif' | 'mono';
}

export interface DrBookmark {
  id: string;
  type: 'text' | 'pdf' | 'audio';
  label: string;
  value: number;          // scroll% | page | seconds
  note?: string;
  createdAt: string;
}

export interface DrNote {
  id: string;
  source: 'text' | 'pdf' | 'audio';
  content: string;
  context?: string;       // quote/page/timestamp
  createdAt: string;
}

export interface DrPersist {
  activeTab: ReaderTab;
  textProgress: number;   // 0–100 scroll %
  pdfPage: number;
  audioTime: number;      // seconds
  textSettings: TextSettings;
  bookmarks: DrBookmark[];
  notes: DrNote[];
  isFavorite: boolean;
}
