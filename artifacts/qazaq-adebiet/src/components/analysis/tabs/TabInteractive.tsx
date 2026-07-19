import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, Check, RefreshCw, ChevronRight } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

// ── Matching exercise ─────────────────────────────────────────
function MatchingGame({ items }: { items: { left: string; right: string }[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const rights = [...items.map(i => i.right)].sort(() => Math.random() - 0.5);
  const [shuffled] = useState(rights);

  const allMatched = Object.keys(matched).length === items.length;

  const handleLeft = (left: string) => {
    if (matched[left]) return;
    setSelected(s => s === `L:${left}` ? null : `L:${left}`);
  };
  const handleRight = (right: string) => {
    if (Object.values(matched).includes(right)) return;
    if (selected?.startsWith('L:')) {
      const left = selected.slice(2);
      const correct = items.find(i => i.left === left)?.right;
      if (correct === right) {
        setMatched(m => ({ ...m, [left]: right }));
      }
      setSelected(null);
    } else {
      setSelected(s => s === `R:${right}` ? null : `R:${right}`);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Үзінді</p>
          {items.map(({ left }) => (
            <button
              key={left}
              onClick={() => handleLeft(left)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${
                matched[left]
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : selected === `L:${left}`
                  ? 'bg-violet-500/25 border-violet-500/50 text-violet-200'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              {matched[left] && <Check size={12} className="inline mr-1 text-emerald-400" />}
              {left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Бейнелеу құралы</p>
          {shuffled.map(right => {
            const isMatched = Object.values(matched).includes(right);
            return (
              <button
                key={right}
                onClick={() => handleRight(right)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${
                  isMatched
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : selected === `R:${right}`
                    ? 'bg-violet-500/25 border-violet-500/50 text-violet-200'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {isMatched && <Check size={12} className="inline mr-1 text-emerald-400" />}
                {right}
              </button>
            );
          })}
        </div>
      </div>
      {allMatched && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-emerald-400 text-sm font-medium">
          🎉 Барлығы дұрыс сәйкестендірілді!
        </motion.div>
      )}
    </div>
  );
}

// ── Fill in blank exercise ────────────────────────────────────
function FillInBlanks({ items }: { items: { text: string; answer: string }[] }) {
  const [inputs, setInputs] = useState<string[]>(items.map(() => ''));
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const parts = item.text.split('___');
        const isCorrect = inputs[i].trim().toLowerCase() === item.answer.toLowerCase();
        return (
          <div key={i} className={`rounded-xl p-4 border transition-colors ${
            checked ? (isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30') : 'bg-white/[0.03] border-white/8'
          }`}>
            <p className="text-white/80 text-sm flex flex-wrap items-center gap-1">
              {parts[0]}
              <input
                value={inputs[i]}
                onChange={e => setInputs(arr => { const a = [...arr]; a[i] = e.target.value; return a; })}
                placeholder="..."
                className="inline-block bg-white/10 border border-white/20 rounded px-2 py-0.5 text-white text-sm w-28 focus:outline-none focus:border-violet-500/50"
              />
              {parts[1]}
            </p>
            {checked && !isCorrect && (
              <p className="text-red-400 text-xs mt-1">Дұрыс жауап: <strong>{item.answer}</strong></p>
            )}
          </div>
        );
      })}
      <button
        onClick={() => setChecked(true)}
        className="px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-medium text-sm transition-colors"
      >
        Тексеру
      </button>
    </div>
  );
}

// ── Composition ordering ──────────────────────────────────────
function CompositionOrder({ items }: { items: { order: number; key: string; name: string }[] }) {
  const [order, setOrder] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [checked, setChecked] = useState(false);

  const isCorrect = order.every((item, i) => item.order === i + 1);

  const move = (idx: number, dir: -1 | 1) => {
    const arr = [...order];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    setOrder(arr);
    setChecked(false);
  };

  return (
    <div className="space-y-2">
      {order.map((item, i) => (
        <div key={item.key} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
          checked && isCorrect ? 'bg-emerald-500/15 border-emerald-500/30' : 'bg-white/5 border-white/8'
        }`}>
          <span className="text-white/30 w-5 text-sm">{i + 1}</span>
          <span className="flex-1 text-white/80 text-sm">{item.name}</span>
          <div className="flex gap-1">
            <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 rounded text-white/30 hover:text-white disabled:opacity-20 transition-colors rotate-[-90deg]">
              <ChevronRight size={14} />
            </button>
            <button onClick={() => move(i, 1)} disabled={i === order.length - 1} className="p-1 rounded text-white/30 hover:text-white disabled:opacity-20 transition-colors rotate-90">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setChecked(true)}
          className="px-5 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-medium transition-colors"
        >
          Тексеру
        </button>
        <button
          onClick={() => { setOrder([...items].sort(() => Math.random() - 0.5)); setChecked(false); }}
          className="p-2 rounded-xl bg-white/8 hover:bg-white/12 text-white/50 transition-colors"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      {checked && (
        <p className={`text-sm font-medium ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
          {isCorrect ? '✓ Дұрыс тәртіп!' : '✗ Тәртіп дұрыс емес, қайтадан байқап көр'}
        </p>
      )}
    </div>
  );
}

// ── Main Tab ──────────────────────────────────────────────────
const SECTIONS = [
  { id: 'matching',   label: 'Сәйкестендіру (Matching)' },
  { id: 'fillblanks', label: 'Бос орынды толтыр' },
  { id: 'ordering',   label: 'Композицияны орналастыр' },
  { id: 'characters', label: 'Кейіпкерлерді сәйкестендір' },
];

export default function TabInteractive({ analysis }: { analysis: Analysis }) {
  const [section, setSection] = useState('matching');
  const ex = analysis.interactiveExercises;

  if (!ex) {
    return (
      <div className="text-center py-16 text-white/40">
        <Puzzle size={40} className="mx-auto mb-4 opacity-30" />
        <p>Интерактив тапсырмалар қол жетімсіз.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section picker */}
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              section === s.id
                ? 'bg-violet-500 text-white'
                : 'bg-white/8 text-white/60 hover:bg-white/12'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {section === 'matching' && <MatchingGame items={ex.matching} />}
            {section === 'fillblanks' && <FillInBlanks items={ex.fillInBlanks} />}
            {section === 'ordering' && <CompositionOrder items={ex.compositionOrdering} />}
            {section === 'characters' && (
              <MatchingGame items={ex.characterMatching.map(c => ({ left: c.character, right: c.role }))} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
