import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, BookOpen, AlignLeft, Hash, Music2,
  ChevronDown, ChevronUp, ArrowLeft, Lightbulb, Layers, Type,
  Brain, Shapes, BarChart2, Zap, Copy, Check,
} from 'lucide-react';
import { useLocation } from 'wouter';

// ─── Analysis engine ─────────────────────────────────────────
interface PoemAnalysis {
  lineCount: number;
  stanzaCount: number;
  stanzaType: string;
  avgSyllables: number;
  syllablesPerLine: number[];
  rhymeScheme: string;
  rhymeLabel: string;
  rhymeLetters: string[];
  genre: string;
  idea: string;
  devices: { name: string; desc: string; example?: string }[];
  themes: string[];
  tone: string;
  mood: string;
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
  return last.replace(/[«».,!?;:—–\-]/g, '').slice(-3).toLowerCase();
}

function detectRhyme(lines: string[]): { scheme: string; label: string; letters: string[] } {
  if (lines.length < 2) return { scheme: '—', label: 'Белгісіз', letters: [] };
  const e = lines.map(lineEnding);
  const ABC = 'АБВГДЕЖЗИЙ';
  const map: Record<string, string> = {};
  let idx = 0;
  const letters = e.map(end => {
    if (!end) return '—';
    if (map[end]) return map[end];
    map[end] = ABC[idx++] ?? '?';
    return map[end];
  });
  const trimScheme = letters.slice(0, 8).join('');
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
  const map: Record<number, string> = { 2: 'Куплет (2 жол)', 3: 'Терцет (3 жол)', 4: 'Катрен (4 жол)', 5: 'Квинтет (5 жол)', 6: 'Секстина (6 жол)', 8: 'Октава (8 жол)' };
  return map[per] ?? `${per} жолдық шумақ`;
}

function detectGenre(text: string): string {
  const t = text.toLowerCase();
  const rules: [string[], string][] = [
    [['жаз', 'қыс', 'күз', 'аспан', 'дала', 'гүл', 'бұлт', 'жел', 'таң'], 'Табиғат лирикасы'],
    [['сүю', 'жүрек', 'махаббат', 'сағын', 'ғашық', 'сүйікті'], 'Сүйіспеншілік лирикасы'],
    [['ел', 'отан', 'халық', 'жер', 'туған', 'ата-мекен', 'байтақ'], 'Патриоттық лирика'],
    [['өмір', 'адам', 'ақыл', 'тіршілік', 'мән', 'мақсат', 'ой', 'ғарыш'], 'Философиялық лирика'],
    [['жас', 'балалық', 'жастық', 'шабыт', 'армандар'], 'Жастық лирика'],
    [['батыр', 'ер', 'жауынгер', 'соғыс', 'найза', 'алмас'], 'Жырлық поэзия (эпос)'],
    [['қайғы', 'мұң', 'жылау', 'зарлау', 'жоқтау'], 'Мұңды лирика (элегия)'],
    [['мақтан', 'мадақ', 'ерлік', 'алғыс', 'ұлық'], 'Мадақтау (ода)'],
  ];
  let best: [number, string] = [0, 'Лирика'];
  for (const [kws, genre] of rules) {
    const hits = kws.filter(k => t.includes(k)).length;
    if (hits > best[0]) best = [hits, genre];
  }
  return best[1];
}

