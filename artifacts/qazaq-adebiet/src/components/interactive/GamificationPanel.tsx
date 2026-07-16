import { motion } from 'framer-motion';
import { Zap, Trophy, Flame } from 'lucide-react';
import type { Achievement } from '@/types/task';

interface Props {
  xp: number;
  level: number;
  xpInLevel: number;
  xpPerLevel: number;
  streak: number;
  achievements: (Achievement & { unlocked: boolean })[];
}

export default function GamificationPanel({ xp, level, xpInLevel, xpPerLevel, streak, achievements }: Props) {
  const pct = Math.round((xpInLevel / xpPerLevel) * 100);
  const unlocked = achievements.filter((a) => a.unlocked);

  return (
    <div className="space-y-4">
      {/* level card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {level}
          </div>
          <div>
            <div className="text-white font-semibold">{level}-деңгей</div>
            <div className="text-white/40 text-xs">{xp} XP жиналды</div>
          </div>
        </div>

        <div className="mb-1 flex justify-between text-xs text-white/40">
          <span>{xpInLevel} XP</span>
          <span>{xpPerLevel} XP</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
          />
        </div>
        <p className="text-white/30 text-xs mt-2 text-right">{xpPerLevel - xpInLevel} XP қалды</p>
      </div>

      {/* streak */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
        <Flame size={20} className="text-orange-400" />
        <div>
          <div className="text-white font-semibold">{streak} күн</div>
          <div className="text-white/40 text-xs">Белсенді жолақ</div>
        </div>
      </div>

      {/* achievements */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} className="text-amber-400" />
          <span className="text-white font-semibold text-sm">Жетістіктер</span>
          <span className="ml-auto text-white/40 text-xs">{unlocked.length}/{achievements.length}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl p-3 border transition-all ${
                a.unlocked
                  ? 'border-amber-500/30 bg-amber-500/10'
                  : 'border-white/5 bg-white/3 opacity-40 grayscale'
              }`}
            >
              <div className="text-xl mb-1">{a.icon}</div>
              <div className="text-white text-xs font-semibold leading-tight">{a.title}</div>
              <div className="text-white/40 text-xs leading-snug mt-0.5 line-clamp-2">{a.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
