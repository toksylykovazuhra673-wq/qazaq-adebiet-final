/**
 * helper.ts — Shared utilities for the Kazakh literary analysis engine.
 *
 * All functions are pure and work offline (no external APIs).
 */

// ── Kazakh vowel / consonant sets ─────────────────────────────────────────────

export const KAZAKH_VOWELS = new Set(['а', 'ә', 'е', 'и', 'і', 'о', 'ө', 'у', 'ұ', 'ү', 'э', 'я', 'ю', 'ё']);
export const KAZAKH_CONSONANTS = new Set([
  'б', 'в', 'г', 'ғ', 'д', 'ж', 'з', 'й', 'к', 'қ', 'л', 'м',
  'н', 'ң', 'п', 'р', 'с', 'т', 'ф', 'х', 'һ', 'ц', 'ч', 'ш',
  'щ', 'ъ', 'ь',
]);

// ── Text normalisation ────────────────────────────────────────────────────────

/** Lowercase and strip punctuation. */
export function normalise(text: string): string {
  return text.toLowerCase().replace(/[«»„"‟"''\-—–…,;:!?.()[\]{}/\\]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Split text into word tokens (ignores empty strings). */
export function tokenise(text: string): string[] {
  return normalise(text).split(' ').filter(Boolean);
}

/** Split text into sentences (rudimentary). */
export function splitSentences(text: string): string[] {
  return text
    .split(/[.!?…]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

/** Split text into lines (for poetry). */
export function splitLines(text: string): string[] {
  return text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
}

/** Split text into paragraphs. */
export function splitParagraphs(text: string): string[] {
  return text.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter((p) => p.length > 0);
}

// ── Syllable counting ─────────────────────────────────────────────────────────

/**
 * Count syllables in a Kazakh word.
 * Rule: one syllable per vowel cluster.
 */
export function countSyllables(word: string): number {
  const lw = word.toLowerCase();
  let count = 0;
  let inVowel = false;
  for (const ch of lw) {
    if (KAZAKH_VOWELS.has(ch)) {
      if (!inVowel) { count++; inVowel = true; }
    } else {
      inVowel = false;
    }
  }
  return Math.max(1, count);
}

/** Count syllables in a full line (sum over words). */
export function countLineSyllables(line: string): number {
  return tokenise(line).reduce((sum, w) => sum + countSyllables(w), 0);
}

// ── Word frequency ────────────────────────────────────────────────────────────

/** Return a Map<word, frequency> sorted descending by count. */
export function wordFrequency(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const w of tokenise(text)) {
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  return new Map([...freq.entries()].sort((a, b) => b[1] - a[1]));
}

/** Return the top-N most frequent content words (skip stop words). */
export function topWords(text: string, n = 10): string[] {
  const freq = wordFrequency(text);
  return [...freq.keys()].filter((w) => w.length > 2 && !KAZAKH_STOP_WORDS.has(w)).slice(0, n);
}

// ── Keyword scoring ───────────────────────────────────────────────────────────

/**
 * Score how much `text` matches a keyword dictionary.
 * Returns a value in [0, 1].
 */
export function scoreKeywords(words: string[], dict: string[]): number {
  if (!words.length || !dict.length) return 0;
  let hits = 0;
  for (const w of words) {
    if (dict.some((kw) => w.includes(kw) || kw.includes(w))) hits++;
  }
  return Math.min(1, hits / Math.max(1, dict.length * 0.3));
}

/**
 * Score a record of label → keywords against the word list.
 * Returns the label with the highest score.
 */
export function bestMatch(words: string[], dict: Record<string, string[]>): { label: string; score: number } {
  let bestLabel = '';
  let bestScore = 0;
  for (const [label, kws] of Object.entries(dict)) {
    const score = scoreKeywords(words, kws);
    if (score > bestScore) { bestScore = score; bestLabel = label; }
  }
  return { label: bestLabel, score: bestScore };
}

/**
 * Return all matches above a threshold, sorted by score.
 */
export function allMatches(
  words: string[],
  dict: Record<string, string[]>,
  threshold = 0.05,
): { label: string; score: number }[] {
  return Object.entries(dict)
    .map(([label, kws]) => ({ label, score: scoreKeywords(words, kws) }))
    .filter((m) => m.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

// ── Rhyme detection ───────────────────────────────────────────────────────────

/** Extract the rhyming suffix of a word (last 2-3 vowel-containing chars). */
export function rhymeSuffix(word: string): string {
  if (!word) return '';
  const lw = word.toLowerCase().replace(/[^а-яәіөүұёa-z]/g, '');
  // find last vowel position
  let lastVowel = -1;
  for (let i = lw.length - 1; i >= 0; i--) {
    if (KAZAKH_VOWELS.has(lw[i])) { lastVowel = i; break; }
  }
  if (lastVowel < 0) return lw.slice(-2);
  return lw.slice(lastVowel);
}

/** Check whether two words rhyme. */
export function rhymes(a: string, b: string): boolean {
  if (!a || !b) return false;
  const sa = rhymeSuffix(a);
  const sb = rhymeSuffix(b);
  return sa.length >= 1 && sa === sb;
}

/**
 * Detect rhyme scheme for an array of lines.
 * Returns a string like "ABAB", "AABB", "ABBA", "AAAA", etc.
 */
export function detectRhymeScheme(lines: string[]): string {
  const lastWords = lines.map((l) => {
    const words = tokenise(l);
    return words[words.length - 1] ?? '';
  });
  const scheme: string[] = [];
  const seen: Map<string, string> = new Map();
  let nextCode = 65; // 'A'
  for (const word of lastWords) {
    if (!word) { scheme.push('-'); continue; }
    // try to find a matching rhyme already seen
    let found = '';
    for (const [w, code] of seen.entries()) {
      if (rhymes(word, w)) { found = code; break; }
    }
    if (!found) {
      found = String.fromCharCode(nextCode++);
      seen.set(word, found);
    }
    scheme.push(found);
  }
  return scheme.join('');
}

// ── Text statistics ───────────────────────────────────────────────────────────

export interface TextStats {
  charCount: number;
  wordCount: number;
  sentenceCount: number;
  lineCount: number;
  paragraphCount: number;
  avgWordLength: number;
  avgSentenceLength: number;
  uniqueWordRatio: number;
  lexicalDensity: number;
}

export function computeStats(text: string): TextStats {
  const words = tokenise(text);
  const sentences = splitSentences(text);
  const lines = splitLines(text);
  const paragraphs = splitParagraphs(text);
  const unique = new Set(words);
  const contentWords = words.filter((w) => !KAZAKH_STOP_WORDS.has(w));
  const totalCharInWords = words.reduce((s, w) => s + w.length, 0);

  return {
    charCount: text.length,
    wordCount: words.length,
    sentenceCount: sentences.length,
    lineCount: lines.length,
    paragraphCount: paragraphs.length,
    avgWordLength: words.length ? totalCharInWords / words.length : 0,
    avgSentenceLength: sentences.length ? words.length / sentences.length : 0,
    uniqueWordRatio: words.length ? unique.size / words.length : 0,
    lexicalDensity: words.length ? contentWords.length / words.length : 0,
  };
}

// ── Stop words ────────────────────────────────────────────────────────────────

export const KAZAKH_STOP_WORDS = new Set([
  'және', 'бірақ', 'немесе', 'де', 'да', 'та', 'те', 'ол', 'бұл', 'осы', 'сол', 'оның',
  'оған', 'оны', 'мен', 'сен', 'ол', 'біз', 'сіз', 'олар', 'өзі', 'өзің', 'өзім',
  'бар', 'жоқ', 'болды', 'болды', 'болған', 'болуы', 'болу', 'екен', 'еді', 'едім',
  'үшін', 'туралы', 'жайлы', 'арқылы', 'бойынша', 'дейін', 'соң', 'кейін', 'бері',
  'ең', 'өте', 'тіпті', 'тек', 'ғана', 'міне', 'алда', 'артта', 'осында', 'анда',
  'сонда', 'бұнда', 'онда', 'бұрын', 'қазір', 'кей', 'кейде', 'әлі', 'енді',
  'не', 'кім', 'қай', 'қайда', 'қашан', 'қалай', 'қанша', 'неше', 'неліктен',
  'сондықтан', 'яғни', 'демек', 'алайда', 'дегенмен', 'соған', 'соны', 'соның',
  'болса', 'болса', 'егер', 'дей', 'деп', 'деді', 'деген', 'деме', 'ал', 'ал',
  'оларды', 'оларға', 'бізге', 'бізді', 'сізге', 'сізді', 'маған', 'мені', 'саған',
  'сені', 'оған', 'оны', 'бізді', 'бізге', 'сіздерге', 'сіздерді', 'оларға',
  'оларды', 'өзге', 'басқа', 'қалған', 'әр', 'барлық', 'ешбір', 'кез', 'келген',
]);

// ── Confidence helpers ────────────────────────────────────────────────────────

/** Clamp a value to [0, 1]. */
export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Combine multiple scores into one (weighted average). */
export function weightedAvg(scores: number[], weights: number[]): number {
  const totalW = weights.reduce((a, b) => a + b, 0);
  if (!totalW) return 0;
  return scores.reduce((sum, s, i) => sum + s * weights[i], 0) / totalW;
}

/** Format a confidence score as a percentage string. */
export function pct(score: number): string {
  return `${Math.round(clamp01(score) * 100)}%`;
}
