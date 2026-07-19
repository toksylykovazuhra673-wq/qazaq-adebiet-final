/**
 * compositionDetector.ts — Detect the compositional structure of a Kazakh text.
 *
 * Works fully offline using position-based and keyword heuristics.
 */

import { splitParagraphs, splitSentences, tokenise } from './helper';

export type CompositionPartLabel =
  | 'Кіріспе'        // Introduction / exposition
  | 'Байланыс'       // Rising action / development
  | 'Шиеленіс'       // Conflict / complication
  | 'Шарықтау'       // Climax
  | 'Шешімі'         // Resolution / falling action
  | 'Эпилог'         // Epilogue
  | 'Лирикалық шегіну'; // Lyrical digression

export interface CompositionPart {
  label: CompositionPartLabel;
  text: string;
  startParagraph: number;
  endParagraph: number;
  confidence: number;
  notes: string[];
}

export interface CompositionDetectionResult {
  parts: CompositionPart[];
  totalParagraphs: number;
  hasClassicStructure: boolean;
  structureType: string;
  notes: string[];
}

// ── Keyword markers ───────────────────────────────────────────────────────────

const INTRO_MARKERS = [
  'болды', 'бір заманда', 'ертеде', 'бір кезде', 'баяғыда',
  'басталды', 'бастады', 'алғашқыда', 'алдымен', 'бірде', 'кіріспе',
];

const CONFLICT_MARKERS = [
  'бірақ', 'алайда', 'дегенмен', 'кенет', 'бірден', 'тосын',
  'қиындық', 'кедергі', 'жанжал', 'дау', 'соқтығысу', 'шиеленіс',
  'сынақ', 'қауіп', 'қиын', 'ауыр', 'мүшкіл',
];

const CLIMAX_MARKERS = [
  'ақырында', 'соңында', 'шарықтау', 'шешуші', 'маңызды',
  'шыдамады', 'шешті', 'шешім', 'жеңді', 'жеңілді', 'қайтыс',
  'алды', 'берді', 'айтты', 'жасады',
];

const RESOLUTION_MARKERS = [
  'содан бастап', 'осылай', 'сөйтіп', 'қорытындылай', 'нәтижесінде',
  'соның нәтижесінде', 'осылайша', 'бұдан', 'аяқталды', 'тамам',
];

const EPILOGUE_MARKERS = [
  'соңынан', 'кейін', 'өткен соң', 'артынша', 'мұнан кейін',
  'деп аяқталды', 'аяқталды', 'аяқтайды', 'эпилог',
];

const DIGRESSION_MARKERS = [
  'айта кету керек', 'орнын ала', 'ескерту', 'авторлық',
  'айта отырып', 'осы орайда', 'байланысты', 'шегіну',
];

// ── Score paragraph ───────────────────────────────────────────────────────────

function scoreParagraphAgainst(words: string[], markers: string[]): number {
  let hits = 0;
  for (const w of words) {
    if (markers.some((m) => w.includes(m) || m.includes(w))) hits++;
  }
  return hits;
}

// ── Paragraph-level classification ───────────────────────────────────────────

