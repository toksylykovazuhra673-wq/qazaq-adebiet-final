import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, BookOpen, AlignLeft, Hash, Music2,
  ChevronDown, ChevronUp, ArrowLeft, Lightbulb, Layers, Type,
} from 'lucide-react';
import { useLocation } from 'wouter';

// ─── Offline analysis engine ─────────────────────────────────
interface PoemAnalysis {
  lineCount: number;
  stanzaCount: number;
  avgSyllables: number;
  rhymeScheme: string;
  genre: string;
  devices: string[];
  themes: string[];
  tone: string;
  notes: string;
}

function countSyllablesKaz(word: string): number {
  // Kazakh vowels
  const vowels = 'аәеёиіоөуүыəAӘЕЁИІОӨУҮЫ';
  return [...word].filter(c => vowels.includes(c)).length || 1;
}

function detectRhyme(lines: string[]): string {
  if (lines.length < 2) return '—';
  const endings = lines.map(l => {
    const words = l.trim().split(/\s+/);
    const last = words[words.length - 1] ?? '';
    return last.slice(-3).toLowerCase();
  });
  // Check AABB
  const aabb = endings.every((e, i) => i % 2 === 0
    ? !e || endings[i + 1] === e
    : !e || endings[i - 1] === e);
  // Check ABAB
  const abab = endings.length >= 4 && endings[0] === endings[2] && endings[1] === endings[3];
  // Check AAAA
  const allSame = endings.every(e => e === endings[0]);

  if (allSame && endings[0]) return 'АААА';
  if (abab) return 'АБАБ';
  if (aabb) return 'ААББ';
  return 'Аралас ұйқас';
}

function detectGenre(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('жаз') || lower.includes('қыс') || lower.includes('күз') || lower.includes('аспан') || lower.includes('дала') || lower.includes('гүл')) return 'Табиғат лирикасы';
  if (lower.includes('сүю') || lower.includes('жүрек') || lower.includes('сен') || lower.includes('махаббат') || lower.includes('сағын')) return 'Сүйіспеншілік лирикасы';
  if (lower.includes('ел') || lower.includes('жер') || lower.includes('отан') || lower.includes('халық') || lower.includes('ата')) return 'Патриоттық лирика';
  if (lower.includes('өмір') || lower.includes('адам') || lower.includes('ой') || lower.includes('ақыл') || lower.includes('тіршілік')) return 'Философиялық лирика';
  if (lower.includes('жас') || lower.includes('балалық') || lower.includes('жастық')) return 'Жастық лирика';
  return 'Лирика';
}

function detectDevices(text: string): string[] {
  const devices: string[] = [];
  const lower = text.toLowerCase();
  // Repetition / anaphora
  const lines = text.split('\n').filter(Boolean);
  const starts = lines.map(l => l.trim().split(' ')[0] ?? '');
  const uniqueStarts = new Set(starts.filter(Boolean));
  if (uniqueStarts.size < starts.length * 0.6) devices.push('Анафора (жолдар бастауларының қайталануы)');
  // Comparison
  if (lower.includes('секілді') || lower.includes('сияқты') || lower.includes('тәрізді') || lower.includes('бейне')) devices.push('Теңеу (салыстыру)');
  // Metaphor indicators
  if (lower.includes('жүрек') && (lower.includes('от') || lower.includes('мұз'))) devices.push('Метафора');
  if (lower.includes('жан') || lower.includes('рух')) devices.push('Кейіптеу (персонификация)');
  // Exclamation
  if (text.includes('!')) devices.push('Риторикалық леп белгісі');
  // Question
  if (text.includes('?') || lower.includes('ма,') || lower.includes('ме,') || lower.includes('ба,')) devices.push('Риторикалық сұрақ');
  // Alliteration — 3+ lines starting with same consonant
  const consonants: Record<string, number> = {};
  lines.forEach(l => {
    const c = l.trim()[0]?.toLowerCase() ?? '';
    if (c) consonants[c] = (consonants[c] || 0) + 1;
  });
  if (Object.values(consonants).some(n => n >= 3)) devices.push('Аллитерация (дыбыс қайталауы)');
  // Epithet
  if (lower.includes('ақ ') || lower.includes('қара ') || lower.includes('жасыл ') || lower.includes('алтын ')) devices.push('Эпитет (суреттеуіш сын есім)');

  return devices.length ? devices : ['Жалпы лирикалық тәсілдер'];
}

