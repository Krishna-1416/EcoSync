import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().default("file:./dev.db"),
  SENTRY_DSN: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = configSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Configuration validation failed:", parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
