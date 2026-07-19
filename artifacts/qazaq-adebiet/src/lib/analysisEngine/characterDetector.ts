/**
 * characterDetector.ts — Detect and profile characters in Kazakh literary texts.
 *
 * Works fully offline.
 */

import { splitSentences, tokenise, wordFrequency } from './helper';

export type CharacterRole = 'Басты кейіпкер' | 'Қосалқы кейіпкер' | 'Эпизодтық кейіпкер';

export interface Character {
  name: string;
  role: CharacterRole;
  mentions: number;
  traits: string[];
  actions: string[];
  sentences: string[];
}

export interface CharacterDetectionResult {
  characters: Character[];
  protagonistName: string | null;
  totalCharacters: number;
  notes: string[];
}

// ── Known Kazakh names & name parts ──────────────────────────────────────────

const KAZAKH_NAME_SUFFIXES = [
  'ұлы', 'қызы', 'ов', 'ова', 'ев', 'ева', 'бек', 'хан', 'бай',
  'жан', 'гүл', 'нұр', 'ай', 'бала', 'берді', 'алы', 'ұлы',
];

const COMMON_KAZAKH_NAMES = new Set([
  // Male
  'абай', 'ахмет', 'сұлтан', 'ерлан', 'нұрлан', 'асыл', 'арман', 'темір',
  'бейбіт', 'серік', 'дамир', 'руслан', 'ержан', 'алмас', 'болат', 'нұрбол',
  'алихан', 'бауыржан', 'дулат', 'мұрат', 'ғалымжан', 'сейіт', 'рустем',
  'жанболат', 'айбек', 'рустам', 'тимур', 'рахым', 'ізет', 'дәурен',
  'айбар', 'алтай', 'данияр', 'марат', 'жандос', 'нурлан', 'бекзат',
  // Female
  'айгерім', 'тоғжан', 'акбота', 'ақерке', 'назым', 'меруерт', 'айнұр',
  'гүлнар', 'алия', 'сауле', 'жансая', 'ажар', 'акмарал', 'бибігүл',
  'жазира', 'нұргүл', 'мадина', 'перізат', 'ұлбосын', 'шолпан', 'жұлдыз',
  'ботакөз', 'қаракөз', 'айжан', 'сандугаш', 'гульмира', 'зауреш', 'венера',
  // Literary / historical
  'қозы', 'баян', 'дина', 'еңлік', 'кебек', 'назқоңыр', 'ақбілек',
  'жібек', 'тоқтар', 'абылай', 'кенесары', 'бөгенбай', 'қабанбай',
]);

// ── Trait / action dictionaries ───────────────────────────────────────────────

const POSITIVE_TRAITS = ['батыл', 'ақылды', 'сұлу', 'мейірімді', 'адал', 'жігерлі', 'намысты', 'асыл'];
const NEGATIVE_TRAITS = ['зұлым', 'пысқырылды', 'жаман', 'ашкөз', 'мас', 'сатқын', 'қорқақ', 'арсыз'];
const ACTION_VERBS = ['айтты', 'деді', 'жасады', 'барды', 'келді', 'кетті', 'тұрды', 'отырды',
  'сойды', 'алды', 'берді', 'жеңді', 'жылады', 'күлді', 'ойлады', 'сезді'];

// ── Capitalised word detection ────────────────────────────────────────────────

/** Heuristic: a capitalised word that looks like a proper noun. */
function isLikelyName(word: string): boolean {
  if (word.length < 2) return false;
  const lw = word.toLowerCase();
  if (COMMON_KAZAKH_NAMES.has(lw)) return true;
  // Capitalised and ends with known suffix
  if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
    if (KAZAKH_NAME_SUFFIXES.some((s) => lw.endsWith(s))) return true;
    // At least 3 chars, capitalised, no digits
    if (lw.length >= 3 && !/\d/.test(lw) && COMMON_KAZAKH_NAMES.has(lw)) return true;
  }
  return COMMON_KAZAKH_NAMES.has(lw);
}

/** Extract sentences mentioning this name. */
function getMentioningSentences(name: string, sentences: string[]): string[] {
  const lname = name.toLowerCase();
  return sentences
    .filter((s) => s.toLowerCase().includes(lname))
    .slice(0, 3);
}

/** Extract traits mentioned near the character's name. */
function extractTraits(name: string, sentences: string[]): string[] {
  const lname = name.toLowerCase();
  const traits: string[] = [];
  for (const s of sentences) {
    if (!s.toLowerCase().includes(lname)) continue;
    const words = tokenise(s);
    for (const w of words) {
      if (POSITIVE_TRAITS.some((t) => w.includes(t))) traits.push(w);
      if (NEGATIVE_TRAITS.some((t) => w.includes(t))) traits.push(w);
    }
  }
  return [...new Set(traits)].slice(0, 4);
}

/** Extract actions performed by the character. */
function extractActions(name: string, sentences: string[]): string[] {
  const lname = name.toLowerCase();
  const actions: string[] = [];
  for (const s of sentences) {
    if (!s.toLowerCase().includes(lname)) continue;
    const words = tokenise(s);
    for (const w of words) {
      if (ACTION_VERBS.some((v) => w.includes(v))) actions.push(w);
    }
  }
  return [...new Set(actions)].slice(0, 4);
}

// ── Main detector ─────────────────────────────────────────────────────────────

export function detectCharacters(text: string): CharacterDetectionResult {
  const sentences = splitSentences(text);
  const words = tokenise(text);
  const freq = wordFrequency(text);
  const notes: string[] = [];

  // Collect candidate names
  const nameCandidates = new Map<string, number>();

  // From known names list
  for (const [word, count] of freq.entries()) {
    if (isLikelyName(word)) {
      nameCandidates.set(word, count);
    }
  }

  // From capitalised raw tokens
  for (const rawWord of text.match(/[А-ЯӘІҚҒҮҰӨҢA-Z][а-яәіқғүұөңa-z]{2,}/g) ?? []) {
    const lw = rawWord.toLowerCase();
    if (!nameCandidates.has(lw) && isLikelyName(lw)) {
      nameCandidates.set(lw, (nameCandidates.get(lw) ?? 0) + 1);
    }
  }

  if (nameCandidates.size === 0) {
    notes.push('Мәтінде нақты кейіпкер аттары анықталмады');
    return { characters: [], protagonistName: null, totalCharacters: 0, notes };
  }

  // Sort by frequency
  const sortedNames = [...nameCandidates.entries()].sort((a, b) => b[1] - a[1]);
  const maxMentions = sortedNames[0]?.[1] ?? 1;

  const characters: Character[] = sortedNames.slice(0, 10).map(([name, mentions]) => {
    let role: CharacterRole;
    const ratio = mentions / maxMentions;
    if (ratio >= 0.7) role = 'Басты кейіпкер';
    else if (ratio >= 0.3) role = 'Қосалқы кейіпкер';
    else role = 'Эпизодтық кейіпкер';

    // Capitalise
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);

    return {
      name: displayName,
      role,
      mentions,
      traits: extractTraits(name, sentences),
      actions: extractActions(name, sentences),
      sentences: getMentioningSentences(name, sentences),
    };
  });

  const protagonistName = characters[0]?.name ?? null;

  if (characters.length === 0) notes.push('Кейіпкерлер анықталмады');
  if (characters.length === 1) notes.push('Бір кейіпкерлі монолог немесе лирика');

  return {
    characters,
    protagonistName,
    totalCharacters: characters.length,
    notes,
  };
}
