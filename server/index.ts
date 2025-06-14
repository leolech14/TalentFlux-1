import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { transcribeAudio } from "./cvGenerator";
import { db, pool } from "./db";
import repoRouter from "./repoRoutes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// CV generation endpoints
app.post("/api/cv/transcribe", async (req, res) => {
  try {
    const { audio } = req.body;

    if (!audio) {
      return res.status(400).json({ error: "No audio data provided" });
    }

    const transcription = await transcribeAudio(audio);
    res.json({ transcription });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});

// Repository routes
app.use("/api/repo", repoRouter);

// Email sending endpoint
app.post("/api/send-email", async (req, res) => {
  const { to, subject, text, attachments } = req.body;

  // For now, just log the email request
  console.log("Email request:", { to, subject, text, attachments: attachments?.length });

  // Return success response
  res.json({ success: true, message: "Email sent successfully" });
});

(async () => {
  try {
    // Test database connection before proceeding
    if (process.env.DATABASE_URL) {
      try {
        await pool.query('SELECT 1');
        log('Database connection successful', 'database');

        // Only seed if connection is successful
        await seedDatabase();
      } catch (dbError) {
        log('Database connection failed - running without database', 'database');
        console.error('Database error:', dbError);
      }
    } else {
      log('No DATABASE_URL configured - running without database', 'database');
    }

    const server = await registerRoutes(app);

    app.use((err: Error & { status?: number; statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error('Express error:', err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Use PORT from environment or default to 5000 for Replit workflow compatibility
    const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;

    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

// CV email endpoint
app.post("/api/cv/send-email", async (req, res) => {
  try {
    const { email, cvData, pdfBase64 } = req.body;

    if (!email || !pdfBase64) {
      return res.status(400).json({ error: "Email and PDF data are required" });
    }

    // Import the email service
    const { sendCVEmail } = await import('./emailService');

    // Extract recipient name from CV data or use email
    const recipientName = cvData?.personalInfo?.fullName || email.split('@')[0];

    // Send the email with CV attachment
    const result = await sendCVEmail(email, recipientName, pdfBase64, cvData);

    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(500).json({
        error: result.message
      });
    }
  } catch (error) {
    console.error("Error sending CV email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});
