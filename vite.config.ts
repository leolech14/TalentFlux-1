import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      ".replit.dev",
      ".repl.co",
      "36a4c07b-bf04-4bfa-9d08-ccc31aa7a528-00-2mfk7i7pjree9.kirk.replit.dev"
    ],
    proxy: {
      '/api': {
        target: process.env.REPL_ID ? 'http://localhost:5000' : 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
