import { db } from "./db";
import { users } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if users already exist
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already seeded");
      return;
    }

    // Create test users
    await db.insert(users).values([
      {
        email: "candidate@test.com",
        password: "password",
        name: "Alex Candidate",
        userType: "candidate",
        linkedinId: null,
        profileData: null,
      },
      {
        email: "employer@test.com",
        password: "password",
        name: "Sarah Employer",
        userType: "employer",
        linkedinId: null,
        profileData: null,
      }
    ]);

    console.log("Database seeded with test users");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}