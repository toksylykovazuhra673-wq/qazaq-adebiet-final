export interface Author {
  id: number;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  years: string;
  birthplace: string;
  description: string;
  image: string;
  works: string[];
  featured: boolean;
  popular: boolean;
}

export interface Work {
  id: number;
  title: string;
  authorId: number;
  authorName: string | null;
  category: string;
  categoryLabel: string;
  year: number;
  description: string;
  genre: string;
  pages: number;
  featured: boolean;
  recent: boolean;
}

export interface Category {
  id: string;
  label: string;
  description: string;
  icon: string;
  count: number;
  color: string;
}

export interface Stats {
  authors: number;
  works: number;
  tests: number;
  games: number;
}

export interface RecentMaterial {
  id: number;
  type: 'work' | 'test' | 'game';
  title: string;
  author: string | null;
  category: string;
  addedDate: string;
  description: string;
}
