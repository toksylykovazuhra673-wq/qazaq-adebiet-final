import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';
import type { BiSheshen } from '@/types/bi';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

function buildQuestions(bi: BiSheshen): Question[] {
  const qs: Question[] = [];

  qs.push({
    question: `${bi.fullName} қай ғасырда өмір сүрді?`,
    options: [bi.century + ' ғасыр', 'XX ғасыр', 'XI ғасыр', 'IX ғасыр'],
    correct: 0,
  });

  qs.push({
    question: `${bi.fullName} қай жерде туылды?`,
    options: [bi.birthPlace, 'Алматы', 'Ташкент', 'Самарқанд'],
    correct: 0,
  });

  qs.push({
    question: `${bi.fullName} қай руға жатады?`,
    options: [bi.tribe, 'Найман', 'Қыпшақ', 'Арғын'].filter((v, i, arr) => arr.indexOf(v) === i),
    correct: 0,
  });

  if (bi.profession.length > 0) {
    qs.push({
      question: `${bi.fullName} қандай қызмет атқарды?`,
      options: [bi.profession[0], 'Дәрігер', 'Суретші', 'Сазгер'],
      correct: 0,
    });
  }

  qs.push({
    question: `${bi.fullName} тарихи дәуірі қайсы?`,
    options: [bi.historicalPeriod, 'Монғол дәуірі', 'Қытай дәуірі', 'Орыс алдындағы дәуір'].filter((v, i, arr) => arr.indexOf(v) === i),
    correct: 0,
  });

  return qs.slice(0, 5).map(q => {
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    const newCorrect = shuffled.indexOf(q.options[q.correct]);
    return { question: q.question, options: shuffled, correct: newCorrect };
  });
}

export default function BiTestTab({ bi }: { bi: BiSheshen }) {
  const questions = useMemo(() => buildQuestions(bi), [bi.slug]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const score = answers.filter(Boolean).length;

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.correct;
    setTimeout(() => {
      const newAnswers = [...answers, correct];
      setAnswers(newAnswers);
      if (current + 1 >= questions.length) setFinished(true);
      else { setCurrent(c => c + 1); setSelected(null); }
    }, 900);
  };

  const reset = () => { setCurrent(0); setSelected(null); setAnswers([]); setFinished(false); };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-10 text-center max-w-lg mx-auto">
        <Trophy className={`w-16 h-16 mx-auto mb-4 ${pct >= 60 ? 'text-amber-400' : 'text-white/30'}`} />
        <h2 className="text-3xl font-serif text-white font-bold mb-2">{score}/{questions.length}</h2>
        <p className="text-white/60 mb-1">{pct >= 80 ? 'Өте жақсы! 🎉' : pct >= 60 ? 'Жақсы нәтиже!' : 'Тағы бір рет тырысыңыз!'}</p>
        <div className="w-full bg-white/10 rounded-full h-2 my-6">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-amber-500" />
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 transition-colors mx-auto">
          <RefreshCw className="w-4 h-4" /> Қайта тапсыру
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-white/50 text-sm">{current + 1}/{questions.length}</span>
        <div className="flex-1 bg-white/10 rounded-full h-1.5">
          <motion.div animate={{ width: `${((current) / questions.length) * 100}%` }} className="h-1.5 rounded-full bg-teal-500" />
        </div>
        <span className="text-emerald-400 text-sm">{score} дұрыс</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel rounded-2xl p-7 mb-5">
            <p className="text-white text-lg font-serif leading-relaxed">{q.question}</p>
          </div>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let cls = 'border border-white/10 bg-white/4 text-white/80 hover:bg-white/8 hover:border-teal-500/40 hover:text-white';
              if (selected !== null) {
                if (i === q.correct) cls = 'border-emerald-500 bg-emerald-500/15 text-emerald-300';
                else if (i === selected) cls = 'border-red-500 bg-red-500/15 text-red-300';
                else cls = 'border-white/5 bg-white/2 text-white/40';
              }
              return (
                <button key={i} onClick={() => pick(i)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all ${cls} ${selected !== null ? 'cursor-default' : 'cursor-pointer'}`}>
                  <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-sm font-medium shrink-0">
                    {selected !== null && i === q.correct ? <CheckCircle2 className="w-4 h-4" /> : selected === i && i !== q.correct ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
