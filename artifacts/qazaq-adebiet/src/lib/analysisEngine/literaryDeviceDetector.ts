/**
 * literaryDeviceDetector.ts — Detect literary / rhetorical devices in Kazakh text.
 *
 * Works fully offline.
 */

import { splitSentences, splitLines, tokenise } from './helper';

export interface LiteraryDevice {
  name: string;       // Kazakh name
  nameRu: string;     // Russian term
  description: string;
  examples: string[];
  count: number;
  confidence: number;
}

export interface LiteraryDeviceResult {
  devices: LiteraryDevice[];
  totalFound: number;
  richness: 'Өте бай' | 'Бай' | 'Орташа' | 'Шектеулі';
  notes: string[];
}

// ── Pattern helpers ───────────────────────────────────────────────────────────

/** Find all sentence-level matches for a regex. */
function findByPattern(sentences: string[], pattern: RegExp): string[] {
  return sentences.filter((s) => pattern.test(s)).slice(0, 3);
}

/** Find all line-level matches. */
function findLineByPattern(lines: string[], pattern: RegExp): string[] {
  return lines.filter((l) => pattern.test(l)).slice(0, 3);
}

// ── Teңеу (Simile) ─────────────────────────────────────────────────────────────
const SIMILE_PATTERN = /\b(сияқты|секілді|тәрізді|ұқсас|дей|деген|сияқта|бейне)\b/i;

// ── Метафора (Metaphor) — A is B constructions ─────────────────────────────────
const METAPHOR_PATTERN = /\b(\w+)\s+(—|–|-)\s+(\w+)/;

// ── Жандандыру (Personification) ──────────────────────────────────────────────
const PERSONIFICATION_KEYWORDS = ['жылады', 'күлді', 'ойлады', 'сөйледі', 'тыңдады', 'ашуланды', 'сезді', 'армандады'];

// ── Анафора (Anaphora) ─────────────────────────────────────────────────────────
function detectAnaphora(lines: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const curr = lines[i].toLowerCase().split(/\s+/)[0];
    const next = lines[i + 1].toLowerCase().split(/\s+/)[0];
    if (curr && curr === next && curr.length > 1) {
      result.push(`«${lines[i]}» / «${lines[i + 1]}»`);
    }
  }
  return [...new Set(result)].slice(0, 3);
}

// ── Эпифора (Epiphora) ─────────────────────────────────────────────────────────
function detectEpiphora(lines: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const currW = lines[i].toLowerCase().split(/\s+/);
    const nextW = lines[i + 1].toLowerCase().split(/\s+/);
    const currEnd = currW[currW.length - 1];
    const nextEnd = nextW[nextW.length - 1];
    if (currEnd && currEnd === nextEnd && currEnd.length > 2) {
      result.push(`«…${currEnd}» / «…${nextEnd}»`);
    }
  }
  return [...new Set(result)].slice(0, 3);
}

// ── Риторикалық сұрақ (Rhetorical question) ─────────────────────────────────
const RHETORICAL_PATTERN = /[?？]\s*$/m;

// ── Эпитет (Epithet) ─────────────────────────────────────────────────────────
const EPITHET_ADJECTIVES = [
  'алтын', 'күміс', 'асыл', 'қасиетті', 'сұлу', 'нәзік', 'ұлы', 'зор',
  'жарқын', 'сұрапыл', 'мөлдір', 'таза', 'биік', 'терең', 'жалтыр',
  'маңдайы', 'қайғылы', 'шексіз', 'мәңгі', 'жасыл', 'аппақ', 'қара',
];

function detectEpithets(sentences: string[]): string[] {
  const found: string[] = [];
  for (const s of sentences) {
    const words = tokenise(s);
    for (let i = 0; i < words.length - 1; i++) {
      if (EPITHET_ADJECTIVES.some((adj) => words[i].includes(adj))) {
        found.push(`«${words[i]} ${words[i + 1] ?? ''}»`);
      }
    }
  }
  return [...new Set(found)].slice(0, 4);
}

