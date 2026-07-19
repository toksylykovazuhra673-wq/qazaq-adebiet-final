---
name: digital-reader-null-guards
description: Runtime null/undefined guards needed in digital reader components due to books.json field mismatch.
---

## Pattern
books.json does NOT have `fullText`, `readingTimeMin`, `listeningTimeMin`, or `views` fields.
The Book TypeScript type has these fields, but the cast from JSON gives undefined at runtime.

## Required guards
- `(book.fullText ?? []).map(...)` — not `book.fullText.map(...)`
- `(book.fullText ?? []).forEach(...)` — not `book.fullText.forEach(...)`
- `(book.fullText ?? []).length` — not `book.fullText.length`
- `(book.readingTimeMin ?? 0) * ...` — not `book.readingTimeMin * ...`
- `fmtTime(n: number | undefined | null)` — check `!n || !isFinite(n)` before using
- `fmtViews(n: number | undefined | null)` — same pattern
- `buildTOC(paragraphs: string[] | undefined)` — guard with `if (!paragraphs || !Array.isArray(paragraphs)) return []`

**Why:** TypeScript doesn't catch these because the type cast at import site silences the mismatch. Runtime crashes with "Cannot read properties of undefined".
