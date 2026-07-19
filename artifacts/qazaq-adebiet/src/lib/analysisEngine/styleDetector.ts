/**
 * styleDetector.ts — Detect the writing style of a Kazakh text.
 *
 * Works fully offline using lexical, syntactic, and structural features.
 */

import {
  tokenise,
  splitSentences,
  computeStats,
  weightedAvg,
  clamp01,
  type TextStats,
} from './helper';

export type StyleRegister =
  | 'Ресми (Formal)'
  | 'Бейресми (Informal)'
  | 'Ғылыми (Academic)'
  | 'Публицистикалық'
  | 'Көркем (Artistic)'
  | 'Эпикалық'
  | 'Лирикалық'
  | 'Драмалық';

export type ToneLabel =
  | 'Жасымды (Optimistic)'
  | 'Күңгірт (Melancholic)'
  | 'Батыл (Heroic)'
  | 'Лирикалық'
  | 'Сатиралық'
  | 'Философиялық'
  | 'Нейтралды';

export type TempoLabel = 'Баяу' | 'Орташа' | 'Жылдам';

export interface StyleProfile {
  register: StyleRegister;
  tone: ToneLabel;
  tempo: TempoLabel;
  formalityScore: number;        // 0 (very informal) to 1 (very formal)
  lyricismScore: number;         // 0 to 1
  heroicScore: number;           // 0 to 1
  philosophicalScore: number;    // 0 to 1
  emotionalIntensity: number;    // 0 to 1
  descriptiveness: number;       // 0 to 1
  dialogueRatio: number;         // 0 to 1
  archaismScore: number;         // 0 to 1
  vocabularyRichness: number;    // 0 to 1
  sentenceVariety: number;       // 0 to 1
  dominantSentenceType: 'Баяндауыш' | 'Сұраулы' | 'Лепті' | 'Аралас';
  styleFingerprint: string;
  notes: string[];
}

// ── Word-level style markers ──────────────────────────────────────────────────

const FORMAL_WORDS = [
  'заңды', 'нормативті', 'ресми', 'бекіту', 'орындау', 'іске асыру',
  'жариялау', 'мақұлдау', 'қарар', 'ереже', 'тәртіп', 'мемлекеттік',
  'үкімет', 'министрлік', 'ведомство', 'талап', 'міндет',
];

const ACADEMIC_WORDS = [
  'зерттеу', 'талдау', 'гипотеза', 'нәтиже', 'қорытынды', 'деректер',
  'статистика', 'теория', 'практика', 'ғылым', 'мәселе', 'тәсіл',
  'методология', 'парадигма', 'концепция',
];

const LYRICAL_WORDS = [
  'жүрек', 'жан', 'сезім', 'армандар', 'ғашық', 'мұң', 'сағыныш',
  'нәзік', 'асыл', 'сұлу', 'жарқын', 'мөлдір', 'таза', 'нұр',
];

const HEROIC_WORDS = [
  'батыр', 'ерлік', 'жеңіс', 'намыс', 'ар', 'қылыш', 'жорық',
  'жауынгер', 'сарбаз', 'майдан', 'ұшқыр', 'тұлпар', 'бүркіт',
];

const PHILOSOPHICAL_WORDS = [
  'өмір', 'өлім', 'мән', 'ақиқат', 'болмыс', 'сана', 'рух', 'тағдыр',
  'уақыт', 'мәңгілік', 'жаратылыс', 'дана', 'парасат', 'ой', 'таным',
];

const ARCHAIC_WORDS = [
  'аллаh', 'тәңір', 'еді', 'болды', 'дейін', 'жебеу', 'қасиет',
  'ханзада', 'бек', 'жыраулар', 'мырза', 'ақсақал', 'би', 'батыр',
  'жылқы', 'тойтару', 'сайыс', 'тілек', 'бата', 'жарлық',
];

const COLLOQUIAL_WORDS = [
  'ой', 'ай', 'немене', 'нәме', 'бәлем', 'шіркін', 'апыр-ай',
  'үшті-күшті', 'майда', 'мақұл', 'жарайды', 'окей',
];

const POSITIVE_EMOTION_WORDS = [
  'бақыт', 'қуаныш', 'шаттық', 'күлді', 'мейрам', 'сүйіс', 'жарқын',
  'сәтті', 'жеңді', 'сүйеді', 'жақсы',
];

const NEGATIVE_EMOTION_WORDS = [
  'мұң', 'шер', 'зар', 'қайғы', 'жылады', 'қиналды', 'ауру',
  'жоғалту', 'жетім', 'жалғыз', 'өлім', 'қараңғы',
];

// ── Sentence type detection ───────────────────────────────────────────────────

function detectSentenceType(sentences: string[]): StyleProfile['dominantSentenceType'] {
  let q = 0, e = 0, s = 0;
  for (const sent of sentences) {
    if (/\?/.test(sent)) q++;
    else if (/!/.test(sent)) e++;
    else s++;
  }
  const total = sentences.length || 1;
  if (q / total > 0.3) return 'Сұраулы';
  if (e / total > 0.3) return 'Лепті';
  if ((q + e) / total > 0.4) return 'Аралас';
  return 'Баяндауыш';
}

// ── Score helper ──────────────────────────────────────────────────────────────

function scoreWords(tokens: string[], markers: string[]): number {
  const hits = tokens.filter((w) => markers.some((m) => w.includes(m) || m.includes(w)));
  return clamp01(hits.length / Math.max(markers.length * 0.2, 1));
}

