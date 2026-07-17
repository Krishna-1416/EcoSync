import { z } from "zod";
import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { LlmService } from "../services/llmService";
import { chatRequestSchema } from "../validators/chat";

/**
 * ChatController — handles GenAI-powered volunteer co-pilot requests.
 *
 * Routes fan/volunteer queries through the LlmService, which leverages
 * Google Gemma 26B to provide real-time crowd routing, multilingual
 * phrase generation, and operational intelligence for FIFA World Cup 2026.
 *
 * Falls back gracefully to a deterministic rule engine if the LLM is
 * unavailable (offline resilience requirement).
 */
export class ChatController extends BaseController {
  private llmService: LlmService;

  constructor() {
    super();
    this.llmService = new LlmService();
  }

  /**
   * POST /api/v1/chat
   *
   * Accepts a volunteer or fan query, enriches it with live stadium
   * telemetry context, and returns a structured JSON response containing:
   * - A reasoning explanation for the volunteer
   * - A translated phrase for the fan
   * - Optional actionMetadata for UI map triggers (SHOW_ROUTE, SHOW_MAP_PIN)
   *
   * @param req Express Request — expects { message, context?: { currentZone, language } }
   * @param res Express Response
   */
  public handleChat = async (req: Request, res: Response): Promise<void> => {
    // 1. Validate request body with Zod schema
    const validationResult = chatRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      this.sendError(
        res,
        "Invalid input: " + JSON.stringify(validationResult.error.flatten().fieldErrors),
        400
      );
      return;
    }

    const { message, context } = validationResult.data;
    const currentZone = context?.currentZone || "General";
    const language = context?.language || "en";

    try {
      // 2. Delegate to LlmService (Gemma 26B → rule-engine fallback)
      const response = await this.llmService.generateResponse(message, currentZone, language);
      this.sendSuccess(res, response, "Chat reply processed successfully");
    } catch (error: any) {
      // 3. Surface unexpected errors clearly
      console.error("❌ ChatController unhandled error:", error);
      this.sendError(res, "An internal error occurred while processing your request.", 500);
    }
  };
}
