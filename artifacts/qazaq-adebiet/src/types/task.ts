// ─── Task Types ────────────────────────────────────────────────────────────────
export type TaskType =
  | 'single_choice'
  | 'multi_choice'
  | 'true_false'
  | 'matching'
  | 'drag_drop'
  | 'fill_blank'
  | 'ordering'
  | 'memory_game'
  | 'wheel_fortune'
  | 'who_said';

export type Difficulty = 'easy' | 'medium' | 'hard';

// Options shapes per task type
export interface MatchingOptions { left: string[]; right: string[] }
export interface DragDropOptions  { items: string[]; buckets: string[]; correctMapping: Record<string, string> }
export interface MemoryPair       { front: string; back: string }

export type TaskOptions =
  | string[]          // single_choice, multi_choice, true_false, who_said, ordering, wheel_fortune
  | MatchingOptions
  | DragDropOptions
  | MemoryPair[]
  | null;

export type CorrectAnswer =
  | number            // single_choice, true_false, who_said, wheel_fortune
  | number[]          // multi_choice, ordering, matching (index map)
  | string            // fill_blank
  | string[]          // fill_blank (multiple accepted)
  | boolean           // true_false alternative
  | null;             // memory_game (auto-checked)

export interface Task {
  id: string;
  title: string;
  author: string;
  work: string;
  grade: string;        // "7", "8", "9", "10", "11" | "all"
  century: string;      // "XIX", "XX", "XXI" | "all"
  topic: string;
  genre?: string;
  type: TaskType;
  question: string;
  options: TaskOptions;
  correctAnswer: CorrectAnswer;
  hint?: string;
  explanation?: string;
  difficulty: Difficulty;
  timeLimit: number;    // seconds; 0 = unlimited
  points: number;
  image?: string | null;
  audio?: string | null;
  pdf?: string | null;
  tags: string[];
}

// ─── Progress / Gamification ──────────────────────────────────────────────────
export interface TaskResult {
  taskId: string;
  score: number;       // 0–100 %
  earnedPoints: number;
  completedAt: string; // ISO date
  timeSpent: number;   // seconds
  correct: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  completedTasks: Record<string, TaskResult>; // taskId → result
  achievements: string[];                      // achievement ids
  streak: number;
  lastActive: string;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  name: string;
  xp: number;
  level: number;
  avatar: string; // color hex
}

// ─── Teacher Mode ─────────────────────────────────────────────────────────────
export interface TaskDraft extends Omit<Task, 'id'> {
  id?: string;
}
