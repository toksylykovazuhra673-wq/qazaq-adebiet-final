import { openDB, type IDBPDatabase } from 'idb';
import type { PdfBook } from '@/types/pdf-reader';

const DB_NAME    = 'qazaq-adebiet-pdfs';
const DB_VERSION = 1;

export interface StoredPdfBook extends PdfBook {
  blobKey: string;     // key in the 'blobs' store
  addedAt: string;
  fileSize: number;
  userUploaded: true;
}

interface PdfDB {
  books: {
    key: string;
    value: StoredPdfBook;
    indexes: { 'by-slug': string };
  };
  blobs: {
    key: string;
    value: { key: string; data: ArrayBuffer };
  };
}

let _db: IDBPDatabase<PdfDB> | null = null;

async function getDb(): Promise<IDBPDatabase<PdfDB>> {
  if (_db) return _db;
  _db = await openDB<PdfDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const bookStore = db.createObjectStore('books', { keyPath: 'slug' });
      bookStore.createIndex('by-slug', 'slug');
      db.createObjectStore('blobs', { keyPath: 'key' });
    },
  });
  return _db;
}

export async function saveUploadedPdf(
  book: Omit<StoredPdfBook, 'blobKey'>,
  fileData: ArrayBuffer,
): Promise<void> {
  const db = await getDb();
  const blobKey = `blob-${book.slug}`;
  const tx = db.transaction(['books', 'blobs'], 'readwrite');
  await tx.objectStore('blobs').put({ key: blobKey, data: fileData });
  await tx.objectStore('books').put({ ...book, blobKey, userUploaded: true });
  await tx.done;
}

export async function getAllUploadedBooks(): Promise<StoredPdfBook[]> {
  const db = await getDb();
  return db.getAll('books');
}

export async function getUploadedBook(slug: string): Promise<StoredPdfBook | undefined> {
  const db = await getDb();
  return db.get('books', slug);
}

export async function getObjectUrl(slug: string): Promise<string | null> {
  const db = await getDb();
  const book = await db.get('books', slug);
  if (!book) return null;
  const blob = await db.get('blobs', book.blobKey);
  if (!blob) return null;
  return URL.createObjectURL(new Blob([blob.data], { type: 'application/pdf' }));
}

export async function deleteUploadedBook(slug: string): Promise<void> {
  const db = await getDb();
  const book = await db.get('books', slug);
  if (!book) return;
  const tx = db.transaction(['books', 'blobs'], 'readwrite');
  await tx.objectStore('books').delete(slug);
  await tx.objectStore('blobs').delete(book.blobKey);
  await tx.done;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u0400-\u04ff]/g, c => c)
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0400-\u04ff-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 60);
}
