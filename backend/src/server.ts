import app from "./app";
import { config } from "./config/unifiedConfig";

const server = app.listen(config.PORT, () => {
  console.log(`📡 Server listening on port ${config.PORT} in ${config.NODE_ENV} mode.`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optional: Gracefully shutdown server
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
  process.exit(1);
});
