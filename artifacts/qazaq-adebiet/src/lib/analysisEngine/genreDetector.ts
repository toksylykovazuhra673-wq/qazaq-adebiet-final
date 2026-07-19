/**
 * genreDetector.ts — Detect the literary genre of a Kazakh text.
 *
 * Works fully offline using structural and lexical heuristics.
 */

import {
  tokenise,
  splitLines,
  splitParagraphs,
  splitSentences,
  countLineSyllables,
  allMatches,
  computeStats,
  type TextStats,
} from './helper';

export type GenreLabel =
  | 'Өлең'         // Lyric poem
  | 'Поэма'        // Narrative poem / epic poem
  | 'Жыр'         // Epic / oral epic
  | 'Толғау'       // Philosophical ode
  | 'Роман'        // Novel
  | 'Повесть'      // Novella
  | 'Әңгіме'       // Short story
  | 'Пьеса'        // Drama / play
  | 'Эссе'         // Essay
  | 'Мақала'       // Article
  | 'Аңыз'         // Legend / myth
  | 'Ертегі'       // Fairy tale
  | 'Мақал-мәтел'  // Proverb / saying
  | 'Белгісіз';    // Unknown

export interface GenreDetectionResult {
  primary: GenreLabel;
  confidence: number;
  secondary: GenreLabel | null;
  signals: string[];
  subgenre: string;
}

// ── Keyword dictionaries ──────────────────────────────────────────────────────

const GENRE_KEYWORDS: Record<string, string[]> = {
  Өлең: [
    'жырлаймын', 'жырлады', 'шумақ', 'ұйқас', 'тармақ', 'буын',
    'ән', 'жыр', 'сезім', 'махаббат', 'толқын', 'лирика',
    'сағыныш', 'мұң', 'арман', 'жүрек', 'жан',
  ],
  Поэма: [
    'поэма', 'дастан', 'жыр', 'батыр', 'ерлік', 'жол',
    'сапар', 'оқиға', 'кейіпкер', 'баяндау', 'эпос',
  ],
  Жыр: [
    'жырау', 'толғау', 'жырлады', 'айтты', 'ақын', 'домбыра',
    'батыр', 'хан', 'ел', 'жер', 'ерлік', 'намыс',
  ],
  Толғау: [
    'толғаймын', 'ойлаймын', 'заман', 'халық', 'ел', 'жастар',
    'болашақ', 'дана', 'ғибрат', 'насихат', 'өсиет',
  ],
  Роман: [
    'роман', 'тарау', 'бөлім', 'кейіпкер', 'сюжет', 'оқиға',
    'описание', 'суреттеу', 'дамыту', 'шешім', 'нәтиже',
    'тарихи', 'қоғам', 'ел', 'заман',
  ],
  Повесть: [
    'повесть', 'шағын роман', 'оқиға', 'кейіпкер', 'баяндама',
    'шешімі', 'нәтиже',
  ],
  Әңгіме: [
    'әңгіме', 'хикая', 'кейіпкер', 'оқиға', 'диалог',
    'сюжет', 'басты кейіпкер', 'эпизод',
  ],
  Пьеса: [
    'сахна', 'рөл', 'диалог', 'монолог', 'акт', 'көрініс',
    'артист', 'театр', 'режиссер', 'реплика',
    '—', '(', ')', 'дейді', 'айтады',
  ],
  Эссе: [
    'эссе', 'ойым', 'пікірімше', 'менің ойымша', 'сенімім',
    'деп ойлаймын', 'байқадым', 'деп есептеймін',
  ],
  Мақала: [
    'мақала', 'зерттеу', 'талдау', 'деректер', 'статистика',
    'ғылым', 'нәтижесінде', 'қорытынды', 'зерттелді',
  ],
  Аңыз: [
    'аңыз', 'ертеде', 'бір заманда', 'айтады', 'деседі',
    'батыр', 'ханша', 'жезтырнақ', 'пері', 'дию',
  ],
  Ертегі: [
    'ертегі', 'бір болды', 'хан болды', 'бірде', 'сонда',
    'перізат', 'самұрық', 'ажыдаха', 'жезтырнақ', 'алтын',
    'сиқырлы', 'тылсым', 'жарлы', 'бай',
  ],
  'Мақал-мәтел': [
    'мақал', 'мәтел', 'деп айтқан', 'деп тапқан', 'сөз',
    'халық даналығы', 'қанатты сөз',
  ],
};

// ── Structural heuristics ─────────────────────────────────────────────────────

interface StructuralFeatures {
  isVerse: boolean;
  isShort: boolean;
  hasManyDialogs: boolean;
  hasStageDirections: boolean;
  hasRegularSyllables: boolean;
  avgSyllablesPerLine: number;
  lineCount: number;
  paraCount: number;
}

