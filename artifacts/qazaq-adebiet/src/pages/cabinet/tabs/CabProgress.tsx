import { motion } from 'framer-motion';
import {
  Zap, Star, Flame, Trophy, TrendingUp, Award,
  BookOpen, Check, Target, Lock,
} from 'lucide-react';
import type { UserProgress } from '@/types/task';

interface Props {
  progress: UserProgress;
  level: number;
  xpInLevel: number;
  xpPerLevel: number;
  completedCount: number;
  achievements: Array<{
    id: string; title: string; description: string; icon: string; unlocked: boolean;
  }>;
}

function XPRing({ xpInLevel, xpPerLevel, level }: { xpInLevel: number; xpPerLevel: number; level: number }) {
  const pct   = Math.min(100, (xpInLevel / xpPerLevel) * 100);
  const R     = 56;
  const circ  = 2 * Math.PI * R;
  const dash  = circ - (pct / 100) * circ;

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg width="160" height="160" className="rotate-[-90deg]">
        <circle cx={80} cy={80} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
        <circle cx={80} cy={80} r={R} fill="none"
          stroke="url(#xpg)" strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={dash}
          strokeLinecap="round" />
        <defs>
          <linearGradient id="xpg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <Zap size={16} className="text-violet-400 mb-0.5" />
        <div className="text-3xl font-extrabold text-white leading-none">{level}</div>
        <div className="text-xs text-gray-500 mt-0.5">деңгей</div>
        <div className="text-[10px] text-violet-400 mt-1">{Math.round(pct)}%</div>
      </div>
    </div>
  );
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Жаңа оқырман',
  2: 'Кітап сүйгіш',
  3: 'Білім іздеуші',
  4: 'Мәдениет жанашыры',
  5: 'Әдебиет шебері',
  6: 'Ақын жолдасы',
  7: 'Сарапшы оқырман',
  8: 'Қазақ әдебиеті данышпаны',
};

function getLevelTitle(level: number) {
  const keys = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => a - b);
  for (let i = keys.length - 1; i >= 0; i--) {
    if (level >= keys[i]) return LEVEL_TITLES[keys[i]];
  }
  return 'Жаңа оқырман';
}

export default function CabProgress({
  progress, level, xpInLevel, xpPerLevel, completedCount, achievements,
}: Props) {
  const streak    = progress.streak ?? 0;
  const totalXP   = progress.xp ?? 0;
  const unlocked  = achievements.filter(a => a.unlocked).length;

  // Last 7 days streak simulation from streak value
  const today = new Date();
  const days7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const isActive = 6 - i < streak;
    return {
      day: ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб', 'Жс'][d.getDay() === 0 ? 6 : d.getDay() - 1],
      active: isActive,
    };
  });

  const STATS = [
    { icon: Zap,       label: 'Жалпы XP',           value: totalXP,         color: 'text-violet-400' },
    { icon: Check,     label: 'Тапсырма өтілді',     value: completedCount,  color: 'text-emerald-400' },
    { icon: Trophy,    label: 'Жетістіктер',         value: `${unlocked}/${achievements.length}`, color: 'text-amber-400' },
    { icon: Flame,     label: 'Ең ұзақ сериясы',    value: `${streak} күн`, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-8">
      {/* XP ring + title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-violet-600/10 to-purple-600/5 border border-violet-500/20 rounded-2xl p-8 text-center">
        <XPRing xpInLevel={xpInLevel} xpPerLevel={xpPerLevel} level={level} />
        <h2 className="text-xl font-bold text-white mt-4">{getLevelTitle(level)}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {xpInLevel} / {xpPerLevel} XP — Келесі деңгейге {xpPerLevel - xpInLevel} XP жетіспейді
        </p>
        {/* XP bar */}
        <div className="mt-4 h-2 bg-white/8 rounded-full overflow-hidden max-w-xs mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (xpInLevel / xpPerLevel) * 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 * i }}
            className="bg-white/4 border border-white/8 rounded-2xl p-4 text-center">
            <s.icon size={20} className={`${s.color} mx-auto mb-2`} />
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Streak calendar */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Flame size={12} className="text-orange-400" /> Белсенділік (соңғы 7 күн)
        </h3>
        <div className="flex gap-2">
          {days7.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                d.active
                  ? 'bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg shadow-orange-500/20'
                  : 'bg-white/4 border border-white/8'
              }`}>
                {d.active && <Flame size={16} className="text-white" />}
              </div>
              <span className="text-[10px] text-gray-600">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Award size={12} /> Жетістіктер ({unlocked}/{achievements.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach, i) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              className={`flex items-start gap-3 border rounded-2xl p-4 transition-all ${
                ach.unlocked
                  ? 'bg-white/5 border-white/12 hover:bg-white/7'
                  : 'bg-white/2 border-white/5 opacity-50'
              }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                ach.unlocked ? 'bg-white/8' : 'bg-white/4'
              }`}>
                {ach.unlocked ? ach.icon : <Lock size={14} className="text-gray-600" />}
              </div>
              <div>
                <div className={`text-sm font-semibold ${ach.unlocked ? 'text-white' : 'text-gray-600'}`}>
                  {ach.title}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">{ach.description}</div>
                {ach.unlocked && (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full
                    bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
                    <Check size={9} /> Алынды
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Level roadmap */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp size={12} /> Деңгей жолы
        </h3>
        <div className="relative">
          <div className="absolute left-5 top-4 bottom-4 w-px bg-white/8" />
          <div className="space-y-3">
            {Object.entries(LEVEL_TITLES).map(([lvl, title]) => {
              const l = Number(lvl);
              const done = l < level;
              const current = l === level;
              return (
                <div key={lvl} className="flex items-center gap-3 relative">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 z-10 ${
                    done    ? 'bg-violet-500 text-white' :
                    current ? 'bg-violet-500/30 border-2 border-violet-500 text-violet-300' :
                              'bg-white/5 border border-white/10 text-gray-600'
                  }`}>
                    {done ? <Star size={14} className="text-white" /> : l}
                  </div>
                  <div className={`flex-1 ${current ? 'text-white' : done ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="text-sm font-medium">{title}</span>
                    {current && <span className="ml-2 text-[10px] text-violet-400 font-medium">← Қазір</span>}
                  </div>
                  <div className="text-xs text-gray-600">{(l - 1) * xpPerLevel} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
