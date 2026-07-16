import { motion } from 'framer-motion';
import { Zap, Trophy, Target, Users, Star, TrendingUp } from 'lucide-react';

interface Props {
  totalTasks: number;
  completedCount: number;
  xp: number;
  level: number;
  onStartRandom: () => void;
}

export default function HeroSection({ totalTasks, completedCount, xp, level, onStartRandom }: Props) {
  const pct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const stats = [
    { icon: <Target size={18} />, label: 'Барлық тапсырма', value: totalTasks, color: 'text-violet-400' },
    { icon: <Trophy size={18} />, label: 'Орындалған', value: completedCount, color: 'text-emerald-400' },
    { icon: <Star size={18} />, label: 'XP жиналды', value: xp, color: 'text-amber-400' },
    { icon: <TrendingUp size={18} />, label: 'Деңгей', value: level, color: 'text-blue-400' },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/80 via-slate-900/90 to-slate-950/80 backdrop-blur-sm p-8 md:p-10 mb-8">
      {/* background orbs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          {/* left */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25 mb-4"
            >
              <Zap size={12} className="text-violet-400" />
              <span className="text-violet-300 text-xs font-medium">Interactive Learning Lab</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight"
            >
              Интерактивті
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                Оқу зертханасы
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/55 mb-6 leading-relaxed max-w-lg"
            >
              Қазақ әдебиеті бойынша 30 түрлі тапсырма, геймификация жүйесі және прогресс бақылау.
              Тест, жады ойыны, дөңгелек және басқалары — барлығы офлайн режимде.
            </motion.p>

            {/* progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
                <span>Жалпы прогресс</span>
                <span>{completedCount} / {totalTasks} ({pct}%)</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                />
              </div>
            </div>

            <button
              onClick={onStartRandom}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-violet-900/40 hover:scale-105"
            >
              <Zap size={18} />
              Кездейсоқ тапсырма
            </button>
          </div>

          {/* right — stats */}
          <div className="grid grid-cols-2 gap-3 md:w-64">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-2xl bg-white/5 border border-white/8 p-4"
              >
                <div className={`mb-2 ${s.color}`}>{s.icon}</div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-white/40 text-xs">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
