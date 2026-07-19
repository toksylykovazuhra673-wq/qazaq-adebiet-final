import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, BookOpen, AlignLeft, Hash, Music2, Lightbulb,
  Layers, Type, RotateCcw, Copy, Check, ChevronDown, ChevronUp,
  BarChart2, Palette, Zap,
} from 'lucide-react';

// ─── Analysis engine ──────────────────────────────────────────
interface PoemResult {
  lineCount: number;
  stanzaCount: number;
  wordCount: number;
  uniqueWords: number;
  avgSyllables: number;
  syllablePattern: string;
  rhymeScheme: string;
  rhymeLabel: string;
  genre: string;
  devices: { name: string; example?: string }[];
  themes: string[];
  tone: string;
  mood: string;
  period: string;
  prosody: string;
  keyWords: { word: string; count: number }[];
  notes: string;
}

const VOWELS = new Set('аәеёиіоөуүыəАӘЕЁИІОӨУҮЫ');

function syllables(word: string) {
  return [...word].filter(c => VOWELS.has(c)).length || 1;
}

function lineEnding(line: string) {
  const w = line.trim().split(/\s+/);
  const last = w[w.length - 1] ?? '';
  return last.replace(/[«».,!?;:—–-]/g, '').slice(-3).toLowerCase();
}

function detectRhyme(lines: string[]): { scheme: string; label: string } {
  if (lines.length < 2) return { scheme: '—', label: 'Белгісіз' };
  const e = lines.map(lineEnding);

  // AAAA
  if (e.every(x => x && x === e[0])) return { scheme: 'АААА', label: 'Тізбектелген ұйқас' };
  // ABAB
  if (e.length >= 4 && e[0] && e[0] === e[2] && e[1] && e[1] === e[3]) return { scheme: 'АБАБ', label: 'Айқасқан ұйқас' };
  // AABB
  const aabb = e.length >= 4 && e.every((x, i) => {
    if (i % 2 === 0) return x && x === e[i + 1];
    return true;
  });
  if (aabb) return { scheme: 'ААББ', label: 'Жұптасқан ұйқас' };
  // ABBA
  if (e.length >= 4 && e[0] && e[0] === e[3] && e[1] && e[1] === e[2]) return { scheme: 'АББА', label: 'Оралмалы ұйқас' };
  // AAAB
  if (e.length >= 4 && e[0] && e[0] === e[1] && e[0] === e[2] && e[3] !== e[0]) return { scheme: 'ААAБ', label: 'Үштелген ұйқас' };

  return { scheme: 'Аралас', label: 'Аралас ұйқас' };
}

function detectGenre(text: string): string {
  const t = text.toLowerCase();
  const rules: [string[], string][] = [
    [['жаз', 'қыс', 'күз', 'аспан', 'дала', 'гүл', 'бұлт', 'жел', 'шалғын', 'жапырақ'], 'Табиғат лирикасы'],
    [['сүю', 'жүрек', 'махаббат', 'сағын', 'ғашық', 'сүйікті'], 'Сүйіспеншілік лирикасы'],
    [['ел', 'отан', 'халық', 'жер', 'туған', 'ата-мекен'], 'Патриоттық лирика'],
    [['өмір', 'адам', 'ақыл', 'тіршілік', 'мән', 'мақсат', 'ой'], 'Философиялық лирика'],
    [['жас', 'балалық', 'жастық', 'шама', 'шабыт'], 'Жастық лирика'],
    [['батыр', 'ер', 'жауынгер', 'соғыс', 'найза', 'тулатып'], 'Жырлық поэзия (эпос)'],
    [['қайғы', 'мұң', 'жылау', 'зарлау', 'деп жылап'], 'Мұңды лирика (элегия)'],
    [['мақтан', 'дан', 'мадақ', 'ерлік'], 'Мадақтау (ода)'],
  ];
  let best: [number, string] = [0, 'Лирика'];
  for (const [kws, genre] of rules) {
    const hits = kws.filter(k => t.includes(k)).length;
    if (hits > best[0]) best = [hits, genre];
  }
  return best[1];
}

