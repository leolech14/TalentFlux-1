import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Only configure WebSocket if we have a DATABASE_URL
if (process.env.DATABASE_URL) {
  neonConfig.webSocketConstructor = ws;
}

// In development, provide a helpful error message
if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`
╔════════════════════════════════════════════════════════════════╗
║                    DATABASE SETUP REQUIRED                      ║
╠════════════════════════════════════════════════════════════════╣
║  To run this application, you need to set up a database:       ║
║                                                                 ║
║  1. Create a free Neon database at: https://neon.tech          ║
║  2. Copy your connection string                                 ║
║  3. Create a .env file in the root directory                   ║
║  4. Add: DATABASE_URL=your-connection-string                   ║
║                                                                 ║
║  For local development, you can also use a local PostgreSQL:   ║
║  DATABASE_URL=postgresql://user:pass@localhost:5432/dbname     ║
║                                                                 ║
║  Or run: npm run setup                                          ║
╚════════════════════════════════════════════════════════════════╝
    `);
    // Don't exit in development, allow running without DB
  } else {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?"
    );
  }
}

// Create a dummy pool if no DATABASE_URL (for development without DB)
export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null as any;

export const db = process.env.DATABASE_URL
  ? drizzle({ client: pool, schema })
  : null as any;