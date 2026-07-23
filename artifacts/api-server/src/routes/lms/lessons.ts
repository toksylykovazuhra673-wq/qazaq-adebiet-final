import { Router } from "express";
import { db } from "@workspace/db";
import { lessonsTable, exercisesTable, progressTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  CreateLessonBody,
  GetLessonParams,
  ListCourseLessonsParams,
} from "@workspace/api-zod";

const router = Router();

// GET /courses/:courseId/lessons
router.get("/courses/:courseId/lessons", async (req, res) => {
  try {
    const { courseId } = ListCourseLessonsParams.parse(req.params);
    const lessons = await db
      .select()
      .from(lessonsTable)
      .where(eq(lessonsTable.courseId, courseId))
      .orderBy(lessonsTable.order);

    const progress = await db.select().from(progressTable).where(eq(progressTable.userId, 1));
    const completedSet = new Set(progress.map(p => p.lessonId));

    res.json(lessons.map((l, idx) => ({
      ...l,
      isCompleted: completedSet.has(l.id),
      isLocked: idx > 0 && !completedSet.has(lessons[idx - 1].id),
    })));
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// POST /lessons
router.post("/lessons", async (req, res) => {
  try {
    const body = CreateLessonBody.parse(req.body);
    const [lesson] = await db.insert(lessonsTable).values(body).returning();
    res.status(201).json({ ...lesson, isCompleted: false, isLocked: false });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// GET /lessons/:lessonId
router.get("/lessons/:lessonId", async (req, res) => {
  try {
    const { lessonId } = GetLessonParams.parse(req.params);
    const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, lessonId));
    if (!lesson) { res.status(404).json({ error: "Not found" }); return; }

    const exercises = await db
      .select()
      .from(exercisesTable)
      .where(eq(exercisesTable.lessonId, lessonId))
      .orderBy(exercisesTable.order);

    const [prog] = await db.select().from(progressTable)
      .where(and(eq(progressTable.userId, 1), eq(progressTable.lessonId, lessonId)));

    res.json({
      ...lesson,
      isCompleted: prog?.completed ?? false,
      exercises: exercises.map(e => ({
        id: e.id,
        lessonId: e.lessonId,
        type: e.type,
        question: e.question,
        options: e.options ?? null,
        order: e.order,
        explanation: e.explanation ?? null,
      })),
    });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

export default router;
