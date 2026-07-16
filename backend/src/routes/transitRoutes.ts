import { Router } from "express";
import { TransitController } from "../controllers/transitController";
import { asyncErrorWrapper } from "../middleware/asyncErrorWrapper";

const router = Router();
const transitController = new TransitController();

router.get("/", asyncErrorWrapper(transitController.getTransit));

export default router;
