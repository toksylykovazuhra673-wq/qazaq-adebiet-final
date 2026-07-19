export type CabTab =
  | 'dashboard'
  | 'library'
  | 'tests'
  | 'progress'
  | 'certificates'
  | 'olympiad';

export interface StudentProfile {
  name: string;
  grade: string;
  school: string;
}

export interface ReadingRecord {
  bookSlug: string;
  textProgress: number;
  pdfPage: number;
  audioTime: number;
  isFavorite: boolean;
  lastActiveTab: string;
}

export interface TestRecord {
  taskId: string;
  taskTitle: string;
  score: number;
  points: number;
  correct: boolean;
  time: number;
  completedAt: number;
}

export type CertType = 'book_read' | 'test_ace' | 'achievement' | 'streak';

export interface Certificate {
  id: string;
  title: string;
  subtitle: string;
  type: CertType;
  earnedAt: number;
  icon?: string;
  color?: string;
}
