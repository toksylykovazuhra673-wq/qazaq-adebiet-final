import { motion } from 'framer-motion';
import { Clock, Star, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import type { Task, TaskResult } from '@/types/task';

const TYPE_META: Record<string, { label: string; icon: string; color: string }> = {
  single_choice: { label: 'Тест',           icon: '🔘', color: 'from-violet-500/20 to-purple-500/20 border-violet-500/25' },
  multi_choice:  { label: 'Көп жауап',      icon: '☑️', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/25' },
  true_false:    { label: 'Дұрыс/Бұрыс',   icon: '✅', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/25' },
  matching:      { label: 'Сәйкестендіру', icon: '🔗', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/25' },
  drag_drop:     { label: 'Drag & Drop',    icon: '🖱️', color: 'from-rose-500/20 to-pink-500/20 border-rose-500/25' },
  fill_blank:    { label: 'Бос орын',       icon: '✏️', color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/25' },
  ordering:      { label: 'Реттеу',         icon: '📋', color: 'from-teal-500/20 to-cyan-500/20 border-teal-500/25' },
  memory_game:   { label: 'Жады ойыны',     icon: '🃏', color: 'from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/25' },
  wheel_fortune: { label: 'Дөңгелек',       icon: '🎡', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/25' },
  who_said:      { label: 'Кімнің сөзі',    icon: '💬', color: 'from-sky-500/20 to-blue-500/20 border-sky-500/25' },
};

const DIFF_META: Record<string, { label: string; color: string }> = {
  easy:   { label: 'Оңай', color: 'text-emerald-400' },
  medium: { label: 'Орта', color: 'text-amber-400' },
  hard:   { label: 'Қиын', color: 'text-rose-400' },
};

interface Props {
  task: Task;
  result?: TaskResult;
  index?: number;
  onClick: () => void;
}

export default function TaskCard({ task, result, index = 0, onClick }: Props) {
  const meta = TYPE_META[task.type] ?? { label: task.type, icon: '📝', color: 'from-white/10 to-white/5 border-white/10' };
  const diff = DIFF_META[task.difficulty] ?? DIFF_META.medium;
  const done = !!result;

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className={`w-full text-left rounded-2xl border bg-gradient-to-br ${meta.color} backdrop-blur-sm p-5 hover:scale-[1.02] transition-all duration-200 group relative overflow-hidden`}
    >
      {/* done badge */}
      {done && (
        <div className="absolute top-3 right-3">
          <CheckCircle size={16} className="text-emerald-400" />
        </div>
      )}

      {/* type + score row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{meta.icon}</span>
        <span className="text-white/50 text-xs font-medium">{meta.label}</span>
        {done && (
          <span className="ml-auto text-emerald-400 text-xs font-semibold">{result?.score}%</span>
        )}
      </div>

      <h3 className="text-white font-semibold text-sm leading-snug mb-1 pr-6 line-clamp-2">
        {task.title}
      </h3>
      <p className="text-white/40 text-xs mb-4 line-clamp-1">{task.author}</p>

      {/* footer */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1 text-white/40">
          <Clock size={11} />
          {task.timeLimit === 0 ? '∞' : `${task.timeLimit}с`}
        </div>
        <div className="flex items-center gap-1 text-amber-400">
          <Zap size={11} />
          {task.points} XP
        </div>
        <div className={`flex items-center gap-1 ${diff.color}`}>
          <Star size={11} />
          {diff.label}
        </div>
        <ChevronRight size={14} className="ml-auto text-white/25 group-hover:text-white/60 transition-colors" />
      </div>
    </motion.button>
  );
}
