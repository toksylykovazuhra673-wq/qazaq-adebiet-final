/**
 * poemStructureDetector.ts — Structural analysis of Kazakh poetry.
 *
 * Detects meter, rhyme scheme, stanza type, caesura, and syllabic patterns.
 * Works fully offline.
 */

import {
  splitLines,
  tokenise,
  countLineSyllables,
  detectRhymeScheme,
  rhymeSuffix,
  rhymes,
} from './helper';

export type StanzaType =
  | 'Шумақ (4 тармақ)'      // Quatrain
  | 'Үштармақ (3 тармақ)'   // Tercet
  | 'Бесікжыр (5 тармақ)'   // Cinquain
  | 'Алтылық (6 тармақ)'    // Sestet
  | 'Сегіздік (8 тармақ)'   // Octave
  | 'Еркін (аралас)'        // Free verse stanza
  | 'Бейт (2 тармақ)';      // Couplet

export type RhymeType =
  | 'Шұбыртпалы (AAAA)'
  | 'Кезекті (ABAB)'
  | 'Ұйқасты (AABB)'
  | 'Шалыс (ABBA)'
  | 'Аралас'
  | 'Ұйқассыз (еркін)';

export type MeterType =
  | 'Жеті буын (7)'
  | 'Сегіз буын (8)'
  | 'Он бір буын (11)'
  | 'Он төрт буын (14)'
  | 'Алты буын (6)'
  | 'Тоғыз буын (9)'
  | 'Он буын (10)'
  | 'Он үш буын (13)'
  | 'Аралас'
  | 'Еркін';

export interface LineAnalysis {
  text: string;
  syllables: number;
  rhymeCode: string;
  endWord: string;
  endSuffix: string;
}

export interface StanzaAnalysis {
  lines: LineAnalysis[];
  type: StanzaType;
  rhymeScheme: string;
  avgSyllables: number;
}

export interface PoemStructureResult {
  totalLines: number;
  totalStanzas: number;
  stanzas: StanzaAnalysis[];
  dominantMeter: MeterType;
  rhymeType: RhymeType;
  rhymeScheme: string;
  syllablePattern: number[];
  hasRegularMeter: boolean;
  hasRhyme: boolean;
  isFreeVerse: boolean;
  alliterationLines: string[];
  refrain: string | null;
  notes: string[];
}

// ── Stanza splitter ───────────────────────────────────────────────────────────

function splitIntoStanzas(text: string): string[][] {
  const blocks = text.split(/\r?\n\s*\r?\n/).map((b) => b.trim()).filter(Boolean);
  if (blocks.length > 1) {
    return blocks.map((b) => b.split(/\r?\n/).map((l) => l.trim()).filter(Boolean));
  }
  // Single block: group by 4 lines
  const lines = splitLines(text);
  const stanzas: string[][] = [];
  for (let i = 0; i < lines.length; i += 4) {
    stanzas.push(lines.slice(i, i + 4));
  }
  return stanzas;
}

// ── Stanza type ───────────────────────────────────────────────────────────────

function classifyStanza(lines: string[]): StanzaType {
  switch (lines.length) {
    case 2: return 'Бейт (2 тармақ)';
    case 3: return 'Үштармақ (3 тармақ)';
    case 4: return 'Шумақ (4 тармақ)';
    case 5: return 'Бесікжыр (5 тармақ)';
    case 6: return 'Алтылық (6 тармақ)';
    case 8: return 'Сегіздік (8 тармақ)';
    default: return 'Еркін (аралас)';
  }
}

// ── Meter detection ───────────────────────────────────────────────────────────

function detectMeter(syllableCounts: number[]): { meter: MeterType; isRegular: boolean } {
  if (!syllableCounts.length) return { meter: 'Еркін', isRegular: false };
  const freq = new Map<number, number>();
  for (const s of syllableCounts) freq.set(s, (freq.get(s) ?? 0) + 1);
  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0];
  const isRegular = dominant[1] / syllableCounts.length >= 0.6;

  const METER_MAP: Record<number, MeterType> = {
    6: 'Алты буын (6)',
    7: 'Жеті буын (7)',
    8: 'Сегіз буын (8)',
    9: 'Тоғыз буын (9)',
    10: 'Он буын (10)',
    11: 'Он бір буын (11)',
    13: 'Он үш буын (13)',
    14: 'Он төрт буын (14)',
  };

  const meter: MeterType = METER_MAP[dominant[0]] ?? (isRegular ? 'Аралас' : 'Еркін');
  return { meter, isRegular };
}

// ── Rhyme type ────────────────────────────────────────────────────────────────

