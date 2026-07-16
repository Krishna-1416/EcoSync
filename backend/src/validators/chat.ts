import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  context: z.object({
    currentZone: z.string().default("General"),
    language: z.string().default("en"),
  }).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
