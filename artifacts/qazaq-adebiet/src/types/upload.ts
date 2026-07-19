// ── Shared upload types (teacher → student, or student personal) ─────────────

export interface TeacherUpload {
  id: string;
  title: string;
  author: string;
  description: string;
  gradeLevel: number;     // 5-11
  genre: string;
  pdfData: string;        // base64 data URL
  fileName: string;
  fileSizeKb: number;
  uploadedAt: number;
  teacherName: string;
}

export interface StudentUpload {
  id: string;
  title: string;
  author: string;
  pdfData: string;        // base64 data URL
  fileName: string;
  fileSizeKb: number;
  uploadedAt: number;
}

export const TEACHER_UPLOADS_KEY = 'teacher_uploads';
export const STUDENT_UPLOADS_KEY = 'student_uploads';

export const MAX_PDF_MB = 3;   // warn above this
export const MAX_PDF_BYTES = MAX_PDF_MB * 1024 * 1024;

/** Open a stored base64 PDF in a new browser tab */
export function openBase64Pdf(base64DataUrl: string, title: string) {
  const byteString = atob(base64DataUrl.split(',')[1] ?? base64DataUrl);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  const blob = new Blob([ab], { type: 'application/pdf' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (!win) return;
  // revoke after delay to allow the tab to load
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
  win.document.title = title;
}
