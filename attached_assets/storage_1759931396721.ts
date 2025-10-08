import { 
  type User, type InsertUser,
  type Habit, type InsertHabit,
  type Todo, type InsertTodo,
  type Subject, type InsertSubject,
  type Grade, type InsertGrade,
  type Exam, type InsertExam,
  type GradeWithSubject, type ExamWithSubject, type SubjectWithGrades,
  users, habits, todos, subjects, grades, exams
} from "@shared/schema";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Habits
  getUserHabits(userId: string): Promise<Habit[]>;
  createHabit(habit: InsertHabit & { userId: string }): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined>;
  deleteHabit(id: string): Promise<boolean>;

  // Todos
  getUserTodos(userId: string): Promise<Todo[]>;
  createTodo(todo: InsertTodo & { userId: string }): Promise<Todo>;
  updateTodo(id: string, updates: Partial<Todo>): Promise<Todo | undefined>;
  deleteTodo(id: string): Promise<boolean>;

  // Subjects
  getUserSubjects(userId: string): Promise<Subject[]>;
  createSubject(subject: InsertSubject & { userId: string }): Promise<Subject>;
  deleteSubject(id: string): Promise<boolean>;

  // Grades
  getUserGrades(userId: string): Promise<GradeWithSubject[]>;
  getSubjectGrades(subjectId: string): Promise<Grade[]>;
  createGrade(grade: InsertGrade & { userId: string }): Promise<Grade>;
  updateGrade(id: string, updates: Partial<Grade>): Promise<Grade | undefined>;
  deleteGrade(id: string): Promise<boolean>;

  // Exams
  getUserExams(userId: string): Promise<ExamWithSubject[]>;
  createExam(exam: InsertExam & { userId: string }): Promise<Exam>;
  updateExam(id: string, updates: Partial<Exam>): Promise<Exam | undefined>;
  deleteExam(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private habits: Map<string, Habit> = new Map();
  private todos: Map<string, Todo> = new Map();
  private subjects: Map<string, Subject> = new Map();
  private grades: Map<string, Grade> = new Map();
  private exams: Map<string, Exam> = new Map();

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Habits
  async getUserHabits(userId: string): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(habit => habit.userId === userId);
  }

  async createHabit(habitData: InsertHabit & { userId: string }): Promise<Habit> {
    const id = randomUUID();
    const habit: Habit = {
      ...habitData,
      id,
      priority: habitData.priority || 'medium',
      streak: 0,
      completedDates: [],
      lastCompleted: null,
      createdAt: new Date(),
    };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;
    
    const updatedHabit = { ...habit, ...updates };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: string): Promise<boolean> {
    return this.habits.delete(id);
  }

  // Todos
  async getUserTodos(userId: string): Promise<Todo[]> {
    return Array.from(this.todos.values()).filter(todo => todo.userId === userId);
  }

  async createTodo(todoData: InsertTodo & { userId: string }): Promise<Todo> {
    const id = randomUUID();
    const todo: Todo = {
      ...todoData,
      id,
      completed: false,
      completedAt: null,
      createdAt: new Date(),
    };
    this.todos.set(id, todo);
    return todo;
  }

  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo | undefined> {
    const todo = this.todos.get(id);
    if (!todo) return undefined;

    const updatedTodo = { ...todo, ...updates };
    if (updates.completed && !todo.completed) {
      updatedTodo.completedAt = new Date();
    } else if (updates.completed === false) {
      updatedTodo.completedAt = null;
    }
    
    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }

  async deleteTodo(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }

  // Subjects
  async getUserSubjects(userId: string): Promise<Subject[]> {
    return Array.from(this.subjects.values()).filter(subject => subject.userId === userId);
  }

  async createSubject(subjectData: InsertSubject & { userId: string }): Promise<Subject> {
    const id = randomUUID();
    const subject: Subject = {
      ...subjectData,
      id,
      createdAt: new Date(),
    };
    this.subjects.set(id, subject);
    return subject;
  }

  async deleteSubject(id: string): Promise<boolean> {
    // Also delete associated grades and exams
    const gradesToDelete = Array.from(this.grades.values()).filter(grade => grade.subjectId === id);
    const examsToDelete = Array.from(this.exams.values()).filter(exam => exam.subjectId === id);
    
    gradesToDelete.forEach(grade => this.grades.delete(grade.id));
    examsToDelete.forEach(exam => this.exams.delete(exam.id));
    
    return this.subjects.delete(id);
  }

  // Grades
  async getUserGrades(userId: string): Promise<GradeWithSubject[]> {
    const grades = Array.from(this.grades.values()).filter(grade => grade.userId === userId);
    return grades.map(grade => {
      const subject = this.subjects.get(grade.subjectId);
      return { ...grade, subject: subject! };
    });
  }

  async getSubjectGrades(subjectId: string): Promise<Grade[]> {
    return Array.from(this.grades.values()).filter(grade => grade.subjectId === subjectId);
  }

  async createGrade(gradeData: InsertGrade & { userId: string }): Promise<Grade> {
    const id = randomUUID();
    const grade: Grade = {
      ...gradeData,
      id,
      weight: gradeData.weight || 1,
      description: gradeData.description || null,
      createdAt: new Date(),
    };
    this.grades.set(id, grade);
    return grade;
  }

  async updateGrade(id: string, updates: Partial<Grade>): Promise<Grade | undefined> {
    const grade = this.grades.get(id);
    if (!grade) return undefined;
    
    const updatedGrade = { ...grade, ...updates };
    this.grades.set(id, updatedGrade);
    return updatedGrade;
  }

  async deleteGrade(id: string): Promise<boolean> {
    return this.grades.delete(id);
  }

  // Exams
  async getUserExams(userId: string): Promise<ExamWithSubject[]> {
    const exams = Array.from(this.exams.values()).filter(exam => exam.userId === userId);
    return exams.map(exam => {
      const subject = this.subjects.get(exam.subjectId);
      return { ...exam, subject: subject! };
    });
  }

  async createExam(examData: InsertExam & { userId: string }): Promise<Exam> {
    const id = randomUUID();
    const exam: Exam = {
      ...examData,
      id,
      status: examData.status || 'not-started',
      progress: examData.progress || 0,
      difficulty: examData.difficulty || 'medium',
      notes: examData.notes || null,
      createdAt: new Date(),
    };
    this.exams.set(id, exam);
    return exam;
  }

  async updateExam(id: string, updates: Partial<Exam>): Promise<Exam | undefined> {
    const exam = this.exams.get(id);
    if (!exam) return undefined;
    
    const updatedExam = { ...exam, ...updates };
    this.exams.set(id, updatedExam);
    return updatedExam;
  }

  async deleteExam(id: string): Promise<boolean> {
    return this.exams.delete(id);
  }
}

class PostgresStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not set");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Habits
  async getUserHabits(userId: string): Promise<Habit[]> {
    return await this.db.select().from(habits).where(eq(habits.userId, userId));
  }

  async createHabit(habitData: InsertHabit & { userId: string }): Promise<Habit> {
    const result = await this.db.insert(habits).values(habitData).returning();
    return result[0];
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    const result = await this.db.update(habits).set(updates).where(eq(habits.id, id)).returning();
    return result[0];
  }

  async deleteHabit(id: string): Promise<boolean> {
    const result = await this.db.delete(habits).where(eq(habits.id, id)).returning();
    return result.length > 0;
  }

  // Todos
  async getUserTodos(userId: string): Promise<Todo[]> {
    return await this.db.select().from(todos).where(eq(todos.userId, userId));
  }

  async createTodo(todoData: InsertTodo & { userId: string }): Promise<Todo> {
    const result = await this.db.insert(todos).values(todoData).returning();
    return result[0];
  }

  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo | undefined> {
    if (updates.completed !== undefined) {
      updates.completedAt = updates.completed ? new Date() : null;
    }
    const result = await this.db.update(todos).set(updates).where(eq(todos.id, id)).returning();
    return result[0];
  }

  async deleteTodo(id: string): Promise<boolean> {
    const result = await this.db.delete(todos).where(eq(todos.id, id)).returning();
    return result.length > 0;
  }

  // Subjects
  async getUserSubjects(userId: string): Promise<Subject[]> {
    return await this.db.select().from(subjects).where(eq(subjects.userId, userId));
  }

  async createSubject(subjectData: InsertSubject & { userId: string }): Promise<Subject> {
    const result = await this.db.insert(subjects).values(subjectData).returning();
    return result[0];
  }

  async deleteSubject(id: string): Promise<boolean> {
    // Delete associated grades and exams first
    await this.db.delete(grades).where(eq(grades.subjectId, id));
    await this.db.delete(exams).where(eq(exams.subjectId, id));
    const result = await this.db.delete(subjects).where(eq(subjects.id, id)).returning();
    return result.length > 0;
  }

  // Grades
  async getUserGrades(userId: string): Promise<GradeWithSubject[]> {
    const result = await this.db
      .select({
        id: grades.id,
        userId: grades.userId,
        subjectId: grades.subjectId,
        value: grades.value,
        weight: grades.weight,
        description: grades.description,
        createdAt: grades.createdAt,
        subject: subjects
      })
      .from(grades)
      .leftJoin(subjects, eq(grades.subjectId, subjects.id))
      .where(eq(grades.userId, userId));
    
    return result.map(row => ({
      ...row,
      subject: row.subject!
    }));
  }

  async getSubjectGrades(subjectId: string): Promise<Grade[]> {
    return await this.db.select().from(grades).where(eq(grades.subjectId, subjectId));
  }

  async createGrade(gradeData: InsertGrade & { userId: string }): Promise<Grade> {
    const result = await this.db.insert(grades).values(gradeData).returning();
    return result[0];
  }

  async updateGrade(id: string, updates: Partial<Grade>): Promise<Grade | undefined> {
    const result = await this.db.update(grades).set(updates).where(eq(grades.id, id)).returning();
    return result[0];
  }

  async deleteGrade(id: string): Promise<boolean> {
    const result = await this.db.delete(grades).where(eq(grades.id, id)).returning();
    return result.length > 0;
  }

  // Exams
  async getUserExams(userId: string): Promise<ExamWithSubject[]> {
    const result = await this.db
      .select({
        id: exams.id,
        userId: exams.userId,
        subjectId: exams.subjectId,
        title: exams.title,
        date: exams.date,
        status: exams.status,
        progress: exams.progress,
        difficulty: exams.difficulty,
        notes: exams.notes,
        createdAt: exams.createdAt,
        subject: subjects
      })
      .from(exams)
      .leftJoin(subjects, eq(exams.subjectId, subjects.id))
      .where(eq(exams.userId, userId));
    
    return result.map(row => ({
      ...row,
      subject: row.subject!
    }));
  }

  async createExam(examData: InsertExam & { userId: string }): Promise<Exam> {
    const result = await this.db.insert(exams).values(examData).returning();
    return result[0];
  }

  async updateExam(id: string, updates: Partial<Exam>): Promise<Exam | undefined> {
    const result = await this.db.update(exams).set(updates).where(eq(exams.id, id)).returning();
    return result[0];
  }

  async deleteExam(id: string): Promise<boolean> {
    const result = await this.db.delete(exams).where(eq(exams.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new PostgresStorage();
