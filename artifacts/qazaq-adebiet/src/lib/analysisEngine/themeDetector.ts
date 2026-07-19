/**
 * themeDetector.ts — Detect literary themes in Kazakh text.
 *
 * Works fully offline.
 */

import { tokenise, allMatches, clamp01 } from './helper';

export interface Theme {
  label: string;
  labelKk: string;
  score: number;
  keywords: string[];
}

export interface ThemeDetectionResult {
  primary: Theme;
  secondary: Theme[];
  all: Theme[];
}

// ── Theme dictionaries ────────────────────────────────────────────────────────

const THEME_DICT: Record<string, { labelKk: string; keywords: string[] }> = {
  love: {
    labelKk: 'Махаббат',
    keywords: [
      'махаббат', 'ғашық', 'сүю', 'сүйемін', 'жар', 'жарым', 'сүйікті',
      'жүрек', 'жан', 'аңсау', 'сағыну', 'сағыныш', 'алыс', 'жақын',
      'байланыс', 'өлмес', 'ғашықтық', 'бірге', 'қол', 'қосылу',
    ],
  },
  homeland: {
    labelKk: 'Отан / туған жер',
    keywords: [
      'отан', 'туған жер', 'туған', 'ел', 'жер', 'халық', 'қазақстан',
      'дала', 'жайлау', 'тау', 'өзен', 'сарыарқа', 'жетісу',
      'сүйемін', 'бабалар', 'ата мекен', 'ана жер', 'қасиетті',
    ],
  },
  nature: {
    labelKk: 'Табиғат',
    keywords: [
      'дала', 'тау', 'өзен', 'жайлау', 'көл', 'теңіз', 'жел', 'жаңбыр',
      'қар', 'боран', 'күн', 'ай', 'жұлдыз', 'аспан', 'бұлт', 'гүл',
      'шөп', 'орман', 'ағаш', 'жапырақ', 'бұлақ', 'тас', 'жер',
    ],
  },
  freedom: {
    labelKk: 'Еркіндік / азаттық',
    keywords: [
      'еркіндік', 'азаттық', 'бостандық', 'еркін', 'тәуелсіз', 'тәуелсіздік',
      'ояну', 'тұр', 'намыс', 'күрес', 'жеңіс', 'қарсылық',
      'арман', 'мақсат', 'ел', 'халық', 'жеңу',
    ],
  },
  philosophy: {
    labelKk: 'Философия / өмір мәні',
    keywords: [
      'өмір', 'өлім', 'мән', 'мағына', 'ақиқат', 'шындық', 'жалған',
      'уақыт', 'заман', 'жас', 'кәрілік', 'жол', 'мақсат', 'бақыт',
      'адам', 'рух', 'болмыс', 'сана', 'ақыл', 'ой', 'дана',
    ],
  },
  heroism: {
    labelKk: 'Батырлық / ерлік',
    keywords: [
      'батыр', 'ерлік', 'ер', 'жауынгер', 'соғыс', 'жеңіс', 'жеңу',
      'күш', 'қуат', 'қорқынышсыз', 'намыс', 'ар', 'ұят', 'абырой',
      'қылыш', 'садақ', 'найза', 'жорық', 'жау', 'дұшпан',
    ],
  },
  death: {
    labelKk: 'Өлім / жоқтау',
    keywords: [
      'өлім', 'өлді', 'өлсе', 'қайтыс', 'дүние салды', 'жоқтау',
      'естелік', 'жас', 'жылады', 'ауру', 'науқас', 'қайғы',
      'зар', 'мұң', 'шер', 'жетім', 'жесір',
    ],
  },
  enlightenment: {
    labelKk: 'Ағарту / білім',
    keywords: [
      'білім', 'ғылым', 'оқу', 'мектеп', 'ұстаз', 'шәкірт',
      'кітап', 'жазу', 'оқу', 'дамыту', 'өнер', 'тіл',
      'надандық', 'надан', 'ақымақ', 'парасат', 'ақыл',
    ],
  },
  family: {
    labelKk: 'Отбасы / туысқандық',
    keywords: [
      'ана', 'әке', 'апа', 'аға', 'іні', 'қарындас', 'бала',
      'ұл', 'қыз', 'отбасы', 'үй', 'шаңырақ', 'ата', 'әже',
      'туысқан', 'сүйіспеншілік', 'ашу', 'шаттық',
    ],
  },
  social: {
    labelKk: 'Қоғамдық / саяси',
    keywords: [
      'халық', 'ел', 'қоғам', 'мемлекет', 'үкімет', 'байлық',
      'кедейлік', 'теңдік', 'әділет', 'әділдік', 'заң',
      'саясат', 'реформа', 'дамыту', 'өзгеріс',
    ],
  },
  sorrow: {
    labelKk: 'Мұң / сағыныш',
    keywords: [
      'мұң', 'шер', 'зар', 'жылаймын', 'жылады', 'жылаудамын',
      'сағыну', 'сағыныш', 'аңсау', 'алыс', 'жалғыздық',
      'жалғыз', 'жетім', 'тастап', 'кетті', 'айрылу',
    ],
  },
  spirituality: {
    labelKk: 'Рухани / діни',
    keywords: [
      'алла', 'аллаh', 'тәңір', 'дін', 'ислам', 'намаз', 'рух',
      'жан', 'тазарту', 'мейірім', 'рахым', 'ізгілік', 'ақиқат',
      'ахирет', 'дүние', 'тозақ', 'жәннат',
    ],
  },
  history: {
    labelKk: 'Тарих / мұра',
    keywords: [
      'тарих', 'бабалар', 'ата', 'ата-баба', 'ескі', 'ежелгі',
      'хан', 'ханзада', 'дәуір', 'заман', 'өткен', 'мұра',
      'ескерткіш', 'жерлеу', 'сарай', 'хандық',
    ],
  },
};

// ── Detection ─────────────────────────────────────────────────────────────────

function buildHitKeywords(words: string[], keywords: string[]): string[] {
  return [...new Set(
    words.filter((w) => keywords.some((kw) => w.includes(kw) || kw.includes(w))),
  )].slice(0, 5);
}

export function detectThemes(text: string): ThemeDetectionResult {
  const words = tokenise(text);

  const kwDict: Record<string, string[]> = {};
  for (const [key, val] of Object.entries(THEME_DICT)) {
    kwDict[key] = val.keywords;
  }

  const matches = allMatches(words, kwDict, 0.03);

  const all: Theme[] = matches.map(({ label, score }) => ({
    label,
    labelKk: THEME_DICT[label]?.labelKk ?? label,
    score: clamp01(score),
    keywords: buildHitKeywords(words, THEME_DICT[label]?.keywords ?? []),
  }));

  const primary: Theme = all[0] ?? {
    label: 'unknown',
    labelKk: 'Анықталмаған',
    score: 0,
    keywords: [],
  };

  const secondary = all.slice(1, 4);

  return { primary, secondary, all };
}
