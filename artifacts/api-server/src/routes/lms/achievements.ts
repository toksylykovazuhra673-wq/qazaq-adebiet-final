import { Router } from "express";
import { db } from "@workspace/db";
import { achievementsTable, userAchievementsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /achievements
router.get("/achievements", async (_req, res) => {
  try {
    const achievements = await db.select().from(achievementsTable).orderBy(achievementsTable.xpRequired);
    res.json(achievements);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// GET /achievements/user
router.get("/achievements/user", async (_req, res) => {
  try {
    const userAch = await db.select().from(userAchievementsTable).where(eq(userAchievementsTable.userId, 1));
    const achievementIds = userAch.map(ua => ua.achievementId);
    if (!achievementIds.length) { res.json([]); return; }

    const achievements = await db.select().from(achievementsTable);
    const achMap = Object.fromEntries(achievements.map(a => [a.id, a]));

    res.json(userAch.map(ua => ({
      achievement: achMap[ua.achievementId],
      earnedAt: ua.earnedAt,
    })).filter(ua => ua.achievement));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
