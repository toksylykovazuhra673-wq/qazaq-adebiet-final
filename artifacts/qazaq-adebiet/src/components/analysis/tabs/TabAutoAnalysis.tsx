/**
 * TabAutoAnalysis.tsx — Гибридті автоматты талдаушы
 *
 * Режимдер:
 *   1. FULL  — workAnalyses.json-да бар → 12 бөлімді толық талдау
 *   2. ENGINE — базада жоқ → LocalAnalysisEngine 18 тәсілді анықтайды
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, BookOpen, Lightbulb, Layers, Users, User,
  Palette, Music2, GraduationCap, CheckCircle2, ChevronDown,
  ChevronUp, Copy, Check, RotateCcw, Shapes, Zap, FileText,
  Eye, AlertCircle, Brain,
} from 'lucide-react';
import type { Analysis } from '@/types/analysis';
import { analysisExamples, getCompatAuthors } from '@/lib/dataLoader';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  analysis: Analysis | null;
  workSlug: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 18 Literary Device catalog
// ─────────────────────────────────────────────────────────────────────────────
export interface DeviceExample {
  text: string;        // үзінді
  explanation: string; // Түсіндірмесі
}

export interface DeviceResult {
  id: string;
  name: string;       // Қазақша атауы
  nameRu: string;     // Орысша
  definition: string; // Анықтамасы
  examples: DeviceExample[];
  color: {
    bg: string; border: string; text: string;
    badge: string; dot: string; highlight: string;
  };
  found: boolean;
}

const DEVICE_META: Record<string, { name: string; nameRu: string; definition: string; color: DeviceResult['color'] }> = {
  epithet: {
    name: 'Эпитет', nameRu: 'Эпитет',
    definition: 'Зат немесе құбылыстың белгісін образды суреттейтін анықтауыш.',
    color: { bg: 'bg-violet-500/12', border: 'border-violet-500/25', text: 'text-violet-300', badge: 'bg-violet-500/20 text-violet-300', dot: 'bg-violet-400', highlight: 'bg-violet-400/20 text-violet-200' },
  },
  simile: {
    name: 'Теңеу', nameRu: 'Сравнение',
    definition: 'Екі нәрсені немесе құбылысты «секілді», «тәрізді», «сынды», «бейне» шылаулары арқылы салыстыру.',
    color: { bg: 'bg-amber-500/12', border: 'border-amber-500/25', text: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300', dot: 'bg-amber-400', highlight: 'bg-amber-400/20 text-amber-200' },
  },
  metaphor: {
    name: 'Метафора', nameRu: 'Метафора',
    definition: 'Ұқсастыққа негізделген жасырын теңеу — шылаусыз, бір нәрсені екінші нәрсе арқылы бейнелеу.',
    color: { bg: 'bg-orange-500/12', border: 'border-orange-500/25', text: 'text-orange-300', badge: 'bg-orange-500/20 text-orange-300', dot: 'bg-orange-400', highlight: 'bg-orange-400/20 text-orange-200' },
  },
  personification: {
    name: 'Кейіптеу', nameRu: 'Олицетворение',
    definition: 'Жансыз нәрселерге, табиғат құбылыстарына адамға тән қасиеттерді беру.',
    color: { bg: 'bg-emerald-500/12', border: 'border-emerald-500/25', text: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300', dot: 'bg-emerald-400', highlight: 'bg-emerald-400/20 text-emerald-200' },
  },
  symbol: {
    name: 'Символ', nameRu: 'Символ',
    definition: 'Нақты затты, образды немесе құбылысты кең ауқымды мән-мағынаны жеткізу үшін қолдану.',
    color: { bg: 'bg-teal-500/12', border: 'border-teal-500/25', text: 'text-teal-300', badge: 'bg-teal-500/20 text-teal-300', dot: 'bg-teal-400', highlight: 'bg-teal-400/20 text-teal-200' },
  },
  metonymy: {
    name: 'Метонимия', nameRu: 'Метонимия',
    definition: 'Бір нәрсенің атауын онымен іргелес, жанама байланысты нәрсенің атымен алмастыру.',
    color: { bg: 'bg-cyan-500/12', border: 'border-cyan-500/25', text: 'text-cyan-300', badge: 'bg-cyan-500/20 text-cyan-300', dot: 'bg-cyan-400', highlight: 'bg-cyan-400/20 text-cyan-200' },
  },
  synecdoche: {
    name: 'Синекдоха', nameRu: 'Синекдоха',
    definition: 'Бүтіннің орнына бөлікті (немесе бөліктің орнына бүтінді) атап, бүкіл нәрсені білдіру.',
    color: { bg: 'bg-sky-500/12', border: 'border-sky-500/25', text: 'text-sky-300', badge: 'bg-sky-500/20 text-sky-300', dot: 'bg-sky-400', highlight: 'bg-sky-400/20 text-sky-200' },
  },
  periphrasis: {
    name: 'Перифраз', nameRu: 'Перифраз',
    definition: 'Нақты атауды оның сипаттамасымен немесе ауыспалы мағыналы тіркеспен алмастыру.',
    color: { bg: 'bg-blue-500/12', border: 'border-blue-500/25', text: 'text-blue-300', badge: 'bg-blue-500/20 text-blue-300', dot: 'bg-blue-400', highlight: 'bg-blue-400/20 text-blue-200' },
  },
  alliteration: {
    name: 'Аллитерация', nameRu: 'Аллитерация',
    definition: 'Жолдарда немесе сөз тіркестерінде бір немесе ұқсас дауыссыз дыбыстардың қайталануы.',
    color: { bg: 'bg-indigo-500/12', border: 'border-indigo-500/25', text: 'text-indigo-300', badge: 'bg-indigo-500/20 text-indigo-300', dot: 'bg-indigo-400', highlight: 'bg-indigo-400/20 text-indigo-200' },
  },
  assonance: {
    name: 'Ассонанс', nameRu: 'Ассонанс',
    definition: 'Жолдарда дауысты дыбыстардың ырғақты қайталануы — үн үйлесімділігін тудырады.',
    color: { bg: 'bg-purple-500/12', border: 'border-purple-500/25', text: 'text-purple-300', badge: 'bg-purple-500/20 text-purple-300', dot: 'bg-purple-400', highlight: 'bg-purple-400/20 text-purple-200' },
  },
  anaphora: {
    name: 'Анафора', nameRu: 'Анафора',
    definition: 'Бірнеше жолдың немесе сөйлемнің бір сөзбен немесе тіркеспен басталуы.',
    color: { bg: 'bg-fuchsia-500/12', border: 'border-fuchsia-500/25', text: 'text-fuchsia-300', badge: 'bg-fuchsia-500/20 text-fuchsia-300', dot: 'bg-fuchsia-400', highlight: 'bg-fuchsia-400/20 text-fuchsia-200' },
  },
  epiphora: {
    name: 'Эпифора', nameRu: 'Эпифора',
    definition: 'Бірнеше жолдың немесе сөйлемнің бір сөзбен немесе тіркеспен аяқталуы.',
    color: { bg: 'bg-pink-500/12', border: 'border-pink-500/25', text: 'text-pink-300', badge: 'bg-pink-500/20 text-pink-300', dot: 'bg-pink-400', highlight: 'bg-pink-400/20 text-pink-200' },
  },
  inversion: {
    name: 'Инверсия', nameRu: 'Инверсия',
    definition: 'Сөздердің әдеттегі грамматикалық тәртібін өзгерту — баяндауыш алдында немесе анықтауыш кейін.',
    color: { bg: 'bg-rose-500/12', border: 'border-rose-500/25', text: 'text-rose-300', badge: 'bg-rose-500/20 text-rose-300', dot: 'bg-rose-400', highlight: 'bg-rose-400/20 text-rose-200' },
  },
  rhetoricalQuestion: {
    name: 'Риторикалық сұрақ', nameRu: 'Риторический вопрос',
    definition: 'Жауап күтілмейтін, оқырманды немесе тыңдаушыны ойға батыратын сұрақ.',
    color: { bg: 'bg-red-500/12', border: 'border-red-500/25', text: 'text-red-300', badge: 'bg-red-500/20 text-red-300', dot: 'bg-red-400', highlight: 'bg-red-400/20 text-red-200' },
  },
  parallelism: {
    name: 'Параллелизм', nameRu: 'Параллелизм',
    definition: 'Бірнеше жолдың немесе сөйлемнің бірдей синтаксистік құрылымда берілуі.',
    color: { bg: 'bg-lime-500/12', border: 'border-lime-500/25', text: 'text-lime-300', badge: 'bg-lime-500/20 text-lime-300', dot: 'bg-lime-400', highlight: 'bg-lime-400/20 text-lime-200' },
  },
  antithesis: {
    name: 'Антитеза', nameRu: 'Антитеза',
    definition: 'Қарама-қарсы мағыналы ұғымдарды, образдарды немесе ойларды қатар қою арқылы контраст жасау.',
    color: { bg: 'bg-green-500/12', border: 'border-green-500/25', text: 'text-green-300', badge: 'bg-green-500/20 text-green-300', dot: 'bg-green-400', highlight: 'bg-green-400/20 text-green-200' },
  },
  hyperbole: {
    name: 'Гипербола', nameRu: 'Гипербола',
    definition: 'Нәрсенің немесе құбылыстың белгісін, мөлшерін күрт асырып көрсету.',
    color: { bg: 'bg-yellow-500/12', border: 'border-yellow-500/25', text: 'text-yellow-300', badge: 'bg-yellow-500/20 text-yellow-300', dot: 'bg-yellow-400', highlight: 'bg-yellow-400/20 text-yellow-200' },
  },
  litotes: {
    name: 'Литота', nameRu: 'Литота',
    definition: 'Нәрсенің белгісін немесе мөлшерін керісінше кішірейтіп, жоққа шығару арқылы суреттеу.',
    color: { bg: 'bg-slate-400/12', border: 'border-slate-400/25', text: 'text-slate-300', badge: 'bg-slate-400/20 text-slate-300', dot: 'bg-slate-400', highlight: 'bg-slate-400/20 text-slate-200' },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Detection helpers
// ─────────────────────────────────────────────────────────────────────────────
const VOWELS = new Set('аәеёиіоөуүыəАӘЕЁИІОӨУҮЫ');

function syllables(word: string) {
  return [...word].filter(c => VOWELS.has(c)).length || 1;
}

function lineEnding(line: string) {
  const w = line.trim().split(/\s+/);
  const last = w[w.length - 1] ?? '';
  return last.replace(/[«».,!?;:—–\-]/g, '').slice(-3).toLowerCase();
}

function detectRhyme(lines: string[]): { scheme: string; label: string; letters: string[] } {
  if (lines.length < 2) return { scheme: '—', label: 'Белгісіз', letters: [] };
  const e = lines.map(lineEnding);
  const ABC = 'АБВГДЕЖЗИЙК';
  const map: Record<string, string> = {};
  let idx = 0;
  const letters = e.map(end => {
    if (!end) return '—';
    if (map[end]) return map[end];
    map[end] = ABC[idx++] ?? '?';
    return map[end];
  });
  const trimScheme = letters.slice(0, Math.min(8, letters.length)).join('');
  if (e.every(x => x && x === e[0])) return { scheme: trimScheme, label: 'Тізбектелген ұйқас (АААА)', letters };
  if (e.length >= 4 && e[0] && e[0] === e[2] && e[1] && e[1] === e[3]) return { scheme: trimScheme, label: 'Айқасқан ұйқас (АБАБ)', letters };
  const aabb = e.length >= 4 && e.every((x, i) => (i % 2 === 0 ? x === e[i + 1] : true));
  if (aabb) return { scheme: trimScheme, label: 'Жұптасқан ұйқас (ААББ)', letters };
  if (e.length >= 4 && e[0] && e[0] === e[3] && e[1] && e[1] === e[2]) return { scheme: trimScheme, label: 'Оралмалы ұйқас (АББА)', letters };
  if (e.length >= 4 && e[0] === e[1] && e[0] === e[2]) return { scheme: trimScheme, label: 'Үштелген ұйқас (АААБ)', letters };
  return { scheme: trimScheme, label: 'Аралас ұйқас', letters };
}

function detectStanzaType(lines: string[], stanzaCount: number): string {
  const per = Math.round(lines.length / stanzaCount);
  const m: Record<number, string> = { 2: 'Куплет (2 жол)', 3: 'Терцет (3 жол)', 4: 'Катрен (4 жол)', 5: 'Квинтет (5 жол)', 6: 'Секстина (6 жол)', 8: 'Октава (8 жол)' };
  return m[per] ?? `${per} жолдық шумақ`;
}

function detectGenre(text: string): string {
  const t = text.toLowerCase();
  const rules: [string[], string][] = [
    [['жаз', 'қыс', 'күз', 'аспан', 'дала', 'гүл', 'бұлт', 'жел', 'таң', 'кеш', 'шалғын'], 'Табиғат лирикасы'],
    [['сүю', 'жүрек', 'махаббат', 'сағын', 'ғашық', 'сүйікті', 'ыстық'], 'Сүйіспеншілік лирикасы'],
    [['ел', 'отан', 'халық', 'жер', 'туған', 'ата-мекен', 'байтақ', 'боз дала'], 'Патриоттық лирика'],
    [['өмір', 'адам', 'ақыл', 'тіршілік', 'мән', 'мақсат', 'ой', 'ғарыш', 'мәңгі', 'парасат'], 'Философиялық лирика'],
    [['жас', 'балалық', 'жастық', 'шабыт', 'армандар'], 'Жастық лирика'],
    [['батыр', 'ер', 'жауынгер', 'соғыс', 'найза', 'алмас', 'тулатып'], 'Жырлық поэзия (эпос)'],
    [['қайғы', 'мұң', 'жылау', 'зарлау', 'жоқтау', 'үзілген'], 'Мұңды лирика (элегия)'],
    [['оян', 'жас', 'ояна', 'халқым', 'азамат', 'ерін'], 'Азаматтық лирика'],
  ];
  let best: [number, string] = [0, 'Лирика'];
  for (const [kws, genre] of rules) {
    const hits = kws.filter(k => t.includes(k)).length;
    if (hits > best[0]) best = [hits, genre];
  }
  return best[1];
}

function detectThemes(text: string): string[] {
  const t = text.toLowerCase();
  const map: [string[], string][] = [
    [['жастық', 'балалық', 'жас шақ'], 'Жастық шақ'],
    [['ел', 'халық', 'отан', 'туған жер'], 'Отансүйгіштік'],
    [['өмір', 'тіршілік', 'мән'], 'Өмір мәні'],
    [['табиғат', 'дала', 'жаз', 'қыс', 'аспан', 'жел', 'гүл', 'таң'], 'Табиғат сұлулығы'],
    [['сүю', 'махаббат', 'ғашық', 'жүрек'], 'Сүйіспеншілік'],
    [['ой', 'ақыл', 'парасат', 'ғылым', 'білім'], 'Философиялық толғаныс'],
    [['қайғы', 'мұң', 'айрылу', 'зарлау'], 'Мұң мен қайғы'],
    [['еңбек', 'іс', 'шыдам', 'табандылық'], 'Еңбек және табандылық'],
    [['дос', 'ынтымақ', 'бірлік', 'достық'], 'Достық және бірлік'],
    [['ата', 'тарих', 'ертегі', 'жыр', 'дәстүр'], 'Ұлттық дәстүр'],
    [['уақыт', 'өту', 'жыл', 'заман', 'өткен'], 'Уақыттың өтпелілігі'],
  ];
  const found = map.filter(([kws]) => kws.some(k => t.includes(k))).map(([, l]) => l);
  return found.length ? found.slice(0, 4) : ['Жалпы лирикалық тақырып'];
}

function detectIdea(text: string, genre: string, themes: string[], tone: string): string {
  const t = text.toLowerCase();
  if (genre.includes('Табиғат') && tone.includes('Мұңды')) return 'Табиғат суреттері арқылы адам жанының мұңы мен ішкі толғанысы жеткізілген.';
  if (genre.includes('Табиғат')) return 'Табиғат образдары арқылы адам мен дүниенің рухани үйлесімі бейнеленген.';
  if (genre.includes('Сүйіспеншілік') && tone.includes('Мұңды')) return 'Жоғалған немесе қолжетпес махаббатқа деген аңсар мен жан азабы жырланған.';
  if (genre.includes('Сүйіспеншілік')) return 'Сүйіспеншілік сезімінің тереңдігі мен ол тудыратын асқақ рухани күй жырланған.';
  if (genre.includes('Патриоттық')) return 'Туған жер, ел-жұртқа деген шексіз сүйіспеншілік пен оның алдындағы перзенттік парыз сезімі жырланған.';
  if (genre.includes('Философиялық')) return 'Өмір мәні, тіршіліктің мағынасы және адамның ғаламдағы орны жайлы терең толғаныс берілген.';
  if (genre.includes('Азаматтық')) return 'Халықты ояту, азаматтық борыш пен ар-намыс жырланған.';
  if (genre.includes('эпос') || genre.includes('Жырлық')) return 'Батырлық ерлік пен халықтың тарихи рухы мадақталып, болашаққа сенім берілген.';
  if (t.includes('ғылым') || t.includes('білім')) return 'Ғылым мен білімнің адам өміріндегі маңызы ұғындырылған.';
  return `${themes.slice(0, 2).join(' және ')} тақырыбындағы ой-сезімдер лирикалық образдар арқылы ашылған.`;
}

function detectTone(text: string): { tone: string; mood: string } {
  const t = text.toLowerCase();
  const excl = (text.match(/!/g) || []).length;
  const quest = (text.match(/\?/g) || []).length;
  const sad = ['қайғы', 'мұң', 'жылау', 'зар', 'айрыл', 'арман'].filter(w => t.includes(w)).length;
  const joy  = ['шат', 'қуан', 'рахат', 'мерей', 'бақ', 'ләззат'].filter(w => t.includes(w)).length;
  if (excl > 2 && quest === 0) return { tone: 'Жігерлі, шабытты', mood: '🔥 Жігерлі' };
  if (quest > 2)               return { tone: 'Ізденімді, толғанысты', mood: '💭 Ізденімді' };
  if (sad > joy && sad >= 2)   return { tone: 'Мұңды, элегиялық', mood: '😔 Мұңды' };
  if (joy > sad && joy >= 2)   return { tone: 'Шаттанған, мерейлі', mood: '😊 Шаттанған' };
  return { tone: 'Ойлы, медитативті', mood: '🤔 Толғанысты' };
}

function detectProsody(avgSyl: number): string {
  if (avgSyl >= 14) return '14 буынды өлшем';
  if (avgSyl === 11) return '11 буынды өлшем (жыр)';
  if (avgSyl === 10) return '10 буынды өлшем';
  if (avgSyl >= 7 && avgSyl <= 9) return '7–9 буынды өлшем (халық поэзиясы)';
  if (avgSyl >= 5 && avgSyl <= 6) return '5–6 буынды өлшем (кіші форма)';
  return 'Еркін буынды өлшем';
}

function topWords(text: string): { word: string; count: number }[] {
  const stop = new Set(['да', 'де', 'та', 'те', 'мен', 'бен', 'пен', 'бұл', 'сол', 'ол',
    'сен', 'біз', 'сіз', 'бар', 'жоқ', 'үшін', 'туралы', 'және', 'ал', 'не',
    'ма', 'ме', 'ба', 'бе', 'ген', 'тін', 'ды', 'ді', 'ты', 'ті', 'лар', 'лер', 'дар', 'дер']);
  const freq: Record<string, number> = {};
  text.toLowerCase().split(/\s+/).forEach(w => {
    const c = w.replace(/[.,!?«»;:—–()\d]/g, '').trim();
    if (c.length >= 3 && !stop.has(c)) freq[c] = (freq[c] || 0) + 1;
  });
  return Object.entries(freq).map(([word, count]) => ({ word, count }))
    .filter(w => w.count >= 2).sort((a, b) => b.count - a.count).slice(0, 12);
}

// ─────────────────────────────────────────────────────────────────────────────
// ── 18 Literary Device Detectors ─────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function detectAllDevices(text: string, lines: string[]): DeviceResult[] {
  const t = text.toLowerCase();
  const results: DeviceResult[] = [];

  const make = (id: string, examples: DeviceExample[]): DeviceResult => ({
    id,
    ...DEVICE_META[id],
    examples,
    found: examples.length > 0,
  });

  // ── 1. Эпитет ───────────────────────────────────────────────
  {
    const pairs: [RegExp, string][] = [
      [/(ақ|қара|алтын|күміс|жасыл|биік|терең|кең|сұлу|асқақ|мөлдір|ыстық|жарқын|нұрлы|ащы|тәтті|жылы|суық|аппақ|нәзік|бозғылт|өткір)\s+\S+/gi, ''],
      [/\S+\s+(жүрек|дала|жер|аспан|жол|тұлпар|ат|жел|су|дария|тау|жыр|сөз|ой)/gi, ''],
    ];
    const found: DeviceExample[] = [];
    for (const [rx] of pairs) {
      const ms = [...text.matchAll(rx)].slice(0, 3);
      ms.forEach(m => {
        const fragment = m[0];
        const lineCtx = lines.find(l => l.toLowerCase().includes(fragment.toLowerCase())) ?? '';
        found.push({ text: lineCtx || fragment, explanation: `«${fragment}» — образды суреттеуіш анықтауыш, нәрсенің белгісін ерекше ашады.` });
      });
      if (found.length) break;
    }
    results.push(make('epithet', found));
  }

  // ── 2. Теңеу ────────────────────────────────────────────────
  {
    const rx = /[^.!?]*(?:секілді|тәрізді|сынды|бейне|ұқсайды|сияқты|шоқтай|отты)[^.!?\n]*/gi;
    const ms = [...text.matchAll(rx)].slice(0, 3);
    const found = ms.map(m => {
      const fragment = m[0].trim();
      return { text: fragment, explanation: `«${fragment.slice(0, 60)}…» — теңеу шылауы арқылы салыстырылып, образ күшейтілген.` };
    });
    results.push(make('simile', found));
  }

  // ── 3. Метафора ─────────────────────────────────────────────
  {
    const patterns = [
      /(жүрек|өмір|жан|арман|ой|халық|жер|аспан|жел|ел)\s+(от|оты|өрті|жалыны|мұзы|тасы|дариясы|жолы|жыры|өлеңі|демі|тынысы|қанаты|жарығы)\b/gi,
      /(алтын|күміс|темір)\s+(жол|сөз|дауыс|уақыт|қол)/gi,
    ];
    const found: DeviceExample[] = [];
    for (const rx of patterns) {
      const ms = [...text.matchAll(rx)].slice(0, 2);
      ms.forEach(m => {
        const fragment = m[0];
        const lineCtx = lines.find(l => l.toLowerCase().includes(fragment.toLowerCase())) ?? fragment;
        found.push({ text: lineCtx.trim(), explanation: `«${fragment}» — жасырын теңеу: ${m[1]} ${m[2]} арқылы бейнеленген.` });
      });
    }
    results.push(make('metaphor', found));
  }

  // ── 4. Кейіптеу ─────────────────────────────────────────────
  {
    const rx = /(жел|дала|аспан|жер|тау|су|бұлт|күн|ай|гүл|орман|теңіз|өзен)\s+(?:тыңдады|күлді|жылады|айтты|деді|тербетті|ойлады|іздеді|сүйді|білді|сезді|мұңайды|қуанды|зарлады|сөйледі|жорытты|ұшты|жортты)/gi;
    const ms = [...text.matchAll(rx)].slice(0, 3);
    const found = ms.map(m => {
      const lineCtx = lines.find(l => l.toLowerCase().includes(m[0].toLowerCase())) ?? m[0];
      return { text: lineCtx.trim(), explanation: `«${m[1]}» — жансыз табиғат элементіне адамдық қасиет берілген.` };
    });
    results.push(make('personification', found));
  }

  // ── 5. Символ ───────────────────────────────────────────────
  {
    const symbols: [string, string][] = [
      ['тұлпар', 'Тұлпар — еркіндік, жігер, ұлттық рух символы'],
      ['бүркіт', 'Бүркіт — батылдық, азаттық символы'],
      ['гүл', 'Гүл — сұлулық, жастық, өмір символы'],
      ['ай', 'Ай — сұлулық, мұң, аңсар символы'],
      ['қыран', 'Қыран — ерлік, асқақтық символы'],
      ['жұлдыз', 'Жұлдыз — үміт, бағдар, армандар символы'],
      ['дала', 'Дала — еркіндік, ұлттық кеңістік символы'],
      ['жел', 'Жел — өзгеріс, уақыт, тағдыр символы'],
      ['отан', 'Отан — туған жер, сүйіспеншілік символы'],
      ['найзагай', 'Найзагай — революция, өзгеріс символы'],
    ];
    const found: DeviceExample[] = [];
    for (const [word, explanation] of symbols) {
      if (t.includes(word)) {
        const lineCtx = lines.find(l => l.toLowerCase().includes(word)) ?? word;
        found.push({ text: lineCtx.trim(), explanation });
        if (found.length >= 3) break;
      }
    }
    results.push(make('symbol', found));
  }

  // ── 6. Метонимия ────────────────────────────────────────────
  {
    const metonymyPairs: [RegExp, string][] = [
      [/(қылыш|найза|семсер)\s+(?:оянды|ойнады|тойды|тоқыды|жеңді)/gi, 'Қару атауы — соғыс немесе ерлік іс-әрекетін білдіреді'],
      [/(ақ\s+орда|орда|юрта|шатыр)\s+(?:тыңдады|байлады|бас\s+иді)/gi, 'Баспана атауы — халықты немесе ұжымды білдіреді'],
      [/(алтын|жоғарғы\s+орын|тақ)\s+(?:иесі|билеушісі)/gi, 'Зат атауы — биліктің өзін білдіреді'],
    ];
    const found: DeviceExample[] = [];
    for (const [rx, explanation] of metonymyPairs) {
      const ms = [...text.matchAll(rx)];
      if (ms.length) {
        const lineCtx = lines.find(l => l.toLowerCase().includes(ms[0][0].toLowerCase())) ?? ms[0][0];
        found.push({ text: lineCtx.trim(), explanation });
      }
    }
    results.push(make('metonymy', found));
  }

  // ── 7. Синекдоха ────────────────────────────────────────────
  {
    const rx = /(?:қол|бас|тіл|жүрек|мойын|ауыз|түтін)\b/gi;
    const ms = [...text.matchAll(rx)].slice(0, 3);
    const found = ms.map(m => {
      const lineCtx = lines.find(l => l.toLowerCase().includes(m[0].toLowerCase())) ?? m[0];
      return {
        text: lineCtx.trim(),
        explanation: `«${m[0]}» — дене бөлігі немесе жеке ұғым бүкіл адамды/ұжымды білдіруі мүмкін.`,
      };
    });
    results.push(make('synecdoche', found));
  }

  // ── 8. Перифраз ─────────────────────────────────────────────
  {
    const periph: [string[], string][] = [
      [['ұлы жазушы', 'ұлы ақын', 'ұлы тұлға'], 'Ұлы ақын / жазушы атауының орнына перифраз'],
      [['қасиетті жер', 'туған топырақ', 'ата мекен', 'ата жер'], 'Туған жердің орнына образды атау'],
      [['бозторғай', 'жырдың ханы', 'толғаушы'], 'Адамды немесе ақынды символдық атаумен білдіру'],
      [['алтын бесік', 'ертедегі заман', 'ескі заман'], 'Кезеңнің немесе мекеннің образды атауы'],
    ];
    const found: DeviceExample[] = [];
    for (const [kws, explanation] of periph) {
      const kw = kws.find(k => t.includes(k));
      if (kw) {
        const lineCtx = lines.find(l => l.toLowerCase().includes(kw)) ?? kw;
        found.push({ text: lineCtx.trim(), explanation });
      }
    }
    results.push(make('periphrasis', found));
  }

  // ── 9. Аллитерация ──────────────────────────────────────────
  {
    const consonCounts: Record<string, { count: number; lines: string[] }> = {};
    lines.forEach(line => {
      const first = line.trim()[0]?.toLowerCase() ?? '';
      if (first && !VOWELS.has(first)) {
        if (!consonCounts[first]) consonCounts[first] = { count: 0, lines: [] };
        consonCounts[first].count++;
        consonCounts[first].lines.push(line.trim());
      }
    });
    const found = Object.entries(consonCounts)
      .filter(([, v]) => v.count >= 3)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 2)
      .map(([char, { count, lines: ls }]) => ({
        text: ls.slice(0, 2).join('\n'),
        explanation: `«${char.toUpperCase()}» дыбысы ${count} жолда қайталанады — ырғақ пен дыбыс үйлесімі күшейеді.`,
      }));
    results.push(make('alliteration', found));
  }

  // ── 10. Ассонанс ─────────────────────────────────────────────
  {
    const vowelFreq: Record<string, { count: number; examples: string[] }> = {};
    lines.forEach(line => {
      const vs = [...line.toLowerCase()].filter(c => VOWELS.has(c));
      const freq: Record<string, number> = {};
      vs.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
      const dom = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
      if (dom && dom[1] >= 5) {
        if (!vowelFreq[dom[0]]) vowelFreq[dom[0]] = { count: 0, examples: [] };
        vowelFreq[dom[0]].count++;
        vowelFreq[dom[0]].examples.push(line.trim());
      }
    });
    const found = Object.entries(vowelFreq)
      .filter(([, v]) => v.count >= 2)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 2)
      .map(([v, { examples }]) => ({
        text: examples.slice(0, 2).join('\n'),
        explanation: `«${v}» дауысты дыбысы жиі қайталанып, өлеңге ерекше мелодиялық үн береді.`,
      }));
    results.push(make('assonance', found));
  }

  // ── 11. Анафора ──────────────────────────────────────────────
  {
    const starts: Record<string, string[]> = {};
    lines.forEach(line => {
      const words = line.trim().split(/\s+/);
      const key = words.slice(0, 2).join(' ').toLowerCase();
      if (key) { if (!starts[key]) starts[key] = []; starts[key].push(line.trim()); }
    });
    const found = Object.entries(starts)
      .filter(([, ls]) => ls.length >= 2)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 2)
      .map(([key, ls]) => ({
        text: ls.slice(0, 3).join('\n'),
        explanation: `«${key}» тіркесімен ${ls.length} жол басталады — анафора эмоционалды күш береді.`,
      }));
    results.push(make('anaphora', found));
  }

  // ── 12. Эпифора ──────────────────────────────────────────────
  {
    const ends: Record<string, string[]> = {};
    lines.forEach(line => {
      const words = line.trim().split(/\s+/);
      const key = words.slice(-2).join(' ').toLowerCase().replace(/[.,!?;:—–]/g, '');
      if (key) { if (!ends[key]) ends[key] = []; ends[key].push(line.trim()); }
    });
    const found = Object.entries(ends)
      .filter(([, ls]) => ls.length >= 2)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 2)
      .map(([key, ls]) => ({
        text: ls.slice(0, 3).join('\n'),
        explanation: `«${key}» тіркесімен ${ls.length} жол аяқталады — ырғақтық қайталау ойды бекітеді.`,
      }));
    results.push(make('epiphora', found));
  }

  // ── 13. Инверсия ─────────────────────────────────────────────
  {
    // Баяндауыш жолдың ортасында немесе басында тұру — инверсия белгісі
    const invRx = /^(?:болды|деді|айтты|келді|кетті|тұрды|жатты|жүрді|барды)\s+/mi;
    const earlyVerb = lines.filter(l => invRx.test(l.trim()));
    // Немесе анықтауыш зат есімнен кейін
    const postDef = lines.filter(l => /(ақ|қара|асқақ|нәзік|биік)\s+\w+\s+(болды|тұр|жатыр)/i.test(l));
    const combined = [...earlyVerb, ...postDef].slice(0, 3);
    const found = combined.map(line => ({
      text: line.trim(),
      explanation: 'Жолда сөздердің орны ауысқан — баяндауыш немесе анықтауыш сөйлемдегі күтілген орнынан ауысып, ырғақ пен мазмұн күшейтілген.',
    }));
    results.push(make('inversion', found));
  }

  // ── 14. Риторикалық сұрақ ────────────────────────────────────
  {
    const qLines = lines.filter(l => l.includes('?'));
    const found = qLines.slice(0, 4).map(line => ({
      text: line.trim(),
      explanation: 'Жауап күтілмейтін сұрақ — оқырманды ойға шақырып, идеяны күшейтеді.',
    }));
    results.push(make('rhetoricalQuestion', found));
  }

  // ── 15. Параллелизм ──────────────────────────────────────────
  {
    // Ұзындығы ұқсас жолдар — синтаксистік параллелизм белгісі
    const lineLengths = lines.map(l => l.trim().split(/\s+/).length);
    const avgLen = lineLengths.reduce((a, b) => a + b, 0) / (lineLengths.length || 1);
    const parallelGroups: string[][] = [];
    for (let i = 0; i < lines.length - 1; i++) {
      const a = lineLengths[i] ?? 0;
      const b = lineLengths[i + 1] ?? 0;
      if (Math.abs(a - b) <= 1 && a >= 3) {
        const last = parallelGroups[parallelGroups.length - 1];
        if (last && last[last.length - 1] === lines[i]) {
          last.push(lines[i + 1]);
        } else {
          parallelGroups.push([lines[i], lines[i + 1]]);
        }
      }
    }
    const found = parallelGroups
      .filter(g => g.length >= 2)
      .slice(0, 2)
      .map(group => ({
        text: group.slice(0, 3).join('\n'),
        explanation: `Жолдардың синтаксистік құрылымы бірдей — параллелизм ойдың ырғағын күшейтеді. Орта сөз саны: ${Math.round(avgLen)}.`,
      }));
    results.push(make('parallelism', found));
  }

  // ── 16. Антитеза ─────────────────────────────────────────────
  {
    const antPairs: [string, string][] = [
      ['жастық', 'кәрілік'], ['жарық', 'қараңғы'], ['жақсы', 'жаман'],
      ['өмір', 'өлім'], ['бай', 'кедей'], ['қуаныш', 'қайғы'],
      ['ақ', 'қара'], ['биік', 'терең'], ['жылы', 'суық'],
      ['бостандық', 'тұтқын'], ['ерлік', 'қорқақтық'], ['сүйіспеншілік', 'жек'],
      ['жеңіс', 'жеңіліс'], ['бүгін', 'ертең'], ['алда', 'артта'],
    ];
    const found: DeviceExample[] = [];
    for (const [w1, w2] of antPairs) {
      if (t.includes(w1) && t.includes(w2)) {
        const l1 = lines.find(l => l.toLowerCase().includes(w1));
        const l2 = lines.find(l => l.toLowerCase().includes(w2));
        const ctx = [l1, l2].filter(Boolean).join('\n');
        found.push({
          text: ctx || `${w1} / ${w2}`,
          explanation: `«${w1}» ↔ «${w2}» — қарсы мағыналы ұғымдар бір мәнмәтінде, контраст шығарманың идеясын ашады.`,
        });
        if (found.length >= 2) break;
      }
    }
    results.push(make('antithesis', found));
  }

  // ── 17. Гипербола ────────────────────────────────────────────
  {
    const rx = /(мың|жүз мың|миллион|шексіз|мәңгі|ешқашан|ғаламат|теңдесіз|асқан|жер мен аспан|тау-тас|талай жыл|жарқырады бүкіл|бар дүние|бар халық)[^.!\n]*/gi;
    const ms = [...text.matchAll(rx)].slice(0, 3);
    const found = ms.map(m => {
      const fragment = m[0].trim();
      return { text: fragment, explanation: `«${fragment.slice(0, 60)}» — нәрсенің мөлшері немесе белгісі ерекше асырып бейнеленген.` };
    });
    results.push(make('hyperbole', found));
  }

  // ── 18. Литота ───────────────────────────────────────────────
  {
    const rx = /(кішкентай ғана|азғана|тіпті де|небәрі|аз ба|болмаса да|небір|дегенмен де)[^.!\n]*/gi;
    const ms = [...text.matchAll(rx)].slice(0, 2);
    const negRx = /(?:жоқ емес|аз емес|кіші емес|ұсақ емес|қарапайым емес)[^.!\n]*/gi;
    const ms2 = [...text.matchAll(negRx)].slice(0, 2);
    const found = [...ms, ...ms2].slice(0, 3).map(m => ({
      text: m[0].trim(),
      explanation: `«${m[0].trim().slice(0, 60)}» — нәрсенің белгісі кішірейтіліп, жоқтан бар етіп бейнеленген.`,
    }));
    results.push(make('litotes', found));
  }

  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// Engine result type
