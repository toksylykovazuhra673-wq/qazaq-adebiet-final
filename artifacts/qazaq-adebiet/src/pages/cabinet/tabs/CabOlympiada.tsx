import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  Trophy, Star, Clock, Users, Zap, ChevronRight,
  BookOpen, Target, Award, Calendar, Flame,
} from 'lucide-react';
import type { UserProgress } from '@/types/task';

interface Props {
  progress: UserProgress;
  level: number;
  completedCount: number;
}

interface OlympiadRound {
  id: string;
  title: string;
  subtitle: string;
  status: 'upcoming' | 'active' | 'completed';
  date: string;
  topic: string;
  participants: number;
  questions: number;
  timeMin: number;
  minLevel: number;
  points: number;
  color: string;
  icon: React.ElementType;
}

const ROUNDS: OlympiadRound[] = [
  {
    id: 'abai',
    title: 'Абай Олимпиадасы',
    subtitle: 'Абай Құнанбайұлы шығармашылығы',
    status: 'active',
    date: '2026 · Тамыз',
    topic: 'Абай шығармалары',
    participants: 1247,
    questions: 30,
    timeMin: 45,
    minLevel: 1,
    points: 500,
    color: 'from-violet-600 to-purple-500',
    icon: BookOpen,
  },
  {
    id: 'auezov',
    title: 'Мұхтар Әуезов',
    subtitle: '«Абай жолы» романы бойынша',
    status: 'upcoming',
    date: '2026 · Қыркүйек',
    topic: 'Абай жолы',
    participants: 892,
    questions: 25,
    timeMin: 40,
    minLevel: 2,
    points: 400,
    color: 'from-blue-600 to-indigo-500',
    icon: Trophy,
  },
  {
    id: 'kazpoetry',
    title: 'Қазақ Поэзиясы',
    subtitle: 'Магжан, Ахмет, Міржақып',
    status: 'upcoming',
    date: '2026 · Қазан',
    topic: 'ХХ ғасыр поэзиясы',
    participants: 634,
    questions: 20,
    timeMin: 30,
    minLevel: 3,
    points: 350,
    color: 'from-emerald-600 to-teal-500',
    icon: Star,
  },
  {
    id: 'bi',
    title: 'Би-Шешендер',
    subtitle: 'Тұрағыл, Төле би, Қазыбек',
    status: 'upcoming',
    date: '2026 · Қараша',
    topic: 'Шешендік сөздер',
    participants: 412,
    questions: 15,
    timeMin: 25,
    minLevel: 2,
    points: 300,
    color: 'from-amber-500 to-orange-400',
    icon: Award,
  },
];

