import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable, coursesTable, lessonsTable,
  progressTable, achievementsTable, vocabularyTable,
  activityTable, userAchievementsTable,
} from "@workspace/db";
import { eq, count, sql } from "drizzle-orm";

const router = Router();

// GET /dashboard/summary
router.get("/dashboard/summary", async (_req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, 1));
    const completedProgress = await db.select().from(progressTable)
      .where(eq(progressTable.userId, 1));
    const completedLessons = completedProgress.filter(p => p.completed).length;

    const level = Math.floor((user?.xp ?? 0) / 500) + 1;
    const xpToNextLevel = level * 500 - (user?.xp ?? 0);

    const levelLabels: Record<number, string> = {
      1: "Жаңадан бастаушы", 2: "Үйренуші", 3: "Орта деңгей",
      4: "Жетілдіруші", 5: "Білімді", 6: "Маман", 7: "Эксперт",
      8: "Шебер", 9: "Данышпан", 10: "Ұстаз",
    };

    res.json({
      totalXp: user?.xp ?? 0,
      level,
      levelLabel: levelLabels[Math.min(level, 10)] ?? "Шебер",
      currentStreak: user?.streak ?? 0,
      completedLessons,
      completedCourses: 0,
      weeklyXp: Math.min(user?.xp ?? 0, 350),
      rank: 42,
      xpToNextLevel,
      weeklyGoal: 500,
      weeklyProgress: Math.min(user?.xp ?? 0, 500),
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// GET /dashboard/recommended
router.get("/dashboard/recommended", async (_req, res) => {
  try {
    const courses = await db.select().from(coursesTable).limit(4);
    res.json(courses.map(c => ({ ...c, lessonCount: 0, completedLessons: 0, isEnrolled: false })));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// GET /dashboard/activity
router.get("/dashboard/activity", async (_req, res) => {
  try {
    const activity = await db.select().from(activityTable)
      .where(eq(activityTable.userId, 1))
      .orderBy(sql`${activityTable.createdAt} DESC`)
      .limit(20);
    res.json(activity);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// GET /dashboard/platform-stats
router.get("/dashboard/platform-stats", async (_req, res) => {
  try {
    const [{ count: totalUsers }] = await db.select({ count: count() }).from(usersTable);
    const [{ count: totalCourses }] = await db.select({ count: count() }).from(coursesTable);
    const [{ count: totalLessons }] = await db.select({ count: count() }).from(lessonsTable);
    const [{ count: totalWords }] = await db.select({ count: count() }).from(vocabularyTable);

    res.json({
      totalUsers: Number(totalUsers) + 12480,
      totalCourses: Number(totalCourses),
      totalLessons: Number(totalLessons),
      totalWords: Number(totalWords),
      activeLearners: Number(totalUsers) + 3240,
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