function detectIdea(text: string, genre: string, themes: string[], tone: string): string {
  const t = text.toLowerCase();
  if (genre.includes('Табиғат') && tone.includes('Мұңды'))
    return 'Табиғат суреттері арқылы адам жанының мұңы мен ішкі толғанысы жеткізілген.';
  if (genre.includes('Табиғат') && tone.includes('Шаттанған'))
    return 'Табиғаттың сұлулығы арқылы өмірдің қуаныш-шаттығы мадақталған.';
  if (genre.includes('Табиғат'))
    return 'Табиғат образдары арқылы адам мен дүниенің рухани үйлесімі бейнеленген.';
  if (genre.includes('Сүйіспеншілік') && tone.includes('Мұңды'))
    return 'Жоғалған немесе қолжетпес махаббатқа деген аңсар мен жан азабы жырланған.';
  if (genre.includes('Сүйіспеншілік'))
    return 'Сүйіспеншілік сезімінің тереңдігі мен ол тудыратын асқақ рухани күй жырланған.';
  if (genre.includes('Патриоттық'))
    return 'Туған жер, ел-жұртқа деген шексіз сүйіспеншілік пен оның алдындағы перзенттік парыз сезімі жырланған.';
  if (genre.includes('Философиялық'))
    return 'Өмір мәні, тіршіліктің мағынасы және адамның ғаламдағы орны жайлы терең толғаныс берілген.';
  if (genre.includes('Жастық'))
    return 'Жастық шақтың өтпелілігі, оның қымбатты сәттері мен болашаққа деген пәк үмід жырланған.';
  if (genre.includes('эпос') || genre.includes('Жырлық'))
    return 'Батырлық ерлік пен халықтың тарихи рухы мадақталып, болашаққа сенім берілген.';
  if (genre.includes('элегия') || (tone.includes('Мұңды') && themes.includes('Мұң мен қайғы')))
    return 'Жоғалған нәрсеге, өткен шаққа деген аңсар мен жанның күйзелісі ақырын жырланған.';
  if (genre.includes('ода') || genre.includes('Мадақтау'))
    return 'Ерлік пен асқақтықты мадақтай отырып, оқырманды шабытқа, іске шақыру.';
  if (t.includes('ғылым') || t.includes('білім') || t.includes('оқу'))
    return 'Ғылым мен білімнің адам өміріндегі маңызы, оның рухани байлық екені ұғындырылған.';
  const themeStr = themes.slice(0, 2).join(' және ');
  return `${themeStr} тақырыбындағы ой-сезімдер лирикалық образдар арқылы жан-жақты ашылған.`;
}

