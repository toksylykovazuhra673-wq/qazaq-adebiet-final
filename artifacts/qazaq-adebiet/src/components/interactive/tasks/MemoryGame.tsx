import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { Task, MemoryPair } from '@/types/task';

interface Props { task: Task; onSubmit: (correct: boolean) => void }

interface Card { id: string; text: string; pairId: number; side: 'front' | 'back' }

export default function MemoryGame({ task, onSubmit }: Props) {
  const pairs = task.options as MemoryPair[];

  const [cards] = useState<Card[]>(() => {
    const all: Card[] = [];
    pairs.forEach((p, i) => {
      all.push({ id: `f${i}`, text: p.front, pairId: i, side: 'front' });
      all.push({ id: `b${i}`, text: p.back,  pairId: i, side: 'back' });
    });
    return all.sort(() => Math.random() - 0.5);
  });

  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Card | null>(null);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);

  const flip = (card: Card) => {
    if (locked || matched.has(card.id) || flipped.has(card.id) || done) return;
    const newFlipped = new Set(flipped);
    newFlipped.add(card.id);
    setFlipped(newFlipped);

    if (!selected) {
      setSelected(card);
      return;
    }

    if (selected.id === card.id) return;

    setLocked(true);
    if (selected.pairId === card.pairId && selected.side !== card.side) {
      // match!
      setTimeout(() => {
        setMatched((prev) => new Set([...prev, selected.id, card.id]));
        setFlipped((prev) => { const n = new Set(prev); n.delete(selected.id); n.delete(card.id); return n; });
        setSelected(null);
        setLocked(false);
      }, 600);
    } else {
      // no match
      setTimeout(() => {
        setFlipped((prev) => { const n = new Set(prev); n.delete(selected.id); n.delete(card.id); return n; });
        setSelected(null);
        setLocked(false);
      }, 900);
    }
  };

  useEffect(() => {
    if (matched.size === cards.length && cards.length > 0 && !done) {
      setDone(true);
      setTimeout(() => onSubmit(true), 800);
    }
  }, [matched.size, cards.length, done, onSubmit]);

  const isFlipped = (card: Card) => flipped.has(card.id) || matched.has(card.id);
  const isMatched = (card: Card) => matched.has(card.id);

  return (
    <div>
      <p className="text-white/80 text-base leading-relaxed mb-2">{task.question}</p>
      <div className="flex justify-between text-xs text-white/40 mb-4">
        <span>Жұп: {matched.size / 2} / {pairs.length}</span>
        <span>{done ? '✅ Бітті!' : '🃏 Ойнаңыз'}</span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => flip(card)}
            whileHover={!isFlipped(card) ? { scale: 1.05 } : {}}
            whileTap={!isFlipped(card) ? { scale: 0.95 } : {}}
            className={`aspect-[3/4] rounded-xl border flex items-center justify-center text-center p-2 text-xs font-semibold leading-tight transition-all duration-300 ${
              isMatched(card)
                ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 cursor-default'
                : isFlipped(card)
                ? 'border-violet-500/50 bg-violet-500/20 text-white cursor-default'
                : 'border-white/15 bg-white/8 text-transparent hover:border-white/30 cursor-pointer'
            }`}
          >
            {isFlipped(card) || isMatched(card) ? card.text : '?'}
          </motion.button>
        ))}
      </div>

      {done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 flex items-center justify-center gap-3 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30"
        >
          <Trophy size={24} className="text-amber-400" />
          <div>
            <div className="text-white font-bold">Керемет! Барлық жұп табылды!</div>
            <div className="text-white/50 text-sm">Барлық {pairs.length} жұп дұрыс сәйкестендірілді</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
