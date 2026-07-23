import { Router } from "express";
import { db } from "@workspace/db";
import { exercisesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SubmitExerciseParams, SubmitExerciseBody } from "@workspace/api-zod";

const router = Router();

// POST /exercises/:exerciseId/submit
router.post("/exercises/:exerciseId/submit", async (req, res) => {
  try {
    const { exerciseId } = SubmitExerciseParams.parse(req.params);
    const { answer } = SubmitExerciseBody.parse(req.body);

    const [exercise] = await db.select().from(exercisesTable).where(eq(exercisesTable.id, exerciseId));
    if (!exercise) { res.status(404).json({ error: "Not found" }); return; }

    const correct = answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
    const xpEarned = correct ? 10 : 2;

    // Award XP to default user
    if (correct) {
      await db.execute(`UPDATE users SET xp = xp + ${xpEarned} WHERE id = 1`);
    }

    res.json({
      correct,
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation ?? null,
      xpEarned,
    });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

export default router;
