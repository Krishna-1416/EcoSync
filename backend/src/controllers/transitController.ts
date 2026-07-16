import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { TransitService } from "../services/transitService";

export class TransitController extends BaseController {
  private transitService: TransitService;

  constructor() {
    super();
    this.transitService = new TransitService();
  }

  public getTransit = async (req: Request, res: Response) => {
    const gate = (req.query.gate as string) || "North Gate";
    const data = await this.transitService.getTransitData(gate);
    return this.sendSuccess(res, data, "Transit schedule retrieved successfully");
  };
}
