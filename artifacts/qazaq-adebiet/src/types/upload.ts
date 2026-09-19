// ── Shared upload types ──────────────────────────────────────────────────────

export type UploadMediaType = 'pdf' | 'image' | 'audio' | 'video';

export interface TeacherUpload {
  id: string;

  title: string;
  author: string;
  description: string;

  gradeLevel: number; // 5-11
  genre: string;

  // Media information
  mediaType: UploadMediaType;

  // Supabase public URL
  fileUrl: string;

  // Supabase Storage path
  filePath: string;

  // Original uploaded file
  fileName: string;
  fileSizeKb: number;

  // Used during upload
  file?: File;

  uploadedAt: number;
  teacherName: string;
}

export interface StudentUpload {
  id: string;

  title: string;
  author: string;

  mediaType: UploadMediaType;

  fileUrl: string;
  filePath: string;

  fileName: string;
  fileSizeKb: number;

  file?: File;

  uploadedAt: number;
}

export const TEACHER_UPLOADS_KEY = 'teacher_uploads';
export const STUDENT_UPLOADS_KEY = 'student_uploads';

// PDF limit
export const MAX_PDF_MB = 3;
export const MAX_PDF_BYTES = MAX_PDF_MB * 1024 * 1024;

// General media limits
export const MAX_IMAGE_MB = 10;
export const MAX_AUDIO_MB = 50;
export const MAX_VIDEO_MB = 200;

// ── Open stored PDF ──────────────────────────────────────────────────────────

export function openBase64Pdf(
  base64DataUrl: string,
  title: string
) {
  const byteString = atob(
    base64DataUrl.split(',')[1] ?? base64DataUrl
  );

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], {
    type: 'application/pdf',
  });

  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');

  if (!win) return;

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 30_000);

  win.document.title = title;
}