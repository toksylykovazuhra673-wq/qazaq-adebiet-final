/**
 * dataLoader.ts — Орталық деректер жүктеушісі
 *
 * Барлық JSON файлдарын автоматты импорттайды.
 * Жаңа шығарма / автор қосу үшін тек JSON файлына объект енгізу жеткілікті.
 * Код өзгерту қажет емес.
 *
 * @module dataLoader
 */

// ── Raw JSON импорттар ─────────────────────────────────────────────────────────
import _authors           from '@/data/authors.json';
import _books             from '@/data/books.json';
import _analysisExamples  from '@/data/analysis.json';
import _literaryDevices   from '@/data/literaryDevices.json';
import _keywords          from '@/data/keywords.json';
import _rhymePatterns     from '@/data/rhymePatterns.json';
import _compositionPatterns from '@/data/compositionPatterns.json';
import _characters        from '@/data/characters.json';
import _genres            from '@/data/genres.json';

// ── Бар деректер (poets, writers, works, т.б.) ────────────────────────────────
import _universalAuthors  from '@/data/universal-authors.json';
import _works             from '@/data/works.json';
import _quotes            from '@/data/quotes.json';

// ═════════════════════════════════════════════════════════════════════════════
// Типтер
// ═════════════════════════════════════════════════════════════════════════════

/** Бай авторлар жинағының жазбасы (authors.json) */
export interface RichAuthor {
  id: string;
  slug: string;
  fullName: string;
  shortName: string;
  nickname: string;
  birthYear: number;
  deathYear: number | null;
  birthPlace: string;
  deathPlace: string | null;
  nationality: string;
  era: string;
  century: string;
  category: string[];
  literaryMovement: string;
  genres: string[];
  languages: string[];
  description: string;
  biography: string;
  signature: {
    keywords: string[];
    themes: string[];
    styleMarkers: string[];
  };
  majorWorks: { title: string; year: string; genre: string }[];
  awards: string[];
  influences: string[];
  influenced: string[];
  quotes: string[];
  tags: string[];
  viewCount: number;
  popular: boolean;
  featured: boolean;
  addedDate: string;
}

/** Кітаптар жинағының жазбасы (books.json) */
export interface RichBook {
  id: string;
  slug: string;
  title: string;
  titleRu: string;
  titleEn: string;
  authorSlug: string;
  authorName: string;
  year: string;
  publishedYear: number;
  genre: string;
  subgenre: string;
  language: string;
  pages: number;
  chapters: number;
  description: string;
  synopsis: string;
  mainThemes: string[];
  mainIdea: string;
  characters: { name: string; role: string; description: string }[];
  composition: { type: string; parts: number | string; structure: string };
  literaryDevices: string[];
  keyQuotes: string[];
  schoolProgram: boolean;
  gradeLevel: string[];
  difficulty: string;
  tags: string[];
  coverImage: string;
  pdfAvailable: boolean;
  audioAvailable: boolean;
  viewCount: number;
  rating: number;
  addedDate: string;
}

/** Дайын талдау үлгісі (analysis.json) */
export interface AnalysisExample {
  id: string;
  slug: string;
  title: string;
  workTitle: string;
  authorSlug: string;
  authorName: string;
  workType: string;
  sampleText: string;
  fullAnalysis: Record<string, unknown>;
  teachingNotes: Record<string, unknown>;
  addedDate: string;
  viewCount: number;
  tags: string[];
}

/** Бейнелеу тәсілі (literaryDevices.json) */
export interface LiteraryDeviceEntry {
  id: string;
  slug: string;
  nameKk: string;
  nameRu: string;
  nameEn: string;
  category: string;
  description: string;
  detailedDescription: string;
  markers: string[];
  examples: { text: string; analysis: string; author: string }[];
  structure: string;
  effect: string;
  frequency: string;
  difficulty: string;
  schoolGrades: string[];
  relatedDevices: string[];
  tags: string[];
}

/** Жанр жазбасы (genres.json) */
export interface GenreEntry {
  id: string;
  slug: string;
  nameKk: string;
  nameRu: string;
  nameEn: string;
  category: string;
  description: string;
  characteristics: string[];
  subgenres: { id: string; name: string; description: string }[];
  structuralFeatures: Record<string, unknown>;
  kazakhExamples: { title: string; author: string; year: string }[];
  analysisKeywords: string[];
  schoolGrades: string[];
  difficulty: string;
  addedDate: string;
}

