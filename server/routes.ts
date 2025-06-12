import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, onboardingSchema, insertJobSchema, insertApplicationSchema, cvCreationSchema, insertAiEventSchema, insertAiFeedbackSchema, aiEvents, aiFeedback } from "@shared/schema";
import { processCvFromNaturalLanguage } from "./cvProcessor";
import { repoAgent } from "../ai/repoAgent";
import { generateCVFromResponses, transcribeAudio } from "./cvGenerator";
import { db } from "./db";
import { desc } from "drizzle-orm";
import { z } from "zod";
import multer from "multer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Multer configuration for audio uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd use proper session management
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = req.body;
      
      // Check if user exists
      const existing = await storage.getUserByEmail(userData.email);
      if (existing) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/onboarding", async (req, res) => {
    try {
      const { userId, ...onboardingData } = req.body;
      const validatedData = onboardingSchema.parse(onboardingData);
      
      const updatedUser = await storage.updateUser(userId, {
        userType: validatedData.userType,
        name: validatedData.name,
        profileData: validatedData.profileData,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user ID" });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllActiveJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/employer/:employerId", async (req, res) => {
    try {
      const employerId = parseInt(req.params.employerId);
      const jobs = await storage.getJobsByEmployer(employerId);
      res.json(jobs);
    } catch (error) {
      res.status(400).json({ message: "Invalid employer ID" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      res.status(400).json({ message: "Invalid job data" });
    }
  });

  // Application routes
  app.get("/api/applications/candidate/:candidateId", async (req, res) => {
    try {
      const candidateId = parseInt(req.params.candidateId);
      const applications = await storage.getApplicationsByCandidate(candidateId);
      res.json(applications);
    } catch (error) {
      res.status(400).json({ message: "Invalid candidate ID" });
    }
  });

  app.get("/api/applications/job/:jobId", async (req, res) => {
    try {
      const jobId = parseInt(req.params.jobId);
      const applications = await storage.getApplicationsByJob(jobId);
      res.json(applications);
    } catch (error) {
      res.status(400).json({ message: "Invalid job ID" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(applicationData);
      res.json(application);
    } catch (error) {
      res.status(400).json({ message: "Invalid application data" });
    }
  });

  // CV routes
  app.get("/api/cvs/candidate/:candidateId", async (req, res) => {
    try {
      const candidateId = parseInt(req.params.candidateId);
      const cv = await storage.getCvByCandidate(candidateId);
      if (!cv) {
        return res.status(404).json({ message: "CV not found" });
      }
      res.json(cv);
    } catch (error) {
      res.status(400).json({ message: "Invalid candidate ID" });
    }
  });

  app.post("/api/cvs/create", async (req, res) => {
    try {
      const { description } = cvCreationSchema.parse(req.body);
      const { candidateId, userEmail, userName } = req.body;

      if (!candidateId || !userEmail || !userName) {
        return res.status(400).json({ message: "Missing required fields: candidateId, userEmail, userName" });
      }

      // Check if CV already exists for this candidate
      const existingCv = await storage.getCvByCandidate(candidateId);
      if (existingCv) {
        return res.status(409).json({ message: "CV already exists for this candidate" });
      }

      const result = await processCvFromNaturalLanguage(description, candidateId, userEmail, userName);
      
      if (!result.success || !result.cv) {
        return res.status(400).json({ message: result.error || "Failed to process CV" });
      }

      const cv = await storage.createCv(result.cv);
      res.json(cv);
    } catch (error) {
      console.error('CV creation error:', error);
      res.status(400).json({ message: "Invalid CV data" });
    }
  });

  app.put("/api/cvs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const cv = await storage.updateCv(id, updates);
      if (!cv) {
        return res.status(404).json({ message: "CV not found" });
      }
      res.json(cv);
    } catch (error) {
      res.status(400).json({ message: "Invalid CV data" });
    }
  });

  app.delete("/api/cvs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCv(id);
      if (!success) {
        return res.status(404).json({ message: "CV not found" });
      }
      res.json({ message: "CV deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid CV ID" });
    }
  });

  // Repo-aware AI assistant endpoint
  app.post("/api/repo/query", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query is required' });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      const response = await repoAgent.processQuery(query);
      
      res.json({ 
        response,
        type: 'repo-query'
      });
    } catch (error) {
      console.error('Repo query error:', error);
      res.status(500).json({ 
        error: 'Failed to process repository query',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Check repo agent availability
  app.get("/api/repo/status", (req, res) => {
    res.json({
      available: !!process.env.OPENAI_API_KEY,
      indexed: false
    });
  });

  // AI event tracking endpoints
  app.post("/api/ai/events", async (req, res) => {
    try {
      const eventData = insertAiEventSchema.parse(req.body);
      
      const [event] = await db.insert(aiEvents).values({
        userId: eventData.userId,
        intentId: eventData.intentId,
        context: eventData.context
      }).returning({ id: aiEvents.id });

      res.json({ eventId: event.id });
    } catch (error) {
      console.error('Error creating AI event:', error);
      res.status(400).json({ error: 'Invalid event data' });
    }
  });

  app.post("/api/ai/feedback", async (req, res) => {
    try {
      const feedbackData = insertAiFeedbackSchema.parse(req.body);
      
      await db.insert(aiFeedback).values({
        eventId: feedbackData.eventId,
        thumbsUp: feedbackData.thumbsUp,
        comment: feedbackData.comment || ""
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error recording AI feedback:', error);
      res.status(400).json({ error: 'Invalid feedback data' });
    }
  });

  app.get("/api/ai/events", async (req, res) => {
    try {
      const events = await db
        .select()
        .from(aiEvents)
        .orderBy(desc(aiEvents.timestamp))
        .limit(100);

      res.json(events);
    } catch (error) {
      console.error('Error fetching AI events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
