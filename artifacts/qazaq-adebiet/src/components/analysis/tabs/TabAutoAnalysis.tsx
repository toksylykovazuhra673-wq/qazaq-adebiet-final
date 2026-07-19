/**
 * TabAutoAnalysis.tsx — Гибридті автоматты талдаушы
 *
 * Режимдер:
 *   1. FULL  — workAnalyses.json-да бар → 12 бөлімді толық талдау
 *   2. ENGINE — базада жоқ → LocalAnalysisEngine мәтін талдайды
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, BookOpen, Lightbulb, Layers, Users, User,
  Palette, Music2, GraduationCap, CheckCircle2, ChevronDown,
  ChevronUp, Copy, Check, RotateCcw, Hash, BarChart2,
  Brain, Shapes, Zap, FileText, Eye, AlertCircle,
} from 'lucide-react';
import type { Analysis } from '@/types/analysis';
import { analysisExamples } from '@/lib/dataLoader';
import { getCompatAuthors } from '@/lib/dataLoader';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  analysis: Analysis | null;
  workSlug: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Shared UI helpers ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function SectionCard({
  icon, title, badge, children, accent = 'violet', defaultOpen = true,
}: {
  icon: React.ReactNode; title: string; badge?: string;
  children: React.ReactNode; accent?: string; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const borderColor = `border-${accent}-500/20`;
  const bgColor = `bg-${accent}-500/5`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-white/8 overflow-hidden`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-white/60">{icon}</span>
          <span className="text-white font-semibold text-sm">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-white/8 text-white/40 text-xs border border-white/8">
              {badge}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp size={14} className="text-white/25" />
          : <ChevronDown size={14} className="text-white/25" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
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
  return (
    <span className={`px-3 py-1.5 rounded-full border text-xs font-medium ${cls[color] ?? cls.violet}`}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── MODE 1: Full Analysis View (from workAnalyses.json) ──────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function FullAnalysisView({ analysis }: { analysis: Analysis }) {
  const [copied, setCopied] = useState(false);

  const authorInfo = useMemo(() => {
    const all = getCompatAuthors();
    return all.find(a => a.name === analysis.author || a.fullName === analysis.author);
  }, [analysis.author]);

  const handleCopy = useCallback(() => {
    const txt = [
      `📖 ${analysis.title} — Талдау`,
      `Автор: ${analysis.author}`,
      `Жанр: ${analysis.genre}`,
      `Тақырып: ${analysis.theme}`,
      `Идея: ${analysis.idea}`,
      `Негізгі ой: ${analysis.mainThought}`,
    ].join('\n');
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [analysis]);

  // Progress chips across top
  const SECTIONS = [
    'Автор', 'Жанр', 'Тақырып', 'Идея', 'Негізгі ой',
    'Композиция', 'Кейіпкерлер', 'Автор бейнесі',
    'Көркемдегіш', 'Өлең құрылысы', 'Тәрбиелік мән', 'Қорытынды',
  ];

  return (
    <div className="space-y-4 max-w-3xl">

      {/* Status bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 size={13} className="text-emerald-400" />
          </div>
          <span className="text-emerald-400 text-sm font-medium">Дайын талдау</span>
          <span className="text-white/25 text-xs">— базадан жүктелді</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/12 text-white/50 hover:text-white text-xs transition-colors"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Көшірілді' : 'Нәтижені көшір'}
        </button>
      </div>

      {/* Sections progress */}
      <div className="flex flex-wrap gap-1.5">
        {SECTIONS.map(s => (
          <span key={s} className="px-2 py-0.5 rounded-full bg-violet-500/12 border border-violet-500/20 text-violet-300/70 text-[11px]">
            ✓ {s}
          </span>
        ))}
      </div>

      {/* 1. АВТОР */}
      <SectionCard icon={<User size={15} />} title="1. Автор" accent="violet">
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-xl font-serif text-white">{analysis.author.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-base">{analysis.author}</p>
              {authorInfo && (
                <p className="text-white/40 text-xs mt-0.5">
                  {authorInfo.years} · {authorInfo.birthplace}
                </p>
              )}
              {authorInfo && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {authorInfo.tags?.slice(0, 4).map(t => (
                    <Tag key={t} color="violet">{t}</Tag>
                  ))}
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
      <SectionCard icon={<BookOpen size={15} />} title="2. Жанр" accent="amber">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { l: 'Жанр',      v: analysis.genre },
            { l: 'Бағыт',     v: analysis.direction },
            { l: 'Ағым',      v: analysis.literaryMovement },
            { l: 'Тип',       v: analysis.type },
            { l: 'Кезең',     v: analysis.period },
          ].map(({ l, v }) => (
            <div key={l} className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
              <p className="text-white/35 text-[11px] uppercase tracking-wider mb-1">{l}</p>
              <p className="text-white text-sm font-medium">{v}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 3. ТАҚЫРЫП */}
      <SectionCard icon={<Lightbulb size={15} />} title="3. Тақырып" accent="amber">
        <div className="bg-amber-500/8 border border-amber-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">{analysis.theme}</p>
        </div>
      </SectionCard>

      {/* 4. ИДЕЯ */}
      <SectionCard icon={<Sparkles size={15} />} title="4. Идея" accent="violet">
        <div className="bg-violet-500/8 border border-violet-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">{analysis.idea}</p>
        </div>
      </SectionCard>

      {/* 5. НЕГІЗГІ ОЙ */}
      <SectionCard icon={<Brain size={15} />} title="5. Негізгі ой" accent="violet">
        <div className="bg-fuchsia-500/8 border border-fuchsia-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">{analysis.mainThought}</p>
        </div>
      </SectionCard>

      {/* 6. КОМПОЗИЦИЯ */}
      {analysis.composition && analysis.composition.length > 0 && (
        <SectionCard
          icon={<Layers size={15} />}
          title="6. Композиция"
          badge={`${analysis.composition.length} бөлім`}
          accent="blue"
        >
          <div className="space-y-2">
            {analysis.composition.map((part, i) => (
              <div key={part.key} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-300 text-xs font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 bg-white/[0.02] border border-white/6 rounded-xl px-3 py-2.5">
                  <p className="text-blue-300 text-xs font-semibold mb-0.5">{part.nameKaz}</p>
                  <p className="text-white/70 text-xs leading-relaxed">{part.description}</p>
                  {part.excerpt && (
                    <p className="text-white/30 text-xs font-mono mt-1.5 italic">
                      «{part.excerpt.slice(0, 80)}{part.excerpt.length > 80 ? '…' : ''}»
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* 7. КЕЙІПКЕРЛЕР */}
      {analysis.characters && analysis.characters.length > 0 && (
        <SectionCard
          icon={<Users size={15} />}
          title="7. Кейіпкерлер"
          badge={`${analysis.characters.length} кейіпкер`}
          accent="teal"
        >
          <div className="space-y-3">
            {analysis.characters.map(char => {
              const typeColors: Record<string, string> = {
                main: 'bg-teal-500/15 text-teal-300 border-teal-500/25',
                secondary: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
                episodic: 'bg-white/8 text-white/40 border-white/10',
              };
              const typeLabels: Record<string, string> = {
                main: 'Бас кейіпкер',
                secondary: 'Екінші деңгейлі',
                episodic: 'Эпизодтық',
              };
              return (
                <div key={char.id} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/30 to-emerald-500/20 border border-white/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-serif text-white">{char.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-semibold text-sm">{char.name}</p>
                        <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${typeColors[char.type] ?? typeColors.episodic}`}>
                          {typeLabels[char.type] ?? char.type}
                        </span>
                      </div>
                      <p className="text-white/35 text-xs">{char.role}</p>
                    </div>
                  </div>
                  <p className="text-white/65 text-xs leading-relaxed mb-2">{char.description}</p>
                  {char.traits && char.traits.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {char.traits.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-white/50 text-[11px]">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* 8. АВТОР БЕЙНЕСІ */}
      <SectionCard icon={<Eye size={15} />} title="8. Автор бейнесі" accent="violet">
        <div className="space-y-3">
          <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
            <p className="text-white/85 text-sm leading-relaxed">
              {analysis.literaryTheory?.portrait || analysis.authorPortrait || `${analysis.author} шығармасындағы лирикалық немесе эпикалық тұлға — ақынның рухани дүниесін, ой-санасын, өмірлік ұстанымын бейнелейді.`}
            </p>
          </div>
          {analysis.literaryTheory?.psychology && (
            <div className="bg-white/[0.02] border border-white/6 rounded-xl px-4 py-3">
              <p className="text-white/35 text-xs uppercase tracking-wider mb-1">Психологизм</p>
              <p className="text-white/65 text-xs leading-relaxed">{analysis.literaryTheory.psychology}</p>
            </div>
          )}
          {analysis.literaryTheory?.monologue && (
            <div className="bg-white/[0.02] border border-white/6 rounded-xl px-4 py-3">
              <p className="text-white/35 text-xs uppercase tracking-wider mb-1">Монолог / Ішкі дүние</p>
              <p className="text-white/65 text-xs leading-relaxed">{analysis.literaryTheory.monologue}</p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* 9. КӨРКЕМДЕГІШ ТӘСІЛДЕР */}
      {analysis.stylisticDevices && analysis.stylisticDevices.length > 0 && (
        <SectionCard
          icon={<Palette size={15} />}
          title="9. Көркемдегіш тәсілдер"
          badge={`${analysis.stylisticDevices.length} тәсіл`}
          accent="blue"
        >
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
      <SectionCard icon={<Music2 size={15} />} title="10. Өлең құрылысы" accent="emerald">
        {analysis.poemStructure ? (
          <div className="space-y-2">
            {Object.entries(analysis.poemStructure).map(([k, v]) => (
              <InfoRow key={k} label={k} value={String(v)} />
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
            <p className="text-white/65 text-sm leading-relaxed">
              {analysis.genre?.includes('Роман') || analysis.genre?.includes('Проза') || analysis.genre?.includes('Пьеса')
                ? `«${analysis.title}» — прозалық шығарма. Өлең метрі мен ұйқас үлгісі талданбайды. Шығарманың ырғағы баяндау синтаксисіне негізделген.`
                : `Өлең құрылысы туралы толық деректер талдауда жоқ. Шығарманы оқи отырып буын санын, ұйқас схемасын анықтаңыз.`
              }
            </p>
            {analysis.literaryTheory?.narration && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-white/35 text-xs uppercase tracking-wider mb-1">Баяндау стилі</p>
                <p className="text-white/65 text-xs">{analysis.literaryTheory.narration}</p>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {/* 11. ТӘРБИЕЛІК МӘНІ */}
      <SectionCard icon={<GraduationCap size={15} />} title="11. Тәрбиелік мәні" accent="emerald">
        <div className="space-y-3">
          <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-white/85 text-sm leading-relaxed">
              {analysis.educationalValue || `«${analysis.title}» шығармасы оқушыларға гуманизм, парыз, ізгілік сияқты маңызды адами қасиеттерді ұғындырады. Шығарманы зерттеу барысында ұлттық тарихқа, мәдениетке деген сүйіспеншілік сезімі тәрбиеленеді.`}
            </p>
          </div>
          {analysis.nationalValue && (
            <div className="bg-white/[0.02] border border-white/6 rounded-xl px-4 py-3">
              <p className="text-white/35 text-xs uppercase tracking-wider mb-1">Ұлттық маңызы</p>
              <p className="text-white/65 text-xs leading-relaxed">{analysis.nationalValue}</p>
            </div>
          )}
          {analysis.modernRelevance && (
            <div className="bg-white/[0.02] border border-white/6 rounded-xl px-4 py-3">
              <p className="text-white/35 text-xs uppercase tracking-wider mb-1">Қазіргі өзектілігі</p>
              <p className="text-white/65 text-xs leading-relaxed">{analysis.modernRelevance}</p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* 12. ҚОРЫТЫНДЫ */}
      <SectionCard icon={<FileText size={15} />} title="12. Қорытынды" accent="violet">
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/8 border border-violet-500/20 rounded-xl px-4 py-4">
            <p className="text-white/90 text-sm leading-relaxed">
              {`«${analysis.title}» — ${analysis.genre} жанрындағы ${analysis.period} кезеңінің туындысы. ${analysis.author} бұл шығармасында ${analysis.theme.toLowerCase()} тақырыбын терең зерделейді. Шығарманың негізгі идеясы — ${analysis.idea.toLowerCase()}. ${analysis.mainThought}`}
            </p>
          </div>
          {analysis.historicalContext && (
            <div className="bg-white/[0.02] border border-white/6 rounded-xl px-4 py-3">
              <p className="text-white/35 text-xs uppercase tracking-wider mb-1">Тарихи контекст</p>
              <p className="text-white/65 text-xs leading-relaxed">{analysis.historicalContext}</p>
            </div>
          )}
          {analysis.interestingFacts && analysis.interestingFacts.length > 0 && (
            <div className="bg-white/[0.02] border border-white/6 rounded-xl px-4 py-3">
              <p className="text-white/35 text-xs uppercase tracking-wider mb-2">Қызықты деректер</p>
              <ul className="space-y-1.5">
                {analysis.interestingFacts.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/55">
                    <span className="text-violet-400 shrink-0">→</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── LOCAL ENGINE (poem text analyzer) ────────────────────────────────────────
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
    [['ғылым', 'оқу', 'білім', 'зерттеу'], 'Білім мен ғылым'],
  ];
  const found = map.filter(([kws]) => kws.some(k => t.includes(k))).map(([, l]) => l);
  return found.length ? found.slice(0, 4) : ['Жалпы лирикалық тақырып'];
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
  if (genre.includes('Азаматтық'))
    return 'Халықты ояту, азаматтық борыш пен ар-намыс жырланған.';
  if (genre.includes('эпос') || genre.includes('Жырлық'))
    return 'Батырлық ерлік пен халықтың тарихи рухы мадақталып, болашаққа сенім берілген.';
  if (genre.includes('элегия') || (tone.includes('Мұңды') && themes.includes('Мұң мен қайғы')))
    return 'Жоғалған нәрсеге, өткен шаққа деген аңсар мен жанның күйзелісі ақырын жырланған.';
  if (t.includes('ғылым') || t.includes('білім') || t.includes('оқу'))
    return 'Ғылым мен білімнің адам өміріндегі маңызы, оның рухани байлық екені ұғындырылған.';
  const themeStr = themes.slice(0, 2).join(' және ');
  return `${themeStr} тақырыбындағы ой-сезімдер лирикалық образдар арқылы жан-жақты ашылған.`;
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

function detectDevices(text: string, lines: string[]): { name: string; desc: string; example?: string }[] {
  const result: { name: string; desc: string; example?: string }[] = [];
  const t = text.toLowerCase();
  const starts = lines.map(l => l.trim().split(/\s+/).slice(0, 2).join(' ').toLowerCase());
  const freq: Record<string, number> = {};
  starts.forEach(s => s && (freq[s] = (freq[s] || 0) + 1));
  const anaph = Object.entries(freq).find(([, n]) => n >= 2);
  if (anaph) result.push({ name: 'Анафора', desc: 'Жолдардың бір сөзбен/тіркеспен басталуы', example: `«${anaph[0]}…»` });
  const ends = lines.map(l => l.trim().split(/\s+/).pop()?.toLowerCase() ?? '');
  const endFreq: Record<string, number> = {};
  ends.forEach(e => e && (endFreq[e] = (endFreq[e] || 0) + 1));
  const epiph = Object.entries(endFreq).find(([, n]) => n >= 3);
  if (epiph) result.push({ name: 'Эпифора', desc: 'Жолдардың бір сөзбен аяқталуы', example: `«…${epiph[0]}»` });
  if (/(секілді|сияқты|тәрізді|бейне|сынды|ұқсайды)/.test(t))
    result.push({ name: 'Теңеу', desc: 'Екі нәрсені салыстыру', example: 'секілді / тәрізді / бейне' });
  if (/жүрек.*(от|өрт|жалын|мұз|тас)|өмір.*(жол|дария|өлең|жыр)/.test(t))
    result.push({ name: 'Метафора', desc: 'Жасырын образды теңестіру' });
  if (/(жер|аспан|бұлт|жел|дала|су|тау).*(тыңдады|күлді|жылады|айтты|деді|тербетті)/.test(t))
    result.push({ name: 'Кейіптеу', desc: 'Жансыз затқа тіршілік қасиеттерін беру' });
  const epithMatches = t.match(/(ақ|қара|алтын|күміс|жасыл|биік|терең|кең|сұлу|асқақ|мөлдір|ыстық|жарқын)\s+\w+/g) ?? [];
  if (epithMatches.length >= 2)
    result.push({ name: 'Эпитет', desc: 'Образды суреттеуіш анықтауыш', example: epithMatches.slice(0, 2).map(m => `«${m}»`).join(', ') });
  if (/(мың|жүз мың|шексіз|мәңгі|ешқашан|ғаламат|теңдесіз|асқан)/.test(t))
    result.push({ name: 'Гипербола', desc: 'Ерекше асырып бейнелеу' });
  if ((text.match(/\?/g) || []).length >= 2)
    result.push({ name: 'Риторикалық сұрақ', desc: 'Жауап күтпейтін, ойға батыратын сұрақ' });
  if ((text.match(/!/g) || []).length >= 2)
    result.push({ name: 'Риторикалық леп', desc: 'Күшті сезімді білдіретін леп белгісі' });
  const consonGroups: Record<string, number> = {};
  lines.forEach(l => {
    const c = l.trim()[0]?.toLowerCase() ?? '';
    if (c && !VOWELS.has(c)) consonGroups[c] = (consonGroups[c] || 0) + 1;
  });
  const allitEntry = Object.entries(consonGroups).find(([, n]) => n >= 3);
  if (allitEntry) result.push({ name: 'Аллитерация', desc: 'Бірдей дыбыспен басталу', example: `«${allitEntry[0]}» дыбысы` });
  const lineLengths = lines.map(l => l.trim().split(/\s+/).length);
  const avgLen = lineLengths.reduce((a, b) => a + b, 0) / (lineLengths.length || 1);
  const uniform = lineLengths.filter(l => Math.abs(l - avgLen) <= 1).length;
  if (uniform >= lines.length * 0.75 && lines.length >= 4)
    result.push({ name: 'Синтаксистік параллелизм', desc: 'Жолдардың бір типтес құрылымда берілуі' });
  return result.length ? result : [{ name: 'Жалпы лирикалық тәсілдер', desc: 'Дәстүрлі поэзиялық бейнелеу амалдары' }];
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

interface EngineResult {
  lineCount: number; stanzaCount: number; stanzaType: string;
  wordCount: number; uniqueWords: number; avgSyllables: number;
  syllablePattern: string; syllablesPerLine: number[];
  rhymeScheme: string; rhymeLabel: string; rhymeLetters: string[];
  genre: string; idea: string; themes: string[]; tone: string; mood: string;
  prosody: string; devices: { name: string; desc: string; example?: string }[];
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
  return {
    lineCount: lines.length, stanzaCount,
    stanzaType: detectStanzaType(lines, stanzaCount),
    wordCount: words.length, uniqueWords: uniqueWordSet.size,
    avgSyllables: avgSyl, syllablePattern: sylPattern,
    syllablesPerLine: sylPerLine.slice(0, 16),
    rhymeScheme: rhyme.scheme, rhymeLabel: rhyme.label, rhymeLetters: rhyme.letters.slice(0, 16),
    genre, idea, themes, tone, mood, prosody: detectProsody(avgSyl),
    devices: detectDevices(raw, lines), keyWords: topWords(raw),
  };
}

// ── Rhyme color map ─────────────────────────────────────────────
const RHYME_COLORS: Record<string, string> = {
  'А': 'bg-violet-500/25 text-violet-300 border-violet-500/30',
  'Б': 'bg-amber-500/25 text-amber-300 border-amber-500/30',
  'В': 'bg-emerald-500/25 text-emerald-300 border-emerald-500/30',
  'Г': 'bg-rose-500/25 text-rose-300 border-rose-500/30',
  'Д': 'bg-sky-500/25 text-sky-300 border-sky-500/30',
  '—': 'bg-white/5 text-white/20 border-white/10',
};
function rhymeColor(l: string) { return RHYME_COLORS[l] ?? 'bg-white/8 text-white/50 border-white/15'; }

// ── Engine Result Renderer ────────────────────────────────────
function EngineResultView({ result, workTitle }: { result: EngineResult; workTitle?: string }) {
  const sections = [
    'Жанр', 'Тақырып', 'Идея', 'Негізгі ой', 'Композиция',
    'Автор бейнесі', 'Көркемдегіш', 'Өлең құрылысы', 'Тәрбиелік мән', 'Қорытынды',
  ];
  return (
    <div className="space-y-4">
      {/* Quick verdict */}
      <div className="bg-gradient-to-r from-violet-500/15 to-purple-500/10 border border-violet-500/25 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-violet-400" />
          <span className="text-violet-300 text-sm font-semibold">Талдау нәтижесі</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Tag color="violet">{result.genre}</Tag>
          <Tag color="amber">{result.rhymeLabel}</Tag>
          <Tag color="teal">{result.mood}</Tag>
          <Tag color="blue">{result.prosody}</Tag>
        </div>
        {workTitle && (
          <div className="flex flex-wrap gap-1 mt-3">
            {sections.map(s => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-violet-500/12 border border-violet-500/20 text-violet-300/70 text-[11px]">
                ✓ {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: 'Жол саны', v: result.lineCount },
          { l: 'Шумақ саны', v: result.stanzaCount, s: result.stanzaType },
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

      {/* 2. Жанр */}
      <SectionCard icon={<BookOpen size={15} />} title="2. Жанр" accent="amber">
        <div className="grid grid-cols-2 gap-3">
          {[
            { l: 'Жанр', v: result.genre },
            { l: 'Үн / сарын', v: result.tone },
            { l: 'Өлең өлшемі', v: result.prosody },
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
      <SectionCard icon={<Lightbulb size={15} />} title="3. Тақырып" accent="amber">
        <div className="flex flex-wrap gap-2">
          {result.themes.map(t => <Tag key={t} color="amber">{t}</Tag>)}
        </div>
      </SectionCard>

      {/* 4. Идея */}
      <SectionCard icon={<Sparkles size={15} />} title="4. Идея" accent="violet">
        <div className="bg-violet-500/8 border border-violet-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">{result.idea}</p>
        </div>
      </SectionCard>

      {/* 5. Негізгі ой */}
      <SectionCard icon={<Brain size={15} />} title="5. Негізгі ой" accent="violet">
        <div className="bg-fuchsia-500/8 border border-fuchsia-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">{result.idea}</p>
        </div>
      </SectionCard>

      {/* 9. Көркемдегіш тәсілдер */}
      <SectionCard icon={<Palette size={15} />} title="9. Көркемдегіш тәсілдер" badge={`${result.devices.length} тәсіл`} accent="blue">
        <ul className="space-y-3">
          {result.devices.map((d, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-blue-400 shrink-0 mt-0.5">◆</span>
              <div>
                <span className="text-white text-sm font-medium">{d.name}</span>
                <span className="text-white/40 text-xs ml-1.5">— {d.desc}</span>
                {d.example && <span className="text-blue-300/60 font-mono ml-1.5 text-xs">{d.example}</span>}
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* 10. Өлең құрылысы */}
      <SectionCard icon={<Music2 size={15} />} title="10. Өлең құрылысы" accent="emerald">
        <div className="space-y-4">
          <div>
            <p className="text-white/35 text-xs uppercase tracking-wider mb-2">Ұйқас схемасы — жол бойынша</p>
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
          {result.syllablesPerLine.length > 0 && (
            <div>
              <p className="text-white/35 text-xs uppercase tracking-wider mb-2">Буын саны — жол бойынша</p>
              <div className="space-y-1">
                {result.syllablesPerLine.map((syl, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-white/20 text-[10px] w-4 text-right">{i + 1}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((syl / 14) * 100, 100)}%` }}
                        transition={{ duration: 0.4, delay: i * 0.03 }}
                        className="h-full bg-gradient-to-r from-emerald-500/60 to-teal-400/60 rounded-full"
                      />
                    </div>
                    <span className="text-emerald-400/70 text-[11px] font-mono w-4">{syl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-white/35 text-xs uppercase tracking-wider">Шумақ түрі:</span>
            <span className="text-white text-sm">{result.stanzaType}</span>
          </div>
        </div>
      </SectionCard>

      {/* 11. Тәрбиелік мәні */}
      <SectionCard icon={<GraduationCap size={15} />} title="11. Тәрбиелік мәні" accent="emerald">
        <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-4 py-3">
          <p className="text-white/85 text-sm leading-relaxed">
            Шығарма оқушыларға {result.themes.join(', ').toLowerCase()} тақырыбы арқылы рухани байлық пен адамгершілік сезімдерін тәрбиелейді.
            {result.genre.includes('Патриоттық') ? ' Отансүйгіштік пен халыққа деген сүйіспеншілік сезімі оянады.' : ''}
            {result.genre.includes('Философиялық') ? ' Өмірдің мән-мағынасы туралы терең ойлануға үйретеді.' : ''}
          </p>
        </div>
      </SectionCard>

      {/* 12. Қорытынды */}
      <SectionCard icon={<FileText size={15} />} title="12. Қорытынды" accent="violet">
        <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/8 border border-violet-500/20 rounded-xl px-4 py-4">
          <p className="text-white/90 text-sm leading-relaxed">
            Талданған өлең {result.genre} жанрына жатады. Негізгі тақырыбы — {result.themes[0]?.toLowerCase() ?? 'лирикалық'}. Шығарманың негізгі идеясы: {result.idea} Өлең {result.prosody} өлшемінде жазылған, {result.rhymeLabel} ұйқас схемасы қолданылған. Барлығы {result.devices.length} бейнелеу тәсілі анықталды.
          </p>
        </div>
        {result.keyWords.length > 0 && (
          <div className="mt-3">
            <p className="text-white/35 text-xs uppercase tracking-wider mb-2">Кілт сөздер</p>
            <div className="flex flex-wrap gap-2">
              {result.keyWords.map(({ word, count }) => {
                const max = result.keyWords[0]?.count ?? 1;
                const size = 12 + Math.round((count / max) * 10);
                const opacity = 0.45 + (count / max) * 0.55;
                return (
                  <span key={word} className="text-violet-300 font-medium cursor-default hover:text-violet-200 transition-colors"
                    style={{ fontSize: `${size}px`, opacity }} title={`${count} рет`}>
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ENGINE MODE — user inputs text ──────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const EXAMPLES = [
  { label: 'Абай', text: `Жасымда ғылым бар деп ескермедім,\nПайдасын көре тұра тексермедім.\nАсылын алтын менен күмістің де,\nЕрте айтса ата-анам, сенбедім.` },
  { label: 'Мағжан', text: `Шолпан ай,\nШолпан ай,\nЖарқырайды, жарқырайды,\nАлыстан қарайды.\nЖер бетіне нұр шашады,\nАспанда сайрайды.` },
  { label: 'Сәкен', text: `Ұш, тұлпарым, ұш, асау,\nҰш еркін жел сияқты!\nЖер бетімен шаптырмай,\nАспанда жүр айдай ды!` },
];

function LocalEngineMode({ workTitle }: { workTitle?: string }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<EngineResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lines = text.split('\n').filter(l => l.trim()).length;
    if (!text.trim() || lines < 2) { setResult(null); return; }
    setLoading(true);
    const timer = setTimeout(() => { setResult(runEngine(text)); setLoading(false); }, 500);
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
              ? `«${workTitle}» шығармасының мәтінін қойыңыз — 12 бөлімді талдау автоматты шығады`
              : 'Өлең мәтінін теріңіз немесе қойыңыз — жанр, идея, ұйқас, бейнелеу құралдары анықталады'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/25 text-xs">Үлгі:</span>
          {EXAMPLES.map(ex => (
            <button key={ex.label} onClick={() => setText(ex.text)}
              className="px-3 py-1.5 rounded-lg bg-white/8 hover:bg-amber-500/20 hover:text-amber-300 text-white/60 text-xs font-medium border border-white/8 hover:border-amber-500/30 transition-colors">
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status note */}
      <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
        <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-300/80 leading-relaxed">
          {workTitle
            ? `«${workTitle}» шығармасының дайын талдауы базада жоқ. Мәтінін қойсаңыз — 12 бөлімді автоматты талдау орындалады.`
            : 'Дайын талдау жоқ. Өлең мәтінін теріңіз — жергілікті анализ жүйесі нәтиже береді.'}
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
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3 text-white/30 text-xs">
            {loading && (
              <span className="flex items-center gap-1.5 text-violet-400">
                <span className="w-3 h-3 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" />
                Талдануда...
              </span>
            )}
            {!loading && text && (
              <span>
                {text.split('\n').filter(l => l.trim()).length} жол ·{' '}
                {text.trim().split(/\s+/).filter(Boolean).length} сөз
              </span>
            )}
          </div>
          {text && (
            <button onClick={() => { setText(''); setResult(null); }}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/8 transition-colors">
              <RotateCcw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <EngineResultView result={result} workTitle={workTitle} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty placeholder */}
      {!text.trim() && (
        <div className="text-center py-12 text-white/20">
          <Shapes size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">Өлең мәтінін теріңіз — 12 бөлімді нәтиже автоматты шығады</p>
          <div className="mt-4 grid grid-cols-3 gap-2 max-w-sm mx-auto">
            {['Автор', 'Жанр', 'Тақырып', 'Идея', 'Кейіпкерлер', 'Ұйқас', 'Бейнелеу', 'Тәрбие', 'Қорытынды'].map(s => (
              <div key={s} className="px-2 py-1 rounded-lg bg-white/3 border border-white/5 text-white/20 text-xs text-center">{s}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── AUTO-DETECT mode (from analysisExamples sampleText) ─────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function ExampleAutoMode({ workSlug, workTitle }: { workSlug: string; workTitle?: string }) {
  const example = useMemo(
    () => analysisExamples.find(e => e.slug === workSlug || e.slug === workSlug.replace(/-/g, '_')),
    [workSlug],
  );

  const result = useMemo(() => {
    if (!example?.sampleText) return null;
    return runEngine(String(example.sampleText));
  }, [example]);

  if (!example) return <LocalEngineMode workTitle={workTitle} />;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <Sparkles size={13} className="text-amber-400" />
        </div>
        <span className="text-amber-400 text-sm font-medium">Мысал мәтін бойынша талдау</span>
        <span className="text-white/25 text-xs">— analysis.json-дан</span>
      </div>

      {result && <EngineResultView result={result} workTitle={workTitle} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export default function TabAutoAnalysis({ analysis, workSlug }: Props) {
  // Check if there's a rich example in analysis.json with sampleText
  const hasExample = useMemo(
    () => analysisExamples.some(e => e.slug === workSlug || e.slug === workSlug.replace(/-/g, '_')),
    [workSlug],
  );

  // Mode 1: Full database analysis
  if (analysis) {
    return <FullAnalysisView analysis={analysis} />;
  }

  // Mode 2: Example from analysis.json (auto engine on sampleText)
  if (hasExample) {
    return <ExampleAutoMode workSlug={workSlug} workTitle={workSlug} />;
  }

  // Mode 3: Local engine only
  return <LocalEngineMode workTitle={workSlug} />;
}