function detectDevices(text: string, lines: string[]): { name: string; desc: string; example?: string }[] {
  const result: { name: string; desc: string; example?: string }[] = [];
  const t = text.toLowerCase();

  // Anaphora
  const starts = lines.map(l => l.trim().split(/\s+/).slice(0, 2).join(' ').toLowerCase());
  const freq: Record<string, number> = {};
  starts.forEach(s => s && (freq[s] = (freq[s] || 0) + 1));
  const anaph = Object.entries(freq).find(([, n]) => n >= 2);
  if (anaph) result.push({ name: 'Анафора', desc: 'Жолдардың бір сөзбен немесе тіркеспен басталуы', example: `«${anaph[0]}…»` });

  // Epiphora
  const ends = lines.map(l => l.trim().split(/\s+/).pop()?.toLowerCase() ?? '');
  const endFreq: Record<string, number> = {};
  ends.forEach(e => e && (endFreq[e] = (endFreq[e] || 0) + 1));
  const epiph = Object.entries(endFreq).find(([, n]) => n >= 3);
  if (epiph) result.push({ name: 'Эпифора', desc: 'Жолдардың бір сөзбен немесе тіркеспен аяқталуы', example: `«…${epiph[0]}»` });

  // Simile
  if (/(секілді|сияқты|тәрізді|бейне|сынды|ұқсайды)/.test(t))
    result.push({ name: 'Теңеу', desc: 'Бір нәрсені екіншісіне ұқсатып салыстыру', example: 'секілді / тәрізді / бейне' });

  // Metaphor
  if (/жүрек.*(от|өрт|жалын|мұз|тас|алтын)|(от|өрт|жалын|мұз|тас).*жүрек/.test(t) ||
      /өмір.*(жол|дария|өлең|жыр)/.test(t))
    result.push({ name: 'Метафора', desc: 'Ұқсастық негізіндегі жасырын образды теңестіру' });

  // Personification
  if (/(жер|аспан|бұлт|жел|дала|өзен|су|тау).*(тыңдады|күлді|жылады|айтты|деді|тербетті|сыбырлады)/.test(t))
    result.push({ name: 'Кейіптеу', desc: 'Жансыз затқа немесе табиғатқа тіршілік қасиеттерін беру' });

  // Epithet
  const epithMatches = t.match(/(ақ|қара|алтын|күміс|жасыл|биік|терең|кең|сұлу|асқақ|мөлдір|жарқын)\s+\w+/g) ?? [];
  if (epithMatches.length >= 2)
    result.push({ name: 'Эпитет', desc: 'Образды суреттеуіш анықтауыш', example: epithMatches.slice(0, 2).map(m => `«${m}»`).join(', ') });

  // Hyperbole
  if (/(мың|жүз мың|шексіз|мәңгі|ешқашан|ғаламат|теңдесіз|аспан биік)/.test(t))
    result.push({ name: 'Гипербола', desc: 'Ерекше асырып бейнелеу, мүбалаға' });

  // Oxymoron
  if (/(тірі өлі|суық жалын|қуанышты мұң|ащы бал|жылы мұз|қараңғы жарық|өлімсіз өмір)/.test(t))
    result.push({ name: 'Оксюморон', desc: 'Қарама-қарсы ұғымдарды қатар қою арқылы жаңа мағына туғызу' });

  // Rhetorical question
  if ((text.match(/\?/g) || []).length >= 2)
    result.push({ name: 'Риторикалық сұрақ', desc: 'Жауап күтпейтін, ойға батыратын сұрақ' });

  // Rhetorical address
  if (/^(ей|ей,|о,|о |сен,|кел,|тыңда|достарым|халықым|жерім)/m.test(t))
    result.push({ name: 'Риторикалық үндеу', desc: 'Оқырманға, табиғатқа немесе ұғымға тікелей сөз қату' });

  // Exclamation
  if ((text.match(/!/g) || []).length >= 2)
    result.push({ name: 'Риторикалық леп', desc: 'Күшті сезімді, эмоцияны білдіретін леп белгісі' });

  // Alliteration
  const consonGroups: Record<string, number> = {};
  lines.forEach(l => {
    const c = l.trim()[0]?.toLowerCase() ?? '';
    if (c && !VOWELS.has(c)) consonGroups[c] = (consonGroups[c] || 0) + 1;
  });
  const allitEntry = Object.entries(consonGroups).find(([, n]) => n >= 3);
  if (allitEntry) result.push({ name: 'Аллитерация', desc: 'Жолдардың немесе сөздердің бірдей дыбыспен басталуы', example: `«${allitEntry[0]}» дыбысы` });

  // Parallelism
  const lineLengths = lines.map(l => l.trim().split(/\s+/).length);
  const avgLen = lineLengths.reduce((a, b) => a + b, 0) / (lineLengths.length || 1);
  const uniform = lineLengths.filter(l => Math.abs(l - avgLen) <= 1).length;
  if (uniform >= lines.length * 0.75 && lines.length >= 4)
    result.push({ name: 'Синтаксистік параллелизм', desc: 'Жолдардың бір типтес синтаксистік құрылымда берілуі' });

  // Gradation
  if (['бірте-бірте', 'барған сайын', 'күшейе', 'тереңдей', 'биіктей'].some(w => t.includes(w)))
    result.push({ name: 'Градация', desc: 'Сезімнің немесе суреттің бірте-бірте күшейіп немесе басылып баруы' });

  // Inversion
  if (/(ды|ді|ты|ті)\s+[А-ЯӘІҚҒҰҮЁЖШа-яі]/i.test(text) && lines.length > 3)
    result.push({ name: 'Инверсия', desc: 'Сөздердің кері тәртіпте орналасуы арқылы экспрессия' });

  return result.length ? result : [{ name: 'Жалпы лирикалық тәсілдер', desc: 'Дәстүрлі поэзиялық бейнелеу амалдары' }];
}

