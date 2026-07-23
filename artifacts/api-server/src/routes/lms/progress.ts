import { Router } from "express";
import { db } from "@workspace/db";
import { progressTable, activityTable, lessonsTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { SaveProgressBody } from "@workspace/api-zod";

const router = Router();

// GET /progress
router.get("/progress", async (_req, res) => {
  try {
    const progress = await db.select().from(progressTable).where(eq(progressTable.userId, 1));
    res.json(progress);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// POST /progress
router.post("/progress", async (req, res) => {
  try {
    const { lessonId, completed, score } = SaveProgressBody.parse(req.body);

    // Upsert progress
    const [existing] = await db.select().from(progressTable)
      .where(and(eq(progressTable.userId, 1), eq(progressTable.lessonId, lessonId)));

    let prog;
    if (existing) {
      [prog] = await db.update(progressTable)
        .set({ completed, score, completedAt: new Date() })
        .where(eq(progressTable.id, existing.id))
        .returning();
    } else {
      [prog] = await db.insert(progressTable)
        .values({ userId: 1, lessonId, completed, score })
        .returning();
    }

    if (completed) {
      const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, lessonId));
      const xp = lesson?.xpReward ?? 20;
      await db.execute(`UPDATE users SET xp = xp + ${xp}, streak = GREATEST(streak, 1) WHERE id = 1`);
      await db.insert(activityTable).values({
        userId: 1,
        type: "lesson_complete",
        title: `Сабақ аяқталды: ${lesson?.title ?? "Сабақ"}`,
        description: `${score}% нәтиже`,
        xp,
      });
    }

    res.status(201).json(prog);
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// GET /progress/streak
router.get("/progress/streak", async (_req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, 1));
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const level = Math.floor(user.xp / 500) + 1;
    const xpToNextLevel = level * 500 - user.xp;

    res.json({
      currentStreak: user.streak,
      longestStreak: user.streak,
      totalXp: user.xp,
      level,
      xpToNextLevel,
      todayCompleted: false,
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
