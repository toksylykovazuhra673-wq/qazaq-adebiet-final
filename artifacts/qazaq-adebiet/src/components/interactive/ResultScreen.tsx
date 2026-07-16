import { motion } from 'framer-motion';
import { Trophy, RotateCcw, ChevronRight, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import type { Task } from '@/types/task';

interface Props {
  task: Task;
  correct: boolean;
  timeSpent: number;
  earnedPoints: number;
  onRetry: () => void;
  onNext: () => void;
  onClose: () => void;
}

function fmt(s: number) { return s < 60 ? `${s}с` : `${Math.floor(s / 60)}м ${s % 60}с`; }

export default function ResultScreen({ task, correct, timeSpent, earnedPoints, onRetry, onNext, onClose }: Props) {
  const grade = correct ? (timeSpent <= 15 ? 'Өте жақсы! ⚡' : 'Дұрыс! ✅') : 'Қате. Қайталап көр ❌';
  const scoreColor = correct ? 'text-emerald-400' : 'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-4"
    >
      {/* icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="mx-auto mb-6"
      >
        {correct
          ? <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto">
              <Trophy size={36} className="text-emerald-400" />
            </div>
          : <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center mx-auto">
              <XCircle size={36} className="text-red-400" />
            </div>
        }
      </motion.div>

      <h2 className={`text-2xl font-bold mb-2 ${scoreColor}`}>{grade}</h2>
      <p className="text-white/50 text-sm mb-6">{task.title}</p>

      {/* stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: <Clock size={16} />, label: 'Уақыт', value: fmt(timeSpent), color: 'text-blue-400' },
          { icon: <Zap size={16} />, label: 'Жиналды', value: `+${earnedPoints} XP`, color: 'text-amber-400' },
          { icon: correct ? <CheckCircle size={16} /> : <XCircle size={16} />, label: 'Нәтиже', value: correct ? '100%' : '0%', color: scoreColor },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className={`flex items-center justify-center mb-1 ${s.color}`}>{s.icon}</div>
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-white/30 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* explanation */}
      {task.explanation && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-left mb-6">
          <p className="text-blue-300 text-xs font-semibold mb-1">💡 Түсіндірме</p>
          <p className="text-white/70 text-sm leading-relaxed">{task.explanation}</p>
        </div>
      )}

      {/* actions */}
      <div className="flex gap-3">
        <button onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all">
          <RotateCcw size={15} />
          Қайталау
        </button>
        <button onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-semibold transition-all shadow-lg">
          Келесі
          <ChevronRight size={15} />
        </button>
      </div>
      <button onClick={onClose} className="mt-3 text-white/30 text-sm hover:text-white/60 transition-colors">
        Тізімге оралу
      </button>
    </motion.div>
  );
}
