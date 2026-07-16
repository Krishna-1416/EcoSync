import * as Sentry from "@sentry/node";
import { config } from "./config/unifiedConfig";

if (config.SENTRY_DSN) {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment: config.NODE_ENV,
    tracesSampleRate: 1.0,
  });
  console.log("🚀 Sentry initialization completed successfully.");
} else {
  console.warn("⚠️ Sentry DSN not found. Running application without Sentry integration.");
}
