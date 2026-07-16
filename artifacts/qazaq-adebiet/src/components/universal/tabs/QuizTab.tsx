import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import type { UniversalAuthor, QuizQuestion } from '@/types/universal-author';
import { CATEGORY_ACCENT, CATEGORY_COLORS } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

// Generate questions automatically from author data
function generateQuestions(author: UniversalAuthor): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  const a = author;

  qs.push({
    id: 1,
    question: `${a.fullName} қай жылы дүниеге келді?`,
    options: [a.birthDate, String(Number(a.birthDate) - 5), String(Number(a.birthDate) + 3), String(Number(a.birthDate) - 10)].sort(() => Math.random() - 0.5),
    correctIndex: 0,
    explanation: `${a.fullName} ${a.birthDate} жылы ${a.birthPlace} жерінде дүниеге келді.`,
  });

  if (a.birthPlace) {
    qs.push({
      id: 2,
      question: `${a.fullName} қай жерде туылды?`,
      options: [a.birthPlace, 'Алматы', 'Астана', 'Шымкент'],
      correctIndex: 0,
      explanation: `Туған жері — ${a.birthPlace}.`,
    });
  }

  if (a.profession?.length) {
    qs.push({
      id: 3,
      question: `${a.fullName} кім болған?`,
      options: [a.profession[0], 'Суретші', 'Архитектор', 'Дәрігер'],
      correctIndex: 0,
      explanation: `${a.fullName} — ${a.profession.join(', ')}.`,
    });
  }

  if (a.deathDate) {
    qs.push({
      id: 4,
      question: `${a.fullName} қай жылы дүние салды?`,
      options: [a.deathDate, String(Number(a.deathDate) - 3), String(Number(a.deathDate) + 5), String(Number(a.deathDate) - 8)].sort(() => Math.random() - 0.5),
      correctIndex: 0,
      explanation: `${a.fullName} ${a.deathDate} жылы дүниеден өтті.`,
    });
  }

  if (a.literaryMovement) {
    qs.push({
      id: 5,
      question: `${a.fullName} қай әдеби бағытты ұстанды?`,
      options: [a.literaryMovement, 'Романтизм', 'Модернизм', 'Сюрреализм'],
      correctIndex: 0,
      explanation: `${a.fullName} — ${a.literaryMovement} бағытының өкілі.`,
    });
  }

  if (a.quotes?.length) {
    const q = a.quotes[0];
    qs.push({
      id: 6,
      question: `«${q.text.slice(0, 40)}...» — бұл кімнің сөзі?`,
      options: [a.fullName, 'Абай Құнанбайұлы', 'Мұхтар Әуезов', 'Жамбыл Жабаев'],
      correctIndex: 0,
      explanation: `Бұл — ${a.fullName}нің дәйексөзі.`,
    });
  }

  if (a.interestingFacts?.length) {
    qs.push({
      id: 7,
      question: `${a.fullName} туралы қайсысы дұрыс?`,
      options: [a.interestingFacts[0].slice(0, 60), 'Ол Ресейде туылды.', 'Ол 20 жасында қайтыс болды.', 'Ол еш шығарма жазбады.'],
      correctIndex: 0,
      explanation: a.interestingFacts[0],
    });
  }

  return qs.slice(0, 7);
}

export default function QuizTab({ author }: Props) {
  const accent = CATEGORY_ACCENT[author.category];
  const gradient = CATEGORY_COLORS[author.category];
  const questions = useMemo(() => generateQuestions(author), [author]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[current];

  const choose = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const next = () => {
    if (selected === null || !q) return;
    const correct = q.options[selected] === q.options[q.correctIndex] ||
      // handle shuffled options: correct if chosen text matches correct text
      selected === q.options.findIndex(o => o === q.options[q.correctIndex]);

    // Actually just check if the text at selected index matches correct text
    const correctText = q.options[q.correctIndex];
    const isCorrect = q.options[selected] === correctText;

    const nextAnswers = [...answers, isCorrect];
    setAnswers(nextAnswers);

    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  };

  const score = answers.filter(Boolean).length;

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${gradient} mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white shadow-xl`}>
          {pct}%
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">Викторина аяқталды!</h2>
        <p className="text-gray-400 mb-2">{questions.length} сұрақтан {score} дұрыс жауап</p>
        <p className={`text-lg font-semibold ${accent} mb-8`}>
          {pct >= 80 ? '🏆 Тамаша нәтиже!' : pct >= 50 ? '👍 Жақсы тырыстыңыз!' : '📚 Көбірек оқыңыз!'}
        </p>
        <div className="flex justify-center gap-2 mb-8">
          {answers.map((a, i) => a
            ? <CheckCircle2 key={i} size={22} className="text-green-400" />
            : <XCircle key={i} size={22} className="text-red-400" />
          )}
        </div>
        <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors">
          <RefreshCw size={16} />Қайта бастау
        </button>
      </motion.div>
    );
  }

  if (!q) return null;

  const correctText = q.options[q.correctIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold ${accent}`}>Викторина</h2>
        <span className="text-gray-400 text-sm">{current + 1} / {questions.length}</span>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-white/10 rounded-full mb-8">
        <motion.div className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          animate={{ width: `${((current) / questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-1">
              <Trophy size={18} className={`${accent} flex-shrink-0 mt-0.5`} />
              <h3 className="text-white font-medium text-base">{q.question}</h3>
            </div>
          </div>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let cls = 'bg-white/3 border-white/8 text-gray-200 hover:bg-white/8';
              if (selected !== null) {
                if (opt === correctText) cls = 'bg-green-500/15 border-green-500/40 text-green-200';
                else if (idx === selected && opt !== correctText) cls = 'bg-red-500/15 border-red-500/40 text-red-200';
                else cls = 'bg-white/2 border-white/5 text-gray-500';
              }
              return (
                <button key={idx} onClick={() => choose(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${cls} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}>
                  <span className="font-medium text-gray-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <p className="text-gray-300 text-sm">{q.explanation}</p>
              </div>
              <button onClick={next}
                className={`w-full py-3 rounded-xl bg-gradient-to-r ${gradient} text-white font-semibold hover:opacity-90 transition-opacity`}>
                {current + 1 < questions.length ? 'Келесі сұрақ →' : 'Нәтижені қарау'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
