import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type PdfCategory = 'nakyl' | 'dauly' | 'oratory';

export interface TeacherPdf {
  id: string;
  name: string;
  sizeBytes: number;

  // Бұрын base64 болатын.
  // Енді компонентті өзгертпеу үшін public PDF URL осы жерде сақталады.
  base64: string;

  addedAt: string;
  description?: string;
}

const MAX_SIZE_BYTES = 4 * 1024 * 1024;

const BUCKET_NAME = 'teacher-pdfs';

function createId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function safeFileName(name: string) {
  return name
    .normalize('NFKC')
    .replace(/[\/\\]/g, '_');
}

export function useTeacherPdfs(
  biSlug: string,
  category: PdfCategory
) {
  const [pdfs, setPdfs] = useState<TeacherPdf[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // --------------------------------------------------
  // PDF ТІЗІМІН SUPABASE-ТЕН ЖҮКТЕУ
  // --------------------------------------------------
  const loadPdfs = useCallback(async () => {
    if (!biSlug || !category) {
      setPdfs([]);
      return;
    }

    setError(null);

    const { data, error } = await supabase
      .from('teacher_pdfs')
      .select('*')
      .eq('bi_slug', biSlug)
      .eq('category', category)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Load teacher PDFs error:', error);
      setError('PDF файлдарды жүктеу кезінде қате пайда болды.');
      setPdfs([]);
      return;
    }

    const mapped: TeacherPdf[] = (data ?? []).map((row) => {
      const { data: publicUrlData } =
        supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(row.storage_path);

      return {
        id: row.id,
        name: row.name,
        sizeBytes: Number(row.size_bytes),
        base64: publicUrlData.publicUrl,
        addedAt: row.added_at,
        description: row.description ?? undefined,
      };
    });

    setPdfs(mapped);
  }, [biSlug, category]);

  useEffect(() => {
    loadPdfs();
  }, [loadPdfs]);

  // --------------------------------------------------
  // PDF ҚОСУ
  // --------------------------------------------------
  const addPdf = useCallback(
    async (
      file: File,
      description?: string
    ): Promise<void> => {
      setError(null);

      if (file.type !== 'application/pdf') {
        const msg = 'Тек PDF файл жүктеуге болады.';
        setError(msg);
        throw new Error(msg);
      }

      if (file.size > MAX_SIZE_BYTES) {
        const msg = `Файл өлшемі 4 МБ-тан аспауы керек (${(
          file.size / 1048576
        ).toFixed(1)} МБ).`;

        setError(msg);
        throw new Error(msg);
      }

      setUploading(true);

      try {
        // Кіруді тексеру
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error(
            'PDF жүктеу үшін аккаунтқа кіру қажет.'
          );
        }

        const fileId = createId();
        const fileName = safeFileName(file.name);

        const storagePath =
          `${biSlug}/${category}/${fileId}-${fileName}`;

        // ------------------------------------------
        // 1. PDF → SUPABASE STORAGE
        // ------------------------------------------
        const { error: uploadError } =
          await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, file, {
              contentType: 'application/pdf',
              upsert: false,
            });

        if (uploadError) {
          console.error(
            'Storage upload error:',
            uploadError
          );

          throw new Error(
            uploadError.message ||
              'PDF файлды Storage-қа жүктеу мүмкін болмады.'
          );
        }

        // ------------------------------------------
        // 2. PUBLIC URL АЛУ
        // ------------------------------------------
        const { data: publicUrlData } =
          supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(storagePath);

        const publicUrl =
          publicUrlData.publicUrl;

        // ------------------------------------------
        // 3. DATABASE-КЕ САҚТАУ
        // ------------------------------------------
        const { data: insertedRow, error: dbError } =
          await supabase
            .from('teacher_pdfs')
            .insert({
              bi_slug: biSlug,
              category,
              name: file.name.replace(
                /\.pdf$/i,
                ''
              ),
              size_bytes: file.size,
              storage_path: storagePath,
              description:
                description || null,
            })
            .select()
            .single();

        // Егер базаға сақталмаса,
        // Storage-тағы файлды өшіреміз.
        if (dbError || !insertedRow) {
          await supabase.storage
            .from(BUCKET_NAME)
            .remove([storagePath]);

          console.error(
            'Database save error:',
            dbError
          );

          throw new Error(
            dbError?.message ||
              'PDF мәліметтерін базаға сақтау мүмкін болмады.'
          );
        }

        // ------------------------------------------
        // 4. ЭКРАНҒА ДЕРЕУ ШЫҒАРУ
        // ------------------------------------------
        const newPdf: TeacherPdf = {
          id: insertedRow.id,
          name: insertedRow.name,
          sizeBytes: Number(
            insertedRow.size_bytes
          ),
          base64: publicUrl,
          addedAt: insertedRow.added_at,
          description:
            insertedRow.description ??
            undefined,
        };

        setPdfs((prev) => [
          newPdf,
          ...prev,
        ]);
      } catch (err) {
        console.error(
          'Add PDF error:',
          err
        );

        const message =
          err instanceof Error
            ? err.message
            : 'PDF жүктеу кезінде қате пайда болды.';

        setError(message);

        throw err;
      } finally {
        setUploading(false);
      }
    },
    [biSlug, category]
  );

  // --------------------------------------------------
  // PDF ӨШІРУ
  // --------------------------------------------------
  const removePdf = useCallback(
    async (id: string) => {
      setError(null);

      try {
        // Алдымен database-тен файл жолын аламыз
        const { data: row, error: findError } =
          await supabase
            .from('teacher_pdfs')
            .select('storage_path')
            .eq('id', id)
            .single();

        if (findError) {
          console.error(
            'Find PDF error:',
            findError
          );

          setError(
            'PDF файлын табу мүмкін болмады.'
          );

          return;
        }

        // Storage-тан өшіру
        const { error: storageError } =
          await supabase.storage
            .from(BUCKET_NAME)
            .remove([row.storage_path]);

        if (storageError) {
          console.error(
            'Storage delete error:',
            storageError
          );

          setError(
            'PDF файлды Storage-тан өшіру мүмкін болмады.'
          );

          return;
        }

        // Database-тен өшіру
        const { error: dbError } =
          await supabase
            .from('teacher_pdfs')
            .delete()
            .eq('id', id);

        if (dbError) {
          console.error(
            'Database delete error:',
            dbError
          );

          setError(
            'PDF мәліметін базадан өшіру мүмкін болмады.'
          );

          return;
        }

        setPdfs((prev) =>
          prev.filter(
            (pdf) => pdf.id !== id
          )
        );
      } catch (err) {
        console.error(
          'Remove PDF error:',
          err
        );

        setError(
          'PDF өшіру кезінде қате пайда болды.'
        );
      }
    },
    []
  );

  // --------------------------------------------------
  // СИПАТТАМАНЫ ӨЗГЕРТУ
  // --------------------------------------------------
  const updateDescription = useCallback(
    async (
      id: string,
      description: string
    ) => {
      setError(null);

      const { error } = await supabase
        .from('teacher_pdfs')
        .update({
          description,
        })
        .eq('id', id);

      if (error) {
        console.error(
          'Update description error:',
          error
        );

        setError(
          'Сипаттаманы сақтау кезінде қате шықты.'
        );

        return;
      }

      setPdfs((prev) =>
        prev.map((pdf) =>
          pdf.id === id
            ? {
                ...pdf,
                description,
              }
            : pdf
        )
      );
    },
    []
  );

  return {
    pdfs,
    addPdf,
    removePdf,
    updateDescription,
    uploading,
    error,
    maxSizeMB:
      MAX_SIZE_BYTES / 1048576,
  };
}