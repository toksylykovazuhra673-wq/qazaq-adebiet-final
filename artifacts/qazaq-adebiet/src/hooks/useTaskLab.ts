import { useState, useMemo, useCallback } from 'react';
import type { Task, TaskDraft } from '@/types/task';
import tasksData from '@/data/tasks.json';

const CUSTOM_KEY = 'ill_custom_tasks';

function loadCustom(): Task[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCustom(tasks: Task[]) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(tasks));
}

export interface TaskFilters {
  search: string;
  author: string;
  grade: string;
  genre: string;
  century: string;
  topic: string;
  type: string;
  difficulty: string;
}

const DEFAULT_FILTERS: TaskFilters = {
  search: '', author: '', grade: '', genre: '', century: '', topic: '', type: '', difficulty: '',
};

export function useTaskLab() {
  const [builtIn] = useState<Task[]>(() => tasksData as Task[]);
  const [custom, setCustom] = useState<Task[]>(loadCustom);
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isTeacherMode, setIsTeacherMode] = useState(false);

  const allTasks = useMemo(() => [...builtIn, ...custom], [builtIn, custom]);

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    return allTasks.filter((t) => {
      if (q && !`${t.title} ${t.author} ${t.work} ${t.question} ${t.tags.join(' ')}`.toLowerCase().includes(q)) return false;
      if (filters.author && t.author !== filters.author) return false;
      if (filters.grade && t.grade !== filters.grade && t.grade !== 'all') return false;
      if (filters.genre && t.genre !== filters.genre) return false;
      if (filters.century && t.century !== filters.century && t.century !== 'all') return false;
      if (filters.topic && t.topic !== filters.topic) return false;
      if (filters.type && t.type !== filters.type) return false;
      if (filters.difficulty && t.difficulty !== filters.difficulty) return false;
      return true;
    });
  }, [allTasks, filters]);

  // unique filter options
  const options = useMemo(() => ({
    authors:     [...new Set(allTasks.map((t) => t.author))].sort(),
    grades:      [...new Set(allTasks.map((t) => t.grade))].sort(),
    genres:      [...new Set(allTasks.map((t) => t.genre).filter(Boolean))].sort() as string[],
    centuries:   [...new Set(allTasks.map((t) => t.century))].sort(),
    topics:      [...new Set(allTasks.map((t) => t.topic))].sort(),
    types:       [...new Set(allTasks.map((t) => t.type))].sort(),
    difficulties:[...new Set(allTasks.map((t) => t.difficulty))],
  }), [allTasks]);

  const setFilter = useCallback(<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
    setFilters((f) => ({ ...f, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const addCustomTask = useCallback((draft: TaskDraft) => {
    const newTask: Task = { ...draft, id: `custom_${Date.now()}` };
    setCustom((prev) => {
      const updated = [...prev, newTask];
      saveCustom(updated);
      return updated;
    });
  }, []);

  const updateCustomTask = useCallback((task: Task) => {
    setCustom((prev) => {
      const updated = prev.map((t) => (t.id === task.id ? task : t));
      saveCustom(updated);
      return updated;
    });
  }, []);

  const deleteCustomTask = useCallback((id: string) => {
    setCustom((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveCustom(updated);
      return updated;
    });
  }, []);

  const exportTasks = useCallback(() => {
    const blob = new Blob([JSON.stringify(custom, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'my-tasks.json'; a.click();
    URL.revokeObjectURL(url);
  }, [custom]);

  const importTasks = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Task[];
        setCustom((prev) => {
          const updated = [...prev, ...imported.map((t) => ({ ...t, id: `import_${Date.now()}_${Math.random()}` }))];
          saveCustom(updated);
          return updated;
        });
      } catch { /* ignore bad JSON */ }
    };
    reader.readAsText(file);
  }, []);

  return {
    allTasks, filtered, custom, filters, options,
    activeTask, setActiveTask,
    isTeacherMode, setIsTeacherMode,
    setFilter, clearFilters,
    addCustomTask, updateCustomTask, deleteCustomTask,
    exportTasks, importTasks,
  };
}
