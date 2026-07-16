import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Gamepad2, Users, LayoutGrid } from 'lucide-react';
import { useTaskLab } from '@/hooks/useTaskLab';
import { useProgress } from '@/hooks/useProgress';
import type { Task, TaskResult } from '@/types/task';

import HeroSection      from '@/components/interactive/HeroSection';
import SearchBar        from '@/components/interactive/SearchBar';
import TaskFilters      from '@/components/interactive/TaskFilters';
import TaskCard         from '@/components/interactive/TaskCard';
import GamificationPanel from '@/components/interactive/GamificationPanel';
import TaskRunner       from '@/components/interactive/TaskRunner';
import TeacherMode      from '@/components/interactive/TeacherMode';

type Tab = 'tasks' | 'gamification' | 'teacher';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'tasks',         label: 'Тапсырмалар', icon: <LayoutGrid size={15} /> },
  { id: 'gamification',  label: 'Жетістіктер',  icon: <Gamepad2 size={15} /> },
  { id: 'teacher',       label: 'Мұғалім',       icon: <Users size={15} /> },
];

export default function InteractivePage() {
  const lab = useTaskLab();
  const prog = useProgress();
  const [tab, setTab] = useState<Tab>('tasks');
  const [activeIndex, setActiveIndex] = useState<number>(0); // index in filtered list

  // ─── Task runner ────────────────────────────────────────────────────────────
  const openTask = useCallback((task: Task) => {
    const idx = lab.filtered.findIndex((t) => t.id === task.id);
    setActiveIndex(idx >= 0 ? idx : 0);
    lab.setActiveTask(task);
  }, [lab]);

  const openRandom = useCallback(() => {
    const arr = lab.filtered;
    if (!arr.length) return;
    const idx = Math.floor(Math.random() * arr.length);
    setActiveIndex(idx);
    lab.setActiveTask(arr[idx]);
  }, [lab]);

  const openNext = useCallback(() => {
    const arr = lab.filtered;
    if (!arr.length) return;
    const nextIdx = (activeIndex + 1) % arr.length;
    setActiveIndex(nextIdx);
    lab.setActiveTask(arr[nextIdx]);
  }, [lab, activeIndex]);

  const handleComplete = useCallback((correct: boolean, timeSpent: number, earnedPoints: number) => {
    if (!lab.activeTask) return;
    const result: TaskResult = {
      taskId: lab.activeTask.id,
      score: correct ? 100 : 0,
      earnedPoints,
      completedAt: new Date().toISOString(),
      timeSpent,
      correct,
    };
    prog.recordResult(result);
  }, [lab.activeTask, prog]);

  const achievements = prog.getAchievements();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0d0d1a] to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6">

        {/* ── HERO ── */}
        <HeroSection
          totalTasks={lab.allTasks.length}
          completedCount={prog.completedCount}
          xp={prog.progress.xp}
          level={prog.level}
          onStartRandom={openRandom}
        />

        {/* ── TAB BAR ── */}
        <div className="flex gap-1 p-1 rounded-2xl border border-white/10 bg-white/5 mb-6 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/45 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TASKS TAB ── */}
        {tab === 'tasks' && (
          <div className="flex gap-8 flex-col lg:flex-row">
            {/* main */}
            <div className="flex-1 min-w-0">
              <SearchBar
                value={lab.filters.search}
                onChange={(v) => lab.setFilter('search', v)}
                allTasks={lab.allTasks}
                onSelect={openTask}
              />

              <TaskFilters
                filters={lab.filters}
                options={lab.options}
                onFilter={lab.setFilter}
                onClear={lab.clearFilters}
                resultCount={lab.filtered.length}
              />

              {/* task grid */}
              {lab.filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-16 text-center">
                  <GraduationCap size={40} className="mx-auto text-white/15 mb-3" />
                  <p className="text-white/30">Тапсырмалар табылмады</p>
                  <p className="text-white/20 text-sm mt-1">Сүзгіні тазартып көріңіз</p>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {lab.filtered.map((task, i) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={i}
                      result={prog.progress.completedTasks[task.id]}
                      onClick={() => openTask(task)}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* sidebar — gamification mini */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-6">
                <GamificationPanel
                  xp={prog.progress.xp}
                  level={prog.level}
                  xpInLevel={prog.xpInLevel}
                  xpPerLevel={prog.xpPerLevel}
                  streak={prog.progress.streak}
                  achievements={achievements}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── GAMIFICATION TAB ── */}
        {tab === 'gamification' && (
          <div className="max-w-2xl">
            <GamificationPanel
              xp={prog.progress.xp}
              level={prog.level}
              xpInLevel={prog.xpInLevel}
              xpPerLevel={prog.xpPerLevel}
              streak={prog.progress.streak}
              achievements={achievements}
            />

            {/* leaderboard (local) */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-white font-bold mb-4">📊 Сіздің статистикаңыз</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Орындалған тапсырмалар', value: prog.completedCount },
                  { label: 'Жалпы XP', value: prog.progress.xp },
                  { label: 'Деңгей', value: prog.level },
                  { label: 'Ашылған жетістіктер', value: achievements.filter((a) => a.unlocked).length },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/8 bg-white/5 p-4 text-center">
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-white/40 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={prog.resetProgress}
                className="mt-4 w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-all"
              >
                Прогресті тазарту
              </button>
            </div>
          </div>
        )}

        {/* ── TEACHER TAB ── */}
        {tab === 'teacher' && (
          <div className="max-w-3xl">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 p-4 mb-6">
              <p className="text-amber-300 text-sm">
                🔐 <strong>Мұғалім режимі</strong> — Өзіңіздің тапсырмаларыңызды қосыңыз.
                Барлығы браузерде (localStorage) сақталады.
              </p>
            </div>

            <TeacherMode
              customTasks={lab.custom}
              onAdd={lab.addCustomTask}
              onUpdate={lab.updateCustomTask}
              onDelete={lab.deleteCustomTask}
              onExport={lab.exportTasks}
              onImport={lab.importTasks}
            />
          </div>
        )}

      </div>

      {/* ── TASK RUNNER MODAL ── */}
      <TaskRunner
        task={lab.activeTask}
        onClose={() => lab.setActiveTask(null)}
        onComplete={handleComplete}
        onNext={() => { openNext(); }}
      />
    </div>
  );
}
