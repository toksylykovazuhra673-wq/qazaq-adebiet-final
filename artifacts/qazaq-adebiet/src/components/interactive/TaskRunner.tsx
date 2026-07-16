import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb } from 'lucide-react';
import type { Task } from '@/types/task';
import Timer from './Timer';
import ResultScreen from './ResultScreen';
import SingleChoiceTask from './tasks/SingleChoiceTask';
import MultiChoiceTask  from './tasks/MultiChoiceTask';
import TrueFalseTask    from './tasks/TrueFalseTask';
import MatchingTask     from './tasks/MatchingTask';
import FillBlankTask    from './tasks/FillBlankTask';
import OrderingTask     from './tasks/OrderingTask';
import DragDropTask     from './tasks/DragDropTask';
import MemoryGame       from './tasks/MemoryGame';
import WheelOfFortune   from './tasks/WheelOfFortune';

interface Props {
  task: Task | null;
  onClose: () => void;
  onComplete: (correct: boolean, timeSpent: number, earnedPoints: number) => void;
  onNext: () => void;
}

const DIFF_LABELS: Record<string, string> = { easy: 'Оңай', medium: 'Орта', hard: 'Қиын' };
const DIFF_COLORS: Record<string, string> = { easy: 'text-emerald-400', medium: 'text-amber-400', hard: 'text-rose-400' };

function TaskBody({ task, onSubmit }: { task: Task; onSubmit: (c: boolean) => void }) {
  switch (task.type) {
    case 'single_choice':
    case 'who_said':
    case 'wheel_fortune':
      return task.type === 'wheel_fortune'
        ? <WheelOfFortune task={task} onSubmit={onSubmit} />
        : <SingleChoiceTask task={task} onSubmit={onSubmit} />;
    case 'multi_choice': return <MultiChoiceTask task={task} onSubmit={onSubmit} />;
    case 'true_false':   return <TrueFalseTask   task={task} onSubmit={onSubmit} />;
    case 'matching':     return <MatchingTask     task={task} onSubmit={onSubmit} />;
    case 'fill_blank':   return <FillBlankTask    task={task} onSubmit={onSubmit} />;
    case 'ordering':     return <OrderingTask     task={task} onSubmit={onSubmit} />;
    case 'drag_drop':    return <DragDropTask     task={task} onSubmit={onSubmit} />;
    case 'memory_game':  return <MemoryGame       task={task} onSubmit={onSubmit} />;
    default:             return <SingleChoiceTask task={task} onSubmit={onSubmit} />;
  }
}

export default function TaskRunner({ task, onClose, onComplete, onNext }: Props) {
  const [phase, setPhase] = useState<'task' | 'result'>('task');
  const [correct, setCorrect] = useState(false);
  const [earned, setEarned] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [key, setKey] = useState(0); // remount on retry

  const startRef = useRef(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!task) return;
    setPhase('task');
    setShowHint(false);
    setKey((k) => k + 1);
    startRef.current = Date.now();
    setElapsed(0);
    intervalRef.current = setInterval(() => setElapsed(Math.round((Date.now() - startRef.current) / 1000)), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [task]);

  const handleSubmit = useCallback((isCorrect: boolean) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const spent = Math.round((Date.now() - startRef.current) / 1000);
    setElapsed(spent);
    setCorrect(isCorrect);

    const pts = isCorrect
      ? task!.points + (spent <= 15 ? Math.round(task!.points * 0.5) : 0)
      : 0;
    setEarned(pts);
    setPhase('result');
    onComplete(isCorrect, spent, pts);
  }, [task, onComplete]);

  const handleExpire = useCallback(() => handleSubmit(false), [handleSubmit]);

  const handleRetry = () => {
    startRef.current = Date.now();
    setElapsed(0);
    setShowHint(false);
    setPhase('task');
    setKey((k) => k + 1);
    intervalRef.current = setInterval(() => setElapsed(Math.round((Date.now() - startRef.current) / 1000)), 1000);
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl"
        >
          {/* header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/8 bg-slate-900/90 backdrop-blur-sm rounded-t-3xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">{task.title}</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white/40">{task.author}</span>
                  <span className={DIFF_COLORS[task.difficulty]}>· {DIFF_LABELS[task.difficulty]}</span>
                  <span className="text-amber-400">· {task.points} XP</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {phase === 'task' && task.timeLimit > 0 && (
                <Timer seconds={task.timeLimit} onExpire={handleExpire} />
              )}
              {phase === 'task' && task.timeLimit === 0 && (
                <Timer seconds={0} onExpire={() => {}} />
              )}
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* body */}
          <div className="p-6">
            {phase === 'task' && (
              <div key={key}>
                <TaskBody task={task} onSubmit={handleSubmit} />

                {/* hint */}
                {task.hint && (
                  <div className="mt-5">
                    {!showHint
                      ? <button onClick={() => setShowHint(true)}
                          className="flex items-center gap-2 text-amber-400/70 hover:text-amber-400 text-sm transition-colors">
                          <Lightbulb size={14} /> Кеңес алу (-50%)
                        </button>
                      : <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
                          <Lightbulb size={14} className="mt-0.5 flex-shrink-0" />
                          {task.hint}
                        </motion.div>
                    }
                  </div>
                )}
              </div>
            )}

            {phase === 'result' && (
              <ResultScreen
                task={task}
                correct={correct}
                timeSpent={elapsed}
                earnedPoints={earned}
                onRetry={handleRetry}
                onNext={onNext}
                onClose={onClose}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