/** Кейіпкер жазбасы (characters.json) */
export interface CharacterEntry {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  type: string;
  role: string;
  sourceWork: string;
  sourceAuthor: string;
  sourceWorkSlug: string;
  era: string;
  description: string;
  characterTraits: { positive: string[]; negative: string[]; distinctive: string[] };
  relationships: { name: string; type: string; description: string }[];
  symbolism: string;
  quotes: string[];
  analysisNotes: string;
  tags: string[];
}

// ═════════════════════════════════════════════════════════════════════════════
// Raw exports (тікелей JSON)
// ═════════════════════════════════════════════════════════════════════════════

/** Барлық авторлар (authors.json — бай схема) */
export const richAuthors: RichAuthor[]          = _authors as RichAuthor[];

/** Барлық кітаптар (books.json) */
export const richBooks: RichBook[]              = _books as RichBook[];

/** Дайын талдау үлгілері (analysis.json) */
export const analysisExamples: AnalysisExample[] = _analysisExamples as AnalysisExample[];

/** Бейнелеу тәсілдері (literaryDevices.json) */
export const literaryDevices: LiteraryDeviceEntry[] = _literaryDevices as LiteraryDeviceEntry[];

/** Жанрлар (genres.json) */
export const genres: GenreEntry[]               = _genres as GenreEntry[];

/** Кейіпкерлер (characters.json) */
export const characters: CharacterEntry[]       = _characters as CharacterEntry[];

/** Кілт сөздер сөздігі (keywords.json) */
export const keywords                           = _keywords;

/** Ұйқас үлгілері (rhymePatterns.json) */
export const rhymePatterns                      = _rhymePatterns;

/** Композиция үлгілері (compositionPatterns.json) */
export const compositionPatterns                = _compositionPatterns;

/** Бар universal-authors.json */
export const universalAuthors                   = _universalAuthors as unknown[];

/** Бар works.json */
export const works                              = _works as unknown[];

/** Бар quotes.json */
export const quotes                             = _quotes as unknown[];

// ═════════════════════════════════════════════════════════════════════════════
// Адаптер: RichAuthor → ескі Author типі
// ═════════════════════════════════════════════════════════════════════════════

/**
 * RichAuthor-ды бар беттер үшін ескі `Author` типіне айналдырады.
 * authors.json-ға жаңа объект қосу жеткілікті — автоматты жұмыс жасайды.
 */
export interface CompatAuthor {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  years: string;
  birthplace: string;
  description: string;
  image: string;
  works: string[];
  featured: boolean;
  popular: boolean;
  // Бай өрістер де қосылады
  fullName: string;
  era: string;
  literaryMovement: string;
  biography: string;
  majorWorks: { title: string; year: string; genre: string }[];
  signature: { keywords: string[]; themes: string[]; styleMarkers: string[] };
  quotes: string[];
  tags: string[];
  viewCount: number;
  influences: string[];
  influenced: string[];
}

function categoryToSlug(cats: string[]): string {
  const cat = cats[0]?.toLowerCase() ?? '';
  if (cat.includes('жырау') || cat.includes('жыршы'))  return 'zhyraudar';
  if (cat.includes('жазушы') || cat.includes('драматург')) return 'zhazushylar';
  return 'aqyndar';
}

function categoryToLabel(cats: string[]): string {
  return cats[0] ?? 'Автор';
}

function buildYears(a: RichAuthor): string {
  const birth = a.birthYear ?? '?';
  if (!a.deathYear) return `${birth} – қ.б.`;
  return `${birth}–${a.deathYear}`;
}

/** Бай авторларды ескі схемаға сәйкес CompatAuthor ретінде береді */
export function getCompatAuthors(): CompatAuthor[] {
  return richAuthors.map(a => ({
    id: a.id,
    name: a.shortName || a.fullName,
    slug: a.slug,
    category: categoryToSlug(a.category),
    categoryLabel: categoryToLabel(a.category),
    years: buildYears(a),
    birthplace: a.birthPlace,
    description: a.description,
    image: '',
    works: a.majorWorks.map(w => w.title),
    featured: a.featured,
    popular: a.popular,
    // бай өрістер
    fullName: a.fullName,
    era: a.era,
    literaryMovement: a.literaryMovement,
    biography: a.biography,
    majorWorks: a.majorWorks,
    signature: a.signature,
    quotes: a.quotes,
    tags: a.tags,
    viewCount: a.viewCount,
    influences: a.influences,
    influenced: a.influenced,
  }));
}