// ── Аллитерация ───────────────────────────────────────────────────────────────
function detectAlliterationDevice(lines: string[]): string[] {
  const found: string[] = [];
  for (const line of lines) {
    const words = tokenise(line);
    if (words.length < 3) continue;
    const initials = words.map((w) => w[0]).filter(Boolean);
    const freq = new Map<string, number>();
    for (const c of initials) freq.set(c, (freq.get(c) ?? 0) + 1);
    for (const [, count] of freq.entries()) {
      if (count >= 3) { found.push(line); break; }
    }
  }
  return found.slice(0, 3);
}

// ── Гипербола ─────────────────────────────────────────────────────────────────
const HYPERBOLE_PATTERNS = [
  'мың', 'миллион', 'мәңгі', 'ешқашан', 'барлық дүние', 'жер-жаhан',
  'жер бетіндегі', 'тіпті', 'тым', 'өте-мөте', 'шексіз', 'шетсіз',
  'ғарыш', 'теңізше', 'таудай', 'дариядай',
];

// ── Инверсия ──────────────────────────────────────────────────────────────────
// In Kazakh, verb-initial sentences are inversions (SOV is standard)
function detectInversion(sentences: string[]): string[] {
  const actionVerbs = ['келді', 'кетті', 'барды', 'тұрды', 'отырды', 'жасады', 'айтты', 'берді'];
  return sentences.filter((s) => {
    const words = tokenise(s);
    return words.length > 3 && actionVerbs.some((v) => words[0]?.includes(v));
  }).slice(0, 3);
}

// ── Символ ────────────────────────────────────────────────────────────────────
const SYMBOL_WORDS: Record<string, string> = {
  'бүркіт': 'еркіндік пен ерлік рәмізі',
  'тұлпар': 'күш пен жылдамдық',
  'дала': 'еркіндік пен Қазақстан',
  'жұлдыз': 'үміт пен армандар',
  'шырша': 'мәңгілік',
  'ай': 'сұлулық пен нәзіктік',
  'күн': 'жарық пен жылу',
  'бұлт': 'қайғы мен мұң',
  'жел': 'өзгеріс пен еркіндік',
  'от': 'жан мен махаббат',
  'су': 'тіршілік пен тазалық',
};

function detectSymbols(words: string[]): string[] {
  const found: string[] = [];
  for (const [sym, meaning] of Object.entries(SYMBOL_WORDS)) {
    if (words.some((w) => w.includes(sym))) found.push(`«${sym}» — ${meaning}`);
  }
  return found.slice(0, 4);
}

// ── Градация ──────────────────────────────────────────────────────────────────
const GRADATION_MARKERS = ['бірінші', 'екінші', 'үшінші', 'одан да', 'тіпті де', 'барған сайын', 'күшейе'];

// ── Антитеза ──────────────────────────────────────────────────────────────────
const ANTITHESIS_PAIRS = [
  ['жарық', 'қараңғы'], ['өмір', 'өлім'], ['жақсы', 'жаман'],
  ['достық', 'жаулық'], ['бай', 'кедей'], ['күш', 'әлсіздік'],
  ['жас', 'кәрі'], ['сүю', 'жек көру'], ['алыс', 'жақын'],
];

function detectAntithesis(sentences: string[]): string[] {
  const found: string[] = [];
  for (const s of sentences) {
    const words = tokenise(s);
    for (const [a, b] of ANTITHESIS_PAIRS) {
      if (words.some((w) => w.includes(a)) && words.some((w) => w.includes(b))) {
        found.push(s.slice(0, 80));
        break;
      }
    }
  }
  return found.slice(0, 3);
}

// ── Оксюморон ─────────────────────────────────────────────────────────────────
const OXYMORON_COMBOS = [
  ['суық', 'махаббат'], ['қара', 'нұр'], ['ащы', 'бақыт'],
  ['тірі', 'өлі'], ['үнсіз', 'айқай'], ['ауыр', 'жеңіл'],
];

