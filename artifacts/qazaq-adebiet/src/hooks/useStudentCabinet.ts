import { useState, useMemo, useCallback } from 'react';
import type { StudentProfile, ReadingRecord, TestRecord, Certificate } from '@/types/student';

// All known book slugs (matches books.json id fields)
export const ALL_BOOK_SLUGS = [
  'abai-qara-sozder',
  'auezov-abai-zholy',
  'kyrgyz-khrestomatiya',
  'magzhan-tandamaly',
  'tole-bi-sheshendik',
  'baidibek-bi',
  'dulatov-oyan-qazaq',
  'abai-olen',
];

// ── Profile ──────────────────────────────────────────────────────────────────
const PROFILE_KEY = 'student_profile';
const DEFAULT_PROFILE: StudentProfile = {
  name: 'Оқушы',
  grade: '9-сынып',
  school: 'Мектеп',
};

function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_PROFILE;
}

// ── Reading Records ───────────────────────────────────────────────────────────
export function loadReadingRecords(): ReadingRecord[] {
  const records: ReadingRecord[] = [];
  for (const slug of ALL_BOOK_SLUGS) {
    const raw = localStorage.getItem(`dr_${slug}`);
    if (!raw) continue;
    try {
      const p = JSON.parse(raw);
      const anyProgress =
        (p.textProgress ?? 0) > 0 ||
        (p.pdfPage ?? 1) > 1 ||
        (p.audioTime ?? 0) > 0 ||
        p.isFavorite;
      if (!anyProgress) continue;
      records.push({
        bookSlug: slug,
        textProgress: p.textProgress ?? 0,
        pdfPage: p.pdfPage ?? 1,
        audioTime: p.audioTime ?? 0,
        isFavorite: p.isFavorite ?? false,
        lastActiveTab: p.activeTab ?? 'text',
      });
    } catch { /* ignore */ }
  }
  return records;
}

// ── Test Records ─────────────────────────────────────────────────────────────
export function loadTestRecords(): TestRecord[] {
  try {
    const raw = localStorage.getItem('ill_progress');
    if (!raw) return [];
    const prog = JSON.parse(raw);
    const tasks = prog.completedTasks as Record<string, {
      score?: number; points?: number; correct?: boolean; time?: number; completedAt?: number;
    }> | undefined;
    if (!tasks) return [];
    return Object.entries(tasks)
      .map(([id, r]) => ({
        taskId: id,
        taskTitle: id.toUpperCase().replace(/^T0*/, 'Тапсырма '),
        score: r.score ?? 0,
        points: r.points ?? 0,
        correct: r.correct ?? false,
        time: r.time ?? 0,
        completedAt: r.completedAt ?? 0,
      }))
      .sort((a, b) => b.completedAt - a.completedAt);
  } catch { return []; }
}

// ── Certificates ──────────────────────────────────────────────────────────────
export function buildCertificates(
  achievements: Array<{ id: string; title: string; description: string; icon: string; unlocked: boolean }>,
  readingRecords: ReadingRecord[],
  testRecords: TestRecord[],
  streak: number,
): Certificate[] {
  const certs: Certificate[] = [];

  // Achievement badges
  const ACHIEVEMENT_COLORS: Record<string, string> = {
    first_task: 'from-violet-600 to-purple-500',
    streak_3: 'from-orange-500 to-amber-400',
    perfect: 'from-emerald-500 to-green-400',
    fast: 'from-blue-500 to-cyan-400',
    collector: 'from-pink-500 to-rose-400',
  };
  for (const ach of achievements) {
    if (!ach.unlocked) continue;
    certs.push({
      id: `ach_${ach.id}`,
      title: ach.title,
      subtitle: ach.description,
      type: 'achievement',
      earnedAt: Date.now(),
      icon: ach.icon,
      color: ACHIEVEMENT_COLORS[ach.id] ?? 'from-gray-600 to-gray-500',
    });
  }

  // Book reading (≥90%)
  for (const r of readingRecords) {
    if (r.textProgress >= 90) {
      certs.push({
        id: `book_${r.bookSlug}`,
        title: 'Кітап оқылды',
        subtitle: r.bookSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        type: 'book_read',
        earnedAt: Date.now(),
        icon: '📖',
        color: 'from-indigo-600 to-blue-500',
      });
    }
  }

  // Test master (3+ tests with score ≥80)
  const aced = testRecords.filter(t => t.score >= 80);
  if (aced.length >= 3) {
    certs.push({
      id: 'test_ace_3',
      title: 'Тест шебері',
      subtitle: `${aced.length} тест 80%-дан жоғары`,
      type: 'test_ace',
      earnedAt: Date.now(),
      icon: '🏆',
      color: 'from-amber-500 to-yellow-400',
    });
  }

  // Streak certificate
  if (streak >= 7) {
    certs.push({
      id: 'streak_7',
      title: '7 күн қатарынан',
      subtitle: 'Бірде-бір күн жіберген жоқ',
      type: 'streak',
      earnedAt: Date.now(),
      icon: '🔥',
      color: 'from-red-500 to-orange-400',
    });
  }

  // Deduplicate
  const seen = new Set<string>();
  return certs.filter(c => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

// ── Main Hook ─────────────────────────────────────────────────────────────────
export function useStudentCabinet() {
  const [profile, setProfileState] = useState<StudentProfile>(loadProfile);
  const [editingProfile, setEditingProfile] = useState(false);

  const readingRecords = useMemo(loadReadingRecords, []);
  const testRecords    = useMemo(loadTestRecords,    []);

  const saveProfile = useCallback((p: StudentProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfileState(p);
    setEditingProfile(false);
  }, []);

  return {
    profile,
    editingProfile,
    setEditingProfile,
    saveProfile,
    readingRecords,
    testRecords,
  };
}
