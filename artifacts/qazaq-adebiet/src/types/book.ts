export interface BookCharacter {
  name: string;
  role: string;
  description: string;
  traits?: string[];
}

export interface TocEntry {
  title: string;
  paraIndex: number;
  page?: number;
  level?: number;   // 1 = chapter, 2 = section
}

export interface Book {
  id: number;
  slug: string;
  title: string;
  author: string;
  authorSlug?: string;
  cover: string;
  genre: string;
  year: string;
  description: string;
  summary: string;
  readingTimeMin: number;
  listeningTimeMin: number;
  views: number;
  fullText: string[];
  pdf: string;
  audio: string;
  characters: BookCharacter[];
  theme: string;
  idea: string;
  composition: string;
  literaryDevices: string[];
  gallery: string[];
  video: string;
  tags: string[];
  isPublicDomain: boolean;
  relatedWorks: string[];
  facts: string[];
  tableOfContents?: TocEntry[];
}

// ─── Reader state ───────────────────────────────────────────
export type ReaderTab =
  | 'text' | 'pdf' | 'audio'
  | 'characters' | 'summary' | 'facts'
  | 'bookmarks' | 'notes';

export type ReadingTheme  = 'dark' | 'sepia' | 'light' | 'paper';
export type RepeatMode    = 'none' | 'one' | 'all';
export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'orange';

export interface TextSettings {
  fontSize:    number;          // 14–28
  lineHeight:  number;          // 1.5 | 1.75 | 2.0 | 2.5
  theme:       ReadingTheme;
  fontFamily:  'sans' | 'serif' | 'mono';
  columnWidth: 'narrow' | 'medium' | 'wide';
}

export interface DrBookmark {
  id: string;
  type: 'text' | 'pdf' | 'audio';
  label: string;
  value: number;     // scroll% | page | seconds
  note?: string;
  createdAt: string;
}

export interface DrHighlight {
  id: string;
  paragraphIndex: number;
  text: string;
  color: HighlightColor;
  note?: string;
  createdAt: string;
}

export interface DrNote {
  id: string;
  source: 'text' | 'pdf' | 'audio';
  content: string;
  context?: string;
  createdAt: string;
}

export interface DrPersist {
  activeTab:    ReaderTab;
  textProgress: number;
  pdfPage:      number;
  audioTime:    number;
  textSettings: TextSettings;
  bookmarks:    DrBookmark[];
  highlights:   DrHighlight[];
  notes:        DrNote[];
  isFavorite:   boolean;
  nightMode:    boolean;
}
