import { useState, useCallback } from 'react';
import type { TeacherUpload, StudentUpload } from '@/types/upload';
import { TEACHER_UPLOADS_KEY, STUDENT_UPLOADS_KEY } from '@/types/upload';

// ── Helper ────────────────────────────────────────────────────────────────────
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function save<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// ── Teacher uploads hook ──────────────────────────────────────────────────────
export function useTeacherUploads(teacherName: string) {
  const [uploads, setUploads] = useState<TeacherUpload[]>(() =>
    load<TeacherUpload[]>(TEACHER_UPLOADS_KEY, [])
  );

  const persist = (list: TeacherUpload[]) => {
    setUploads(list);
    save(TEACHER_UPLOADS_KEY, list);
  };

  const addUpload = useCallback((
    data: Omit<TeacherUpload, 'id' | 'uploadedAt' | 'teacherName'>
  ) => {
    const item: TeacherUpload = { ...data, id: uid(), uploadedAt: Date.now(), teacherName };
    const prev = load<TeacherUpload[]>(TEACHER_UPLOADS_KEY, []);
    persist([item, ...prev]);
  }, [teacherName]);

  const deleteUpload = useCallback((id: string) => {
    const prev = load<TeacherUpload[]>(TEACHER_UPLOADS_KEY, []);
    persist(prev.filter(u => u.id !== id));
  }, []);

  return { uploads, addUpload, deleteUpload };
}

// ── Student personal uploads hook ─────────────────────────────────────────────
export function useStudentUploads() {
  const [uploads, setUploads] = useState<StudentUpload[]>(() =>
    load<StudentUpload[]>(STUDENT_UPLOADS_KEY, [])
  );

  const persist = (list: StudentUpload[]) => {
    setUploads(list);
    save(STUDENT_UPLOADS_KEY, list);
  };

  const addUpload = useCallback((
    data: Omit<StudentUpload, 'id' | 'uploadedAt'>
  ) => {
    const item: StudentUpload = { ...data, id: uid(), uploadedAt: Date.now() };
    const prev = load<StudentUpload[]>(STUDENT_UPLOADS_KEY, []);
    persist([item, ...prev]);
  }, []);

  const deleteUpload = useCallback((id: string) => {
    const prev = load<StudentUpload[]>(STUDENT_UPLOADS_KEY, []);
    persist(prev.filter(u => u.id !== id));
  }, []);

  return { uploads, addUpload, deleteUpload };
}

// ── Read teacher uploads (for student library) ────────────────────────────────
export function readTeacherUploads(): TeacherUpload[] {
  return load<TeacherUpload[]>(TEACHER_UPLOADS_KEY, []);
}

// ── File → base64 helper ──────────────────────────────────────────────────────
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