function detectDevices(text: string, lines: string[]): { name: string; example?: string }[] {
  const result: { name: string; example?: string }[] = [];
  const t = text.toLowerCase();

  // Anaphora
  const starts = lines.map(l => l.trim().split(/\s+/).slice(0, 2).join(' ').toLowerCase());
  const freq: Record<string, number> = {};
  starts.forEach(s => s && (freq[s] = (freq[s] || 0) + 1));
  const anaph = Object.entries(freq).find(([, n]) => n >= 2);
  if (anaph) result.push({ name: 'Анафора (жолдар бастауының қайталануы)', example: `«${anaph[0]}…»` });

  // Epiphora
  const ends = lines.map(l => l.trim().split(/\s+/).pop()?.toLowerCase() ?? '');
  const endFreq: Record<string, number> = {};
  ends.forEach(e => e && (endFreq[e] = (endFreq[e] || 0) + 1));
  const epiph = Object.entries(endFreq).find(([, n]) => n >= 3);
  if (epiph) result.push({ name: 'Эпифора (жолдар соңының қайталануы)', example: `«…${epiph[0]}»` });

  // Comparison
  if (/(секілді|сияқты|тәрізді|бейне|сынды|ұқсайды)/.test(t))
    result.push({ name: 'Теңеу (салыстыру)', example: 'секілді / тәрізді / бейне' });

  // Metaphor indicators (contextual)
  if (/жүрек.*(от|өрт|жалын|мұз|тас)|(от|өрт|жалын|мұз|тас).*жүрек/.test(t))
    result.push({ name: 'Метафора (образды теңестіру)' });

  // Personification
  if (/(жер|аспан|бұлт|жел|дала|дарья|өзен).*(тыңдады|күлді|жылады|айтты|деді|тербетті)/.test(t))
    result.push({ name: 'Кейіптеу (табиғатты тіршілендіру)' });

  // Epithet
  if (/(ақ |қара |алтын |күміс |жасыл |биік |терең |кең )/.test(t))
    result.push({ name: 'Эпитет (суреттеуіш сын есім)' });

  // Rhetorical question
  if ((text.match(/\?/g) || []).length >= 2)
    result.push({ name: 'Риторикалық сұрақ' });

  // Exclamation
  if ((text.match(/!/g) || []).length >= 2)
    result.push({ name: 'Риторикалық леп белгісі' });

  // Alliteration
  const consonGroups: Record<string, number> = {};
  lines.forEach(l => {
    const c = l.trim()[0]?.toLowerCase() ?? '';
    if (c && !VOWELS.has(c)) consonGroups[c] = (consonGroups[c] || 0) + 1;
  });
  const allitEntry = Object.entries(consonGroups).find(([, n]) => n >= 3);
  if (allitEntry) result.push({ name: 'Аллитерация (дыбыс үндестігі)', example: `«${allitEntry[0]}» дыбысы` });

  // Parallelism
  const lineLengths = lines.map(l => l.trim().split(/\s+/).length);
  const avgLen = lineLengths.reduce((a, b) => a + b, 0) / (lineLengths.length || 1);
  const uniform = lineLengths.filter(l => Math.abs(l - avgLen) <= 1).length;
  if (uniform >= lines.length * 0.8 && lines.length >= 4)
    result.push({ name: 'Синтаксистік параллелизм (қатар құрылымдар)' });

  // Inversion
  if (/(ды|ді|ты|ті|ды|ді)\s+[А-ЯӘІҚҒҰҮЁЖШЩЦЧЪЬЪa-z]/i.test(text))
    result.push({ name: 'Инверсия (кері сөз тәртібі)' });

  return result.length ? result : [{ name: 'Жалпы лирикалық тәсілдер' }];
}

function detectThemes(text: string): string[] {
  const t = text.toLowerCase();
  const map: [string[], string][] = [
    [['жастық', 'балалық', 'жас шақ'], 'Жастық шақ'],
    [['ел', 'халық', 'отан', 'туған жер'], 'Отансүйгіштік'],
    [['өмір', 'тіршілік', 'мән'], 'Өмір мәні'],
    [['табиғат', 'дала', 'жаз', 'қыс', 'аспан', 'жел', 'гүл'], 'Табиғат сұлулығы'],
    [['сүю', 'махаббат', 'ғашық', 'жүрек'], 'Сүйіспеншілік'],
    [['ой', 'ақыл', 'ойлан', 'парасат'], 'Философиялық толғаныс'],
    [['қайғы', 'мұң', 'айрылу', 'зарлау'], 'Мұң мен қайғы'],
    [['еңбек', 'іс', 'жасау', 'салу'], 'Еңбек және іс-қимыл'],
    [['дос', 'ынтымақ', 'бірлік', 'аға'], 'Достық және бірлік'],
    [['ертегі', 'аруақ', 'жыр', 'ата'], 'Ұлттық дәстүр'],
  ];
  const found = map.filter(([kws]) => kws.some(k => t.includes(k))).map(([, label]) => label);
  return found.length ? found.slice(0, 4) : ['Жалпы лирикалық тақырып'];
}