function detectThemes(text: string): string[] {
  const t = text.toLowerCase();
  const map: [string[], string][] = [
    [['жастық', 'балалық', 'жас шақ'], 'Жастық шақ'],
    [['ел', 'халық', 'отан', 'туған жер'], 'Отансүйгіштік'],
    [['өмір', 'тіршілік', 'мән'], 'Өмір мәні'],
    [['табиғат', 'дала', 'жаз', 'қыс', 'аспан', 'жел', 'гүл', 'таң'], 'Табиғат сұлулығы'],
    [['сүю', 'махаббат', 'ғашық', 'жүрек'], 'Сүйіспеншілік'],
    [['ой', 'ақыл', 'ойлан', 'парасат', 'ғылым', 'білім'], 'Философиялық толғаныс'],
    [['қайғы', 'мұң', 'айрылу', 'зарлау'], 'Мұң мен қайғы'],
    [['дос', 'ынтымақ', 'бірлік'], 'Достық және бірлік'],
    [['уақыт', 'өту', 'жыл', 'өткен', 'заман'], 'Уақыттың өтпелілігі'],
  ];
  const found = map.filter(([kws]) => kws.some(k => t.includes(k))).map(([, l]) => l);
  return found.length ? found.slice(0, 4) : ['Жалпы лирикалық тақырып'];
}

function detectTone(text: string): { tone: string; mood: string } {
  const t = text.toLowerCase();
  const excl = (text.match(/!/g) || []).length;
  const quest = (text.match(/\?/g) || []).length;
  const sad = ['қайғы', 'мұң', 'жылау', 'зар', 'айрыл', 'арман'].filter(w => t.includes(w)).length;
  const joy = ['шат', 'қуан', 'рахат', 'мерей', 'бақ', 'ләззат'].filter(w => t.includes(w)).length;
  if (excl > 2 && quest === 0) return { tone: 'Жігерлі, шабытты', mood: '🔥 Жігерлі' };
  if (quest > 2) return { tone: 'Ізденімді, толғанысты', mood: '💭 Ізденімді' };
  if (sad > joy && sad >= 2) return { tone: 'Мұңды, элегиялық', mood: '😔 Мұңды' };
  if (joy > sad && joy >= 2) return { tone: 'Шаттанған, мерейлі', mood: '😊 Шаттанған' };
  return { tone: 'Ойлы, медитативті', mood: '🤔 Толғанысты' };
}

function topWords(text: string): { word: string; count: number }[] {
  const stop = new Set(['да', 'де', 'та', 'те', 'мен', 'бен', 'пен', 'бұл', 'сол', 'ол', 'сен', 'біз', 'сіз',
    'бар', 'жоқ', 'үшін', 'және', 'ал', 'не', 'а', 'в', 'и', 'на', 'с', 'ма', 'ме', 'ба', 'бе', 'ды', 'ді']);
  const freq: Record<string, number> = {};
  text.toLowerCase().split(/\s+/).forEach(w => {
    const clean = w.replace(/[.,!?«»;:—–()\d]/g, '').trim();
    if (clean.length >= 3 && !stop.has(clean)) freq[clean] = (freq[clean] || 0) + 1;
  });
  return Object.entries(freq).map(([word, count]) => ({ word, count }))
    .filter(w => w.count >= 2).sort((a, b) => b.count - a.count).slice(0, 12);
}

function analyzePoem(text: string): PoemAnalysis {
  const rawLines = text.split('\n');
  const lines = rawLines.filter(l => l.trim().length > 0);
  let stanzaCount = 1;
  for (let i = 1; i < rawLines.length; i++) {
    if (!rawLines[i].trim() && rawLines[i - 1]?.trim()) stanzaCount++;
  }
  if (!rawLines[rawLines.length - 1]?.trim()) stanzaCount = Math.max(1, stanzaCount - 1);

  const sylPerLine = lines.map(l => l.trim().split(/\s+/).reduce((s, w) => s + syllables(w), 0));
  const avg = sylPerLine.length ? Math.round(sylPerLine.reduce((a, b) => a + b, 0) / sylPerLine.length) : 0;

  const rhyme = detectRhyme(lines);
  const genre = detectGenre(text);
  const themes = detectThemes(text);
  const { tone, mood } = detectTone(text);
  const idea = detectIdea(text, genre, themes, tone);

  const prosody = avg >= 11 ? '11 буынды өлшем (жыр)'
    : avg === 10 ? '10 буынды өлшем'
    : avg >= 7 ? '7–9 буынды өлшем (халық поэзиясы)'
    : avg >= 5 ? '5–6 буынды өлшем'
    : 'Еркін буынды өлшем';

  return {
    lineCount: lines.length, stanzaCount,
    stanzaType: detectStanzaType(lines, stanzaCount),
    avgSyllables: avg,
    syllablesPerLine: sylPerLine.slice(0, 16),
    rhymeScheme: rhyme.scheme, rhymeLabel: rhyme.label, rhymeLetters: rhyme.letters.slice(0, 16),
    genre, idea,
    devices: detectDevices(text, lines),
    themes, tone, mood, prosody,
    keyWords: topWords(text),
    notes: stanzaCount >= 2 && lines.length % 4 === 0
      ? 'Өлең тең шумақтық құрылымда — классикалық форма.'
      : lines.length % 3 === 0 ? 'Өлең үш жолдық шумақтар (терцет) негізінде.'
      : 'Өлең еркін немесе аралас шумақта жазылған.',
  };
}