function detectThemes(text: string): string[] {
  const themes: string[] = [];
  const lower = text.toLowerCase();
  if (lower.includes('жас') || lower.includes('балалық')) themes.push('Жастық шақ');
  if (lower.includes('ел') || lower.includes('халық') || lower.includes('отан')) themes.push('Отансүйгіштік');
  if (lower.includes('өмір') || lower.includes('тіршілік')) themes.push('Өмір мәні');
  if (lower.includes('табиғат') || lower.includes('дала') || lower.includes('жаз') || lower.includes('қыс')) themes.push('Табиғат сұлулығы');
  if (lower.includes('сүю') || lower.includes('махаббат')) themes.push('Сүйіспеншілік');
  if (lower.includes('ой') || lower.includes('ақыл') || lower.includes('ойлан')) themes.push('Философиялық толғаныс');
  return themes.length ? themes : ['Жалпы лирикалық тақырып'];
}

function detectTone(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('!') && !lower.includes('?')) return 'Жігерлі, шабытты';
  if ((lower.match(/\?/g) || []).length > 2) return 'Ізденімді, толғанысты';
  if (lower.includes('қайғы') || lower.includes('мұң') || lower.includes('жылау')) return 'Мұңды, элегиялық';
  if (lower.includes('шат') || lower.includes('қуан') || lower.includes('рахат')) return 'Шаттанған, мерейлі';
  return 'Ойлы, медитативті';
}

function analyzePoem(text: string): PoemAnalysis {
  const rawLines = text.split('\n');
  const lines = rawLines.filter(l => l.trim().length > 0);
  
  // Stanza detection
  let stanzaCount = 1;
  for (let i = 1; i < rawLines.length; i++) {
    if (!rawLines[i].trim() && rawLines[i - 1].trim()) stanzaCount++;
  }
  if (!rawLines[rawLines.length - 1]?.trim()) stanzaCount = Math.max(1, stanzaCount - 1);

  const syllablesPerLine = lines.map(line =>
    line.trim().split(/\s+/).reduce((sum, w) => sum + countSyllablesKaz(w), 0)
  );
  const avgSyllables = syllablesPerLine.length
    ? Math.round(syllablesPerLine.reduce((a, b) => a + b, 0) / syllablesPerLine.length)
    : 0;

  return {
    lineCount: lines.length,
    stanzaCount,
    avgSyllables,
    rhymeScheme: detectRhyme(lines),
    genre: detectGenre(text),
    devices: detectDevices(text),
    themes: detectThemes(text),
    tone: detectTone(text),
    notes: stanzaCount >= 2 && lines.length % 4 === 0
      ? 'Өлең дұрыс шумақтық құрылымда жазылған.'
      : 'Өлең еркін немесе аралас шумақта жазылған.',
  };
}