function detectTone(text: string): { tone: string; mood: string } {
  const t = text.toLowerCase();
  const excl = (text.match(/!/g) || []).length;
  const quest = (text.match(/\?/g) || []).length;
  const sad = ['қайғы', 'мұң', 'жылау', 'зар', 'айрыл', 'арман'].filter(w => t.includes(w)).length;
  const joy = ['шат', 'қуан', 'рахат', 'мерей', 'бақ', 'ләззат'].filter(w => t.includes(w)).length;

  let tone = 'Ойлы, медитативті';
  let mood = '🤔 Толғанысты';
  if (excl > 2 && quest === 0) { tone = 'Жігерлі, шабытты'; mood = '🔥 Жігерлі'; }
  else if (quest > 2) { tone = 'Ізденімді, толғанысты'; mood = '💭 Ізденімді'; }
  else if (sad > joy && sad >= 2) { tone = 'Мұңды, элегиялық'; mood = '😔 Мұңды'; }
  else if (joy > sad && joy >= 2) { tone = 'Шаттанған, мерейлі'; mood = '😊 Шаттанған'; }

  return { tone, mood };
}

function detectProsody(avgSyl: number, lineCount: number): string {
  if (avgSyl >= 11) return '11 буынды өлшем (жыр)';
  if (avgSyl >= 9 && avgSyl <= 10) return '10 буынды өлшем';
  if (avgSyl >= 7 && avgSyl <= 8) return '7–8 буынды өлшем (қазақ халық поэзиясы)';
  if (avgSyl >= 5 && avgSyl <= 6) return '5–6 буынды өлшем (кіші форма)';
  if (lineCount < 4) return 'Қысқа форма';
  return 'Еркін өлшем';
}

