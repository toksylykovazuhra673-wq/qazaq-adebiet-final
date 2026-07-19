import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  BookOpen, Headphones, FileText, Trophy, Zap, Flame, Star,
  ChevronRight, TrendingUp, Check, Clock, Target,
} from 'lucide-react';
import type { StudentProfile, ReadingRecord, TestRecord } from '@/types/student';
import type { UserProgress } from '@/types/task';
import booksData from '@/data/books.json';

interface Props {
  profile: StudentProfile;
  progress: UserProgress;
  level: number;
  xpInLevel: number;
  xpPerLevel: number;
  readingRecords: ReadingRecord[];
  testRecords: TestRecord[];
  onTabChange: (tab: string) => void;
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
};

function StatCard({ icon: Icon, label, value, color, onClick }:
  { icon: React.ElementType; label: string; value: string | number; color: string; onClick?: () => void }) {
  return (
    <motion.div variants={CARD_VARIANTS}
      onClick={onClick}
      className={`bg-white/4 border border-white/8 rounded-2xl p-5 flex flex-col gap-3
        ${onClick ? 'cursor-pointer hover:bg-white/6 transition-colors' : ''}`}>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

export default function CabDashboard({
  profile, progress, level, xpInLevel, xpPerLevel,
  readingRecords, testRecords, onTabChange,
}: Props) {
  const [, navigate] = useLocation();

  const booksStarted = readingRecords.length;
  const booksRead    = readingRecords.filter(r => r.textProgress >= 90).length;
  const testsPassed  = testRecords.filter(t => t.score >= 70).length;
  const totalPoints  = testRecords.reduce((s, t) => s + t.points, 0);
  const xpPct        = Math.min(100, Math.round((xpInLevel / xpPerLevel) * 100));
  const streak       = progress.streak ?? 0;

  // Last reading book
  const lastRead = readingRecords[0];
  const lastBook = lastRead
    ? (booksData as Record<string, unknown>[]).find(b => (b as {id: string}).id === lastRead.bookSlug)
    : null;

  // Recent tests
  const recentTests = testRecords.slice(0, 3);

  const quickActions = [
    {
      icon: BookOpen,
      label: 'Кітап оқу',
      desc: lastBook ? `«${(lastBook as {title: string}).title}» - ${Math.round(lastRead!.textProgress)}%` : 'Кітапхана',
      color: 'from-violet-600 to-purple-500',
      action: () => lastBook ? navigate(`/reader/${(lastBook as {id: string}).id}`) : onTabChange('library'),
    },
    {
      icon: FileText,
      label: 'PDF ашу',
      desc: 'PDF кітапхана',
      color: 'from-blue-600 to-cyan-500',
      action: () => onTabChange('library'),
    },
    {
      icon: Headphones,
      label: 'Аудио тыңдау',
      desc: 'Дауыстап оқу',
      color: 'from-indigo-600 to-blue-500',
      action: () => onTabChange('library'),
    },
    {
      icon: Target,
      label: 'Тест тапсыру',
      desc: `${testRecords.length} тест тапсырылды`,
      color: 'from-emerald-600 to-green-500',
      action: () => navigate('/interactive'),
    },
    {
      icon: TrendingUp,
      label: 'Талдауды көру',
      desc: 'Шығарма талдауы',
      color: 'from-orange-600 to-amber-500',
      action: () => navigate('/analysis'),
    },
    {
      icon: Trophy,
      label: 'Олимпиада',
      desc: 'Жарысқа қатысу',
      color: 'from-rose-600 to-pink-500',
      action: () => onTabChange('olympiad'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* XP Level banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-violet-600/20 to-purple-600/10 border border-violet-500/20 rounded-2xl p-6">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Сәлеметсің бе,</div>
            <h2 className="text-2xl font-bold text-white">{profile.name}! 👋</h2>
            <div className="text-gray-400 text-sm">{profile.grade} · {profile.school}</div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30">
              <Zap size={14} className="text-violet-400" />
              <span className="text-violet-300 font-bold">{progress.xp} XP</span>
            </div>
            <div className="text-xs text-gray-500 mt-1.5">{level}-деңгей</div>
          </div>
        </div>
        {/* XP Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{xpInLevel} XP</span>
            <span>{xpPerLevel} XP — {level + 1}-деңгей</span>
          </div>
          <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
        {streak > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-orange-400 text-xs font-medium">
            <Flame size={13} /> {streak} күн қатарынан белсенді
          </div>
        )}
      </motion.div>

      {/* Stats grid */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Статистика</h3>
        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={BookOpen} label="Кітап оқылды"  value={booksRead}    color="from-violet-600 to-purple-500" onClick={() => onTabChange('library')} />
          <StatCard icon={Star}     label="Басталды"      value={booksStarted} color="from-blue-600 to-cyan-500"   onClick={() => onTabChange('library')} />
          <StatCard icon={Check}    label="Тест өтілді"   value={testsPassed}  color="from-emerald-600 to-green-500" onClick={() => onTabChange('tests')} />
          <StatCard icon={Trophy}   label="Жиналған ұпай" value={totalPoints}  color="from-amber-500 to-yellow-400" onClick={() => onTabChange('progress')} />
        </motion.div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Жылдам кіру</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((qa, i) => (
            <motion.button
              key={qa.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={qa.action}
              className="flex items-start gap-3 bg-white/4 hover:bg-white/7 border border-white/8
                hover:border-white/15 rounded-2xl p-4 text-left transition-all group">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${qa.color} flex items-center justify-center flex-shrink-0`}>
                <qa.icon size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-medium">{qa.label}</div>
                <div className="text-gray-500 text-xs truncate mt-0.5">{qa.desc}</div>
              </div>
              <ChevronRight size={14} className="text-gray-600 ml-auto flex-shrink-0 group-hover:text-gray-400 transition-colors mt-1" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {recentTests.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Соңғы тесттер</h3>
            <button onClick={() => onTabChange('tests')} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Барлығы →
            </button>
          </div>
          <div className="space-y-2">
            {recentTests.map((t, i) => (
              <motion.div
                key={t.taskId}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  t.score >= 80 ? 'bg-emerald-500/15 text-emerald-400' :
                  t.score >= 50 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
                }`}>
                  {t.score >= 80 ? <Check size={14} /> : <Clock size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm">{t.taskTitle}</div>
                  <div className="text-gray-500 text-xs">{t.points} ұпай</div>
                </div>
                <div className={`text-sm font-bold ${
                  t.score >= 80 ? 'text-emerald-400' :
                  t.score >= 50 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {Math.round(t.score)}%
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
