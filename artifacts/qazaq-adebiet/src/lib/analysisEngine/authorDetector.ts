/**
 * authorDetector.ts — Detect stylistic fingerprints of known Kazakh authors.
 *
 * Works fully offline using keyword and pattern matching.
 */

import { tokenise, allMatches, computeStats } from './helper';

export interface AuthorSignature {
  name: string;
  slug: string;
  era: string;
  confidence: number;
  evidence: string[];
}

export interface AuthorDetectionResult {
  topMatch: AuthorSignature | null;
  candidates: AuthorSignature[];
  styleTrait: string;
}

// ── Author profiles ───────────────────────────────────────────────────────────

const AUTHOR_PROFILES: Record<string, {
  name: string;
  slug: string;
  era: string;
  keywords: string[];
  themes: string[];
  grammarMarkers: string[];
}> = {
  abai: {
    name: 'Абай Қунанбайұлы',
    slug: 'abai',
    era: 'XIX ғасыр',
    keywords: [
      'жігіт', 'надан', 'ғылым', 'өнер', 'достық', 'адамдық',
      'ақыл', 'білім', 'ерлік', 'парасат', 'шындық', 'махаббат',
      'жалған', 'мақсат', 'еңбек', 'өлсе', 'өлмес',
    ],
    themes: ['ағартушылық', 'адамгершілік', 'философия', 'достық'],
    grammarMarkers: ['дүние', 'жан', 'ой', 'сезім', 'жүрек'],
  },
  magzhan: {
    name: 'Мағжан Жұмабаев',
    slug: 'magzhan',
    era: 'XX ғасыр (Алаш)',
    keywords: [
      'сұлу', 'алтын', 'жұлдыз', 'аспан', 'жел', 'боз', 'дала',
      'шулы', 'ән', 'сағыныш', 'жыр', 'ертегі', 'перізат',
      'символ', 'арман', 'мұң', 'нәзік', 'ғашық',
    ],
    themes: ['романтизм', 'символизм', 'сұлулық', 'табиғат'],
    grammarMarkers: ['ала', 'асыл', 'жарық', 'нұр', 'сәуле'],
  },
  auezov: {
    name: 'Мұхтар Әуезов',
    slug: 'auezov',
    era: 'XX ғасыр',
    keywords: [
      'абай', 'айгерім', 'тоғжан', 'ауыл', 'жайлау', 'қыстау',
      'дала', 'жылқы', 'би', 'шешен', 'той', 'ас',
      'ата', 'ана', 'ру', 'жер', 'ел',
    ],
    themes: ['эпос', 'тарих', 'халық', 'ұлт', 'сахара'],
    grammarMarkers: ['күміс', 'тұлпар', 'батыр', 'хан', 'сарай'],
  },
  baytursinov: {
    name: 'Ахмет Байтұрсынов',
    slug: 'baytursinov',
    era: 'XX ғасыр (Алаш)',
    keywords: [
      'тіл', 'ана тілі', 'мектеп', 'оқу', 'халық', 'ел',
      'еркіндік', 'ұлт', 'бостандық', 'зиялы', 'іс',
    ],
    themes: ['ұлт-азаттық', 'тіл', 'ағарту', 'саясат'],
    grammarMarkers: ['баспасөз', 'мерзімді', 'ұлттық', 'туысқан'],
  },
  dulatov: {
    name: 'Міржақып Дулатов',
    slug: 'dulatov',
    era: 'XX ғасыр (Алаш)',
    keywords: [
      'оян', 'қазақ', 'ояну', 'ұйқы', 'намыс', 'арман',
      'теңдік', 'азаттық', 'жер', 'халық', 'ел',
    ],
    themes: ['ояну', 'азаттық', 'намыс', 'ұлт'],
    grammarMarkers: ['оян', 'ұйықтама', 'тұр', 'жігер'],
  },
  seifullin: {
    name: 'Сәкен Сейфуллин',
    slug: 'seifullin',
    era: 'XX ғасыр (Кеңес)',
    keywords: [
      'революция', 'еңбек', 'жастар', 'болашақ', 'кеңес',
      'зауыт', 'трактор', 'астана', 'дала', 'жел',
    ],
    themes: ['революция', 'еңбек', 'жаңа өмір', 'оптимизм'],
    grammarMarkers: ['асу', 'шарық', 'жарылыс', 'толқын'],
  },
  mukanov: {
    name: 'Сәбит Мұқанов',
    slug: 'mukanov',
    era: 'XX ғасыр',
    keywords: [
      'балалық', 'жастық', 'өмір', 'жол', 'тіршілік',
      'адам', 'еңбекші', 'өсу', 'дамыту',
    ],
    themes: ['автобиография', 'қоғам', 'адам', 'еңбек'],
    grammarMarkers: ['естелік', 'шежіре', 'тарих', 'жыл'],
  },
  mukhtar_magauin: {
    name: 'Мұхтар Мағауин',
    slug: 'magauin',
    era: 'XX–XXI ғасыр',
    keywords: [
      'тарих', 'хан', 'батыр', 'дала', 'ру', 'шежіре',
      'мемлекет', 'мәдениет', 'тіл', 'ұрпақ',
    ],
    themes: ['тарих', 'философия', 'ұлт тарихы', 'мемлекет'],
    grammarMarkers: ['ханзада', 'сарбаз', 'жеңіс', 'ордалы'],
  },
  zhambyl: {
    name: 'Жамбыл Жабаев',
    slug: 'zhambyl',
    era: 'XIX–XX ғасыр',
    keywords: [
      'жырлаймын', 'аким', 'батыр', 'ерлік', 'халқым',
      'жер', 'ел', 'мақтаймын', 'домбыра',
    ],
    themes: ['жырлау', 'ерлік', 'халық', 'дәстүр'],
    grammarMarkers: ['жыр', 'толғау', 'нақыл', 'жас'],
  },
  nurpeisov: {
    name: 'Әбдіжәміл Нұрпейісов',
    slug: 'nurpeisov',
    era: 'XX ғасыр',
    keywords: [
      'балықшы', 'арал', 'су', 'теңіз', 'қайық', 'жағалау',
      'балық', 'толқын', 'тереңдік', 'кеме',
    ],
    themes: ['экология', 'Арал', 'трагедия', 'халық'],
    grammarMarkers: ['дауыл', 'боран', 'мұз', 'ауыр'],
  },
};