function topWords(text: string): { word: string; count: number }[] {
  const stopwords = new Set(['да', 'де', 'та', 'те', 'мен', 'бен', 'пен', 'бұл', 'сол', 'ол', 'мен', 'сен', 'ол', 'біз', 'сіз', 'бар', 'жоқ', 'үшін', 'туралы', 'және', 'ал', 'не', 'но', 'а', 'в', 'и', 'на', 'с']);
  const freq: Record<string, number> = {};
  text.toLowerCase().split(/\s+/).forEach(w => {
    const clean = w.replace(/[.,!?«»;:—–()\d]/g, '').trim();
    if (clean.length >= 3 && !stopwords.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  });
  return Object.entries(freq)
    .map(([word, count]) => ({ word, count }))
    .filter(w => w.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

function analyze(raw: string): PoemResult {
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

  return {
    lineCount: lines.length,
    stanzaCount,
    wordCount: words.length,
    uniqueWords: uniqueWordSet.size,
    avgSyllables: avgSyl,
    syllablePattern: sylPattern,
    rhymeScheme: rhyme.scheme,
    rhymeLabel: rhyme.label,
    genre: detectGenre(raw),
    devices: detectDevices(raw, lines),
    themes: detectThemes(raw),
    tone,
    mood,
    period: avgSyl >= 7 && avgSyl <= 8 ? 'Халықтық дәстүр' : 'Авторлық поэзия',
    prosody: detectProsody(avgSyl, lines.length),
    keyWords: topWords(raw),
    notes: stanzaCount >= 2 && lines.length % 4 === 0
      ? 'Өлең тең шумақтық құрылымда — классикалық форма.'
      : lines.length % 3 === 0
      ? 'Өлең үш жолдық шумақтар (терцет) негізінде құрылған.'
      : 'Өлең еркін немесе аралас шумақта жазылған.',
  };
}

// ─── EXAMPLES ────────────────────────────────────────────────
const EXAMPLES = [
  {
    label: 'Абай',
    text: `Жасымда ғылым бар деп ескермедім,
Пайдасын көре тұра тексермедім.
Асылын алтын менен күмістің де,
Ерте айтса ата-анам, сенбедім.`,
  },
  {
    label: 'Мағжан',
    text: `Шолпан ай,
Шолпан ай,
Жарқырайды, жарқырайды,
Алыстан қарайды.
Жер бетіне нұр шашады,
Аспанда сайрайды.`,
  },
  {
    label: 'Мұқағали',
    text: `Өмірдің өзі бір өлең,
Айтылмаған жыр бар ма?
Жылдар озса бір мезет,
Жыр болар ма деп ойлар ем.`,
  },
];

// ─── Sub-components ───────────────────────────────────────────
function Collapsible({ icon, title, children, defaultOpen = true }: {
  icon: React.ReactNode; title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-white font-medium text-sm">{icon}{title}</div>
        {open
          ? <ChevronUp size={14} className="text-white/30" />
          : <ChevronDown size={14} className="text-white/30" />}
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
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-violet-300">{value}</p>
      {sub && <p className="text-xs text-violet-400/70 mt-0.5">{sub}</p>}
      <p className="text-white/40 text-xs mt-1">{label}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
export default function TabAutoAnalysis() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<PoemResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Debounced auto-analyze
  useEffect(() => {
    if (!text.trim() || text.trim().split('\n').filter(Boolean).length < 2) {
      setResult(null);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setResult(analyze(text));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [text]);

  const loadExample = (ex: typeof EXAMPLES[0]) => setText(ex.text);

  const handleCopy = useCallback(() => {
    if (!result) return;
    const out = [
      `📊 ТАЛДАУ НӘТИЖЕСІ`,
      `Жанр: ${result.genre}`,
      `Үн: ${result.tone}`,
      `Ұйқас: ${result.rhymeScheme} — ${result.rhymeLabel}`,
      `Өлшем: ${result.prosody}`,
      `Тақырыптар: ${result.themes.join(', ')}`,
      `Бейнелеу құралдары: ${result.devices.map(d => d.name).join('; ')}`,
      `Статистика: ${result.lineCount} жол · ${result.stanzaCount} шумақ · ${result.wordCount} сөз`,
    ].join('\n');
    navigator.clipboard.writeText(out).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const lineCount = text.split('\n').filter(l => l.trim()).length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Sparkles size={14} className="text-violet-400" />
            </div>
            <h2 className="text-white font-bold text-lg">Автоматты өлең талдаушы</h2>
          </div>
          <p className="text-white/40 text-sm">
            Кез келген өлең мәтінін теріңіз — талдау <strong className="text-violet-400">өздігінен</strong> жасалады.
          </p>
        </div>
        {/* Example buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/25 text-xs">Мысал:</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              onClick={() => loadExample(ex)}
              className="px-3 py-1.5 rounded-lg bg-white/8 hover:bg-violet-500/20 hover:text-violet-300 text-white/60 text-xs font-medium border border-white/8 hover:border-violet-500/30 transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

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

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3 text-white/30 text-xs">
            {loading && (
              <span className="flex items-center gap-1.5 text-violet-400">
                <span className="w-3 h-3 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" />
                Талдануда...
              </span>
            )}
            {!loading && text && (
              <span>{lineCount} жол · {wordCount} сөз</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {text && (
              <button
                onClick={() => { setText(''); setResult(null); }}
                className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/8 transition-colors"
                title="Тазалау"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Quick verdict bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-violet-500/15 to-purple-500/10 border border-violet-500/25 rounded-2xl p-4 flex flex-wrap items-center gap-3"
            >
              <Zap size={16} className="text-violet-400 shrink-0" />
              <div className="flex flex-wrap gap-2 flex-1">
                <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm font-medium border border-violet-500/30">
                  {result.genre}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/8 text-white/70 text-sm border border-white/10">
                  {result.rhymeScheme} ұйқас
                </span>
                <span className="px-3 py-1 rounded-full bg-white/8 text-white/70 text-sm border border-white/10">
                  {result.mood}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/8 text-white/60 text-sm border border-white/10">
                  {result.prosody}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/12 text-white/50 hover:text-white text-xs transition-colors shrink-0"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'Көшірілді' : 'Нәтижені көшір'}
              </button>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat label="Жол саны" value={result.lineCount} />
              <Stat label="Шумақ саны" value={result.stanzaCount} />
              <Stat label="Орта буын" value={result.avgSyllables} sub={result.syllablePattern} />
              <Stat label="Сөз қоры" value={result.uniqueWords} sub={`${result.wordCount} жалпы`} />
            </div>

            {/* Genre & tone */}
            <Collapsible icon={<BookOpen size={15} className="text-violet-400" />} title="Жанр және үн">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Жанр', value: result.genre },
                  { label: 'Үн / сарын', value: result.tone },
                  { label: 'Өлең өлшемі', value: result.prosody },
                  { label: 'Дәстүр', value: result.period },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-white/35 text-xs uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-white text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </Collapsible>

            {/* Rhyme */}
            <Collapsible icon={<Music2 size={15} className="text-green-400" />} title="Ұйқас және өлшем">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="px-4 py-2 rounded-xl bg-green-500/15 border border-green-500/25 text-center">
                  <p className="text-green-300 font-mono text-xl font-bold">{result.rhymeScheme}</p>
                  <p className="text-green-400/70 text-xs mt-0.5">{result.rhymeLabel}</p>
                </div>
                <div className="text-white/60 text-sm">
                  <p>Орташа <strong className="text-white">{result.avgSyllables}</strong> буын/жол</p>
                  <p className="text-xs text-white/35 mt-0.5">{result.syllablePattern}</p>
                </div>
              </div>
            </Collapsible>

            {/* Themes */}
            <Collapsible icon={<Lightbulb size={15} className="text-amber-400" />} title="Тақырыптар">
              <div className="flex flex-wrap gap-2">
                {result.themes.map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-300 text-sm">
                    {t}
                  </span>
                ))}
              </div>
            </Collapsible>

            {/* Stylistic devices */}
            <Collapsible icon={<Layers size={15} className="text-blue-400" />} title="Бейнелеу құралдары">
              <ul className="space-y-2">
                {result.devices.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                    <span className="text-blue-400 shrink-0 mt-0.5">◆</span>
                    <span>
                      {d.name}
                      {d.example && (
                        <span className="text-blue-300/60 font-mono ml-1.5 text-xs">{d.example}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Collapsible>

            {/* Key words cloud */}
            {result.keyWords.length > 0 && (
              <Collapsible icon={<Hash size={15} className="text-white/50" />} title="Кілт сөздер" defaultOpen={false}>
                <div className="flex flex-wrap gap-2">
                  {result.keyWords.map(({ word, count }) => {
                    const max = result.keyWords[0]?.count ?? 1;
                    const size = 12 + Math.round((count / max) * 12);
                    const opacity = 0.45 + (count / max) * 0.55;
                    return (
                      <span
                        key={word}
                        className="text-violet-300 font-medium cursor-default hover:text-violet-200 transition-colors"
                        style={{ fontSize: `${size}px`, opacity }}
                        title={`${count} рет кездескен`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </Collapsible>
            )}

            {/* Device stats bar chart */}
            <Collapsible icon={<BarChart2 size={15} className="text-rose-400" />} title="Талдау статистикасы" defaultOpen={false}>
              <div className="space-y-3">
                {[
                  { label: 'Жол саны', value: result.lineCount, max: 40 },
                  { label: 'Шумақ саны', value: result.stanzaCount, max: 10 },
                  { label: 'Сөздік қор', value: result.uniqueWords, max: 200 },
                  { label: 'Бейнелеу құралдары', value: result.devices.length, max: 8 },
                  { label: 'Тақырыптар', value: result.themes.length, max: 5 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">{item.label}</span>
                      <span className="text-violet-400 font-medium">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Collapsible>

            {/* Notes */}
            <Collapsible icon={<AlignLeft size={15} className="text-white/40" />} title="Ескертпе" defaultOpen={false}>
              <p className="text-white/70 text-sm leading-relaxed mb-2">{result.notes}</p>
              <p className="text-white/25 text-xs">
                * Талдау автоматты алгоритм негізінде орындалды. Академиялық мақсатта кәсіби сараптама ұсынылады.
              </p>
            </Collapsible>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Placeholder when empty */}
      {!text.trim() && (
        <div className="text-center py-12 text-white/20">
          <Palette size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">Өлең мәтінін теріңіз — нәтиже автоматты шығады</p>
        </div>
      )}
    </div>
  );
}
