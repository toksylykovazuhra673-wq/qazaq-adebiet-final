/**
 * timelineDetector.ts — Extract time references and historical context from Kazakh text.
 *
 * Works fully offline.
 */

import { splitSentences, tokenise } from './helper';

export interface TimelineEvent {
  year: string | null;
  period: string;
  description: string;
  category: 'тарихи' | 'биографиялық' | 'шығармашылық' | 'қоғамдық' | 'жалпы';
  source: string; // excerpt from text
}

export interface TimelineDetectionResult {
  events: TimelineEvent[];
  detectedYears: number[];
  historicalPeriods: string[];
  temporalReferences: string[];
  dominantEra: string;
  notes: string[];
}

// ── Year patterns ─────────────────────────────────────────────────────────────

const YEAR_REGEX = /\b(1[0-9]{3}|20[0-2][0-9])\b/g;
const DECADE_REGEX = /\b(1[0-9]{2}0[-–—]жылдар|XX\s*ғасырдың\s*\d+[-–]\d+[-–]жылдары)\b/gi;

// ── Historical period keywords ────────────────────────────────────────────────

const PERIOD_DICT: { pattern: RegExp; label: string; era: string }[] = [
  { pattern: /жоңғар|ойрат|шапқыншы/i, label: 'Жоңғар шапқыншылығы', era: 'XVIII ғасыр' },
  { pattern: /алаш|алашорда/i, label: 'Алаш дәуірі', era: '1917–1920' },
  { pattern: /революция|кеңес билігі|совет/i, label: 'Кеңестік дәуір', era: 'XX ғасыр' },
  { pattern: /тәуелсіздік|егеменді|ТМД/i, label: 'Тәуелсіздік кезеңі', era: '1991–қазіргі' },
  { pattern: /хандық|хан|батыр|қазақ хандығы/i, label: 'Қазақ хандығы', era: 'XV–XVIII ғасыр' },
  { pattern: /патша|ресей|отарлау|колония/i, label: 'Ресей империясы', era: 'XIX ғасыр' },
  { pattern: /соғыс|ұлы отан|майдан|фронт/i, label: 'Ұлы Отан соғысы', era: '1941–1945' },
  { pattern: /целина|тың|тыңайған/i, label: 'Тың игеру', era: '1950–60-жылдар' },
  { pattern: /геноцид|ашаршылық|1932/i, label: 'Ашаршылық трагедиясы', era: '1932–1933' },
  { pattern: /XXI ғасыр|жаңа мыңжылдық|болашақ/i, label: 'XXI ғасыр', era: '2000–қазіргі' },
  { pattern: /ежелгі|байырғы|жерлеу|ерте/i, label: 'Ерте дәуір', era: 'Ерте тарих' },
  { pattern: /XIX ғасыр/i, label: 'XIX ғасыр', era: 'XIX ғасыр' },
  { pattern: /XX ғасыр/i, label: 'XX ғасыр', era: 'XX ғасыр' },
];

// ── Temporal reference words ──────────────────────────────────────────────────

const TEMPORAL_WORDS = [
  'бүгін', 'ертең', 'кеше', 'биыл', 'былтыр', 'осы жылы', 'өткен жылы',
  'жас кезінде', 'бала кезінде', 'ертеде', 'бір заманда', 'сол кезде',
  'енді', 'қазір', 'содан кейін', 'бұрын', 'алдыңда', 'соң',
  'таң', 'кеш', 'түн', 'жаз', 'қыс', 'күз', 'көктем',
];

// ── Category classifier ───────────────────────────────────────────────────────

function classifyEventCategory(sentence: string): TimelineEvent['category'] {
  const s = sentence.toLowerCase();
  if (/соғыс|хан|батыр|тарихи|хандық/.test(s)) return 'тарихи';
  if (/туды|қайтыс|өмір|жасты|балалық|жастық/.test(s)) return 'биографиялық';
  if (/жазды|шығарды|поэма|өлең|роман|шығарма/.test(s)) return 'шығармашылық';
  if (/халық|ел|қоғам|саясат|революция/.test(s)) return 'қоғамдық';
  return 'жалпы';
}

// ── Main detector ─────────────────────────────────────────────────────────────

export function detectTimeline(text: string): TimelineDetectionResult {
  const sentences = splitSentences(text);
  const notes: string[] = [];

  // Extract years
  const yearMatches = [...text.matchAll(YEAR_REGEX)].map((m) => parseInt(m[0]));
  const detectedYears = [...new Set(yearMatches)].sort((a, b) => a - b);

  // Historical periods
  const historicalPeriods: string[] = [];
  for (const { pattern, label } of PERIOD_DICT) {
    if (pattern.test(text)) historicalPeriods.push(label);
  }

  // Temporal references
  const temporalReferences = TEMPORAL_WORDS.filter((tw) =>
    text.toLowerCase().includes(tw),
  );

  // Build events from sentences with years
  const events: TimelineEvent[] = [];

  for (const sentence of sentences) {
    const yearHits = [...sentence.matchAll(YEAR_REGEX)].map((m) => m[0]);
    const periodHits = PERIOD_DICT.filter(({ pattern }) => pattern.test(sentence));

    if (yearHits.length > 0 || periodHits.length > 0) {
      const year = yearHits[0] ?? null;
      const period = periodHits[0]?.label ?? (year ? `${year} жыл` : 'Белгісіз уақыт');

      events.push({
        year,
        period,
        description: sentence.slice(0, 120) + (sentence.length > 120 ? '…' : ''),
        category: classifyEventCategory(sentence),
        source: sentence.slice(0, 60),
      });
    }
  }

  // Sort by year
  events.sort((a, b) => {
    const ay = a.year ? parseInt(a.year) : 9999;
    const by = b.year ? parseInt(b.year) : 9999;
    return ay - by;
  });

  // Dominant era
  let dominantEra = 'Анықталмаған';
  if (historicalPeriods.length > 0) {
    dominantEra = PERIOD_DICT.find((p) => p.label === historicalPeriods[0])?.era ?? historicalPeriods[0];
  } else if (detectedYears.length > 0) {
    const avgYear = detectedYears.reduce((a, b) => a + b, 0) / detectedYears.length;
    if (avgYear < 1800) dominantEra = 'XVII–XVIII ғасыр';
    else if (avgYear < 1900) dominantEra = 'XIX ғасыр';
    else if (avgYear < 2000) dominantEra = 'XX ғасыр';
    else dominantEra = 'XXI ғасыр';
  }

  if (events.length === 0 && detectedYears.length === 0) {
    notes.push('Мәтінде нақты уақыт белгілері анықталмады');
  }
  if (detectedYears.length > 0) {
    notes.push(`Анықталған жылдар: ${detectedYears.slice(0, 5).join(', ')}`);
  }

  return {
    events: events.slice(0, 15),
    detectedYears,
    historicalPeriods,
    temporalReferences: temporalReferences.slice(0, 10),
    dominantEra,
    notes,
  };
}
