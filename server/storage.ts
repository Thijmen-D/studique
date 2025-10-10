import { 
  type User, type InsertUser, type UpsertUser,
  type Habit, type InsertHabit,
  type Todo, type InsertTodo,
  type Subject, type InsertSubject,
  type Grade, type InsertGrade, type GradeWithSubject,
  type Exam, type InsertExam, type ExamWithSubject,
  type Mood, type InsertMood,
  type UserSettings, type InsertUserSettings,
  users, habits, todos, subjects, grades, exams, moods, userSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

export interface IStorage {
  sessionStore: session.Store;
  
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Habits
  getHabits(userId: string): Promise<Habit[]>;
  getHabit(id: string): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit, userId: string): Promise<Habit>;
  updateHabit(id: string, habit: Partial<InsertHabit>): Promise<Habit | undefined>;
  deleteHabit(id: string): Promise<boolean>;
  toggleHabit(id: string, date: string): Promise<Habit | undefined>;
  
  // Todos
  getTodos(userId: string): Promise<Todo[]>;
  createTodo(todo: InsertTodo, userId: string): Promise<Todo>;
  updateTodo(id: string, todo: Partial<InsertTodo>): Promise<Todo | undefined>;
  deleteTodo(id: string): Promise<boolean>;
  
  // Subjects
  getSubjects(userId: string): Promise<Subject[]>;
  getSubject(id: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject, userId: string): Promise<Subject>;
  updateSubject(id: string, subject: Partial<InsertSubject>): Promise<Subject | undefined>;
  deleteSubject(id: string): Promise<boolean>;
  
  // Grades
  getGrades(userId: string): Promise<GradeWithSubject[]>;
  getGradesBySubject(subjectId: string): Promise<Grade[]>;
  createGrade(grade: InsertGrade, userId: string): Promise<Grade>;
  updateGrade(id: string, grade: Partial<InsertGrade>): Promise<Grade | undefined>;
  deleteGrade(id: string): Promise<boolean>;
  
  // Exams
  getExams(userId: string): Promise<ExamWithSubject[]>;
  getExam(id: string): Promise<ExamWithSubject | undefined>;
  createExam(exam: InsertExam, userId: string): Promise<Exam>;
  updateExam(id: string, exam: Partial<InsertExam>): Promise<Exam | undefined>;
  deleteExam(id: string): Promise<boolean>;
  
  // Moods
  getMoods(userId: string): Promise<Mood[]>;
  getMoodByDate(userId: string, date: string): Promise<Mood | undefined>;
  createMood(mood: InsertMood, userId: string): Promise<Mood>;
  updateMood(id: string, mood: Partial<InsertMood>): Promise<Mood | undefined>;
  
  // User Settings
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings, userId: string): Promise<UserSettings>;
  updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
      ttl: 7 * 24 * 60 * 60,
      tableName: "sessions",
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Habits
  async getHabits(userId: string): Promise<Habit[]> {
    return await db.select().from(habits).where(eq(habits.userId, userId));
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    return habit || undefined;
  }

  async createHabit(habit: InsertHabit, userId: string): Promise<Habit> {
    const [newHabit] = await db
      .insert(habits)
      .values({
        userId,
        name: habit.name,
        priority: habit.priority || 'medium',
      })
      .returning();
    return newHabit;
  }

  async updateHabit(id: string, habit: Partial<InsertHabit>): Promise<Habit | undefined> {
    const [updated] = await db
      .update(habits)
      .set(habit)
      .where(eq(habits.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteHabit(id: string): Promise<boolean> {
    const result = await db.delete(habits).where(eq(habits.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async toggleHabit(id: string, date: string): Promise<Habit | undefined> {
    const habit = await this.getHabit(id);
    if (!habit) return undefined;

    const dateIndex = habit.completedDates.indexOf(date);
    let updatedDates = [...habit.completedDates];
    let streak = habit.streak;
    let lastCompleted = habit.lastCompleted;

    if (dateIndex >= 0) {
      updatedDates.splice(dateIndex, 1);
      if (date === habit.lastCompleted) {
        streak = Math.max(0, streak - 1);
        lastCompleted = null;
      }
    } else {
      updatedDates.push(date);
      const today = new Date(date);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (!lastCompleted || habit.completedDates.includes(yesterdayStr)) {
        streak += 1;
      } else {
        streak = 1;
      }
      lastCompleted = date;
    }

    const [updated] = await db
      .update(habits)
      .set({
        completedDates: updatedDates,
        streak,
        lastCompleted
      })
      .where(eq(habits.id, id))
      .returning();
    
    return updated || undefined;
  }

  // Todos
  async getTodos(userId: string): Promise<Todo[]> {
    return await db.select().from(todos).where(eq(todos.userId, userId));
  }

  async createTodo(todo: InsertTodo, userId: string): Promise<Todo> {
    const [newTodo] = await db
      .insert(todos)
      .values({ ...todo, userId })
      .returning();
    return newTodo;
  }

  async updateTodo(id: string, todo: Partial<InsertTodo>): Promise<Todo | undefined> {
    const [updated] = await db
      .update(todos)
      .set(todo)
      .where(eq(todos.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTodo(id: string): Promise<boolean> {
    const result = await db.delete(todos).where(eq(todos.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Subjects
  async getSubjects(userId: string): Promise<Subject[]> {
    return await db.select().from(subjects).where(eq(subjects.userId, userId));
  }

  async getSubject(id: string): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject || undefined;
  }

  async createSubject(subject: InsertSubject, userId: string): Promise<Subject> {
    const [newSubject] = await db
      .insert(subjects)
      .values({
        userId,
        name: subject.name,
        color: subject.color || '#4287f5',
      })
      .returning();
    return newSubject;
  }

  async updateSubject(id: string, subject: Partial<InsertSubject>): Promise<Subject | undefined> {
    const [updated] = await db
      .update(subjects)
      .set(subject)
      .where(eq(subjects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSubject(id: string): Promise<boolean> {
    const result = await db.delete(subjects).where(eq(subjects.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Grades
  async getGrades(userId: string): Promise<GradeWithSubject[]> {
    const result = await db
      .select()
      .from(grades)
      .leftJoin(subjects, eq(grades.subjectId, subjects.id))
      .where(eq(grades.userId, userId));
    
    return result.map(row => ({
      ...row.grades,
      subject: row.subjects!
    }));
  }

  async getGradesBySubject(subjectId: string): Promise<Grade[]> {
    return await db.select().from(grades).where(eq(grades.subjectId, subjectId));
  }

  async createGrade(grade: InsertGrade, userId: string): Promise<Grade> {
    const [newGrade] = await db
      .insert(grades)
      .values({
        userId,
        value: grade.value,
        subjectId: grade.subjectId,
        weight: grade.weight || 1,
        description: grade.description || null,
      })
      .returning();
    return newGrade;
  }

  async updateGrade(id: string, grade: Partial<InsertGrade>): Promise<Grade | undefined> {
    const [updated] = await db
      .update(grades)
      .set(grade)
      .where(eq(grades.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteGrade(id: string): Promise<boolean> {
    const result = await db.delete(grades).where(eq(grades.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Exams
  async getExams(userId: string): Promise<ExamWithSubject[]> {
    const result = await db
      .select()
      .from(exams)
      .leftJoin(subjects, eq(exams.subjectId, subjects.id))
      .where(eq(exams.userId, userId));
    
    return result.map(row => ({
      ...row.exams,
      subject: row.subjects!
    }));
  }

  async getExam(id: string): Promise<ExamWithSubject | undefined> {
    const result = await db
      .select()
      .from(exams)
      .leftJoin(subjects, eq(exams.subjectId, subjects.id))
      .where(eq(exams.id, id));
    
    if (result.length === 0) return undefined;
    
    return {
      ...result[0].exams,
      subject: result[0].subjects!
    };
  }

  async createExam(exam: InsertExam, userId: string): Promise<Exam> {
    const [newExam] = await db
      .insert(exams)
      .values({
        userId,
        title: exam.title,
        date: exam.date,
        subjectId: exam.subjectId,
        status: exam.status || 'not-started',
        progress: exam.progress || 0,
        difficulty: exam.difficulty || 'medium',
        weight: exam.weight || 1,
        notes: exam.notes || null,
      })
      .returning();
    return newExam;
  }

  async updateExam(id: string, exam: Partial<InsertExam>): Promise<Exam | undefined> {
    const [updated] = await db
      .update(exams)
      .set(exam)
      .where(eq(exams.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteExam(id: string): Promise<boolean> {
    const result = await db.delete(exams).where(eq(exams.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Moods
  async getMoods(userId: string): Promise<Mood[]> {
    return await db.select().from(moods).where(eq(moods.userId, userId));
  }

  async getMoodByDate(userId: string, date: string): Promise<Mood | undefined> {
    const [mood] = await db
      .select()
      .from(moods)
      .where(and(eq(moods.userId, userId), eq(moods.date, date)));
    return mood || undefined;
  }

  async createMood(mood: InsertMood, userId: string): Promise<Mood> {
    const [newMood] = await db
      .insert(moods)
      .values({ ...mood, userId })
      .returning();
    return newMood;
  }

  async updateMood(id: string, mood: Partial<InsertMood>): Promise<Mood | undefined> {
    const [updated] = await db
      .update(moods)
      .set(mood)
      .where(eq(moods.id, id))
      .returning();
    return updated || undefined;
  }

  // User Settings
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings || undefined;
  }

  async createUserSettings(settings: InsertUserSettings, userId: string): Promise<UserSettings> {
    const [newSettings] = await db
      .insert(userSettings)
      .values({
        userId,
        theme: settings.theme || 't1',
        darkMode: settings.darkMode || 'auto',
        darkModeSchedule: settings.darkModeSchedule !== undefined ? settings.darkModeSchedule : true,
        lightModeTime: settings.lightModeTime || '10:00',
        darkModeTime: settings.darkModeTime || '18:00',
        customColors: settings.customColors || null,
      })
      .returning();
    return newSettings;
  }

  async updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined> {
    const [updated] = await db
      .update(userSettings)
      .set(settings)
      .where(eq(userSettings.userId, userId))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
