import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { TransitService } from "../services/transitService";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 30 }); // 30 seconds TTL

export class TransitController extends BaseController {
  private transitService: TransitService;

  constructor() {
    super();
    this.transitService = new TransitService();
  }

  public getTransit = async (req: Request, res: Response) => {
    const gate = (req.query.gate as string) || "North Gate";
    const cacheKey = `transit_${gate}`;
    
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return this.sendSuccess(res, cachedData, "Transit schedule retrieved successfully (cached)");
    }
    
    const data = await this.transitService.getTransitData(gate);
    cache.set(cacheKey, data);
    return this.sendSuccess(res, data, "Transit schedule retrieved successfully");
  };
}
