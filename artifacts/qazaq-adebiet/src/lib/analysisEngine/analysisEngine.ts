/**
 * analysisEngine.ts — Hybrid AI Literary Analysis Engine for Kazakh Literature.
 *
 * Combines all local analysis modules into a single unified API.
 * Works fully offline — no external API calls, no internet required.
 *
 * Usage:
 *   import { analyseText } from '@/lib/analysisEngine/analysisEngine';
 *   const result = analyseText(text, { mode: 'full' });
 *
 * @module analysisEngine
 */

// ── Sub-module re-exports ─────────────────────────────────────────────────────

export { detectAuthor }       from './authorDetector';
export type { AuthorDetectionResult, AuthorSignature } from './authorDetector';

export { detectGenre }        from './genreDetector';
export type { GenreDetectionResult, GenreLabel }       from './genreDetector';

export { detectThemes }       from './themeDetector';
export type { ThemeDetectionResult, Theme }            from './themeDetector';

export { detectIdea }         from './ideaDetector';
export type { IdeaDetectionResult }                    from './ideaDetector';

export { detectComposition }  from './compositionDetector';
export type { CompositionDetectionResult, CompositionPart, CompositionPartLabel } from './compositionDetector';

export { detectCharacters }   from './characterDetector';
export type { CharacterDetectionResult, Character, CharacterRole } from './characterDetector';

export { detectPoemStructure } from './poemStructureDetector';
export type { PoemStructureResult, StanzaAnalysis, LineAnalysis, MeterType, RhymeType, StanzaType } from './poemStructureDetector';

export { detectLiteraryDevices } from './literaryDeviceDetector';
export type { LiteraryDeviceResult, LiteraryDevice }   from './literaryDeviceDetector';

export { detectTimeline }     from './timelineDetector';
export type { TimelineDetectionResult, TimelineEvent } from './timelineDetector';

export { detectStyle }        from './styleDetector';
export type { StyleProfile, StyleRegister, ToneLabel, TempoLabel } from './styleDetector';

export {
  computeStats,
  tokenise,
  splitLines,
  splitSentences,
  splitParagraphs,
  countSyllables,
  countLineSyllables,
  detectRhymeScheme,
  rhymes,
  wordFrequency,
  topWords,
  pct,
} from './helper';
export type { TextStats } from './helper';

// ── Imports for unified analysis ──────────────────────────────────────────────

import { detectAuthor }          from './authorDetector';
import { detectGenre }           from './genreDetector';
import { detectThemes }          from './themeDetector';
import { detectIdea }            from './ideaDetector';
import { detectComposition }     from './compositionDetector';
import { detectCharacters }      from './characterDetector';
import { detectPoemStructure }   from './poemStructureDetector';
import { detectLiteraryDevices } from './literaryDeviceDetector';
import { detectTimeline }        from './timelineDetector';
import { detectStyle }           from './styleDetector';
import { computeStats, topWords } from './helper';

import type { AuthorDetectionResult }        from './authorDetector';
import type { GenreDetectionResult }         from './genreDetector';
import type { ThemeDetectionResult }         from './themeDetector';
import type { IdeaDetectionResult }          from './ideaDetector';
import type { CompositionDetectionResult }   from './compositionDetector';
import type { CharacterDetectionResult }     from './characterDetector';
import type { PoemStructureResult }          from './poemStructureDetector';
import type { LiteraryDeviceResult }         from './literaryDeviceDetector';
import type { TimelineDetectionResult }      from './timelineDetector';
import type { StyleProfile }                 from './styleDetector';
import type { TextStats }                    from './helper';

// ── Analysis options ──────────────────────────────────────────────────────────

export type AnalysisMode =
  | 'full'       // All modules
  | 'quick'      // Genre + themes + idea only
  | 'poem'       // Genre + poem structure + devices + style
  | 'prose'      // Genre + composition + characters + themes + timeline
  | 'style';     // Style + devices + author

export interface AnalysisOptions {
  /** Which modules to run. Default: 'full'. */
  mode?: AnalysisMode;
  /** Hint: is the text poetry? Overrides auto-detection for structure analysis. */
  isPoem?: boolean;
  /** Hint: author slug (if known) — used for better author comparison. */
  knownAuthorSlug?: string;
}

// ── Unified result ────────────────────────────────────────────────────────────

export interface AnalysisResult {
  /** Input text metadata */
  meta: {
    textLength: number;
    analysedAt: string;
    mode: AnalysisMode;
    durationMs: number;
  };

  /** Basic text statistics */
  stats: TextStats;

  /** Most frequent content words */
  topWords: string[];

  /** Genre detection */
  genre: GenreDetectionResult;

