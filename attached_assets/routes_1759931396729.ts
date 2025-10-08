import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertHabitSchema, insertTodoSchema, insertSubjectSchema, insertGradeSchema, insertExamSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.session.userId) {
      next();
    } else {
      res.status(401).json({ error: "Authentication required" });
    }
  };

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      req.session.userId = user.id;
      res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/signout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not sign out" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Habits routes
  app.get("/api/habits", requireAuth, async (req, res) => {
    try {
      const habits = await storage.getUserHabits(req.session.userId);
      res.json(habits);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/habits", requireAuth, async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit({ ...habitData, userId: req.session.userId });
      res.json(habit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/habits/:id", requireAuth, async (req, res) => {
    try {
      const habit = await storage.updateHabit(req.params.id, req.body);
      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.json(habit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/habits/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteHabit(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Todos routes
  app.get("/api/todos", requireAuth, async (req, res) => {
    try {
      const todos = await storage.getUserTodos(req.session.userId);
      res.json(todos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/todos", requireAuth, async (req, res) => {
    try {
      const todoData = insertTodoSchema.parse(req.body);
      const todo = await storage.createTodo({ ...todoData, userId: req.session.userId });
      res.json(todo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/todos/:id", requireAuth, async (req, res) => {
    try {
      const todo = await storage.updateTodo(req.params.id, req.body);
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json(todo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/todos/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteTodo(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Subjects routes
  app.get("/api/subjects", requireAuth, async (req, res) => {
    try {
      const subjects = await storage.getUserSubjects(req.session.userId);
      res.json(subjects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/subjects", requireAuth, async (req, res) => {
    try {
      const subjectData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject({ ...subjectData, userId: req.session.userId });
      res.json(subject);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Grades routes
  app.get("/api/grades", requireAuth, async (req, res) => {
    try {
      const grades = await storage.getUserGrades(req.session.userId);
      res.json(grades);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/grades", requireAuth, async (req, res) => {
    try {
      const gradeData = insertGradeSchema.parse(req.body);
      const grade = await storage.createGrade({ ...gradeData, userId: req.session.userId });
      res.json(grade);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/grades/:id", requireAuth, async (req, res) => {
    try {
      const grade = await storage.updateGrade(req.params.id, req.body);
      if (!grade) {
        return res.status(404).json({ error: "Grade not found" });
      }
      res.json(grade);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/grades/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteGrade(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Grade not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Exams routes
  app.get("/api/exams", requireAuth, async (req, res) => {
    try {
      const exams = await storage.getUserExams(req.session.userId);
      res.json(exams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/exams", requireAuth, async (req, res) => {
    try {
      const examData = insertExamSchema.parse(req.body);
      const exam = await storage.createExam({ ...examData, userId: req.session.userId });
      res.json(exam);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/exams/:id", requireAuth, async (req, res) => {
    try {
      const exam = await storage.updateExam(req.params.id, req.body);
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      res.json(exam);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/exams/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteExam(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Exam not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
