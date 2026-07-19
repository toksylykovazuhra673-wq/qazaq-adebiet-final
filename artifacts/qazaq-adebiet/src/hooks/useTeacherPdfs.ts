import { useState, useEffect, useCallback } from 'react';

export type PdfCategory = 'nakyl' | 'dauly' | 'oratory';

export interface TeacherPdf {
  id: string;
  name: string;
  sizeBytes: number;
  base64: string;          // data:application/pdf;base64,...
  addedAt: string;         // ISO date
  description?: string;
}

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB per file

function storageKey(biSlug: string, category: PdfCategory) {
  return `teacher-pdfs:${biSlug}:${category}`;
}

function load(biSlug: string, category: PdfCategory): TeacherPdf[] {
  try {
    const raw = localStorage.getItem(storageKey(biSlug, category));
    return raw ? (JSON.parse(raw) as TeacherPdf[]) : [];
  } catch {
    return [];
  }
}

function save(biSlug: string, category: PdfCategory, list: TeacherPdf[]) {
  try {
    localStorage.setItem(storageKey(biSlug, category), JSON.stringify(list));
  } catch {
    // localStorage quota exceeded
  }
}

export function useTeacherPdfs(biSlug: string, category: PdfCategory) {
  const [pdfs, setPdfs] = useState<TeacherPdf[]>(() => load(biSlug, category));
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Keep in sync if another tab changes storage
  useEffect(() => {
    setPdfs(load(biSlug, category));
  }, [biSlug, category]);

  const addPdf = useCallback(
    (file: File, description?: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        setError(null);

        if (file.type !== 'application/pdf') {
          const msg = 'Тек PDF файл жүктеуге болады';
          setError(msg);
          reject(new Error(msg));
          return;
        }
        if (file.size > MAX_SIZE_BYTES) {
          const msg = `Файл өлшемі 4 МБ-тан аспауы керек (${(file.size / 1048576).toFixed(1)} МБ)`;
          setError(msg);
          reject(new Error(msg));
          return;
        }

        setUploading(true);
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const entry: TeacherPdf = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: file.name.replace(/\.pdf$/i, ''),
            sizeBytes: file.size,
            base64,
            addedAt: new Date().toISOString(),
            description,
          };
          const next = [entry, ...load(biSlug, category)];
          save(biSlug, category, next);
          setPdfs(next);
          setUploading(false);
          resolve();
        };
        reader.onerror = () => {
          setError('Файлды оқу қатесі');
          setUploading(false);
          reject(new Error('read error'));
        };
        reader.readAsDataURL(file);
      });
    },
    [biSlug, category],
  );

  const removePdf = useCallback(
    (id: string) => {
      const next = load(biSlug, category).filter((p) => p.id !== id);
      save(biSlug, category, next);
      setPdfs(next);
    },
    [biSlug, category],
  );

  const updateDescription = useCallback(
    (id: string, description: string) => {
      const next = load(biSlug, category).map((p) =>
        p.id === id ? { ...p, description } : p,
      );
      save(biSlug, category, next);
      setPdfs(next);
    },
    [biSlug, category],
  );

  return { pdfs, addPdf, removePdf, updateDescription, uploading, error, maxSizeMB: MAX_SIZE_BYTES / 1048576 };
}
