import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { TelemetryRepository } from "../repositories/TelemetryRepository";

import { z } from "zod";

const telemetrySchema = z.object({
  gates: z.array(z.any()).optional(),
  transit: z.array(z.any()).optional()
});

export class TelemetryController extends BaseController {
  private repo: TelemetryRepository;

  constructor() {
    super();
    this.repo = TelemetryRepository.getInstance();
  }

  public updateTelemetry = (req: Request, res: Response) => {
    try {
      const parsed = telemetrySchema.safeParse(req.body);
      if (!parsed.success || Object.keys(parsed.data).length === 0) {
        return this.sendError(res, "Invalid telemetry data structure", 400);
      }
      this.repo.updateTelemetry(parsed.data);
      this.sendSuccess(res, {
        message: "Telemetry updated successfully",
        currentTelemetry: this.repo.getTelemetry()
      });
    } catch (error) {
      this.sendError(res, "Failed to update telemetry", 400);
    }
  };

  public getTelemetry = (req: Request, res: Response) => {
    this.sendSuccess(res, this.repo.getTelemetry());
  };
}
