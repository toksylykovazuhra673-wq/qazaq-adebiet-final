import { Router } from "express";
import { db } from "@workspace/db";
import { vocabularyTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import { ListVocabularyQueryParams, CreateVocabWordBody } from "@workspace/api-zod";

const router = Router();

// GET /vocabulary
router.get("/vocabulary", async (req, res) => {
  try {
    const { category, level, search } = ListVocabularyQueryParams.parse(req.query);
    const conditions = [];
    if (category) conditions.push(eq(vocabularyTable.category, category));
    if (level) conditions.push(eq(vocabularyTable.level, level));
    if (search) conditions.push(ilike(vocabularyTable.kazakh, `%${search}%`));

    const words = await db.select().from(vocabularyTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(vocabularyTable.id);

    res.json(words);
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// POST /vocabulary
router.post("/vocabulary", async (req, res) => {
  try {
    const body = CreateVocabWordBody.parse(req.body);
    const [word] = await db.insert(vocabularyTable).values(body).returning();
    res.status(201).json(word);
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// GET /vocabulary/categories
router.get("/vocabulary/categories", async (_req, res) => {
  try {
    const words = await db.select({ category: vocabularyTable.category }).from(vocabularyTable);
    const counts: Record<string, number> = {};
    for (const w of words) {
      counts[w.category] = (counts[w.category] ?? 0) + 1;
    }
    const labelMap: Record<string, { label: string; color: string }> = {
      family: { label: "Отбасы", color: "#f59e0b" },
      nature: { label: "Табиғат", color: "#10b981" },
      body: { label: "Дене мүшелері", color: "#ef4444" },
      food: { label: "Тамақ", color: "#f97316" },
      colors: { label: "Түстер", color: "#8b5cf6" },
      numbers: { label: "Сандар", color: "#3b82f6" },
      time: { label: "Уақыт", color: "#06b6d4" },
      school: { label: "Мектеп", color: "#6366f1" },
      city: { label: "Қала", color: "#84cc16" },
      profession: { label: "Мамандық", color: "#ec4899" },
    };
    res.json(Object.entries(counts).map(([name, count]) => ({
      name,
      label: labelMap[name]?.label ?? name,
      count,
      color: labelMap[name]?.color ?? "#6366f1",
    })));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