// ─── UI Components ────────────────────────────────────────────
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 font-semibold text-white">
          {icon}
          {title}
        </div>
        {open ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
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
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-violet-300">{value}</p>
      <p className="text-white/50 text-xs mt-1">{label}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function FreeAnalysisPage() {
  // Support ?text= pre-fill from PoemsTab "Талдау" button
  const initialText = typeof window !== 'undefined'
    ? decodeURIComponent(new URLSearchParams(window.location.search).get('text') ?? '')
    : '';
  const [text, setText] = useState(initialText);
  const [analysis, setAnalysis] = useState<PoemAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (!text.trim()) return;
    setLoading(true);
    setAnalysis(null);
    // Simulate brief processing
    setTimeout(() => {
      setAnalysis(analyzePoem(text));
      setLoading(false);
    }, 600);
  }, [text]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0d0d1a] to-slate-950 pt-6 pb-24">
      <div className="max-w-3xl mx-auto px-4">

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors text-sm"
        >
          <ArrowLeft size={15} /> Артқа
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-sm mb-4">
            <Sparkles size={13} /> Өлең талдаушы
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Кез келген өлеңді талда</h1>
          <p className="text-white/50 max-w-lg mx-auto">
            Өлең мәтінін теріп немесе қойып, автоматты талдау алыңыз.
            Жанр, ұйқас, бейнелеу құралдары — барлығы бірден.
          </p>
        </div>

        {/* Input */}
        <div className="glass-card rounded-2xl p-5 mb-6 border border-white/10">
          <label className="block text-white/60 text-sm font-medium mb-3 flex items-center gap-2">
            <Type size={14} /> Өлең мәтінін енгізіңіз
          </label>
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setAnalysis(null); }}
            placeholder="Мысалы:&#10;Жасыл орман, ал дала,&#10;Күн жылытты, жел тынды.&#10;Жер жаңарды ерте тұра,&#10;Гүл ашылды, жер мырзалы..."
            rows={10}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm font-mono resize-none focus:outline-none focus:border-violet-500/50 transition-colors leading-relaxed"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-white/30 text-xs">
              {text.split('\n').filter(l => l.trim()).length} жол · {text.trim().split(/\s+/).filter(Boolean).length} сөз
            </span>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAnalyze}
              disabled={!text.trim() || loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Талдануда...</>
              ) : (
                <><Sparkles size={15} /> Талдау</>
              )}
            </motion.button>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Жол саны" value={analysis.lineCount} />
                <StatCard label="Шумақ саны" value={analysis.stanzaCount} />
                <StatCard label="Орта буын" value={analysis.avgSyllables} />
                <StatCard label="Ұйқас" value={analysis.rhymeScheme} />
              </div>

              {/* Genre & tone */}
              <Section icon={<BookOpen size={18} className="text-violet-400" />} title="Жанр және үн">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Жанр</p>
                    <p className="text-white font-medium">{analysis.genre}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Үн / сарын</p>
                    <p className="text-white font-medium">{analysis.tone}</p>
                  </div>
                </div>
              </Section>

              {/* Themes */}
              <Section icon={<Lightbulb size={18} className="text-amber-400" />} title="Негізгі тақырыптар">
                <div className="flex flex-wrap gap-2">
                  {analysis.themes.map(t => (
                    <span key={t} className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 text-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </Section>

              {/* Stylistic devices */}
              <Section icon={<Layers size={18} className="text-blue-400" />} title="Бейнелеу құралдары">
                <ul className="space-y-2">
                  {analysis.devices.map(d => (
                    <li key={d} className="flex items-start gap-2 text-white/80 text-sm">
                      <span className="text-blue-400 mt-0.5">◆</span> {d}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Rhyme & structure */}
              <Section icon={<Music2 size={18} className="text-green-400" />} title="Өлшем және ұйқас">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-sm w-28">Ұйқас схемасы:</span>
                    <span className="px-3 py-1 rounded-lg bg-green-500/15 border border-green-500/25 text-green-300 font-mono text-sm">
                      {analysis.rhymeScheme}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-sm w-28">Буын саны:</span>
                    <span className="text-white text-sm">орташа {analysis.avgSyllables} буын</span>
                  </div>
                </div>
              </Section>

              {/* Notes */}
              <Section icon={<AlignLeft size={18} className="text-white/50" />} title="Ескертпе">
                <p className="text-white/70 text-sm leading-relaxed">{analysis.notes}</p>
                <p className="text-white/30 text-xs mt-3">
                  * Талдау автоматты алгоритм арқылы жасалды. Кәсіби сараптама үшін мамандарға хабарласыңыз.
                </p>
              </Section>

              {/* Hash stats */}
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
