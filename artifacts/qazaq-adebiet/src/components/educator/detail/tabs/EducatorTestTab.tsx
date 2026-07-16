import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import type { Educator } from '@/types/educator';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

function buildQuestions(e: Educator): Question[] {
  const qs: Question[] = [];

  // Birth year
  qs.push({
    question: `${e.fullName} қай жылы дүниеге келді?`,
    options: [
      String(Number(e.birthDate) - 5),
      e.birthDate,
      String(Number(e.birthDate) + 5),
      String(Number(e.birthDate) + 10),
    ],
    correct: 1,
  });

  // Death year
  if (e.deathDate) {
    qs.push({
      question: `${e.fullName} қай жылы дүние салды?`,
      options: [
        String(Number(e.deathDate) - 3),
        String(Number(e.deathDate) + 3),
        e.deathDate,
        String(Number(e.deathDate) - 7),
      ],
      correct: 2,
    });
  }

  // Profession
  qs.push({
    question: `${e.fullName} негізгі мамандығы қандай?`,
    options: [e.profession[0], 'Дəрігер', 'Əкімші', 'Сарбаз'],
    correct: 0,
  });

  // Scientific field
  qs.push({
    question: `${e.fullName} ғылымның қай саласында еңбек сіңірді?`,
    options: [
      'Физика',
      e.scientificField.split(',')[0].trim(),
      'Химия',
      'Математика',
    ],
    correct: 1,
  });

  // Birth place
  qs.push({
    question: `${e.fullName} туған жері қайда?`,
    options: [
      'Алматы облысы',
      'Шымкент',
      e.birthPlace.split(',')[0].trim(),
      'Астана',
    ],
    correct: 2,
  });

  // Book (if any)
  if (e.books.length > 0) {
    qs.push({
      question: `${e.fullName}-дың «${e.books[0].title}» еңбегі қай жылы жарияланды?`,
      options: [
        String(Number(e.books[0].year) - 5),
        String(Number(e.books[0].year) + 5),
        String(Number(e.books[0].year) - 2),
        e.books[0].year,
      ],
      correct: 3,
    });
  }

  // Century
  qs.push({
    question: `${e.fullName} қай ғасырда өмір сүрді?`,
    options: ['XVII ғасыр', 'XVIII ғасыр', `${e.century} ғасыр`, 'XXII ғасыр'],
    correct: 2,
  });

  return qs.slice(0, 7);
}

export default function EducatorTestTab({ educator: e }: { educator: Educator }) {
  const questions = useMemo(() => buildQuestions(e), [e.slug]);
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const score = answers.filter((a, i) => a === questions[i].correct).length;

  const handleAnswer = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  };

  const reset = () => {
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
  };

  const allAnswered = answers.every((a) => a !== null);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-violet-400" />
          <h3 className="text-white font-semibold">{e.fullName} туралы тест</h3>
        </div>
        <span className="text-white/40 text-sm">{questions.length} сұрақ</span>
      </div>

      {questions.map((q, qi) => (
        <div key={qi} className="glass-panel rounded-2xl border border-white/8 p-5">
          <p className="text-white font-medium mb-4">
            <span className="text-violet-400 mr-2">{qi + 1}.</span>
            {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              const isCorrect = oi === q.correct;
              let btnClass = 'border-white/10 text-white/70 hover:border-violet-500/40 hover:bg-violet-500/8';
              if (submitted) {
                if (isCorrect) btnClass = 'border-green-500/60 bg-green-500/15 text-green-300';
                else if (selected && !isCorrect) btnClass = 'border-red-500/60 bg-red-500/15 text-red-300';
                else btnClass = 'border-white/6 text-white/30';
              } else if (selected) {
                btnClass = 'border-violet-500/60 bg-violet-500/20 text-violet-200';
              }

              return (
                <button
                  key={oi}
                  onClick={() => handleAnswer(qi, oi)}
                  disabled={submitted}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${btnClass}`}
                >
                  <span className="text-white/40 mr-2">{String.fromCharCode(65 + oi)}.</span>
                  {opt}
                  {submitted && isCorrect && <CheckCircle2 className="inline w-4 h-4 text-green-400 ml-2" />}
                  {submitted && selected && !isCorrect && <XCircle className="inline w-4 h-4 text-red-400 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Submit / Result */}
      <AnimatePresence>
        {!submitted ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            disabled={!allAnswered}
            onClick={() => setSubmitted(true)}
            className="w-full py-3.5 rounded-2xl font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-violet-600 hover:bg-violet-500 text-white"
          >
            Тексеру
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl border border-white/10 p-6 text-center space-y-4"
          >
            <p className="text-4xl font-bold font-serif text-white">
              {score}/{questions.length}
            </p>
            <p className="text-white/60">
              {score === questions.length
                ? '🎉 Тамаша! Барлық жауап дұрыс!'
                : score >= Math.ceil(questions.length / 2)
                ? '👍 Жақсы нəтиже!'
                : '📚 Биографияны қайта оқып шығыңыз'}
            </p>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-teal-500 transition-all duration-700"
                style={{ width: `${(score / questions.length) * 100}%` }}
              />
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 text-white/70 hover:text-white text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Қайталау
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