const STATUS_META = {
  active:    { label: '🔴 Тіркелу ашық',  cls: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  upcoming:  { label: '🔵 Жақында',        cls: 'bg-blue-500/15 border-blue-500/30 text-blue-400'          },
  completed: { label: '✓ Аяқталды',        cls: 'bg-gray-500/15 border-gray-500/30 text-gray-500'          },
};

// LocalStorage key for olympiad registrations
const OLY_KEY = 'student_olympiad_registrations';
function loadRegistrations(): Set<string> {
  try {
    const raw = localStorage.getItem(OLY_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}
function saveRegistration(id: string) {
  const regs = loadRegistrations();
  regs.add(id);
  localStorage.setItem(OLY_KEY, JSON.stringify([...regs]));
}

export default function CabOlympiada({ progress, level, completedCount }: Props) {
  const [, navigate] = useLocation();
  const [registered, setRegistered] = useState<Set<string>>(loadRegistrations);
  const [loading, setLoading] = useState<string | null>(null);

  const totalPoints = progress.xp ?? 0;

  const handleRegister = async (round: OlympiadRound) => {
    if (level < round.minLevel) return;
    setLoading(round.id);
    await new Promise(r => setTimeout(r, 800)); // brief loading effect
    saveRegistration(round.id);
    setRegistered(prev => new Set([...prev, round.id]));
    setLoading(null);
  };

  const handleStart = (round: OlympiadRound) => {
    navigate('/interactive');
  };

  // Rating position (simulated from XP)
  const simulatedRank = Math.max(1, Math.floor(1000 - (totalPoints / 5)));

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-amber-500/15 to-orange-600/10
          border border-amber-500/20 rounded-2xl p-6">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
              bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-medium mb-3">
              <Trophy size={12} /> Олимпиада мезгілі — 2026
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Қазақ Әдебиеті Олимпиадасы</h2>
            <p className="text-gray-400 text-sm">Білімді сынап көр, лидерлер тізіміне кір</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-extrabold text-amber-400">#{simulatedRank}</div>
            <div className="text-gray-500 text-xs">ұпайлар бойынша</div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: 'Деңгей',  value: `${level}-ші`,        icon: Zap },
            { label: 'Тест',    value: completedCount,        icon: Target },
            { label: 'XP',      value: totalPoints,           icon: Flame },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
              <s.icon size={13} className="text-amber-400 mx-auto mb-1" />
              <div className="text-white text-base font-bold">{s.value}</div>
              <div className="text-gray-600 text-[10px]">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Rounds */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Олимпиада турлары</h3>
        <div className="space-y-4">
          {ROUNDS.map((round, i) => {
            const sm = STATUS_META[round.status];
            const Icon = round.icon;
            const isReg = registered.has(round.id);
            const canJoin = level >= round.minLevel;
            const isLoading = loading === round.id;

            return (
              <motion.div
                key={round.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  round.status === 'active'
                    ? 'bg-white/5 border-white/12 hover:border-white/18'
                    : 'bg-white/3 border-white/8'
                }`}>
                {/* Top stripe */}
                <div className={`h-1 bg-gradient-to-r ${round.color}`} />

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${round.color}
                      flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon size={20} className="text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="text-white font-bold text-base">{round.title}</h3>
                          <p className="text-gray-400 text-sm">{round.subtitle}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${sm.cls}`}>
                          {sm.label}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Calendar size={10} />{round.date}</span>
                        <span className="flex items-center gap-1"><Target size={10} />{round.questions} сұрақ</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{round.timeMin} мин</span>
                        <span className="flex items-center gap-1"><Users size={10} />{round.participants.toLocaleString()} қатысушы</span>
                        <span className="flex items-center gap-1 text-amber-400/70"><Trophy size={10} />{round.points} XP</span>
                      </div>

                      {/* Min level */}
                      {!canJoin && (
                        <div className="mt-2 text-[11px] text-orange-400/70">
                          ⚠️ Қосылу үшін {round.minLevel}-деңгей қажет (сізде: {level})
                        </div>
                      )}

                      {/* Action */}
                      <div className="mt-4">
                        {isReg ? (
                          <button
                            onClick={() => handleStart(round)}
                            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold
                              bg-gradient-to-r ${round.color} text-white flex items-center gap-2
                              hover:opacity-90 transition-all shadow-lg`}>
                            <Zap size={14} />
                            Тапсыруды бастау
                            <ChevronRight size={14} />
                          </button>
                        ) : round.status === 'active' && canJoin ? (
                          <button
                            onClick={() => handleRegister(round)}
                            disabled={isLoading}
                            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold
                              border border-white/15 text-white bg-white/6 hover:bg-white/10
                              flex items-center gap-2 transition-all ${isLoading ? 'opacity-60' : ''}`}>
                            {isLoading ? (
                              <><span className="animate-spin">⏳</span> Тіркелуде…</>
                            ) : (
                              <><Trophy size={14} />Тіркелу<ChevronRight size={14} /></>
                            )}
                          </button>
                        ) : (
                          <div className="text-gray-700 text-xs">
                            {round.status === 'upcoming' ? 'Тіркелу күні жақын…' : ''}
                            {!canJoin && round.status === 'active' ? 'Деңгейді арттыр →' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard teaser */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Star size={15} className="text-amber-400" /> Үздіктер тізімі (симуляция)
        </h3>
        <div className="space-y-2.5">
          {[
            { rank: 1, name: 'Айгерім С.',   xp: 3450, medal: '🥇' },
            { rank: 2, name: 'Бекзат Н.',    xp: 2980, medal: '🥈' },
            { rank: 3, name: 'Дана М.',       xp: 2710, medal: '🥉' },
            { rank: simulatedRank, name: 'Сен', xp: totalPoints, medal: '⭐', isMe: true },
          ].sort((a, b) => a.rank - b.rank).map(entry => (
            <div key={entry.rank}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                (entry as { isMe?: boolean }).isMe
                  ? 'bg-violet-500/10 border border-violet-500/20'
                  : 'bg-white/3'
              }`}>
              <span className="text-lg w-6 text-center">{entry.medal}</span>
              <span className={`flex-1 text-sm ${(entry as { isMe?: boolean }).isMe ? 'text-violet-300 font-semibold' : 'text-gray-400'}`}>
                {entry.name}
              </span>
              <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                <Zap size={10} />{entry.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
