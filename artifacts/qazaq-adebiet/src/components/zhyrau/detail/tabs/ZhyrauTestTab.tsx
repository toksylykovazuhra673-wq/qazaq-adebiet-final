import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import type { Zhyrau } from '@/types/zhyrau';
import { ALL_ZHYRAU } from '@/hooks/useZhyrau';

interface Question { text: string; options: string[]; correct: number; }

function buildQuestions(zhyrau: Zhyrau): Question[] {
  const others = ALL_ZHYRAU.filter(z => z.slug !== zhyrau.slug);
  const pick = (arr: string[], n: number) => arr.sort(() => Math.random() - 0.5).slice(0, n);

  const q1options = [zhyrau.fullName, ...pick(others.map(z => z.fullName), 3)].sort(() => Math.random() - 0.5);
  const q2options = [zhyrau.century + ' ғасыр', ...pick(others.map(z => z.century + ' ғасыр'), 3)].filter((v, i, a) => a.indexOf(v) === i).sort(() => Math.random() - 0.5);
  const q3options = [zhyrau.historicalPeriod, ...pick(others.map(z => z.historicalPeriod).filter(p => p !== zhyrau.historicalPeriod), 3)].sort(() => Math.random() - 0.5);
  const q4tolgau = zhyrau.tolgau[0]?.title ?? zhyrau.fullName + ' толғауы';
  const q4options = [q4tolgau, ...pick(others.flatMap(z => z.tolgau.map(t => t.title)).filter(Boolean), 3)].sort(() => Math.random() - 0.5);
  const fact = zhyrau.interestingFacts[0] ?? (zhyrau.fullName + ' — ұлы жырау.');
  const q5options = [fact, 'Ол саяхатшы болды.', 'Ол Мәскеуде туылды.', 'Ол XIX ғасырда дүние салды.'].sort(() => Math.random() - 0.5);

  return [
    { text: 'Жыраудың толық аты кім?', options: q1options, correct: q1options.indexOf(zhyrau.fullName) },
    { text: 'Жырау қай ғасырда өмір сүрді?', options: q2options.slice(0,4), correct: q2options.slice(0,4).indexOf(zhyrau.century + ' ғасыр') },
    { text: 'Жыраудың тарихи дәуірі қайсы?', options: q3options, correct: q3options.indexOf(zhyrau.historicalPeriod) },
    { text: 'Жыраудың атақты толғауы?', options: q4options, correct: q4options.indexOf(q4tolgau) },
    { text: 'Жырау туралы дұрыс тұжырым?', options: q5options, correct: q5options.indexOf(fact) },
  ];
}

export default function ZhyrauTestTab({ zhyrau }: { zhyrau: Zhyrau }) {
  const questions = useMemo(() => buildQuestions(zhyrau), [zhyrau.slug]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 < questions.length) { setCurrent(c => c + 1); setSelected(null); }
    else setFinished(true);
  };

  const reset = () => { setCurrent(0); setSelected(null); setScore(0); setFinished(false); };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <div className="text-6xl font-serif font-bold text-white mb-2">{score}/{questions.length}</div>
        <p className="text-white/60 mb-2">{pct}% дұрыс жауап</p>
        <p className="text-lg text-white mb-8">{pct >= 80 ? 'Тамаша! Жырауды жақсы білесіз.' : pct >= 50 ? 'Жаман емес, бірақ тереңірек зерттеңіз.' : 'Жыраудың өмірін толығырақ оқыңыз.'}</p>
        <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors">
          <RefreshCw className="w-4 h-4" /> Қайтадан ойнау
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-white/60 text-sm">{current + 1} / {questions.length} сұрақ</span>
        <span className="text-accent text-sm font-medium">{score} ұпай</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full mb-8">
        <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${((current) / questions.length) * 100}%` }} />
      </div>

      <h3 className="text-xl font-serif text-white mb-6">{q.text}</h3>

      <div className="flex flex-col gap-3 mb-8">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correct;
          let cls = 'p-4 rounded-xl border text-left transition-colors text-sm ';
          if (selected === null) cls += 'bg-white/5 border-white/10 hover:bg-white/10 text-white cursor-pointer';
          else if (isCorrect) cls += 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
          else if (isSelected) cls += 'bg-red-500/20 border-red-500/50 text-red-400';
          else cls += 'bg-white/5 border-white/5 text-white/40';

          return (
            <button key={i} onClick={() => handleAnswer(i)} className={cls} disabled={selected !== null}>
              <div className="flex items-center gap-3">
                {selected !== null && isCorrect && <CheckCircle className="w-5 h-5 shrink-0" />}
                {selected !== null && isSelected && !isCorrect && <XCircle className="w-5 h-5 shrink-0" />}
                <span>{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button onClick={handleNext} className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium">
          {current + 1 < questions.length ? 'Келесі сұрақ' : 'Нәтижені көру'}
        </button>
      )}
    </div>
  );
}
