import { Router } from "express";
import { ChatController } from "../controllers/chatController";
import { asyncErrorWrapper } from "../middleware/asyncErrorWrapper";

const router = Router();
const chatController = new ChatController();

router.post("/", asyncErrorWrapper(chatController.handleChat));

export default router;
