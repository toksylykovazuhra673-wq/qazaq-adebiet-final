import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import type { Poet } from '@/types/poet';
import { ALL_POETS } from '@/hooks/usePoets';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

function generateQuestions(poet: Poet): Question[] {
  const questions: Question[] = [];
  
  // Q1: Name
  const otherPoets = ALL_POETS.filter(p => p.id !== poet.id).map(p => p.fullName);
  const nameOptions = [poet.fullName];
  while (nameOptions.length < 4 && otherPoets.length > 0) {
    const randomIdx = Math.floor(Math.random() * otherPoets.length);
    nameOptions.push(otherPoets.splice(randomIdx, 1)[0]);
  }
  // Shuffle
  nameOptions.sort(() => Math.random() - 0.5);
  
  questions.push({
    id: 1,
    question: "Ақынның толық аты кім?",
    options: nameOptions,
    correctAnswer: poet.fullName
  });

  // Q2: Birth year
  const birthYearMatch = poet.birthDate.match(/\d{4}/);
  const birthYear = birthYearMatch ? birthYearMatch[0] : null;
  if (birthYear) {
    const yearInt = parseInt(birthYear);
    const yearOptions = [
      birthYear,
      (yearInt - 10).toString(),
      (yearInt + 15).toString(),
      (yearInt - 25).toString()
    ].sort(() => Math.random() - 0.5);
    
    questions.push({
      id: 2,
      question: "Ақын қай жылы туылды?",
      options: yearOptions,
      correctAnswer: birthYear
    });
  }

  // Q3: Literary Movement
  const movements = ["Алаш", "Зар заман", "Халық ақындары", "Қазіргі поэзия", "Ағартушылық"];
  const movOptions = [poet.literaryMovement];
  movements.filter(m => m !== poet.literaryMovement).slice(0, 3).forEach(m => movOptions.push(m));
  movOptions.sort(() => Math.random() - 0.5);
  
  questions.push({
    id: 3,
    question: "Ақынның әдеби бағыты қандай?",
    options: movOptions,
    correctAnswer: poet.literaryMovement
  });

  // Q4: Works
  if (poet.works && poet.works.length > 0) {
    const mainWork = poet.works[0].title;
    const fakeWorks = ["Қан мен тер", "Көшпелілер", "Абай жолы", "Ұлпан", "Ақиқат пен аңыз"];
    const workOptions = [mainWork, ...fakeWorks.slice(0, 3)].sort(() => Math.random() - 0.5);
    
    questions.push({
      id: 4,
      question: "Төмендегілердің қайсысы ақынның шығармасы?",
      options: workOptions,
      correctAnswer: mainWork
    });
  } else {
    // Fallback if no works
    const profOptions = [poet.profession[0] || "Ақын", "Мүсінші", "Архитектор", "Дәрігер"].sort(() => Math.random() - 0.5);
    questions.push({
      id: 4,
      question: "Ақын қандай кәсіп иесі болды?",
      options: profOptions,
      correctAnswer: poet.profession[0] || "Ақын"
    });
  }

  // Q5: Fact
  const trueFact = poet.interestingFacts?.[0] || `${poet.shortName} өте дарынды тұлға болған.`;
  const falseFacts = [
    `${poet.shortName} өмірінің соңына дейін шет елде өмір сүрді.`,
    `Ол қазақ әдебиетіне ешқандай үлес қосқан жоқ.`,
    `Шығармалары ешқашан басып шығарылмаған.`
  ];
  const factOptions = [trueFact, ...falseFacts].sort(() => Math.random() - 0.5);
  
  questions.push({
    id: 5,
    question: "Ақын туралы дұрыс тұжырымды таңдаңыз:",
    options: factOptions,
    correctAnswer: trueFact
  });

  return questions.slice(0, 5);
}

export default function TestTab({ poet }: { poet: Poet }) {
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questions = useMemo(() => generateQuestions(poet), [poet]);

  const handleStart = () => {
    setStarted(true);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsFinished(false);
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return; // Prevent multiple clicks
    setSelectedAnswer(option);
    
    if (option === questions[currentQIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(c => c + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  if (!started) {
    return (
      <div className="glass-panel rounded-3xl p-12 flex flex-col items-center text-center max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mb-6">
          <Brain className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-3xl font-serif text-white mb-4">Біліміңізді тексеріңіз</h3>
        <p className="text-white/70 mb-8 text-lg">
          {poet.fullName} туралы біліміңізді 5 сұрақтан тұратын интерактивті тест арқылы тексеріп көріңіз.
        </p>
        <button
          onClick={handleStart}
          className="bg-primary hover:bg-primary/90 text-white text-lg font-medium px-8 py-3.5 rounded-xl transition-colors shadow-[0_0_30px_rgba(139,92,246,0.4)]"
        >
          Тестті бастау
        </button>
      </div>
    );
  }

  if (isFinished) {
    const percentage = (score / questions.length) * 100;
    let message = "Тамаша!";
    if (percentage < 50) message = "Қайталаңыз";
    else if (percentage < 80) message = "Жақсы!";

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-3xl p-12 flex flex-col items-center text-center max-w-lg mx-auto"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(245,158,11,0.4)]">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-3xl font-serif text-white mb-2">{message}</h3>
        <p className="text-white/60 text-lg mb-8">
          Сіз {questions.length} сұрақтың {score}-іне дұрыс жауап бердіңіз.
        </p>
        <button
          onClick={handleStart}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-3.5 rounded-xl transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Қайтадан ойнау
        </button>
      </motion.div>
    );
  }

  const q = questions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-panel rounded-3xl p-8 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-medium text-white/50 uppercase tracking-widest">
            Сұрақ {currentQIndex + 1} / {questions.length}
          </span>
          <div className="flex gap-1.5">
            {questions.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-10 h-1.5 rounded-full transition-colors ${
                  idx === currentQIndex ? 'bg-primary' : 
                  idx < currentQIndex ? 'bg-primary/40' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-serif text-white mb-10 leading-snug">
          {q.question}
        </h3>

        <div className="space-y-4">
          {q.options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = opt === q.correctAnswer;
            const showStatus = selectedAnswer !== null;
            
            let btnClass = "bg-white/5 border-white/10 text-white/80 hover:bg-white/10";
            if (showStatus) {
              if (isCorrect) btnClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-100";
              else if (isSelected && !isCorrect) btnClass = "bg-red-500/20 border-red-500/50 text-red-100";
              else btnClass = "bg-white/5 border-transparent text-white/40 opacity-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={showStatus}
                className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group ${btnClass}`}
              >
                <span className="text-lg">{opt}</span>
                {showStatus && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                {showStatus && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-400" />}
                {!showStatus && (
                  <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-white/40" />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex justify-end"
            >
              <button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-xl transition-colors shadow-lg"
              >
                Келесі сұрақ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
