import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ── Users ────────────────────────────────────────────────────────────────────
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Оқушы"),
  email: text("email").notNull().default("learner@example.com"),
  role: text("role").notNull().default("student"),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  avatar: text("avatar").notNull().default("A"),
  bio: text("bio"),
  educationLevel: text("education_level"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, joinedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

// ── Courses ──────────────────────────────────────────────────────────────────
export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(), // grade1-11, college, university, olympiad, teacher, researcher
  category: text("category").notNull(),
  duration: integer("duration").notNull().default(60),
  difficulty: text("difficulty").notNull().default("beginner"),
  xpReward: integer("xp_reward").notNull().default(100),
  coverColor: text("cover_color").notNull().default("#6366f1"),
  coverIcon: text("cover_icon"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true, createdAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;

// ── Lessons ──────────────────────────────────────────────────────────────────
export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id),
  title: text("title").notNull(),
  type: text("type").notNull().default("theory"), // theory, practice, test, vocabulary, listening
  order: integer("order").notNull().default(1),
  duration: integer("duration").notNull().default(15),
  xpReward: integer("xp_reward").notNull().default(20),
  content: text("content").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true, createdAt: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;

// ── Exercises ────────────────────────────────────────────────────────────────
export const exercisesTable = pgTable("exercises", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id),
  type: text("type").notNull().default("multiple_choice"), // multiple_choice, fill_blank, match, translate, audio
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  order: integer("order").notNull().default(1),
});

export const insertExerciseSchema = createInsertSchema(exercisesTable).omit({ id: true });
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercisesTable.$inferSelect;

// ── User Progress ────────────────────────────────────────────────────────────
export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().default(1),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id),
  completed: boolean("completed").notNull().default(false),
  score: integer("score").notNull().default(0),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertProgressSchema = createInsertSchema(progressTable).omit({ id: true, completedAt: true });
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progressTable.$inferSelect;

// ── Vocabulary ───────────────────────────────────────────────────────────────
export const vocabularyTable = pgTable("vocabulary", {
  id: serial("id").primaryKey(),
  kazakh: text("kazakh").notNull(),
  russian: text("russian").notNull(),
  english: text("english"),
  category: text("category").notNull(),
  level: text("level").notNull().default("grade1"),
  examples: jsonb("examples").$type<string[]>(),
  audioUrl: text("audio_url"),
});

export const insertVocabSchema = createInsertSchema(vocabularyTable).omit({ id: true });
export type InsertVocab = z.infer<typeof insertVocabSchema>;
export type Vocab = typeof vocabularyTable.$inferSelect;

// ── Grammar Rules ────────────────────────────────────────────────────────────
export const grammarTable = pgTable("grammar", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  level: text("level").notNull(),
  topic: text("topic").notNull(),
  description: text("description").notNull(),
  examples: jsonb("examples").$type<{ kazakh: string; translation: string; highlight?: string }[]>().notNull().default([]),
  relatedRules: jsonb("related_rules").$type<number[]>(),
});

export const insertGrammarSchema = createInsertSchema(grammarTable).omit({ id: true });
export type InsertGrammar = z.infer<typeof insertGrammarSchema>;
export type Grammar = typeof grammarTable.$inferSelect;

// ── Achievements ─────────────────────────────────────────────────────────────
export const achievementsTable = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  xpRequired: integer("xp_required").notNull().default(0),
  category: text("category").notNull().default("learning"),
  color: text("color"),
});

// ── User Achievements ─────────────────────────────────────────────────────────
export const userAchievementsTable = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().default(1),
  achievementId: integer("achievement_id").notNull().references(() => achievementsTable.id),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

// ── Activity Feed ─────────────────────────────────────────────────────────────
export const activityTable = pgTable("activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().default(1),
  type: text("type").notNull(), // lesson_complete, achievement, streak, course_complete
  title: text("title").notNull(),
  description: text("description").notNull(),
  xp: integer("xp").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
