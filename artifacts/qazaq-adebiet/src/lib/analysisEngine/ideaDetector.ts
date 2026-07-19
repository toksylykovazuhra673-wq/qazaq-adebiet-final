/**
 * ideaDetector.ts — Extract the main idea (негізгі идея) of a Kazakh text.
 *
 * Works fully offline using sentence scoring and keyword density.
 */

import {
  tokenise,
  splitSentences,
  splitParagraphs,
  wordFrequency,
  topWords,
  KAZAKH_STOP_WORDS,
} from './helper';

export interface IdeaDetectionResult {
  /** One-sentence summary of the main idea */
  mainIdea: string;
  /** Key concepts driving the idea */
  keyConcepts: string[];
  /** Representative sentences from the text */
  keysentences: string[];
  /** Dominant value or message */
  coreValue: string;
  /** Confidence [0, 1] */
  confidence: number;
}

// ── Value / message dictionaries ──────────────────────────────────────────────

const VALUE_MAP: { pattern: string[]; value: string; idea: string }[] = [
  {
    pattern: ['еркіндік', 'азаттық', 'бостандық', 'тәуелсіздік', 'күрес'],
    value: 'Еркіндік пен тәуелсіздік',
    idea: 'Халық бостандық пен тәуелсіздік үшін күресуі тиіс',
  },
  {
    pattern: ['білім', 'ғылым', 'оқу', 'надан', 'парасат', 'ақыл'],
    value: 'Білім мен ағарту',
    idea: 'Білім — адам мен халықтың ілгерілеуінің негізі',
  },
  {
    pattern: ['ана', 'туған жер', 'отан', 'ел', 'жер', 'мекен'],
    value: 'Отан сүйіспеншілігі',
    idea: 'Туған жер — адамның ең қасиетті байлығы',
  },
  {
    pattern: ['махаббат', 'сүю', 'жар', 'ғашық', 'жүрек'],
    value: 'Махаббат',
    idea: 'Шынайы махаббат — адамның рухани биіктігінің белгісі',
  },
  {
    pattern: ['батыр', 'ерлік', 'намыс', 'ар', 'жеңіс', 'жауынгер'],
    value: 'Батырлық пен намыс',
    idea: 'Ерлік пен намыс — ел тіршілігінің тірегі',
  },
  {
    pattern: ['өлім', 'жоқтау', 'қайғы', 'жылай', 'мұң', 'шер'],
    value: 'Жоғалту мен қайғы',
    idea: 'Өмірдің өткінші екендігін сезіну адамды жетілдіреді',
  },
  {
    pattern: ['табиғат', 'дала', 'тау', 'өзен', 'жайлау', 'жер'],
    value: 'Табиғатпен үйлесімділік',
    idea: 'Табиғат — адамның рухани тазалығының қайнар көзі',
  },
  {
    pattern: ['халық', 'ел', 'ұлт', 'бірлік', 'тіл', 'мәдениет'],
    value: 'Ұлттық бірлік',
    idea: 'Халықтың бірлігі мен тілі — ұлт болашағының кепілі',
  },
  {
    pattern: ['өмір', 'өлім', 'мән', 'ақиқат', 'дана', 'ой', 'болмыс'],
    value: 'Өмірдің мәні',
    idea: 'Адам өмірінің мәні — ізгіліkte және ақиқатты іздеуде',
  },
  {
    pattern: ['адамдық', 'мейірім', 'ізгілік', 'жақсылық', 'кеңпейілділік'],
    value: 'Адамгершілік',
    idea: 'Адамгершілік пен мейірімділік — адамды жануардан айыратын қасиет',
  },
];

// ── Sentence scoring ──────────────────────────────────────────────────────────

/** Score a sentence by how many top-frequency content words it contains. */
function scoreSentence(sentence: string, topFreqWords: Set<string>): number {
  const words = tokenise(sentence);
  if (!words.length) return 0;
  const hits = words.filter((w) => topFreqWords.has(w) && !KAZAKH_STOP_WORDS.has(w));
  return hits.length / words.length;
}

// ── Position bias ─────────────────────────────────────────────────────────────

/** First and last paragraphs often contain the main idea. */
function getPositionWeightedSentences(text: string): string[] {
  const paragraphs = splitParagraphs(text);
  const result: string[] = [];
  if (paragraphs.length > 0) {
    result.push(...splitSentences(paragraphs[0]));
    if (paragraphs.length > 1) {
      result.push(...splitSentences(paragraphs[paragraphs.length - 1]));
    }
    if (paragraphs.length > 2) {
      const mid = Math.floor(paragraphs.length / 2);
      result.push(...splitSentences(paragraphs[mid]));
    }
  }
  return result;
}

// ── Main detector ─────────────────────────────────────────────────────────────

export function detectIdea(text: string): IdeaDetectionResult {
  const words = tokenise(text);
  const freq = wordFrequency(text);
  const top = topWords(text, 15);
  const topSet = new Set(top);

  // Match value/idea patterns
  let coreValue = 'Жалпы адамзаттық құндылықтар';
  let mainIdea = 'Мәтіннің негізгі идеясы анықталмады';
  let confidence = 0.2;

  let bestScore = 0;
  for (const entry of VALUE_MAP) {
    const hits = entry.pattern.filter((kw) =>
      words.some((w) => w.includes(kw) || kw.includes(w)),
    );
    const score = hits.length / entry.pattern.length;
    if (score > bestScore) {
      bestScore = score;
      coreValue = entry.value;
      mainIdea = entry.idea;
      confidence = Math.min(0.95, 0.3 + score * 0.7);
    }
  }

  // Extract key concepts (top content words + most frequent)
  const keyConcepts: string[] = [];
  for (const [word, count] of freq.entries()) {
    if (!KAZAKH_STOP_WORDS.has(word) && word.length > 2 && count > 1) {
      keyConcepts.push(word);
    }
    if (keyConcepts.length >= 8) break;
  }

  // Extract representative key sentences
  const candidateSentences = getPositionWeightedSentences(text);
  const allSentences = splitSentences(text);

  const scored = allSentences
    .map((s) => ({ s, score: scoreSentence(s, topSet) }))
    .sort((a, b) => b.score - a.score);

  const keysentences: string[] = [];
  // First sentence (often introduction)
  if (allSentences[0]?.length > 20) keysentences.push(allSentences[0]);
  // Highest scoring sentence
  if (scored[0]?.s && scored[0].s !== allSentences[0]) {
    keysentences.push(scored[0].s);
  }
  // Last sentence (often conclusion)
  const last = allSentences[allSentences.length - 1];
  if (last && last.length > 20 && !keysentences.includes(last)) {
    keysentences.push(last);
  }

  return {
    mainIdea,
    keyConcepts,
    keysentences: keysentences.slice(0, 3),
    coreValue,
    confidence,
  };
}
