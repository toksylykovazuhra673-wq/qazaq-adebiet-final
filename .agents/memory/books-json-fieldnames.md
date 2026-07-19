---
name: books-json-fieldnames
description: Actual field names in books.json vs Book type; mismatch causes silent undefined at runtime.
---

books.json actual fields: `id` (=slug), `authorName`, `pdfAvailable`, `audioAvailable`, `viewCount`, `rating`, `gradeLevel`, `year`, `title`, `genre`, `description`.

Book type in src/types/book.ts expects: `slug`, `author`, `pdf`, `audio`, `views`, `fullText`, etc.

**Why:** The JSON was created before the TypeScript type was finalized. useDigitalReader casts rawBooks as `Book[]` which silently gives undefined for mismatched fields.

**How to apply:** When reading book fields in components, always use `book.authorName ?? book.author ?? '—'`, `book.pdfAvailable`, `(book.fullText ?? [])`, `(book.readingTimeMin ?? 0)`, `(book.views ?? book.viewCount ?? 0)`.