function extractStructural(text: string, stats: TextStats): StructuralFeatures {
  const lines = splitLines(text);
  const paragraphs = splitParagraphs(text);

  // Verse detection: short lines with regular syllable counts
  const lineSyllables = lines.map(countLineSyllables);
  const avgSyl = lineSyllables.reduce((a, b) => a + b, 0) / (lineSyllables.length || 1);

  const variance =
    lineSyllables.reduce((sum, s) => sum + Math.pow(s - avgSyl, 2), 0) /
    (lineSyllables.length || 1);
  const isRegularSyllables = variance < 15 && avgSyl >= 6 && avgSyl <= 16;

  const isVerse =
    lines.length >= 4 &&
    stats.avgSentenceLength < 15 &&
    isRegularSyllables;

  const dialogCount = (text.match(/[-–—]\s+[А-ЯӘІҚҒҮҰӨҢa-zA-Z]/g) ?? []).length;
  const hasManyDialogs = dialogCount > 5;

  const stageMarkers = (text.match(/\(.*?\)|[А-ЯӘІҚҒҮҰӨҢ]{3,}:/g) ?? []).length;
  const hasStageDirections = stageMarkers > 2;

  return {
    isVerse,
    isShort: stats.wordCount < 200,
    hasManyDialogs,
    hasStageDirections,
    hasRegularSyllables: isRegularSyllables,
    avgSyllablesPerLine: avgSyl,
    lineCount: lines.length,
    paraCount: paragraphs.length,
  };
}

// ── Main detector ─────────────────────────────────────────────────────────────

export function detectGenre(text: string): GenreDetectionResult {
  const words = tokenise(text);
  const stats = computeStats(text);
  const struct = extractStructural(text, stats);

  const signals: string[] = [];

  // Keyword scores
  const kwMatches = allMatches(words, GENRE_KEYWORDS, 0.02);

  // Override with structural rules
  let forcedGenre: GenreLabel | null = null;

  if (struct.hasStageDirections) {
    forcedGenre = 'Пьеса';
    signals.push('Сахна нұсқаулары анықталды');
  } else if (struct.isVerse && struct.lineCount <= 30 && stats.wordCount < 300) {
    forcedGenre = 'Өлең';
    signals.push(`Тармақтар: ${struct.lineCount}, орташа буын: ${struct.avgSyllablesPerLine.toFixed(1)}`);
  } else if (struct.isVerse && struct.lineCount > 30) {
    forcedGenre = 'Поэма';
    signals.push(`Ұзын өлеңдік мәтін: ${struct.lineCount} тармақ`);
  } else if (struct.isShort && struct.hasManyDialogs) {
    forcedGenre = 'Әңгіме';
    signals.push('Қысқа мәтін + диалогтар');
  } else if (stats.wordCount > 5000) {
    forcedGenre = 'Роман';
    signals.push(`Ұзын мәтін: ${stats.wordCount} сөз`);
  } else if (stats.wordCount > 2000) {
    forcedGenre = 'Повесть';
    signals.push(`Орта ұзындық: ${stats.wordCount} сөз`);
  }

  // Collect keyword-based signals
  if (kwMatches.length > 0) {
    signals.push(`Кілт сөздер: «${kwMatches[0].label}» жанрына сәйкес`);
  }

  let primary: GenreLabel = forcedGenre ?? ((kwMatches[0]?.label as GenreLabel) || 'Белгісіз');
  let secondary: GenreLabel | null =
    (kwMatches[1]?.label as GenreLabel) ?? null;

  const confidence = forcedGenre
    ? 0.75
    : kwMatches[0]?.score ?? 0.1;

  // Subgenre
  let subgenre = '';
  if (primary === 'Өлең') {
    if (words.some((w) => ['ғашық', 'сүйемін', 'сүйіктім', 'жарым'].includes(w))) subgenre = 'Лирикалық өлең';
    else if (words.some((w) => ['ел', 'жер', 'отан', 'туған'].includes(w))) subgenre = 'Азаматтық лирика';
    else if (words.some((w) => ['дала', 'жайлау', 'тау', 'өзен'].includes(w))) subgenre = 'Табиғат лирикасы';
    else subgenre = 'Философиялық лирика';
  } else if (primary === 'Роман') {
    if (words.some((w) => ['тарихи', 'хан', 'батыр', 'соғыс'].includes(w))) subgenre = 'Тарихи роман';
    else if (words.some((w) => ['махаббат', 'сүйіспеншілік', 'ғашық'].includes(w))) subgenre = 'Лирикалық роман';
    else subgenre = 'Психологиялық роман';
  }

  return { primary, confidence, secondary, signals, subgenre };
}
