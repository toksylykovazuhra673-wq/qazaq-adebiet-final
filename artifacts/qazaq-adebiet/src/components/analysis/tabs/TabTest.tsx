import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Check, X, RotateCcw, Trophy } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

type QuestionCount = 10 | 20 | 30;

export default function TabTest({ analysis }: { analysis: Analysis }) {
  const allQuestions = analysis.test ?? [];
  const [count, setCount]       = useState<QuestionCount>(10);
  const [started, setStarted]   = useState(false);
  const [answers, setAnswers]   = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = allQuestions.slice(0, Math.min(count, allQuestions.length));
  const correct = questions.filter((q, i) => answers[i] === q.answer).length;
  const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;

  const reset = () => { setAnswers({}); setSubmitted(false); setStarted(false); };

  if (allQuestions.length === 0) {
    return (
      <div className="text-center py-16 text-white/40">
        <CheckSquare size={40} className="mx-auto mb-4 opacity-30" />
        <p>Тест сұрақтары қол жетімсіз.</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-6">
          <CheckSquare size={36} className="text-violet-400" />
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">Тест</h2>
        <p className="text-white/50 text-sm mb-8">
          «{analysis.title}» бойынша біліміңізді тексеріңіз.
        </p>
        <div className="flex gap-3 justify-center mb-8">
          {([10, 20, 30] as QuestionCount[]).filter(n => n <= allQuestions.length).map(n => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${
                count === n
                  ? 'bg-violet-500 text-white'
                  : 'bg-white/8 text-white/60 hover:bg-white/12'
              }`}
            >
              {n} сұрақ
            </button>
          ))}
        </div>
        <button
          onClick={() => setStarted(true)}
          className="px-8 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-semibold transition-colors"
        >
          Бастау
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center py-12">
        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
          pct >= 70 ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'
        }`}>
          <Trophy size={40} className={pct >= 70 ? 'text-emerald-400' : 'text-red-400'} />
        </div>
        <p className="text-5xl font-bold text-white mb-2">{pct}%</p>
        <p className="text-white/50 mb-1">{correct} / {questions.length} дұрыс жауап</p>
        <p className={`text-sm font-medium mb-8 ${pct >= 70 ? 'text-emerald-400' : 'text-red-400'}`}>
          {pct >= 90 ? 'Өте жақсы! 🏆' : pct >= 70 ? 'Жақсы нәтиже! 👍' : 'Қайтадан оқып шығыңыз 📚'}
        </p>
        {/* Show answers */}
        <div className="text-left space-y-3 mb-8">
          {questions.map((q, i) => {
            const userAns = answers[i];
            const isCorrect = userAns === q.answer;
            return (
              <div key={i} className={`rounded-xl p-3 border text-sm ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <p className="text-white/80 mb-1">{i + 1}. {q.q}</p>
                <p className={`flex items-center gap-1 text-xs ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isCorrect ? <Check size={12} /> : <X size={12} />}
                  {isCorrect ? 'Дұрыс' : `Дұрыс жауап: ${q.options[q.answer]}`}
                </p>
              </div>
            );
          })}
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors mx-auto">
          <RotateCcw size={15} /> Қайтадан
        </button>
      </motion.div>
    );
  }

  const answered = Object.keys(answers).length;
  const progress = (answered / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-violet-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-white/40 text-sm shrink-0">{answered}/{questions.length}</span>
      </div>

      {questions.map((q, qi) => (
        <div key={qi} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <p className="text-white font-medium mb-4 text-sm">
            <span className="text-violet-400 mr-2">{qi + 1}.</span>{q.q}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => !submitted && setAnswers(p => ({ ...p, [qi]: oi }))}
                className={`text-left px-4 py-2.5 rounded-xl text-sm transition-colors border ${
                  answers[qi] === oi
                    ? 'bg-violet-500/25 border-violet-500/50 text-violet-200'
                    : 'bg-white/5 border-white/8 text-white/70 hover:bg-white/10 hover:border-white/15'
                }`}
              >
                <span className="text-white/30 mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-2">
        <button
          onClick={() => setSubmitted(true)}
          disabled={answered < questions.length}
          className="px-8 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors"
        >
          Аяқтау
        </button>
      </div>
    </div>
  );
}
