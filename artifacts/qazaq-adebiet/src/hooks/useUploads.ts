import { useState, useCallback } from 'react';
import type { TeacherUpload, StudentUpload } from '@/types/upload';
import { STUDENT_UPLOADS_KEY } from '@/types/upload';
import { supabase } from '@/lib/supabase';

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function useTeacherUploads(teacherName: string) {
  const [uploads, setUploads] = useState<TeacherUpload[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUploads = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('author_media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase load error:', error);
        return;
      }

      const mapped: TeacherUpload[] = (data ?? []).map((item: any) => ({
  id: String(item.id),
  teacherName: item.teacher_name ?? teacherName,
  title: item.title ?? '',
  author: item.author ?? '',
  description: item.description ?? '',
  gradeLevel: item.grade_level ?? 9,
  genre: item.genre ?? '',
  mediaType: item.media_type ?? 'pdf',
  fileUrl: item.file_url ?? '',
  filePath: item.file_path ?? '',
  fileName: item.file_name ?? '',
  fileSizeKb: item.file_size_kb ?? 0,
  uploadedAt: new Date(item.created_at).getTime(),
}));

      setUploads(mapped);
    } finally {
      setLoading(false);
    }
  }, [teacherName]);

  const addUpload = useCallback(async (
    data: Omit<TeacherUpload, 'id' | 'uploadedAt' | 'teacherName'>
  ) => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      throw new Error('AUTH_REQUIRED');
    }

    const file = (data as any).file as File | undefined;

    if (!file) {
      throw new Error('FILE_REQUIRED');
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';

const originalName = file.name.replace(/\.[^/.]+$/, '');

const safeName = originalName
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9_-]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const path = `${sessionData.session.user.id}/${Date.now()}-${safeName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    const { data: publicData } = supabase.storage
      .from('media')
      .getPublicUrl(path);

    const { data: inserted, error: dbError } = await supabase
      .from('author_media')
      .insert({
        author_slug: teacherName,
        title: data.title,
        media_type: extension,
        file_url: publicData.publicUrl,
        file_path: path,
        file_name: file.name,
        file_size_kb: Math.round(file.size / 1024),
        description: data.description,
        grade_level: data.gradeLevel,
        genre: data.genre,
        teacher_name: teacherName,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);

      await supabase.storage
        .from('media')
        .remove([path]);

      throw dbError;
    }

    const item: TeacherUpload = {
      ...data,
      id: String(inserted.id),
      uploadedAt: Date.now(),
      teacherName,
      
      fileName: file.name,
      fileSizeKb: Math.round(file.size / 1024),
    };

    setUploads(prev => [item, ...prev]);

    return item;
  }, [teacherName]);

  const deleteUpload = useCallback(async (id: string) => {
    const item = uploads.find(u => u.id === id);

    if (!item) return;

    const { data, error } = await supabase
      .from('author_media')
      .delete()
      .eq('id', Number(id))
      .select('file_path')
      .single();

    if (error) {
      console.error('Database delete error:', error);
      throw error;
    }

    if (data?.file_path) {
      await supabase.storage
        .from('media')
        .remove([data.file_path]);
    }

    setUploads(prev => prev.filter(u => u.id !== id));
  }, [uploads]);

  return {
    uploads,
    addUpload,
    deleteUpload,
    loadUploads,
    loading,
  };
}

export function useStudentUploads() {
  const [uploads, setUploads] = useState<StudentUpload[]>(() => {
    try {
      const raw = localStorage.getItem(STUDENT_UPLOADS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const addUpload = useCallback((
    data: Omit<StudentUpload, 'id' | 'uploadedAt'>
  ) => {
    const item: StudentUpload = {
      ...data,
      id: uid(),
      uploadedAt: Date.now(),
    };

    setUploads(prev => {
      const next = [item, ...prev];

      try {
        localStorage.setItem(
          STUDENT_UPLOADS_KEY,
          JSON.stringify(next)
        );
      } catch {}

      return next;
    });
  }, []);

  const deleteUpload = useCallback((id: string) => {
    setUploads(prev => {
      const next = prev.filter(u => u.id !== id);

      try {
        localStorage.setItem(
          STUDENT_UPLOADS_KEY,
          JSON.stringify(next)
        );
      } catch {}

      return next;
    });
  }, []);

  return { uploads, addUpload, deleteUpload };
}

export function readTeacherUploads(): TeacherUpload[] {
  return [];
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}