import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { UpdateUserProfileBody, GetLeaderboardQueryParams } from "@workspace/api-zod";

const router = Router();

// GET /leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const { period } = GetLeaderboardQueryParams.parse(req.query);
    const users = await db.select().from(usersTable).orderBy(desc(usersTable.xp)).limit(20);
    res.json(users.map((u, idx) => ({
      rank: idx + 1,
      userId: u.id,
      name: u.name,
      xp: u.xp,
      level: Math.floor(u.xp / 500) + 1,
      streak: u.streak,
      avatar: u.avatar,
    })));
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// GET /users/profile
router.get("/users/profile", async (_req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, 1));
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.json({
      ...user,
      level: Math.floor(user.xp / 500) + 1,
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// PATCH /users/profile
router.patch("/users/profile", async (req, res) => {
  try {
    const body = UpdateUserProfileBody.parse(req.body);
    const [user] = await db.update(usersTable)
      .set(body)
      .where(eq(usersTable.id, 1))
      .returning();
    res.json({ ...user, level: Math.floor(user.xp / 500) + 1 });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

export default router;
