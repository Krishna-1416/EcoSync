import { Router } from "express";
import { TelemetryController } from "../controllers/telemetryController";

const router = Router();
const controller = new TelemetryController();

router.post("/upload", controller.updateTelemetry);
router.get("/", controller.getTelemetry);

export default router;
