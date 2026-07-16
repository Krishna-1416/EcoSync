import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { LlmService } from "../services/llmService";
import { chatRequestSchema } from "../validators/chat";

export class ChatController extends BaseController {
  private llmService: LlmService;

  constructor() {
    super();
    this.llmService = new LlmService();
  }

  public handleChat = async (req: Request, res: Response) => {
    // Validate request using Zod
    const validationResult = chatRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      return this.sendError(res, "Invalid input data: " + JSON.stringify(validationResult.error.format()), 400);
    }

    const { message, context } = validationResult.data;
    const currentZone = context?.currentZone || "General";
    const language = context?.language || "en";

    const response = await this.llmService.generateResponse(message, currentZone, language);
    return this.sendSuccess(res, response, "Chat reply processed successfully");
  };
}