// ═════════════════════════════════════════════════════════════════════════════
// Іздеу хелперлары
// ═════════════════════════════════════════════════════════════════════════════

/** Slugпен автор іздеу */
export function getAuthorBySlug(slug: string): CompatAuthor | undefined {
  return getCompatAuthors().find(a => a.slug === slug);
}

/** Slugпен кітап іздеу */
export function getBookBySlug(slug: string): RichBook | undefined {
  return richBooks.find(b => b.slug === slug);
}

/** Авторға байланысты кітаптар */
export function getBooksByAuthor(authorSlug: string): RichBook[] {
  return richBooks.filter(b => b.authorSlug === authorSlug);
}

/** Танымал авторлар */
export function getFeaturedAuthors(limit = 6): CompatAuthor[] {
  return getCompatAuthors().filter(a => a.popular).slice(0, limit);
}

/** Жанр slugпен іздеу */
export function getGenreBySlug(slug: string): GenreEntry | undefined {
  return genres.find(g => g.slug === slug);
}

/** Бейнелеу тәсілін slugпен іздеу */
export function getLiteraryDeviceBySlug(slug: string): LiteraryDeviceEntry | undefined {
  return literaryDevices.find(d => d.slug === slug);
}

/** Кейіпкерді slugпен іздеу */
export function getCharacterBySlug(slug: string): CharacterEntry | undefined {
  return characters.find(c => c.slug === slug);
}

/** Талдау үлгісін slugпен іздеу */
export function getAnalysisBySlug(slug: string): AnalysisExample | undefined {
  return analysisExamples.find(a => a.slug === slug);
}

/** Ұйқас үлгісін idмен іздеу */
export function getRhymePatternById(id: string) {
  return rhymePatterns.rhymeSchemes?.find((r: { id: string }) => r.id === id);
}

/** Метр типін idмен іздеу */
export function getMeterById(id: string) {
  return rhymePatterns.meterTypes?.find((m: { id: string }) => m.id === id);
}

/** Композиция үлгісін idмен іздеу */
export function getCompositionStructureById(id: string) {
  return compositionPatterns.classicStructures?.find((s: { id: string }) => s.id === id);
}

/** Мектеп бағдарламасындағы кітаптар */
export function getSchoolBooks(): RichBook[] {
  return richBooks.filter(b => b.schoolProgram);
}

/** Сынып деңгейіне арналған кітаптар */
export function getBooksByGrade(grade: string): RichBook[] {
  return richBooks.filter(b => b.gradeLevel?.includes(grade));
}

/** Тегпен кітап іздеу */
export function getBooksByTag(tag: string): RichBook[] {
  return richBooks.filter(b => b.tags?.includes(tag));
}

/** Тегпен авторды іздеу */
export function getAuthorsByTag(tag: string): CompatAuthor[] {
  return getCompatAuthors().filter(a => a.tags?.includes(tag));
}

/** Мектеп бағдарламасындағы кейіпкерлер */
export function getSchoolCharacters(): CharacterEntry[] {
  return characters.filter(c => c.tags?.includes('Мектеп бағдарламасы'));
}

/** Тиісті кейіпкерлер (шығарма slugі бойынша) */
export function getCharactersByWork(workSlug: string): CharacterEntry[] {
  return characters.filter(c => c.sourceWorkSlug === workSlug);
}

/** Талдау үлгілері (авторға байланысты) */
export function getAnalysisByAuthor(authorSlug: string): AnalysisExample[] {
  return analysisExamples.filter(a => a.authorSlug === authorSlug);
}

// ═════════════════════════════════════════════════════════════════════════════
// Metadata
// ═════════════════════════════════════════════════════════════════════════════

export const DB_META = {
  totalAuthors: richAuthors.length,
  totalBooks: richBooks.length,
  totalAnalysisExamples: analysisExamples.length,
  totalLiteraryDevices: literaryDevices.length,
  totalGenres: genres.length,
  totalCharacters: characters.length,
  totalRhymePatterns: rhymePatterns.rhymeSchemes?.length ?? 0,
  totalMeterTypes: rhymePatterns.meterTypes?.length ?? 0,
  totalCompositionStructures: compositionPatterns.classicStructures?.length ?? 0,
  version: '1.0.0',
  lastUpdated: '2026-07-19',
};
