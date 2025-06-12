import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  userType: text("user_type").notNull(), // 'candidate' | 'employer'
  linkedinId: text("linkedin_id"),
  profileData: jsonb("profile_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  salary: text("salary"),
  description: text("description"),
  requirements: text("requirements").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => users.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  status: text("status").default("pending"), // 'pending' | 'reviewed' | 'interview' | 'rejected' | 'hired'
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url"),
  appliedAt: timestamp("applied_at").defaultNow(),
});

export const cvs = pgTable("cvs", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  summary: text("summary"),
  experience: text("experience").array(), // JSON strings of experience entries
  education: text("education").array(), // JSON strings of education entries
  skills: text("skills").array(), // Array of skill names
  certifications: text("certifications").array(), // JSON strings of certification entries
  languages: text("languages").array(), // JSON strings of language entries
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiEvents = pgTable("ai_events", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  intentId: text("intent_id").notNull(),
  context: jsonb("context"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const aiFeedback = pgTable("ai_feedback", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => aiEvents.id).notNull(),
  thumbsUp: boolean("thumbs_up").notNull(),
  comment: text("comment").default(""),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
});

export const insertCvSchema = createInsertSchema(cvs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const onboardingSchema = z.object({
  userType: z.enum(['candidate', 'employer']),
  name: z.string().min(1),
  profileData: z.record(z.any()).optional(),
});

export const cvCreationSchema = z.object({
  description: z.string().min(10, "Please provide more details about your background"),
});

export const insertAiEventSchema = createInsertSchema(aiEvents).omit({
  id: true,
  timestamp: true,
});

export const insertAiFeedbackSchema = createInsertSchema(aiFeedback).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertCv = z.infer<typeof insertCvSchema>;
export type Cv = typeof cvs.$inferSelect;
export type InsertAiEvent = z.infer<typeof insertAiEventSchema>;
export type AiEvent = typeof aiEvents.$inferSelect;
export type InsertAiFeedback = z.infer<typeof insertAiFeedbackSchema>;
export type AiFeedback = typeof aiFeedback.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type OnboardingData = z.infer<typeof onboardingSchema>;
export type CvCreationData = z.infer<typeof cvCreationSchema>;