// ── Main detector ─────────────────────────────────────────────────────────────

export function detectStyle(text: string): StyleProfile {
  const words = tokenise(text);
  const sentences = splitSentences(text);
  const stats = computeStats(text);
  const notes: string[] = [];

  // --- Dimension scores ---
  const formalityScore = weightedAvg(
    [scoreWords(words, FORMAL_WORDS), scoreWords(words, ACADEMIC_WORDS)],
    [1, 0.8],
  );
  const lyricismScore = scoreWords(words, LYRICAL_WORDS);
  const heroicScore = scoreWords(words, HEROIC_WORDS);
  const philosophicalScore = scoreWords(words, PHILOSOPHICAL_WORDS);
  const archaismScore = scoreWords(words, ARCHAIC_WORDS);
  const colloquialScore = scoreWords(words, COLLOQUIAL_WORDS);

  const positiveEmotion = scoreWords(words, POSITIVE_EMOTION_WORDS);
  const negativeEmotion = scoreWords(words, NEGATIVE_EMOTION_WORDS);
  const emotionalIntensity = clamp01((positiveEmotion + negativeEmotion) * 1.5);

  // Descriptiveness: high adjective/noun ratio + long sentences
  const descriptiveness = clamp01(
    (stats.avgSentenceLength > 12 ? 0.4 : 0.2) +
    (stats.lexicalDensity > 0.6 ? 0.3 : 0.1) +
    lyricismScore * 0.3,
  );

  // Dialogue ratio
  const dialogueLines = text.match(/[-–—]\s+[А-ЯӘІҚҒҮҰa-zA-Z]/g) ?? [];
  const dialogueRatio = clamp01(dialogueLines.length / Math.max(sentences.length, 1));

  // Vocabulary richness
  const vocabularyRichness = clamp01(stats.uniqueWordRatio * 1.2);

  // Sentence variety (mix of short and long)
  const sentLengths = sentences.map((s) => tokenise(s).length);
  const avgLen = sentLengths.reduce((a, b) => a + b, 0) / (sentLengths.length || 1);
  const variance = sentLengths.reduce((sum, l) => sum + Math.pow(l - avgLen, 2), 0) / (sentLengths.length || 1);
  const sentenceVariety = clamp01(Math.sqrt(variance) / 10);

  const dominantSentenceType = detectSentenceType(sentences);

  // --- Register ---
  let register: StyleRegister = 'Көркем (Artistic)';
  if (formalityScore > 0.5) register = 'Ресми (Formal)';
  else if (scoreWords(words, ACADEMIC_WORDS) > 0.3) register = 'Ғылыми (Academic)';
  else if (heroicScore > 0.4 && stats.lineCount > 10) register = 'Эпикалық';
  else if (lyricismScore > 0.4 && stats.lineCount > 4) register = 'Лирикалық';
  else if (dialogueRatio > 0.3) register = 'Драмалық';
  else if (colloquialScore > 0.2) register = 'Бейресми (Informal)';

  // --- Tone ---
  let tone: ToneLabel = 'Нейтралды';
  if (negativeEmotion > positiveEmotion && negativeEmotion > 0.2) tone = 'Күңгірт (Melancholic)';
  else if (positiveEmotion > negativeEmotion && positiveEmotion > 0.2) tone = 'Жасымды (Optimistic)';
  else if (heroicScore > 0.3) tone = 'Батыл (Heroic)';
  else if (lyricismScore > 0.3) tone = 'Лирикалық';
  else if (philosophicalScore > 0.3) tone = 'Философиялық';

  // --- Tempo ---
  let tempo: TempoLabel;
  if (stats.avgSentenceLength < 8) tempo = 'Жылдам';
  else if (stats.avgSentenceLength < 15) tempo = 'Орташа';
  else tempo = 'Баяу';

  // --- Style fingerprint ---
  const topDimensions: string[] = [];
  if (lyricismScore > 0.3) topDimensions.push('Лирикалық');
  if (heroicScore > 0.3) topDimensions.push('Батырлық');
  if (philosophicalScore > 0.3) topDimensions.push('Философиялық');
  if (archaismScore > 0.3) topDimensions.push('Архаикалық');
  if (descriptiveness > 0.5) topDimensions.push('Бейнелі');
  if (emotionalIntensity > 0.5) topDimensions.push('Экспрессивті');
  if (dialogueRatio > 0.3) topDimensions.push('Диалогтық');

  const styleFingerprint = topDimensions.length
    ? topDimensions.join(' + ')
    : 'Нейтралды баяндаушылық';

  // Notes
  if (archaismScore > 0.3) notes.push('Архаикалық лексика — ескі дәуір немесе ауызша дәстүр');
  if (vocabularyRichness > 0.7) notes.push('Байлығы жоғары лексика — кәсіби жазушы стилі');
  if (dialogueRatio > 0.4) notes.push('Диалог үлесі жоғары — драмалық немесе прозалық стиль');

  return {
    register,
    tone,
    tempo,
    formalityScore,
    lyricismScore,
    heroicScore,
    philosophicalScore,
    emotionalIntensity,
    descriptiveness,
    dialogueRatio,
    archaismScore,
    vocabularyRichness,
    sentenceVariety,
    dominantSentenceType,
    styleFingerprint,
    notes,
  };
}
