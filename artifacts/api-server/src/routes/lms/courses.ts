import { Router } from "express";
import { db } from "@workspace/db";
import { coursesTable, progressTable, lessonsTable } from "@workspace/db";
import { eq, ilike, and, sql } from "drizzle-orm";
import {
  ListCoursesQueryParams,
  CreateCourseBody,
  GetCourseParams,
} from "@workspace/api-zod";

const router = Router();

// GET /courses
router.get("/courses", async (req, res) => {
  try {
    const { level, category, search } = ListCoursesQueryParams.parse(req.query);
    const conditions = [];
    if (level) conditions.push(eq(coursesTable.level, level));
    if (category) conditions.push(eq(coursesTable.category, category));
    if (search) conditions.push(ilike(coursesTable.title, `%${search}%`));

    const courses = await db
      .select()
      .from(coursesTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(coursesTable.id);

    const allLessons = await db.select({ courseId: lessonsTable.courseId, id: lessonsTable.id }).from(lessonsTable);
    const allProgress = await db.select({ lessonId: progressTable.lessonId }).from(progressTable).where(eq(progressTable.userId, 1));

    const lessonsByCourse: Record<number, number[]> = {};
    for (const l of allLessons) {
      if (!lessonsByCourse[l.courseId]) lessonsByCourse[l.courseId] = [];
      lessonsByCourse[l.courseId].push(l.id);
    }
    const completedSet = new Set(allProgress.map(p => p.lessonId));

    res.json(courses.map(c => ({
      ...c,
      lessonCount: lessonsByCourse[c.id]?.length ?? 0,
      completedLessons: lessonsByCourse[c.id]?.filter(id => completedSet.has(id)).length ?? 0,
      isEnrolled: (lessonsByCourse[c.id]?.some(id => completedSet.has(id))) ?? false,
    })));
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// POST /courses
router.post("/courses", async (req, res) => {
  try {
    const body = CreateCourseBody.parse(req.body);
    const [course] = await db.insert(coursesTable).values(body).returning();
    res.status(201).json({ ...course, lessonCount: 0, completedLessons: 0, isEnrolled: false });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// GET /courses/featured
router.get("/courses/featured", async (_req, res) => {
  try {
    const courses = await db.select().from(coursesTable).where(eq(coursesTable.featured, true)).limit(6);
    res.json(courses.map(c => ({ ...c, lessonCount: 0, completedLessons: 0, isEnrolled: false })));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// GET /courses/by-level
router.get("/courses/by-level", async (_req, res) => {
  try {
    const courses = await db.select().from(coursesTable).orderBy(coursesTable.level);
    type CourseItem = { id: number; title: string; description: string; level: string; category: string; duration: number; difficulty: string; xpReward: number; coverColor: string; coverIcon: string | null; lessonCount: number; completedLessons: number; isEnrolled: boolean };
    const levels: Record<string, { level: string; label: string; courses: CourseItem[] }> = {};
    const labelMap: Record<string, string> = {
      grade1: "1-сынып", grade2: "2-сынып", grade3: "3-сынып",
      grade4: "4-сынып", grade5: "5-сынып", grade6: "6-сынып",
      grade7: "7-сынып", grade8: "8-сынып", grade9: "9-сынып",
      grade10: "10-сынып", grade11: "11-сынып",
      college: "Колледж", university: "Жоғары оқу орны",
      olympiad: "Олимпиада", teacher: "Мұғалімдер", researcher: "Ғылыми зерттеу",
    };
    for (const c of courses) {
      if (!levels[c.level]) levels[c.level] = { level: c.level, label: labelMap[c.level] ?? c.level, courses: [] };
      levels[c.level].courses.push({ id: c.id, title: c.title, description: c.description, level: c.level, category: c.category, duration: c.duration, difficulty: c.difficulty as "beginner"|"intermediate"|"advanced", xpReward: c.xpReward, coverColor: c.coverColor, coverIcon: c.coverIcon ?? null, lessonCount: 0, completedLessons: 0, isEnrolled: false });
    }
    res.json(Object.values(levels));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// GET /courses/:courseId
router.get("/courses/:courseId", async (req, res) => {
  try {
    const { courseId } = GetCourseParams.parse(req.params);
    const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId));
    if (!course) { res.status(404).json({ error: "Not found" }); return; }
    const lessons = await db.select().from(lessonsTable).where(eq(lessonsTable.courseId, courseId));
    const progress = await db.select().from(progressTable).where(and(eq(progressTable.userId, 1)));
    const completedSet = new Set(progress.map(p => p.lessonId));
    const result = { id: course.id, title: course.title, description: course.description, level: course.level, category: course.category, duration: course.duration, difficulty: course.difficulty as "beginner"|"intermediate"|"advanced", xpReward: course.xpReward, coverColor: course.coverColor, coverIcon: course.coverIcon ?? null, featured: course.featured, lessonCount: lessons.length, completedLessons: lessons.filter(l => completedSet.has(l.id)).length, isEnrolled: lessons.some(l => completedSet.has(l.id)) };
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

export default router;
