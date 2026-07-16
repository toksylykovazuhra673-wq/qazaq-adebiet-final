import { useState, useCallback, useMemo } from 'react';
import type { UserProgress, TaskResult, Achievement } from '@/types/task';

const STORAGE_KEY = 'ill_progress';
const XP_PER_LEVEL = 100;

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_task',   title: 'Бірінші қадам',     description: 'Бірінші тапсырманы орында',       icon: '🚀' },
  { id: 'streak_3',     title: 'Жалғасымды',         description: '3 күн қатарынан кір',             icon: '🔥' },
  { id: 'perfect',      title: 'Перфект',             description: '100% нәтиже',                     icon: '⭐' },
  { id: 'fast',         title: 'Жылдам ойшыл',       description: '15 секундта дұрыс жауап',         icon: '⚡' },
  { id: 'tasks_10',     title: '10 тапсырма',         description: '10 тапсырма орында',              icon: '🏅' },
  { id: 'tasks_25',     title: '25 тапсырма',         description: '25 тапсырма орында',              icon: '🥈' },
  { id: 'tasks_50',     title: '50 тапсырма',         description: '50 тапсырма орында',              icon: '🥇' },
  { id: 'level_5',      title: '5-деңгей',            description: '5-деңгейге жет',                  icon: '🎯' },
  { id: 'abai_expert',  title: 'Абай сарапшысы',      description: 'Абай туралы 5 тапсырма орында',   icon: '📚' },
  { id: 'xp_500',       title: '500 XP',              description: '500 XP жина',                     icon: '💎' },
];

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  completedTasks: {},
  achievements: [],
  streak: 0,
  lastActive: '',
};

function load(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function save(p: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(load);

  const level = useMemo(() => Math.floor(progress.xp / XP_PER_LEVEL) + 1, [progress.xp]);
  const xpInLevel = useMemo(() => progress.xp % XP_PER_LEVEL, [progress.xp]);

  const recordResult = useCallback((result: TaskResult) => {
    setProgress((prev) => {
      const today = new Date().toDateString();
      const streak = prev.lastActive === today ? prev.streak : prev.lastActive === new Date(Date.now() - 86400000).toDateString() ? prev.streak + 1 : 1;
      const newXp = prev.xp + result.earnedPoints;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      const completed = { ...prev.completedTasks, [result.taskId]: result };
      const completedCount = Object.keys(completed).length;

      // check achievements
      const unlocked = new Set(prev.achievements);
      if (completedCount >= 1)  unlocked.add('first_task');
      if (streak >= 3)          unlocked.add('streak_3');
      if (result.score === 100) unlocked.add('perfect');
      if (result.score === 100 && result.timeSpent <= 15) unlocked.add('fast');
      if (completedCount >= 10) unlocked.add('tasks_10');
      if (completedCount >= 25) unlocked.add('tasks_25');
      if (completedCount >= 50) unlocked.add('tasks_50');
      if (newLevel >= 5)        unlocked.add('level_5');
      if (newXp >= 500)         unlocked.add('xp_500');

      const next: UserProgress = {
        xp: newXp,
        level: newLevel,
        completedTasks: completed,
        achievements: [...unlocked],
        streak,
        lastActive: today,
      };
      save(next);
      return next;
    });
  }, []);

  const getAchievements = useCallback(() =>
    ALL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: progress.achievements.includes(a.id) })),
  [progress.achievements]);

  const resetProgress = useCallback(() => {
    const fresh = DEFAULT_PROGRESS;
    save(fresh);
    setProgress(fresh);
  }, []);

  return {
    progress,
    level,
    xpInLevel,
    xpPerLevel: XP_PER_LEVEL,
    recordResult,
    getAchievements,
    resetProgress,
    completedCount: Object.keys(progress.completedTasks).length,
    allAchievements: ALL_ACHIEVEMENTS,
  };
}
