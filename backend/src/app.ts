import "./instrument"; // Must be imported first
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import * as Sentry from "@sentry/node";
import apiRoutes from "./routes";

const app = express();

// --- Security: Rate Limiting ---
// Protects the GenAI endpoint from abuse and prompt-injection flooding.
// 100 requests per 15 minutes per IP — appropriate for stadium volunteer use.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

// --- Security: CORS locked to known origins ---
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(compression());
// Security: limit JSON payload size to prevent oversized body attacks
app.use(express.json({ limit: "50kb" }));

// Apply rate limiting to all API routes
app.use("/api/", limiter);

// Sentry request handler
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Routes
app.use("/api/v1", apiRoutes);

// Health check — no rate limiting, used by load balancers
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Sentry Error Handler (must be registered before other error middlewares)
app.use(Sentry.Handlers.errorHandler());

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || err.statusCode || 500;
  console.error("❌ App Error:", err);
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

export default app;