// ─── Rhyme color map ──────────────────────────────────────────
const LETTER_COLORS: Record<string, string> = {
  'А': 'bg-violet-500/25 text-violet-300 border-violet-500/30',
  'Б': 'bg-amber-500/25 text-amber-300 border-amber-500/30',
  'В': 'bg-green-500/25 text-green-300 border-green-500/30',
  'Г': 'bg-rose-500/25 text-rose-300 border-rose-500/30',
  'Д': 'bg-sky-500/25 text-sky-300 border-sky-500/30',
  '—': 'bg-white/5 text-white/20 border-white/10',
};
const rhymeColor = (l: string) => LETTER_COLORS[l] ?? 'bg-white/8 text-white/50 border-white/15';

// ─── UI helpers ───────────────────────────────────────────────
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3 font-semibold text-white">{icon}{title}</div>
        {open ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-violet-300">{value}</p>
      {sub && <p className="text-xs text-violet-400/60 mt-0.5">{sub}</p>}
      <p className="text-white/50 text-xs mt-1">{label}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
const EXAMPLES = [
  { label: 'Абай', text: `Жасымда ғылым бар деп ескермедім,\nПайдасын көре тұра тексермедім.\nАсылын алтын менен күмістің де,\nЕрте айтса ата-анам, сенбедім.` },
  { label: 'Мағжан', text: `Шолпан ай,\nШолпан ай,\nЖарқырайды, жарқырайды,\nАлыстан қарайды.\nЖер бетіне нұр шашады,\nАспанда сайрайды.` },
  { label: 'Мұқағали', text: `Өмірдің өзі бір өлең,\nАйтылмаған жыр бар ма?\nЖылдар озса бір мезет,\nЖыр болар ма деп ойлар ем.` },
];

export default function FreeAnalysisPage() {
  const initialText = typeof window !== 'undefined'
    ? decodeURIComponent(new URLSearchParams(window.location.search).get('text') ?? '') : '';
  const [text, setText] = useState(initialText);
  const [analysis, setAnalysis] = useState<PoemAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (!text.trim()) return;
    setLoading(true); setAnalysis(null);
    setTimeout(() => { setAnalysis(analyzePoem(text)); setLoading(false); }, 500);
  }, [text]);

  const handleCopy = useCallback(() => {
    if (!analysis) return;
    const out = [
      '📊 ӨЛЕҢ ТАЛДАУЫ',
      `Жанр: ${analysis.genre}`,
      `Идея: ${analysis.idea}`,
      `Тақырып: ${analysis.themes.join(', ')}`,
      `Үн: ${analysis.tone}`,
      `Ұйқас: ${analysis.rhymeScheme} — ${analysis.rhymeLabel}`,
      `Өлшем: ${analysis.prosody}`,
      `Бейнелеу құралдары: ${analysis.devices.map(d => d.name).join('; ')}`,
      `Статистика: ${analysis.lineCount} жол · ${analysis.stanzaCount} шумақ · ${analysis.stanzaType}`,
    ].join('\n');
    navigator.clipboard.writeText(out).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, [analysis]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0d0d1a] to-slate-950 pt-6 pb-24">
      <div className="max-w-3xl mx-auto px-4">

        {/* Back */}
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft size={15} /> Артқа
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-sm mb-4">
            <Sparkles size={13} /> Өлең талдаушы
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Кез келген өлеңді талда</h1>
          <p className="text-white/50 max-w-lg mx-auto">
            Жанр, идея, тақырып, ұйқас, бейнелеу құралдары, поэзиялық құрылыс — барлығы бірден анықталады.
          </p>
        </div>

        {/* Input */}
        <div className="glass-card rounded-2xl p-5 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <label className="text-white/60 text-sm font-medium flex items-center gap-2">
              <Type size={14} /> Өлең мәтінін енгізіңіз
            </label>
            <div className="flex gap-2">
              {EXAMPLES.map(ex => (
                <button key={ex.label} onClick={() => { setText(ex.text); setAnalysis(null); }}
                  className="px-2.5 py-1 rounded-lg bg-white/8 hover:bg-violet-500/15 hover:text-violet-300 text-white/45 text-xs border border-white/8 transition-colors">
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setAnalysis(null); }}
            placeholder={`Өлең мәтінін осында теріңіз немесе қойыңыз...\n\nМысалы:\nЖасымда ғылым бар деп ескермедім,\nПайдасын көре тұра тексермедім.`}
            rows={10}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm font-mono resize-none focus:outline-none focus:border-violet-500/50 transition-colors leading-relaxed"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-white/30 text-xs">
              {text.split('\n').filter(l => l.trim()).length} жол · {text.trim().split(/\s+/).filter(Boolean).length} сөз
            </span>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleAnalyze} disabled={!text.trim() || loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Талдануда...</>
                : <><Sparkles size={15} /> Талдау</>}
            </motion.button>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-4">

              {/* Quick bar */}
              <div className="bg-gradient-to-r from-violet-500/15 to-purple-500/10 border border-violet-500/25 rounded-2xl p-4 flex flex-wrap items-center gap-3">
                <Zap size={16} className="text-violet-400 shrink-0" />
                <div className="flex flex-wrap gap-2 flex-1">
                  <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm font-medium border border-violet-500/30">{analysis.genre}</span>
                  <span className="px-3 py-1 rounded-full bg-white/8 text-white/70 text-sm border border-white/10">{analysis.rhymeLabel}</span>
                  <span className="px-3 py-1 rounded-full bg-white/8 text-white/70 text-sm border border-white/10">{analysis.mood}</span>
                  <span className="px-3 py-1 rounded-full bg-white/8 text-white/60 text-sm border border-white/10">{analysis.prosody}</span>
                </div>
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/12 text-white/50 hover:text-white text-xs transition-colors">
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copied ? 'Көшірілді' : 'Нәтижені көшір'}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Жол саны" value={analysis.lineCount} />
                <StatCard label="Шумақ" value={analysis.stanzaCount} sub={analysis.stanzaType} />
                <StatCard label="Орта буын" value={analysis.avgSyllables} sub={analysis.prosody.split(' ')[0]} />
                <StatCard label="Ұйқас" value={analysis.rhymeScheme.slice(0, 8)} />
              </div>

              {/* Idea */}
              <Section icon={<Brain size={18} className="text-fuchsia-400" />} title="Негізгі идея">
                <div className="bg-fuchsia-500/8 border border-fuchsia-500/20 rounded-xl px-4 py-3">
                  <p className="text-white/90 text-sm leading-relaxed">{analysis.idea}</p>
                </div>
              </Section>

              {/* Genre & tone */}
              <Section icon={<BookOpen size={18} className="text-violet-400" />} title="Жанры және үні">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Жанр', value: analysis.genre },
                    { label: 'Үн / сарын', value: analysis.tone },
                    { label: 'Өлең өлшемі', value: analysis.prosody },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Themes */}
              <Section icon={<Lightbulb size={18} className="text-amber-400" />} title="Тақырыбы">
                <div className="flex flex-wrap gap-2">
                  {analysis.themes.map(t => (
                    <span key={t} className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 text-sm">{t}</span>
                  ))}
                </div>
              </Section>

              {/* Structure */}
              <Section icon={<Shapes size={18} className="text-emerald-400" />} title="Поэзиялық құрылысы">
                <div className="space-y-5">
                  {/* Rhyme visualization */}
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Ұйқас схемасы — жол бойынша</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {analysis.rhymeLetters.map((letter, i) => (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                          <span className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center ${rhymeColor(letter)}`}>
                            {letter}
                          </span>
                          <span className="text-white/20 text-[10px]">{i + 1}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-white/40 text-sm">{analysis.rhymeLabel}</p>
                  </div>

                  {/* Syllable bars */}
                  {analysis.syllablesPerLine.length > 0 && (
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Буын саны — жол бойынша</p>
                      <div className="space-y-1.5">
                        {analysis.syllablesPerLine.map((syl, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-white/20 text-[10px] w-4 text-right">{i + 1}</span>
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((syl / 14) * 100, 100)}%` }}
                                transition={{ duration: 0.4, delay: i * 0.04 }}
                                className="h-full bg-gradient-to-r from-emerald-500/60 to-teal-400/60 rounded-full"
                              />
                            </div>
                            <span className="text-emerald-400/70 text-[11px] font-mono w-4">{syl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-xs uppercase tracking-wider">Шумақ түрі:</span>
                    <span className="text-white text-sm">{analysis.stanzaType}</span>
                  </div>
                </div>
              </Section>

              {/* Devices */}
              <Section icon={<Layers size={18} className="text-blue-400" />} title="Бейнелеу құралдары">
                <ul className="space-y-3">
                  {analysis.devices.map((d, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-blue-400 mt-0.5 shrink-0">◆</span>
                      <div>
                        <span className="text-white text-sm font-medium">{d.name}</span>
                        <span className="text-white/40 text-xs ml-1.5">— {d.desc}</span>
                        {d.example && <span className="text-blue-300/60 font-mono ml-1.5 text-xs">{d.example}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Key words */}
              {analysis.keyWords.length > 0 && (
                <Section icon={<Hash size={18} className="text-white/50" />} title="Кілт сөздер">
                  <div className="flex flex-wrap gap-2">
                    {analysis.keyWords.map(({ word, count }) => {
                      const max = analysis.keyWords[0]?.count ?? 1;
                      const size = 12 + Math.round((count / max) * 12);
                      const opacity = 0.45 + (count / max) * 0.55;
                      return (
                        <span key={word} className="text-violet-300 font-medium cursor-default hover:text-violet-200 transition-colors"
                          style={{ fontSize: `${size}px`, opacity }} title={`${count} рет кездескен`}>
                          {word}
                        </span>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Stats bar */}
              <Section icon={<BarChart2 size={18} className="text-rose-400" />} title="Талдау статистикасы">
                <div className="space-y-3">
                  {[
                    { label: 'Жол саны', value: analysis.lineCount, max: 40 },
                    { label: 'Шумақ саны', value: analysis.stanzaCount, max: 10 },
                    { label: 'Бейнелеу құралдары', value: analysis.devices.length, max: 10 },
                    { label: 'Тақырыптар', value: analysis.themes.length, max: 5 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60">{item.label}</span>
                        <span className="text-violet-400 font-medium">{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }}
                          animate={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Notes */}
              <Section icon={<AlignLeft size={18} className="text-white/50" />} title="Ескертпе">
                <p className="text-white/70 text-sm leading-relaxed">{analysis.notes}</p>
                <p className="text-white/30 text-xs mt-3">
                  * Талдау автоматты алгоритм арқылы жасалды. Академиялық мақсатта кәсіби сараптама ұсынылады.
                </p>
              </Section>

              <div className="flex items-center gap-2 text-white/20 text-xs">
                <Hash size={11} />
                {analysis.lineCount} жол · {analysis.stanzaCount} шумақ · {analysis.rhymeScheme} ұйқас · {analysis.genre}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
