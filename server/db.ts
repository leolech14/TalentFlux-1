import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

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
╚════════════════════════════════════════════════════════════════╝
    `);
    process.exit(1);
  }

  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });