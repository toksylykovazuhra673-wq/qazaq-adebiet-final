import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  Check, X, Clock, Trophy, Target, ChevronRight,
  BarChart3, Zap, BookOpen,
} from 'lucide-react';
import type { TestRecord } from '@/types/student';
import tasksData from '@/data/tasks.json';

interface Props {
  testRecords: TestRecord[];
}

type TestFilter = 'all' | 'passed' | 'failed';

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 80 ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
    score >= 50 ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'      :
                  'bg-red-500/15 border-red-500/30 text-red-400';
  return (
    <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${cls}`}>
      {Math.round(score)}%
    </span>
  );
}

function fmtTime(sec: number) {
  if (sec < 60) return `${sec}с`;
  return `${Math.floor(sec / 60)}м ${sec % 60}с`;
}

export default function CabTests({ testRecords }: Props) {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<TestFilter>('all');

  const totalTasks  = (tasksData as unknown[]).length;
  const passed      = testRecords.filter(t => t.score >= 70).length;
  const totalPoints = testRecords.reduce((s, t) => s + t.points, 0);
  const avgScore    = testRecords.length
    ? Math.round(testRecords.reduce((s, t) => s + t.score, 0) / testRecords.length)
    : 0;

  const filtered = testRecords.filter(t => {
    if (filter === 'passed') return t.score >= 70;
    if (filter === 'failed') return t.score < 70;
    return true;
  });

  const FILTERS = [
    { id: 'all'    as TestFilter, label: 'Барлығы'  },
    { id: 'passed' as TestFilter, label: '✓ Өтті'   },
    { id: 'failed' as TestFilter, label: '✗ Өтпеді' },
  ];

  // Upcoming tasks (not in testRecords)
  const completedIds = new Set(testRecords.map(r => r.taskId));
  const upcomingTasks = (tasksData as Array<{ id: string; question: string; difficulty: string; points: number }>)
    .filter(t => !completedIds.has(t.id))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Target,   label: 'Барлық тапсырма', value: totalTasks,           color: 'from-violet-600 to-purple-500' },
          { icon: Check,    label: 'Тапсырылды',       value: testRecords.length,   color: 'from-emerald-600 to-green-500' },
          { icon: Trophy,   label: 'Өтті (≥70%)',      value: passed,               color: 'from-amber-500 to-yellow-400'  },
          { icon: Zap,      label: 'Жиналған ұпай',    value: totalPoints,          color: 'from-blue-600 to-cyan-500'     },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}
            className="bg-white/4 border border-white/8 rounded-2xl p-4 flex flex-col gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
              <s.icon size={15} className="text-white" />
            </div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-[11px] text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Avg score bar */}
      {testRecords.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white/4 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-white">
              <BarChart3 size={15} className="text-violet-400" />
              Орташа нәтиже
            </div>
            <ScoreBadge score={avgScore} />
          </div>
          <div className="h-3 bg-white/6 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                avgScore >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                avgScore >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400'  :
                                 'bg-gradient-to-r from-red-500 to-rose-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${avgScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}

      {/* Completed tests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Тапсырылған тесттер</h3>
          <div className="flex gap-1.5">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  filter === f.id
                    ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                    : 'bg-white/4 border border-white/8 text-gray-500'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white/3 border border-white/6 rounded-2xl text-gray-600">
            <Target size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Тест нәтижесі жоқ</p>
            <button
              onClick={() => navigate('/interactive')}
              className="mt-4 px-4 py-2 bg-violet-500/15 border border-violet-500/30 text-violet-400
                rounded-xl text-xs hover:bg-violet-500/25 transition-all">
              Тест тапсыру →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((t, i) => (
              <motion.div
                key={t.taskId}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}
                className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  t.score >= 80 ? 'bg-emerald-500/15 text-emerald-400' :
                  t.score >= 50 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
                }`}>
                  {t.score >= 70 ? <Check size={14} /> : <X size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm">{t.taskTitle}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-gray-600 text-xs">
                      <Clock size={10} />{fmtTime(t.time)}
                    </span>
                    <span className="text-gray-700">·</span>
                    <span className="flex items-center gap-1 text-gray-600 text-xs">
                      <Zap size={10} />{t.points} XP
                    </span>
                  </div>
                </div>
                <ScoreBadge score={t.score} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming / recommended */}
      {upcomingTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Келесі тесттер</h3>
            <button
              onClick={() => navigate('/interactive')}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Барлық тапсырмалар →
            </button>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 bg-white/3 border border-white/6 rounded-xl px-4 py-3
                  hover:bg-white/5 hover:border-white/10 transition-all group cursor-pointer"
                onClick={() => navigate('/interactive')}>
                <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={14} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-400 text-sm truncate">{t.question.slice(0, 60)}…</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      t.difficulty === 'easy'   ? 'bg-green-500/10 text-green-500'  :
                      t.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-500'  :
                                                  'bg-red-500/10 text-red-400'
                    }`}>{t.difficulty}</span>
                    <span className="text-gray-600 text-xs">{t.points} XP</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={() => navigate('/interactive')}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600
          hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm
          flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20">
        <Target size={16} />
        Тапсырмалар зертханасына өту
        <ChevronRight size={15} />
      </motion.button>
    </div>
  );
}
