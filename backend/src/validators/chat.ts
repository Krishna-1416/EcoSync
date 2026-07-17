import { z } from "zod";

/**
 * Zod schema for validating incoming chat requests to the volunteer co-pilot.
 *
 * - `message`: The fan or volunteer's natural-language query. Must be a
 *   non-empty string, maximum 2000 chars (prevents prompt-injection abuse).
 * - `context.currentZone`: Volunteer's current stadium zone for telemetry
 *   enrichment (e.g. "North Gate", "Section 104").
 * - `context.language`: ISO 639-1 code for fan's preferred language (e.g.
 *   "es" for Spanish). Used by the LLM to generate translated phrases.
 */
export const chatRequestSchema = z.object({
  message: z
    .string({ required_error: "Message is required" })
    .min(1, "Message cannot be empty")
    .max(2000, "Message must not exceed 2000 characters"),
  context: z
    .object({
      currentZone: z.string().max(100).default("General"),
      language: z.string().max(10).default("en"),
    })
    .optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