// ── Detection ─────────────────────────────────────────────────────────────────

export function detectAuthor(text: string): AuthorDetectionResult {
  const words = tokenise(text);
  const stats = computeStats(text);

  const kwDict: Record<string, string[]> = {};
  for (const [key, profile] of Object.entries(AUTHOR_PROFILES)) {
    kwDict[key] = [...profile.keywords, ...profile.themes, ...profile.grammarMarkers];
  }

  const matches = allMatches(words, kwDict, 0.02);

  const candidates: AuthorSignature[] = matches.map(({ label, score }) => {
    const profile = AUTHOR_PROFILES[label];
    const evidence: string[] = [];

    // Collect evidence words
    const hitWords = words.filter((w) =>
      profile.keywords.some((kw) => w.includes(kw) || kw.includes(w)),
    );
    if (hitWords.length > 0) {
      evidence.push(`Лексика: «${hitWords.slice(0, 4).join('», «')}»`);
    }
    const hitThemes = profile.themes.filter((th) =>
      words.some((w) => w.includes(th) || th.includes(w)),
    );
    if (hitThemes.length > 0) {
      evidence.push(`Тақырып: ${hitThemes.join(', ')}`);
    }

    // Style bonus
    if (stats.avgSentenceLength > 20 && label === 'auezov') evidence.push('Ұзын сөйлем стилі');
    if (stats.uniqueWordRatio > 0.7 && label === 'magzhan') evidence.push('Бай лексика');

    return {
      name: profile.name,
      slug: profile.slug,
      era: profile.era,
      confidence: score,
      evidence,
    };
  });

  // Determine style trait from top match
  let styleTrait = 'Анықталмаған стиль';
  if (candidates.length > 0) {
    const top = candidates[0];
    const profile = Object.values(AUTHOR_PROFILES).find((p) => p.name === top.name);
    if (profile) {
      styleTrait = profile.themes.slice(0, 2).join(', ') + ' тақырыптары басым';
    }
  }

  return {
    topMatch: candidates[0] ?? null,
    candidates: candidates.slice(0, 5),
    styleTrait,
  };
}
