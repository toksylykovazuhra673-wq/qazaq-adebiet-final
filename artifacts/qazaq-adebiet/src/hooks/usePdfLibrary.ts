import { useState, useEffect, useCallback } from 'react';
import staticBooks from '@/data/pdf-library.json';
import type { PdfBook } from '@/types/pdf-reader';
import { getAllUploadedBooks, deleteUploadedBook, type StoredPdfBook } from '@/db/pdfStorage';

export type AnyBook = PdfBook | StoredPdfBook;

export function usePdfLibrary() {
  const [uploaded, setUploaded] = useState<StoredPdfBook[]>([]);
  const [loading,  setLoading]  = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const books = await getAllUploadedBooks();
      setUploaded(books);
    } catch {
      setUploaded([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const all: AnyBook[] = [
    ...(staticBooks as PdfBook[]),
    ...uploaded,
  ];

  const removeBook = useCallback(async (slug: string) => {
    await deleteUploadedBook(slug);
    await reload();
  }, [reload]);

  return { all, uploaded, static: staticBooks as PdfBook[], loading, reload, removeBook };
}
