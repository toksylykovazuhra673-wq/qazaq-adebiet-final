import { Router } from "express";
import { db } from "@workspace/db";
import { grammarTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListGrammarRulesQueryParams,
  CreateGrammarRuleBody,
  GetGrammarRuleParams,
} from "@workspace/api-zod";

const router = Router();

// GET /grammar
router.get("/grammar", async (req, res) => {
  try {
    const { level, topic } = ListGrammarRulesQueryParams.parse(req.query);
    const conditions = [];
    if (level) conditions.push(eq(grammarTable.level, level));
    if (topic) conditions.push(eq(grammarTable.topic, topic));

    const rules = await db.select().from(grammarTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(grammarTable.id);

    res.json(rules);
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// POST /grammar
router.post("/grammar", async (req, res) => {
  try {
    const body = CreateGrammarRuleBody.parse(req.body);
    const [rule] = await db.insert(grammarTable).values({ ...body, examples: [] }).returning();
    res.status(201).json(rule);
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// GET /grammar/:ruleId
router.get("/grammar/:ruleId", async (req, res) => {
  try {
    const { ruleId } = GetGrammarRuleParams.parse(req.params);
    const [rule] = await db.select().from(grammarTable).where(eq(grammarTable.id, ruleId));
    if (!rule) { res.status(404).json({ error: "Not found" }); return; }
    res.json(rule);
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

export default router;