function classifyRhymeType(scheme: string): RhymeType {
  if (!scheme || scheme.length < 2) return 'Ұйқассыз (еркін)';
  // Check all-same
  if ([...new Set(scheme.split(''))].filter((c) => c !== '-').length === 1) return 'Шұбыртпалы (AAAA)';
  // ABAB
  if (scheme.length >= 4 && scheme[0] !== scheme[1] && scheme[0] === scheme[2] && scheme[1] === scheme[3]) return 'Кезекті (ABAB)';
  // AABB
  if (scheme.length >= 4 && scheme[0] === scheme[1] && scheme[2] === scheme[3]) return 'Ұйқасты (AABB)';
  // ABBA
  if (scheme.length >= 4 && scheme[0] === scheme[3] && scheme[1] === scheme[2] && scheme[0] !== scheme[1]) return 'Шалыс (ABBA)';
  // Check if mostly rhyming
  const unique = new Set(scheme.split('').filter((c) => c !== '-'));
  if (unique.size <= scheme.length * 0.6) return 'Аралас';
  return 'Ұйқассыз (еркін)';
}

// ── Alliteration ─────────────────────────────────────────────────────────────

function detectAlliteration(lines: string[]): string[] {
  const result: string[] = [];
  for (const line of lines) {
    const words = tokenise(line);
    if (words.length < 3) continue;
    const firstChars = words.map((w) => w[0]).filter(Boolean);
    const charFreq = new Map<string, number>();
    for (const c of firstChars) charFreq.set(c, (charFreq.get(c) ?? 0) + 1);
    const maxFreq = Math.max(...charFreq.values());
    if (maxFreq >= 3) result.push(line);
  }
  return result.slice(0, 5);
}

// ── Refrain detection ─────────────────────────────────────────────────────────

function detectRefrain(stanzas: string[][]): string | null {
  if (stanzas.length < 2) return null;
  // Check last line of each stanza
  const lastLines = stanzas.map((s) => s[s.length - 1]?.toLowerCase().trim() ?? '');
  const freq = new Map<string, number>();
  for (const l of lastLines) freq.set(l, (freq.get(l) ?? 0) + 1);
  for (const [line, count] of freq.entries()) {
    if (count >= 2 && line.length > 5) return line;
  }
  return null;
}

// ── Main detector ─────────────────────────────────────────────────────────────

export function detectPoemStructure(text: string): PoemStructureResult {
  const stanzaLines = splitIntoStanzas(text);
  const allLines = stanzaLines.flat();
  const notes: string[] = [];

  // Per-line analysis
  const lineAnalyses: LineAnalysis[] = allLines.map((line) => {
    const words = tokenise(line);
    const endWord = words[words.length - 1] ?? '';
    return {
      text: line,
      syllables: countLineSyllables(line),
      rhymeCode: '',
      endWord,
      endSuffix: rhymeSuffix(endWord),
    };
  });

  // Global rhyme scheme
  const fullScheme = detectRhymeScheme(allLines);
  lineAnalyses.forEach((la, i) => { la.rhymeCode = fullScheme[i] ?? '-'; });

  // Syllable pattern
  const syllablePattern = lineAnalyses.map((la) => la.syllables);
  const { meter: dominantMeter, isRegular } = detectMeter(syllablePattern);
  const rhymeType = classifyRhymeType(fullScheme);
  const hasRhyme = !['Ұйқассыз (еркін)'].includes(rhymeType);
  const isFreeVerse = !isRegular && !hasRhyme;

  // Per-stanza analysis
  const stanzas: StanzaAnalysis[] = stanzaLines.map((lines) => {
    const scheme = detectRhymeScheme(lines);
    const syls = lines.map(countLineSyllables);
    const avg = syls.reduce((a, b) => a + b, 0) / (syls.length || 1);
    return {
      lines: lines.map((l, i) => ({
        text: l,
        syllables: countLineSyllables(l),
        rhymeCode: scheme[i] ?? '-',
        endWord: tokenise(l).slice(-1)[0] ?? '',
        endSuffix: rhymeSuffix(tokenise(l).slice(-1)[0] ?? ''),
      })),
      type: classifyStanza(lines),
      rhymeScheme: scheme,
      avgSyllables: avg,
    };
  });

  const alliterationLines = detectAlliteration(allLines);
  if (alliterationLines.length) notes.push(`Анафора / аллитерация: ${alliterationLines.length} тармақ`);

  const refrain = detectRefrain(stanzaLines);
  if (refrain) notes.push(`Қайырма анықталды: «${refrain.slice(0, 40)}…»`);

  if (isFreeVerse) notes.push('Еркін өлең (верлибр) — ұйқас пен ырғақ жоқ');
  else if (isRegular) notes.push(`Ырғақ: ${dominantMeter}`);

  return {
    totalLines: allLines.length,
    totalStanzas: stanzaLines.length,
    stanzas,
    dominantMeter,
    rhymeType,
    rhymeScheme: fullScheme,
    syllablePattern,
    hasRegularMeter: isRegular,
    hasRhyme,
    isFreeVerse,
    alliterationLines,
    refrain,
    notes,
  };
}