function detectOxymoron(sentences: string[]): string[] {
  const found: string[] = [];
  for (const s of sentences) {
    const words = tokenise(s);
    for (const [a, b] of OXYMORON_COMBOS) {
      const aIdx = words.findIndex((w) => w.includes(a));
      const bIdx = words.findIndex((w) => w.includes(b));
      if (aIdx >= 0 && bIdx >= 0 && Math.abs(aIdx - bIdx) <= 3) {
        found.push(`«${words.slice(Math.min(aIdx, bIdx), Math.max(aIdx, bIdx) + 1).join(' ')}»`);
      }
    }
  }
  return found.slice(0, 3);
}

// ── Нақыл / афоризм ──────────────────────────────────────────────────────────
const APHORISM_MARKERS = ['деп айтқан', 'деп тапқан', 'дейді', 'деп білген', 'халық даналығы'];

// ── Main detector ─────────────────────────────────────────────────────────────

export function detectLiteraryDevices(text: string): LiteraryDeviceResult {
  const sentences = splitSentences(text);
  const lines = splitLines(text);
  const words = tokenise(text);
  const notes: string[] = [];

  const devices: LiteraryDevice[] = [];

  // 1. Теңеу (Simile)
  const simileEx = findByPattern(sentences, SIMILE_PATTERN);
  if (simileEx.length) {
    devices.push({
      name: 'Теңеу',
      nameRu: 'Сравнение (Simile)',
      description: 'Бір нәрсені екіншісімен салыстыру («сияқты», «секілді», «тәрізді» арқылы)',
      examples: simileEx.map((s) => s.slice(0, 80)),
      count: simileEx.length,
      confidence: 0.85,
    });
  }

  // 2. Метафора (Metaphor)
  const metaphorEx = findByPattern(sentences, METAPHOR_PATTERN);
  if (metaphorEx.length >= 2) {
    devices.push({
      name: 'Метафора',
      nameRu: 'Метафора (Metaphor)',
      description: 'Екі нәрсені тікелей теңестіру (сызықша арқылы)',
      examples: metaphorEx.map((s) => s.slice(0, 80)),
      count: metaphorEx.length,
      confidence: 0.7,
    });
  }

  // 3. Жандандыру (Personification)
  const personEx = sentences.filter((s) =>
    tokenise(s).some((w) => PERSONIFICATION_KEYWORDS.some((kw) => w.includes(kw))),
  );
  if (personEx.length) {
    devices.push({
      name: 'Жандандыру',
      nameRu: 'Олицетворение (Personification)',
      description: 'Табиғат немесе заттарды адам қасиетімен суреттеу',
      examples: personEx.slice(0, 3).map((s) => s.slice(0, 80)),
      count: personEx.length,
      confidence: 0.75,
    });
  }

  // 4. Анафора (Anaphora)
  const anaphoraEx = detectAnaphora(lines);
  if (anaphoraEx.length) {
    devices.push({
      name: 'Анафора',
      nameRu: 'Анафора (Anaphora)',
      description: 'Тармақтардың немесе сөйлемдердің бірдей сөзбен басталуы',
      examples: anaphoraEx,
      count: anaphoraEx.length,
      confidence: 0.9,
    });
  }

  // 5. Эпифора (Epiphora)
  const epiphoraEx = detectEpiphora(lines);
  if (epiphoraEx.length) {
    devices.push({
      name: 'Эпифора',
      nameRu: 'Эпифора (Epiphora)',
      description: 'Тармақтардың немесе сөйлемдердің бірдей сөзбен аяқталуы',
      examples: epiphoraEx,
      count: epiphoraEx.length,
      confidence: 0.85,
    });
  }

  // 6. Риторикалық сұрақ (Rhetorical question)
  const rhetoEx = sentences.filter((s) => RHETORICAL_PATTERN.test(s));
  if (rhetoEx.length) {
    devices.push({
      name: 'Риторикалық сұрақ',
      nameRu: 'Риторический вопрос',
      description: 'Жауап күтпейтін, эмоционалды күшейту мақсатында қолданылатын сұрақ',
      examples: rhetoEx.slice(0, 3).map((s) => s.slice(0, 80)),
      count: rhetoEx.length,
      confidence: 0.8,
    });
  }

  // 7. Эпитет (Epithet)
  const epithetEx = detectEpithets(sentences);
  if (epithetEx.length) {
    devices.push({
      name: 'Эпитет',
      nameRu: 'Эпитет (Epithet)',
      description: 'Зат есімді бейнелі сипаттайтын сын есім немесе сөз тіркесі',
      examples: epithetEx,
      count: epithetEx.length,
      confidence: 0.7,
    });
  }

  // 8. Аллитерация
  const allitEx = detectAlliterationDevice(lines);
  if (allitEx.length) {
    devices.push({
      name: 'Аллитерация',
      nameRu: 'Аллитерация (Alliteration)',
      description: 'Бір тармақта дауыссыз дыбыстардың қайталануы',
      examples: allitEx.map((l) => l.slice(0, 80)),
      count: allitEx.length,
      confidence: 0.85,
    });
  }

  // 9. Гипербола
  const hyperEx = sentences.filter((s) =>
    HYPERBOLE_PATTERNS.some((p) => s.toLowerCase().includes(p)),
  );
  if (hyperEx.length) {
    devices.push({
      name: 'Гипербола',
      nameRu: 'Гипербола (Hyperbole)',
      description: 'Бір нәрсені немесе сезімді мөлшерден тыс асыра суреттеу',
      examples: hyperEx.slice(0, 3).map((s) => s.slice(0, 80)),
      count: hyperEx.length,
      confidence: 0.75,
    });
  }

  // 10. Инверсия
  const invEx = detectInversion(sentences);
  if (invEx.length) {
    devices.push({
      name: 'Инверсия',
      nameRu: 'Инверсия (Inversion)',
      description: 'Сөйлемдегі сөздердің қалыпты тәртібінің өзгертілуі',
      examples: invEx.map((s) => s.slice(0, 80)),
      count: invEx.length,
      confidence: 0.65,
    });
  }

  // 11. Символ
  const symbolEx = detectSymbols(words);
  if (symbolEx.length) {
    devices.push({
      name: 'Символ',
      nameRu: 'Символ (Symbol)',
      description: 'Терең мағынаны бейнелейтін зат немесе образ',
      examples: symbolEx,
      count: symbolEx.length,
      confidence: 0.7,
    });
  }

  // 12. Антитеза
  const antEx = detectAntithesis(sentences);
  if (antEx.length) {
    devices.push({
      name: 'Антитеза',
      nameRu: 'Антитеза (Antithesis)',
      description: 'Қарама-қарсы ұғымдарды қатар қою',
      examples: antEx,
      count: antEx.length,
      confidence: 0.8,
    });
  }

  // 13. Оксюморон
  const oxyEx = detectOxymoron(sentences);
  if (oxyEx.length) {
    devices.push({
      name: 'Оксюморон',
      nameRu: 'Оксюморон (Oxymoron)',
      description: 'Бір-біріне қайшы ұғымдарды тіркестіру',
      examples: oxyEx,
      count: oxyEx.length,
      confidence: 0.75,
    });
  }

  // 14. Аллюзия / Нақыл
  const aphorismEx = sentences.filter((s) =>
    APHORISM_MARKERS.some((m) => s.toLowerCase().includes(m)),
  );
  if (aphorismEx.length) {
    devices.push({
      name: 'Нақыл / Афоризм',
      nameRu: 'Афоризм / Аллюзия',
      description: 'Халық даналығын немесе дайын сөз тіркестерін қолдану',
      examples: aphorismEx.slice(0, 3).map((s) => s.slice(0, 80)),
      count: aphorismEx.length,
      confidence: 0.8,
    });
  }

  // Sort by count + confidence
  devices.sort((a, b) => (b.count * b.confidence) - (a.count * a.confidence));

  // Richness
  const total = devices.length;
  let richness: LiteraryDeviceResult['richness'];
  if (total >= 8) richness = 'Өте бай';
  else if (total >= 5) richness = 'Бай';
  else if (total >= 2) richness = 'Орташа';
  else richness = 'Шектеулі';

  if (total === 0) notes.push('Мәтін қысқа немесе аналитикалық — бейнелі құралдар аз');

  return {
    devices,
    totalFound: total,
    richness,
    notes,
  };
}
