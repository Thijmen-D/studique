import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertHabitSchema, insertSubjectSchema, insertGradeSchema, insertExamSchema, insertMoodSchema, insertTodoSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Auth middleware (from blueprint:javascript_auth_all_persistance)
  setupAuth(app);

  // Todos Routes  
  app.get("/api/todos", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    const todos = await storage.getTodos(userId);
    res.json(todos);
  });

  app.post("/api/todos", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    try {
      const data = insertTodoSchema.parse(req.body);
      const todo = await storage.createTodo(data, userId);
      res.json(todo);
    } catch (error) {
      res.status(400).json({ error: "Invalid todo data" });
    }
  });

  app.patch("/api/todos/:id", isAuthenticated, async (req, res) => {
    const updateData = { ...req.body };
    
    // Convert completedAt string to Date object if present
    if (updateData.completedAt !== undefined) {
      updateData.completedAt = updateData.completedAt ? new Date(updateData.completedAt) : null;
    }
    
    const todo = await storage.updateTodo(req.params.id, updateData);
    if (!todo) return res.status(404).send("Todo not found");
    res.json(todo);
  });

  app.delete("/api/todos/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deleteTodo(req.params.id);
    res.json({ success });
  });
  
  // Habits Routes
  app.get("/api/habits", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    const habits = await storage.getHabits(userId);
    res.json(habits);
  });

  app.post("/api/habits", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    try {
      const data = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(data, userId);
      res.json(habit);
    } catch (error) {
      res.status(400).json({ error: "Invalid habit data" });
    }
  });

  app.patch("/api/habits/:id", isAuthenticated, async (req, res) => {
    const habit = await storage.updateHabit(req.params.id, req.body);
    if (!habit) return res.status(404).send("Habit not found");
    res.json(habit);
  });

  app.post("/api/habits/:id/toggle", isAuthenticated, async (req, res) => {
    const { date } = req.body;
    const habit = await storage.toggleHabit(req.params.id, date);
    if (!habit) return res.status(404).send("Habit not found");
    res.json(habit);
  });

  app.delete("/api/habits/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deleteHabit(req.params.id);
    res.json({ success });
  });

  // Subjects Routes
  app.get("/api/subjects", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    const subjects = await storage.getSubjects(userId);
    res.json(subjects);
  });

  app.post("/api/subjects", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    try {
      const data = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(data, userId);
      res.json(subject);
    } catch (error) {
      res.status(400).json({ error: "Invalid subject data" });
    }
  });

  app.patch("/api/subjects/:id", isAuthenticated, async (req, res) => {
    const subject = await storage.updateSubject(req.params.id, req.body);
    if (!subject) return res.status(404).send("Subject not found");
    res.json(subject);
  });

  app.delete("/api/subjects/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deleteSubject(req.params.id);
    res.json({ success });
  });

  // Grades Routes
  app.get("/api/grades", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    const grades = await storage.getGrades(userId);
    res.json(grades);
  });

  app.post("/api/grades", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    try {
      const data = insertGradeSchema.parse(req.body);
      const grade = await storage.createGrade(data, userId);
      res.json(grade);
    } catch (error) {
      res.status(400).json({ error: "Invalid grade data" });
    }
  });

  app.patch("/api/grades/:id", isAuthenticated, async (req, res) => {
    const grade = await storage.updateGrade(req.params.id, req.body);
    if (!grade) return res.status(404).send("Grade not found");
    res.json(grade);
  });

  app.delete("/api/grades/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deleteGrade(req.params.id);
    res.json({ success });
  });

  // Exams Routes
  app.get("/api/exams", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    const exams = await storage.getExams(userId);
    res.json(exams);
  });

  app.get("/api/exams/:id", isAuthenticated, async (req: any, res) => {
    const exam = await storage.getExam(req.params.id);
    if (!exam) return res.status(404).send("Exam not found");
    res.json(exam);
  });

  app.post("/api/exams", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    try {
      const data = insertExamSchema.parse(req.body);
      const exam = await storage.createExam(data, userId);
      res.json(exam);
    } catch (error) {
      res.status(400).json({ error: "Invalid exam data" });
    }
  });

  app.patch("/api/exams/:id", isAuthenticated, async (req, res) => {
    const updateData = { ...req.body };
    
    // Convert date string to proper format if present
    if (updateData.date && typeof updateData.date === 'string') {
      updateData.date = updateData.date;
    }
    
    const exam = await storage.updateExam(req.params.id, updateData);
    if (!exam) return res.status(404).send("Exam not found");
    res.json(exam);
  });

  app.delete("/api/exams/:id", isAuthenticated, async (req, res) => {
    const success = await storage.deleteExam(req.params.id);
    res.json({ success });
  });

  // Moods Routes
  app.get("/api/moods", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    const moods = await storage.getMoods(userId);
    res.json(moods);
  });

  app.get("/api/moods/today", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    const today = new Date().toISOString().split('T')[0];
    const mood = await storage.getMoodByDate(userId, today);
    res.json(mood || null);
  });

  app.post("/api/moods", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    try {
      const data = insertMoodSchema.parse(req.body);
      const mood = await storage.createMood(data, userId);
      res.json(mood);
    } catch (error) {
      res.status(400).json({ error: "Invalid mood data" });
    }
  });

  app.patch("/api/moods/:id", isAuthenticated, async (req, res) => {
    const mood = await storage.updateMood(req.params.id, req.body);
    if (!mood) return res.status(404).send("Mood not found");
    res.json(mood);
  });

  // User Settings Routes
  app.get("/api/settings", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    let settings = await storage.getUserSettings(userId);
    if (!settings) {
      settings = await storage.createUserSettings({
        theme: 't1',
        darkMode: 'auto',
        darkModeSchedule: true,
        lightModeTime: '10:00',
        darkModeTime: '18:00',
        customColors: null
      }, userId);
    }
    res.json(settings);
  });

  app.patch("/api/settings", isAuthenticated, async (req: any, res) => {
    const userId = req.user!.id;
    const settings = await storage.updateUserSettings(userId, req.body);
    if (!settings) {
      const newSettings = await storage.createUserSettings(req.body, userId);
      return res.json(newSettings);
    }
    res.json(settings);
  });

  const httpServer = createServer(app);
  return httpServer;
}
