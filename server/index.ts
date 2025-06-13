import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { transcribeAudio } from "./transcription.js";
import { db } from "./db.js";
import { setupAuth } from "./auth.js";
import { setupRoutes } from "./routes.js";

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

(async () => {
  // Seed database with test data
  await seedDatabase();

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT from environment or default to 3001 (to avoid conflict with AirPlay on 5000)
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();

// CV email endpoint
app.post("/api/cv/send-email", async (req, res) => {
  try {
    const { email, cvData, pdfBase64 } = req.body;

    if (!email || !pdfBase64) {
      return res.status(400).json({ error: "Email and PDF data are required" });
    }

    // In a production environment, you would use a service like SendGrid, AWS SES, etc.
    // For now, we'll simulate the email sending
    console.log(`Sending CV to ${email}`);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      message: `CV successfully sent to ${email}`
    });
  } catch (error) {
    console.error("Error sending CV email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});