  /** Theme detection */
  themes: ThemeDetectionResult;

  /** Main idea / core message */
  idea: IdeaDetectionResult;

  /** Stylistic profile */
  style: StyleProfile;

  /** Literary / rhetorical devices */
  devices: LiteraryDeviceResult;

  /** Authorship fingerprint comparison */
  author: AuthorDetectionResult;

  /** Compositional structure (prose) */
  composition: CompositionDetectionResult | null;

  /** Character analysis */
  characters: CharacterDetectionResult | null;

  /** Poem structure (poetry) */
  poemStructure: PoemStructureResult | null;

  /** Timeline / historical context */
  timeline: TimelineDetectionResult;

  /** One-sentence overall summary */
  summary: string;

  /** Key insights for display */
  insights: string[];
}

// ── Mode → module mapping ─────────────────────────────────────────────────────

const MODE_FLAGS: Record<AnalysisMode, {
  runComposition: boolean;
  runCharacters: boolean;
  runPoem: boolean;
  runTimeline: boolean;
  runAuthor: boolean;
}> = {
  full:   { runComposition: true,  runCharacters: true,  runPoem: true,  runTimeline: true,  runAuthor: true  },
  quick:  { runComposition: false, runCharacters: false, runPoem: false, runTimeline: false, runAuthor: false },
  poem:   { runComposition: false, runCharacters: false, runPoem: true,  runTimeline: false, runAuthor: true  },
  prose:  { runComposition: true,  runCharacters: true,  runPoem: false, runTimeline: true,  runAuthor: false },
  style:  { runComposition: false, runCharacters: false, runPoem: false, runTimeline: false, runAuthor: true  },
};

// ── Summary generator ─────────────────────────────────────────────────────────

function buildSummary(result: Omit<AnalysisResult, 'summary' | 'insights' | 'meta'>): string {
  const genre = result.genre.primary;
  const subgenre = result.genre.subgenre ? ` (${result.genre.subgenre})` : '';
  const primaryTheme = result.themes.primary.labelKk ?? result.themes.primary.label;
  const tone = result.style.tone;
  const idea = result.idea.coreValue;
  const words = result.stats.wordCount;

  let poemInfo = '';
  if (result.poemStructure) {
    const ps = result.poemStructure;
    poemInfo = ` ${ps.totalLines} тармақ, ${ps.dominantMeter},`;
  }

  return (
    `«${genre}»${subgenre} жанрындағы мәтін${poemInfo} ` +
    `${words} сөзден тұрады. ` +
    `Негізгі тақырыбы — «${primaryTheme}». ` +
    `Үн: ${tone}. ` +
    `Негізгі идеясы: ${idea}.`
  );
}

// ── Insight generator ─────────────────────────────────────────────────────────

function buildInsights(result: Omit<AnalysisResult, 'summary' | 'insights' | 'meta'>): string[] {
  const insights: string[] = [];

  // Genre
  const conf = Math.round((result.genre.confidence ?? 0) * 100);
  insights.push(`📖 Жанр: «${result.genre.primary}» (${conf}% сенімділік)`);

  // Themes
  const themes = [result.themes.primary, ...result.themes.secondary]
    .slice(0, 3)
    .map((t) => t.labelKk)
    .join(', ');
  if (themes) insights.push(`🎭 Тақырыптар: ${themes}`);

  // Style
  insights.push(`✍️ Стиль: ${result.style.styleFingerprint}`);
  insights.push(`🎵 Үн: ${result.style.tone} · Қарқын: ${result.style.tempo}`);

  // Poem structure
  if (result.poemStructure) {
    const ps = result.poemStructure;
    insights.push(`📏 Өлең: ${ps.dominantMeter} · Ұйқас: ${result.poemStructure.rhymeType}`);
    if (ps.isFreeVerse) insights.push('🎶 Еркін өлең (верлибр)');
  }

  // Devices
  const devCount = result.devices.totalFound;
  if (devCount > 0) {
    const topDev = result.devices.devices.slice(0, 3).map((d) => d.name).join(', ');
    insights.push(`🔮 Бейнелеу құралдары (${devCount}): ${topDev}`);
    insights.push(`💎 Лексикалық байлық: ${result.devices.richness}`);
  }

  // Characters
  if (result.characters && result.characters.totalCharacters > 0) {
    const protagonist = result.characters.protagonistName ?? 'Белгісіз';
    insights.push(`👤 Басты кейіпкер: ${protagonist} (${result.characters.totalCharacters} кейіпкер)`);
  }

  // Author
  if (result.author.topMatch) {
    const a = result.author.topMatch;
    const ac = Math.round(a.confidence * 100);
    insights.push(`🖋 Стиль жақындығы: ${a.name} (${ac}%)`);
  }

  // Idea
  insights.push(`💡 Негізгі идея: ${result.idea.mainIdea}`);

  // Composition
  if (result.composition) {
    insights.push(`🏗 Композиция: ${result.composition.structureType}`);
  }

  // Timeline
  if (result.timeline.historicalPeriods.length > 0) {
    insights.push(`📅 Тарихи кезең: ${result.timeline.historicalPeriods[0]}`);
  }

  return insights;
}

// ── Main analysis function ────────────────────────────────────────────────────

/**
 * Analyse a Kazakh literary text using all (or selected) local modules.
 *
 * @param text     - The input text (Kazakh, any length)
 * @param options  - Analysis options (mode, hints)
 * @returns        A unified AnalysisResult object
 *
 * @example
 * const result = analyseText(abaiPoem, { mode: 'poem' });
 * console.log(result.poemStructure?.dominantMeter);
 * console.log(result.themes.primary.labelKk);
 */
export function analyseText(text: string, options: AnalysisOptions = {}): AnalysisResult {
  const startTime = Date.now();
  const mode: AnalysisMode = options.mode ?? 'full';
  const flags = MODE_FLAGS[mode];

  if (!text || text.trim().length === 0) {
    throw new Error('analyseText: мәтін бос болуы мүмкін емес');
  }

  // ── Core modules (always run) ──
  const stats    = computeStats(text);
  const top      = topWords(text, 12);
  const genre    = detectGenre(text);
  const themes   = detectThemes(text);
  const idea     = detectIdea(text);
  const style    = detectStyle(text);
  const devices  = detectLiteraryDevices(text);
  const timeline = detectTimeline(text);

  // ── Optional modules ──
  const isPoem = options.isPoem ?? (genre.primary === 'Өлең' || genre.primary === 'Поэма' || genre.primary === 'Жыр');

  const poemStructure = (flags.runPoem && isPoem)
    ? detectPoemStructure(text)
    : null;

  const composition = (flags.runComposition && !isPoem)
    ? detectComposition(text)
    : null;

  const characters = flags.runCharacters
    ? detectCharacters(text)
    : null;

  const author = flags.runAuthor
    ? detectAuthor(text)
    : { topMatch: null, candidates: [], styleTrait: '' };

  // ── Build result ──
  const partial = {
    stats,
    topWords: top,
    genre,
    themes,
    idea,
    style,
    devices,
    author,
    composition,
    characters,
    poemStructure,
    timeline,
  };

  const summary  = buildSummary(partial);
  const insights = buildInsights(partial);
  const durationMs = Date.now() - startTime;

  return {
    meta: {
      textLength: text.length,
      analysedAt: new Date().toISOString(),
      mode,
      durationMs,
    },
    ...partial,
    summary,
    insights,
  };
}

/**
 * Quick analysis — genre, themes, idea, and style only.
 * Fastest option for short texts or real-time previews.
 */
export function quickAnalyse(text: string): Pick<
  AnalysisResult,
  'genre' | 'themes' | 'idea' | 'style' | 'stats' | 'topWords' | 'summary' | 'insights'
> {
  const full = analyseText(text, { mode: 'quick' });
  return {
    genre: full.genre,
    themes: full.themes,
    idea: full.idea,
    style: full.style,
    stats: full.stats,
    topWords: full.topWords,
    summary: full.summary,
    insights: full.insights,
  };
}

/**
 * Poem-optimised analysis.
 * Runs genre, poem structure, devices, themes, style, and author matching.
 */
export function analysePoem(text: string): AnalysisResult {
  return analyseText(text, { mode: 'poem', isPoem: true });
}

/**
 * Prose-optimised analysis.
 * Runs genre, composition, characters, themes, timeline, and style.
 */
export function analyseProse(text: string): AnalysisResult {
  return analyseText(text, { mode: 'prose', isPoem: false });
}

// ── Engine metadata ───────────────────────────────────────────────────────────

export const ENGINE_META = {
  name: 'QazaqAdebiet Hybrid Analysis Engine',
  version: '1.0.0',
  language: 'Қазақша',
  offline: true,
  modules: [
    'genreDetector',
    'themeDetector',
    'ideaDetector',
    'styleDetector',
    'literaryDeviceDetector',
    'poemStructureDetector',
    'compositionDetector',
    'characterDetector',
    'authorDetector',
    'timelineDetector',
  ],
  description:
    'Интернетсіз жұмыс істейтін Гибридті AI Қазақ әдебиеті талдау жүйесі. ' +
    'Барлық талдау жергілікті JavaScript арқылы орындалады.',
} as const;
