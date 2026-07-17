import "./instrument"; // Must be imported first
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import * as Sentry from "@sentry/node";
import apiRoutes from "./routes";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());

// Sentry request handler
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Routes
app.use("/api/v1", apiRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
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