function classifyParagraph(
  paragraph: string,
  index: number,
  total: number,
): { label: CompositionPartLabel; confidence: number; notes: string[] } {
  const words = tokenise(paragraph);
  const posRatio = total > 1 ? index / (total - 1) : 0;
  const notes: string[] = [];

  const scores: Record<CompositionPartLabel, number> = {
    'Кіріспе': scoreParagraphAgainst(words, INTRO_MARKERS),
    'Байланыс': 0,
    'Шиеленіс': scoreParagraphAgainst(words, CONFLICT_MARKERS),
    'Шарықтау': scoreParagraphAgainst(words, CLIMAX_MARKERS),
    'Шешімі': scoreParagraphAgainst(words, RESOLUTION_MARKERS),
    'Эпилог': scoreParagraphAgainst(words, EPILOGUE_MARKERS),
    'Лирикалық шегіну': scoreParagraphAgainst(words, DIGRESSION_MARKERS),
  };

  // Position-based heuristics
  if (posRatio < 0.15) {
    scores['Кіріспе'] += 3;
    notes.push('Мәтіннің басталуы');
  } else if (posRatio >= 0.15 && posRatio < 0.4) {
    scores['Байланыс'] += 2;
    notes.push('Дамыту бөлімі');
  } else if (posRatio >= 0.4 && posRatio < 0.7) {
    scores['Шиеленіс'] += 1;
    scores['Шарықтау'] += 1;
  } else if (posRatio >= 0.7 && posRatio < 0.9) {
    scores['Шешімі'] += 2;
    notes.push('Шешілу бөлімі');
  } else {
    scores['Эпилог'] += 2;
    notes.push('Қорытынды');
  }

  let bestLabel: CompositionPartLabel = 'Байланыс';
  let bestScore = -1;
  for (const [label, score] of Object.entries(scores) as [CompositionPartLabel, number][]) {
    if (score > bestScore) { bestScore = score; bestLabel = label; }
  }

  const maxPossible = 5;
  const confidence = Math.min(0.9, 0.3 + (bestScore / maxPossible) * 0.6);

  return { label: bestLabel, confidence, notes };
}

// ── Merge consecutive same-label paragraphs ───────────────────────────────────

function mergeParts(parts: CompositionPart[]): CompositionPart[] {
  if (!parts.length) return [];
  const merged: CompositionPart[] = [parts[0]];
  for (let i = 1; i < parts.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = parts[i];
    if (prev.label === curr.label) {
      prev.text += '\n\n' + curr.text;
      prev.endParagraph = curr.endParagraph;
      prev.confidence = Math.max(prev.confidence, curr.confidence);
      prev.notes.push(...curr.notes);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}

// ── Main detector ─────────────────────────────────────────────────────────────

export function detectComposition(text: string): CompositionDetectionResult {
  const paragraphs = splitParagraphs(text);
  const total = paragraphs.length;
  const notes: string[] = [];

  if (total < 2) {
    return {
      parts: [{
        label: 'Кіріспе',
        text: text.slice(0, 200),
        startParagraph: 0,
        endParagraph: 0,
        confidence: 0.3,
        notes: ['Тым қысқа мәтін — толық талдау мүмкін емес'],
      }],
      totalParagraphs: total,
      hasClassicStructure: false,
      structureType: 'Қысқа мәтін',
      notes: ['Абзац жеткіліксіз'],
    };
  }

  const rawParts: CompositionPart[] = paragraphs.map((para, i) => {
    const { label, confidence, notes: pNotes } = classifyParagraph(para, i, total);
    return {
      label,
      text: para.slice(0, 200) + (para.length > 200 ? '…' : ''),
      startParagraph: i,
      endParagraph: i,
      confidence,
      notes: pNotes,
    };
  });

  const parts = mergeParts(rawParts);

  // Detect structure type
  const labels = parts.map((p) => p.label);
  const hasClassicStructure =
    labels.includes('Кіріспе') &&
    (labels.includes('Шиеленіс') || labels.includes('Шарықтау')) &&
    (labels.includes('Шешімі') || labels.includes('Эпилог'));

  let structureType = 'Еркін композиция';
  if (hasClassicStructure) {
    structureType = 'Классикалық 5 бөліктік композиция';
    notes.push('Кіріспе → Байланыс → Шиеленіс → Шарықтау → Шешімі схемасы анықталды');
  } else if (labels.includes('Кіріспе') && labels.includes('Шешімі')) {
    structureType = 'Сызықты композиция';
  } else if (total <= 3) {
    structureType = 'Лирикалық шегіну мен бейнелеу';
  }

  return { parts, totalParagraphs: total, hasClassicStructure, structureType, notes };
}
