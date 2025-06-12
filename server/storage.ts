import { users, jobs, applications, cvs, type User, type InsertUser, type Job, type InsertJob, type Application, type InsertApplication, type Cv, type InsertCv } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Job operations
  getJob(id: number): Promise<Job | undefined>;
  getJobsByEmployer(employerId: number): Promise<Job[]>;
  getAllActiveJobs(): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, updates: Partial<Job>): Promise<Job | undefined>;

  // Application operations
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByCandidate(candidateId: number): Promise<Application[]>;
  getApplicationsByJob(jobId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, updates: Partial<Application>): Promise<Application | undefined>;

  // CV operations
  getCv(id: number): Promise<Cv | undefined>;
  getCvByCandidate(candidateId: number): Promise<Cv | undefined>;
  createCv(cv: InsertCv): Promise<Cv>;
  updateCv(id: number, updates: Partial<Cv>): Promise<Cv | undefined>;
  deleteCv(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getJobsByEmployer(employerId: number): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.employerId, employerId));
  }

  async getAllActiveJobs(): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.isActive, true));
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(insertJob)
      .returning();
    return job;
  }

  async updateJob(id: number, updates: Partial<Job>): Promise<Job | undefined> {
    const [job] = await db
      .update(jobs)
      .set(updates)
      .where(eq(jobs.id, id))
      .returning();
    return job || undefined;
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async getApplicationsByCandidate(candidateId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.candidateId, candidateId));
  }

  async getApplicationsByJob(jobId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.jobId, jobId));
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async updateApplication(id: number, updates: Partial<Application>): Promise<Application | undefined> {
    const [application] = await db
      .update(applications)
      .set(updates)
      .where(eq(applications.id, id))
      .returning();
    return application || undefined;
  }

  async getCv(id: number): Promise<Cv | undefined> {
    try {
      const [cv] = await db.select().from(cvs).where(eq(cvs.id, id));
      return cv || undefined;
    } catch (error) {
      console.error('Error getting CV:', error);
      return undefined;
    }
  }

  async getCvByCandidate(candidateId: number): Promise<Cv | undefined> {
    try {
      const [cv] = await db.select().from(cvs).where(eq(cvs.candidateId, candidateId));
      return cv || undefined;
    } catch (error) {
      console.error('Error getting CV by candidate:', error);
      return undefined;
    }
  }

  async createCv(insertCv: InsertCv): Promise<Cv> {
    const [cv] = await db
      .insert(cvs)
      .values(insertCv)
      .returning();
    return cv;
  }

  async updateCv(id: number, updates: Partial<Cv>): Promise<Cv | undefined> {
    try {
      const [updatedCv] = await db
        .update(cvs)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(cvs.id, id))
        .returning();
      return updatedCv || undefined;
    } catch (error) {
      console.error('Error updating CV:', error);
      return undefined;
    }
  }

  async deleteCv(id: number): Promise<boolean> {
    try {
      const result = await db.delete(cvs).where(eq(cvs.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting CV:', error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
