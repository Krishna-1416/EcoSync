import { Router } from "express";
import chatRoutes from "./chatRoutes";
import transitRoutes from "./transitRoutes";

const router = Router();

router.use("/chat", chatRoutes);
router.use("/transit", transitRoutes);

export default router;
