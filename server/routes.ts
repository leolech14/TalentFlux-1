import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, onboardingSchema, insertJobSchema, insertApplicationSchema, cvCreationSchema, insertAiEventSchema, insertAiFeedbackSchema, aiEvents, aiFeedback } from "@shared/schema";
import { processCvFromNaturalLanguage } from "./cvProcessor";
import { repoAgent } from "../ai/repoAgent";
import { generateCVFromResponses, generateCVFromAIResponses, generateCVPDF, transcribeAudio } from "./cvGenerator";
import { db } from "./db";
import { desc } from "drizzle-orm";
import { z } from "zod";
import multer from "multer";
import repoRoutes from "./repoRoutes";

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

  // General AI query endpoint
  app.post("/api/ai/query", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query is required' });
      }

      // For now, return a helpful response about TalentFlux
      // In production, this would use OpenAI or another AI service
      const response = `I'm here to help you with TalentFlux! This is an AI-powered HR platform that helps:

• Employers: Post jobs, manage candidates, schedule interviews, and track hiring metrics
• Candidates: Create AI-powered CVs, apply for jobs, and track applications

Some things I can help with:
- Navigating the platform
- Understanding features
- Best practices for hiring or job searching
- Technical support

What would you like to know more about?`;

      res.json({ response });
    } catch (error) {
      console.error('AI query error:', error);
      res.status(500).json({ error: 'Failed to process query' });
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

  // CV Assistant endpoints
  app.post("/api/cv/generate", async (req, res) => {
    try {
      const { responses, userId } = req.body;
      
      if (!responses || !Array.isArray(responses) || responses.length < 6) {
        return res.status(400).json({ error: 'Invalid responses array' });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      const cvData = await generateCVFromResponses(responses);
      res.json(cvData);
      
    } catch (error) {
      console.error('CV generation error:', error);
      res.status(500).json({ error: 'Failed to generate CV' });
    }
  });

  // AI CV Assistant endpoints
  app.post("/api/cv/generate-ai", async (req, res) => {
    try {
      const { responses, userId } = req.body;
      
      if (!responses || !Array.isArray(responses) || responses.length < 2) {
        return res.status(400).json({ error: 'Need at least 2 responses' });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      const cvData = await generateCVFromAIResponses(responses);
      res.json(cvData);
      
    } catch (error) {
      console.error('AI CV generation error:', error);
      res.status(500).json({ error: 'Failed to generate CV' });
    }
  });

  app.post("/api/transcribe", upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No audio file provided' });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      const text = await transcribeAudio(req.file.buffer);
      res.json({ text });
    } catch (error) {
      console.error('Transcription error:', error);
      res.status(500).json({ error: 'Failed to transcribe audio' });
    }
  });

  app.post("/api/cv/download", async (req, res) => {
    try {
      const { cvData } = req.body;
      
      if (!cvData) {
        return res.status(400).json({ error: 'CV data is required' });
      }

      // Generate HTML for PDF conversion
      const htmlContent = generateCVHTML(cvData);
      
      // Convert to PDF using Puppeteer
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });
      
      await browser.close();
      
      res
        .setHeader("Content-Type", "application/pdf")
        .setHeader(
          "Content-Disposition",
          `attachment; filename="${cvData.personalInfo.fullName.replace(/\s+/g, "_")}_CV.pdf"`
        )
        .send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  // Repo-aware AI assistant routes
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

  // Check if repo agent is available
  app.get("/api/repo/status", (req, res) => {
    res.json({
      available: !!process.env.OPENAI_API_KEY,
      indexed: false
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateCVHTML(cvData: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.4; color: #333; margin: 0; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
    .name { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
    .contact { font-size: 12px; color: #666; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 16px; font-weight: bold; color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 10px; }
    .experience-item, .education-item { margin-bottom: 15px; }
    .job-title { font-weight: bold; font-size: 14px; }
    .company { font-size: 12px; color: #666; margin-bottom: 5px; }
    .description { font-size: 12px; margin-bottom: 5px; }
    .achievements { font-size: 12px; margin-left: 15px; }
    .achievements li { margin-bottom: 3px; }
    .skills-section { display: flex; flex-wrap: wrap; gap: 15px; }
    .skill-group { flex: 1; min-width: 200px; }
    .skill-title { font-weight: bold; font-size: 12px; margin-bottom: 5px; }
    .skill-list { font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${cvData.personalInfo.fullName}</div>
    <div class="contact">
      ${cvData.personalInfo.email} • ${cvData.personalInfo.phone}<br>
      ${cvData.personalInfo.location}
      ${cvData.personalInfo.linkedinUrl ? `<br>${cvData.personalInfo.linkedinUrl}` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="description">${cvData.personalInfo.summary}</div>
  </div>

  <div class="section">
    <div class="section-title">Professional Experience</div>
    ${cvData.experience.map((exp: any) => `
      <div class="experience-item">
        <div class="job-title">${exp.title}</div>
        <div class="company">${exp.company} • ${exp.location} • ${exp.startDate} - ${exp.endDate}</div>
        <div class="description">${exp.description}</div>
        ${exp.achievements.length > 0 ? `
          <ul class="achievements">
            ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">Education</div>
    ${cvData.education.map((edu: any) => `
      <div class="education-item">
        <div class="job-title">${edu.degree}</div>
        <div class="company">${edu.institution} • ${edu.location} • ${edu.graduationDate}</div>
        ${edu.gpa ? `<div class="description">GPA: ${edu.gpa}</div>` : ''}
        ${edu.honors ? `<div class="description">${edu.honors}</div>` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills-section">
      ${cvData.skills.technical.length > 0 ? `
        <div class="skill-group">
          <div class="skill-title">Technical Skills:</div>
          <div class="skill-list">${cvData.skills.technical.join(', ')}</div>
        </div>
      ` : ''}
      ${cvData.skills.soft.length > 0 ? `
        <div class="skill-group">
          <div class="skill-title">Soft Skills:</div>
          <div class="skill-list">${cvData.skills.soft.join(', ')}</div>
        </div>
      ` : ''}
      ${cvData.skills.languages.length > 0 ? `
        <div class="skill-group">
          <div class="skill-title">Languages:</div>
          <div class="skill-list">${cvData.skills.languages.join(', ')}</div>
        </div>
      ` : ''}
    </div>
  </div>

  ${cvData.certifications.length > 0 ? `
    <div class="section">
      <div class="section-title">Certifications</div>
      ${cvData.certifications.map((cert: any) => `
        <div class="education-item">
          <div class="job-title">${cert.name}</div>
          <div class="company">${cert.issuer} • ${cert.date}</div>
          ${cert.credentialId ? `<div class="description">Credential ID: ${cert.credentialId}</div>` : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}
</body>
</html>
  `;
}