// ─────────────────────────────────────────────────────────────────────────────
interface EngineResult {
  lineCount: number; stanzaCount: number; stanzaType: string;
  wordCount: number; uniqueWords: number; avgSyllables: number;
  syllablePattern: string; syllablesPerLine: number[];
  rhymeScheme: string; rhymeLabel: string; rhymeLetters: string[];
  genre: string; idea: string; themes: string[]; tone: string; mood: string;
  prosody: string; devices: DeviceResult[];
  keyWords: { word: string; count: number }[];
}

function runEngine(raw: string): EngineResult {
  const rawLines = raw.split('\n');
  const lines = rawLines.filter(l => l.trim().length > 0);
  const words = raw.trim().split(/\s+/).filter(Boolean);
  let stanzaCount = 1;
  for (let i = 1; i < rawLines.length; i++) {
    if (!rawLines[i].trim() && rawLines[i - 1]?.trim()) stanzaCount++;
  }
  if (!rawLines[rawLines.length - 1]?.trim()) stanzaCount = Math.max(1, stanzaCount - 1);
  const sylPerLine = lines.map(l => l.trim().split(/\s+/).reduce((s, w) => s + syllables(w), 0));
  const avgSyl = sylPerLine.length ? Math.round(sylPerLine.reduce((a, b) => a + b, 0) / sylPerLine.length) : 0;
  const sylCounts = [...new Set(sylPerLine)].sort((a, b) => a - b);
  const sylPattern = sylCounts.length <= 2 ? sylCounts.join('-') + ' буын' : `${Math.min(...sylPerLine)}–${Math.max(...sylPerLine)} буын`;
  const rhyme = detectRhyme(lines);
  const uniqueWordSet = new Set(words.map(w => w.toLowerCase().replace(/[.,!?«»;:—–]/g, '')));
  const { tone, mood } = detectTone(raw);
  const genre = detectGenre(raw);
  const themes = detectThemes(raw);
  const idea = detectIdea(raw, genre, themes, tone);
  const devices = detectAllDevices(raw, lines);
  const freq: Record<string, number> = {};
  words.forEach(w => {
    const stop = new Set(['да', 'де', 'та', 'те', 'мен', 'бен', 'пен', 'бұл', 'сол', 'ол', 'сен', 'біз', 'сіз', 'бар', 'жоқ', 'үшін', 'туралы', 'және', 'ал', 'не', 'ма', 'ме', 'ба', 'бе']);
    const c = w.replace(/[.,!?«»;:—–()\d]/g, '').trim().toLowerCase();
    if (c.length >= 3 && !stop.has(c)) freq[c] = (freq[c] || 0) + 1;
  });
  const keyWords = Object.entries(freq).map(([word, count]) => ({ word, count }))
    .filter(w => w.count >= 2).sort((a, b) => b.count - a.count).slice(0, 12);
  return {
    lineCount: lines.length, stanzaCount,
    stanzaType: detectStanzaType(lines, stanzaCount),
    wordCount: words.length, uniqueWords: uniqueWordSet.size,
    avgSyllables: avgSyl, syllablePattern: sylPattern,
    syllablesPerLine: sylPerLine.slice(0, 16),
    rhymeScheme: rhyme.scheme, rhymeLabel: rhyme.label, rhymeLetters: rhyme.letters.slice(0, 16),
    genre, idea, themes, tone, mood, prosody: detectProsody(avgSyl),
    devices, keyWords,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Device Card Component ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function DeviceCard({ device, index }: { device: DeviceResult; index: number }) {
  const [open, setOpen] = useState(device.found);
  const c = device.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-2xl border ${c.border} ${c.bg} overflow-hidden`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
      >
        {/* Color dot */}
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${device.found ? c.dot : 'bg-white/10'}`} />

        {/* Name + status */}
        <span className={`font-semibold text-sm flex-1 text-left ${device.found ? c.text : 'text-white/30'}`}>
          {device.name}
          <span className="text-white/25 font-normal ml-1.5 text-xs">({device.nameRu})</span>
        </span>

        {/* Badge */}
        {device.found ? (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${c.badge}`}>
            {device.examples.length} мысал
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/5 text-white/20">
            табылмады
          </span>
        )}

        {open ? <ChevronUp size={13} className="text-white/25 shrink-0" /> : <ChevronDown size={13} className="text-white/25 shrink-0" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Definition */}
              <div className={`rounded-xl px-3 py-2.5 bg-white/[0.03] border border-white/6`}>
                <p className="text-white/35 text-[10px] uppercase tracking-wider mb-1">Анықтамасы</p>
                <p className="text-white/70 text-xs leading-relaxed">{device.definition}</p>
              </div>

              {/* Examples */}
              {device.found && device.examples.map((ex, i) => (
                <div key={i} className="space-y-1.5">
                  {/* Text fragment */}
                  <div className={`rounded-xl px-3 py-2.5 ${c.highlight} border ${c.border}`}>
                    <p className="text-white/35 text-[10px] uppercase tracking-wider mb-1">Шығармадан мысал</p>
                    <p className={`text-sm font-mono leading-relaxed whitespace-pre-line ${c.text}`}>
                      «{ex.text}»
                    </p>
                  </div>
                  {/* Explanation */}
                  <div className="rounded-xl px-3 py-2 bg-white/[0.02] border border-white/5">
                    <p className="text-white/35 text-[10px] uppercase tracking-wider mb-1">Түсіндірмесі</p>
                    <p className="text-white/60 text-xs leading-relaxed">{ex.explanation}</p>
                  </div>
                </div>
              ))}

              {!device.found && (
                <p className="text-white/25 text-xs italic">
                  Бұл тәсіл берілген мәтінде анықталмады немесе жасырын түрде қолданылуы мүмкін.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Poem Preview with color highlights ───────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function PoemPreview({ text, devices }: { text: string; devices: DeviceResult[] }) {
  const [open, setOpen] = useState(true);

  // Build a map of found fragments to color
  const highlights = useMemo(() => {
    const map: { fragment: string; color: string }[] = [];
    for (const d of devices) {
      if (!d.found) continue;
      for (const ex of d.examples) {
        // Only short inline fragments
        const frag = ex.text.split('\n')[0]?.trim() ?? '';
        if (frag && frag.length < 80) {
          map.push({ fragment: frag.replace(/^«|»$/g, ''), color: d.color.highlight });
        }
      }
    }
    return map;
  }, [devices]);

  const lines = text.split('\n');

  // Inline HTML coloring
  function colorLine(line: string): React.ReactNode[] {
    let remaining = line;
    const parts: React.ReactNode[] = [];
    let safety = 0;
    while (remaining.length > 0 && safety++ < 50) {
      let earliest: { idx: number; frag: string; color: string } | null = null;
      for (const { fragment, color } of highlights) {
        const idx = remaining.toLowerCase().indexOf(fragment.toLowerCase());
        if (idx !== -1 && (!earliest || idx < earliest.idx)) {
          earliest = { idx, frag: fragment, color };
        }
      }
      if (!earliest || earliest.idx < 0) {
        parts.push(<span key={parts.length}>{remaining}</span>);
        break;
      }
      if (earliest.idx > 0) parts.push(<span key={parts.length}>{remaining.slice(0, earliest.idx)}</span>);
      parts.push(
        <mark key={parts.length} className={`rounded px-0.5 ${earliest.color} not-italic`}>
          {remaining.slice(earliest.idx, earliest.idx + earliest.frag.length)}
        </mark>
      );
      remaining = remaining.slice(earliest.idx + earliest.frag.length);
    }
    return parts;
  }

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03]">
        <span className="text-white/60 text-sm font-medium">📄 Мәтін (белгіленген тәсілдерімен)</span>
        {open ? <ChevronUp size={13} className="text-white/25" /> : <ChevronDown size={13} className="text-white/25" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4">
              <div className="bg-white/[0.02] rounded-xl p-4 font-mono text-sm leading-loose whitespace-pre-wrap">
                {lines.map((line, i) => (
                  <div key={i}>
                    {line.trim() === '' ? <br /> : colorLine(line)}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Rhyme color map ───────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const RHYME_COLORS: Record<string, string> = {
  'А': 'bg-violet-500/25 text-violet-300 border-violet-500/30',
  'Б': 'bg-amber-500/25 text-amber-300 border-amber-500/30',
  'В': 'bg-emerald-500/25 text-emerald-300 border-emerald-500/30',
  'Г': 'bg-rose-500/25 text-rose-300 border-rose-500/30',
  'Д': 'bg-sky-500/25 text-sky-300 border-sky-500/30',
  '—': 'bg-white/5 text-white/20 border-white/10',
};
function rhymeColor(l: string) { return RHYME_COLORS[l] ?? 'bg-white/8 text-white/50 border-white/15'; }

// ─────────────────────────────────────────────────────────────────────────────
// ── Shared small components ───────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function SectionCard({
  icon, title, badge, children, defaultOpen = true,
}: { icon: React.ReactNode; title: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/8 overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-white/60">{icon}</span>
          <span className="text-white font-semibold text-sm">{title}</span>
          {badge && <span className="px-2 py-0.5 rounded-full bg-white/8 text-white/40 text-xs border border-white/8">{badge}</span>}
        </div>
        {open ? <ChevronUp size={14} className="text-white/25" /> : <ChevronDown size={14} className="text-white/25" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-white/35 text-xs uppercase tracking-wider shrink-0 w-28 pt-0.5">{label}</span>
      <span className="text-white/85 text-sm leading-relaxed flex-1">{value}</span>
    </div>
  );
}

function Tag({ children, color = 'violet' }: { children: React.ReactNode; color?: string }) {
  const cls: Record<string, string> = {
    violet: 'bg-violet-500/15 border-violet-500/25 text-violet-300',
    amber:  'bg-amber-500/15 border-amber-500/25 text-amber-300',
    emerald:'bg-emerald-500/15 border-emerald-500/25 text-emerald-300',
    blue:   'bg-blue-500/15 border-blue-500/25 text-blue-300',
    rose:   'bg-rose-500/15 border-rose-500/25 text-rose-300',
    teal:   'bg-teal-500/15 border-teal-500/25 text-teal-300',
  };
  return <span className={`px-3 py-1.5 rounded-full border text-xs font-medium ${cls[color] ?? cls.violet}`}>{children}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ── EngineResultView (12 sections + devices panel) ───────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function EngineResultView({ result, text }: { result: EngineResult; text: string }) {
  const foundDevices   = result.devices.filter(d => d.found);
  const unfoundDevices = result.devices.filter(d => !d.found);
  const [showUnfound, setShowUnfound] = useState(false);

  const DEVICE_SECTIONS = ['Жанр', 'Тақырып', 'Идея', 'Негізгі ой', 'Композиция',
    'Автор бейнесі', 'Өлең құрылысы', 'Тәрбиелік мән', 'Қорытынды'];

  return (
    <div className="space-y-4">
      {/* Quick verdict */}
      <div className="bg-gradient-to-r from-violet-500/15 to-purple-500/10 border border-violet-500/25 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-violet-400" />
          <span className="text-violet-300 text-sm font-semibold">Талдау нәтижесі</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <Tag color="violet">{result.genre}</Tag>
          <Tag color="amber">{result.rhymeLabel}</Tag>
          <Tag color="teal">{result.mood}</Tag>
          <Tag color="blue">{result.prosody}</Tag>
        </div>
        <div className="flex flex-wrap gap-1">
          {DEVICE_SECTIONS.map(s => (
            <span key={s} className="px-2 py-0.5 rounded-full bg-violet-500/12 border border-violet-500/20 text-violet-300/70 text-[11px]">✓ {s}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: 'Жол', v: result.lineCount },
          { l: 'Шумақ', v: result.stanzaCount, s: result.stanzaType },
          { l: 'Орта буын', v: result.avgSyllables, s: result.syllablePattern },
          { l: 'Сөз қоры', v: result.uniqueWords, s: `${result.wordCount} жалпы` },
        ].map(({ l, v, s }) => (
          <div key={l} className="bg-white/[0.04] border border-white/8 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-violet-300">{v}</p>
            {s && <p className="text-xs text-violet-400/60 mt-0.5">{s}</p>}
            <p className="text-white/40 text-xs mt-1">{l}</p>
          </div>
        ))}
      </div>

      {/* Poem preview with highlights */}
      {text.trim() && <PoemPreview text={text} devices={result.devices} />}

      {/* 2. Жанр */}
      <SectionCard icon={<BookOpen size={15} />} title="2. Жанр">
        <div className="grid grid-cols-2 gap-3">
          {[
            { l: 'Жанр', v: result.genre },
            { l: 'Үн', v: result.tone },
            { l: 'Өлшем', v: result.prosody },
            { l: 'Тақырыптар', v: result.themes.join(', ') },
          ].map(({ l, v }) => (
            <div key={l} className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
              <p className="text-white/35 text-[11px] uppercase tracking-wider mb-1">{l}</p>
              <p className="text-white text-xs font-medium">{v}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 3. Тақырып */}
      <SectionCard icon={<Lightbulb size={15} />} title="3. Тақырып">
        <div className="flex flex-wrap gap-2">
          {result.themes.map(t => <Tag key={t} color="amber">{t}</Tag>)}
        </div>
      </SectionCard>

      {/* 4. Идея */}
      <SectionCard icon={<Sparkles size={15} />} title="4. Идея">
        <div className="bg-violet-500/8 border border-violet-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">{result.idea}</p>
        </div>
      </SectionCard>

      {/* 5. Негізгі ой */}
      <SectionCard icon={<Brain size={15} />} title="5. Негізгі ой">
        <div className="bg-fuchsia-500/8 border border-fuchsia-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">{result.idea}</p>
        </div>
      </SectionCard>

      {/* 9. Көркемдегіш тәсілдер — 18 device cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palette size={15} className="text-white/40" />
            <h3 className="text-white font-semibold text-sm">9. Көркемдегіш тәсілдер</h3>
            <span className="px-2 py-0.5 rounded-full bg-white/8 text-white/40 text-xs border border-white/8">18 тәсіл</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 text-xs font-medium">{foundDevices.length} табылды</span>
            <span className="text-white/25 text-xs">/ {result.devices.length}</span>
          </div>
        </div>

        {/* Legend strip */}
        <div className="flex flex-wrap gap-1.5 mb-4 p-3 bg-white/[0.02] rounded-xl border border-white/5">
          {result.devices.map(d => (
            <div key={d.id} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${d.found ? d.color.dot : 'bg-white/10'}`} />
              <span className={`text-[11px] ${d.found ? d.color.text : 'text-white/20'}`}>{d.name}</span>
            </div>
          ))}
        </div>

        {/* Found devices */}
        {foundDevices.length > 0 && (
          <div className="space-y-2 mb-2">
            {foundDevices.map((d, i) => <DeviceCard key={d.id} device={d} index={i} />)}
          </div>
        )}

        {/* Unfound toggle */}
        {unfoundDevices.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowUnfound(v => !v)}
              className="w-full py-2.5 rounded-xl border border-white/6 text-white/25 hover:text-white/50 text-xs transition-colors hover:bg-white/[0.02]"
            >
              {showUnfound ? '▲ Табылмаған тәсілдерді жасыру' : `▼ Табылмаған ${unfoundDevices.length} тәсілді көрсету`}
            </button>
            {showUnfound && (
              <div className="space-y-2 mt-2">
                {unfoundDevices.map((d, i) => <DeviceCard key={d.id} device={d} index={i} />)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 10. Өлең құрылысы */}
      <SectionCard icon={<Music2 size={15} />} title="10. Өлең құрылысы">
        <div className="space-y-4">
          {result.rhymeLetters.length > 0 && (
            <div>
              <p className="text-white/35 text-xs uppercase tracking-wider mb-2">Ұйқас схемасы</p>
              <div className="flex flex-wrap gap-1.5">
                {result.rhymeLetters.map((letter, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <span className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center ${rhymeColor(letter)}`}>{letter}</span>
                    <span className="text-white/20 text-[10px]">{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-2">{result.rhymeLabel}</p>
            </div>
          )}
          {result.syllablesPerLine.length > 0 && (
            <div>
              <p className="text-white/35 text-xs uppercase tracking-wider mb-2">Буын саны — жол бойынша</p>
              <div className="space-y-1">
                {result.syllablesPerLine.map((syl, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-white/20 text-[10px] w-4 text-right">{i + 1}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((syl / 14) * 100, 100)}%` }} transition={{ duration: 0.4, delay: i * 0.03 }} className="h-full bg-gradient-to-r from-emerald-500/60 to-teal-400/60 rounded-full" />
                    </div>
                    <span className="text-emerald-400/70 text-[11px] font-mono w-4">{syl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <InfoRow label="Шумақ түрі" value={result.stanzaType} />
        </div>
      </SectionCard>

      {/* 11. Тәрбиелік мәні */}
      <SectionCard icon={<GraduationCap size={15} />} title="11. Тәрбиелік мәні">
        <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">
            Шығарма {result.themes.join(', ').toLowerCase()} тақырыбы арқылы рухани байлық пен адамгершілік сезімдерін тәрбиелейді.
          </p>
        </div>
      </SectionCard>

      {/* 12. Қорытынды */}
      <SectionCard icon={<FileText size={15} />} title="12. Қорытынды">
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/8 border border-violet-500/20 rounded-xl px-4 py-4">
            <p className="text-white/90 text-sm leading-relaxed">
              Талданған шығарма {result.genre} жанрына жатады. Негізгі тақырыбы — {result.themes[0]?.toLowerCase() ?? 'лирикалық'}. {result.idea} Өлең {result.prosody} өлшемінде жазылған, {result.rhymeLabel} ұйқас схемасы қолданылған. {foundDevices.length} бейнелеу тәсілі анықталды.
            </p>
          </div>
          {result.keyWords.length > 0 && (
            <div>
              <p className="text-white/35 text-xs uppercase tracking-wider mb-2">Кілт сөздер</p>
              <div className="flex flex-wrap gap-2">
                {result.keyWords.map(({ word, count }) => {
                  const max = result.keyWords[0]?.count ?? 1;
                  const size = 12 + Math.round((count / max) * 10);
                  const opacity = 0.45 + (count / max) * 0.55;
                  return <span key={word} className="text-violet-300 font-medium cursor-default hover:text-violet-200 transition-colors" style={{ fontSize: `${size}px`, opacity }} title={`${count} рет`}>{word}</span>;
                })}
              </div>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── LOCAL ENGINE MODE ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const EXAMPLES_PRESET = [
  { label: 'Абай', text: `Жасымда ғылым бар деп ескермедім,\nПайдасын көре тұра тексермедім.\nАсылын алтын менен күмістің де,\nЕрте айтса ата-анам, сенбедім.` },
  { label: 'Мағжан', text: `Ұш, тұлпарым, ұш, асау,\nҰш еркін жел сияқты!\nЖер бетімен шаптырмай,\nАспанда жүр айдайлы!` },
  { label: 'Сәкен', text: `Оян, қазақ, өлмесең,\nОян қазақ, өлмесең!\nМінеки, енді кеш те болды,\nОян, оян, оянсаң!` },
];

function LocalEngineMode({ workTitle }: { workTitle?: string }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<EngineResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lines = text.split('\n').filter(l => l.trim()).length;
    if (!text.trim() || lines < 2) { setResult(null); return; }
    setLoading(true);
    const timer = setTimeout(() => { setResult(runEngine(text)); setLoading(false); }, 600);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Sparkles size={14} className="text-amber-400" />
            </div>
            <h3 className="text-white font-bold text-base">Жергілікті талдау жүйесі</h3>
          </div>
          <p className="text-white/40 text-sm">
            {workTitle
              ? `«${workTitle}» мәтінін қойыңыз — 18 бейнелеу тәсілі мен 12 бөлімді талдау автоматты шығады`
              : 'Өлең мәтінін теріңіз — 18 тәсіл анықталып, түрлі-түсті белгіленеді'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/25 text-xs">Үлгі:</span>
          {EXAMPLES_PRESET.map(ex => (
            <button key={ex.label} onClick={() => setText(ex.text)} className="px-3 py-1.5 rounded-lg bg-white/8 hover:bg-amber-500/20 hover:text-amber-300 text-white/60 text-xs font-medium border border-white/8 hover:border-amber-500/30 transition-colors">{ex.label}</button>
          ))}
        </div>
      </div>

      {/* Note */}
      {workTitle && (
        <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/80 leading-relaxed">
            «{workTitle}» шығармасының дайын талдауы базада жоқ. Мәтінін қойсаңыз — 18 тәсіл анықталып, 12 бөлімді нәтиже шығады.
          </p>
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`Өлең мәтінін осында теріңіз немесе қойыңыз...\n\nМысалы:\nЖасымда ғылым бар деп ескермедім,\nПайдасын көре тұра тексермедім.`}
          rows={10}
          className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 text-sm font-mono resize-none focus:outline-none focus:border-violet-500/40 transition-colors leading-relaxed"
          spellCheck={false}
        />
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3 text-white/30 text-xs">
            {loading && <span className="flex items-center gap-1.5 text-violet-400"><span className="w-3 h-3 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" />Талдануда...</span>}
            {!loading && text && <span>{text.split('\n').filter(l => l.trim()).length} жол · {text.trim().split(/\s+/).filter(Boolean).length} сөз</span>}
          </div>
          {text && <button onClick={() => { setText(''); setResult(null); }} className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/8 transition-colors"><RotateCcw size={13} /></button>}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <EngineResultView result={result} text={text} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!text.trim() && (
        <div className="text-center py-12 text-white/20">
          <Shapes size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm mb-4">Өлең мәтінін теріңіз — 18 бейнелеу тәсілі автоматты анықталады</p>
          {/* Device color legend */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-w-2xl mx-auto text-left">
            {Object.entries(DEVICE_META).map(([id, meta]) => (
              <div key={id} className={`px-2 py-1.5 rounded-lg border ${meta.color.border} ${meta.color.bg} flex items-center gap-1.5`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.color.dot}`} />
                <span className={`text-[11px] ${meta.color.text} truncate`}>{meta.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Example auto-mode (from analysis.json sampleText) ────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function ExampleAutoMode({ workSlug, workTitle }: { workSlug: string; workTitle?: string }) {
  const example = useMemo(
    () => analysisExamples.find(e => e.slug === workSlug || e.slug === workSlug.replace(/-/g, '_')),
    [workSlug],
  );
  const [text, setText] = useState('');
  const result = useMemo(() => (text.trim() ? runEngine(text) : null), [text]);

  useEffect(() => {
    if (example?.sampleText) setText(String(example.sampleText));
  }, [example]);

  if (!example) return <LocalEngineMode workTitle={workTitle} />;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center"><Sparkles size={13} className="text-amber-400" /></div>
        <span className="text-amber-400 text-sm font-medium">Мысал мәтін бойынша талдау</span>
        <span className="text-white/25 text-xs">— analysis.json-дан</span>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={8} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-mono resize-none focus:outline-none focus:border-violet-500/40 transition-colors leading-relaxed" spellCheck={false} />
      {result && <EngineResultView result={result} text={text} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Full Analysis (from workAnalyses.json) ────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function FullAnalysisView({ analysis }: { analysis: Analysis }) {
  const [copied, setCopied] = useState(false);
  const authorInfo = useMemo(() => {
    const all = getCompatAuthors();
    return all.find(a => a.name === analysis.author || a.fullName === analysis.author);
  }, [analysis.author]);

  const handleCopy = useCallback(() => {
    const txt = [`📖 ${analysis.title} — Талдау`, `Автор: ${analysis.author}`, `Жанр: ${analysis.genre}`, `Тақырып: ${analysis.theme}`, `Идея: ${analysis.idea}`, `Негізгі ой: ${analysis.mainThought}`].join('\n');
    navigator.clipboard.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, [analysis]);

  const SECTIONS = ['Автор', 'Жанр', 'Тақырып', 'Идея', 'Негізгі ой', 'Композиция', 'Кейіпкерлер', 'Автор бейнесі', 'Көркемдегіш', 'Өлең құрылысы', 'Тәрбиелік мән', 'Қорытынды'];

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Status bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 size={13} className="text-emerald-400" /></div>
          <span className="text-emerald-400 text-sm font-medium">Дайын талдау</span>
          <span className="text-white/25 text-xs">— базадан жүктелді</span>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/12 text-white/50 hover:text-white text-xs transition-colors">
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Көшірілді' : 'Нәтижені көшір'}
        </button>
      </div>

      {/* Sections chips */}
      <div className="flex flex-wrap gap-1.5">
        {SECTIONS.map(s => <span key={s} className="px-2 py-0.5 rounded-full bg-violet-500/12 border border-violet-500/20 text-violet-300/70 text-[11px]">✓ {s}</span>)}
      </div>

      {/* 1. АВТОР */}
      <SectionCard icon={<User size={15} />} title="1. Автор">
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-xl font-serif text-white">{analysis.author.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-base">{analysis.author}</p>
              {authorInfo && <p className="text-white/40 text-xs mt-0.5">{authorInfo.years} · {authorInfo.birthplace}</p>}
              {authorInfo && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {authorInfo.tags?.slice(0, 4).map(t => <Tag key={t} color="violet">{t}</Tag>)}
                </div>
              )}
            </div>
          </div>
          {authorInfo?.biography && (
            <p className="text-white/65 text-sm leading-relaxed bg-white/[0.03] rounded-xl px-4 py-3">
              {authorInfo.biography.slice(0, 300)}…
            </p>
          )}
        </div>
      </SectionCard>

      {/* 2. ЖАНР */}
      <SectionCard icon={<BookOpen size={15} />} title="2. Жанр">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { l: 'Жанр', v: analysis.genre },
            { l: 'Бағыт', v: analysis.direction },
            { l: 'Ағым', v: analysis.literaryMovement },
            { l: 'Тип', v: analysis.type },
            { l: 'Кезең', v: analysis.period },
          ].map(({ l, v }) => (
            <div key={l} className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
              <p className="text-white/35 text-[11px] uppercase tracking-wider mb-1">{l}</p>
              <p className="text-white text-sm font-medium">{v}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 3. ТАҚЫРЫП */}
      <SectionCard icon={<Lightbulb size={15} />} title="3. Тақырып">
        <div className="bg-amber-500/8 border border-amber-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">{analysis.theme}</p>
        </div>
      </SectionCard>

      {/* 4. ИДЕЯ */}
      <SectionCard icon={<Sparkles size={15} />} title="4. Идея">
        <div className="bg-violet-500/8 border border-violet-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">{analysis.idea}</p>
        </div>
      </SectionCard>

      {/* 5. НЕГІЗГІ ОЙ */}
      <SectionCard icon={<Brain size={15} />} title="5. Негізгі ой">
        <div className="bg-fuchsia-500/8 border border-fuchsia-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">{analysis.mainThought}</p>
        </div>
      </SectionCard>

      {/* 6. КОМПОЗИЦИЯ */}
      {analysis.composition && analysis.composition.length > 0 && (
        <SectionCard icon={<Layers size={15} />} title="6. Композиция" badge={`${analysis.composition.length} бөлім`}>
          <div className="space-y-2">
            {analysis.composition.map((part, i) => (
              <div key={part.key} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-300 text-xs font-bold">{i + 1}</div>
                <div className="flex-1 bg-white/[0.02] border border-white/6 rounded-xl px-3 py-2.5">
                  <p className="text-blue-300 text-xs font-semibold mb-0.5">{part.nameKaz}</p>
                  <p className="text-white/70 text-xs leading-relaxed">{part.description}</p>
                  {part.excerpt && <p className="text-white/30 text-xs font-mono mt-1.5 italic">«{part.excerpt.slice(0, 80)}{part.excerpt.length > 80 ? '…' : ''}»</p>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* 7. КЕЙІПКЕРЛЕР */}
      {analysis.characters && analysis.characters.length > 0 && (
        <SectionCard icon={<Users size={15} />} title="7. Кейіпкерлер" badge={`${analysis.characters.length} кейіпкер`}>
          <div className="space-y-3">
            {analysis.characters.map(char => {
              const typeColors: Record<string, string> = { main: 'bg-teal-500/15 text-teal-300 border-teal-500/25', secondary: 'bg-blue-500/15 text-blue-300 border-blue-500/25', episodic: 'bg-white/8 text-white/40 border-white/10' };
              const typeLabels: Record<string, string> = { main: 'Бас кейіпкер', secondary: 'Екінші деңгейлі', episodic: 'Эпизодтық' };
              return (
                <div key={char.id} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/30 to-emerald-500/20 border border-white/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-serif text-white">{char.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-semibold text-sm">{char.name}</p>
                        <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${typeColors[char.type] ?? typeColors.episodic}`}>{typeLabels[char.type] ?? char.type}</span>
                      </div>
                      <p className="text-white/35 text-xs">{char.role}</p>
                    </div>
                  </div>
                  <p className="text-white/65 text-xs leading-relaxed mb-2">{char.description}</p>
                  {char.traits && char.traits.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {char.traits.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-white/50 text-[11px]">{t}</span>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* 8. АВТОР БЕЙНЕСІ */}
      <SectionCard icon={<Eye size={15} />} title="8. Автор бейнесі">
        <div className="space-y-3">
          <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
            <p className="text-white/85 text-sm leading-relaxed">
              {(analysis as unknown as Record<string,string>).authorPortrait || analysis.literaryTheory?.portrait || `${analysis.author} шығармасындағы лирикалық немесе эпикалық тұлға — ақынның рухани дүниесін бейнелейді.`}
            </p>
          </div>
          {analysis.literaryTheory?.psychology && (
            <div className="bg-white/[0.02] border border-white/6 rounded-xl px-4 py-3">
              <p className="text-white/35 text-xs uppercase tracking-wider mb-1">Психологизм</p>
              <p className="text-white/65 text-xs leading-relaxed">{analysis.literaryTheory.psychology}</p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* 9. КӨРКЕМДЕГІШ ТӘСІЛДЕР */}
      {analysis.stylisticDevices && analysis.stylisticDevices.length > 0 && (
        <SectionCard icon={<Palette size={15} />} title="9. Көркемдегіш тәсілдер" badge={`${analysis.stylisticDevices.length} тәсіл`}>
          <ul className="space-y-3">
            {analysis.stylisticDevices.map((d, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-blue-400 shrink-0 mt-0.5">◆</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-semibold">{d.nameKaz}</span>
                    <span className="text-white/25 text-xs">({d.name})</span>
                  </div>
                  {d.examples?.map((ex, j) => (
                    <div key={j} className="text-xs">
                      {ex.text && <p className="text-blue-300/70 font-mono italic">«{ex.text}»</p>}
                      {ex.explanation && <p className="text-white/50 mt-0.5">{ex.explanation}</p>}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* 10. ӨЛЕҢ ҚҰРЫЛЫСЫ */}
      <SectionCard icon={<Music2 size={15} />} title="10. Өлең құрылысы">
        {analysis.poemStructure ? (
          <div className="space-y-2">
            {Object.entries(analysis.poemStructure).map(([k, v]) => <InfoRow key={k} label={k} value={String(v)} />)}
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
            <p className="text-white/65 text-sm leading-relaxed">
              {analysis.genre?.includes('Роман') || analysis.genre?.includes('Проза') || analysis.genre?.includes('Пьеса')
                ? `«${analysis.title}» — прозалық шығарма. Баяндау синтаксисіне негізделген.`
                : 'Өлең құрылысы деректері жоқ.'}
            </p>
          </div>
        )}
      </SectionCard>

      {/* 11. ТӘРБИЕЛІК МӘНІ */}
      <SectionCard icon={<GraduationCap size={15} />} title="11. Тәрбиелік мәні">
        <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">
            {(analysis as unknown as Record<string,string>).educationalValue || `«${analysis.title}» шығармасы оқушыларға гуманизм, парыз, ізгілік қасиеттерін ұғындырады.`}
          </p>
        </div>
      </SectionCard>

      {/* 12. ҚОРЫТЫНДЫ */}
      <SectionCard icon={<FileText size={15} />} title="12. Қорытынды">
        <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/8 border border-violet-500/20 rounded-xl px-4 py-4">
          <p className="text-white/90 text-sm leading-relaxed">
            {`«${analysis.title}» — ${analysis.genre} жанрындағы ${analysis.period} кезеңінің туындысы. ${analysis.author} бұл шығармасында ${analysis.theme.toLowerCase()} тақырыбын терең зерделейді. Негізгі идея — ${analysis.idea.toLowerCase()}. ${analysis.mainThought}`}
          </p>
        </div>
        {(analysis as unknown as Record<string,string>).historicalContext && (
          <div className="mt-3 bg-white/[0.02] border border-white/6 rounded-xl px-4 py-3">
            <p className="text-white/35 text-xs uppercase tracking-wider mb-1">Тарихи контекст</p>
            <p className="text-white/65 text-xs leading-relaxed">{(analysis as unknown as Record<string,string>).historicalContext}</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export default function TabAutoAnalysis({ analysis, workSlug }: Props) {
  const hasExample = useMemo(
    () => analysisExamples.some(e => e.slug === workSlug || e.slug === workSlug.replace(/-/g, '_')),
    [workSlug],
  );

  if (analysis) return <FullAnalysisView analysis={analysis} />;
  if (hasExample) return <ExampleAutoMode workSlug={workSlug} workTitle={workSlug} />;
  return <LocalEngineMode workTitle={workSlug || undefined} />;
}
