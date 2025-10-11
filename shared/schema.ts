import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, date, jsonb, index, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  priority: text("priority").notNull().default('medium'),
  streak: integer("streak").notNull().default(0),
  completedDates: text("completed_dates").array().notNull().default(sql`ARRAY[]::text[]`),
  lastCompleted: date("last_completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const todos = pgTable("todos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  color: text("color").notNull().default('#4287f5'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const grades = pgTable("grades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  value: real("value").notNull(),
  weight: integer("weight").notNull().default(1),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exams = pgTable("exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  date: date("date").notNull(),
  status: text("status").notNull().default('not-started'),
  progress: integer("progress").notNull().default(0),
  difficulty: text("difficulty").notNull().default('medium'),
  weight: integer("weight").notNull().default(1),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const moods = pgTable("moods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  mood: text("mood").notNull(),
  energy: integer("energy").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  theme: text("theme").notNull().default('t1'),
  darkMode: text("dark_mode").notNull().default('auto'),
  darkModeSchedule: boolean("dark_mode_schedule").notNull().default(true),
  lightModeTime: text("light_mode_time").notNull().default('10:00'),
  darkModeTime: text("dark_mode_time").notNull().default('18:00'),
  customColors: text("custom_colors"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UpsertUser = typeof users.$inferInsert;
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertHabitSchema = createInsertSchema(habits).omit({ id: true, userId: true, createdAt: true, streak: true, completedDates: true, lastCompleted: true });
export const insertTodoSchema = createInsertSchema(todos).omit({ id: true, userId: true, createdAt: true, completed: true, completedAt: true });
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true, userId: true, createdAt: true });
export const insertGradeSchema = createInsertSchema(grades).omit({ id: true, userId: true, createdAt: true }).extend({
  value: z.number().min(1).max(10, "Grade must be between 1 and 10"),
});
export const insertExamSchema = createInsertSchema(exams).omit({ id: true, userId: true, createdAt: true });
export const insertMoodSchema = createInsertSchema(moods).omit({ id: true, userId: true, createdAt: true });
export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({ id: true, userId: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;
export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type Todo = typeof todos.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Grade = typeof grades.$inferSelect;
export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof exams.$inferSelect;
export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Mood = typeof moods.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

export type GradeWithSubject = Grade & { subject: Subject };
export type ExamWithSubject = Exam & { subject: Subject };
export type SubjectWithGrades = Subject & { grades: Grade[] };
